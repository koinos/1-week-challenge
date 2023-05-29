<template>
  <main>
    <h1>Active games</h1>

    <ul>
      <li v-for="activeGame in activeGames" :key="activeGame.id">
        <router-link :to="{ name: 'game', params: { id: activeGame.id } }">
          {{ activeGame.id }}
        </router-link>
        <ul>
          <li v-if="activeGame.starts_in < 0">Started {{ activeGame.starts_in_text }} ago</li>
          <li v-else>Starts in {{ activeGame.starts_in_text }}</li>
          <li v-if="activeGame.round > 0">
            Round: {{ activeGame.round > 0 ? activeGame.round : 'Not started' }}
          </li>
          <li v-if="activeGame.round > 0">Players remaining: {{ activeGame.players_remaining }}</li>
          <li v-if="activeGame.round === 0">Players waiting: {{ activeGame.players_remaining }}</li>
          <li v-if="activeGame.round > 0">Right count: {{ activeGame.right_count }}</li>
          <li v-if="activeGame.round > 0">Wrong count: {{ activeGame.wrong_count }}</li>
        </ul>
      </li>
    </ul>
    <div v-if="activeGamesError">{{ activeGamesError }}</div>
  </main>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, Ref, ref } from 'vue';
import { supabase } from '../supabase-client.ts';
import { REALTIME_LISTEN_TYPES } from '@supabase/supabase-js';
import { countdown } from '@/utils/countdown.ts';
import { RealtimeChannel } from '@supabase/realtime-js';

export default defineComponent({
  name: 'App',
  setup() {
    const channel: Ref<RealtimeChannel | undefined> = ref();
    const activeGames: Ref<
      {
        id: string;
        start_at: number;
        starts_in: number;
        starts_in_text: string;
        round?: number;
        players_remaining: number;
        right_count: number;
        wrong_count: number;
      }[]
    > = ref([]);
    const activeGamesError = ref();

    const getActiveGames = async () => {
      const { data, error } = await supabase.from('active_game').select('*');

      if (Array.isArray(data)) {
        activeGames.value = data;
        updateStartTimes();
      } else {
        activeGamesError.value = error;
      }
    };

    const watchForNewGames = () => {
      // // Supabase client setup
      channel.value = supabase
        .channel('schema-db-changes')
        .on(
          `${REALTIME_LISTEN_TYPES.POSTGRES_CHANGES}` as any,
          {
            event: '*',
            schema: 'public',
            table: 'active_game'
          } as any,
          (payload) => {
            const updatedGame = (payload as any).new;
            const index = activeGames.value.findIndex((x) => updatedGame.id === x.id);

            if (-1 === index) {
              activeGames.value.push(updatedGame);
            } else {
              activeGames.value[index] = updatedGame;
            }
          }
        )
        .subscribe();
    };

    const updateStartTimes = () => {
      activeGames.value.forEach((activeGame) => {
        activeGame.starts_in = activeGame.start_at - Date.now();
        activeGame.starts_in_text = countdown(activeGame.start_at);
      });
    };

    onMounted(() => {
      getActiveGames();
      watchForNewGames();

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
      activeGames,
      activeGamesError
    };
  }
});
</script>
