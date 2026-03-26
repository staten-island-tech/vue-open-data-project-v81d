<template>
  <div class="relative w-48">
    <img class="pointer-events-none" :src="ratholeBack" />
    <button
      class="overflow-hidden absolute z-10 flex justify-center items-end-safe left-1/2 top-0 -translate-x-1/2 h-18"
      @click="kill"
    >
      <img
        class="pointer-events-none transition-transform duration-500"
        :class="props.ratOut ? 'translate-y-0' : 'translate-y-full'"
        :src="ratImage"
      />
    </button>
    <img class="pointer-events-none relative z-20" :src="ratholeFront" />
  </div>
</template>

<script setup lang="ts">
import { watch, ref, computed } from "vue";

import cursorHoverImage from "@/assets/images/cursor-hover.png";
import cursorActiveImage from "@/assets/images/cursor-active.png";
import ratholeBack from "@/assets/images/rathole-back.png";
import ratholeFront from "@/assets/images/rathole-front.png";
import rat from "@/assets/images/rat.png";
import ratDead from "@/assets/images/rat-dead.png";

const props = defineProps<{
  index: number;
  ratOut: boolean;
}>();

const emit = defineEmits<{
  die: [index: number];
}>();

const dead = ref<boolean>(false);

const cursorHover = ref(`url('${cursorHoverImage}'), auto`);
const cursorActive = ref(`url('${cursorActiveImage}'), auto`);

const ratImage = computed(() => (dead.value ? ratDead : rat));

function kill() {
  if (!props.ratOut) return;
  dead.value = true;
  emit("die", props.index);
}

watch(
  () => props.ratOut,
  (out) => {
    if (out) dead.value = false;
  },
);
</script>

<style scoped>
button {
  cursor: v-bind(cursorHover);
}

button:active {
  cursor: v-bind(cursorActive);
}
</style>
