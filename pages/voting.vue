<template>
  <v-app class="app-bg">
    <!-- NAV -->
    <v-app-bar app dark class="glass-nav" elevate-on-scroll>
      <div class="d-flex align-center">
        <v-avatar size="36" class="nav-avatar">
          <v-img :src="logo" />
        </v-avatar>
        <span class="ml-3 brand">AMAC Voting</span>
      </div>
      <v-spacer />
      <v-btn class="cta-btn nav-btn" rounded @click="$router.push('/')">
        <v-icon left small>mdi-arrow-left</v-icon>
        Back Home
      </v-btn>
    </v-app-bar>

    <!-- HERO -->
    <section class="ankara-hero">
      <div class="hero-content">
        <span class="hero-pill">
          <v-icon small left color="gold">mdi-trophy</v-icon>
          AMAC Awards Voting
        </span>
        <h1 class="hero-title">Vote Your Favorite</h1>
        <p class="hero-subtitle">
          Celebrate talent, worship, and excellence in Adventist music.
        </p>
      </div>
    </section>

    <v-container class="main-container">
      <!-- Global Status Banner -->
      <v-slide-y-transition>
        <v-alert
          v-if="globalStatus.show"
          :type="globalStatus.type"
          :icon="globalStatus.icon"
          class="mb-4 status-banner"
          prominent
          dismissible
          @input="globalStatus.show = false"
        >
          <strong>{{ globalStatus.title }}</strong><br>
          {{ globalStatus.message }}
        </v-alert>
      </v-slide-y-transition>

      <!-- Mobile Instructions -->
      <v-expansion-panels class="mobile-guide mb-4" dark>
        <v-expansion-panel class="mobile-guide-panel">
          <v-expansion-panel-header>
            <span class="glow-text">
              <v-icon small left color="gold">mdi-information</v-icon>
              How to Vote
            </span>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <div class="mobile-guide-list">
              <p><span class="step-num">01</span> Select a category</p>
              <p><span class="step-num">02</span> Choose a nominee</p>
              <p><span class="step-num">03</span> Enter number of votes</p>
              <p><span class="step-num">04</span> Enter M-Pesa number</p>
              <p><span class="step-num">05</span> Accept STK push on your phone</p>
              <p><span class="step-num">06</span> Wait for confirmation</p>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>

      <v-row>
        <!-- LEFT: Voting Flow -->
        <v-col cols="12" md="7">
          <!-- Progress Steps -->
          <div class="steps-wrap">
            <div
              v-for="(step, idx) in steps"
              :key="idx"
              class="step-box"
              :class="{ active: step.active, completed: step.completed }"
            >
              <v-icon v-if="step.completed" small color="black">mdi-check</v-icon>
              <span v-else>{{ step.num }}</span>
              <p>{{ step.label }}</p>
            </div>
          </div>

          <!-- Category Selection -->
          <v-card class="glass-card pa-5 mb-5" :class="{ 'pulse-border': !selectedCategory }">
            <div class="d-flex align-center mb-3">
              <v-icon left color="gold">mdi-view-grid</v-icon>
              <h3 class="section-title mb-0">Select Category</h3>
              <v-spacer />
              <v-chip v-if="selectedCategory" x-small color="gold" dark class="status-chip">
                Selected
              </v-chip>
            </div>
            <v-select
              v-model="selectedCategory"
              :items="categories"
              item-text="name"
              item-value="id"
              label="Choose award category"
              outlined
              dark
              hide-details
              :loading="loadingCategories"
              :disabled="loadingCategories"
              @change="onCategoryChange"
            />
            <v-fade-transition>
              <div v-if="loadingCategories" class="mt-3 d-flex align-center">
                <v-progress-circular indeterminate size="16" color="gold" class="mr-2" />
                <span class="caption grey--text">Loading categories...</span>
              </div>
            </v-fade-transition>
          </v-card>

          <!-- Nominees -->
          <v-slide-y-transition>
            <v-card v-if="nominees.length" class="glass-card pa-5 mb-5">
              <div class="d-flex align-center mb-3">
                <v-icon left color="gold">mdi-account-group</v-icon>
                <h3 class="section-title mb-0">Choose Nominee</h3>
                <v-spacer />
                <span class="caption grey--text">{{ nominees.length }} nominee(s)</span>
              </div>
              <div class="grid">
                <div
                  v-for="n in nominees"
                  :key="n.id"
                  class="nominee-card"
                  :class="{ selected: selectedNominee === n.id }"
                  @click="selectNominee(n)"
                >
                  <div class="gold-bar" />
                  <v-avatar size="48" class="mb-2" color="rgba(255,215,0,0.1)">
                    <v-icon color="gold">mdi-account-music</v-icon>
                  </v-avatar>
                  <h3>{{ n.name }}</h3>
                  <small>{{ n.church || "AMAC Nominee" }}</small>
                  <v-fade-transition>
                    <div v-if="selectedNominee === n.id" class="selected-indicator">
                      <v-icon small color="gold">mdi-check-circle</v-icon>
                      Selected
                    </div>
                  </v-fade-transition>
                </div>
              </div>
              <v-fade-transition>
                <div v-if="loadingNominees" class="mt-3 d-flex align-center">
                  <v-progress-circular indeterminate size="16" color="gold" class="mr-2" />
                  <span class="caption grey--text">Loading nominees...</span>
                </div>
              </v-fade-transition>
            </v-card>
          </v-slide-y-transition>

          <!-- Vote Panel -->
          <v-slide-y-transition>
            <v-card v-if="selectedNominee" class="vote-panel pa-5">
              <div class="selected-label">Selected Nominee</div>
              <h2 class="glow-text">{{ nomineeName }}</h2>
              <p class="caption grey--text mb-4">Each vote costs Ksh 10</p>

              <v-text-field
                v-model="voteCount"
                type="number"
                label="Number of Votes"
                outlined
                dark
                hide-details
                min="1"
                prepend-inner-icon="mdi-vote"
                @input="calculateAmount"
              />

              <div class="amount-box mt-4">
                <div>
                  <span class="caption">Total Amount</span>
                  <div class="amount-value">{{ amount }} <span class="currency">Ksh</span></div>
                </div>
                <v-icon large color="gold">mdi-cash-multiple</v-icon>
              </div>

              <v-btn block class="cta-btn mt-5" height="48" @click="openPayment">
                <v-icon left>mdi-cellphone-check</v-icon>
                Proceed to Payment
              </v-btn>
            </v-card>
          </v-slide-y-transition>
        </v-col>

        <!-- RIGHT: Desktop Guide -->
        <v-col cols="12" md="5" class="desktop-guide">
          <v-card class="instruction-card pa-6">
            <h2 class="glow-text mb-4 d-flex align-center">
              <v-icon left color="gold">mdi-lightbulb-on</v-icon>
              How to Vote
            </h2>

            <div
              v-for="(inst, i) in instructions"
              :key="i"
              class="instruction-step"
              :class="{ active: inst.active }"
            >
              <span class="inst-num">{{ inst.num }}</span>
              <div>
                <p class="inst-title">{{ inst.title }}</p>
                <p class="inst-desc">{{ inst.desc }}</p>
              </div>
            </div>

            <v-divider class="my-4" dark />

            <div class="notice-box">
              <v-icon left small color="gold">mdi-alert-circle</v-icon>
              <div>
                <strong>Note:</strong><br>
                Keep this page open until the payment status is shown. Do not refresh or close the browser.
              </div>
            </div>

            <div class="trust-badges mt-4 d-flex justify-space-around">
              <div class="trust-item text-center">
                <v-icon color="gold">mdi-shield-check</v-icon>
                <div class="caption">Secure</div>
              </div>
              <div class="trust-item text-center">
                <v-icon color="gold">mdi-clock-fast</v-icon>
                <div class="caption">Instant</div>
              </div>
              <div class="trust-item text-center">
                <v-icon color="gold">mdi-receipt</v-icon>
                <div class="caption">Receipt</div>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- PAYMENT DIALOG -->
    <v-dialog v-model="paymentDialog" max-width="460" persistent>
      <v-card class="cinematic-card pa-6 text-center">
        <v-btn icon small absolute top right @click="closePaymentDialog">
          <v-icon color="grey">mdi-close</v-icon>
        </v-btn>

        <!-- State: Entering Phone -->
        <div v-if="!timerEnabled && !processingResult">
          <v-icon size="48" color="gold" class="mb-3">mdi-cellphone-message</v-icon>
          <h3 class="glow-text mb-2">M-Pesa Payment</h3>
          <p class="body-2 grey--text mb-4">
            You will receive an STK push on your phone. Enter your M-Pesa PIN to confirm.
          </p>

          <v-text-field
            v-model="phoneNumber"
            prefix="254"
            label="M-Pesa Number"
            outlined
            dark
            hide-details
            class="mb-4"
            prepend-inner-icon="mdi-phone"
          />

          <div class="summary-box mb-4">
            <div class="d-flex justify-space-between caption">
              <span>Nominee</span>
              <span class="white--text">{{ nomineeName }}</span>
            </div>
            <div class="d-flex justify-space-between caption mt-1">
              <span>Votes</span>
              <span class="white--text">{{ voteCount }}</span>
            </div>
            <v-divider dark class="my-2" />
            <div class="d-flex justify-space-between">
              <span class="subtitle-2">Total</span>
              <span class="subtitle-1 gold--text font-weight-bold">{{ amount }} Ksh</span>
            </div>
          </div>

          <v-btn block class="cta-btn" height="48" :loading="loading" :disabled="loading || !phoneNumber" @click="processPayment">
            <v-icon left>mdi-send</v-icon>
            Send STK Push
          </v-btn>
        </div>

        <!-- State: STK Sent / Waiting -->
        <div v-else-if="timerEnabled && !processingResult" class="payment-wait">
          <v-icon size="48" color="gold" class="mb-3 pulsing-icon">mdi-cellphone-sound</v-icon>
          <h3 class="glow-text mb-2">Check Your Phone</h3>
          <p class="body-2 grey--text mb-4">
            An M-Pesa prompt has been sent to <strong class="white--text">254{{ phoneNumber }}</strong>. Enter your PIN to complete payment.
          </p>

          <div class="timer-container">
            <svg class="timer-svg" viewBox="0 0 100 100">
              <circle class="timer-bg" cx="50" cy="50" r="45" />
              <circle
                class="timer-progress"
                cx="50"
                cy="50"
                r="45"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="timerOffset"
              />
            </svg>
            <div class="timer-text">{{ timerCount }}</div>
          </div>

          <h4 class="gold--text mt-3">Waiting for Confirmation</h4>
          <p class="caption grey--text">Please do not close this window</p>

          <v-progress-linear indeterminate color="amber" class="mt-4" rounded />

          <div class="mt-4 caption grey--text">
            <v-icon x-small left>mdi-information</v-icon>
            If you don't see the prompt, dial <strong>*126#</strong> to check pending transactions.
          </div>
        </div>

        <!-- State: Querying / Processing -->
        <div v-else-if="processingResult" class="py-4">
          <v-progress-circular indeterminate size="64" color="gold" width="3" class="mb-4" />
          <h3 class="glow-text">Confirming Payment</h3>
          <p class="body-2 grey--text mt-2">Verifying your transaction with M-Pesa...</p>
        </div>
      </v-card>
    </v-dialog>

    <!-- RESULT DIALOG -->
    <v-dialog v-model="resultDialog" max-width="420" persistent>
      <v-card class="cinematic-card text-center pa-6">
        <v-scale-transition>
          <div>
            <v-icon
              size="64"
              :color="resultIconColor"
              class="mb-3"
            >
              {{ resultIcon }}
            </v-icon>
            <h2 :class="statusClass" class="mb-2">{{ resultTitle }}</h2>
            <p class="result-message body-2">{{ resultMessage }}</p>

            <v-alert
              v-if="resultDetails"
              :type="resultType"
              text
              class="mt-4 text-left"
              dense
            >
              {{ resultDetails }}
            </v-alert>

            <div class="d-flex gap-2 mt-5">
              <v-btn v-if="isSuccess" block class="cta-btn" @click="resetVote">
                <v-icon left>mdi-vote</v-icon>
                Vote Again
              </v-btn>
              <v-btn v-else-if="isRetryable" block class="cta-btn" @click="retryPayment">
                <v-icon left>mdi-refresh</v-icon>
                Try Again
              </v-btn>
              <v-btn v-else block text color="amber" @click="resultDialog = false">
                Close
              </v-btn>
            </div>
          </div>
        </v-scale-transition>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  name: "AmacVoting",
  data() {
    return {
      logo: require("@/assets/logo.png"),
      categories: [],
      nominees: [],
      loadingCategories: false,
      loadingNominees: false,

      selectedCategory: null,
      selectedNominee: null,
      nomineeName: "",

      voteCount: 1,
      amount: 10,
      phoneNumber: "",

      paymentDialog: false,
      resultDialog: false,
      loading: false,
      processingResult: false,

      timerCount: 25,
      timerEnabled: false,
      timerInterval: null,
      circumference: 2 * Math.PI * 45,

      CheckoutRequestID: null,
      queryLocked: false,

      resultTitle: "",
      resultMessage: "",
      resultDetails: "",
      resultIcon: "mdi-information",
      resultIconColor: "gold",
      resultType: "info",
      isSuccess: false,
      isRetryable: false,

      globalStatus: { show: false, type: "info", icon: "", title: "", message: "" },
    };
  },

  computed: {
    steps() {
      return [
        { num: "01", label: "Category", active: !!this.selectedCategory, completed: !!this.selectedCategory },
        { num: "02", label: "Nominee", active: !!this.selectedNominee && !this.selectedCategory, completed: !!this.selectedNominee },
        { num: "03", label: "Payment", active: this.paymentDialog || this.resultDialog, completed: this.isSuccess },
      ];
    },
    instructions() {
      return [
        { num: "01", title: "Select Category", desc: "Choose the award category you want to vote in.", active: !this.selectedCategory },
        { num: "02", title: "Choose Nominee", desc: "Pick your favorite artist or group from the list.", active: !!this.selectedCategory && !this.selectedNominee },
        { num: "03", title: "Enter Votes", desc: "Type how many votes you want to cast. Each vote is Ksh 10.", active: !!this.selectedNominee && !this.paymentDialog },
        { num: "04", title: "M-Pesa Prompt", desc: "Enter your M-Pesa number and tap 'Send STK Push'.", active: this.paymentDialog && !this.timerEnabled },
        { num: "05", title: "Enter PIN", desc: "Check your phone and enter your M-Pesa PIN on the prompt.", active: this.timerEnabled },
        { num: "06", title: "Confirmation", desc: "Wait for the system to confirm your payment (max 25 sec).", active: this.processingResult },
      ];
    },
    timerOffset() {
      const progress = (25 - this.timerCount) / 25;
      return this.circumference * progress;
    },
    statusClass() {
      if (this.isSuccess) return "success-text";
      if (this.resultType === "warning") return "warning-text";
      return "error-text";
    },
  },

  mounted() {
    this.fetchCategories();
  },

  beforeDestroy() {
    this.clearTimer();
  },

  methods: {
    clearTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
      this.timerEnabled = false;
      this.processingResult = false;
    },

    showGlobal(type, title, message) {
      this.globalStatus = { show: true, type, icon: type === "error" ? "mdi-alert" : "mdi-information", title, message };
      setTimeout(() => (this.globalStatus.show = false), 6000);
    },

    async fetchCategories() {
      this.loadingCategories = true;
      try {
        const { data } = await axios.get("https://amacserver-production-8cab.up.railway.app/api/categories/getAll");
        this.categories = data;
      } catch (err) {
        console.error("fetchCategories error:", err);
        this.showGlobal("error", "Connection Error", "Failed to load categories. Please check your internet and refresh.");
      } finally {
        this.loadingCategories = false;
      }
    },

    async onCategoryChange() {
      this.selectedNominee = null;
      this.nomineeName = "";
      this.nominees = [];
      await this.fetchNominees();
    },

    async fetchNominees() {
      if (!this.selectedCategory) return;
      this.loadingNominees = true;
      try {
        const { data } = await axios.get(
          `https://amacserver-production-8cab.up.railway.app/api/nominee/nominees/${this.selectedCategory}`
        );
        this.nominees = data;
      } catch (err) {
        console.error("fetchNominees error:", err);
        this.showGlobal("error", "Error", "Failed to load nominees. Please try again.");
      } finally {
        this.loadingNominees = false;
      }
    },

    selectNominee(n) {
      this.selectedNominee = n.id;
      this.nomineeName = n.name;
    },

    calculateAmount() {
      const votes = Math.max(0, Number(this.voteCount || 0));
      this.voteCount = votes;
      this.amount = votes * 10;
    },

    openPayment() {
      if (!this.voteCount || this.amount <= 0) {
        this.showGlobal("warning", "Invalid Votes", "Please enter at least 1 vote to proceed.");
        return;
      }
      this.paymentDialog = true;
      this.phoneNumber = "";
    },

    closePaymentDialog() {
      if (this.timerEnabled) {
        if (!confirm("Payment is in progress. Closing will cancel the check. Continue?")) return;
      }
      this.paymentDialog = false;
      this.clearTimer();
      this.queryLocked = false;
      this.CheckoutRequestID = null;
    },

    async processPayment() {
      if (!this.selectedCategory) {
        this.showResult("Missing Category", "Please select a category first.", false, "warning");
        return;
      }
      if (!this.selectedNominee) {
        this.showResult("Missing Nominee", "Please select a nominee first.", false, "warning");
        return;
      }
      if (!this.voteCount || Number(this.voteCount) <= 0) {
        this.showResult("Invalid Votes", "Please enter a valid number of votes.", false, "warning");
        return;
      }
      if (!this.phoneNumber || this.phoneNumber.length < 9) {
        this.showGlobal("warning", "Invalid Number", "Please enter a valid M-Pesa number.");
        return;
      }

      this.loading = true;
      this.CheckoutRequestID = null;
      this.queryLocked = false;

      try {
        const res = await axios.post("https://amacserver-production-8cab.up.railway.app/payment/mpesa_stk_push", {
          phone: "254" + this.phoneNumber,
          amount: this.amount,
          vote_count: this.voteCount,
          candidate_id: this.selectedNominee,
          category_id: this.selectedCategory,
        });

        this.CheckoutRequestID = res.data.CheckoutRequestID;

        if (!this.CheckoutRequestID) {
          this.loading = false;
          this.showResult("Payment Failed", "Failed to initiate M-Pesa payment. Please try again.", false, "error");
          return;
        }

        this.loading = false;
        this.timerEnabled = true;
        this.startTimer();
      } catch (err) {
        this.loading = false;
        console.error("STK PUSH ERROR:", err);
        const msg = err.response?.data?.message || err.response?.data?.error || "Failed to start payment. Please try again.";
        this.showResult("Payment Error", msg, false, "error");
      }
    },

    startTimer() {
      this.timerCount = 25;
      this.timerInterval = setInterval(() => {
        this.timerCount--;
        if (this.timerCount <= 0) {
          this.clearTimer();
          if (!this.queryLocked && this.CheckoutRequestID) {
            this.queryLocked = true;
            this.processingResult = true;
            this.stkQuery();
          }
        }
      }, 1000);
    },

    async stkQuery() {
      try {
        const { data } = await axios.post(
          "https://amacserver-production-8cab.up.railway.app/payment/mpesa_stk_push/query",
          { CheckoutRequestID: this.CheckoutRequestID }
        );

        console.log("QUERY RESPONSE:", data);

        this.paymentDialog = false;
        this.processingResult = false;

        // Handle fault/rate limit errors from backend
        if (data.fault) {
          const faultString = data.fault.faultstring || "";
          if (faultString.includes("SpikeArrestViolation")) {
            this.showResult(
              "Server Busy",
              "Too many requests right now. Please wait 60 seconds and try again.",
              true,
              "warning"
            );
            return;
          }
          this.showResult("Error", faultString, false, "error");
          return;
        }

        const resultCode = data.ResultCode;
        const resultDesc = data.ResultDesc || "";

        if (resultCode == 0 || resultCode === "0") {
          this.showResult("Success!", "Your vote has been recorded successfully. Thank you for supporting Adventist music!", false, "success");
          return;
        }
        if (resultCode == 1032 || resultCode === "1032") {
          this.showResult("Cancelled", "You cancelled the payment on your phone. No money was deducted.", false, "warning", true);
          return;
        }
        if (resultCode == 2001 || resultCode === "2001") {
          this.showResult("Wrong PIN", "You entered the wrong M-Pesa PIN. Please try again.", false, "warning", true);
          return;
        }
        if (resultCode == 1 || resultCode === "1") {
          this.showResult("Insufficient Balance", "Your M-Pesa balance is too low for this transaction.", false, "warning", true);
          return;
        }
        if (resultCode == 1001 || resultCode === "1001") {
          this.showResult("Invalid Number", "The phone number format is incorrect.", false, "warning", true);
          return;
        }
        if (resultCode == 1002 || resultCode === "1002") {
          this.showResult("Timeout", "The M-Pesa request timed out. Please check if you received the prompt and try again.", false, "warning", true);
          return;
        }

        // Unknown / still processing
        this.showResult("Processing...", resultDesc || "Your payment is being confirmed. Please check your M-Pesa messages for updates.", true, "info");
      } catch (error) {
        console.error("QUERY ERROR:", error);
        this.paymentDialog = false;
        this.processingResult = false;
        this.showResult(
          "Network Error",
          "Could not reach the payment server. Please check your internet and verify your M-Pesa balance/SMS for confirmation.",
          true,
          "warning"
        );
      }
    },

    showResult(title, msg, processing, type = "info", retryable = false) {
      this.resultDialog = true;
      this.resultTitle = title;
      this.resultMessage = msg;
      this.processingResult = processing;
      this.isRetryable = retryable;
      this.isSuccess = type === "success";
      this.resultType = type;

      const icons = {
        success: { icon: "mdi-check-circle", color: "#76ff7a" },
        error: { icon: "mdi-close-circle", color: "#ff4d4d" },
        warning: { icon: "mdi-alert-circle", color: "#ffb74d" },
        info: { icon: "mdi-information", color: "gold" },
      };
      const cfg = icons[type] || icons.info;
      this.resultIcon = cfg.icon;
      this.resultIconColor = cfg.color;

      if (type === "success") {
        this.resultDetails = `You voted ${this.voteCount} time(s) for ${this.nomineeName}. Total paid: Ksh ${this.amount}.`;
      } else if (type === "warning" && retryable) {
        this.resultDetails = "No money was deducted. You can safely try again.";
      } else {
        this.resultDetails = "";
      }
    },

    retryPayment() {
      this.resultDialog = false;
      this.paymentDialog = true;
      this.clearTimer();
      this.queryLocked = false;
      this.loading = false;
      this.processingResult = false;
    },

    resetVote() {
      this.resultDialog = false;
      this.selectedCategory = null;
      this.selectedNominee = null;
      this.nomineeName = "";
      this.voteCount = 1;
      this.amount = 10;
      this.phoneNumber = "";
      this.nominees = [];
      this.isSuccess = false;
      this.clearTimer();
    },
  },
};
</script>

