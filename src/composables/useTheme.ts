import { ref } from "vue";

const dark = ref<boolean>(false);

export function useTheme() {
  function init() {
    try {
      const stored: string | null = localStorage.getItem("themeMode");
      dark.value = stored
        ? stored === "dark"
        : matchMedia("(prefers-color-scheme: dark)").matches;
    } catch (_) {}

    apply(dark.value);
  }

  function toggle() {
    dark.value = !dark.value;
    apply(dark.value);
  }

  function apply(isDark: boolean) {
    document.documentElement.classList.toggle("dark", isDark);

    try {
      localStorage.setItem("themeMode", isDark ? "dark" : "light");
    } catch (_) {}
  }

  return { dark, init, toggle };
}
