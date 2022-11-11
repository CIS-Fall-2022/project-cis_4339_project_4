<template>
  <canvas ref="myChart"></canvas>
</template>

<script>
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);
export default {
  props: {
    label: {
      type: Array,
    },
    chartData: {
      type: Array,
    },
  },
  async mounted() {
    console.log(this.chartData);
    await new Chart(this.$refs.myChart, {
      type: "bar",
      data: {
        labels: this.label,
        datasets: [
          {
            label: "Number of Attendees",
            backgroundColor: "rgba(245, 66, 66,.5)",
            borderColor: "#f54242",
            borderWidth: 3,
            data: this.chartData,
          },
        ],
      },
      options: {
        scales: {
          y: {
            min: 0,
          },
        },
      },
    });
  },
};
</script>
