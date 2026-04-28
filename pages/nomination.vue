<template>
  <v-app class="app-bg">

    <!-- NAV -->
    <v-app-bar app dark class="glass-nav">
      <div class="d-flex align-center">
        <v-avatar size="34">
          <v-img :src="logo"></v-img>
        </v-avatar>
        <span class="ml-3 brand">AMAC Awards</span>
      </div>

      <v-spacer />

      <v-btn class="cta-btn" rounded @click="$router.push('/')">
        Back Home
      </v-btn>
    </v-app-bar>

    <!-- HERO -->
    <section class="hero">
      <div class="hero-overlay">
        <h1 class="title glow-text">Nominate a Candidate</h1>
        <p class="subtitle">
          Celebrate excellence. Recognize someone making an impact.
        </p>
      </div>
    </section>

    <!-- FORM -->
    <v-container class="form-container">
      <v-card class="form-card">

        <div class="form-header">
          <h2 class="glow-text">Nomination Form</h2>
          <p>Fill in the details below</p>
        </div>

        <v-select
          v-model="selectedCategory"
          :items="categories"
          item-text="name"
          item-value="id"
          label="Category"
          outlined dense
          class="mb-4"
        />

        <v-text-field
          v-model="nomineeName"
          label="Nominee Name"
          outlined dense
          class="mb-4"
        />

        <v-autocomplete
          v-model="county_id"
          :items="counties"
          item-text="name"
          item-value="id"
          label="County"
          outlined dense
          class="mb-4"
        />

        <v-text-field
          v-model="location"
          label="Location"
          outlined dense
          class="mb-4"
        />

        <v-text-field
          v-model="church"
          label="Church"
          outlined dense
          class="mb-5"
        />

        <v-btn block large class="cta-btn" @click="CheckNominee">
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
      county_id: null,
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
    }

  }
};
</script>

<style>

/* ============================= */
/* 🎨 CUSTOM AMAC ANKARA PATTERN */
/* ============================= */
:root {
  --ankara-pattern: url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d4af37' fill-opacity='0.15'%3E%3Cpath d='M40 0 L45 30 L80 40 L45 50 L40 80 L35 50 L0 40 L35 30 Z'/%3E%3C/g%3E%3C/svg%3E");
}

/* BASE */
.app-bg {
  background: #000;
  color: #fff;
  position: relative;
}

/* SIDE ANKARA */
.app-bg::before,
.app-bg::after {
  content: "";
  position: fixed;
  top: 0;
  width: 60px;
  height: 100%;
  background-image: var(--ankara-pattern);
  opacity: 0.08;
}

.app-bg::before { left: 0; }
.app-bg::after { right: 0; }

/* NAV */
.glass-nav {
  backdrop-filter: blur(12px);
  background: rgba(0,0,0,0.9) !important;
}

/* BRAND */
.brand {
  color: gold;
  font-weight: bold;
}

/* HERO */
.hero {
  height: 40vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  background:
    radial-gradient(circle at top, rgba(255,215,0,0.2), transparent),
    var(--ankara-pattern);
}

/* FORM */
.form-container {
  margin-top: -80px;
}

.form-card {
  max-width: 600px;
  margin: auto;
  padding: 30px;
  border-radius: 16px;

  background:
    linear-gradient(#0f0f0f, #0f0f0f) padding-box,
    var(--ankara-pattern) border-box;

  border: 1px solid rgba(212,175,55,0.3);
}

/* CTA */
.cta-btn {
  background: linear-gradient(135deg, gold, #ffcc00) !important;
  color: black !important;
  font-weight: bold;
}

/* TEXT */
.glow-text {
  color: gold;
  text-shadow: 0 0 10px rgba(255,215,0,0.6);
}

.title {
  font-size: 2.5rem;
  font-weight: 800;
}

.subtitle {
  opacity: 0.7;
}

.cinematic-card {
  background: #0f0f0f;
}

</style>