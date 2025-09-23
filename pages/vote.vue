<template>
<div>
    <v-app-bar color="black" dark elevation="0">
        <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>

        <div class="d-flex">
            <v-avatar color="black" size="28">
                <v-img :src="logo"></v-img>
            </v-avatar>
            <v-toolbar-title style="margin-left: 10px;">Amac voting booth</v-toolbar-title>
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
            <v-tab @click="Home = false, Leaderboard = false, Live_Results = true,vote = false, nomineeList = false">Live Results</v-tab>
            <v-tab @click="Home = false, Leaderboard = false,vote = true, Live_Results = false,nomineeList = false">Vote</v-tab>
            <v-tab @click="fetchVotesSummry(),Home = false, Leaderboard = true, Live_Results = false,vote = false,nomineeList = false">Category</v-tab>
            <v-tab @click="Home = false, Leaderboard = false, Live_Results = false,vote = false, nomineeList = true">Nominee List</v-tab>

        </v-tabs>

        <v-card v-show="nomineeList" elevation="0" dark color="black" class="pa-4" outlined>
            <v-card-title class="text-h5 text--gold">All Nominees </v-card-title>
            <v-card-subtitle>Nominess by vote percentage</v-card-subtitle>

            <div class="container">
                <div class="d-flex">
                    <v-select v-model="searchNomineeCat" :items="categories" item-text="name" item-value="id" label="Search with Category" outlined dense @change="fetchVotesSummry22()"></v-select>
                    <v-spacer></v-spacer>
                    <v-spacer></v-spacer>
                    <v-spacer></v-spacer>

                </div>
                <div class="row">
                    <div v-for="(nom, id) in nomineesList" :key="id" class="col-md-3">

                        <v-card elevation="0" class="mx-auto" max-width="400" color="black">
                            <v-list-item two-three>
                                <v-list-item-content>
                                    <v-list-item-title class="text-h6">
                                        {{ nom.nominee_name }}
                                    </v-list-item-title>
                                    <v-list-item-subtitle>{{ nom.category_name }}</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>

                            <div class="d-flex">
                                <div>
                                    <v-card-text>
                                        <p style="color: #bf9524;">{{ nom.location }} <br>{{ nom.church }} </p>
                                    </v-card-text>

                                </div>
                                <v-spacer></v-spacer>
                                <v-progress-circular color="white" size="70" buffer-value="0" :value="nom.percentage" stream>

                                    <strong style="font-size: 0.9rem;"> {{ numeral(nom.percentage).format("0.0") }} % </strong>
                                </v-progress-circular>
                            </div>

                        </v-card>

                    </div>

                </div>

            </div>

        </v-card>

        <v-card v-show="Home" elevation="0">
            <v-row>

                <v-col cols="12" sm="12" md="12"></v-col>
                <v-col cols="12" sm="12" md="12"></v-col>
                <v-col cols="12" sm="6" md="6">
                    <div class="container">

                        <h1>Welcome to the AMAC Voting Portal</h1>

                        <p>Welcome to the Annual Awards Voting Platform. Here, you can explore categories, view nominees, and take part in recognizing outstanding achievements. Nominations remain open as we count down to the official voting date, when you will have the opportunity to cast your vote and support your favorites.</p>

                        <Countdown targetDate="2025-09-30" />

                        <div class="d-flex">
                            <v-btn outlined color="black" @click="nomineeDialog = true">Nominate now</v-btn>

                            <p style="margin: 12px;"></p>
                            <v-btn v-show="false" style="color: aliceblue;" color="black" @click="Home = false, Leaderboard = false, Live_Results = true">Vote now</v-btn>

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

        <v-card v-show="Leaderboard" elevation="0" dark color="black" class="pa-4" outlined>

            <v-card-title class="text-h5 text--gold">Category Leaderboard</v-card-title>
            <v-card-subtitle>Top nominess by vote percentage</v-card-subtitle>

            <div class="container">
                <div class="d-flex">
                    <v-select v-model="searchCat" :items="categories" item-text="name" item-value="id" placeholder="Search with Category" outlined dense @change="fetchVotesSummry2"></v-select>
                    <v-spacer></v-spacer>
                    <v-spacer></v-spacer>
                    <v-spacer></v-spacer>

                </div>
                <div class="row">
                    <div v-for="(vote, id) in voteSum" :key="id" class="col-md-3">
                        <div class="container"></div>

                        <v-card elevation="0" class="mx-auto" max-width="400">
                            <v-list-item two-line>
                                <v-list-item-content>
                                    <v-list-item-title class="text-h5">
                                        {{ vote.category_name }}
                                    </v-list-item-title>
                                    <v-list-item-subtitle>{{ vote.nominee_name }}</v-list-item-subtitle>
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

                            <v-progress-linear color="#bf9524" buffer-value="0" :value="vote.percentage" stream></v-progress-linear>

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
        <v-card v-show="Live_Results" class="pa-4" elevation="0">

            <v-row>
                <v-col cols="12" sm="12" md="12">
                    <div class="container">
                        <br>
                        <h1>🏆 Live Voting Results</h1>

                        <v-card-text>

                            <!-- <v-chip-group v-model="neighborhoods" row multiple>
                                <div v-for="(vote, id) in categories" :key="id">
                                    <v-chip filter color="black" text-color="white" @click="">
                                        {{ vote.name }}
                                    </v-chip>
                                </div>

                            </v-chip-group> -->

                            <div class="d-flex">
                                <div>
                                    <br>
                                    <v-select v-model="searchCatResult" :items="categories" item-text="name" item-value="id" placeholder="Search with Category" outlined dense @change="fetchOverview33(searchCatResult)"></v-select>
                                </div>
                                <v-spacer></v-spacer>
                                <v-spacer></v-spacer>
                                <v-spacer></v-spacer>

                            </div>
                        </v-card-text>

                        <div class="results-page">

                            <!-- Loop categories -->
                            <div v-for="cat in Results" :key="cat.category_id" class="category-block">

                                <h2>{{ cat.category_name }}</h2>
                                <p>Total Votes: {{ cat.total_votes }}</p>
                                <p class="timestamp">Last updated: {{ }}</p>

                                <!-- Nominees list -->
                                <div v-for="nom in cat.nominees" :key="nom.nominee_id" class="nominee">
                                    <br>
                                    <div class="nominee-header">
                                        <strong>{{ nom.nominee_name }}</strong>
                                        <span v-if="nom.is_leader" class="leader-badge">Leading</span>
                                    </div>

                                    <p>{{ nom.location }} - {{ nom.church }}</p>
                                    <p>Votes: ({{ nom.percentage }}%)</p>

                                    <!-- Progress bar -->
                                    <div class="progress">
                                        <div class="progress-bar" :style="{ width: nom.percentage + '%' }"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </v-col>

            </v-row>

            <!-- Message -->
            <v-alert v-if="message" class="mt-4" type="success" dense outlined>
                {{ message }}
            </v-alert>
        </v-card>

        <!-- Render HTML here -->
        <v-card v-show="vote" class="pa-4" outlined dark color="black">

            <v-row>
                <v-col cols="12" sm="6" md="6">
                    <div class="container">

                        <v-card elevation="0" color="black" class="mb-4">
                            <v-stepper v-model="step" elevation="0" color="black">
                                <!-- Step 1 -->
                                <v-stepper-header color="black">
                                    <v-stepper-step color="#bf9524" :complete="step > 1" step="1">Choose Category</v-stepper-step>
                                    <v-divider></v-divider>
                                    <v-stepper-step color="#bf9524" :complete="step > 2" step="2">Nominate</v-stepper-step>
                                    <v-divider></v-divider>
                                    <v-stepper-step color="#bf9524" :complete="step > 3" step="3">Vote</v-stepper-step>
                                    <v-divider></v-divider>
                                    <v-stepper-step color="#bf9524" :complete="step > 4" step="4">Payment</v-stepper-step>
                                    <v-divider></v-divider>
                                    <v-stepper-step color="#bf9524" step="5">Confirmation</v-stepper-step>
                                </v-stepper-header>

                                <!-- Step 1 content -->
                                <v-stepper-items>

                                </v-stepper-items>
                            </v-stepper>
                        </v-card>
                        <h2 class="mb-4">Vote for Your Nominee</h2>

                        <!-- Category Selector -->
                        <label for="selectedCategory">Select Category</label>
                        <v-select v-model="selectedCategory" :items="categories" item-text="name" item-value="id" placeholders="Select Category" outlined dense @change="fetchNominees"></v-select>

                        <!-- Nominee Form -->
                        <!-- <v-text-field v-model="nomineeName" label="Nominee Name"></v-text-field>
      <v-btn color="primary" @click="submitNominee">Submit Nominee</v-btn> -->

                        <!-- Nominees List -->
                        <v-radio-group v-model="selectedNominee" class="mt-4">
                            <v-radio v-for="nominee in nominees" :key="nominee.id" :label="nominee.name" :value="nominee.id" @click="step = 3, nomineeName = nominee.name">
                                <div class="nominee-card">
                                    <img src="nominee.image" alt="Nominee" />
                                    <h3>{{ nominee.name }}</h3>
                                    <button @click="selectNominee(category.id, nominee.id),step = 3">Vote</button>
                                </div>

                            </v-radio>
                        </v-radio-group>

                        <!-- Submit Vote -->
                        <v-btn color="#bf9524" class="mt-4" :disabled="!selectedNominee" @click="openPaymentDialog">
                            Cast Vote
                        </v-btn>

                    </div>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                    <div class="">
                        <v-img :src="voting2" class="mt-12" contain height="300px">

                        </v-img>
                    </div>
                </v-col>
            </v-row>

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
                <v-card-title class="headline">Vote Confirmation</v-card-title>
                <v-card-text>
                    <label for="phoneNumber">Provide you mpesa number</label>
                    <v-text-field v-model="phoneNumber" :prefix="phonePrefix" placeholder="(7.. format)" dense></v-text-field>
                    <label for="voteCount">Number of votes you wish to cast</label>
                    <v-text-field diable v-model="voteCount" placeholder="" type="number" dense @change="getAmount"></v-text-field>
                    <span>1 Vote is eqaul to 10sh (1 vote = 10 ksh)</span>
                    <br>
                    <br>
                    <div class="d-flex">
                        <p style="font-size: 0.9rem;">Total amount to be paid. <h6>{{ numeral(amount).format("0,0") }} ksh</h6>
                        </p>
                    </div>

                    <div class="d-flex" style="padding: 0.8rem;border-radius: 1rem;background-color: antiquewhite;color: black;">
                        <p style="font-size: 0.9rem;"> An STK push will prompted on the <b>{{ phonePrefix+phoneNumber }}</b> check for an mpesa prompting you to pay <b>{{ numeral(amount).format("0,0") }}</b> ksh</p>
                    </div>
                    <v-progress-linear v-show="progress_bar" indeterminate color="black"></v-progress-linear>
                    <!-- Message -->
                    <v-alert v-if="message" class="mt-4" type="success" dense outlined>
                        {{ message }}
                    </v-alert>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="paymentDialog = false">Cancel</v-btn>
                    <v-btn color="black" @click="processPayment" style="color: white;">Vote</v-btn>
                </v-card-actions>
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
                        <p style="font-size: 0.9rem;">Thank you for your voting. You <b> {{ voteCount }} Vote (s) </b> for {{ nomineeName }} for <b>{{ selectedCategory }}</b> has be successfully recorded
                        </p>
                    </div>
                    <v-progress-linear v-show="progress_bar" indeterminate color="black"></v-progress-linear>
                    <!-- Message -->

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
    </v-container>

    <v-snackbar color="primary accent-8" :timeout="6000" v-model="snackbar_s" centered bottom>
        {{ snackbarText_s }}
    </v-snackbar>
    <v-snackbar color="success" :timeout="2000" v-model="snackbar" outlined center>
        {{ snackbarText }}
    </v-snackbar>
    <v-snackbar color="error" :timeout="4000" v-model="snackbarError" outlined center>
        {{ snackbarTextError }}
    </v-snackbar>
