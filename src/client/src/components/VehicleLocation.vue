<template>
  <div :id="mapName" :class="`google-map`"></div>
</template>

<script lang="ts">
import $Scriptjs from "scriptjs";
import { GOOGLE_MAPS_API_KEY } from "@/config";
import { defineComponent, PropType, ref } from "vue";
import { mdiBus } from "@mdi/js";

export default defineComponent({
  name: "VehicleLocation",

  props: {
    id: {
      type: String,
      required: true,
    },
    coordinate: {
      type: Object as PropType<google.maps.LatLngLiteral>,
      required: true,
    },
  },

  setup(props) {
    return {
      apiKey: GOOGLE_MAPS_API_KEY,
      map: null as google.maps.Map | null,
      marker: null as google.maps.Marker | null,
      mapName: ref(`vehicle-location-` + props.id),
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
      const element = document.getElementById(this.mapName) as HTMLElement;
      const mapCentre = this.coordinate;
      const options = {
        center: new google.maps.LatLng(mapCentre.lat, mapCentre.lng),
        zoom: 15,
        mapTypeControl: true,
        streetViewControl: true,
      };

      this.map = new google.maps.Map(element, options);
      this.marker = new google.maps.Marker({
        position: this.coordinate,
        map: this.map,
        icon: {
          path: mdiBus,
          fillColor: "#1E88E5",
          fillOpacity: 1,
          strokeWeight: 1,
          strokeColor: "blue",
          scale: 1.3,
        },
      });
    },
    setMarkerPosition(position: google.maps.LatLng) {
      const mapBounds = this.map?.getBounds();
      if (mapBounds !== undefined && !mapBounds.contains(position)) {
        this.map?.setCenter(position);
      }
      this.marker?.setPosition(position);
    },
  },

  watch: {
    coordinate(newVal: google.maps.LatLng) {
      this.setMarkerPosition(newVal);
    },
  },
});
</script>

<style lang="scss">
.google-map {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  background: rgb(235, 235, 235);
}
</style>
