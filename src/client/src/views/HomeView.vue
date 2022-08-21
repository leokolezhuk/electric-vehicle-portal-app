<template>
  <VehicleDashboard />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import VehicleDashboard from "../components/VehicleDashboard.vue";

export default defineComponent({
  name: "HomeView",

  components: {
    VehicleDashboard,
  },
});
</script>
