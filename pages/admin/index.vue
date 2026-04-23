<template>
<v-app style="background-color: black; margin-top: 70px;">
    <v-row v-resize="onResize" class="container">
        <v-col cols="12" md="12">
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
                            <v-list-item> <a id="link" @click.prevent="scrollToSection('voting')" style="margin: 8px;">Vote</a></v-list-item>

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
                        <a id="link" @click.prevent="scrollToSection('voting')" style="margin: 8px;">Vote</a>
                    </div>
                    <v-spacer></v-spacer>

                    <v-btn icon @click="$fire.auth.signOut()" color="red">
                        <v-icon>mdi-logout</v-icon>
                    </v-btn>
                    <!-- <v-btn icon>
                        
                    </v-btn> -->

                </v-app-bar>

            </div>
        </v-col>
        <v-col cols="12" md="12">
            <div class="container">
                <h1>Dashboard</h1>
            </div>
        </v-col>
        <v-col cols="6" md="3">
            <div class="container">
                <v-card dark color="primary" style="color: #000;">
                    <v-card-subtitle style="color: #000;">
                        Total Revenue
                    </v-card-subtitle>
                    <v-card-title>
                        <h3 style="color: #000; font-weight: 1200;"> {{ total_revenue }}</h3>
                    </v-card-title>
                </v-card>
            </div>
        </v-col>
        <v-col cols="6" md="3">
            <div class="container">
                <v-card dark color="#ffffff77">
                    <v-card-subtitle>
                        Total Votes
                    </v-card-subtitle>
                    <v-card-title>
                        {{ total_votes }}
                    </v-card-title>
                </v-card>
            </div>
        </v-col>
        <v-col cols="6" md="3">
            <div class="container">
                <v-card dark color="#f0ee7377">
                    <v-card-subtitle>
                        Total Categories
                    </v-card-subtitle>
                    <v-card-title>
                        {{ total_categories }}
                    </v-card-title>
                </v-card>
            </div>
        </v-col>

        <v-col cols="6" md="3">
            <div class="container">
                <v-card dark>
                    <v-card-subtitle>
                        Total nominees
                    </v-card-subtitle>
                    <v-card-title>
                        {{ total_nominees }}
                    </v-card-title>
                </v-card>
            </div>
        </v-col>
        <v-col cols="12" md="6">
            <div class="container">
                <chart_vote_tracting></chart_vote_tracting>
            </div>
        </v-col>
        <v-col cols="12" md="6">
            <div class="">
                <chart_category_tracting></chart_category_tracting>
            </div>
        </v-col>

        <v-col cols="12" md="6">
            <v-card dark>
                <div class="container">
                    <div>
                        <h6 style="color: #FFD700;">Categories</h6>
                        <v-data-table :headers="headers4" :items="categories" item-key="name" class="elevation-1" :items-per-page="5" :search="search" :custom-filter="filterOnlyCapsText">
                            <template v-slot:top>
                                <v-text-field v-model="search" label="Search (UPPER CASE ONLY)" class="mx-4"></v-text-field>
                            </template>
                            <template v-slot:body.append>
                                <tr>
                                    <td></td>
                                    <td>
                                        <v-text-field v-model="calories" type="number" label="Less than"></v-text-field>
                                    </td>
                                    <td colspan="4"></td>
                                </tr>
                            </template>
                        </v-data-table>
                    </div>
                </div>
            </v-card>

        </v-col>
        <v-col cols="12" md="6">
            <v-card dark>
                <div class="container">

                    <div>
                        <h6 style="color: #FFD700;">Payment transactions</h6>
                        <v-data-table :headers="headers2" :items="transactions" item-key="name" class="elevation-1" :items-per-page="10" :search="search" :custom-filter="filterOnlyCapsText">
                            <template v-slot:top>
                                <v-text-field v-model="search" label="Search (UPPER CASE ONLY)" class="mx-4"></v-text-field>
                            </template>
                            <template v-slot:body.append>
                                <tr>
                                    <td></td>
                                    <td>
                                        <v-text-field v-model="calories" type="number" label="Less than"></v-text-field>
                                    </td>
                                    <td colspan="4"></td>
                                </tr>
                            </template>
                        </v-data-table>
                    </div>
                </div>
            </v-card>

        </v-col>
        <v-col cols="12" md="6">
            <v-card dark>
                <div class="container">
                    <div>
                        <h6 style="color: #FFD700;">Nominees</h6>
                        <v-data-table :headers="headers" :items="nomineesList" item-key="name" class="elevation-1" :items-per-page="5" :search="search" :custom-filter="filterOnlyCapsText">
                            <template v-slot:top>
                                <v-text-field v-model="search" label="Search (UPPER CASE ONLY)" class="mx-4"></v-text-field>
                            </template>
                            <template v-slot:body.append>
                                <tr>
                                    <td></td>
                                    <td>
                                        <v-text-field v-model="calories" type="number" label="Less than"></v-text-field>
                                    </td>
                                    <td colspan="4"></td>
                                </tr>
                            </template>
                        </v-data-table>
                    </div>
                </div>
            </v-card>

        </v-col>
        <v-col cols="12" md="6">
            <v-card dark>
                <div class="container">
                    <div>
                        <h6 style="color: #FFD700;">Votes</h6>
                        <v-data-table :headers="headers3" :items="votes" item-key="name" class="elevation-1" :items-per-page="5" :search="search" :custom-filter="filterOnlyCapsText">
                            <template v-slot:top>
                                <v-text-field v-model="search" label="Search (UPPER CASE ONLY)" class="mx-4"></v-text-field>
                            </template>
                            <template v-slot:body.append>
                                <tr>
                                    <td></td>
                                    <td>
                                        <v-text-field v-model="calories" type="number" label="Less than"></v-text-field>
                                    </td>
                                    <td colspan="4"></td>
                                </tr>
                            </template>
                        </v-data-table>
                    </div>
                </div>
            </v-card>

        </v-col>

        <v-col cols="12" md="12"></v-col>
        <v-col cols="12" md="12"></v-col>
        <v-col cols="12" md="12"></v-col>
    </v-row>

    <v-dialog v-model="nomineeDialog" max-width="400px">
        <v-card>
            <div class="d-flex">
                <v-card-title class="headline">Nominate someone</v-card-title>

                <v-spacer></v-spacer>
                <v-btn text @click="nomineeDialog = false">
                    <v-icon color="red">mdi-close</v-icon>
                </v-btn>

            </div>
            <v-card-text>
                <v-select v-model="selectedCategory" :items="categories" item-text="name" item-value="id" label="Select Category" outlined dense></v-select>
                <v-text-field v-model="nomineeName" label="Nominee Name" outlined dense></v-text-field>
                <v-row>
                    <v-col cols="12" sm="12" md="12">
                        <v-autocomplete v-model="location" clearable filled rounded dense :loading="loading" :items="counties" :search-input.sync="search" cache-items class="mx-2" flat hide-no-data hide-details placeholder="Search county you are from?   "></v-autocomplete>

                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                        <v-text-field v-model="church" label="Church" outlined dense></v-text-field>

                    </v-col>
                </v-row>

            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="nomineeDialog = false">Cancel</v-btn>
                <v-btn color="primary" style="color:black;" @click="submitNominee">Submit Nominee</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</v-app>
