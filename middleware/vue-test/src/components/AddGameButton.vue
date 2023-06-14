<template>
  <div style="width: 100%">
    <button @click="scheduleGames">Add new Game in {{ minsFromNow }} mins</button>
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
  name: 'AddGameButton',
  props: {
    minsFromNow: {
      type: Number,
      required: false,
      default: 2
    }
  },
  setup(props) {
    const lastResponse = ref();
    const lastError = ref();

    const scheduleGames = async () => {
      lastResponse.value = null;
      lastError.value = null;

      /**
       * Insert new active_game for app to watch realtime
       */
      // Round to get exact minute
      var coeff = 1000 * 60;
      var date = Date.now() + 60000 * props.minsFromNow;
      var startAt = new Date(Math.round(date / coeff) * coeff).getTime();

      const { data, error } = await supabase
        .from('game')
        .insert({
          start_at: startAt,
          active: 0,
          rewards: 5000
        })
        .select()
        .single();

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
