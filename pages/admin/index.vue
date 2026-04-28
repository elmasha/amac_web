<template>
  <v-app class="admin-bg">

    <!-- NAV -->
    <v-app-bar app dark elevation="0" class="glass-nav">

      <v-app-bar-nav-icon
        v-show="showBurger"
        color="white"
        @click="drawer = true"
      />

      <div class="d-flex align-center">
        <v-avatar size="34" class="brand-avatar">
          <v-img :src="logo"></v-img>
        </v-avatar>

        <div class="ml-3">
          <div class="brand">AMAC Admin</div>
          <small class="brand-sub">Dashboard</small>
        </div>
      </div>

      <v-spacer />

      <div v-show="!showBurger" class="nav-links">
        <span @click="scrollToSection('')">Home</span>
        <span @click="scrollToSection('voting')">Vote</span>
        <span @click="scrollToSection('live-results')">Results</span>
      </div>

      <v-btn icon class="logout-btn ml-2" @click="logout">
        <v-icon color="red">mdi-logout</v-icon>
      </v-btn>

    </v-app-bar>

    <!-- MOBILE DRAWER -->
    <v-navigation-drawer
      v-model="drawer"
      app
      temporary
      dark
      class="drawer-bg"
    >
      <div class="drawer-header">
        <v-avatar size="42">
          <v-img :src="logo"></v-img>
        </v-avatar>
        <h3 class="glow-text mt-3">AMAC Admin</h3>
      </div>

      <v-list dense>
        <v-list-item @click="goTo('')">
          <v-list-item-icon>
            <v-icon>mdi-home-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>

        <v-list-item @click="goTo('voting')">
          <v-list-item-icon>
            <v-icon>mdi-vote-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Vote</v-list-item-title>
        </v-list-item>

        <v-list-item @click="goTo('live-results')">
          <v-list-item-icon>
            <v-icon>mdi-chart-bar</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Results</v-list-item-title>
        </v-list-item>

        <v-list-item @click="logout">
          <v-list-item-icon>
            <v-icon color="red">mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- HERO -->
    <!-- <section class="dashboard-hero">
      <div class="hero-content">
        <span class="hero-pill">Admin Control Center</span>
        <h1 class="hero-title">AMAC Dashboard</h1>
        <p class="hero-subtitle">
          Track votes, revenue, nominees, transactions and categories in real time.
        </p>
      </div>
    </section> -->

    <v-container class="dashboard-container" v-resize="onResize">

      <!-- TOP ACTIONS -->
      <div class="top-actions">
        <div>
          <h2 class="page-title">Overview</h2>
          <p class="page-subtitle">Monitor the current voting activity.</p>
        </div>

        <div class="action-group">
          <v-btn class="cta-btn" rounded @click="fetchAll">
            <v-icon left>mdi-refresh</v-icon>
            Refresh
          </v-btn>

          <v-btn outlined rounded color="amber" @click="nomineeDialog = true">
            <v-icon left>mdi-account-plus-outline</v-icon>
            Add Nominee
          </v-btn>
        </div>
      </div>

      <!-- METRICS -->
      <v-row>
        <v-col cols="6" md="3">
          <v-card class="metric-card revenue-card">
            <div class="metric-icon">
              <v-icon>mdi-cash-multiple</v-icon>
            </div>
            <span>Total Revenue</span>
            <h2>{{ total_revenue }}</h2>
          </v-card>
        </v-col>

        <v-col cols="6" md="3">
          <v-card class="metric-card">
            <div class="metric-icon">
              <v-icon>mdi-vote-outline</v-icon>
            </div>
            <span>Total Votes</span>
            <h2>{{ total_votes }}</h2>
          </v-card>
        </v-col>

        <v-col cols="6" md="3">
          <v-card class="metric-card">
            <div class="metric-icon">
              <v-icon>mdi-shape-outline</v-icon>
            </div>
            <span>Categories</span>
            <h2>{{ total_categories }}</h2>
          </v-card>
        </v-col>

        <v-col cols="6" md="3">
          <v-card class="metric-card">
            <div class="metric-icon">
              <v-icon>mdi-account-star-outline</v-icon>
            </div>
            <span>Nominees</span>
            <h2>{{ total_nominees }}</h2>
          </v-card>
        </v-col>
      </v-row>

      <!-- CHARTS -->
      <v-row class="mt-2">
        <v-col cols="12" md="6">
          <v-card class="panel-card">
            <div class="panel-header">
              <div>
                <span class="section-kicker">Analytics</span>
                <h3>Vote Tracking</h3>
              </div>
            </div>

            <chart_vote_tracting />
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card class="panel-card">
            <div class="panel-header">
              <div>
                <span class="section-kicker">Analytics</span>
                <h3>Category Tracking</h3>
              </div>
            </div>

            <chart_category_tracting />
          </v-card>
        </v-col>
      </v-row>

      <!-- TABLES -->
      <v-row class="mt-2">

        <!-- CATEGORIES -->
        <v-col cols="12" md="6">
          <v-card class="table-card">
            <div class="table-header">
              <div>
                <span class="section-kicker">Records</span>
                <h3>Categories</h3>
              </div>
            </div>

            <v-text-field
              v-model="search"
              label="Search"
              outlined
              dense
              dark
              prepend-inner-icon="mdi-magnify"
              class="table-search"
            />

            <v-data-table
              :headers="headers4"
              :items="categories"
              item-key="id"
              :items-per-page="5"
              :search="search"
              dark
              class="admin-table"
              mobile-breakpoint="0"
            />
          </v-card>
        </v-col>

        <!-- TRANSACTIONS -->
        <v-col cols="12" md="6">
          <v-card class="table-card">
            <div class="table-header">
              <div>
                <span class="section-kicker">Finance</span>
                <h3>Payment Transactions</h3>
              </div>
            </div>

            <v-text-field
              v-model="search"
              label="Search"
              outlined
              dense
              dark
              prepend-inner-icon="mdi-magnify"
              class="table-search"
            />

            <v-data-table
              :headers="headers2"
              :items="transactions"
              item-key="id"
              :items-per-page="10"
              :search="search"
              dark
              class="admin-table"
              mobile-breakpoint="0"
            />
          </v-card>
        </v-col>

        <!-- NOMINEES -->
        <v-col cols="12" md="6">
          <v-card class="table-card">
            <div class="table-header">
              <div>
                <span class="section-kicker">Participants</span>
                <h3>Nominees</h3>
              </div>
            </div>

            <v-text-field
              v-model="search"
              label="Search"
              outlined
              dense
              dark
              prepend-inner-icon="mdi-magnify"
              class="table-search"
            />

            <v-data-table
              :headers="headers"
              :items="nomineesList"
              item-key="id"
              :items-per-page="5"
              :search="search"
              dark
              class="admin-table"
              mobile-breakpoint="0"
            />
          </v-card>
        </v-col>

        <!-- VOTES -->
        <v-col cols="12" md="6">
          <v-card class="table-card">
            <div class="table-header">
              <div>
                <span class="section-kicker">Voting</span>
                <h3>Votes</h3>
              </div>
            </div>

            <v-text-field
              v-model="search"
              label="Search"
              outlined
              dense
              dark
              prepend-inner-icon="mdi-magnify"
              class="table-search"
            />

            <v-data-table
              :headers="headers3"
              :items="votes"
              item-key="id"
              :items-per-page="5"
              :search="search"
              dark
              class="admin-table"
              mobile-breakpoint="0"
            />
          </v-card>
        </v-col>

      </v-row>

    </v-container>

    <!-- NOMINEE DIALOG -->
    <v-dialog v-model="nomineeDialog" max-width="520px">
      <v-card class="dialog-card">
        <div class="dialog-header">
          <div>
            <span class="section-kicker">Create</span>
            <h3 class="glow-text">Nominate Someone</h3>
          </div>

          <v-btn icon @click="nomineeDialog = false">
            <v-icon color="red">mdi-close</v-icon>
          </v-btn>
        </div>

        <v-card-text>
          <v-select
              v-model="selectedCategory"
              :items="categories"
              item-text="name"
              item-value="id"
              label="Category"
              outlined
              dense
              dark
              class="mb-3"
            />

            <v-text-field
              v-model="nomineeName"
              label="Nominee Name"
              outlined
              dense
              dark
              class="mb-3"
            />

            <v-autocomplete
              v-model="county_id"
              :items="counties"
              item-text="name"
              item-value="id"
              label="County"
              outlined
              dense
              dark
              class="mb-3"
            />

            <v-text-field
              v-model="location"
              label="Location"
              outlined
              dense
              dark
              class="mb-3"
            />

            <v-text-field
              v-model="church"
              label="Church"
              outlined
              dense
              dark
              class="mb-4"
            />

           
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn text color="white" @click="nomineeDialog = false">
            Cancel
          </v-btn>
           <v-btn
              block
              large
              class="cta-btn"
              :loading="submitting"
              @click="CheckNominee"
            >
              Submit Nomination
            </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-app>
