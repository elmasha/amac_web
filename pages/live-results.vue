<template>
  <v-app class="app-bg">

    <!-- NAV -->
    <v-app-bar app dark class="glass-nav">
      <div class="d-flex align-center">
        <v-avatar size="32" class="brand-avatar">
          <v-img :src="logo"></v-img>
        </v-avatar>

        <div class="ml-3">
          <div class="brand">AMAC Results</div>
          <small class="brand-sub">Live leaderboard</small>
        </div>
      </div>

      <v-spacer></v-spacer>

      <v-btn class="cta-btn nav-btn" rounded to="/voting">
        Vote Now
      </v-btn>
    </v-app-bar>

    <!-- HERO -->
    <section class="results-hero">
      <div class="hero-content">
        <span class="hero-pill">AMAC Awards Season 2</span>

        <h1 class="hero-title">
          Live Voting Results
        </h1>

        <p class="hero-subtitle">
          View all nominees, categories, vote counts, and current leaders.
        </p>
      </div>
    </section>

    <v-container class="main-container">

      <!-- SUMMARY STRIP -->
      <v-row class="summary-row mb-5">
        <!-- <v-col cols="6" md="3">
          <v-card class="summary-card">
            <span>Total Votes</span>
            <h2>{{ grandTotalVotes }}</h2>
          </v-card>
        </v-col> -->

        <v-col cols="6" md="3">
          <v-card class="summary-card">
            <span>Categories</span>
            <h2>{{ categoryCount }}</h2>
          </v-card>
        </v-col>

        <!-- <v-col cols="6" md="3">
          <v-card class="summary-card">
            <span>Refresh</span>
            <h2>{{ refreshedEverySeconds }}s</h2>
          </v-card>
        </v-col> -->

        <v-col cols="6" md="3">
          <v-card class="summary-card">
            <span>Updated</span>
            <h2 class="small-time">{{ formattedLastFetchedAt }}</h2>
          </v-card>
        </v-col>
      </v-row>

      <!-- LEADER + FILTER -->
      <v-row class="mb-6">

        <!-- LEADER SPOTLIGHT -->
        <v-col cols="12" md="7">
          <v-card class="leader-card pa-5" v-if="topLeader">

            <div class="leader-top">
              <div>
                <span class="section-kicker">Currently Leading</span>

                <h2 class="leader-name">
                  {{ topLeader.nominee_name || topLeader.name }}
                </h2>

                <p class="leader-meta">
                  {{ topLeader.category_name }}
                </p>
              </div>

              <div class="leader-medal">
                🏆
              </div>
            </div>

            <div class="leader-progress">
              <div class="d-flex justify-space-between align-center mb-2">
                <span>Vote Share</span>
                <strong>{{ formatPercent(topLeader.percentage) }}%</strong>
              </div>

              <v-progress-linear
                :value="Number(topLeader.percentage || 0)"
                height="16"
                rounded
                color="amber"
                background-color="rgba(255,255,255,0.08)"
              />
            </div>

          </v-card>

          <v-card class="leader-card pa-5" v-else>
            <span class="section-kicker">Live Results</span>
            <h2 class="leader-name">Waiting for first vote</h2>
            <p class="leader-meta">
              All nominees are listed below. The leader will appear once voting starts.
            </p>
          </v-card>
        </v-col>

        <!-- FILTER PANEL -->
        <v-col cols="12" md="5">
          <v-card class="filter-card pa-5">

            <div class="filter-header">
              <div>
                <span class="section-kicker">Filter</span>
                <h3>Category Results</h3>
              </div>

              <v-btn icon class="refresh-btn" :loading="loadingResults" @click="RefreshData">
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
            </div>

            <v-select
              v-model="searchCatResult"
              :items="categories"
              item-text="name"
              item-value="id"
              label="Filter by Category"
              outlined
              dense
              dark
              clearable
              hide-details
              @change="handleCategoryFilter"
            />

            <div class="filter-actions">
              <v-btn small text color="amber" @click="showAllResults">
                Show All Categories
              </v-btn>
            </div>

            <div class="live-chip">
              <span class="pulse-dot"></span>
              Fetching all results on page open • Refresh every 1 minute
            </div>

          </v-card>
        </v-col>

      </v-row>

      <!-- LOADING STATE -->
      <v-card v-if="loadingResults && !safeResults.length" class="empty-state pa-6 text-center">
        <v-progress-circular indeterminate color="amber"></v-progress-circular>

        <h3 class="glow-text mt-4">
          Loading Results...
        </h3>

        <p>
          Fetching all categories, nominees, and vote counts.
        </p>
      </v-card>

      <!-- RESULTS -->
      <div v-else-if="safeResults.length">

        <div
          v-for="cat in safeResults"
          :key="cat.category_id || cat.id"
          class="category-block"
        >

          <div class="category-header">
            <div>
              <span class="section-kicker">Category</span>

              <h2 class="category-title">
                {{ cat.category_name || cat.name }}
              </h2>

              <p class="category-meta">
                Total votes: {{ Number(cat.total_votes || 0) }}
                <span v-if="cat.leader_name"> • Leader: {{ cat.leader_name }}</span>
              </p>
            </div>

            <div class="category-count">
              {{ getNominees(cat).length }} Nominees
            </div>
          </div>

          <v-row>
            <v-col
              cols="12"
              md="6"
              v-for="nom in getNominees(cat)"
              :key="nom.nominee_id || nom.id"
            >
              <v-card
                class="nominee-card fade-card"
                :class="{ leader: nom.is_leader }"
              >

                <div class="nominee-top">
                  <div>
                    <div class="rank-chip">
                      Rank #{{ nom.rank || "-" }}
                    </div>

                    <h3>
                      {{ nom.nominee_name || nom.name }}
                    </h3>

                    <small>
                      {{ nom.location || nom.county || "Location not set" }}
                      <span v-if="nom.church"> • {{ nom.church }}</span>
                    </small>
                  </div>

                  <div v-if="nom.is_leader" class="leader-badge">
                    Leader
                  </div>
                </div>

                <div class="percentage-row">
                  <span>{{ Number(nom.votes || nom.total_votes || 0) }} Votes</span>
                  <strong>{{ formatPercent(nom.percentage) }}%</strong>
                </div>

                <v-progress-linear
                  :value="animatedValues[nom.nominee_id || nom.id] || 0"
                  height="13"
                  rounded
                  background-color="rgba(255,255,255,0.08)"
                  color="amber"
                />

              </v-card>
            </v-col>
          </v-row>

        </div>

      </div>

      <!-- EMPTY STATE -->
      <v-card v-else class="empty-state pa-6 text-center">
        <h2 class="glow-text">
          No Nominees Yet
        </h2>

        <p>
          No categories or nominees were found.
        </p>

        <v-btn class="cta-btn mt-3" rounded to="/nominate">
          Nominate Now
        </v-btn>
      </v-card>

    </v-container>

  </v-app>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      logo: require("@/assets/logo.png"),

      categories: [],
      Results: [],
      allResults: [],

      searchCatResult: null,
      animatedValues: {},
      topLeader: null,
      refreshInterval: null,

      loadingResults: false,

      grandTotalVotes: 0,
      categoryCount: 0,
      refreshedEverySeconds: 60,
      lastFetchedAt: null
    };
  },

  computed: {
    safeResults() {
      if (Array.isArray(this.Results)) {
        return this.Results.map(cat => ({
          ...cat,
          nominees: Array.isArray(cat.nominees) ? cat.nominees : []
        }));
      }

      return [];
    },

    formattedLastFetchedAt() {
      if (!this.lastFetchedAt) return "-";

      const date = new Date(this.lastFetchedAt);

      if (isNaN(date.getTime())) return "-";

      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      });
    }
  },

  async mounted() {
    await this.fetchEverythingOnOpen();

    this.refreshInterval = setInterval(() => {
      this.RefreshData();
    }, 60000);
  },

  beforeDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  },

  methods: {
    async fetchEverythingOnOpen() {
      await this.fetchCategories();
      await this.fetchOverview();
      this.showAllResults();
    },

    normalizePayload(data) {
      const results = Array.isArray(data && data.results)
        ? data.results
        : Array.isArray(data)
          ? data
          : [];

      this.grandTotalVotes = Number((data && data.grand_total_votes) || 0);
      this.categoryCount = Number((data && data.category_count) || results.length || 0);
      this.refreshedEverySeconds = Number((data && data.refreshed_every_seconds) || 60);
      this.lastFetchedAt = (data && data.lastFetchedAt) || new Date().toISOString();

      return results.map(cat => ({
        ...cat,
        nominees: Array.isArray(cat.nominees) ? cat.nominees : []
      }));
    },

    getNominees(cat) {
      return Array.isArray(cat.nominees) ? cat.nominees : [];
    },

    async fetchCategories() {
      try {
        const { data } = await axios.get(
          "https://amacserver-production-48fd.up.railway.app/api/categories/getAll"
        );

        this.categories = Array.isArray(data) ? data : [];
      } catch (error) {
        console.error("fetchCategories error:", error);
        this.categories = [];
      }
    },

    async fetchOverview() {
      try {
        this.loadingResults = true;

        const { data } = await axios.get(
          "https://amacserver-production-48fd.up.railway.app/api/votes/overview"
        );

        const results = this.normalizePayload(data);

        this.allResults = results;
        this.Results = results;

        this.setTopLeader();
        this.animateBars();

        console.log("ALL RESULTS FETCHED ON OPEN:", results);

      } catch (error) {
        console.error("fetchOverview error:", error);
        this.Results = [];
        this.allResults = [];
        this.topLeader = null;
      } finally {
        this.loadingResults = false;
      }
    },

    async fetchOverviewByCategory() {
      if (!this.searchCatResult) {
        this.showAllResults();
        return;
      }

      try {
        this.loadingResults = true;

        const { data } = await axios.get(
          `https://amacserver-production-48fd.up.railway.app/api/votes/overview/${this.searchCatResult}`
        );

        const results = this.normalizePayload(data);

        this.Results = results;

        this.setTopLeader();
        this.animateBars();

      } catch (error) {
        console.error("fetchOverviewByCategory error:", error);
        this.Results = [];
        this.topLeader = null;
      } finally {
        this.loadingResults = false;
      }
    },

    handleCategoryFilter() {
      if (this.searchCatResult) {
        this.fetchOverviewByCategory();
      } else {
        this.showAllResults();
      }
    },

    RefreshData() {
      if (this.searchCatResult) {
        this.fetchOverviewByCategory();
      } else {
        this.fetchOverview();
      }
    },

    showAllResults() {
      this.searchCatResult = null;
      this.Results = this.allResults;

      this.setTopLeader();
      this.animateBars();
    },

    setTopLeader() {
      let maxVotes = -1;
      let leader = null;

      this.safeResults.forEach(cat => {
        const nominees = this.getNominees(cat);

        nominees.forEach(nom => {
          const votes = Number(nom.votes || nom.total_votes || 0);

          if (votes > maxVotes) {
            maxVotes = votes;
            leader = {
              ...nom,
              category_name: cat.category_name || cat.name
            };
          }
        });
      });

      if (leader && Number(leader.votes || leader.total_votes || 0) > 0) {
        this.topLeader = leader;
      } else {
        this.topLeader = null;
      }
    },

    animateBars() {
      this.safeResults.forEach(cat => {
        const nominees = this.getNominees(cat);

        nominees.forEach(nom => {
          const key = nom.nominee_id || nom.id;

          this.$set(this.animatedValues, key, 0);

          setTimeout(() => {
            this.$set(
              this.animatedValues,
              key,
              Number(nom.percentage || 0)
            );
          }, 180);
        });
      });
    },

    formatPercent(value) {
      const num = Number(value || 0);
      return num.toFixed(num % 1 === 0 ? 0 : 1);
    }
  }
};
</script>

