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
              <OdometerIndicator :value="vehicleData.odometerKm" class="my-4" />
              <EnergyUseIndicator :value="energyConsumption" class="my-4" />
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
              units="km/h"
              :series="speedHistory"
            />
          </v-col>
          <v-col cols="12" lg="6">
            <TimeAreaChart
              id="vehicle-charge-chart"
              label="Charge"
              units="%"
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
import GPSCoordinate from "@/models/GPSCoordinate";
import VehicleLocation from "@/components/VehicleLocation.vue";
import { round } from "lodash";

declare type VehicleInfoHistory = Array<DataEntry<string, number>>;

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
    viricityWebSocket.onUpdate((data: Array<VehicleData>) => {
      this.update(data);
    });
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
      vehicleData: ref(dataPlaceholder),
      speedHistory: ref([] as VehicleInfoHistory),
      chargeHistory: ref([] as VehicleInfoHistory),
      energyHistory: ref([] as VehicleInfoHistory),
    };
  },

  methods: {
    update(data: Array<VehicleData>) {
      if (data.length === 0) return;

      const lastDataPoint = data[data.length - 1];
      this.vehicleData = lastDataPoint;

      // Hack.
      // If the received vehicle data is timed before the last stored stamp,
      // reset history. This should only happen with cyclical test data.
      if (!this.isFutureData(data)) {
        this.speedHistory = [];
        this.chargeHistory = [];
        this.energyHistory = [];
      } else {
        this.speedHistory.push(
          ...data.map((value) => {
            return {
              x: value.time.toISOString(),
              y: value.speedKmh,
            };
          })
        );
        this.chargeHistory.push(
          ...data.map((value) => {
            return {
              x: value.time.toISOString(),
              y: value.batteryCharge,
            };
          })
        );
        this.energyHistory.push(
          ...data.map((value) => {
            return {
              x: value.time.toISOString(),
              y: value.energykW,
            };
          })
        );
      }
    },
    isFutureData(data: Array<VehicleData>): boolean {
      for (let entry of data) {
        if (entry.time < this.getLastTimeStamp()) {
          return false;
        }
      }
      return true;
    },
    getLastTimeStamp(): Date {
      if (this.speedHistory.length === 0) {
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
    energyConsumption(): number {
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
      const energyDeltakW = lastDataPoint.y - firstDataPoint.y;

      // Convert seconds delta to hours to get kW/h.
      return energyDeltakW / (secondsDelta / 3600);
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
