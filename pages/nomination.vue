<template>
  <v-app class="app-bg">
    <!-- NAV -->
    <v-app-bar app dark class="glass-nav" elevate-on-scroll>
      <div class="d-flex align-center">
        <v-avatar size="36" class="brand-avatar">
          <v-img :src="logo" />
        </v-avatar>
        <div class="ml-3">
          <div class="brand">AMAC Awards</div>
          <small class="brand-sub">Nomination Portal</small>
        </div>
      </div>
      <v-spacer />
      <v-btn class="cta-btn nav-btn" rounded @click="$router.push('/')">
        <v-icon left small>mdi-arrow-left</v-icon>
        Back Home
      </v-btn>
    </v-app-bar>

    <!-- HERO -->
    <section class="nomination-hero">
      <div class="hero-content">
        <span class="hero-pill">
          <v-icon small left color="gold">mdi-trophy</v-icon>
          AMAC Awards Season 2
        </span>
        <h1 class="hero-title">Nominate a Candidate</h1>
        <p class="hero-subtitle">
          Celebrate excellence. Recognize someone making an impact in Adventist music.
        </p>
      </div>
    </section>

    <!-- MAIN -->
    <v-container class="main-container">
      <!-- Global Status Banner -->
      <v-slide-y-transition>
        <v-alert
          v-if="globalStatus.show"
          :type="globalStatus.type"
          :icon="globalStatus.icon"
          class="mb-4 status-banner"
          prominent
          dismissible
          @input="globalStatus.show = false"
        >
          <strong>{{ globalStatus.title }}</strong><br>
          {{ globalStatus.message }}
        </v-alert>
      </v-slide-y-transition>

      <!-- Progress Steps -->
      <div class="steps-wrap mb-5">
        <div
          v-for="(step, idx) in steps"
          :key="idx"
          class="step-box"
          :class="{ active: step.active, completed: step.completed }"
        >
          <v-icon v-if="step.completed" small color="black">mdi-check</v-icon>
          <span v-else>{{ step.num }}</span>
          <p>{{ step.label }}</p>
        </div>
      </div>

      <v-row align="start">
        <!-- FORM -->
        <v-col cols="12" md="7" lg="7">
          <v-card class="form-card" :class="{ 'pulse-border': !selectedCategory }">
            <div class="form-header">
              <span class="section-kicker">Nomination Form</span>
              <h2 class="glow-text">Submit Nominee Details</h2>
              <p>Fill in all required fields below. Fields marked with <span class="required">*</span> are mandatory.</p>
            </div>

            <!-- Category -->
            <div class="field-group">
              <label class="field-label">
                <v-icon x-small left color="gold">mdi-view-grid</v-icon>
                Category <span class="required">*</span>
                <v-chip v-if="selectedCategory" x-small color="gold" dark class="ml-2 status-chip">Selected</v-chip>
              </label>
              <v-select
                v-model="selectedCategory"
                :items="categories"
                item-text="name"
                item-value="id"
                label="Choose award category"
                outlined
                dense
                dark
                hide-details
                :loading="loadingCategories"
                :disabled="loadingCategories"
                prepend-inner-icon="mdi-trophy"
                @change="onCategoryChange"
              />
              <v-fade-transition>
                <div v-if="loadingCategories" class="mt-2 d-flex align-center">
                  <v-progress-circular indeterminate size="14" color="gold" class="mr-2" />
                  <span class="caption grey--text">Loading categories...</span>
                </div>
              </v-fade-transition>
            </div>

            <!-- Nominee Name -->
            <v-slide-y-transition>
              <div v-if="selectedCategory" class="field-group">
                <label class="field-label">
                  <v-icon x-small left color="gold">mdi-account</v-icon>
                  Nominee Name <span class="required">*</span>
                </label>
                <v-text-field
                  v-model="nomineeName"
                  label="Enter full official name"
                  outlined
                  dense
                  dark
                  hide-details
                  prepend-inner-icon="mdi-account-music"
                  :disabled="submitting"
                  @input="checkDuplicateDebounce"
                />
                <v-fade-transition>
                  <div v-if="duplicateCheck.loading" class="mt-2 d-flex align-center">
                    <v-progress-circular indeterminate size="14" color="gold" class="mr-2" />
                    <span class="caption grey--text">Checking for duplicates...</span>
                  </div>
                  <div v-else-if="duplicateCheck.found" class="mt-2 d-flex align-center duplicate-warning">
                    <v-icon x-small color="orange" class="mr-1">mdi-alert</v-icon>
                    <span class="caption orange--text">This nominee may already exist. Please verify before submitting.</span>
                  </div>
                </v-fade-transition>
              </div>
            </v-slide-y-transition>

            <!-- County -->
            <v-slide-y-transition>
              <div v-if="nomineeName.length > 2" class="field-group">
                <label class="field-label">
                  <v-icon x-small left color="gold">mdi-map-marker</v-icon>
                  County <span class="required">*</span>
                </label>
                <v-autocomplete
                  v-model="county_id"
                  :items="counties"
                  item-text="name"
                  item-value="id"
                  label="Select county"
                  outlined
                  dense
                  dark
                  hide-details
                  :loading="loadingCounties"
                  :disabled="loadingCounties || submitting"
                  prepend-inner-icon="mdi-map"
                />
                <v-fade-transition>
                  <div v-if="loadingCounties" class="mt-2 d-flex align-center">
                    <v-progress-circular indeterminate size="14" color="gold" class="mr-2" />
                    <span class="caption grey--text">Loading counties...</span>
                  </div>
                </v-fade-transition>
              </div>
            </v-slide-y-transition>

            <!-- Location -->
            <v-slide-y-transition>
              <div v-if="county_id" class="field-group">
                <label class="field-label">
                  <v-icon x-small left color="gold">mdi-map-marker-radius</v-icon>
                  Location
                </label>
                <v-text-field
                  v-model="location"
                  label="Town or area (optional)"
                  outlined
                  dense
                  dark
                  hide-details
                  prepend-inner-icon="mdi-home-map-marker"
                  :disabled="submitting"
                />
              </div>
            </v-slide-y-transition>

            <!-- Church -->
            <v-slide-y-transition>
              <div v-if="county_id" class="field-group">
                <label class="field-label">
                  <v-icon x-small left color="gold">mdi-church</v-icon>
                  Church / Group
                </label>
                <v-text-field
                  v-model="church"
                  label="Church or group name (optional)"
                  outlined
                  dense
                  dark
                  hide-details
                  prepend-inner-icon="mdi-account-group"
                  :disabled="submitting"
                />
              </div>
            </v-slide-y-transition>

            <!-- Submit -->
            <v-slide-y-transition>
              <div v-if="county_id" class="mt-4">
                <v-btn
                  block
                  large
                  height="48"
                  class="cta-btn"
                  :loading="submitting"
                  :disabled="submitting || !canSubmit"
                  @click="CheckNominee"
                >
                  <v-icon left>mdi-send</v-icon>
                  {{ submitButtonText }}
                </v-btn>
                <div v-if="!canSubmit" class="mt-2 text-center">
                  <span class="caption grey--text">Complete all required fields to submit</span>
                </div>
              </div>
            </v-slide-y-transition>
          </v-card>
        </v-col>

        <!-- GUIDE -->
        <v-col cols="12" md="5" lg="5">
          <v-card class="guide-card">
            <span class="section-kicker">Guide</span>
            <h2 class="glow-text guide-title">Before You Submit</h2>

            <div class="guide-list">
              <div
                v-for="(g, i) in guideSteps"
                :key="i"
                class="guide-step"
                :class="{ active: g.active }"
              >
                <span>{{ g.num }}</span>
                <div>
                  <p class="guide-title">{{ g.title }}</p>
                  <p class="guide-desc">{{ g.desc }}</p>
                </div>
              </div>
            </div>

            <v-divider dark class="my-4" />

            <div class="notice-box">
              <v-icon left small color="gold">mdi-information</v-icon>
              <div>
                <strong>Note:</strong><br>
                Duplicate nominees will not be submitted again. The system checks automatically.
              </div>
            </div>

            <div class="trust-badges mt-4 d-flex justify-space-around">
              <div class="trust-item text-center">
                <v-icon color="gold">mdi-shield-check</v-icon>
                <div class="caption">Verified</div>
              </div>
              <div class="trust-item text-center">
                <v-icon color="gold">mdi-refresh-auto</v-icon>
                <div class="caption">Auto-Check</div>
              </div>
              <div class="trust-item text-center">
                <v-icon color="gold">mdi-database-check</v-icon>
                <div class="caption">Stored</div>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- SUCCESS DIALOG -->
    <v-dialog v-model="successDialog" max-width="420" persistent>
      <v-card class="cinematic-card text-center pa-6">
        <v-scale-transition>
          <div>
            <div class="success-ring">
              <v-icon size="40" color="black">mdi-check</v-icon>
            </div>
            <h2 class="glow-text mt-4">Nomination Submitted!</h2>
            <p class="result-message body-2 mt-2">
              <strong class="white--text">{{ nomineeName }}</strong> has been successfully nominated in
              <strong class="gold--text">{{ selectedCategoryName }}</strong>.
            </p>
            <v-alert text dense color="gold" class="mt-3 text-left" dark>
              <v-icon left small>mdi-information</v-icon>
              The nominee will now appear in the voting portal for public voting.
            </v-alert>
            <v-btn class="cta-btn mt-4" height="48" block @click="resetForm">
              <v-icon left>mdi-plus</v-icon>
              Nominate Another
            </v-btn>
            <v-btn text color="grey" class="mt-2" block @click="goHome">
              Back to Home
            </v-btn>
          </div>
        </v-scale-transition>
      </v-card>
    </v-dialog>

    <!-- DUPLICATE DIALOG -->
    <v-dialog v-model="duplicateDialog" max-width="420">
      <v-card class="cinematic-card text-center pa-6">
        <v-icon size="64" color="orange" class="mb-3">mdi-alert-circle</v-icon>
        <h2 class="warning-text">Already Exists</h2>
        <p class="result-message body-2 mt-2">
          <strong class="white--text">{{ nomineeName }}</strong> from
          <strong class="white--text">{{ church || location || 'this location' }}</strong>
          is already nominated in this category.
        </p>
        <v-alert text dense color="orange" class="mt-3 text-left" dark>
          <v-icon left small>mdi-information</v-icon>
          Duplicate nominees are not allowed to ensure fair voting.
        </v-alert>
        <v-btn class="cta-btn mt-4" height="48" block @click="duplicateDialog = false">
          <v-icon left>mdi-refresh</v-icon>
          Try Different Details
        </v-btn>
      </v-card>
    </v-dialog>

    <!-- ERROR SNACKBAR -->
    <v-snackbar v-model="snackbarError" color="error" bottom timeout="6000" multi-line>
      <div class="d-flex align-start">
        <v-icon left class="mt-1">mdi-alert-circle</v-icon>
        <div>
          <strong>{{ snackbarTitle }}</strong><br>
          <span class="body-2">{{ snackbarTextError }}</span>
        </div>
      </div>
      <template #action>
        <v-btn text @click="snackbarError = false">Dismiss</v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  name: "NominationPortal",
  data() {
    return {
      logo: require("@/assets/logo.png"),
      categories: [],
      counties: [],
      loadingCategories: false,
      loadingCounties: false,

      nomineeName: "",
      selectedCategory: null,
      county_id: null,
      location: "",
      church: "",

      duplicateCheck: { loading: false, found: false, timer: null },
      submitting: false,

      successDialog: false,
      duplicateDialog: false,
      snackbarError: false,
      snackbarTitle: "Error",
      snackbarTextError: "",

      globalStatus: { show: false, type: "info", icon: "", title: "", message: "" },
    };
  },

  computed: {
    steps() {
      return [
        { num: "01", label: "Category", active: !!this.selectedCategory, completed: !!this.selectedCategory },
        { num: "02", label: "Name", active: !!this.nomineeName && !this.selectedCategory, completed: this.nomineeName.length > 2 },
        { num: "03", label: "County", active: !!this.county_id && this.nomineeName.length <= 2, completed: !!this.county_id },
        { num: "04", label: "Submit", active: this.submitting, completed: false },
      ];
    },
    guideSteps() {
      return [
        { num: "01", title: "Select Category", desc: "Choose the correct award category for this nominee.", active: !this.selectedCategory },
        { num: "02", title: "Enter Name", desc: "Type the nominee's official full name as it should appear.", active: !!this.selectedCategory && this.nomineeName.length <= 2 },
        { num: "03", title: "Select County", desc: "Pick the county where the nominee is based.", active: this.nomineeName.length > 2 && !this.county_id },
        { num: "04", title: "Add Details", desc: "Location and church/group are optional but helpful.", active: !!this.county_id && !this.submitting },
        { num: "05", title: "Submit", desc: "The system will check for duplicates before saving.", active: this.submitting },
      ];
    },
    selectedCategoryName() {
      const cat = this.categories.find((c) => c.id === this.selectedCategory);
      return cat ? cat.name : "";
    },
    canSubmit() {
      return this.nomineeName.trim().length > 2 && this.selectedCategory && this.county_id;
    },
    submitButtonText() {
      if (this.duplicateCheck.found) return "Submit Anyway (Duplicate Warning)";
      return "Submit Nomination";
    },
  },

  async mounted() {
    await this.fetchCategories();
    await this.fetchCounties();
  },

  methods: {
    showGlobal(type, title, message) {
      this.globalStatus = { show: true, type, icon: type === "error" ? "mdi-alert" : "mdi-information", title, message };
      setTimeout(() => (this.globalStatus.show = false), 6000);
    },

    async fetchCategories() {
      this.loadingCategories = true;
      try {
        const { data } = await axios.get("https://amacserver-production-29a2.up.railway.app/api/categories/getAll");
        this.categories = data;
      } catch (err) {
        console.error("fetchCategories error:", err);
        this.showGlobal("error", "Connection Error", "Failed to load categories. Please check your internet and refresh.");
      } finally {
        this.loadingCategories = false;
      }
    },

    async fetchCounties() {
      this.loadingCounties = true;
      try {
        const { data } = await axios.get("https://amacserver-production-29a2.up.railway.app/api/counties/get-counties");
        this.counties = data;
      } catch (err) {
        console.error("fetchCounties error:", err);
        this.showGlobal("error", "Connection Error", "Failed to load counties. Some fields may not work correctly.");
      } finally {
        this.loadingCounties = false;
      }
    },

    onCategoryChange() {
      this.nomineeName = "";
      this.county_id = null;
      this.location = "";
      this.church = "";
      this.duplicateCheck.found = false;
    },

    checkDuplicateDebounce() {
      if (this.duplicateCheck.timer) clearTimeout(this.duplicateCheck.timer);
      if (this.nomineeName.length < 3) {
        this.duplicateCheck.found = false;
        return;
      }
      this.duplicateCheck.timer = setTimeout(() => this.checkDuplicate(), 800);
    },

    async checkDuplicate() {
      if (!this.nomineeName || !this.selectedCategory) return;
      this.duplicateCheck.loading = true;
      try {
        const { data } = await axios.get(
          `https://amacserver-production-29a2.up.railway.app/api/nominee/check?name=${encodeURIComponent(this.nomineeName)}&church=${encodeURIComponent(this.church)}&location=${encodeURIComponent(this.location)}&county_id=${this.county_id || ''}`
        );
        this.duplicateCheck.found = data.exists;
      } catch (err) {
        console.error("Duplicate check error:", err);
      } finally {
        this.duplicateCheck.loading = false;
      }
    },

    async CheckNominee() {
      if (!this.canSubmit) {
        this.snackbarTitle = "Missing Fields";
        this.snackbarTextError = "Please fill in all required fields (Category, Name, and County) before submitting.";
        this.snackbarError = true;
        return;
      }

      this.submitting = true;

      try {
        const { data } = await axios.get(
          `https://amacserver-production-29a2.up.railway.app/api/nominee/check?name=${encodeURIComponent(this.nomineeName)}&church=${encodeURIComponent(this.church)}&location=${encodeURIComponent(this.location)}&county_id=${this.county_id}`
        );

        if (data.exists) {
          this.duplicateDialog = true;
        } else {
          await this.submitNominee();
        }
      } catch (err) {
        console.error("CheckNominee error:", err);
        this.snackbarTitle = "Check Failed";
        this.snackbarTextError = "Could not verify if nominee exists. Please check your connection and try again.";
        this.snackbarError = true;
      }

      this.submitting = false;
    },

    async submitNominee() {
      try {
        await axios.post("https://amacserver-production-29a2.up.railway.app/api/nominee/addNominee", {
          name: this.nomineeName.trim(),
          category_id: this.selectedCategory,
          location: this.location.trim(),
          church: this.church.trim(),
          county_id: this.county_id,
        });

        this.successDialog = true;
      } catch (err) {
        console.error("submitNominee error:", err);
        this.snackbarTitle = "Submission Failed";
        this.snackbarTextError = err.response?.data?.error || err.response?.data?.message || "Failed to submit nominee. Please try again.";
        this.snackbarError = true;
      }
    },

    resetForm() {
      this.successDialog = false;
      this.nomineeName = "";
      this.selectedCategory = null;
      this.county_id = null;
      this.location = "";
      this.church = "";
      this.duplicateCheck.found = false;
      this.submitting = false;
    },

    goHome() {
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
:root { --gold: #ffd700; }

.app-bg {
  background: #000;
  color: #fff;
  min-height: 100vh;
  overflow-x: hidden;
}

/* NAV */
.glass-nav {
  background: rgba(0, 0, 0, 0.92) !important;
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255, 215, 0, 0.15);
}
.brand-avatar {
  border: 2px solid rgba(255, 215, 0, 0.35);
}
.brand {
  color: gold;
  font-weight: 900;
  font-size: 1rem;
  line-height: 1;
}
.brand-sub {
  color: rgba(255, 255, 255, 0.55);
  font-size: 0.7rem;
}
.nav-btn {
  padding-left: 18px !important;
  padding-right: 18px !important;
}

/* HERO */
.nomination-hero {
  min-height: 260px;
  padding: 100px 20px 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background:
    radial-gradient(circle at 30% 20%, rgba(255, 215, 0, 0.15), transparent 50%),
    radial-gradient(circle at 70% 80%, rgba(255, 215, 0, 0.08), transparent 40%),
    linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.95)),
    repeating-linear-gradient(45deg, rgba(255, 215, 0, 0.08) 0px, rgba(255, 215, 0, 0.08) 1px, transparent 1px, transparent 36px),
    repeating-linear-gradient(-45deg, rgba(255, 215, 0, 0.05) 0px, rgba(255, 215, 0, 0.05) 1px, transparent 1px, transparent 42px),
    #000;
}
.hero-content { max-width: 720px; }
.hero-pill {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 999px;
  border: 1px solid rgba(255, 215, 0, 0.35);
  background: rgba(255, 215, 0, 0.08);
  color: gold;
  font-size: 0.8rem;
  margin-bottom: 16px;
  gap: 6px;
}
.hero-title {
  color: gold;
  font-size: clamp(2.2rem, 5vw, 3.7rem);
  font-weight: 900;
  text-shadow: 0 0 24px rgba(255, 215, 0, 0.5);
  margin-bottom: 12px;
  line-height: 1.1;
}
.hero-subtitle {
  margin: 0;
  opacity: 0.75;
  font-size: 1.05rem;
  max-width: 500px;
}

