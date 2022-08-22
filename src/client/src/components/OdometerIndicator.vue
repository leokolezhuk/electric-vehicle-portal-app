<template>
  <div>
    <div class="text-h6 text-grey" title="Odometer reading">
      <v-icon class="mr-2">mdi-gauge</v-icon>
      <span>Odometer: {{ formattedValue }} km </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { round } from "lodash";

export default defineComponent({
  name: "OdometerIndicator",

  props: {
    value: {
      type: Number,
      required: true,
    },
  },

  computed: {
    formattedValue() {
      return round(this.value, 0);
    },
  },
});
</script>
