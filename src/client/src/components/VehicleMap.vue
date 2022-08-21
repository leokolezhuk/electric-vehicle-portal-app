<template>
  <GoogleMap :coordinates="mapLocation" />
</template>

<script lang="ts">
import GPSCoordinate from "@/models/GPSCoordinate";
import { defineComponent } from "vue";
import GoogleMap from "@/components/GoogleMap.vue";

interface MapLocation {
  lng: number;
  lat: number;
}

export default defineComponent({
  props: {
    gpsLocation: { type: GPSCoordinate, required: true },
  },

  components: { GoogleMap },

  computed: {
    mapLocation(): MapLocation {
      return {
        lat: this.gpsLocation.latitude,
        lng: this.gpsLocation.longitude,
      };
    },
  },
});
</script>

<style lang="scss" scoped>
.vehicle-map {
  width: 500px;
  height: 500px;
}
</style>
