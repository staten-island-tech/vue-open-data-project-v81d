<template>
  <div
    class="container flex flex-col justify-center items-center text-center gap-10 p-10 rounded-4xl bg-amber-900"
  >
    <!-- Rats remaining label -->
    <h2 v-if="ratsAlive >= 1" class="text-2xl font-bold text-orange-100">
      {{ ratsAlive }} rats remaining
    </h2>
    <h2 v-else-if="ratsAlive === 1" class="text-2xl font-bold text-orange-100">
      1 rat remaining
    </h2>
    <h2 v-else class="text-2xl font-bold text-orange-100">
      Congratulations! You killed all the rats!
    </h2>

    <div class="flex flex-wrap justify-center gap-10">
      <RatHole
        v-for="i in 9"
        :key="i"
        :index="i - 1"
        :ratOut="ratStates[i - 1] ?? false"
        @die="onDie"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

import RatHole from "@/components/RatHole.vue";

import cursorImage from "@/assets/images/cursor.png";

const props = defineProps<{
  countdown: number;
  rats: number;
  decreaseBy: number;
  minPopOutTime: number;
  maxPopOutTime: number;
}>();

const countdown = ref<number>(props.countdown);
const ratsAlive = ref<number>(props.rats);
const ratStates = ref<boolean[]>([]);

const cursor = ref(`url('${cursorImage}'), auto`);

function onDie(index: number) {
  ratsAlive.value--;
  ratStates.value[index] = false;
}

function startCountdown() {
  const interval = setInterval(() => {
    if (--countdown.value <= 0) clearInterval(interval);
  }, 1000);
}

function startGameLoop() {
  (function loop() {
    if (ratsAlive.value <= 0) return;

    const delay =
      props.minPopOutTime + Math.round(Math.random() * props.maxPopOutTime);

    setTimeout(() => {
      if (ratsAlive.value <= 0) return;

      if (Math.random() < 0.5) {
        const chosen = Math.floor(Math.random() * 9);
        ratStates.value = [...Array(props.rats)].map((_, i) => i === chosen);
      }

      loop();
    }, delay);
  })();
}

onMounted(() => {
  startCountdown();
  startGameLoop();
});
</script>

<style scoped>
.container {
  cursor: v-bind(cursor);
}
</style>
