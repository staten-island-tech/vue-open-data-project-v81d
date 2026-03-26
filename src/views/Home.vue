<!--
  Have fun reading this convoluted mess of code!

  Decided to make more comments this time for the humor and so
  I don't go crazy trying to find something I need to change.

  I also realized I haven't used a single `let` variable
  throughout this entire project (so far).
-->
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
          v-if="dataStore.schools.length"
          class="flex-1"
          id="schools-combobox"
          placeholder="Search schools…"
          :items="dataStore.schools as string[]"
          @get="onSchoolSelected"
        />
        <InputSpinner v-else placeholder="Loading schools…" />

        <button
          class="btn"
          :disabled="!dataStore.schools.length"
          @click="dialogShow = true"
        >
          Go!
        </button>
      </div>

      <div class="flex gap-10 max-w-300">
        <!-- School map -->
        <iframe :src="mapLink" class="flex-1 rounded-lg"></iframe>

        <!-- Point density heatmap -->
        <PointDensityMap
          v-if="boroughCoords.length"
          :locationData="boroughCoords"
          :highlightLocation="[
            Number(dataStore.selectedInspections[0]?.longitude),
            Number(dataStore.selectedInspections[0]?.latitude),
          ]"
          :key="dataStore.selectedSchool"
          class="overflow-hidden flex-1 rounded-lg bg-blue-200"
        />
      </div>

      <!-- The info dialogue -->
      <ScrollableDialog
        :open="dialogShow"
        :title="dataStore.selectedSchool"
        :description="
          dataStore.selectedInspections[0]?.site_type ?? 'Unknown Site'
        "
        :buttonLabel="
          dataStore.inspectionCodes.length ? 'Clean It!' : 'Continue Searching'
        "
        :buttonCallback="onCleanClicked"
        @close="dialogShow = false"
      >
        <template v-if="dataStore.inspectionViolations.length">
          <p>
            This school's cafeteria has
            {{ dataStore.inspectionViolations.length }} recorded violations:
          </p>
          <Item
            v-for="(code, i) in dataStore.inspectionCodes"
            :key="i"
            :title="code!"
            :description="dataStore.inspectionViolations[i]!"
          />
          <p>Would you like to clean this school's cafeteria?</p>
        </template>
        <p v-else>
          This school has never received a cafeteria violation; it is very clean
          already. No need to clean it!
        </p>
      </ScrollableDialog>
    </div>
  </div>
</template>

<!-- Damn. This is the longest script I wrote in any singular Vue file. -->
<script setup lang="ts">
import { onMounted, watch, ref, computed } from "vue";
import { useRouter } from "vue-router";

import type { Inspection } from "@/types/inspection";

import { useTheme } from "@/composables/useTheme";
import { useDataStore } from "@/stores/useDataStore";

import ThemeSwitcher from "@/components/ThemeSwitcher.vue";
import Header from "@/components/Header.vue";
import Combobox from "@/components/Combobox.vue";
import InputSpinner from "@/components/InputSpinner.vue";
import ScrollableDialog from "@/components/ScrollableDialog.vue";
import Item from "@/components/Item.vue";
import PointDensityMap from "@/components/PointDensityMap.vue";

const router = useRouter();
const { init } = useTheme();

const dataStore = useDataStore();
const dialogShow = ref<boolean>(false);

function onSchoolSelected(value: string) {
  dataStore.selectedSchool = value;
}

/*
 * Everything that should be done when the info dialog button is clicked.
 * Uses another if-statement to check if the school should be cleaned
 * because I have no idea how to link the one inside the child component
 * to this function. :/
 */
function onCleanClicked() {
  if (dataStore.inspectionCodes.length) router.push("inspect");
  else dialogShow.value = false;
}

const mapLink = computed(() => {
  const mapUrl = import.meta.env.VITE_MAP_URL;

  const i: Inspection | undefined = dataStore.selectedInspections[0];
  if (!i) return mapUrl;

  const delta = 0.001;
  const long = Number(i.longitude);
  const lat = Number(i.latitude);

  const bbox = `${long - delta},${lat - delta},${long + delta},${lat + delta}`; // the size of the view box
  return `${mapUrl}?bbox=${bbox}&layer=mapnik&marker=${i.latitude},${i.longitude}`;
});

const boroughCoords = computed<[number, number][]>(() => {
  return dataStore.inspections
    .filter(
      (i) =>
        i.borough === dataStore.selectedInspections[0]?.borough &&
        Number(i.longitude) !== 0 &&
        !isNaN(Number(i.longitude)) &&
        Number(i.latitude) !== 0 &&
        !isNaN(Number(i.latitude)),
    )
    .map((i) => [Number(i.longitude), Number(i.latitude)]);
});

onMounted(() => {
  init();
  if (!dataStore.inspections.length) dataStore.fetchData();
});

watch(
  () => dataStore.schools,
  (value) => {
    if (value.length && !dataStore.selectedSchool)
      dataStore.selectedSchool = value[0] ?? "";
  },
  { immediate: true, deep: true },
);
</script>

<!-- Most useful scoped style block ever! -->
<style scoped></style>
