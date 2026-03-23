<template>
  <div class="w-full h-full m-0 p-0 font-display">
    <ThemeSwitcher class="fixed top-10 right-10" side="left" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

import { useTheme } from "@/composables/useTheme";

import ThemeSwitcher from "@/components/ThemeSwitcher.vue";

const route = useRoute();
const { init } = useTheme();

const school = ref<string>(decodeURIComponent(route.params.school as string));

onMounted(() => {
  init();
});
</script>

<style scoped></style>
