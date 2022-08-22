<template>
  <div
    class="text-h6 text-grey"
    title="Running average hourly energy consumption"
  >
    <v-icon class="mr-2">mdi-lightning-bolt</v-icon>
    <span>Energy consumption: {{ formattedValue }} kW/h</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { round } from "lodash";

export default defineComponent({
  name: "EnergyUseIndicator",

  props: {
    value: {
      type: Number,
      required: true,
    },
  },

  computed: {
    formattedValue() {
      return round(this.value, 1);
    },
  },
});
</script>
