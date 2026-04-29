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

        <v-btn class="cta-btn nav-btn" rounded @click="$router.push('/')">
            Back Home
        </v-btn>
    </v-app-bar>

    <!-- ANKARA HERO -->
    <section class="ankara-hero">
        <div class="hero-content">
            <span class="hero-pill">AMAC Awards Voting</span>

            <h1 class="hero-title">
                Vote Your Favorite
            </h1>

            <p class="hero-subtitle">
                Celebrate talent, worship, and excellence in Adventist music.
            </p>
        </div>
    </section>

    <v-container class="main-container">

        <!-- MOBILE INSTRUCTIONS -->
        <v-expansion-panels class="mobile-guide mb-4" dark>
            <v-expansion-panel class="mobile-guide-panel">
                <v-expansion-panel-header>
                    <span class="glow-text">How to Vote</span>
                </v-expansion-panel-header>

                <v-expansion-panel-content>
                    <div class="mobile-guide-list">
                        <p><strong>01</strong> Select category</p>
                        <p><strong>02</strong> Choose nominee</p>
                        <p><strong>03</strong> Enter votes</p>
                        <p><strong>04</strong> Confirm M-Pesa STK</p>
                        <p><strong>05</strong> Wait 25 seconds</p>
                    </div>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>

        <v-row>

            <!-- LEFT SIDE -->
            <v-col cols="12" md="7">

                <!-- STEPS -->
                <div class="steps-wrap">
                    <div class="step-box" :class="{ active: selectedCategory }">
                        <span>01</span>
                        <p>Category</p>
                    </div>

                    <div class="step-line"></div>

                    <div class="step-box" :class="{ active: selectedNominee }">
                        <span>02</span>
                        <p>Nominee</p>
                    </div>

                    <div class="step-line"></div>

                    <div class="step-box" :class="{ active: paymentDialog || resultDialog }">
                        <span>03</span>
                        <p>Payment</p>
                    </div>
                </div>

                <!-- CATEGORY -->
                <v-card class="glass-card pa-5 mb-5">
                    <h3 class="section-title">Select Category</h3>

                    <v-select v-model="selectedCategory" :items="categories" item-text="name" item-value="id" label="Choose award category" outlined dark hide-details @change="fetchNominees" />
                </v-card>

                <!-- NOMINEES -->
                <v-card v-if="nominees.length" class="glass-card pa-5">
                    <h3 class="section-title">Choose Nominee</h3>

                    <div class="grid">
                        <div v-for="n in nominees" :key="n.id" class="nominee-card" :class="{ selected: selectedNominee === n.id }" @click="selectNominee(n)">
                            <div class="gold-bar"></div>

                            <h3>{{ n.name }}</h3>

                            <small>
                                {{ n.church || "AMAC Nominee" }}
                            </small>
                        </div>
                    </div>
                </v-card>

                <!-- VOTE PANEL -->
                <v-card v-if="selectedNominee" class="vote-panel mt-6 pa-5">
                    <div class="selected-label">
                        Selected Nominee
                    </div>

                    <h2 class="glow-text">
                        {{ nomineeName }}
                    </h2>

                    <v-text-field v-model="voteCount" type="number" label="Votes" outlined dark hide-details @input="calculateAmount" />

                    <div class="amount-box">
                        <span>Total Amount</span>
                        <strong>{{ amount }} Ksh</strong>
                    </div>

                    <v-btn block class="cta-btn mt-4" @click="paymentDialog = true">
                        Proceed to Pay
                    </v-btn>
                </v-card>

            </v-col>

            <!-- RIGHT SIDE DESKTOP INSTRUCTIONS -->
            <v-col cols="12" md="5" class="desktop-guide">
                <v-card class="instruction-card pa-6">
                    <h2 class="glow-text mb-4">
                        How to Vote
                    </h2>

                    <div class="instruction-step">
                        <span>01</span>
                        <p>Select your award category.</p>
                    </div>

                    <div class="instruction-step">
                        <span>02</span>
                        <p>Choose the nominee you want to support.</p>
                    </div>

                    <div class="instruction-step">
                        <span>03</span>
                        <p>Enter the number of votes you want to cast.</p>
                    </div>

                    <div class="instruction-step">
                        <span>04</span>
                        <p>Enter your M-Pesa number and confirm the STK push.</p>
                    </div>

                    <div class="instruction-step">
                        <span>05</span>
                        <p>Wait for the 25-second confirmation check.</p>
                    </div>

                    <div class="notice-box">
                        <strong>Note:</strong><br />
                        Keep this page open until the payment status is shown.
                    </div>
                </v-card>
            </v-col>

        </v-row>
    </v-container>

    <!-- PAYMENT DIALOG -->
    <v-dialog v-model="paymentDialog" max-width="420" persistent>
        <v-card class="cinematic-card pa-5 text-center">

            <h3 class="glow-text mb-4">
                M-Pesa Payment
            </h3>

            <v-text-field v-model="phoneNumber" prefix="254" label="M-Pesa Number" outlined dark :disabled="loading || timerEnabled" />

            <v-btn block class="cta-btn" :disabled="loading || timerEnabled" @click="processPayment">
                Pay Now
            </v-btn>

            <div v-if="timerEnabled" class="payment-wait">
                <div class="timer-ring">
                    {{ timerCount }}
                </div>

                <h4>Waiting for M-Pesa confirmation</h4>
                <p>Check your phone and enter your PIN.</p>
            </div>

            <v-progress-linear v-if="loading" indeterminate color="amber" class="mt-4" />

        </v-card>
    </v-dialog>

    <!-- RESULT DIALOG -->
    <v-dialog v-model="resultDialog" max-width="420">
        <v-card class="cinematic-card text-center pa-6">

            <h2 :class="statusClass">
                {{ resultTitle }}
            </h2>

            <p class="result-message">
                {{ resultMessage }}
            </p>

            <v-btn v-if="!processing" class="cta-btn mt-4" @click="retryPayment">
                Try Again
            </v-btn>

            <v-btn v-if="processing" text color="amber" class="mt-4" @click="resultDialog = false">
                Close
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
            timerEnabled: false,
            show6: false,
            timerCount: 25,
            categories: [],
            nominees: [],

            selectedCategory: null,
            selectedNominee: null,
            nomineeName: "",

            voteCount: 1,
            amount: 10,

            phoneNumber: "",

            paymentDialog: false,
            resultDialog: false,

            resultTitle: "",
            resultMessage: "",
            processing: false,

            timerCount: 25,
            timerEnabled: false,
            timerInterval: null,

            CheckoutRequestID: null,
            queryLocked: false,

            loading: false
        };
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
        },

        async fetchCategories() {
            try {
                const {
                    data
                } = await axios.get(
                    "https://amacserver-production-48fd.up.railway.app/api/categories/getAll"
                );

                this.categories = data;
            } catch (err) {
                console.error("fetchCategories error:", err);
                this.showResult("Error", "Failed to load categories.", false);
            }
        },

        async fetchNominees() {
            try {
                if (!this.selectedCategory) return;

                const {
                    data
                } = await axios.get(
                    `https://amacserver-production-48fd.up.railway.app/api/nominee/nominees/${this.selectedCategory}`
                );

                this.nominees = data;

                this.selectedNominee = null;
                this.nomineeName = "";
            } catch (err) {
                console.error("fetchNominees error:", err);
                this.showResult("Error", "Failed to load nominees.", false);
            }
        },

        selectNominee(n) {
            this.selectedNominee = n.id;
            this.nomineeName = n.name;
        },

        calculateAmount() {
            const votes = Number(this.voteCount || 0);
            this.amount = votes * 10;
        },

        startTimer() {
            this.clearTimer();

            this.timerCount = 25;
            this.timerEnabled = true;

            this.timerInterval = setInterval(() => {
                if (this.timerCount <= 1) {
                    this.clearTimer();

                    this.stkQuery();

                    return;
                }

                this.timerCount--;
            }, 1000);
        },

        async processPayment() {
            if (this.loading || this.timerEnabled) return;

            if (!this.selectedCategory) {
                this.showResult("Missing Category", "Please select a category first.", false);
                return;
            }

            if (!this.selectedNominee) {
                this.showResult("Missing Nominee", "Please select a nominee first.", false);
                return;
            }

            if (!this.voteCount || Number(this.voteCount) <= 0) {
                this.showResult("Invalid Votes", "Please enter a valid number of votes.", false);
                return;
            }

            if (!this.phoneNumber) {
                this.showResult("Missing Number", "Please enter your M-Pesa number.", false);
                return;
            }

            this.loading = true;

            // this.clearTimer();
            // this.queryLocked = false;
            this.CheckoutRequestID = null;

            try {
                const res = await axios.post(
                    "https://amacserver-production-48fd.up.railway.app/payment/mpesa_stk_push", {
                        phone: "254" + this.phoneNumber,
                        amount: this.amount,
                        vote_count: this.voteCount,
                        candidate_id: this.selectedNominee,
                        category_id: this.selectedCategory
                    }
                );

                this.CheckoutRequestID = res.data.CheckoutRequestID;

                if (!this.CheckoutRequestID) {
                    this.loading = false;
                    this.showResult("Error", "Failed to initiate payment.", false);
                    return;
                }
                this.timerEnabled = true;
                this.timerCount = 25;

                this.loading = false;

                // this.showResult(
                //     "Processing...",
                //     "STK push sent. Enter your M-Pesa PIN, then wait for confirmation.",
                //     true
                // );

            } catch (err) {
                this.loading = false;
                console.error("STK PUSH ERROR:", err);
                this.showResult("Error", "Failed to start payment. Please try again.", false);
            }
        },
        stkQuery() {
            let that = this;
            axios
                .post("https://amacserver-production-48fd.up.railway.app/payment/mpesa_stk_push/query", {
                    CheckoutRequestID: that.CheckoutRequestID
                })
                .then(function (response) {
                    console.log("StkPush Query", response.data);
                    that.timerCount = 25;
                    that.timerEnabled = false;

                    if (response.status == 200) {

                        const data = response.data;

                        console.log("QUERY RESPONSE:", data);

                        that.paymentDialog = false;

                        if (data.ResultCode == 0 || data.ResultCode === "0") {
                            that.showResult("Success 🎉", "Vote recorded successfully.", false);
                            that.timerEnabled = false;
                            return;
                        }

                        if (data.ResultCode == 1032 || data.ResultCode === "1032") {
                            that.showResult("Cancelled", "Payment cancelled by user.", false);
                            that.timerEnabled = false;
                            return;
                        }

                        if (data.ResultCode == 2001 || data.ResultCode === "2001") {
                            that.showResult("Invalid PIN", "Wrong M-Pesa PIN entered.", false);
                            that.timerEnabled = false;
                            return;
                        }
                        if (data.ResultCode == 1 || data.ResultCode === "1") {
                            that.showResult("Insufficient Balance", "The balance is insufficient for the transaction..", false);
                            that.timerEnabled = false;
                            return;
                        }

                        that.showResult(
                            "Processing...",
                            data.ResultDesc || "Your payment is being confirmed. Please wait.",
                            true
                        );

                    }
                })
                .catch(function (error) {
                    console.error("QUERY ERROR:", error);

                    that.paymentDialog = false;
                    that.timerEnabled = false;
                    that.showResult(
                        "Processing...",
                        "Your payment is being confirmed. Please wait for the system to update.",
                        true
                    );
                });
        },
        showResult(title, msg, processing) {
            this.resultDialog = true;
            this.resultTitle = title;
            this.resultMessage = msg;
            this.processing = processing;
        },

        retryPayment() {
            this.resultDialog = false;
            this.paymentDialog = true;
            this.clearTimer();
            this.queryLocked = false;
            this.loading = false;
        }
    },
    watch: {
        timerEnabled(value) {
            if (value) {
                setTimeout(() => {
                    this.timerCount--;
                }, 1000);
            }
        },
        timerCount: {
            handler(value) {
                if (value > 0 && this.timerEnabled) {
                    setTimeout(() => {
                        this.timerCount--;
                    }, 1000);
                } else if (value == 0) {
                    this.stkQuery();
                    this.timerEnabled = false;
                    this.timerCount = 25;

                }
            },
            immediate: true, // This ensures the watcher is triggered upon creation
        },
    },
    computed: {
        statusClass() {
            if (this.resultTitle.includes("Success")) return "success-text";
            if (this.resultTitle.includes("Processing")) return "glow-text";
            return "error-text";
        }
    }
};
</script>

