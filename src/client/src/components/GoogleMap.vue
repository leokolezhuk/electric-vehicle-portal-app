<template>
  <div :id="mapName" :class="`google-map`"></div>
</template>

<script lang="ts">
import $Scriptjs from "scriptjs";
import { GOOGLE_MAPS_API_KEY } from "@/config";
import { PropType } from "vue";
import { mdiBus } from "@mdi/js";

interface MapLocation {
  lng: number;
  lat: number;
}

export default {
  props: {
    coordinates: {
      type: Object as PropType<MapLocation>,
      required: true,
    },
    index: Number,
  },

  data: function () {
    return {
      apiKey: GOOGLE_MAPS_API_KEY,
      mapName: `map${this.index || ""}`,
      map: null,
      marker: null,
    };
  },

  mounted() {
    $Scriptjs(
      `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}`,
      () => {
        this.initializeMap();
      }
    );
  },

  methods: {
    initializeMap() {
      const element = document.getElementById(this.mapName);
      const mapCentre = this.coordinates;
      const options = {
        center: new google.maps.LatLng(mapCentre.lat, mapCentre.lng),
        zoom: 15,
        mapTypeControl: true,
        streetViewControl: true,
      };

      this.map = new google.maps.Map(element, options);
      this.marker = new google.maps.Marker({
        position: this.coordinates,
        map: this.map,
        icon: {
          path: mdiBus,
          fillColor: "blue",
          fillOpacity: 1,
          strokeWeight: 1,
          strokeColor: "blue",
          scale: 1,
        },
      });
    },
    setMarkerPosition(position: MapLocation) {
      this.map.setCenter(position);
      this.marker?.setPosition(position);
    },
  },

  watch: {
    coordinates(newVal: MapLocation) {
      this.setMarkerPosition(newVal);
    },
  },
};
</script>

<style lang="scss">
.google-map {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  background: rgb(235, 235, 235);
}

#locations-map {
  .gm-ui-hover-effect {
    display: none !important;
  }
}
</style>