<style>
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

/* HERO */
.results-hero {
  min-height: 220px;
  padding: 95px 20px 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  background:
    radial-gradient(circle at center, rgba(255, 215, 0, 0.22), transparent 42%),
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
  margin-bottom: 12px;
}

.hero-title {
  color: gold;
  font-size: clamp(2rem, 5vw, 3.7rem);
  font-weight: 900;
  text-shadow: 0 0 22px rgba(255, 215, 0, 0.46);
  margin-bottom: 8px;
}

.hero-subtitle {
  margin: 0;
  opacity: 0.78;
  font-size: 1rem;
}

/* MAIN */
.main-container {
  margin-top: 26px;
  padding-bottom: 80px;
}

/* SUMMARY */
.summary-card {
  background: rgba(17, 17, 17, 0.95) !important;
  border: 1px solid rgba(255, 215, 0, 0.14);
  border-radius: 18px !important;
  padding: 18px;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.42);
}

.summary-card span {
  opacity: 0.65;
  font-size: 0.78rem;
}

.summary-card h2 {
  color: gold;
  font-weight: 900;
  margin-top: 6px;
  margin-bottom: 0;
}

.small-time {
  font-size: 1.1rem;
}

/* CARDS */
.leader-card,
.filter-card,
.nominee-card,
.empty-state {
  background: rgba(17, 17, 17, 0.95) !important;
  border: 1px solid rgba(255, 215, 0, 0.16);
  border-radius: 20px !important;
  backdrop-filter: blur(12px);
  box-shadow: 0 22px 55px rgba(0, 0, 0, 0.48);
}