<style>
.app-bg {
    background: #000;
    color: white;
    min-height: 100vh;
    overflow-x: hidden;
}

/* NAV */
.glass-nav {
    background: rgba(0, 0, 0, 0.9) !important;
    backdrop-filter: blur(14px);
    border-bottom: 1px solid rgba(255, 215, 0, 0.15);
}

.brand {
    color: gold;
    font-weight: 800;
    letter-spacing: 0.4px;
}

.nav-btn {
    padding-left: 18px !important;
    padding-right: 18px !important;
}

/* ANKARA HERO */
.ankara-hero {
    min-height: 240px;
    padding: 96px 20px 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;

    background:
        radial-gradient(circle at center, rgba(255, 215, 0, 0.17), transparent 42%),
        linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.95)),
        repeating-linear-gradient(45deg,
            rgba(255, 215, 0, 0.12) 0px,
            rgba(255, 215, 0, 0.12) 2px,
            transparent 2px,
            transparent 34px),
        repeating-linear-gradient(-45deg,
            rgba(255, 215, 0, 0.07) 0px,
            rgba(255, 215, 0, 0.07) 2px,
            transparent 2px,
            transparent 40px),
        #000;
}

.hero-content {
    max-width: 760px;
}

.hero-pill {
    display: inline-block;
    padding: 7px 14px;
    border: 1px solid rgba(255, 215, 0, 0.35);
    border-radius: 999px;
    color: gold;
    font-size: 0.78rem;
    margin-bottom: 14px;
    background: rgba(255, 215, 0, 0.08);
}

