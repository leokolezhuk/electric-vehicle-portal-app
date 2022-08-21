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
            <v-col>
              <OdometerIndicator :value="vehicleData.odometerKm" />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6" lg="4">
              <CircularIndicator
                id="vehicle-speed"
                :value="vehicleData.speedKmh"
                label="SPEED"
                units="km/h"
                :value-formatter="formatSpeed"
              />
            </v-col>
            <v-col cols="6" lg="4">
              <CircularIndicator
                id="vehicle-charge"
                :value="vehicleData.batteryCharge"
                label="CHARGE"
                units="%"
                :value-formatter="formatBatteryCharge"
              />
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12">
          <v-row>
            <v-col cols="12" lg="6">
              <TimeAreaChart
                id="vehicle-speed-chart"
                label="Speed"
                :series="speedHistory"
              />
            </v-col>
            <v-col cols="12" lg="6">
              <TimeAreaChart
                id="vehicle-charge-chart"
                label="Charge"
                :series="chargeHistory"
              />
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
import CircularIndicator from "@/components/CircularIndicator.vue";
import OdometerIndicator from "@/components/OdometerIndicator.vue";
import TimeAreaChart from "@/components/TimeAreaChart.vue";
import viricityWebSocket from "@/services/viricityWebSocket";
import DataEntry from "@/models/DataEntry";

export default defineComponent({
  name: "HelloWorld",

  components: {
    VehicleMap,
    TimeAreaChart,
    CircularIndicator,
    OdometerIndicator,
  },

  mounted() {
    viricityWebSocket.onMessage((data: VehicleData) => {
      this.vehicleData = data;

      if (data.time < this.getLastTimeStamp()) {
        // If the received vehicle data is timed before the last stored stamp,
        // reset history.
        this.speedHistory = [];
        this.chargeHistory = [];
      }

      this.speedHistory.push({ x: data.time.toISOString(), y: data.speedKmh });
      this.chargeHistory.push({
        x: data.time.toISOString(),
        y: data.energykWh,
      });
    });
  },

  data() {
    return {
      vehicleData: null as VehicleData | null,
      speedHistory: [] as Array<DataEntry<string, number>>,
      chargeHistory: [] as Array<DataEntry<string, number>>,
    };
  },

  methods: {
    getLastTimeStamp(): Date {
      if (this.speedHistory.length < 1) {
        return new Date(0);
      }
      const lastTimeStampStr =
        this.speedHistory[this.speedHistory.length - 1].x;
      return new Date(lastTimeStampStr);
    },
    formatBatteryCharge(value: number) {
      const roundedCharge = Math.round(value * 10) / 10;
      return `${roundedCharge} %`;
    },
    formatSpeed(value: number) {
      const roundedSpeed = Math.round(value * 10) / 10;
      return `${roundedSpeed} km/h`;
    },
  },
});
</script>

<style lang="scss" scoped>
.vehicle-map-container {
  width: 500px;
  height: 500px;
}
</style>