/* SECTION TEXT */
.section-kicker {
  display: block;
  color: gold;
  font-size: 0.72rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  opacity: 0.88;
  margin-bottom: 6px;
}

/* LEADER */
.leader-card {
  position: relative;
  overflow: hidden;
}

.leader-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at top right, rgba(255, 215, 0, 0.15), transparent 44%);
  pointer-events: none;
}

.leader-top {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
}

.leader-name {
  color: gold;
  font-size: clamp(1.6rem, 4vw, 2.5rem);
  font-weight: 900;
  margin-bottom: 4px;
  text-shadow: 0 0 18px rgba(255, 215, 0, 0.35);
}

.leader-meta {
  opacity: 0.7;
  margin-bottom: 0;
}

.leader-medal {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(255, 215, 0, 0.12);
  border: 1px solid rgba(255, 215, 0, 0.28);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  box-shadow: 0 0 24px rgba(255, 215, 0, 0.2);
}

.leader-progress {
  position: relative;
  z-index: 2;
  margin-top: 24px;
}

.leader-progress span {
  opacity: 0.7;
}

.leader-progress strong {
  color: gold;
}

/* FILTER */
.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.filter-header h3 {
  margin: 0;
  color: #fff;
  font-weight: 900;
}

.filter-actions {
  margin-top: 10px;
}