/* MAIN */
.main-container {
  margin-top: 32px;
  padding-bottom: 80px;
}
.status-banner {
  border-radius: 14px !important;
  background: rgba(17, 17, 17, 0.95) !important;
}

/* PROGRESS STEPS */
.steps-wrap {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  gap: 0;
}
.step-box {
  flex: 1;
  background: rgba(17, 17, 17, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  padding: 14px 10px;
  text-align: center;
  transition: all 0.35s ease;
}
.step-box:not(:last-child) {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-right: none;
}
.step-box:not(:first-child) {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
.step-box span, .step-box .v-icon {
  display: block;
  color: gold;
  font-weight: 900;
  font-size: 0.9rem;
  margin: 0 auto 4px;
}
.step-box p {
  margin: 0;
  font-size: 0.78rem;
  opacity: 0.6;
}
.step-box.active {
  background: linear-gradient(135deg, gold, #ffcc00);
  color: black;
  border-color: gold;
  box-shadow: 0 0 24px rgba(255, 215, 0, 0.3);
}
.step-box.active span, .step-box.active .v-icon { color: black; }
.step-box.active p { opacity: 1; font-weight: 600; }
.step-box.completed {
  background: rgba(255, 215, 0, 0.12);
  border-color: rgba(255, 215, 0, 0.4);
}

/* CARDS */
.form-card, .guide-card, .cinematic-card {
  background: rgba(17, 17, 17, 0.94) !important;
  border: 1px solid rgba(255, 215, 0, 0.12);
  border-radius: 20px !important;
  backdrop-filter: blur(14px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}
.form-card { padding: 28px; }
.guide-card { padding: 28px; }
.pulse-border {
  animation: borderPulse 2s ease-in-out infinite;
}
@keyframes borderPulse {
  0%, 100% { border-color: rgba(255, 215, 0, 0.12); }
  50% { border-color: rgba(255, 215, 0, 0.4); }
}

/* FORM */
.form-header { margin-bottom: 24px; }
.form-header h2 {
  margin-bottom: 8px;
  font-size: 1.55rem;
}
.form-header p {
  opacity: 0.65;
  margin: 0;
  font-size: 0.9rem;
}
.required { color: #ff4d4d; }

.field-group { margin-bottom: 18px; }
.field-label {
  display: flex;
  align-items: center;
  font-size: 0.85rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 6px;
  gap: 4px;
}
.field-label .v-icon { margin-right: 2px; }
.status-chip {
  font-weight: 700;
  letter-spacing: 0.3px;
}
.duplicate-warning {
  background: rgba(255, 183, 77, 0.08);
  border-radius: 8px;
  padding: 6px 10px;
  border: 1px solid rgba(255, 183, 77, 0.2);
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
.guide-list { margin-top: 8px; }
.guide-step {
  display: flex;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  opacity: 0.6;
  transition: all 0.3s ease;
}
.guide-step.active {
  opacity: 1;
  background: rgba(255, 215, 0, 0.04);
  margin: 0 -12px;
  padding: 14px 12px;
  border-radius: 12px;
}
.guide-step span {
  color: gold;
  font-weight: 900;
  font-size: 1rem;
  min-width: 28px;
}
.guide-title {
  margin: 0 0 2px;
  font-weight: 600;
  font-size: 0.92rem;
}
.guide-desc {
  margin: 0;
  font-size: 0.82rem;
  opacity: 0.7;
}
.notice-box {
  margin-top: 16px;
  background: rgba(255, 215, 0, 0.06);
  border-left: 4px solid gold;
  padding: 14px 16px;
  border-radius: 12px;
  display: flex;
  gap: 10px;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.8);
}
.trust-badges { margin-top: 20px; }
.trust-item .v-icon { margin-bottom: 4px; }
.trust-item .caption { opacity: 0.6; font-size: 0.7rem; }

/* BUTTON */
.cta-btn {
  background: linear-gradient(135deg, gold, #ffcc00) !important;
  color: black !important;
  font-weight: 900;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 20px rgba(255, 215, 0, 0.35);
  transition: all 0.25s ease;
}
.cta-btn:hover {
  box-shadow: 0 6px 28px rgba(255, 215, 0, 0.5);
  transform: translateY(-1px);
}
.cta-btn:disabled {
  opacity: 0.5;
  transform: none;
}

/* SUCCESS */
.success-ring {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, gold, #ffcc00);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.4);
}
.result-message {
  opacity: 0.85;
  line-height: 1.6;
}

/* TEXT */
.glow-text {
  color: gold;
  text-shadow: 0 0 14px rgba(255, 215, 0, 0.52);
}
.warning-text { color: #ffb74d; }
.error-text { color: #ff4d4d; }

/* MOBILE */
@media (max-width: 768px) {
  .nav-btn {
    padding-left: 12px !important;
    padding-right: 12px !important;
    font-size: 0.75rem !important;
  }
  .brand { font-size: 0.9rem; }
  .brand-sub { display: none; }
  .nomination-hero {
    min-height: 180px;
    padding: 84px 16px 28px;
  }
  .hero-title { font-size: 2rem; }
  .hero-subtitle { font-size: 0.88rem; }
  .main-container {
    margin-top: 20px;
    padding-left: 14px;
    padding-right: 14px;
  }
  .form-card, .guide-card {
    padding: 18px !important;
    border-radius: 16px !important;
  }
  .form-header h2 { font-size: 1.3rem; }
  .guide-title { font-size: 1.2rem; }
  .steps-wrap { overflow-x: auto; padding-bottom: 4px; }
  .step-box { min-width: 80px; padding: 10px 8px; }
  .step-box p { font-size: 0.72rem; }
}

@media (max-width: 420px) {
  .hero-title { font-size: 1.75rem; }
  .nomination-hero { min-height: 165px; }
}
</style>