</template>

<script>
import axios from "axios";
import logo from "@/assets/logo.png";
import Chart_vote_tracting from "../../components/chart_vote_tracting.vue";
import Chart_category_tracting from "../../components/chart_category_tracting.vue";

export default {
  middleware: "auth",

  components: {
    Chart_vote_tracting,
    Chart_category_tracting
  },

  data() {
    return {
      auth_state: false,

      drawer: false,
      showBurger: false,

      votes: [],
      transactions: [],
      nomineesList: [],

      total_categories: 0,
      total_nominees: 0,
      total_votes: 0,
      total_revenue: 0,

      loading: false,
      counties: [],
      nomineeDialog: false,

      logo,

      windowSize: {
        x: window.innerHeight,
        y: window.innerWidth
      },

      categories: [],
      nomineeName: "",
      selectedCategory: "",
      description: "",
      location: "",
      church: "",
      dashboard: null,

      search: "",
      calories: "",

      headers: [
        {
          text: "#",
          value: "id",
          width: 50
        },
        {
          text: "Name",
          value: "nominee_name"
        },
        {
          text: "Location",
          value: "location"
        },
        {
          text: "Church",
          value: "church"
        }
      ],

      headers2: [
        {
          text: "#",
          value: "category_id",
          width: 50
        },
        {
          text: "Amount",
          value: "amount_paid"
        },
        {
          text: "Receipt",
          value: "transaction_id"
        },
        {
          text: "Phone",
          value: "phone_number"
        },
        {
          text: "Status",
          value: "payment_status"
        }
      ],

      headers3: [
        {
          text: "#",
          value: "candidate_id",
          width: 50
        },
        {
          text: "Vote Date",
          value: "vote_date"
        },
        {
          text: "Receipt",
          value: "transaction_id"
        },
        {
          text: "Vote Count",
          value: "vote_count"
        }
      ],

      headers4: [
        {
          text: "#",
          value: "id",
          width: 50
        },
        {
          text: "Name",
          value: "name"
        }
      ],
      county_id: null,
      counties: [],
    };
  },

  async mounted() {
    this.onResize();

    this.checkUser();

    await this.fetchAll();

    window.addEventListener("resize", this.onResize);
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },

  methods: {
    async fetchAll() {
      await Promise.all([
        this.fetchDashboard(),
        this.fetchNomineesList(),
        this.fetchTransaction(),
        this.fetchVotes(),
        this.fetchCounties(),
        this.fetchCategories()
      ]);
    },

    logout() {
      this.$fire.auth.signOut();
      this.$router.push("/login");
    },

    scrollToSection(id) {
      this.$router.push(`/${id}`);
    },

    goTo(id) {
      this.drawer = false;
      this.scrollToSection(id);
    },

    async fetchCounties() {
      const { data } = await axios.get(
        "https://amacserver-production-48fd.up.railway.app/api/counties/get-counties"
      );
      this.counties = data;
    },

    async CheckNominee() {
      if (!this.nomineeName || !this.selectedCategory || !this.county_id) {
        this.snackbarError = true;
        this.snackbarTextError = "Fill all required fields";
        return;
      }

      this.submitting = true;

      try {
        const { data } = await axios.get(
          `https://amacserver-production-48fd.up.railway.app/api/nominee/check?name=${this.nomineeName}&church=${this.church}&location=${this.location}&county_id=${this.county_id}`
        );

        if (data.exists) {
          this.snackbarError = true;
          this.snackbarTextError = "Nominee already exists";
        } else {
          await this.submitNominee();
        }

      } catch (err) {
        this.snackbarError = true;
        this.snackbarTextError = "Error checking nominee";
      }

      this.submitting = false;
    },

    async submitNominee() {
      try {
        await axios.post(
          "https://amacserver-production-48fd.up.railway.app/api/nominee/addNominee",
          {
            name: this.nomineeName,
            category_id: this.selectedCategory,
            location: this.location,
            church: this.church,
            county_id: this.county_id
          }
        );

        this.successDialog = true;

        this.nomineeName = "";
        this.selectedCategory = null;
        this.county_id = null;
        this.location = "";
        this.church = "";

      } catch (err) {
        this.snackbarError = true;
        this.snackbarTextError =
          err.response?.data?.error || "Failed to submit nominee";
      }
    },
    async fetchNomineesList() {
      try {
        const { data } = await axios.get(
          "https://amacserver-production-48fd.up.railway.app/api/nominee/list"
        );

        this.nomineesList = data;
      } catch (error) {
        console.error("Error loading nominees:", error);
      }
    },

    async fetchTransaction() {
      try {
        const { data } = await axios.get(
          "https://amacserver-production-48fd.up.railway.app/transaction/getAllPayments"
        );

        this.transactions = data;
      } catch (error) {
        console.error("Error loading transactions:", error);
      }
    },

    async fetchVotes() {
      try {
        const { data } = await axios.get(
          "https://amacserver-production-48fd.up.railway.app/api/votes/get-all-votes"
        );

        this.votes = data;
      } catch (error) {
        console.error("Error loading votes:", error);
      }
    },

    async fetchCategories() {
      try {
        const { data } = await axios.get(
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
        y: window.innerHeight
      };

      this.showBurger = this.windowSize.x < 950;
    },

    async fetchDashboard() {
      try {
        const { data } = await axios.get(
          "https://amacserver-production-48fd.up.railway.app/api/votes/dashboard-total"
        );

        this.dashboard = data;

        this.total_revenue = data.total_revenue || 0;
        this.total_categories = data.total_categories || 0;
        this.total_nominees = data.total_nominees || 0;
        this.total_votes = data.total_votes || 0;

      } catch (error) {
        console.error("Error loading dashboard:", error);
      }
    },

    checkUser() {
      if (this.$fire.auth.currentUser != null) {
        this.auth_state = true;
        console.log("UID =>", this.$fire.auth.currentUser.uid);
      } else {
        this.auth_state = false;
      }
    }
  }
};
</script>

<style>
.admin-bg {
  background: #000;
  color: white;
  min-height: 100vh;
  overflow-x: hidden;
}

/* NAV */
.glass-nav {
  background: rgba(0, 0, 0, 0.92) !important;
  backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(255, 215, 0, 0.15);
}

.brand-avatar {
  border: 1px solid rgba(255, 215, 0, 0.35);
}

.brand {
  color: gold;
  font-weight: 900;
  font-size: 0.95rem;
  line-height: 1;
}

.brand-sub {
  color: rgba(255, 255, 255, 0.58);
  font-size: 0.68rem;
}

.nav-links span {
  margin: 0 12px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 700;
  cursor: pointer;
  transition: 0.3s;
}

.nav-links span:hover {
  color: gold;
}

.logout-btn {
  background: rgba(255, 0, 0, 0.08);
}

/* DRAWER */
.drawer-bg {
  background: #050505 !important;
}

.drawer-header {
  text-align: center;
  padding: 30px 16px 18px;
  border-bottom: 1px solid rgba(255, 215, 0, 0.12);
}

/* HERO */
.dashboard-hero {
  min-height: 240px;
  padding: 105px 20px 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  background:
    radial-gradient(circle at center, rgba(255, 215, 0, 0.2), transparent 43%),
    linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.96)),
    repeating-linear-gradient(
      45deg,
      rgba(255, 215, 0, 0.13) 0px,
      rgba(255, 215, 0, 0.13) 2px,
      transparent 2px,
      transparent 34px
    ),
    repeating-linear-gradient(
      -45deg,
      rgba(255, 215, 0, 0.07) 0px,
      rgba(255, 215, 0, 0.07) 2px,
      transparent 2px,
      transparent 42px
    ),
    #000;
}

