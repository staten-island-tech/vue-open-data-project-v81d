<template>
  <dialog
    ref="dialog"
    class="dialog w-full sm:max-w-[425px] max-h-[612px]"
    aria-labelledby="dialog-example-title"
    aria-describedby="dialog-example-description"
    @click.self="($el as HTMLDialogElement).close()"
    @close="emit('close')"
  >
    <div>
      <header>
        <h2>{{ props.title }}</h2>
        <p>
          {{ props.description }}
        </p>
      </header>

      <section class="overflow-y-auto scrollbar">
        <div class="space-y-4 text-sm">
          <slot />
        </div>
      </section>

      <footer>
        <button class="btn-outline" @click="props.buttonCallback">
          {{ props.buttonLabel }}
        </button>
      </footer>

      <button
        type="button"
        aria-label="Close dialog"
        @click="($el as HTMLDialogElement).close()"
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
          class="lucide lucide-x-icon lucide-x"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { watch, ref } from "vue";

const props = defineProps<{
  open?: boolean;
  title: string;
  description: string;
  buttonLabel: string;
  buttonCallback: () => void;
}>();

const emit = defineEmits<{
  close: [];
}>();

const dialog = ref<HTMLDialogElement | null>(null);

watch(
  () => props.open,
  (val: boolean) => {
    if (val) dialog.value?.showModal();
    else dialog.value?.close();
  },
);
</script>

<style scoped></style>
