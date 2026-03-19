<template>
  <div class="relative w-full">
    <input
      type="text"
      class="input pr-9"
      :placeholder="props.placeholder"
      disabled
    />
    <div
      class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground [&>svg]:size-4"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        role="status"
        aria-label="Loading"
        class="animate-spin"
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  placeholder: string;
}>();
</script>

<style scoped></style>
