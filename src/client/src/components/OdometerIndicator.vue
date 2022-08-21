<template>
  <v-chip prepend-icon="mdi-gauge"> Odometer: {{ value }} km </v-chip>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "OdometerIndicator",

  props: {
    value: {
      type: Number,
      required: true,
    },
  },
});
</script>
