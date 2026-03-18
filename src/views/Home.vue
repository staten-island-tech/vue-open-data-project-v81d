<template>
  <div class="w-full h-full m-0 p-0 font-display">
    <ThemeSwitcher class="fixed top-10 right-10" side="left" />
    <div class="w-full h-full m-0 p-10 flex flex-col gap-5">
      <Header
        title="Inspect the School"
        subtitle="New York City public schools are run by rats and junk. Be the hero janitor and save the city."
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCurrentInstance, onMounted, ref } from "vue";

import type { Inspection } from "@/types/inspection";

import { useTheme } from "@/composables/useTheme";

import ThemeSwitcher from "@/components/ThemeSwitcher.vue";
import Header from "@/components/Header.vue";

const instance = getCurrentInstance();
const { init } = useTheme();

const inspections = ref<Inspection[]>([]);

async function fetchData() {
  try {
    const apiEndpoint =
      instance?.appContext.config.globalProperties.$apiEndpoint;
    const response = await fetch(apiEndpoint);
    const data = await response.json();
    inspections.value = data;
  } catch (_) {}
}

onMounted(() => {
  init();
  fetchData();
});
</script>

<style scoped></style>