.hero-content {
  max-width: 760px;
}

.hero-pill {
  display: inline-block;
  padding: 7px 15px;
  border-radius: 999px;
  border: 1px solid rgba(255, 215, 0, 0.35);
  background: rgba(255, 215, 0, 0.08);
  color: gold;
  font-size: 0.78rem;
  margin-bottom: 14px;
}

.hero-title {
  color: gold;
  font-size: clamp(2rem, 5vw, 3.8rem);
  font-weight: 900;
  text-shadow: 0 0 22px rgba(255, 215, 0, 0.46);
  margin-bottom: 10px;
}

.hero-subtitle {
  opacity: 0.78;
  margin: 0;
}

/* MAIN */
.dashboard-container {
  margin-top: 32px;
  padding-bottom: 80px;
}

/* TOP ACTIONS */
.top-actions {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-end;
  margin-bottom: 24px;
}

.page-title {
  color: gold;
  font-weight: 900;
  margin-bottom: 4px;
}

.page-subtitle {
  opacity: 0.65;
  margin: 0;
}

.action-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

/* METRICS */
.metric-card {
  background:
    radial-gradient(circle at top right, rgba(255, 215, 0, 0.12), transparent 42%),
    rgba(17, 17, 17, 0.95) !important;
  border: 1px solid rgba(255, 215, 0, 0.15);
  border-radius: 18px !important;
  padding: 20px;
  min-height: 150px;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.4);
}

