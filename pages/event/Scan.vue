<template>
  <v-container>
    <h2>Scan Ticket</h2>

    <qrcode-stream @decode="onDecode" @init="onInit" />
    <div v-if="scanResult" class="result">
      <p>{{ scanResult.message }}</p>
      <pre>{{ scanResult.ticket }}</pre>
    </div>
  </v-container>
</template>

<script>
import axios from 'axios'
import Vue from 'vue'
import QrcodeStream from 'vue-qrcode-reader'

Vue.use(QrcodeStream)

export default {
  components: { QrcodeStream },
  data() {
    return {
      scanResult: null
    }
  },
  methods: {
    async onDecode(qrToken) {
      try {
        const { data } = await axios.post(
          "https://amacserver-production-ebd5.up.railway.app/api/tickets/scan",
          { qr_token: qrToken }
        )
        this.scanResult = data
      } catch (err) {
        console.error(err)
        this.scanResult = { success: false, message: "Error scanning ticket" }
      }
    },
    onInit(promise) {
      promise.catch(err => {
        console.error("Camera init failed:", err)
      })
    }
  }
}
</script>

<style scoped>
.result { margin-top: 20px; }
</style>