<style scoped>
.app-bg {
  background: #000;
  color: white;
  min-height: 100vh;
  overflow-x: hidden;
}

/* NAV */
.glass-nav {
  background: rgba(0, 0, 0, 0.92) !important;
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255, 215, 0, 0.15);
}
.nav-avatar {
  border: 2px solid rgba(255, 215, 0, 0.3);
}
.brand {
  color: gold;
  font-weight: 800;
  letter-spacing: 0.5px;
  font-size: 1.15rem;
}
.nav-btn {
  padding-left: 18px !important;
  padding-right: 18px !important;
}

/* HERO */
.ankara-hero {
  min-height: 260px;
  padding: 100px 20px 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background:
    radial-gradient(circle at 30% 20%, rgba(255, 215, 0, 0.15), transparent 50%),
    radial-gradient(circle at 70% 80%, rgba(255, 215, 0, 0.08), transparent 40%),
    linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.95)),
    repeating-linear-gradient(45deg, rgba(255, 215, 0, 0.08) 0px, rgba(255, 215, 0, 0.08) 1px, transparent 1px, transparent 36px),
    repeating-linear-gradient(-45deg, rgba(255, 215, 0, 0.05) 0px, rgba(255, 215, 0, 0.05) 1px, transparent 1px, transparent 42px),
    #000;
}
.hero-content { max-width: 760px; }
.hero-pill {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border: 1px solid rgba(255, 215, 0, 0.35);
  border-radius: 999px;
  color: gold;
  font-size: 0.8rem;
  margin-bottom: 16px;
  background: rgba(255, 215, 0, 0.08);
  gap: 6px;
}
.hero-title {
  font-size: clamp(2.2rem, 5vw, 3.8rem);
  font-weight: 900;
  color: gold;
  text-shadow: 0 0 24px rgba(255, 215, 0, 0.5);
  margin-bottom: 12px;
  line-height: 1.1;
}
.hero-subtitle {
  opacity: 0.75;
  font-size: 1.05rem;
  max-width: 500px;
  margin: 0 auto;
}

