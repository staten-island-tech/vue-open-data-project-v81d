import { ref, computed } from "vue";
import { defineStore } from "pinia";

import type { Inspection } from "@/types/inspection";

export const useDataStore = defineStore(
  "data",
  () => {
    const inspections = ref<Inspection[]>([]);
    const selectedSchool = ref<string>("");

    const schools = computed<string[]>(() => [
      ...new Set(inspections.value.map((i) => i.schoolname as string)),
    ]);

    const selectedInspections = computed<Inspection[]>(() =>
      inspections.value.filter((i) => i.schoolname === selectedSchool.value),
    );

    const inspectionCodes = computed<string[]>(() =>
      selectedInspections.value
        .filter((i) => i.violationdescription && i.code)
        .map((i) => i.code as string),
    );

    const inspectionViolations = computed<string[]>(() =>
      selectedInspections.value
        .filter((i) => i.violationdescription)
        .map((i) => i.violationdescription as string),
    );

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

    return {
      inspections,
      selectedSchool,
      schools,
      selectedInspections,
      inspectionCodes,
      inspectionViolations,
      fetchData,
    };
  },
  {
    persist: {
      storage: sessionStorage,
      pick: ["selectedSchool"],
    },
  },
);
