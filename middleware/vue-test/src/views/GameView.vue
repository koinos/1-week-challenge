<template>
  <main v-if="activeGame">
    <h1>Active game:</h1>

    <ul>
      <li v-if="startsIn < 0">Started {{ startsInText }} ago</li>
      <li v-else>Starts in {{ startsInText }}</li>
    </ul>

    <ul v-if="startsIn > 0">
      <li>Not started</li>
      <li>Players waiting: {{ activeGame.players_remaining }}</li>
      <li>
        Join with player:
        <ul>
          <li v-for="eligiblePlayerId in eligiblePlayerIds" :key="eligiblePlayerId">
            <join-game-button :player-id="eligiblePlayerId" :game-id="activeGame.id" />
          </li>
        </ul>
      </li>
    </ul>

    <ul v-if="startsIn < 0">
      <li>Round: {{ activeGame.round }}</li>
      <li>Question: {{ activeGame.question }}</li>
      <li>Answer: {{ activeGame.answer ?? '...' }}</li>
      <li v-if="activeGame.real_fact_if_fiction">
        Real answer: {{ activeGame.real_fact_if_fiction ?? '...' }}
      </li>

      <li>Participants: {{ activeGame.participant_count }}</li>
      <li v-if="!activeGame.winner_id">Players remaining: {{ activeGame.players_remaining }}</li>
      <li v-if="!activeGame.winner_id">Right count: {{ activeGame.right_count }}</li>
      <li v-if="!activeGame.winner_id">Wrong count: {{ activeGame.wrong_count }}</li>
    </ul>

    <br />

    <div v-if="activeGame.ended && !activeGame.winner_id">
      <h3 style="font-weight: bold; color: red">Game has ended without a winner</h3>
    </div>

    <div v-if="activeGame.winner_id">
      <h3>Winner:</h3>
      <ul>
        <li style="font-weight: bold; color: green">
          {{ activeGame.winner_id }}
        </li>
        <li><submit-game-stats-button :game-id="activeGame.id" /></li>
      </ul>
    </div>

    <div v-if="!activeGame.winner_id && !activeGame.ended">
      <h3 v-if="activeGame.round === 0">Players waiting:</h3>
      <h3 v-else>Players remaining:</h3>
      <ul>
        <li v-for="playerGame in activePlayerGames" :key="playerGame.id">
          {{ playerGame.player_id }}

          <submit-answer-button
            v-if="activeGame.round > 0"
            :disabled="activeGame.answer != null"
            :answer="true"
            :player-id="playerGame.player_id"
            :game-id="playerGame.game_id"
          />

          <submit-answer-button
            v-if="activeGame.round > 0"
            :disabled="activeGame.answer != null"
            :answer="false"
            :player-id="playerGame.player_id"
            :game-id="playerGame.game_id"
          />
        </li>
      </ul>
    </div>

    <br />

    <div v-if="eliminatedPlayerGames.length > 0">
      <h3>Players eliminated:</h3>
      <ul>
        <li v-for="playerGame in eliminatedPlayerGames" :key="playerGame.id">
          {{ playerGame.player_id }} [Round: {{ playerGame.round }}]
          <span v-if="!playerGame.eliminated">Timed-out</span>
        </li>
      </ul>
    </div>

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
import JoinGameButton from '@/components/JoinGameButton.vue';
import { playerIds } from '@/components/player-ids.ts';
import SubmitAnswerButton from '@/components/SubmitAnswerButton.vue';
import SubmitGameStatsButton from '@/components/SubmitGameStatsButton.vue';

export default defineComponent({
  name: 'App',
  components: { SubmitGameStatsButton, SubmitAnswerButton, JoinGameButton },
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
      eligiblePlayerIds: computed(() => {
        return playerIds.filter(
          (playerId) => !playerGames.value.find((playerGame) => playerGame.player_id === playerId)
        );
      }),
      activePlayerGames: computed(() => {
        return playerGames.value.filter(
          (playerGame) => !playerGame.eliminated && playerGame.round >= activeGame.value?.round
        );
      }),
      eliminatedPlayerGames: computed(() => {
        return playerGames.value.filter(
          (playerGame) => playerGame.eliminated || playerGame.round < activeGame.value?.round
        );
      })
    };
  }
});
</script>
