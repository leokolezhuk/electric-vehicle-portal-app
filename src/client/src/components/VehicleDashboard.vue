<template>
  <v-container>
    <v-card class="rounded-lg elevation-23">
      <v-row wrap no-gutters>
        <v-col cols="12" md="6">
          <VehicleLocation :coordinate="mapLocation" style="height: 500px" />
        </v-col>
        <v-col cols="12" md="6" class="pa-6">
          <v-row no-gutters>
            <v-col>
              <OdometerIndicator :value="vehicleData.odometerKm" />
              <EnergyUseIndicator :value="energyUsage" />
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
              sm="6"
              lg="4"
              class="d-flex justify-center align-center justify-md-start"
            >
              <CircularIndicator
                id="vehicle-speed"
                :value="vehicleData.speedKmh"
                label="SPEED"
                units="km/h"
                :value-formatter="formatSpeed"
              />
            </v-col>
            <v-col
              cols="12"
              sm="6"
              lg="4"
              class="d-flex justify-center align-center justify-md-start"
            >
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
      </v-row>
    </v-card>
    <v-row class="mt-12">
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
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import VehicleData from "@/models/VehicleData";
import CircularIndicator from "@/components/CircularIndicator.vue";
import OdometerIndicator from "@/components/OdometerIndicator.vue";
import EnergyUseIndicator from "@/components/EnergyUseIndicator.vue";
import TimeAreaChart from "@/components/TimeAreaChart.vue";
import viricityWebSocket from "@/services/viricityWebSocket";
import DataEntry from "@/models/DataEntry";
import moment from "moment";
import { DASHBOARD_UPDATE_EVERY_MS } from "@/config";
import GPSCoordinate from "@/models/GPSCoordinate";
import VehicleLocation from "@/components/VehicleLocation.vue";

const dataPlaceholder = new VehicleData(
  new Date(),
  0,
  new GPSCoordinate(0, 0),
  0,
  0,
  0
);
const _data = {
  vehicleData: dataPlaceholder,
  speedHistory: [] as Array<DataEntry<string, number>>,
  chargeHistory: [] as Array<DataEntry<string, number>>,
};

export default defineComponent({
  name: "VehicleDashboard",

  components: {
    VehicleLocation,
    TimeAreaChart,
    CircularIndicator,
    OdometerIndicator,
    EnergyUseIndicator,
  },

  mounted() {
    viricityWebSocket.onMessage((data: VehicleData) => {
      _data.vehicleData = data;
      if (data.time < this.getLastTimeStamp()) {
        // Hack.
        // If the received vehicle data is timed before the last stored stamp,
        // reset history. This should only happen with cyclical test data.
        _data.speedHistory = [];
        _data.chargeHistory = [];
      }
      _data.speedHistory.push({
        x: data.time.toISOString(),
        y: data.speedKmh,
      });
      _data.chargeHistory.push({
        x: data.time.toISOString(),
        y: data.energykWh,
      });
    });

    setInterval(this.update, DASHBOARD_UPDATE_EVERY_MS);
  },

  data() {
    return {
      vehicleData: dataPlaceholder as VehicleData,
      speedHistory: [] as Array<DataEntry<string, number>>,
      chargeHistory: [] as Array<DataEntry<string, number>>,
    };
  },

  methods: {
    update() {
      this.vehicleData = _data.vehicleData;

      this.speedHistory.length = 0;
      this.speedHistory.push(..._data.speedHistory);

      this.chargeHistory.length = 0;
      this.chargeHistory.push(..._data.chargeHistory);
    },
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

  computed: {
    energyUsage(): number {
      const numHistoryEntries = this.chargeHistory.length;
      if (numHistoryEntries < 2) return 0;

      const lastDataPoint = this.chargeHistory[numHistoryEntries - 1];
      const firstDataPoint = this.chargeHistory[0];

      const firstTimeStamp = new Date(firstDataPoint.x);
      const lastTimeStamp = new Date(lastDataPoint.x);

      const secondsDelta = moment(lastTimeStamp).diff(
        firstTimeStamp,
        "seconds"
      );
      const energyDelta = lastDataPoint.y - firstDataPoint.y;

      return energyDelta / (secondsDelta / 3600);
    },
    mapLocation(): google.maps.LatLngLiteral {
      return {
        lat: this.vehicleData?.coordinate.latitude,
        lng: this.vehicleData?.coordinate.longitude,
      };
    },
  },
});
</script>
