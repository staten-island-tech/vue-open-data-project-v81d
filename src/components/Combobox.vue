<template>
  <div id="select-165800" class="select w-full">
    <button
      type="button"
      class="btn-outline w-full"
      id="select-165800-trigger"
      aria-haspopup="listbox"
      aria-expanded="false"
      aria-controls="select-165800-listbox"
    >
      <span class="truncate"></span>

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
        class="lucide lucide-chevrons-up-down-icon lucide-chevrons-up-down text-muted-foreground opacity-50 shrink-0"
      >
        <path d="m7 15 5 5 5-5" />
        <path d="m7 9 5-5 5 5" />
      </svg>
    </button>
    <div
      id="select-165800-popover"
      data-popover
      aria-hidden="true"
      class="w-full"
    >
      <header>
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
          class="lucide lucide-search-icon lucide-search"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="text"
          value=""
          :placeholder="props.placeholder"
          autocomplete="off"
          autocorrect="off"
          spellcheck="false"
          aria-autocomplete="list"
          role="combobox"
          aria-expanded="false"
          aria-controls="select-165800-listbox"
          aria-labelledby="select-165800-trigger"
        />
      </header>

      <div
        role="listbox"
        id="select-165800-listbox"
        aria-orientation="vertical"
        aria-labelledby="select-165800-trigger"
        data-empty="No timezone found."
      >
        <div class="max-h-64 overflow-y-auto scrollbar">
          <div role="group" aria-labelledby="combobox-schools-group-0">
            <div
              role="option"
              v-for="item in props.items"
              :key="item"
              :data-value="item"
            >
              {{ item }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <input type="hidden" name="select-165800-value" value="" />
  </div>
</template>

<script setup lang="ts">
import "basecoat-css/basecoat";
import "basecoat-css/select";

const props = defineProps<{
  placeholder: string;
  items: string[];
}>();

console.log(props.items);
</script>

<style scoped></style>
