<template>
  <div style="width: 100%">
    <button @click="processResults">Process results</button>
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
  name: 'ProcessResultsButton',
  setup() {
    const lastResponse = ref();
    const lastError = ref();

    const processResults = async () => {
      lastResponse.value = null;
      lastError.value = null;

      const { data, error } = await supabase.functions.invoke('process-results');

      lastResponse.value = data;
      lastError.value = error;
    };

    const clearData = () => {
      lastResponse.value = null;
      lastError.value = null;
    };

    return {
      processResults,
      clearData,
      lastResponse,
      lastError
    };
  }
});
</script>