<!-- Render HTML here -->
</template>

<script>
import axios from "axios";
import logo from "@/assets/logo.png";
import Chart_vote_tracting from "../../components/chart_vote_tracting.vue";
import Chart_category_tracting from "../../components/chart_category_tracting.vue";

export default {
    middleware: 'auth',
    components: {
        Chart_vote_tracting,
        Chart_category_tracting,
    },
    data() {
        return {
            auth_state: false,
            votes: [],
            transactions: [],
            nomineesList: [],
            total_categories: 0,
            total_nominees: 0,
            total_votes: 0,
            loading: false,
            items: [],
            search: null,
            counties: [],
            nomineeDialog: false,
            logo,
            windowSize: {
                x: window.innerHeight,
                y: window.innerWidth,
            },
            htmlContent: "",
            showBurger: false,
            showBurger: false,
            categories: [],
            nomineeName: "",
            selectedCategory: "",
            description: "",
            location: "",
            church: "",
            dashboard: null,
            total_revenue: 0,
            search: '',
            calories: '',
            headers: [{
                    text: "#",
                    value: "id",
                    width: 50,
                },
                {
                    text: "Name",
                    value: "nominee_name",
                },
                {
                    text: "Location",
                    value: "location",
                    align: "right",
                },

                {
                    text: "church",
                    value: "church",
                    align: "right",
                }
            ],
            headers2: [{
                    text: "#",
                    value: "category_id",
                    width: 50,
                },
                {
                    text: "Amount",
                    value: "amount_paid",
                },
                {
                    text: "Reciept",
                    value: "transaction_id",
                    align: "right",
                },

                {
                    text: "Payment mo",
                    value: "phone_number",
                    align: "right",
                }, {
                    text: "Payment status",
                    value: "payment_status",
                    align: "right",
                }
            ],
            headers3: [{
                    text: "#",
                    value: "candidate_id",
                    width: 50,
                },
                {
                    text: "Vote date",
                    value: "vote_date",
                },
                {
                    text: "Reciept",
                    value: "transaction_id",
                    align: "right",
                },

                {
                    text: "Vote count",
                    value: "vote_count",
                    align: "right",
                }
            ],
            headers4: [{
                    text: "#",
                    value: "id",
                    width: 50,
                },
                {
                    text: "Name",
                    value: "name",
                },

            ],

        };
    },
    async mounted() {
        this.checkUser();
        this.fetchDashboard();
        this.fetchNomineesList();
        this.fetchTransaction();
        this.fetchVotes();
        this.fetchCategories();
        // let response = await axios.get("https://amacserver-production-48fd.up.railway.app/api/votes/dashboard-total");
        // this.dashboard = response.data;
        // console.log(this.dashboard);
    },
    methods: {
        logout() {
            this.$fire.auth.signOut();
            this.$router.push(`/login`)
        },
        scrollToSection(id) {
            if (id != null) {
                this.$router.push(`/${id}`)
            }
        },
        async submitNominee() {
            try {
                await axios.post("https://amacserver-production-48fd.up.railway.app/api/nominee/addNominee", {
                    name: this.nomineeName,
                    category_id: this.selectedCategory,
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
        async fetchNomineesList() {
            try {
                const {
                    data
                } = await axios.get(
                    `https://amacserver-production-48fd.up.railway.app/api/nominee/list`
                );
                this.nomineesList = data;
                // this.nomineeCount = this.nomineesList.length;
                console.log("nominees:", this.nomineesList);
            } catch (error) {
                console.error("Error loading nominees:", error);
            }
        },
        async fetchTransaction() {
            try {
                const {
                    data
                } = await axios.get(
                    `https://amacserver-production-48fd.up.railway.app/transaction/getAllPayments`
                );
                this.transactions = data;
                // this.nomineeCount = this.nomineesList.length;
                console.log("nominees:", this.nomineesList);
            } catch (error) {
                console.error("Error loading nominees:", error);
            }
        },
        async fetchVotes() {
            try {
                const {
                    data
                } = await axios.get(
                    `https://amacserver-production-48fd.up.railway.app/api/votes/get-all-votes`
                );
                this.votes = data;
                // this.nomineeCount = this.nomineesList.length;
                console.log("votes:", this.votes);
            } catch (error) {
                console.error("Error loading nominees:", error);
            }
        },
        async fetchCategories() {

            try {
                const {
                    data
                } = await axios.get(
                    "https://amacserver-production-48fd.up.railway.app/api/categories/getAll"
                );
                this.categories = data;
            } catch (error) {
                console.error("Error loading categories:", error);
            }
        },
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
        async fetchDashboard() {

            try {
                const {
                    data
                } = await axios.get(
                    "https://amacserver-production-48fd.up.railway.app/api/votes/dashboard-total"
                );
                this.dashboard = data;
                this.total_revenue = data.total_revenue;
                this.total_categories = data.total_categories;
                this.total_nominees = data.total_nominees;
                this.total_votes = data.total_votes;
                console.log(this.dashboard);
            } catch (error) {
                console.error("Error loading categories:", error);
            }
        },
        checkUser() {
            if (this.$fire.auth.currentUser != null) {
                this.auth_state = true;
                console.log("UID =>", this.$fire.auth.currentUser.uid);
            } else {
                this.auth_state = false;
            }
        },

    },
};
</script>

<style>
.parallax_aim {
    background-image: url('~/assets/pg.svg');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    width: 100%;
    height: 100vh;
}

.parallax_team {
    background-image: url('~/assets/p2.svg');
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    width: 100%;
    height: 100vh;
}

.parallax_about {
    background-image: url('~/assets/p3.svg');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    width: 100%;
    height: 100vh;
}

.parallax_contact {
    background-image: url('~/assets/p2.svg');
    background-attachment: fixed;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    width: 100%;
    height: 100vh;

}

.parallax {
    background-image: url('~/assets/p2.svg');
    background-attachment: fixed;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    width: 100%;
    height: 100vh;
}

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
