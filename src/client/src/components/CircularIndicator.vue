<template>
  <div class="circular-indicator">
    <div :id="chartId"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import ApexCharts from "apexcharts";

var baseOptions = {
  chart: {
    height: 250,
    type: "radialBar",
    offsetX: -5,
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
        },
      },
    },
  },
  stroke: {
    dashArray: 4,
  },
  colors: ["#1E88E5"],
};

export default defineComponent({
  name: "CircularIndicator",

  props: {
    id: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    valueFormatter: {
      required: true,
      type: Function as PropType<(value: number) => string>,
    },
  },

  setup() {
    return {
      chart: null as ApexCharts | null,
    };
  },

  computed: {
    chartId() {
      return `circular-indicator-${this.id}`;
    },
  },

  mounted() {
    this.chart = new ApexCharts(document.querySelector(`#${this.chartId}`), {
      ...baseOptions,
      series: [this.value],
      labels: [this.label],
    });
    this.chart.render();
    this.chart.updateOptions({
      plotOptions: {
        radialBar: {
          dataLabels: {
            value: {
              formatter: this.valueFormatter,
            },
          },
        },
      },
    });
  },

  watch: {
    value(newValue: number) {
      this.chart?.updateSeries([newValue]);
    },
  },
});
</script>

<style lang="scss" scoped>
.circular-indicator {
  height: 200px;
  width: 200px;
}
</style>
