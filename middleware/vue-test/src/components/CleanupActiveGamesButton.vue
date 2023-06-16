<template>
  <div style="width: 100%">
    <button @click="cleanupActiveGames">Clean Active Games</button>
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
import { FunctionsHttpError } from '@supabase/supabase-js';

export default defineComponent({
  name: 'CleanupActiveGamesButton',
  setup() {
    const lastResponse = ref();
    const lastError = ref();

    const cleanupActiveGames = async () => {
      lastResponse.value = null;
      lastError.value = null;

      const { data, error } = await supabase.functions.invoke('cleanup-active-games');

      lastResponse.value = data;
      if (error instanceof FunctionsHttpError) {
        lastError.value = await error.context.json();
      }
    };

    const clearData = () => {
      lastResponse.value = null;
      lastError.value = null;
    };

    return {
      cleanupActiveGames,
      clearData,
      lastResponse,
      lastError
    };
  }
});
</script>
