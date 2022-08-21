<template>
  <v-container>
    <div v-if="vehicleData">
      <v-row wrap no-gutters>
        <v-col cols="12" md="6">
          <VehicleMap
            :gps-location="vehicleData?.coordinate"
            style="height: 500px"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-row>
            <v-col cols="6" lg="4">
              <ChargeIndicator id="indicator-1" :vehicle-data="vehicleData" />
            </v-col>
            <v-col cols="6" lg="4">
              <ChargeIndicator id="indicator-2" :vehicle-data="vehicleData" />
            </v-col>
            <v-col cols="6" lg="4">
              <ChargeIndicator id="indicator-3" :vehicle-data="vehicleData" />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import VehicleData from "@/models/VehicleData";
import VehicleMap from "@/components/VehicleMap.vue";
import ChargeIndicator from "@/components/ChargeIndicator.vue";
import viricityWebSocket from "@/services/viricityWebSocket";

export default defineComponent({
  name: "HelloWorld",

  components: { VehicleMap, ChargeIndicator },

  mounted() {
    viricityWebSocket.onMessage((data: VehicleData) => {
      // if (this.vehicleData) return;
      this.vehicleData = data;
      // console.log("received message");
    });
  },

  data() {
    return {
      vehicleData: null as VehicleData | null,
    };
  },
});
</script>

<style lang="scss" scoped>
.vehicle-map-container {
  width: 500px;
  height: 500px;
}
</style>
