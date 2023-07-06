<template>
  <div style="width: 100%">
    <button @click="submitAnswer()">{{ answer }}</button>
    <button class="clear-button" v-if="lastError" @click="clearData">X</button>

    <br />

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
  name: 'SubmitAnswerButton',
  props: {
    gameId: {
      type: String,
      required: true
    },
    playerId: {
      type: String,
      required: true
    },
    answer: {
      type: Boolean,
      required: true
    },
    disabled: {
      type: Boolean,
      required: false
    }
  },
  setup(props) {
    const lastError = ref();

    const submitAnswer = async () => {
      lastError.value = null;

      const { error } = await supabase.functions.invoke('submit-answer', {
        body: {
          gameId: props.gameId,
          playerId: props.playerId,
          answer: props.answer
        }
      });

      if (error instanceof FunctionsHttpError) {
        lastError.value = await error.context.json();
      }
    };

    const clearData = () => {
      lastError.value = null;
    };

    return {
      submitAnswer,
      clearData,
      lastError
    };
  }
});
</script>
