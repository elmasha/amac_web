<template>
  <div v-if="timeLeft.total > 0" class="container my-4">
   <h2 style="font-size: 2.3rem;">
     <span style="font-size: 2.2rem;">{{ timeLeft.days }}d :</span>
    <span style="font-size: 2.2rem;">{{ timeLeft.hours }}h :</span>
    <span style="font-size: 2.2rem;">{{ timeLeft.minutes }}m :</span>
    <span style="font-size: 2.2rem;">{{ timeLeft.seconds }}s</span>
   </h2>
  </div>
  <div v-else>
    <span>⏳ Time’s up!</span>
  </div>
</template>

<script>
export default {
  props: {
    // Example: "2025-09-30 23:59:59" or "2025-09-30"
    targetDate: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      interval: null,
      timeLeft: {
        total: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      }
    }
  },
  methods: {
    calculateTimeLeft() {
      // Convert simple format into valid Date
      const target = new Date(this.targetDate.replace(" ", "T"))
      const now = new Date()
      const diff = target.getTime() - now.getTime()

      if (diff > 0) {
        this.timeLeft = {
          total: diff,
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60)
        }
      } else {
        this.timeLeft = { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 }
        clearInterval(this.interval)
      }
    }
  },
  mounted() {
    this.calculateTimeLeft()
    this.interval = setInterval(this.calculateTimeLeft, 1000)
  },
  beforeDestroy() {
    clearInterval(this.interval)
  }
}
</script>

<style scoped>
span {
  font-size: 1.5rem;
  margin: 0 5px;
  font-weight: bold;
}
</style>
