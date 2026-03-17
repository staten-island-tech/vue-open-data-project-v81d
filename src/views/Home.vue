<template>
  <ThemeSwitcher class="fixed top-10 right-10" side="left" />
  <div class="w-full h-full m-0 p-10 flex flex-col gap-10">
    <h1 class="text-4xl font-display font-bold">Inspect the School</h1>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useTheme } from "@/composables/useTheme";
import ThemeSwitcher from "@/components/ThemeSwitcher.vue";

const { init } = useTheme();

onMounted(() => {
  init();
});
</script>

<style scoped></style>
