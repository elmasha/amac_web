<template>
<div>
    <v-app-bar color="black" dark elevation="0">
        <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>

        <div class="d-flex">
            <v-avatar color="black" size="28">
            </v-avatar>
            <v-toolbar-title>Amac voting booth</v-toolbar-title>
        </div>

        <v-spacer></v-spacer>
        <v-btn icon>
            <v-icon>mdi-bell</v-icon>
        </v-btn>
        <v-btn icon>
            <v-icon>mdi-logout</v-icon>
        </v-btn>
    </v-app-bar>
    <v-container>

        <v-tabs color="black">
            <v-tab @click="Home = true, Leaderboard = false, Live_Results = false,vote = false,nomineeList = false">Overview</v-tab>
            <v-tab @click="Home = false, Leaderboard = false,vote = true, Live_Results = false,nomineeList = false">Vote</v-tab>
            <v-tab @click="fetchVotesSummry(),Home = false, Leaderboard = true, Live_Results = false,vote = false,nomineeList = false">Leaderboard</v-tab>
            <v-tab @click="Home = false, Leaderboard = false, Live_Results = false,vote = false, nomineeList = true">Nominee List</v-tab>
            <v-tab @click="Home = false, Leaderboard = false, Live_Results = true,vote = false, nomineeList = false">Live Results</v-tab>
        </v-tabs>

        <v-card v-show="nomineeList" elevation="0">

        </v-card>

        <v-card v-show="Home" elevation="0">
            <v-row>

                <v-col cols="12" sm="12" md="12"></v-col>
                <v-col cols="12" sm="12" md="12"></v-col>
                <v-col cols="12" sm="6" md="6">
                    <div class="container">

                        <h1>Welcome to the AMAC Voting Portal</h1>

                        <p>Support and celebrate the best in our community — one vote at a time. Use this portal to browse categories, nominate talents, and cast paid votes to determine the winners. Every vote costs KSh 10 and is counted only after successful M-Pesa confirmation.</p>
    <Countdown targetDate="2025-09-30" />

                        <div class="d-flex">
                            <v-btn outlined color="black" @click="nomineeDialog = true">Nominate now</v-btn>

                            <p style="margin: 12px;"></p>
                            <v-btn style="color: aliceblue;" color="black" @click="Home = false, Leaderboard = false, Live_Results = true">Vote now</v-btn>

                        </div>

                    </div>
                </v-col>

                <v-col cols="12" sm="6" md="6">
                    <div class="">
                        <v-img :src="voting" class="mt-12" contain height="200px">

                        </v-img>
                    </div>
                </v-col>

            </v-row>

        </v-card>

        <v-card v-show="Leaderboard" elevation="0">

            <div class="container">
                <div class="row">
                    <div v-for="(vote, id) in voteSum" :key="id" class="col-md-3">
                        <div class="container"></div>

                        <v-card elevation="0" class="mx-auto" max-width="400">
                            <v-list-item two-line>
                                <v-list-item-content>
                                    <v-list-item-title class="text-h5">
                                        {{ vote.nominee_name }}
                                    </v-list-item-title>
                                    <v-list-item-subtitle>{{ vote.category_name }}</v-list-item-subtitle>
                                    <v-list-item-subtitle>{{ vote.location }}</v-list-item-subtitle>
                                    <v-list-item-subtitle>{{ vote.church }}</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>

                            <v-card-text>
                                <v-row align="center">
                                    <v-col class="text-h5" cols="6">
                                        {{ vote.percentage }} % votes
                                    </v-col>
                                    <v-col cols="6">
                                        <!-- <v-img
            src="https://cdn.vuetifyjs.com/images/cards/sun.png"
            alt="Sunny image"
            width="92"
          ></v-img> -->
                                    </v-col>
                                </v-row>
                            </v-card-text>

                            <v-progress-linear color="black" buffer-value="0" :value="vote.percentage" stream></v-progress-linear>

                            <v-divider></v-divider>

                            <!-- <v-card-actions>
      <v-btn text>
        Full Report
      </v-btn>
    </v-card-actions> -->
                        </v-card>

                    </div>

                </div>

            </div>

        </v-card>

        <!-- Render HTML here -->
        <v-card v-show="Live_Results" class="pa-4" outlined>

            <v-row>
                <v-col cols="12" sm="6" md="6">
                    <div class="container">
                        <br>
                        <br><br><br>
                        <h2 class="mb-4">Vote for Your Nominee</h2>

                        <!-- Category Selector -->
                        <v-select v-model="selectedCategory" :items="categories" item-text="name" item-value="id" label="Select Category" outlined dense @change="fetchNominees"></v-select>

                        <!-- Nominee Form -->
                        <!-- <v-text-field v-model="nomineeName" label="Nominee Name"></v-text-field>
      <v-btn color="primary" @click="submitNominee">Submit Nominee</v-btn> -->

                        <!-- Nominees List -->
                        <v-radio-group v-model="selectedNominee" class="mt-4">
                            <v-radio v-for="nominee in nominees" :key="nominee.id" :label="nominee.name" :value="nominee.id">
                                <div class="nominee-card">
                                    <img src="nominee.image" alt="Nominee" />
                                    <h3>{{ nominee.name }}</h3>
                                    <button @click="selectNominee(category.id, nominee.id)">Vote</button>
                                </div>

                            </v-radio>
                        </v-radio-group>

                        <!-- Submit Vote -->
                        <v-btn class="mt-4" color="primary" :disabled="!selectedNominee" @click="openPaymentDialog">
                            Cast Vote
                        </v-btn>

                    </div>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                    <div class="container">
                        <v-img :src="voting2" class="mt-12" contain height="400px">

                        </v-img>
                    </div>
                </v-col>
            </v-row>

            <!-- Message -->
            <v-alert v-if="message" class="mt-4" type="success" dense outlined>
                {{ message }}
            </v-alert>
        </v-card>

        <!-- Render HTML here -->
        <v-card v-show="vote" class="pa-4" outlined>

            <v-row>
                <v-col cols="12" sm="6" md="6">
                    <div class="container">

                        <v-card elevation="0">
                            <v-stepper v-model="step" elevation="0">
                                <!-- Step 1 -->
                                <v-stepper-header>
                                    <v-stepper-step :complete="step > 1" step="1">Choose Category</v-stepper-step>
                                    <v-divider></v-divider>
                                    <v-stepper-step :complete="step > 2" step="2">Nominate</v-stepper-step>
                                    <v-divider></v-divider>
                                    <v-stepper-step :complete="step > 3" step="3">Vote</v-stepper-step>
                                    <v-divider></v-divider>
                                    <v-stepper-step :complete="step > 4" step="4">Payment</v-stepper-step>
                                    <v-divider></v-divider>
                                    <v-stepper-step step="5">Confirmation</v-stepper-step>
                                </v-stepper-header>

                                <!-- Step 1 content -->
                                <v-stepper-items>

                                </v-stepper-items>
                            </v-stepper>
                        </v-card>
                        <h2 class="mb-4">Vote for Your Nominee</h2>

                        <!-- Category Selector -->
                        <v-select v-model="selectedCategory" :items="categories" item-text="name" item-value="id" label="Select Category" outlined dense @change="fetchNominees"></v-select>

                        <!-- Nominee Form -->
                        <!-- <v-text-field v-model="nomineeName" label="Nominee Name"></v-text-field>
      <v-btn color="primary" @click="submitNominee">Submit Nominee</v-btn> -->

                        <!-- Nominees List -->
                        <v-radio-group v-model="selectedNominee" class="mt-4">
                            <v-radio v-for="nominee in nominees" :key="nominee.id" :label="nominee.name" :value="nominee.id" @click="step = 3">
                                <div class="nominee-card">
                                    <img src="nominee.image" alt="Nominee" />
                                    <h3>{{ nominee.name }}</h3>
                                    <button @click="selectNominee(category.id, nominee.id),step = 3">Vote</button>
                                </div>

                            </v-radio>
                        </v-radio-group>

                        <!-- Submit Vote -->
                        <v-btn class="mt-4" color="primary" :disabled="!selectedNominee" @click="openPaymentDialog">
                            Cast Vote
                        </v-btn>

                    </div>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                    <div class="container">
                        <v-img :src="voting2" class="mt-12" contain height="400px">

                        </v-img>
                    </div>
                </v-col>
            </v-row>

            <!-- Message -->
            <v-alert v-if="message" class="mt-4" type="success" dense outlined>
                {{ message }}
            </v-alert>
        </v-card>

        <!-- Mpesa Payment Dialog -->
        <v-dialog v-model="nomineeDialog" max-width="400px">
            <v-card>
                <v-card-title class="headline">Nominate someone</v-card-title>
                <v-card-text>
                    <v-select v-model="selectedCategory" :items="categories" item-text="name" item-value="id" label="Select Category" outlined dense></v-select>
                    <v-text-field v-model="nomineeName" label="Nominee Name" outlined dense></v-text-field>
                    <v-row>
                        <v-col cols="12" sm="6" md="6">
                            <v-text-field v-model="location" label="County/Location" outlined dense></v-text-field>

                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <v-text-field v-model="church" label="Church" outlined dense></v-text-field>

                        </v-col>
                    </v-row>

                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="nomineeDialog = false">Cancel</v-btn>
                    <v-btn color="primary" @click="submitNominee">Submit Nominee</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="paymentDialog" max-width="400px">
            <v-card>
                <v-card-title class="headline">Mpesa Payment</v-card-title>
                <v-card-text>
                    <v-text-field v-model="phoneNumber" label="Phone Number (2547... format)" outlined dense></v-text-field>
                    <v-text-field diable v-model="voteCount" label="Enter votes" type="number" outlined dense @change="getAmount"></v-text-field>
                    <h4>{{ amount }}</h4>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="paymentDialog = false">Cancel</v-btn>
                    <v-btn color="primary" @click="processPayment">Pay to vote</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</div>
