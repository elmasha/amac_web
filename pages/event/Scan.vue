<template>
  <div class="scanner">
    <h2>Scan Ticket</h2>

    <qrcode-stream @decode="onDecode" @init="onInit"></qrcode-stream>

    <div v-if="result" class="result">
      <h3>{{ result.message }}</h3>
      <pre>{{ result }}</pre>
    </div>
  </div>
</template>

<script>
import { QrcodeStream } from "vue-qrcode-reader"
import axios from "axios"

export default {
  components: {
    QrcodeStream
  },

  data() {
    return {
      result: null
    }
  },

  methods: {
    async onDecode(qrToken) {

      try {

        const res = await axios.post(
          "https://amacserver-production-ebd5.up.railway.app/api/tickets/scan",
          { qr_token: qrToken }
        )

        this.result = res.data

      } catch (err) {

        this.result = {
          success:false,
          message:"Scan failed"
        }

      }

    },

    onInit(promise) {
      promise.catch(err => {
        console.error(err)
      })
    }
  }
}
</script>

<style scoped>

.scanner{
  max-width:600px;
  margin:auto;
  text-align:center;
}

.result{
  margin-top:20px;
  padding:10px;
  background:#f5f5f5;
}

</style>