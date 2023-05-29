<template>
  <main v-if="activeGame">
    <h1>Active game:</h1>

    <ul>
      <li v-if="startsIn < 0">Started {{ startsInText }} ago</li>
      <li v-else>Starts in {{ startsInText }}</li>
    </ul>

    <ul v-if="activeGame.round === 0">
      <li>Not started</li>
      <li>Players waiting: {{ activeGame.players_remaining }}</li>
    </ul>

    <ul v-if="activeGame.round > 0">
      <li>Round: {{ activeGame.round }}</li>
      <li>Question: {{ activeGame.question }}</li>
      <li>Answer: {{ activeGame.answer ?? '...' }}</li>
      <li>Players remaining: {{ activeGame.players_remaining }}</li>
      <li>Right count: {{ activeGame.right_count }}</li>
      <li>Wrong count: {{ activeGame.wrong_count }}</li>
    </ul>

    <br />

    <div v-if="activeGame.players_remaining > 0">
      <h3 v-if="activeGame.round === 0">Players waiting:</h3>
      <h3 v-else>Players remaining:</h3>
      <ul>
        <li v-for="playerGame in activePlayerGames" :key="playerGame.id">
          {{ playerGame.player_id }}
        </li>
      </ul>
    </div>

    <br />

    <h3 v-if="activeGame.round > 1">Players eliminated:</h3>
    <ul v-if="activeGame.round > 1">
      <li v-for="playerGame in eliminatedPlayerGames" :key="playerGame.id">
        {{ playerGame.player_id }} [{{ playerGame.round }}]
      </li>
    </ul>

    <div v-if="activeGameError">{{ activeGameError }}</div>
    <div v-if="playerGamesError">{{ playerGamesError }}</div>
  </main>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, Ref, ref } from 'vue';
import { supabase } from '../supabase-client.ts';
import { REALTIME_LISTEN_TYPES } from '@supabase/supabase-js';
import { countdown } from '@/utils/countdown.ts';
import { RealtimeChannel } from '@supabase/realtime-js';
import { useRoute } from 'vue-router';
import type { ActiveGame, PlayerGame } from '../../../schema/index.ts';

export default defineComponent({
  name: 'App',
  setup() {
    const route = useRoute();
    const id: Ref<string | undefined> = ref();

    const channel: Ref<RealtimeChannel | undefined> = ref();
    const activeGame: Ref<ActiveGame | undefined> = ref();
    const activeGameError = ref();
    const startsIn: Ref<number | undefined> = ref();
    const startsInText: Ref<string> = ref('');

    const playerGames: Ref<PlayerGame[]> = ref([]);
    const playerGamesError = ref();

    const getActiveGame = async () => {
      const { data, error } = await supabase.from('active_game').select('*').eq('id', id.value);

      if (Array.isArray(data) && data.length > 0) {
        activeGame.value = data[0];
        updateStartTimes();
      } else {
        activeGameError.value = error;
      }
    };

    const getEnrolledPlayers = async () => {
      const { data, error } = await supabase
        .from('player_game')
        .select('*')
        .eq('game_id', id.value);

      if (Array.isArray(data)) {
        playerGames.value = data;
        updateStartTimes();
      } else {
        playerGamesError.value = error;
      }
    };

    const startWatching = () => {
      // // Supabase client setup
      channel.value = supabase
        .channel('schema-db-changes')
        .on(
          `${REALTIME_LISTEN_TYPES.POSTGRES_CHANGES}` as any,
          {
            event: '*',
            schema: 'public',
            table: 'active_game',
            filter: `id=eq.${id.value}`
          } as any,
          (payload) => {
            activeGame.value = (payload as any).new;
          }
        )
        .on(
          `${REALTIME_LISTEN_TYPES.POSTGRES_CHANGES}` as any,
          {
            event: '*',
            schema: 'public',
            table: 'player_game',
            filter: `game_id=eq.${id.value}`
          } as any,
          (payload) => {
            const updatedPlayerGame = (payload as any).new;
            const index = playerGames.value.findIndex((x) => updatedPlayerGame.id === x.id);

            if (-1 === index) {
              playerGames.value.push(updatedPlayerGame);
            } else {
              playerGames.value[index] = updatedPlayerGame;
            }
          }
        )
        .subscribe();
    };

    const updateStartTimes = () => {
      if (activeGame.value?.start_at) {
        startsIn.value = activeGame.value!.start_at - Date.now();
        startsInText.value = countdown(activeGame.value!.start_at);
      }
    };

    onMounted(() => {
      id.value = route.params.id.toString();

      getActiveGame();
      getEnrolledPlayers();

      startWatching();

      setInterval(() => {
        updateStartTimes();
      }, 1000);
    });

    onUnmounted(() => {
      if (channel.value) {
        channel.value?.socket.disconnect();
      }
    });

    return {
      activeGame,
      activeGameError,
      startsIn,
      startsInText,
      playerGames,
      playerGamesError,
      activePlayerGames: computed(() => {
        return playerGames.value.filter((playerGame) => !playerGame.eliminated);
      }),
      eliminatedPlayerGames: computed(() => {
        return playerGames.value.filter((playerGame) => playerGame.eliminated);
      })
    };
  }
});
</script>
