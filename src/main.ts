import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./style.css";

const app = createApp(App);
app.use(router);
app.mount("#app");

app.config.globalProperties.$apiEndpoint =
  "https://data.cityofnewyork.us/resource/5ery-qagt.json?$limit=2147483647";

app.config.globalProperties.$mapUrl =
  "https://www.openstreetmap.org/export/embed.html";