.revenue-card {
  border-color: rgba(255, 215, 0, 0.38);
}

.metric-icon {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background: rgba(255, 215, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: gold;
  margin-bottom: 16px;
}

.metric-card span {
  opacity: 0.68;
  font-size: 0.84rem;
}

.metric-card h2 {
  color: gold;
  margin-top: 8px;
  font-weight: 900;
  font-size: clamp(1.4rem, 4vw, 2rem);
}

/* PANELS */
.panel-card,
.table-card,
.dialog-card {
  background: rgba(17, 17, 17, 0.95) !important;
  border: 1px solid rgba(255, 215, 0, 0.15);
  border-radius: 18px !important;
  padding: 22px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45);
}

.panel-header,
.table-header,
.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.panel-header h3,
.table-header h3,
.dialog-header h3 {
  margin: 0;
  color: white;
  font-weight: 900;
}

.section-kicker {
  display: block;
  color: gold;
  font-size: 0.72rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  opacity: 0.85;
  margin-bottom: 5px;
}

/* TABLES */
.table-search {
  margin-bottom: 14px;
}

.admin-table {
  background: transparent !important;
}

.admin-table .v-data-table__wrapper {
  border-radius: 14px;
  overflow-x: auto;
}

.admin-table table {
  min-width: 650px;
}