.refresh-btn {
  background: rgba(255, 215, 0, 0.08);
  border: 1px solid rgba(255, 215, 0, 0.16);
}

.live-chip {
  margin-top: 16px;
  padding: 11px 13px;
  border-radius: 14px;
  background: rgba(255, 215, 0, 0.08);
  color: rgba(255, 255, 255, 0.78);
  font-size: 0.82rem;
  display: flex;
  align-items: center;
  gap: 9px;
}

.pulse-dot {
  width: 9px;
  height: 9px;
  background: #76ff7a;
  border-radius: 50%;
  box-shadow: 0 0 12px #76ff7a;
  animation: pulseDot 1.3s infinite;
}

@keyframes pulseDot {
  0% {
    opacity: 0.4;
    transform: scale(0.85);
  }

  50% {
    opacity: 1;
    transform: scale(1.1);
  }

  100% {
    opacity: 0.4;
    transform: scale(0.85);
  }
}

/* CATEGORY */
.category-block {
  margin-top: 36px;
}

.category-header {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: flex-end;
  margin-bottom: 18px;
}

.category-title {
  color: gold;
  margin: 0;
  font-weight: 900;
}

.category-meta {
  margin: 6px 0 0;
  opacity: 0.68;
  font-size: 0.85rem;
}

.category-count {
  padding: 7px 13px;
  border-radius: 999px;
  border: 1px solid rgba(255, 215, 0, 0.2);
  color: gold;
  background: rgba(255, 215, 0, 0.08);
  font-size: 0.78rem;
  white-space: nowrap;
}