</div>
</template>

<script>
import axios from "axios";
import numeral from "numeral";
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
        },
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
                    this.StkQuery();
                    this.timerCount = 25;
                }
            },
            immediate: true, // This ensures the watcher is triggered upon creation
        },
    },
    data() {
        return {
            numeral,
            searchCatResult: null,
            nomineeName: "",
            progress_bar: false,
            timerEnabled: false,
            show6: false,
            timerCount: 25,
            CheckoutRequestID: null,
            snackbar_s: false,
            snackbarText_s: "",
            snackbar: false,
            snackbarError: false,
            snackbarText: "",
            snackbarTextError: "",
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
            logo: require("@/assets/logo.png"),
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
            nomineesList: [],
            liveStreams: [],
            voteSum: [],
            Results: [],
            selectedCategory: null,
            selectedNominee: null,
            message: null,
            nomineeName: "",
            nomineeDesc: "",
            searchCat: null,
            searchNomineeCat: null,
            htmlContent: "",
            // Mpesa dialog states
            paymentDialog: false,
            paymentConfirmDialog: false,
            phoneNumber: "",
            phonePrefix: "254",
            amount: null, // default vote price
            voteCount: null,
        };
    },
    async mounted() {
        await this.fetchCategories();
        await this.fetchLiveResults();
        await this.fetchNomineesList();
        await this.fetchVotesSummry();
        await this.fetchOverview();
        setInterval(this.fetchAll(), 5000); // refresh every 5 seconds
    },
    methods: {
        fetchAll() {
            //  this.fetchCategories();
            //  this.fetchNomineesList();
            //  this.fetchVotesSummry(); 
        },
        StkQuery() {
            let that = this;
            that.snackbar_s = true;
            that.snackbarText_s = "Checking payment status...";
            that.step = 5;
            axios
                .post("https://balanced-ambition-production.up.railway.app/payment/mpesa_stk_push/query", {
                    checkoutRequestId: that.CheckoutRequestID,
                })
                .then(function (response) {
                    console.log("StkPush Query", response.data);
                    that.show6 = false;

                    if (response.status == 200) {
                        that.progress_bar = false;
                        that.paymentForm = true;
                        that.snackbar = true;
                        that.snackbarText = response.data.ResultDesc;
                        that.timerCount = 25;
                        that.timerEnabled = false;
                        that.paymentConfirmDialog = true;

                    }
                })
                .catch(function (error) {
                    that.paymentForm = true;
                    that.snackbarError = true;
                    that.snackbarTextError = error;
                    that.timerCount = 25;
                    that.timerEnabled = false;
                    that.show6 = false;
                    that.progress_bar = false;
                });
        },
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
        async fetchCategories2(val) {
            try {
                const {
                    data
                } = await axios.get(
                    "https://balanced-ambition-production.up.railway.app/api/votes/summaryCat/" + val
                );
                this.categories = data;
            } catch (error) {
                console.error("Error loading categories:", error);
            }
        },
        async fetchVotesSummry2() {
            try {

                const {
                    data
                } = await axios.get(
                    "https://balanced-ambition-production.up.railway.app/api/votes/summary/" + this.searchCat
                );

                this.voteSum = data;
                console.log("vote sum:", this.voteSum);
            } catch (error) {
                console.error("Error loading nominees:", error);
            }
        },
        async fetchVotesSummry22() {
            try {

                const {
                    data
                } = await axios.get(
                    "https://balanced-ambition-production.up.railway.app/api/votes/summary/" + this.searchNomineeCat
                );

                this.nomineesList = data;
                console.log("vote sum list:", this.nomineesList);
            } catch (error) {
                console.error("Error loading nominees:", error);
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
        async fetchLiveResults() {
            try {

                const {
                    data
                } = await axios.get(
                    `https://balanced-ambition-production.up.railway.app/api/votes/live-results/`
                );

                this.liveStreams = data;
                console.log("live result:", this.liveStreams);
            } catch (error) {
                console.error("Error loading nominees:", error);
            }
        },
        async fetchOverview() {
            try {
                const {
                    data
                } = await axios.get(
                    `https://balanced-ambition-production.up.railway.app/api/votes/overview`
                );

                this.Results = data;
                console.log("live result:", this.liveStreams);
            } catch (error) {
                console.error("Error loading nominees:", error);
            }
        },
        async fetchOverview33(val) {
            try {
                const {
                    data
                } = await axios.get(
                    `https://balanced-ambition-production.up.railway.app/api/votes/overview/${val}`
                );

                this.Results = data;
                console.log("live result:", this.liveStreams);
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
        async fetchNomineesList() {
            try {
                const {
                    data
                } = await axios.get(
                    `https://balanced-ambition-production.up.railway.app/api/nominee/list`
                );
                this.nomineesList = data;
                console.log("nominees:", this.nomineesList);
            } catch (error) {
                console.error("Error loading nominees:", error);
            }
        },
        openPaymentDialog() {
            this.paymentDialog = true;
        },
        async processPayment() {
            let that = this;
            if (that.phoneNumber == null) {
                that.snackbarTextError = "Provide phone..";
                that.snackbarError = true;
            }
            if (that.voteCount == null) {
                that.snackbarTextError = "Provide your vote count..";
                that.snackbarError = true;
            } else {
                let phone = that.phonePrefix + that.phoneNumber;
                if (phone.length != 12) {
                    that.snackbarTextError = "Phone number should be 12 digits including country code";
                    that.snackbarError = true;
                    return;
                }
                axios
                    .post("https://balanced-ambition-production.up.railway.app/payment/mpesa_stk_push", {
                        phone: phone,
                        amount: that.amount,
                        user_id: 2,
                        vote_count: that.voteCount,
                        candidate_id: that.selectedNominee,
                        category_id: that.selectedCategory,
                    })
                    .then(function (response) {
                        console.log(response);
                        if (response.status == 200) {
                            that.step = 4;
                            that.CheckoutRequestID = response.data.CheckoutRequestID;
                            that.snackbar = true;
                            that.message = "📲 Payment initiated. Enter Mpesa PIN to confirm.";
                            that.progress_bar = true;
                            that.snackbarText = response.data;
                            that.timerEnabled = true;
                        } else if (response.status == 400) {
                            that.snackbarError = true;
                            that.snackbarTextError = response.data;
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                        that.snackbarTextError = error;
                        that.snackbarError = true;
                        that.progress_bar = false;
                    });
            }
            Error;
        },
        selectNominee(categoryId, nomineeId) {
            this.selectedCategory = categoryId;
            this.selectedNominee = nomineeId;
        }
    },
};
</script>
