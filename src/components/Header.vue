<template>
  <div>
    <h1 class="text-4xl font-bold">{{ props.title }}</h1>
    <h2 class="text-xl">{{ props.subtitle }}</h2>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string;
  subtitle: string;
}>();
</script>

<style scoped></style>
