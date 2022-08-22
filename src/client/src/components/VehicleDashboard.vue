<template>
  <v-container>
    <v-card class="rounded-lg elevation-23">
      <v-row wrap no-gutters>
        <v-col cols="12" md="6">
          <VehicleLocation
            id="vehicle-location"
            :coordinate="mapLocation"
            style="height: 500px"
          />
        </v-col>
        <v-col cols="12" md="6" class="pa-6">
          <v-row>
            <v-col
              cols="12"
              sm="6"
              lg="6"
              class="d-flex justify-center align-center"
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
              lg="6"
              class="d-flex justify-center align-center"
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
          <v-divider />
          <v-row>
            <v-col>
              <OdometerIndicator :value="vehicleData.odometerKm" class="ma-4" />
              <EnergyUseIndicator :value="energyUsage" class="ma-4" />
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
import { defineComponent, ref } from "vue";
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
import { round } from "lodash";

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
      this.dirtyData.vehicleData = data;
      if (data.time < this.getLastTimeStamp()) {
        // Hack.
        // If the received vehicle data is timed before the last stored stamp,
        // reset history. This should only happen with cyclical test data.
        this.dirtyData.speedHistory = [];
        this.dirtyData.chargeHistory = [];
      }
      this.dirtyData.speedHistory.push({
        x: data.time.toISOString(),
        y: data.speedKmh,
      });
      this.dirtyData.chargeHistory.push({
        x: data.time.toISOString(),
        y: data.batteryCharge,
      });
      this.dirtyData.energyHistory.push({
        x: data.time.toISOString(),
        y: data.energykWh,
      });
    });

    setInterval(this.update, DASHBOARD_UPDATE_EVERY_MS);
  },

  setup() {
    const dataPlaceholder = new VehicleData(
      new Date(),
      0,
      new GPSCoordinate(0, 0),
      0,
      0,
      0
    );

    return {
      dirtyData: {
        vehicleData: dataPlaceholder,
        speedHistory: [] as Array<DataEntry<string, number>>,
        chargeHistory: [] as Array<DataEntry<string, number>>,
        energyHistory: [] as Array<DataEntry<string, number>>,
      },
      vehicleData: ref(dataPlaceholder),
      speedHistory: ref([] as Array<DataEntry<string, number>>),
      chargeHistory: ref([] as Array<DataEntry<string, number>>),
      energyHistory: ref([] as Array<DataEntry<string, number>>),
    };
  },

  methods: {
    update() {
      this.vehicleData = this.dirtyData.vehicleData;

      this.speedHistory.length = 0;
      this.speedHistory.push(...this.dirtyData.speedHistory);

      this.chargeHistory.length = 0;
      this.chargeHistory.push(...this.dirtyData.chargeHistory);

      this.energyHistory.length = 0;
      this.energyHistory.push(...this.dirtyData.energyHistory);
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
      return `${round(value, 1)} %`;
    },
    formatSpeed(value: number) {
      return `${round(value, 0)} km/h`;
    },
  },

  computed: {
    energyUsage(): number {
      const numHistoryEntries = this.energyHistory.length;
      if (numHistoryEntries < 2) return 0;

      const firstDataPoint = this.energyHistory[0];
      const lastDataPoint = this.energyHistory[numHistoryEntries - 1];

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
