<template>
  <div class="vehicle-charge-indicator">
    <div :id="chartId"></div>
    <div class="vehicle-charge-indicator-details">
      <span class="text-grey-darken-1">
        {{ batteryEnergy }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import VehicleData from "@/models/VehicleData";
import ApexCharts from "apexcharts";

var chartOptions = {
  chart: {
    height: 250,
    type: "radialBar",
    offsetY: 0,
  },
  plotOptions: {
    radialBar: {
      startAngle: -135,
      endAngle: 135,
      hollow: {
        margin: 0,
        size: "60%",
        background: "#fff",
        position: "front",
      },
      dataLabels: {
        name: {
          fontSize: "16px",
          color: undefined,
          offsetY: 20,
        },
        value: {
          offsetY: -20,
          fontSize: "22px",
          color: undefined,
          formatter: function (val: number): string {
            return val + "%";
          },
        },
      },
    },
  },
  fill: {
    type: "gradient",
    gradient: {
      shade: "dark",
      shadeIntensity: 0.15,
      inverseColors: false,
      opacityFrom: 1,
      opacityTo: 1,
      stops: [0, 50, 65, 91],
    },
  },
  stroke: {
    dashArray: 4,
  },
  labels: ["CHARGE"],
};

export default defineComponent({
  name: "ChargeIndicator",

  props: {
    id: {
      type: String,
      required: true,
    },
    vehicleData: {
      type: VehicleData,
      required: true,
    },
  },

  data() {
    return {
      chart: null as ApexCharts | null,
    };
  },

  computed: {
    chartId() {
      return `charge-indicator-${this.id}`;
    },
    batteryEnergy(): string {
      if (!this.vehicleData?.energykWh) {
        return "-";
      }
      const energy = this.vehicleData.energykWh;
      const roundedEnergy = Math.round(energy * 10) / 10;
      return `${roundedEnergy} kWh`;
    },
  },

  mounted() {
    this.chart = new ApexCharts(document.querySelector(`#${this.chartId}`), {
      ...chartOptions,
      series: [this.vehicleData.batteryCharge],
    });
    this.chart.render();
  },

  watch: {
    "vehicleData.batteryCharge"(newValue: number) {
      this.chart?.updateOptions({ ...chartOptions, series: [newValue] });
    },
  },
});
</script>

<style lang="scss" scoped>
.vehicle-charge-indicator {
  height: 250px;
  width: 250px;
  position: relative;
}

.vehicle-charge-indicator-details {
  position: absolute;
  width: 100%;
  top: 160px;
  margin: 0 auto;
  text-align: center;
}
</style>