</template>

<script>
import axios from "axios";
import Countdown from '@/components/Countdown.vue';
import {
    Bar
} from "vue-chartjs";

export default {

    components: {
        Countdown,
        BarChart: {
            extends: Bar,
            props: ["chartData", "options"],
            mounted() {
                this.renderChart(this.chartData, this.options);
            }
        }
    },
    watch: {
        chartData(newData) {
            this.renderChart(newData, this.options);
        }
    },
    data() {
        return {
            location: null,
            church: null,
            step: 1,
            nomineeDialog: false,
            nomineeList: false,
            vote: false,
            Home: true,
            Leaderboard: false,
            Live_Results: false,
            vote: false,
            rules: false,
            voting: require("@/assets/voting.svg"),
            voting2: require("@/assets/voting2.svg"),

            questions: [{
                    id: 1,
                    text: "If you could choose any age to stay forever, which would it be?",
                    avg: 8,
                    votes: 67
                },
                {
                    id: 2,
                    text: "How likely are you to answer this question?",
                    avg: 9,
                    votes: 27
                },
                {
                    id: 3,
                    text: "Which languages do you speak?",
                    avg: 6,
                    votes: 27
                },
                {
                    id: 4,
                    text: "Why did you decide to join this event?",
                    avg: 3,
                    votes: 27
                },
                {
                    id: 5,
                    text: "Which of the following statements are true?",
                    avg: 6,
                    votes: 27
                }
            ],
            chartData: {
                labels: ["10", "9", "8"],
                datasets: [{
                    label: "Votes",
                    backgroundColor: ["#3b82f6", "#8b5cf6", "#f87171"],
                    data: [64, 47, 23]
                }]
            },
            chartOptions: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    display: false
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            },
            stats: {
                avg: 8.8,
                total: 144,
                skipped: 21
            },
            categories: [],
            nominees: [],
            voteSum: [],
            selectedCategory: null,
            selectedNominee: null,
            message: null,
            nomineeName: "",
            nomineeDesc: "",
            htmlContent: "",
            // Mpesa dialog states
            paymentDialog: false,
            phoneNumber: "254796124865",
            amount: null, // default vote price
            voteCount: null,
        };
    },
    async mounted() {
        await this.fetchCategories();
        await this.fetchVotesSummry();
        // Load external HTML file at runtime
        fetch("/index.html") // Place myfile.html in `public/` folder
            .then((res) => res.text())
            .then((html) => {
                this.htmlContent = html;
            })
            .catch((err) => {
                console.error("Error loading HTML:", err);
            });
    },
    methods: {
        async getAmount() {
            let total = this.voteCount * 10;
            this.amount = total;
        },

        async submitNominee() {
            try {
                await axios.post("https://balanced-ambition-production.up.railway.app/api/nominee/addNominee", {
                    name: this.nomineeName,
                    category_id: this.selectedCategory,
                    description: "",
                    location: this.location,
                    church: this.church,
                });
                alert("Nominee submitted successfully!");
                this.nomineeName = "";
                this.nomineeDesc = "";
                this.selectedCategory = null;
            } catch (err) {
                console.error("Error submitting nominee:", err);
                alert("Error submitting nominee");
            }
        },
        async fetchCategories() {
            try {
                const {
                    data
                } = await axios.get(
                    "https://balanced-ambition-production.up.railway.app/api/categories/getAll"
                );
                this.categories = data;
            } catch (error) {
                console.error("Error loading categories:", error);
            }
        },
        async fetchVotesSummry() {
            try {

                const {
                    data
                } = await axios.get(
                    `https://balanced-ambition-production.up.railway.app/api/votes/summary`
                );

                this.voteSum = data;
                console.log("vote sum:", this.voteSum);
            } catch (error) {
                console.error("Error loading nominees:", error);
            }
        },
        async fetchNominees() {
            if (!this.selectedCategory) return;
            try {
                this.step = 2;
                const {
                    data
                } = await axios.get(
                    `https://balanced-ambition-production.up.railway.app/api/nominee/nominees/${this.selectedCategory}`
                );
                this.nominees = data;
            } catch (error) {
                console.error("Error loading nominees:", error);
            }
        },
        openPaymentDialog() {
            this.paymentDialog = true;
        },
        async processPayment() {
            try {
                // Step 1: Trigger Mpesa STK push
                const {
                    data
                } = await axios.post(
                    "https://balanced-ambition-production.up.railway.app/payment/mpesa_stk_push", {
                        phone: this.phoneNumber,
                        amount: this.amount,
                        user_id: 2,
                        vote_count: this.voteCount,
                        candidate_id: this.selectedNominee,
                        category_id: this.selectedCategory,
                    }
                );

                // Step 2: Close dialog & show success message
                this.paymentDialog = false;
                this.message = "📲 Payment initiated. Enter Mpesa PIN to confirm.";

                // Step 3: (Optional) Poll backend for confirmation
            } catch (error) {
                console.error("Error processing payment:", error);
                this.message = "❌ Failed to initiate payment.";
            }
        },
    },
};
</script>