/* MAIN */
.main-container {
  margin-top: 32px;
  padding-bottom: 80px;
}
.status-banner {
  border-radius: 14px !important;
  background: rgba(17, 17, 17, 0.95) !important;
}

/* MOBILE GUIDE */
.mobile-guide { display: none; }
.mobile-guide-panel {
  background: rgba(17, 17, 17, 0.95) !important;
  border: 1px solid rgba(255, 215, 0, 0.16);
  border-radius: 16px !important;
}
.mobile-guide-list p {
  margin-bottom: 10px;
  opacity: 0.85;
  display: flex;
  align-items: center;
  gap: 10px;
}
.step-num {
  color: gold;
  font-weight: 900;
  min-width: 24px;
}

/* STEPS */
.steps-wrap {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  gap: 0;
}
.step-box {
  flex: 1;
  background: rgba(17, 17, 17, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  padding: 14px 10px;
  text-align: center;
  transition: all 0.35s ease;
  position: relative;
}
.step-box:not(:last-child) {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-right: none;
}
.step-box:not(:first-child) {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
.step-box span, .step-box .v-icon {
  display: block;
  color: gold;
  font-weight: 900;
  font-size: 0.9rem;
  margin: 0 auto 4px;
}
.step-box p {
  margin: 0;
  font-size: 0.78rem;
  opacity: 0.6;
}
.step-box.active {
  background: linear-gradient(135deg, gold, #ffcc00);
  color: black;
  border-color: gold;
  box-shadow: 0 0 24px rgba(255, 215, 0, 0.3);
}
.step-box.active span, .step-box.active .v-icon { color: black; }
.step-box.active p { opacity: 1; font-weight: 600; }
.step-box.completed {
  background: rgba(255, 215, 0, 0.12);
  border-color: rgba(255, 215, 0, 0.4);
}

/* CARDS */
.glass-card, .vote-panel, .instruction-card, .cinematic-card {
  background: rgba(17, 17, 17, 0.94) !important;
  border: 1px solid rgba(255, 215, 0, 0.12);
  border-radius: 20px !important;
  backdrop-filter: blur(14px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  transition: border-color 0.3s ease;
}
.pulse-border {
  animation: borderPulse 2s ease-in-out infinite;
}
@keyframes borderPulse {
  0%, 100% { border-color: rgba(255, 215, 0, 0.12); }
  50% { border-color: rgba(255, 215, 0, 0.4); }
}
.section-title {
  color: gold;
  font-weight: 800;
  font-size: 1.1rem;
}
.status-chip {
  font-weight: 700;
  letter-spacing: 0.3px;
}

/* NOMINEES */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}
.nominee-card {
  background: linear-gradient(145deg, rgba(22, 22, 22, 0.98), rgba(5, 5, 5, 0.98));
  padding: 20px 16px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 215, 0, 0.08);
  position: relative;
  overflow: hidden;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.nominee-card:hover {
  border-color: gold;
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(255, 215, 0, 0.15);
}
.nominee-card.selected {
  border-color: gold;
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.25);
  background: linear-gradient(145deg, rgba(40, 35, 10, 0.95), rgba(15, 12, 2, 0.98));
}
.gold-bar {
  height: 3px;
  width: 40%;
  background: linear-gradient(90deg, transparent, gold, transparent);
  margin: 0 auto 12px;
  border-radius: 20px;
}
.nominee-card h3 {
  font-size: 1rem;
  margin-bottom: 4px;
  font-weight: 700;
}
.nominee-card small {
  display: block;
  opacity: 0.5;
  font-size: 0.78rem;
}
.selected-indicator {
  margin-top: 8px;
  color: gold;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

/* VOTE PANEL */
.selected-label {
  font-size: 0.75rem;
  opacity: 0.5;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 6px;
}
.amount-box {
  padding: 18px 20px;
  border-radius: 16px;
  background: rgba(255, 215, 0, 0.06);
  border: 1px solid rgba(255, 215, 0, 0.15);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.amount-value {
  color: gold;
  font-size: 1.6rem;
  font-weight: 900;
}
.currency {
  font-size: 0.9rem;
  opacity: 0.7;
  font-weight: 500;
}

/* INSTRUCTIONS */
.desktop-guide { display: block; }
.instruction-step {
  display: flex;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  opacity: 0.6;
  transition: all 0.3s ease;
}
.instruction-step.active {
  opacity: 1;
  background: rgba(255, 215, 0, 0.04);
  margin: 0 -12px;
  padding: 14px 12px;
  border-radius: 12px;
}
.inst-num {
  color: gold;
  font-weight: 900;
  font-size: 1rem;
  min-width: 28px;
}
.inst-title {
  margin: 0 0 2px;
  font-weight: 600;
  font-size: 0.92rem;
}
.inst-desc {
  margin: 0;
  font-size: 0.82rem;
  opacity: 0.7;
}
.notice-box {
  margin-top: 16px;
  background: rgba(255, 215, 0, 0.06);
  border-left: 4px solid gold;
  padding: 14px 16px;
  border-radius: 12px;
  display: flex;
  gap: 10px;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.8);
}
.trust-badges { margin-top: 20px; }
.trust-item .v-icon { margin-bottom: 4px; }
.trust-item .caption { opacity: 0.6; font-size: 0.7rem; }

/* BUTTON */
.cta-btn {
  background: linear-gradient(135deg, gold, #ffcc00) !important;
  color: black !important;
  font-weight: 900;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 20px rgba(255, 215, 0, 0.35);
  transition: all 0.25s ease;
}
.cta-btn:hover {
  box-shadow: 0 6px 28px rgba(255, 215, 0, 0.5);
  transform: translateY(-1px);
}

/* PAYMENT DIALOG */
.summary-box {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 14px 16px;
  text-align: left;
}

/* TIMER */
.timer-container {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto;
}
.timer-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}
.timer-bg {
  fill: none;
  stroke: rgba(255, 255, 255, 0.08);
  stroke-width: 4;
}
.timer-progress {
  fill: none;
  stroke: gold;
  stroke-width: 4;
  stroke-linecap: round;
  transition: stroke-dashoffset 1s linear;
}
.timer-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: gold;
  font-weight: 900;
  font-size: 1.6rem;
}
.pulsing-icon {
  animation: pulse 1.5s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.1); }
}
.payment-wait h4 {
  color: gold;
  margin-top: 12px;
  font-size: 1.1rem;
}

/* RESULT */
.success-text { color: #76ff7a; }
.error-text { color: #ff4d4d; }
.warning-text { color: #ffb74d; }
.glow-text {
  color: gold;
  text-shadow: 0 0 14px rgba(255, 215, 0, 0.5);
}
.result-message { opacity: 0.85; line-height: 1.5; }
.gap-2 { gap: 8px; }

/* MOBILE */
@media (max-width: 768px) {
  .nav-btn {
    padding-left: 12px !important;
    padding-right: 12px !important;
    font-size: 0.75rem !important;
  }
  .ankara-hero {
    min-height: 180px;
    padding: 84px 16px 28px;
  }
  .hero-title { font-size: 2.1rem; }
  .hero-subtitle { font-size: 0.88rem; }
  .main-container {
    margin-top: 20px;
    padding-left: 14px;
    padding-right: 14px;
  }
  .mobile-guide { display: block; }
  .desktop-guide { display: none; }
  .steps-wrap { overflow-x: auto; padding-bottom: 4px; }
  .step-box { min-width: 90px; padding: 10px 8px; }
  .step-box p { font-size: 0.72rem; }
  .grid { grid-template-columns: 1fr; gap: 12px; }
  .nominee-card { padding: 18px 14px; }
}
</style>