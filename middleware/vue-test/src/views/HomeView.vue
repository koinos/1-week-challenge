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
          <li v-if="activeGame.round > 0">Right count: {{ activeGame.right_count }}</li>
          <li v-if="activeGame.round > 0">Wrong count: {{ activeGame.wrong_count }}</li>
        </ul>
      </li>
    </ul>
    <div v-if="activeGamesError">{{ activeGamesError }}</div>
  </main>
</template>

<script lang="ts">
import { defineComponent, onMounted, Ref, ref } from 'vue';
import { supabase } from '../supabase-client.ts';
import { REALTIME_LISTEN_TYPES } from '@supabase/supabase-js';
import { countdown } from '@/utils/countdown.ts';

export default defineComponent({
  name: 'App',
  setup() {
    // const session = ref(null)
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
      const channel = supabase
        .channel('schema-db-changes')
        .on(
          `${REALTIME_LISTEN_TYPES.POSTGRES_CHANGES}` as any,
          {
            event: '*',
            schema: 'public'
          } as any,
          (payload) => {
            console.log({ payload });
            activeGames.value = {
              ...activeGames.value,
              ...(payload as any)
            };
          }
        )
        .subscribe();

      console.log({ channel });
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

    return {
      activeGames,
      activeGamesError
    };
  }
});
</script>
