<template>
  <v-app class="app-bg">

    <!-- NAVBAR -->
    <v-app-bar app dark class="glass-nav">
      <div class="d-flex align-center">
        <v-avatar size="30">
          <v-img :src="logo"></v-img>
        </v-avatar>
        <span class="ml-2 glow-text">Amac Voting</span>
      </div>

      <v-spacer></v-spacer>

      <v-btn class="cta-btn" rounded @click="$router.push('/')">
        Back Home
      </v-btn>
    </v-app-bar>

    <!-- HERO -->
    <div class="hero">
      <h1 class="glow-text">Vote Your Favorite</h1>
      <p>Select category → choose nominee → vote</p>
    </div>

    <!-- MAIN -->
    <v-container>

      <!-- STEPPER -->
      <v-stepper v-model="step" class="stepper">

        <v-stepper-header>
          <v-stepper-step :complete="step > 1" step="1">Category</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step :complete="step > 2" step="2">Nominee</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step :complete="step > 3" step="3">Vote</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step step="4">Payment</v-stepper-step>
        </v-stepper-header>

        <!-- STEP 1 -->
        <v-stepper-items>

          <v-stepper-content step="1">
            <v-select
              v-model="selectedCategory"
              :items="categories"
              item-text="name"
              item-value="id"
              label="Select Category"
              outlined dense
              @change="fetchNominees"
            />
          </v-stepper-content>

          <!-- STEP 2 -->
          <v-stepper-content step="2">

            <div class="grid">
              <v-card
                v-for="nominee in nominees"
                :key="nominee.id"
                class="nominee-card"
                @click="selectNominee(nominee)"
              >
                <h3>{{ nominee.name }}</h3>
                <small>{{ nominee.church }}</small>
              </v-card>
            </div>

          </v-stepper-content>

          <!-- STEP 3 -->
          <v-stepper-content step="3">

            <v-card class="pa-4 cinematic-card">

              <h3>Voting for</h3>
              <h2 class="glow-text">{{ nomineeName }}</h2>

              <v-text-field
                v-model="voteCount"
                label="Number of Votes"
                type="number"
                outlined
                @input="calculateAmount"
              />

              <p>Total: {{ numeral(amount).format("0,0") }} Ksh</p>

              <v-btn block class="cta-btn" @click="openPaymentDialog">
                Proceed to Pay
              </v-btn>

            </v-card>

          </v-stepper-content>

        </v-stepper-items>

      </v-stepper>

    </v-container>

    <!-- PAYMENT -->
    <v-dialog v-model="paymentDialog" max-width="400">
      <v-card class="cinematic-card pa-4">

        <h3>Enter M-Pesa Number</h3>

        <v-text-field
          v-model="phoneNumber"
          prefix="254"
          outlined
        />

        <v-btn block class="cta-btn" @click="processPayment">
          Pay & Vote
        </v-btn>

        <v-progress-linear v-if="progress_bar" indeterminate />

      </v-card>
    </v-dialog>

    <!-- CONFIRM -->
    <v-dialog v-model="paymentConfirmDialog" max-width="400">
      <v-card class="cinematic-card text-center pa-4">
        <h2 class="glow-text">Vote Confirmed 🎉</h2>
        <p>You voted {{ voteCount }} times for {{ nomineeName }}</p>
      </v-card>
    </v-dialog>


     <v-dialog v-model="paymentConfirmDialog" max-width="400px">
                <v-card class="text-center" style="padding: 1rem;">
                    <v-img src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExNGxrZTVjZ254ajR0NXVnMWV4NWYxcTBheTZ1cDA5bTJiM2c5NTV6NCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/jtd26qRGDzgjiqcwbp/giphy.gif" contain height="150px"></v-img>
                    <br>
                    <h5>Voting Confirmed</h5>
                    <v-card-text>
                        <br>

                        <div class="d-flex" style="padding: 0.8rem;border-radius: 1rem;background-color: antiquewhite;color: black;">
                            <p style="font-size: 0.9rem;">Thank you for voting. Your <b> {{ voteCount }} Vote (s) </b> for {{ nomineeName }} has been successfully recorded
                            </p>
                        </div>
                        <v-progress-linear v-show="progress_bar" indeterminate color="black"></v-progress-linear>

                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <div>

                            <v-btn text @click="paymentConfirmDialog = false">Close</v-btn>
                        </div>
                        <v-spacer></v-spacer>
                    </v-card-actions>
                </v-card>
            </v-dialog>

  </v-app>
</template>

<script>
import axios from "axios";
import numeral from "numeral";

export default {
  data() {
    return {
      numeral,
      logo: require("@/assets/logo.png"),

      step: 1,
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
      progress_bar: false,

      CheckoutRequestID: null
    };
  },

  async mounted() {
    this.fetchCategories();
  },

  methods: {

    async fetchCategories() {
      const { data } = await axios.get(
        "https://amacserver-production-48fd.up.railway.app/api/categories/getAll"
      );
      this.categories = data;
    },

    async fetchNominees() {
      this.step = 2;

      const { data } = await axios.get(
        `https://amacserver-production-48fd.up.railway.app/api/nominee/nominees/${this.selectedCategory}`
      );

      this.nominees = data;
    },

    selectNominee(nominee) {
      this.selectedNominee = nominee.id;
      this.nomineeName = nominee.name;
      this.step = 3;
    },

    calculateAmount() {
      this.amount = this.voteCount * 10;
    },

    openPaymentDialog() {
      this.paymentDialog = true;
    },

    async processPayment() {
      this.progress_bar = true;

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

      setTimeout(() => {
        this.paymentDialog = false;
        this.paymentConfirmDialog = true;
        this.progress_bar = false;
      }, 5000);
    }

  }
};
</script>

<style>
.app-bg {
  background: #000;
  color: #e5e5e5;
}

/* HERO */
.hero {
  text-align: center;
  padding: 120px 20px 40px;
}

/* NAV */
.glass-nav {
  background: rgba(0,0,0,0.9) !important;
}

/* GLOW */
.glow-text {
  color: gold;
  text-shadow: 0 0 12px rgba(255,215,0,0.6);
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
  cursor: pointer;
  transition: 0.3s;
  border: 1px solid rgba(255,255,255,0.05);
}

.nominee-card:hover {
  transform: scale(1.05);
  border-color: gold;
}

/* BUTTON */
.cta-btn {
  background: gold !important;
  color: black !important;
  font-weight: bold;
}

/* CARD */
.cinematic-card {
  background: #0f0f0f !important;
}
</style>