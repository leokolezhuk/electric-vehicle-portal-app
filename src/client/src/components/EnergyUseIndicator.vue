<template>
  <v-chip> Energy consumption: {{ formattedValue }} kW/h </v-chip>
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
