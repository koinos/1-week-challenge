<template>
  <div style="width: 100%">
    <button @click="joinGame()">{{ playerId }}</button>
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
  name: 'JoinGameButton',
  props: {
    gameId: {
      type: String,
      required: true
    },
    playerId: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const lastError = ref();

    const joinGame = async () => {
      lastError.value = null;

      const { error } = await supabase.functions.invoke('join-game', {
        body: {
          gameId: props.gameId,
          playerId: props.playerId
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
      joinGame,
      clearData,
      lastError
    };
  }
});
</script>
