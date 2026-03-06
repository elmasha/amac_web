<template>
  <div class="scanner-page">

    <h2 class="title">🎟 Ticket Scanner</h2>

    <div class="scanner-container">

      <qrcode-stream
        @decode="onDecode"
        @init="onInit"
      />

      <div class="scan-overlay"></div>

    </div>

    <div v-if="result" class="result" :class="result.success ? 'valid' : 'invalid'">

      <h3>{{ result.message }}</h3>

      <div v-if="result.ticket">
        Row {{ result.ticket.row_no }} - Seat {{ result.ticket.seat_no }}
      </div>

    </div>

  </div>
</template>

<script>
import { QrcodeStream } from "vue-qrcode-reader"
import axios from "axios"

export default {

  components:{
    QrcodeStream
  },

  data(){
    return{

      result:null,
      scanning:true,

      api:"https://amacserver-production-ebd5.up.railway.app/api/tickets/scan"

    }
  },

  methods:{

    async onDecode(qr){

      if(!this.scanning) return

      this.scanning=false

      try{

        const res = await axios.post(this.api,{
          qr_token:qr
        })

        this.result=res.data

        if(res.data.success){

          this.playSuccess()

        }else{

          this.playError()

        }

      }catch(err){

        this.result={
          success:false,
          message:"Scan failed"
        }

        this.playError()

      }

      setTimeout(()=>{
        this.result=null
        this.scanning=true
      },3000)

    },

    onInit(promise){

      promise.catch(err=>{
        console.error(err)
      })

    },

    playSuccess(){

      const audio = new Audio("/success.mp3")
      audio.play()

    },

    playError(){

      const audio = new Audio("/error.mp3")
      audio.play()

    }

  }

}
</script>


<style scoped>

.scanner-page{
  text-align:center;
  padding:20px;
}

.title{
  margin-bottom:20px;
}

.scanner-container{

  position:relative;
  width:100%;
  max-width:500px;
  margin:auto;

}

.scan-overlay{

  position:absolute;
  border:4px solid #00ff88;
  width:80%;
  height:60%;
  top:20%;
  left:10%;
  border-radius:12px;
  pointer-events:none;

}

.result{

  margin-top:25px;
  padding:20px;
  border-radius:10px;
  font-size:20px;

}

.valid{

  background:#d4ffd9;
  color:#0a7f2e;

}

.invalid{

  background:#ffd6d6;
  color:#a30000;

}

</style>