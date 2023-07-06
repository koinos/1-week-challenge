<template>
  <div style="width: 100%">
    <button @click="submitGameStats" :disabled="submitting">
      Simulate Submit Game stats trigger
    </button>
    <button class="clear-button" v-if="lastResponse || lastError" @click="clearData">X</button>

    <br />

    <span v-if="lastResponse" class="error">
      <a
        target="_blank"
        :href="`https://harbinger.koinosblocks.com/tx/${lastResponse.transactionId}`"
        v-if="lastResponse.transactionId"
        >Check tx @Koinosblocks</a
      >
      <br />
      <br />
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
import { FunctionsHttpError } from '@supabase/supabase-js';

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
    const submitting = ref(false);

    const submitGameStats = async () => {
      lastResponse.value = null;
      lastError.value = null;
      submitting.value = true;

      const { data, error } = await supabase.functions.invoke('submit-game-stats', {
        body: {
          gameId: props.gameId
        }
      });

      lastResponse.value = data;
      if (error instanceof FunctionsHttpError) {
        lastError.value = await error.context.json();
      }
    };

    const clearData = () => {
      lastResponse.value = null;
      lastError.value = null;
      submitting.value = false;
    };

    return {
      submitGameStats,
      submitting,
      clearData,
      lastResponse,
      lastError
    };
  }
});
</script>