.hero-title {
    font-size: clamp(2rem, 5vw, 3.6rem);
    font-weight: 900;
    color: gold;
    text-shadow: 0 0 20px rgba(255, 215, 0, 0.45);
    margin-bottom: 10px;
}

.hero-subtitle {
    opacity: 0.78;
    font-size: 1rem;
    margin-bottom: 0;
}

/* MAIN */
.main-container {
    margin-top: 28px;
    padding-bottom: 60px;
}

/* MOBILE GUIDE */
.mobile-guide {
    display: none;
}

.mobile-guide-panel {
    background: rgba(17, 17, 17, 0.95) !important;
    border: 1px solid rgba(255, 215, 0, 0.16);
    border-radius: 16px !important;
    overflow: hidden;
}

.mobile-guide-list p {
    margin-bottom: 8px;
    opacity: 0.82;
}

.mobile-guide-list strong {
    color: gold;
    margin-right: 8px;
}

/* STEPS */
.steps-wrap {
    display: flex;
    align-items: center;
    margin-bottom: 22px;
    gap: 10px;
}

.step-box {
    flex: 1;
    background: rgba(17, 17, 17, 0.92);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 14px;
    padding: 12px 10px;
    text-align: center;
    transition: 0.3s ease;
}

.step-box span {
    display: block;
    color: gold;
    font-weight: 900;
    font-size: 0.9rem;
}

