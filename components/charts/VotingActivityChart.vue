<template>
  <div>
    <BarChart :chart-data="datacollection" :options="chartOptions" />
  </div>
</template>

<script>
import { Bar } from "vue-chartjs";

export default {
  name: "VotingActivityChart",

  components: {
    BarChart: Bar,
  },

  props: {
    votes: {
      type: Array,
      default: () => [], 
      /*
        Expected format from backend:
        [
          { vote_date: "2025-09-01", total_votes: 120 },
          { vote_date: "2025-09-02", total_votes: 300 },
          ...
        ]
      */
    },
  },

  computed: {
    datacollection() {
      return {
        labels: this.votes.map(v => v.vote_date),
        datasets: [
          {
            label: "Votes Cast",
            backgroundColor: "#42b883",
            borderColor: "#2c3e50",
            borderWidth: 1,
            data: this.votes.map(v => v.total_votes),
          },
        ],
      };
    },

    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                stepSize: 50, // adjust based on your vote volume
              },
            },
          ],
          xAxes: [
            {
              ticks: {
                autoSkip: true,
                maxTicksLimit: 10,
              },
            },
          ],
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem) {
              return `Votes: ${tooltipItem.yLabel}`;
            },
          },
        },
      };
    },
  },
};
</script>

<style scoped>
div {
  height: 300px;
}
</style>
