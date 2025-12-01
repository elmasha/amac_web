<template>
<v-card color="black" dark elevation="0" style="min-height: 100vh;">
    <div>
        <v-app-bar color="black" dark elevation="0">
            <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>

            <div class="d-flex">
                <v-avatar color="black" size="28">
                    <v-img :src="logo"></v-img>
                </v-avatar>
                <v-toolbar-title style="margin-left: 10px;">Amac portal</v-toolbar-title>
            </div>

            <v-spacer></v-spacer>

        </v-app-bar>

        <v-navigation-drawer v-model="drawer" color="black" light absolute temporary height="100vh">
            <v-list>
                <br>
                <br>
                <br>
                <v-list-item style="color: aliceblue;" @click="Home = true, Leaderboard = false, Live_Results = false,vote = false,nomineeList = false, drawer = false">

                    <v-list-item-content>
                        <div class="d-flex">
                            <v-list-item-title style="margin: 8px;">Overview</v-list-item-title>
                        </div>
                    </v-list-item-content>
                    <v-list-item-action @click="MoveNavigation(item.title), drawer = false">

                    </v-list-item-action>
                </v-list-item>

                <v-list-item style="color: aliceblue;" @click="Home = false, Leaderboard = false, Live_Results = true,vote = false, nomineeList = false, drawer = false">
                    <div class="d-flex">
                        <v-list-item-title style="margin: 8px;">Live result</v-list-item-title>
                    </div>
                </v-list-item>
                <v-list-item style="color: aliceblue;" @click="Home = false, Leaderboard = false,vote = true, Live_Results = false,nomineeList = false,drawer = false">
                    <div class="d-flex">
                        <v-list-item-title style="margin: 8px;">Vote</v-list-item-title>
                    </div>
                </v-list-item>
                <v-list-item style="color: aliceblue;" @click="fetchVotesSummry(),Home = false, Leaderboard = true, Live_Results = false,vote = false,nomineeList = false,drawer = false">
                    <div class="d-flex">
                        <v-list-item-title style="margin: 8px;">Category</v-list-item-title>
                    </div>
                </v-list-item>
                <v-list-item style="color: aliceblue;" @click="Home = false, Leaderboard = false, Live_Results = false,vote = false, nomineeList = true,drawer = false">
                    <div class="d-flex">
                        <v-list-item-title style="margin: 8px;">Nominees</v-list-item-title>
                    </div>
                </v-list-item>

            </v-list>

            <template v-slot:append>
                <div class="pa-2">
                    All right reserved @2025
                </div>
            </template>
        </v-navigation-drawer>

        <v-container v-resize="onResize" color="black">

            <div class="container ">

                <v-row class="">

                    <v-col cols="12" md="12">
                        <v-card elevation="0">
                            <div class="container">

                                <div>

                                    <v-card-subtitle>
                                        🏆 Live Results
                                    </v-card-subtitle>
                                    <v-row>
                                        <v-col cols="12" sm="12" md="12">
                                            <div class="container">

                                                <v-card-text>

                                                    <div class="d-flex">

                                                        <v-select v-model="searchCatResult" :items="categories" item-text="name" item-value="id" placeholder="Search with Category" outlined dense @change="fetchOverview33(searchCatResult)"></v-select>

                                                        <v-spacer></v-spacer>

                                                    </div>
                                                </v-card-text>
                                                <v-card elevation="0" v-scroll.self="onScroll" class="overflow-y-auto" max-height="900">
                                                    <v-card-text>
                                                        <div class="results-page row">

                                                            <div v-for="cat in Results" :key="cat.category_id" class="col-md-12" style="margin: 0px;">
                                                                <hr>
                                                                <h3 style="color: #bf9524;">{{ cat.category_name }}</h3>

                                                                <!-- Nominees list -->
                                                                <div class="row">
                                                                    <div v-for="nom in cat.nominees" :key="nom.nominee_id" class="col-md-12">
                                                                        <div class="nominee-header">
                                                                            <div class="">
                                                                                <h5> <strong>{{ nom.nominee_name }}</strong></h5>
                                                                                <p style="margin: 3px;">{{ nom.location }} - {{ nom.church }}</p>
                                                                            </div>
                                                                        </div>
                                                                        <br>
                                                                        <div class="text-start ">
                                                                            <span v-if="nom.is_leader" class="leader-badge" style="color: greenyellow;">Leading in this category</span>
                                                                        </div>
                                                                        <!-- Progress bar -->
                                                                        <div class="col-md-8">
                                                                            <!-- <div class="progress-bar" :style="{ width: nom.percentage + '%' , color: '#808080'}"></div> -->
                                                                            <v-progress-linear width="50%" rounded v-model="nom.percentage" stream color="amber" height="20">Votes {{ nom.percentage }}%</v-progress-linear>
                                                                            <v-spacer></v-spacer>
                                                                        </div>

                                                                    </div>

                                                                </div>
                                                            </div>
                                                            <!-- Loop categories -->

                                                        </div>
                                                    </v-card-text>

                                                </v-card>

                                            </div>
                                        </v-col>

                                    </v-row>

                                </div>
                            </div>
                        </v-card>
                    </v-col>

                </v-row>
            </div>

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
</v-card>
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
            offsetTop: 0,
            picker: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
            items: [{
                    src: require("@/assets/app-8.jpg"),
                },
                {
                    src: require("@/assets/app-9.jpg"),
                },
                {
                    src: require("@/assets/app-3.jpg"),
                },
                {
                    src: require("@/assets/app-4.jpg"),
                },
            ],
            navIcon: false,
            windowSize: {
                x: window.innerHeight,
                y: window.innerWidth,
            },
            numeral,
            drawer: false,
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
            nomineeCount: 0,
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
        onScroll(e) {
            this.offsetTop = e.target.scrollTop
        },
        onResize() {
            this.windowSize = {
                x: window.innerWidth,
                y: window.innerHeight,
            };
            console.log("size", this.windowSize.x);
            if (this.windowSize.x < 950) {
                this.navIcon = true;
            } else {
                this.navIcon = false;
            }
            return this.windowSize;
        },
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
                .post("https://amacserver-production-6a8c.up.railway.app/payment/mpesa_stk_push/query", {
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
                        if (response.data.ResultCode == "0") {
                            that.paymentConfirmDialog = true;
                        }
                        that.timerCount = 25;
                        that.timerEnabled = false;

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
                await axios.post("https://amacserver-production-6a8c.up.railway.app/api/nominee/addNominee", {
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
                    "https://amacserver-production-6a8c.up.railway.app/api/categories/getAll"
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
                    "https://amacserver-production-6a8c.up.railway.app/api/votes/summaryCat/" + val
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
                    "https://amacserver-production-6a8c.up.railway.app/api/votes/summary/" + this.searchCat
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
                    "https://amacserver-production-6a8c.up.railway.app/api/votes/summary/" + this.searchNomineeCat
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
                    `https://amacserver-production-6a8c.up.railway.app/api/votes/summary`
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
                    `https://amacserver-production-6a8c.up.railway.app/api/votes/live-results/`
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
                    `https://amacserver-production-6a8c.up.railway.app/api/votes/overview`
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
                    `https://amacserver-production-6a8c.up.railway.app/api/votes/overview/${val}`
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
                    `https://amacserver-production-6a8c.up.railway.app/api/nominee/nominees/${this.selectedCategory}`
                );
                this.nominees = data;
                this.nomineeCount = this.nominees.length;
            } catch (error) {
                console.error("Error loading nominees:", error);
            }
        },
        async fetchNomineesList() {
            try {
                const {
                    data
                } = await axios.get(
                    `https://amacserver-production-6a8c.up.railway.app/api/nominee/list`
                );
                this.nomineesList = data;
                this.nomineeCount = this.nomineesList.length;
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
                    .post("https://amacserver-production-6a8c.up.railway.app/payment/mpesa_stk_push", {
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
