<template>
  <RouterLink to="/">Home</RouterLink>

  <br />
  <br />
  <br />

  <div style="width: 50%; float: left">
    <h2>Simulate cronjobs</h2>

    <schedule-games-button />
    <pick-next-questions-button />
    <process-results-button />
    <cleanup-active-games-button />

    <br />

    <h2>Add game</h2>

    <add-game-button :mins-from-now="1" />
    <add-game-button :mins-from-now="2" />
    <add-game-button :mins-from-now="5" />
    <add-game-button :mins-from-now="15" />

    <br />

    <a
      href="https://harbinger.koinosblocks.com/address/16QVzHspCTwzgqdqiAngYCNpdHGVZQP7cg"
      target="_blank"
      >Check contract @Koinosblocks</a
    >
  </div>

  <div style="width: 50%; float: left"><RouterView /></div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import ScheduleGamesButton from '@/components/ScheduleGamesButton.vue';
import PickNextQuestionsButton from '@/components/PickNextQuestionsButton.vue';
import ProcessResultsButton from '@/components/ProcessResultsButton.vue';
import AddGameButton from '@/components/AddGameButton.vue';
import CleanupActiveGamesButton from '@/components/CleanupActiveGamesButton.vue';
</script>

<style>
header {
  line-height: 1.5;
  max-height: 100vh;
}

button {
  background: #6f00f6;
  padding: 0.5rem 0.25rem;
  margin: 0.5rem 0;
  color: #ffffff;
  border-radius: 4px;
}

.clear-button {
  background: transparent;
  color: #222222;
  padding: 0.25rem;
  margin-left: 1rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    //display: flex;
    //place-items: center;
    //padding-right: calc(var(--section-gap) / 2);
  }

  header .wrapper {
    //display: flex;
    //place-items: flex-start;
    //flex-wrap: wrap;
  }

  nav {
    //text-align: left;
    //margin-left: -1rem;
    //font-size: 1rem;

    //padding: 1rem 0;
    //margin-top: 1rem;
  }
}
</style>
