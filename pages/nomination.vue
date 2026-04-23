<template>
  <v-app class="app-bg">

    <!-- NAV -->
    <v-app-bar app dark class="glass-nav">
      <div class="d-flex align-center">
        <v-avatar size="30">
          <v-img :src="logo"></v-img>
        </v-avatar>
        <span class="ml-2 glow-text">Nominate</span>
      </div>

      <v-spacer></v-spacer>

      <v-btn class="cta-btn" rounded @click="$router.push('/')">
        Back Home
      </v-btn>
    </v-app-bar>

    <!-- HERO -->
    <div class="hero fade-in">
      <h1 class="glow-text big-title">Nominate a Candidate</h1>
      <p class="subtitle">Recognize someone deserving of this award</p>
    </div>

    <!-- FORM -->
    <v-container class="fade-in">

      <v-card class="cinematic-card pa-6 mx-auto" max-width="600">

        <h2 class="mb-4 text-center glow-text">Nomination Form</h2>

        <!-- CATEGORY -->
        <v-select
          v-model="selectedCategory"
          :items="categories"
          item-text="name"
          item-value="id"
          label="Select Category"
          outlined dense
          class="mb-3"
        />

        <!-- NAME -->
        <v-text-field
          v-model="nomineeName"
          label="Nominee Name"
          outlined dense
          class="mb-3"
        />

        <!-- COUNTY (FIXED) -->
        <v-autocomplete
          v-model="county_id"
          :items="counties"
          item-text="name"
          item-value="id"
          label="Select County"
          outlined dense
          class="mb-3"
        />

        <!-- LOCATION -->
        <v-text-field
          v-model="location"
          label="Location (Estate / Town)"
          outlined dense
          class="mb-3"
        />

        <!-- CHURCH -->
        <v-text-field
          v-model="church"
          label="Church"
          outlined dense
          class="mb-4"
        />

        <!-- BUTTON -->
        <v-btn
          block
          large
          class="cta-btn"
          @click="CheckNominee"
        >
          Submit Nomination
        </v-btn>

      </v-card>

    </v-container>

    <!-- SUCCESS -->
    <v-dialog v-model="successDialog" max-width="400">
      <v-card class="cinematic-card text-center pa-6">
        <h2 class="glow-text">Success 🎉</h2>
        <p>Nominee submitted successfully</p>
      </v-card>
    </v-dialog>

    <!-- ERROR -->
    <v-snackbar v-model="snackbarError" color="error" bottom>
      {{ snackbarTextError }}
    </v-snackbar>

  </v-app>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      logo: require("@/assets/logo.png"),

      categories: [],
      counties: [],

      nomineeName: "",
      selectedCategory: null,
      county_id: null,   // ✅ FIXED
      location: "",
      church: "",

      successDialog: false,

      snackbarError: false,
      snackbarTextError: ""
    };
  },

  async mounted() {
    this.fetchCategories();
    this.fetchCounties();
  },

  methods: {

    async fetchCategories() {
      const { data } = await axios.get(
        "https://amacserver-production-48fd.up.railway.app/api/categories/getAll"
      );
      this.categories = data;
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

      try {
        const { data } = await axios.get(
          `https://amacserver-production-48fd.up.railway.app/api/nominee/check?name=${this.nomineeName}&church=${this.church}&location=${this.location}&county_id=${this.county_id}`
        );

        if (data.exists) {
          this.snackbarError = true;
          this.snackbarTextError = "Nominee already exists";
        } else {
          this.submitNominee();
        }

      } catch (err) {
        console.error(err);
        this.snackbarError = true;
        this.snackbarTextError = "Error checking nominee";
      }
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
            county_id: this.county_id   // ✅ FIXED
          }
        );

        this.successDialog = true;

        // RESET FORM
        this.nomineeName = "";
        this.selectedCategory = null;
        this.county_id = null;
        this.location = "";
        this.church = "";

      } catch (err) {
        console.error(err);

        this.snackbarError = true;
        this.snackbarTextError =
          err.response?.data?.error || "Failed to submit nominee";
      }
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

.big-title {
  font-size: 2.5rem;
}

.subtitle {
  opacity: 0.7;
}

/* NAV */
.glass-nav {
  background: rgba(0,0,0,0.9) !important;
}

/* CARD */
.cinematic-card {
  background: #0f0f0f !important;
  border-radius: 12px;
}

/* CTA */
.cta-btn {
  background: linear-gradient(135deg, gold, #ffcc00) !important;
  color: black !important;
  font-weight: bold;
}

/* GLOW */
.glow-text {
  color: gold;
  text-shadow: 0 0 12px rgba(255,215,0,0.6);
}

/* ANIMATION */
.fade-in {
  animation: fadeUp 1s ease;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

