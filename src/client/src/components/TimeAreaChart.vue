<template>
  <div class="time-area-chart">
    <div :id="chartId"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

var baseOptions = {
  chart: {
    height: 350,
    type: "area",
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
  },
  xaxis: {
    type: "datetime",
  },
  tooltip: {
    enabled: false,
  },
};

import { PropType } from "vue";
import ApexCharts from "apexcharts";
import DataEntry from "@/models/DataEntry";

export default defineComponent({
  props: {
    id: {
      type: String,
      required: true,
    },
    series: {
      type: Array as PropType<Array<DataEntry<string, number>>>,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
  },

  setup() {
    return {
      chart: null as ApexCharts | null,
    };
  },

  computed: {
    chartId() {
      return `time-area-chart-${this.id}`;
    },
  },

  mounted() {
    this.chart = new ApexCharts(
      document.querySelector(`#${this.chartId}`),
      this.makeChartOptions()
    );
    this.chart.render();
  },

  methods: {
    makeChartOptions(): object {
      const options = {
        ...baseOptions,
        title: {
          text: this.label,
          align: "left",
          margin: 10,
          offsetX: 0,
          offsetY: 0,
          floating: false,
          style: {
            fontSize: "32px",
            fontWeight: "regular",
            fontFamily: undefined,
            color: "#9e9e9e",
          },
        },
        series: [{ name: this.label, data: this.series }],
      };
      return options;
    },
    update() {
      this.chart?.updateSeries([{ data: this.series }]);
    },
  },

  watch: {
    "series.length"() {
      this.update();
    },
  },
});
</script>
