<template>
  <div class="time-area-chart">
    <div :id="chartId"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

const labelCssClass = "text-subtitle-1";
const labelColor = "#9e9e9e";
var baseOptions = {
  chart: {
    height: 350,
    type: "area",
    toolbar: {
      show: false,
      tools: {
        download: false,
        selection: false,
        zoom: false,
        zoomin: false,
        zoomout: false,
        pan: false,
        reset: false,
        customIcons: [],
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
  },
  yaxis: {
    labels: {
      show: true,
    },
    title: {
      text: "Speed, km/h",
      style: {
        cssClass: "text-caption text-grey",
      },
    },
  },
  xaxis: {
    type: "datetime",
    labels: {
      format: "HH:mm",
      dateTimeUTC: false,
    },
    title: {
      text: "Time",
      style: {
        color: labelColor,
        cssClass: labelCssClass,
      },
    },
  },
  tooltip: {
    enabled: false,
  },
  selection: {
    enabled: false,
  },
  colors: ["#1E88E5"],
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
    units: {
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
        yaxis: {
          labels: {
            show: true,
          },
          title: {
            text: `${this.label} - ${this.units}`,
            style: {
              color: labelColor,
              cssClass: labelCssClass,
            },
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
