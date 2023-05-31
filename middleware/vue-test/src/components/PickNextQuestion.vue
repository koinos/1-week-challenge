<template>
  <div style="width: 100%">
    <button @click="pickNextQuestion">Pick next question</button>
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
  name: 'PickNextQuestionButton',
  setup() {
    const lastResponse = ref();
    const lastError = ref();

    const pickNextQuestion = async () => {
      lastResponse.value = null;
      lastError.value = null;

      const { data, error } = await supabase.functions.invoke('pick-next-question');

      lastResponse.value = data;
      lastError.value = error;
    };

    const clearData = () => {
      lastResponse.value = null;
      lastError.value = null;
    };

    return {
      pickNextQuestion,
      clearData,
      lastResponse,
      lastError
    };
  }
});
</script>
