<template>
  <div class="w-full h-full m-0 p-0 font-display">
    <ThemeSwitcher class="fixed top-10 right-10" side="left" />
    <div class="w-full h-full m-0 p-10 flex flex-col gap-5">
      <Header
        title="Inspect the School"
        subtitle="New York City public schools are run by rats and junk. Be the hero janitor and save the city."
      />

      <!-- School selector -->
      <div class="w-128 m-0 p-0 flex gap-5">
        <label for="schools-combobox" class="my-auto shrink-0"
          >Select a school</label
        >
        <Combobox
          v-if="schools.length"
          id="schools-combobox"
          placeholder="Search schools…"
          :items="schools"
        />
        <InputSpinner v-else placeholder="Search schools…" />
        <button class="btn">Go!</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCurrentInstance, onMounted, ref, computed } from "vue";

import type { Inspection } from "@/types/inspection";

import { useTheme } from "@/composables/useTheme";

import ThemeSwitcher from "@/components/ThemeSwitcher.vue";
import Header from "@/components/Header.vue";
import Combobox from "@/components/Combobox.vue";
import InputSpinner from "@/components/InputSpinner.vue";

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

const schools = computed(() => [
  ...new Set(inspections.value.map((i) => i.schoolname)),
]);

onMounted(() => {
  init();
  fetchData();
});
</script>

<style scoped></style>
