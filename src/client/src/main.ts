import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import VueGoogleMaps from "@fawmi/vue-google-maps";
import { GOOGLE_MAPS_API_KEY } from "./config";
import { createPinia } from "pinia";

loadFonts();

createApp(App)
  .use(createPinia())
  .use(router)
  .use(vuetify)
  .use(VueGoogleMaps, {
    load: {
      key: GOOGLE_MAPS_API_KEY,
    },
    autobindAllEvents: true,
  })
  .mount("#app");
