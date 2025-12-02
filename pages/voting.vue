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
                        <v-card elevation="0" max-width="1300" color="black">
                            <div class="container">
                                <v-card-title>
                                    <h3> Start voting process</h3>
                                </v-card-title>
                               
                            </div>
                        </v-card>
                    </v-col>

                    <v-col cols="12" md="12">

                        <v-card elevation="0">
                            <div class="container">

                                <div class="d-flex">
                                    <div>
                                    
                                
                                        <div >
                                            <div class="container col-md-12">

                                                <v-card elevation="0" color="black" class="mb-4" dark>
                                                    <v-stepper v-model="step" elevation="0" color="black">

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

                                                        <v-stepper-items>

                                                        </v-stepper-items>
                                                    </v-stepper>
                                                </v-card>
                                                <br>
                                                <br>
                                                <h2 class="mb-4">Vote for Your Nominee</h2>

                                                <label for="selectedCategory">Select Category</label>
                                                <v-select v-model="selectedCategory" :items="categories" item-text="name" item-value="id" placeholders="Select Category" outlined dense @change="fetchNominees"></v-select>

                                                <v-radio-group v-model="selectedNominee" class="mt-4">
                                                    <v-radio v-for="nominee in nominees" :key="nominee.id" :label="nominee.name" :value="nominee.id" @click="step = 3, nomineeName = nominee.name">
                                                        <div class="nominee-card">
                                                            <img src="nominee.image" alt="Nominee" />
                                                            <h3>{{ nominee.name }}</h3>
                                                            <button @click="selectNominee(category.id, nominee.id),step = 3">Vote</button>
                                                        </div>

                                                    </v-radio>
                                                </v-radio-group>

                                                <v-btn color="#bf9524" class="mt-4" :disabled="!selectedNominee" @click="openPaymentDialog">
                                                    Cast Vote
                                                </v-btn>

                                            </div>

                                        </div>
                                    </div>
                                   
                                </div>
                            </div>
                        </v-card>

                    </v-col>
                    

                   
                   
                    <v-col cols="12" md="6"></v-col>
                    <v-col cols="12" md="6"></v-col>
                </v-row>
            </div>

            



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
                            <p style="font-size: 0.9rem;">Thank you for voting. Your <b> {{ voteCount }} Vote (s) </b> for {{ nomineeName }} has been successfully recorded
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
