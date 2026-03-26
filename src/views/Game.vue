<template>
  <div class="w-full h-full m-0 p-0 font-display">
    <ThemeSwitcher class="fixed top-10 right-10" side="left" />
    <div class="w-full h-full m-0 p-10 flex flex-col gap-10">
      <Header
        :title="`Cleaning ${dataStore.selectedSchool}`"
        :subtitle="`This school has ${rats || '…'} violations. Catch all the rats before it's too late!`"
      />
      <div class="w-full flex flex-col lg:flex-row items-center gap-10">
        <WhackARat
          class="w-full h-full"
          v-if="rats"
          :countdown="3"
          :rats="rats"
          :decreaseBy="1"
          :minPopOutTime="500"
          :maxPopOutTime="1000"
        />
        <div
          class="flex justify-center items-center p-10 w-full h-full rounded-4xl bg-orange-950"
        >
          <BarGraph
            class="w-[90%] h-[90%] text-red-100"
            :data="dataStore.inspectionCodes"
            xAxisLabel="Inspection Code"
            yAxisLabel="Instances"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue";

import { useTheme } from "@/composables/useTheme";
import { useDataStore } from "@/stores/useDataStore";

import ThemeSwitcher from "@/components/ThemeSwitcher.vue";
import Header from "@/components/Header.vue";
import WhackARat from "@/components/WhackARat.vue";
import BarGraph from "@/components/BarGraph.vue";

const { init } = useTheme();

const dataStore = useDataStore();

const rats = computed<number>(() => dataStore.inspectionViolations.length);

onMounted(() => {
  init();
  if (!dataStore.inspections.length) dataStore.fetchData();
});
</script>

<style scoped></style>
