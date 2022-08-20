<template>
  <v-container>
    <v-row>
      <VehicleMap />
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import VehicleMap from "@/components/VehicleMap.vue";
import viricityWebSocket from "@/services/viricityWebSocket";

export default defineComponent({
  name: "HelloWorld",

  components: { VehicleMap },

  mounted() {
    viricityWebSocket.onMessage(() => {
      console.log("received message");
    });
  },

  data() {
    return {};
  },
});
</script>
