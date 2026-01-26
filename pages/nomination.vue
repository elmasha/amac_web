<template>
<v-app style="background-color: black;">
    <div>
        <v-app-bar dark elevation="0" class="" color="black" fixed>
            <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">

                    <v-app-bar-nav-icon v-show="showBurger" light v-bind="attrs" v-on="on" color="white"></v-app-bar-nav-icon>
                </template>
                <v-list>
                    <!-- <v-list-item v-for="(item, index) in items" :key="item.title">
                                                   <v-list-item-action @click="checkNav(item.title)">{{ item.title }}</v-list-item-action>
                                                   <v-list-item-title></v-list-item-title>
                                               </v-list-item> -->

                    <v-list-item> <a id="link" @click.prevent="scrollToSection('')" style="margin: 8px;">Home</a></v-list-item>
                    <v-list-item><a id="link" @click.prevent="scrollToSection('')" style="margin: 8px;">About</a></v-list-item>
                    <v-list-item><a id="link" @click.prevent="scrollToSection('')" style="margin: 8px;">Aim & Objectives</a></v-list-item>
                    <v-list-item> <a id="link" @click.prevent="scrollToSection('')" style="margin: 8px;">Gallery</a></v-list-item>
                    <v-list-item> <a id="link" @click.prevent="scrollToSection('')" style="margin: 8px;">Team</a></v-list-item>
                    <v-list-item> <a id="link" @click.prevent="scrollToSection('')" style="margin: 8px;">Contact</a></v-list-item>

                </v-list>
            </v-menu>
            <div class="d-flex">
                <v-avatar color="black" size="28">
                    <v-img :src="logo"></v-img>
                </v-avatar>
                <v-toolbar-title style="margin-left: 10px;">Amac </v-toolbar-title>
            </div>

            <v-spacer></v-spacer>
            <div v-show="!showBurger" id="nav_bar_links">
                <a id="link" @click.prevent="scrollToSection('')" style="margin: 8px;">Home</a>
                <a id="link" @click.prevent="scrollToSection('')" style="margin: 8px;">About</a>
                <a id="link" @click.prevent="scrollToSection('')" style="margin: 8px;">Aim & Objectives</a>
                <a id="link" @click.prevent="scrollToSection('')" style="margin: 8px;">Gallery</a>
                <a id="link" @click.prevent="scrollToSection('')" style="margin: 8px;">Team</a>
                <a id="link" @click.prevent="scrollToSection('')" style="margin: 8px;">Contact</a>
            </div>
            <v-spacer></v-spacer>

         
            <!-- <v-btn icon @click="$fire.auth.signOut()" v-if="show_auth">
                                           <v-icon>mdi-logout</v-icon>
                                       </v-btn> -->

        </v-app-bar>

    </div>

    <v-container color="black" v-resize="onResize" style="margin-top: 80px;">

        <div class="container ">

            <v-row class="">
                <v-col cols="12" md="12">
                    <v-card elevation="0" max-width="1300" color="black">

                    </v-card>
                </v-col>

                <v-col cols="12" md="12">

                    <v-card>
                        <div class="container">
                            <v-card-title>
                                <h3> Nominate</h3>
                            </v-card-title>
                            <v-card-subtitle>
                                Provide detail below to Nominate a Candidate
                            </v-card-subtitle>

                        </div>
                        <v-card-text>
                            <v-row>
                                <v-col cols="12" sm="12" md="12">
                                    <div class="container">
                                        <v-autocomplete v-model="location" clearable filled rounded dense :loading="loading" :items="counties" :search-input.sync="search" cache-items class="mx-2" flat hide-no-data hide-details label="Search county you are from?   "></v-autocomplete>
                                    </div>
                                </v-col>
                                <br>
                                <br>
                                <v-col cols="12" sm="12" md="12">
                                    <v-select v-model="selectedCategory" :items="categories" item-text="name" item-value="id" label="Select Category" outlined dense></v-select>

                                </v-col>
                                <br>
                                <br>
                                <v-col cols="12" sm="12" md="12">
                                    <v-text-field v-model="nomineeName" label="Nominee Name" outlined dense></v-text-field>

                                </v-col>
                                <br>
                                <br>
                                <v-col cols="12" sm="6" md="6">
                                    <v-text-field v-model="church" label="Church" outlined dense></v-text-field>

                                </v-col>
                                <br>
                                <br>
                            </v-row>

                        </v-card-text>
                        <v-card-actions>
                            <v-btn color="primary" @click="CheckNominee" style="color:black">Submit Nominee</v-btn>
                            <v-spacer></v-spacer>
                        </v-card-actions>
                    </v-card>

                </v-col>

                <v-col cols="12" md="6"></v-col>
                <v-col cols="12" md="6"></v-col>
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
</v-app>
</template>

