<template>
  <div>
    <div class="text-h6 text-grey">
      <v-icon class="mr-2">mdi-lightning-bolt</v-icon>
      <span>Energy consumption: {{ formattedValue }} kW/h</span>
    </div>
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
