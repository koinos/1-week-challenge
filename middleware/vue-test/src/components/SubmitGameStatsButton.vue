<template>
  <div style="width: 100%">
    <button @click="submitGameStats">Simulate Submit Game stats trigger</button>
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
  name: 'SubmitGameStatsButton',
  props: {
    gameId: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const lastResponse = ref();
    const lastError = ref();

    const submitGameStats = async () => {
      lastResponse.value = null;
      lastError.value = null;

      const { data, error } = await supabase.functions.invoke('submit-game-stats', {
        body: {
          gameId: props.gameId
        }
      });

      lastResponse.value = data;
      lastError.value = error;
    };

    const clearData = () => {
      lastResponse.value = null;
      lastError.value = null;
    };

    return {
      submitGameStats,
      clearData,
      lastResponse,
      lastError
    };
  }
});
</script>