.step-box p {
    margin: 2px 0 0;
    font-size: 0.82rem;
    opacity: 0.7;
}

.step-box.active {
    background: linear-gradient(135deg, gold, #ffcc00);
    color: black;
    border-color: gold;
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.28);
}

.step-box.active span {
    color: black;
}

.step-box.active p {
    opacity: 1;
}

.step-line {
    width: 22px;
    height: 2px;
    background: rgba(255, 215, 0, 0.35);
}

/* CARDS */
.glass-card,
.vote-panel,
.instruction-card,
.cinematic-card {
    background: rgba(17, 17, 17, 0.94) !important;
    border: 1px solid rgba(255, 215, 0, 0.15);
    border-radius: 18px !important;
    backdrop-filter: blur(12px);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45);
}

.section-title {
    color: gold;
    font-weight: 800;
    margin-bottom: 16px;
}

/* NOMINEES */
.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
    gap: 18px;
}

.nominee-card {
    background: linear-gradient(145deg, rgba(18, 18, 18, 0.98), rgba(3, 3, 3, 0.98));
    padding: 22px 18px;
    border-radius: 16px;
    cursor: pointer;
    transition: 0.28s ease;
    border: 1px solid rgba(255, 215, 0, 0.1);
    position: relative;
    overflow: hidden;
}

.nominee-card:hover {
    border-color: gold;
    transform: translateY(-6px);
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.18);
}

