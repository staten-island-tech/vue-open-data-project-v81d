<template>
  <div class="w-full h-full m-0 p-0 font-display">
    <ThemeSwitcher class="fixed top-10 right-10" side="left" />
    <div class="w-full h-full m-0 p-10 flex flex-col gap-5"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

import { useTheme } from "@/composables/useTheme";
import { useDataStore } from "@/stores/useDataStore";

import ThemeSwitcher from "@/components/ThemeSwitcher.vue";

const { init } = useTheme();

const dataStore = useDataStore();

onMounted(() => {
  init();
});
</script>

<style scoped></style>