/* NOMINEE CARD */
.nominee-card {
  padding: 20px;
  transition: 0.3s ease;
  position: relative;
  overflow: hidden;
}

.nominee-card::before {
  content: "";
  position: absolute;
  height: 3px;
  width: 48%;
  left: 20px;
  top: 0;
  background: linear-gradient(90deg, gold, transparent);
  opacity: 0.78;
}

.nominee-card:hover {
  transform: translateY(-5px);
  border-color: rgba(255, 215, 0, 0.42);
  box-shadow: 0 16px 42px rgba(255, 215, 0, 0.13);
}

.nominee-card.leader {
  border-color: rgba(255, 215, 0, 0.45);
  background:
    radial-gradient(circle at top right, rgba(255, 215, 0, 0.15), transparent 42%),
    rgba(17, 17, 17, 0.95) !important;
}

.nominee-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

.nominee-top h3 {
  margin-bottom: 5px;
  font-size: 1rem;
  font-weight: 850;
}

.nominee-top small {
  display: block;
  opacity: 0.58;
}

.rank-chip {
  display: inline-block;
  margin-bottom: 8px;
  padding: 4px 9px;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 900;
  color: gold;
  background: rgba(255, 215, 0, 0.08);
  border: 1px solid rgba(255, 215, 0, 0.18);
}

.leader-badge {
  background: linear-gradient(135deg, gold, #ffcc00);
  color: #000;
  padding: 5px 11px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 900;
  white-space: nowrap;
}

.percentage-row {
  margin: 16px 0 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.percentage-row span {
  opacity: 0.62;
  font-size: 0.82rem;
}

.percentage-row strong {
  color: gold;
}

/* EMPTY */
.empty-state {
  margin-top: 30px;
}

.empty-state p {
  opacity: 0.72;
}

/* BUTTON */
.cta-btn {
  background: linear-gradient(135deg, gold, #ffcc00) !important;
  color: black !important;
  font-weight: 900;
  letter-spacing: 0.3px;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.32);
}

.nav-btn {
  padding-left: 18px !important;
  padding-right: 18px !important;
}

/* TEXT */
.glow-text {
  color: gold;
  text-shadow: 0 0 14px rgba(255, 215, 0, 0.52);
}

/* ANIMATION */
.fade-card {
  animation: fadeUp 0.65s ease;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(22px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
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

  .results-hero {
    min-height: 170px;
    padding: 80px 16px 24px;
  }

  .hero-pill {
    font-size: 0.68rem;
    padding: 5px 11px;
    margin-bottom: 8px;
  }

  .hero-title {
    font-size: 1.8rem;
    line-height: 1.08;
    margin-bottom: 6px;
  }

  .hero-subtitle {
    font-size: 0.82rem;
    max-width: 320px;
    margin: 0 auto;
  }

  .main-container {
    margin-top: 16px;
    padding-left: 14px;
    padding-right: 14px;
    padding-bottom: 55px;
  }

  .summary-card {
    padding: 14px;
  }

  .summary-card h2 {
    font-size: 1.15rem;
  }

  .small-time {
    font-size: 0.9rem !important;
  }

  .leader-card,
  .filter-card {
    padding: 18px !important;
  }

  .leader-top {
    align-items: center;
  }

  .leader-name {
    font-size: 1.4rem;
  }

  .leader-medal {
    width: 48px;
    height: 48px;
    font-size: 1.45rem;
  }

  .category-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .category-count {
    font-size: 0.7rem;
  }

  .nominee-card {
    padding: 17px;
  }

  .nominee-top {
    flex-direction: column;
  }

  .leader-badge {
    align-self: flex-start;
  }
}
</style>