.nominee-card.selected {
    border-color: gold;
    box-shadow: 0 0 28px rgba(255, 215, 0, 0.26);
}

.gold-bar {
    height: 3px;
    width: 45%;
    background: linear-gradient(90deg, transparent, gold, transparent);
    margin: 0 auto 14px;
    border-radius: 20px;
}

.nominee-card h3 {
    text-align: center;
    font-size: 1rem;
    margin-bottom: 6px;
}

.nominee-card small {
    display: block;
    text-align: center;
    opacity: 0.55;
}

/* VOTE PANEL */
.selected-label {
    font-size: 0.76rem;
    opacity: 0.55;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 4px;
}

.amount-box {
    margin-top: 16px;
    padding: 16px;
    border-radius: 14px;
    background: rgba(255, 215, 0, 0.08);
    border: 1px solid rgba(255, 215, 0, 0.16);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.amount-box span {
    opacity: 0.7;
}

.amount-box strong {
    color: gold;
    font-size: 1.25rem;
}

/* INSTRUCTIONS */
.desktop-guide {
    display: block;
}

.instruction-step {
    display: flex;
    gap: 14px;
    padding: 12px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.instruction-step span {
    color: gold;
    font-weight: 900;
}

.instruction-step p {
    margin: 0;
    opacity: 0.78;
}

.notice-box {
    margin-top: 20px;
    background: rgba(255, 215, 0, 0.08);
    border-left: 4px solid gold;
    padding: 16px;
    border-radius: 12px;
    color: rgba(255, 255, 255, 0.85);
}

/* BUTTON */
.cta-btn {
    background: linear-gradient(135deg, gold, #ffcc00) !important;
    color: black !important;
    font-weight: 900;
    letter-spacing: 0.4px;
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
}

/* TIMER */
.payment-wait {
    margin-top: 20px;
}

.timer-ring {
    width: 68px;
    height: 68px;
    border: 3px solid gold;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 12px auto;
    color: gold;
    font-weight: 900;
    font-size: 1.35rem;
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.25);
}

.payment-wait h4 {
    color: gold;
    margin-top: 8px;
}

.payment-wait p {
    opacity: 0.7;
}

/* TEXT */
.glow-text {
    color: gold;
    text-shadow: 0 0 12px rgba(255, 215, 0, 0.48);
}

.success-text {
    color: #76ff7a;
}

.error-text {
    color: #ff4d4d;
}

.result-message {
    opacity: 0.8;
}

/* MOBILE */
@media (max-width: 768px) {
    .nav-btn {
        padding-left: 12px !important;
        padding-right: 12px !important;
        font-size: 0.75rem !important;
    }

    .ankara-hero {
        min-height: 175px;
        padding: 82px 16px 26px;
    }

    .hero-pill {
        font-size: 0.68rem;
        padding: 5px 11px;
        margin-bottom: 8px;
    }

    .hero-title {
        font-size: 2rem;
        line-height: 1.1;
        margin-bottom: 6px;
    }

    .hero-subtitle {
        font-size: 0.86rem;
        max-width: 320px;
        margin: 0 auto;
    }

    .main-container {
        margin-top: 18px;
        padding-left: 14px;
        padding-right: 14px;
        padding-bottom: 50px;
    }

    .mobile-guide {
        display: block;
    }

    .desktop-guide {
        display: none;
    }

    .steps-wrap {
        gap: 6px;
        margin-bottom: 14px;
        overflow-x: auto;
        padding-bottom: 4px;
    }

    .step-box {
        min-width: 94px;
        padding: 9px 8px;
        border-radius: 12px;
    }

    .step-box span {
        font-size: 0.75rem;
    }

    .step-box p {
        font-size: 0.7rem;
    }

    .step-line {
        min-width: 14px;
        width: 14px;
    }

    .glass-card,
    .vote-panel,
    .cinematic-card {
        border-radius: 16px !important;
    }

    .section-title {
        font-size: 1rem;
        margin-bottom: 12px;
    }

    .grid {
        grid-template-columns: 1fr;
        gap: 12px;
    }

    .nominee-card {
        padding: 16px 14px;
    }

    .nominee-card h3 {
        font-size: 0.95rem;
    }

    .amount-box {
        padding: 13px;
    }
}
</style>
