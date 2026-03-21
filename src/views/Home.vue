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
          v-if="schools.length"
          class="flex-1"
          id="schools-combobox"
          placeholder="Search schools…"
          :items="schools as string[]"
          @get="onSchoolSelected"
        />
        <InputSpinner v-else placeholder="Loading schools…" />

        <button
          class="btn"
          :disabled="!schools.length"
          @click="dialogShow = true"
        >
          Go!
        </button>
      </div>

      <!-- School map -->
      <iframe height="500" :src="mapLink" class="rounded-lg"></iframe>

      <!-- The info dialogue -->
      <ScrollableDialog
        :open="dialogShow"
        :title="selectedSchool"
        :description="selectedInspections[0]?.site_type ?? 'Unknown Site'"
        :buttonLabel="
          inspectionCodes.length ? 'Clean It!' : 'Continue Searching'
        "
        :buttonCallback="onCleanClicked"
        @close="dialogShow = false"
      >
        <template v-if="inspectionViolations.length">
          <p>
            This school's cafeteria has
            {{ inspectionViolations.length }} recorded violations:
          </p>
          <Item
            v-for="(code, i) in inspectionCodes"
            :key="i"
            :title="code!"
            :description="inspectionViolations[i]!"
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

import type { Inspection } from "@/types/inspection";

import { useTheme } from "@/composables/useTheme";

import ThemeSwitcher from "@/components/ThemeSwitcher.vue";
import Header from "@/components/Header.vue";
import Combobox from "@/components/Combobox.vue";
import InputSpinner from "@/components/InputSpinner.vue";
import ScrollableDialog from "@/components/ScrollableDialog.vue";
import Item from "@/components/Item.vue";

const { init } = useTheme();

const inspections = ref<Inspection[]>([]);
const selectedSchool = ref<string>("");
const dialogShow = ref<boolean>(false);

/*
 * Gets all the data from the DOHMH School Cafeteria Inspections (2020-Present) API endpoint.
 * https://data.cityofnewyork.us/Health/DOHMH-School-Cafeteria-Inspections-2020-Present-/5ery-qagt/about_data
 */
async function fetchData() {
  try {
    const response = await fetch(import.meta.env.VITE_API_ENDPOINT);
    const data = await response.json();
    inspections.value = data;
  } catch (e) {
    console.error(e);
  }
}

function onSchoolSelected(value: string) {
  selectedSchool.value = value;
}

/*
 * Everything that should be done when the info dialog button is clicked.
 * Uses another if-statement to check if the school should be cleaned
 * because I have no idea how to link the one inside the child component
 * to this function. :/
 */
function onCleanClicked() {
  if (inspectionCodes.value.length) console.log("Clean the school.");
  else dialogShow.value = false;
}

// A whole bunch of computed values. Quite messy.
const schools = computed(() => [
  ...new Set(inspections.value.map((i) => i.schoolname)),
]);

const selectedInspections = computed(() =>
  inspections.value.filter((i) => i.schoolname === selectedSchool.value),
);

const inspectionCodes = computed(() =>
  // So annoying how I can't even add a condition directly to the `map` call
  selectedInspections.value
    .filter((i) => i.violationdescription)
    .map((i) => i.code),
);

const inspectionViolations = computed(() =>
  selectedInspections.value
    .filter((i) => i.violationdescription)
    .map((i) => i.violationdescription),
);

// Probably the messiest one of all
const mapLink = computed(() => {
  const mapUrl = import.meta.env.VITE_MAP_URL;

  const i: Inspection | undefined = selectedInspections.value[0];
  if (!i) return mapUrl;

  const delta = 0.001;
  const long = Number(i.longitude);
  const lat = Number(i.latitude);

  const bbox = `${long - delta},${lat - delta},${long + delta},${lat + delta}`; // the size of the view box
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

<!-- Most useful scoped style block ever! -->
<style scoped></style>