<script>
import axios from "axios";
import numeral from "numeral";
import Countdown from '@/components/Countdown.vue';
import logo from "@/assets/logo.png";

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
            showBurger: false,
            logo,
            loading: false,
            items: [],
            search: null,
            counties: [],
            offsetTop: 0,
            picker: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
            
            windowSize: {
                x: window.innerHeight,
                y: window.innerWidth,
            },
            navIcon: false,
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
            nominee:null,
        };
    },
    async mounted() {
        let response = await axios.get("https://amacserver-production-c845.up.railway.app/api/counties/get-counties");
        this.counties = response.data;
        console.log(this.counties);
        await this.fetchCategories();
        await this.fetchNomineesList();

    },
    methods: {
        onResize() {
            this.windowSize = {
                x: window.innerWidth,
                y: window.innerHeight,
            };
            console.log("size", this.windowSize.x);
            if (this.windowSize.x < 950) {
                this.showBurger = true;
            } else {
                this.showBurger = false;
            }
            return this.windowSize;
        },
        onScroll(e) {
            this.offsetTop = e.target.scrollTop
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
                .post("https://amacserver-production-c845.up.railway.app/payment/mpesa_stk_push/query", {
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
                await axios.post("https://amacserver-production-c845.up.railway.app/api/nominee/addNominee", {
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

        async CheckNominee() {
            try {
                const {
                    data
                } = await axios.get(
                    `https://amacserver-production-c845.up.railway.app/api/nominee/check?name=${this.nomineeName}&church=${this.church}&location=${this.location}`
                );
                this.nominee = data;
                if(this.nominee.exists === true){
                    alert("Nominee already exists")
                }else{
                    this.submitNominee();
                }
                console.log(this.nominee)
            } catch (error) {
                console.error("Error loading categories:", error);
            }
        },
        async fetchCategories() {

            try {
                const {
                    data
                } = await axios.get(
                    "https://amacserver-production-c845.up.railway.app/api/categories/getAll"
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
                    "https://amacserver-production-c845.up.railway.app/api/votes/summaryCat/" + val
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
                    "https://amacserver-production-c845.up.railway.app/api/votes/summary/" + this.searchCat
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
                    "https://amacserver-production-c845.up.railway.app/api/votes/summary/" + this.searchNomineeCat
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
                    `https://amacserver-production-c845.up.railway.app/api/votes/summary`
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
                    `https://amacserver-production-c845.up.railway.app/api/votes/live-results/`
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
                    `https://amacserver-production-c845.up.railway.app/api/votes/overview`
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
                    `https://amacserver-production-c845.up.railway.app/api/votes/overview/${val}`
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
                    `https://amacserver-production-c845.up.railway.app/api/nominee/nominees/${this.selectedCategory}`
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
                    `https://amacserver-production-c845.up.railway.app/api/nominee/list`
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
                    .post("https://amacserver-production-c845.up.railway.app/payment/mpesa_stk_push", {
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
        scrollToSection(id) {
            if (id != null) {
                this.$router.push(`/${id}`)
            }
        },
        selectNominee(categoryId, nomineeId) {
            this.selectedCategory = categoryId;
            this.selectedNominee = nomineeId;
        }
    },
};
</script>

<style scoped>
#link {
    color: #dbdbdb;
    font-weight: 800;
    transition: 0.3s;
}

#link:hover {
    color: gold;
    font-weight: 800;
}
</style>
