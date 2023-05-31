<template>
  <div style="width: 100%">
    <button @click="scheduleGames">Simulate Schedule Games Cronjob</button>
    <button class="clear-button" v-if="lastResponse || lastError" @click="clearData">X</button>

    <br />

    <span v-if="lastResponse" class="error">
      {{ lastResponse }}
    </span>

    <span v-if="lastError" class="error">
      {{ lastError }}
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { supabase } from '../supabase-client.ts';

export default defineComponent({
  name: 'ScheduleGamesButton',
  setup() {
    const lastResponse = ref();
    const lastError = ref();

    const scheduleGames = async () => {
      lastResponse.value = null;
      lastError.value = null;

      const { data, error } = await supabase.functions.invoke('schedule-games');

      lastResponse.value = data;
      lastError.value = error;
    };

    const clearData = () => {
      lastResponse.value = null;
      lastError.value = null;
    };

    return {
      scheduleGames,
      clearData,
      lastResponse,
      lastError
    };
  }
});
</script>
