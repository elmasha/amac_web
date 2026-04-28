<template>
  <v-app class="app-bg">

    <!-- NAV -->
    <v-app-bar app dark class="glass-nav">
      <div class="d-flex align-center">
        <v-avatar size="34" class="brand-avatar">
          <v-img :src="logo"></v-img>
        </v-avatar>

        <div class="ml-3">
          <div class="brand">AMAC Awards</div>
          <small class="brand-sub">Nomination Portal</small>
        </div>
      </div>

      <v-spacer />

      <v-btn class="cta-btn nav-btn" rounded @click="$router.push('/')">
        Back Home
      </v-btn>
    </v-app-bar>

    <!-- HERO -->
    <section class="nomination-hero">
      <div class="hero-content">
        <span class="hero-pill">AMAC Awards Season 2</span>

        <h1 class="hero-title">
          Nominate a Candidate
        </h1>

        <p class="hero-subtitle">
          Celebrate excellence. Recognize someone making an impact.
        </p>
      </div>
    </section>

    <!-- MAIN -->
    <v-container class="main-container">
      <v-row align="start">

        <!-- FORM -->
        <v-col cols="12" md="7" lg="7">
          <v-card class="form-card">

            <div class="form-header">
              <span class="section-kicker">Nomination Form</span>
              <h2 class="glow-text">Submit Nominee Details</h2>
              <p>Fill in the nominee details below.</p>
            </div>

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

            <v-btn
              block
              large
              class="cta-btn"
              :loading="submitting"
              @click="CheckNominee"
            >
              Submit Nomination
            </v-btn>

          </v-card>
        </v-col>

        <!-- GUIDE -->
        <v-col cols="12" md="5" lg="5">
          <v-card class="guide-card">

            <span class="section-kicker">Guide</span>
            <h2 class="glow-text guide-title">Before You Submit</h2>

            <div class="guide-list">
              <div class="guide-step">
                <span>01</span>
                <p>Select the correct award category.</p>
              </div>

              <div class="guide-step">
                <span>02</span>
                <p>Enter the nominee’s official name.</p>
              </div>

              <div class="guide-step">
                <span>03</span>
                <p>Select county and add location.</p>
              </div>

              <div class="guide-step">
                <span>04</span>
                <p>Add church or group name where applicable.</p>
              </div>
            </div>

            <div class="notice-box">
              <strong>Note:</strong><br />
              Duplicate nominees will not be submitted again.
            </div>

          </v-card>
        </v-col>

      </v-row>
    </v-container>

    <!-- SUCCESS -->
    <v-dialog v-model="successDialog" max-width="400">
      <v-card class="cinematic-card text-center pa-6">
        <div class="success-icon">✓</div>
        <h2 class="glow-text">Success</h2>
        <p>Nominee submitted successfully.</p>

        <v-btn class="cta-btn mt-3" @click="successDialog = false">
          Done
        </v-btn>
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
      snackbarTextError: "",

      submitting: false
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
    }
  }
};
</script>

<style>
:root {
  --gold: #ffd700;
}

/* BASE */
.app-bg {
  background: #000;
  color: #fff;
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

.nav-btn {
  padding-left: 18px !important;
  padding-right: 18px !important;
}

/* HERO */
.nomination-hero {
  min-height: 240px;
  padding: 100px 20px 44px;
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
  max-width: 720px;
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
  font-size: clamp(2rem, 5vw, 3.7rem);
  font-weight: 900;
  text-shadow: 0 0 22px rgba(255, 215, 0, 0.46);
  margin-bottom: 10px;
}

.hero-subtitle {
  margin: 0;
  opacity: 0.78;
  font-size: 1rem;
}

/* MAIN */
.main-container {
  margin-top: 32px;
  padding-bottom: 80px;
}

/* CARDS */
.form-card,
.guide-card,
.cinematic-card {
  background: rgba(17, 17, 17, 0.94) !important;
  border: 1px solid rgba(255, 215, 0, 0.15);
  border-radius: 18px !important;
  backdrop-filter: blur(12px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45);
}

.form-card,
.guide-card {
  padding: 28px;
}

.form-header {
  margin-bottom: 22px;
}

.form-header h2 {
  margin-bottom: 6px;
  font-size: 1.55rem;
}

.form-header p {
  opacity: 0.65;
  margin: 0;
}

.section-kicker {
  display: block;
  color: gold;
  font-size: 0.75rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  opacity: 0.85;
  margin-bottom: 5px;
}

/* GUIDE */
.guide-title {
  font-size: 1.45rem;
  margin-bottom: 18px;
}

.guide-list {
  margin-top: 8px;
}

.guide-step {
  display: flex;
  gap: 14px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.guide-step span {
  color: gold;
  font-weight: 900;
  min-width: 28px;
}

.guide-step p {
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

/* SUCCESS */
.success-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, gold, #ffcc00);
  color: #000;
  font-size: 2rem;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 14px;
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

/* TABLET */
@media (max-width: 960px) {
  .main-container {
    max-width: 760px;
  }

  .guide-card {
    margin-top: 10px;
  }
}

/* MOBILE */
@media (max-width: 768px) {
  .nav-btn {
    padding-left: 12px !important;
    padding-right: 12px !important;
    font-size: 0.75rem !important;
  }

  .brand {
    font-size: 0.82rem;
  }

  .brand-sub {
    display: none;
  }

  .nomination-hero {
    min-height: 175px;
    padding: 82px 16px 26px;
  }

  .hero-pill {
    font-size: 0.68rem;
    padding: 5px 11px;
    margin-bottom: 8px;
  }

  .hero-title {
    font-size: 1.95rem;
    line-height: 1.08;
    margin-bottom: 6px;
  }

  .hero-subtitle {
    font-size: 0.84rem;
    max-width: 320px;
    margin: 0 auto;
  }

  .main-container {
    margin-top: 18px;
    padding-left: 14px;
    padding-right: 14px;
    padding-bottom: 55px;
  }

  .form-card,
  .guide-card {
    padding: 18px !important;
    border-radius: 16px !important;
  }

  .form-header {
    margin-bottom: 16px;
  }

  .form-header h2 {
    font-size: 1.25rem;
  }

  .form-header p {
    font-size: 0.85rem;
  }

  .section-kicker {
    font-size: 0.68rem;
  }

  .guide-card {
    margin-top: 4px;
  }

  .guide-title {
    font-size: 1.2rem;
    margin-bottom: 12px;
  }

  .guide-step {
    padding: 9px 0;
    gap: 10px;
  }

  .guide-step p {
    font-size: 0.84rem;
  }

  .notice-box {
    padding: 12px;
    font-size: 0.84rem;
  }
}

/* SMALL MOBILE */
@media (max-width: 420px) {
  .hero-title {
    font-size: 1.75rem;
  }

  .nomination-hero {
    min-height: 165px;
  }

  .form-card,
  .guide-card {
    padding: 16px !important;
  }
}
</style>