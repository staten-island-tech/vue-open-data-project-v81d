<template>
  <div class="w-full h-full m-0 p-0 font-display">
    <ThemeSwitcher class="fixed top-10 right-10" side="left" />
    <div class="w-full h-full m-0 p-10 flex flex-col gap-5">
      <Header
        title="Inspect the School"
        subtitle="New York City public schools are run by rats and junk. Be the hero janitor and save the city."
      />

      <!-- School selector -->
      <div class="max-w-192 m-0 p-0 flex gap-5">
        <label for="schools-combobox" class="label shrink-0"
          >Select a school</label
        >

        <Combobox
          v-if="schools.length"
          class="flex-1"
          id="schools-combobox"
          placeholder="Search schools…"
          :items="schools"
          @get="onSchoolSelected"
        />
        <InputSpinner v-else placeholder="Search schools…" />

        <button class="btn">Go!</button>
      </div>

      <!-- School map -->
      <iframe height="500" :src="mapLink" class="rounded-lg"></iframe>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCurrentInstance, onMounted, watch, ref, computed } from "vue";

import type { Inspection } from "@/types/inspection";

import { useTheme } from "@/composables/useTheme";

import ThemeSwitcher from "@/components/ThemeSwitcher.vue";
import Header from "@/components/Header.vue";
import Combobox from "@/components/Combobox.vue";
import InputSpinner from "@/components/InputSpinner.vue";

const instance = getCurrentInstance();
const { init } = useTheme();

const inspections = ref<Inspection[]>([]);
const selectedSchool = ref<string>("");

async function fetchData() {
  try {
    const apiEndpoint =
      instance?.appContext.config.globalProperties.$apiEndpoint;
    const response = await fetch(apiEndpoint);
    const data = await response.json();
    inspections.value = data;
  } catch (_) {}
}

function onSchoolSelected(value: string) {
  selectedSchool.value = value;
}

const schools = computed(() => [
  ...new Set(inspections.value.map((i) => i.schoolname)),
]);

const selectedInspection = computed(() =>
  inspections.value.find((i) => i.schoolname === selectedSchool.value),
);

const mapLink = computed(() => {
  const mapUrl = instance?.appContext.config.globalProperties.$mapUrl;

  const i = selectedInspection.value;
  if (!i) return mapUrl;

  const delta = 0.001;
  const long = Number(i.longitude);
  const lat = Number(i.latitude);

  const bbox = `${long - delta},${lat - delta},${long + delta},${lat + delta}`;
  return `${mapUrl}?bbox=${bbox}&layer=mapnik&marker=${i.latitude},${i.longitude}`;
});

onMounted(() => {
  init();
  fetchData();
});

watch(
  schools,
  (value) => {
    if (value.length) {
      selectedSchool.value = value[0] ?? "";
    }
  },
  { immediate: true },
);
</script>

<style scoped></style>
