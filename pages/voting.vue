<template>
  <v-app class="app-bg">

    <!-- NAV -->
    <v-app-bar app dark class="glass-nav">
      <div class="d-flex align-center">
        <v-avatar size="32">
          <v-img :src="logo"></v-img>
        </v-avatar>
        <span class="ml-3 brand">AMAC Voting</span>
      </div>

      <v-spacer />

      <v-btn class="cta-btn" rounded @click="$router.push('/')">
        Back Home
      </v-btn>
    </v-app-bar>

    <!-- HERO -->
    <div class="hero">
      <h1 class="glow-text">Vote Your Favorite</h1>
      <p>Select → Pay → Confirm</p>
    </div>

    <v-container>

      <!-- CATEGORY -->
      <v-select
        v-model="selectedCategory"
        :items="categories"
        item-text="name"
        item-value="id"
        label="Select Category"
        outlined
        @change="fetchNominees"
      />

      <!-- NOMINEES -->
      <div class="grid" v-if="nominees.length">
        <div
          v-for="n in nominees"
          :key="n.id"
          class="nominee-card"
          @click="selectNominee(n)"
        >
          <div class="gold-bar"></div>
          <h3>{{ n.name }}</h3>
          <small>{{ n.church }}</small>
        </div>
      </div>

      <!-- VOTE PANEL -->
      <v-card v-if="selectedNominee" class="vote-panel mt-6 pa-4">
        <h2 class="glow-text">{{ nomineeName }}</h2>

        <v-text-field
          v-model="voteCount"
          type="number"
          label="Votes"
          outlined
          @input="calculateAmount"
        />

        <p>Total: {{ amount }} Ksh</p>

        <v-btn block class="cta-btn" @click="paymentDialog = true">
          Proceed to Pay
        </v-btn>
      </v-card>

    </v-container>

    <!-- PAYMENT -->
    <v-dialog v-model="paymentDialog" max-width="400">
      <v-card class="cinematic-card pa-4 text-center">

        <h3>M-Pesa Payment</h3>

        <v-text-field v-model="phoneNumber" prefix="254" outlined />

        <v-btn block class="cta-btn" @click="processPayment">
          Pay Now
        </v-btn>

        <!-- TIMER -->
        <div v-if="timerEnabled" class="timer-ring">
          {{ timerCount }}
        </div>

        <v-progress-linear v-if="loading" indeterminate />

      </v-card>
    </v-dialog>

    <!-- SUCCESS -->
    <v-dialog v-model="paymentConfirmDialog" max-width="400">
      <v-card class="cinematic-card text-center pa-6">
        <h2 class="glow-text">Vote Confirmed 🎉</h2>
        <p>{{ voteCount }} votes recorded</p>
      </v-card>
    </v-dialog>

    <!-- ERROR / PROCESSING -->
    <v-dialog v-model="errorDialog" max-width="400">
      <v-card class="cinematic-card text-center pa-6">

        <h2 :class="processing ? 'glow-text' : 'error-text'">
          {{ processing ? "Processing..." : "Payment Issue" }}
        </h2>

        <p>{{ errorMessage }}</p>

        <v-btn
          v-if="!processing"
          class="cta-btn mt-4"
          @click="retryPayment"
        >
          Try Again
        </v-btn>

      </v-card>
    </v-dialog>

  </v-app>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      logo: require("@/assets/logo.png"),

      categories: [],
      nominees: [],

      selectedCategory: null,
      selectedNominee: null,
      nomineeName: "",

      voteCount: 1,
      amount: 10,

      phoneNumber: "",

      paymentDialog: false,
      paymentConfirmDialog: false,
      errorDialog: false,

      errorMessage: "",
      processing: false,

      timerCount: 25,
      timerEnabled: false,
      timerInterval: null,
      hasQueried: false,

      loading: false,
      CheckoutRequestID: null
    };
  },

  mounted() {
    this.fetchCategories();
  },

  beforeDestroy() {
    clearInterval(this.timerInterval);
  },

  methods: {

    async fetchCategories() {
      const { data } = await axios.get(
        "https://amacserver-production-48fd.up.railway.app/api/categories/getAll"
      );
      this.categories = data;
    },

    async fetchNominees() {
      const { data } = await axios.get(
        `https://amacserver-production-48fd.up.railway.app/api/nominee/nominees/${this.selectedCategory}`
      );
      this.nominees = data;
    },

    selectNominee(n) {
      this.selectedNominee = n.id;
      this.nomineeName = n.name;
    },

    calculateAmount() {
      this.amount = this.voteCount * 10;
    },

    // ✅ STABLE TIMER
    startTimer() {
      clearInterval(this.timerInterval);

      this.timerEnabled = true;
      this.timerCount = 25;
      this.hasQueried = false;

      this.timerInterval = setInterval(() => {
        if (this.timerCount > 0) {
          this.timerCount--;
        } else {
          clearInterval(this.timerInterval);
          this.timerEnabled = false;

          if (!this.hasQueried) {
            this.hasQueried = true;
            this.stkQuery();
          }
        }
      }, 1000);
    },

    async processPayment() {
      try {
        this.loading = true;

        const phone = "254" + this.phoneNumber;

        const res = await axios.post(
          "https://amacserver-production-48fd.up.railway.app/payment/mpesa_stk_push",
          {
            phone,
            amount: this.amount,
            vote_count: this.voteCount,
            candidate_id: this.selectedNominee,
            category_id: this.selectedCategory,
          }
        );

        this.CheckoutRequestID = res.data.CheckoutRequestID;
          console.log("STK PUSH RESPONSE:", res.data.CheckoutRequestID);
        this.startTimer();

      } catch {
        this.showError("Failed to initiate payment", false);
      }
    },

    async stkQuery() {
      try {
        const res = await axios.post(
          "https://amacserver-production-48fd.up.railway.app/payment/mpesa_stk_push/query",
          {
            CheckoutRequestID: this.CheckoutRequestID
          }
        );

        console.log("QUERY:", res.data , this.CheckoutRequestID);

        this.loading = false;
        this.paymentDialog = false;

        const data = res.data;

        // ✅ SUCCESS
        if (data.ResultCode == 0) {
          this.paymentConfirmDialog = true;
          return;
        }

        // ❌ ONLY TRUE FAILURE
        if (data.ResultCode == 1032) {
          this.showError("Payment cancelled by user", false);
          return;
        }

        // ⚠️ EVERYTHING ELSE → PROCESSING
        this.showProcessing("Confirming your payment... please wait");

      } catch (err) {
        console.log("QUERY ERROR:", err);

        // 🔥 FIX: DO NOT FAIL HERE
        this.showProcessing("Payment is being confirmed...");
      }
    },

    showError(msg) {
      this.errorMessage = msg;
      this.processing = false;
      this.errorDialog = true;
      this.loading = false;
    },

    showProcessing(msg) {
      this.errorMessage = msg;
      this.processing = true;
      this.errorDialog = true;
      this.loading = false;
    },

    retryPayment() {
      this.errorDialog = false;
      this.paymentDialog = true;
      this.timerEnabled = false;
    }

  }
};
</script>

<style>

/* BASE */
.app-bg {
  background: #000;
  color: white;
}

/* NAV */
.glass-nav {
  background: rgba(0,0,0,0.9) !important;
}

/* HERO */
.hero {
  text-align: center;
  padding: 100px 20px;
}

/* GRID */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px,1fr));
  gap: 20px;
}

/* CARD */
.nominee-card {
  padding: 20px;
  background: #111;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.3s;
}

.nominee-card:hover {
  transform: translateY(-5px);
  border: 1px solid gold;
}

/* GOLD BAR */
.gold-bar {
  height: 3px;
  background: gold;
  margin-bottom: 10px;
}

/* BUTTON */
.cta-btn {
  background: gold !important;
  color: black !important;
}

/* TIMER */
.timer-ring {
  width: 60px;
  height: 60px;
  border: 3px solid gold;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px auto;
  color: gold;
}

/* TEXT */
.glow-text {
  color: gold;
}

.error-text {
  color: red;
}

</style>