.admin-table th {
  color: gold !important;
  font-weight: 900 !important;
}

.admin-table td {
  color: rgba(255, 255, 255, 0.82) !important;
}

/* BUTTON */
.cta-btn {
  background: linear-gradient(135deg, gold, #ffcc00) !important;
  color: black !important;
  font-weight: 900;
  letter-spacing: 0.3px;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.32);
}

/* TEXT */
.glow-text {
  color: gold;
  text-shadow: 0 0 14px rgba(255, 215, 0, 0.52);
}

/* MOBILE */
@media (max-width: 768px) {
  .brand {
    font-size: 0.82rem;
  }

  .brand-sub {
    display: none;
  }

  .dashboard-hero {
    min-height: 180px;
    padding: 84px 16px 30px;
  }

  .hero-pill {
    font-size: 0.68rem;
    padding: 5px 11px;
    margin-bottom: 8px;
  }

  .hero-title {
    font-size: 2rem;
    line-height: 1.08;
  }

  .hero-subtitle {
    font-size: 0.84rem;
    max-width: 320px;
    margin: 0 auto;
  }

  .dashboard-container {
    margin-top: 18px;
    padding-left: 14px;
    padding-right: 14px;
  }

  .top-actions {
    flex-direction: column;
    align-items: flex-start;
  }

  .action-group {
    width: 100%;
  }

  .action-group .v-btn {
    flex: 1;
  }

  .metric-card {
    padding: 16px;
    min-height: 132px;
  }

  .metric-icon {
    width: 36px;
    height: 36px;
    margin-bottom: 12px;
  }

  .metric-card h2 {
    font-size: 1.25rem;
  }

  .panel-card,
  .table-card {
    padding: 16px;
    border-radius: 16px !important;
  }

  .panel-header,
  .table-header {
    margin-bottom: 12px;
  }
}
</style>