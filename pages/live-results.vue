<template>
  <v-app class="app-bg">
    <!-- NAV -->
    <v-app-bar app dark class="glass-nav" elevate-on-scroll>
      <div class="d-flex align-center">
        <v-avatar size="36" class="brand-avatar">
          <v-img :src="logo" />
        </v-avatar>
        <div class="ml-3">
          <div class="brand">AMAC Results</div>
          <small class="brand-sub">Live Leaderboard</small>
        </div>
      </div>
      <v-spacer />
      <v-btn class="cta-btn nav-btn" rounded to="/voting">
        <v-icon left small>mdi-vote</v-icon>
        Vote Now
      </v-btn>
    </v-app-bar>

    <!-- HERO -->
    <section class="results-hero">
      <div class="hero-content">
        <span class="hero-pill">
          <v-icon small left color="gold">mdi-trophy</v-icon>
          AMAC Awards Season 2
        </span>
        <h1 class="hero-title">Live Voting Results</h1>
        <p class="hero-subtitle">
          Real-time rankings across all categories. Updated every minute.
        </p>
      </div>
    </section>

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

      <!-- Connection Status -->
      <v-slide-y-transition>
        <v-alert
          v-if="!isOnline"
          type="warning"
          dense
          text
          class="mb-4 connection-alert"
          icon="mdi-wifi-off"
        >
          You are offline. Results may not be current. Check your connection.
        </v-alert>
      </v-slide-y-transition>

      <!-- SUMMARY STRIP -->
      <v-row class="summary-row mb-5">
        <v-col cols="6" md="3">
          <v-card class="summary-card" :class="{ 'pulse-live': isLive }">
            <div class="summary-icon">
              <v-icon color="gold">mdi-view-grid</v-icon>
            </div>
            <span>Categories</span>
            <h2>{{ categoryCount }}</h2>
          </v-card>
        </v-col>

        <v-col cols="6" md="3">
          <v-card class="summary-card">
            <div class="summary-icon">
              <v-icon color="gold">mdi-account-group</v-icon>
            </div>
            <span>Nominees</span>
            <h2>{{ totalNominees }}</h2>
          </v-card>
        </v-col>

        <v-col cols="6" md="3">
          <v-card class="summary-card">
            <div class="summary-icon">
              <v-icon color="gold">mdi-trophy</v-icon>
            </div>
            <span>Leaders</span>
            <h2>{{ leaderCount }}</h2>
          </v-card>
        </v-col>

        <v-col cols="6" md="3">
          <v-card class="summary-card">
            <div class="summary-icon">
              <v-icon color="gold">mdi-clock-outline</v-icon>
            </div>
            <span>Last Updated</span>
            <h2 class="small-time">{{ timeAgo }}</h2>
            <div class="live-indicator">
              <span class="pulse-dot" :class="{ paused: !autoRefresh }"></span>
              {{ isLive ? 'Live' : 'Paused' }}
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- LEADER + FILTER -->
      <v-row class="mb-6">
        <!-- LEADER SPOTLIGHT -->
        <v-col cols="12" md="7">
          <v-card class="leader-card pa-5" v-if="topLeader">
            <div class="leader-glow" />
            <div class="leader-top">
              <div>
                <span class="section-kicker">
                  <v-icon x-small left color="gold">mdi-crown</v-icon>
                  Currently Leading Across All Categories
                </span>
                <h2 class="leader-name">{{ topLeader.nominee_name || topLeader.name }}</h2>
                <p class="leader-meta">
                  <v-icon x-small left>mdi-trophy</v-icon>
                  {{ topLeader.category_name }}
                </p>
              </div>
              <div class="leader-medal">
                <v-icon size="32" color="black">mdi-crown</v-icon>
              </div>
            </div>
            <div class="leader-progress">
              <div class="d-flex justify-space-between align-center mb-2">
                <span>Vote Share in Category</span>
                <strong class="gold--text">{{ formatPercent(topLeader.percentage) }}%</strong>
              </div>
              <v-progress-linear
                :value="Number(topLeader.percentage || 0)"
                height="18"
                rounded
                color="amber"
                background-color="rgba(255,255,255,0.08)"
              >
                <template #default="{ value }">
                  <span class="progress-label">{{ Math.ceil(value) }}%</span>
                </template>
              </v-progress-linear>
            </div>
          </v-card>

          <v-card class="leader-card pa-5 empty-leader" v-else-if="!loadingResults">
            <div class="text-center py-4">
              <v-icon size="48" color="rgba(255,215,0,0.3)" class="mb-3">mdi-poll-box-outline</v-icon>
              <h2 class="glow-text">Waiting for First Vote</h2>
              <p class="leader-meta mt-2">
                No votes have been cast yet. Be the first to vote and see the leaderboard update in real-time!
              </p>
              <v-btn class="cta-btn mt-4" rounded to="/voting">
                <v-icon left>mdi-vote</v-icon>
                Cast First Vote
              </v-btn>
            </div>
          </v-card>

          <v-skeleton-loader v-else type="card" class="leader-skeleton" />
        </v-col>

        <!-- FILTER PANEL -->
        <v-col cols="12" md="5">
          <v-card class="filter-card pa-5">
            <div class="filter-header">
              <div>
                <span class="section-kicker">Filter & Search</span>
                <h3>Category Results</h3>
              </div>
              <v-btn icon class="refresh-btn" :loading="loadingResults" :disabled="loadingResults" @click="manualRefresh">
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
              prepend-inner-icon="mdi-filter"
              :loading="loadingCategories"
              @change="handleCategoryFilter"
            />

            <div class="filter-actions d-flex justify-space-between align-center mt-3">
              <v-btn small text color="amber" @click="showAllResults" :disabled="!searchCatResult">
                <v-icon left x-small>mdi-view-grid</v-icon>
                Show All
              </v-btn>
              <v-btn small text color="grey" @click="toggleAutoRefresh" :disabled="!isOnline">
                <v-icon left x-small>{{ autoRefresh ? 'mdi-pause' : 'mdi-play' }}</v-icon>
                {{ autoRefresh ? 'Pause' : 'Resume' }}
              </v-btn>
            </div>

            <div class="live-chip">
              <span class="pulse-dot" :class="{ paused: !autoRefresh }"></span>
              <span v-if="autoRefresh">
                Auto-refreshing every {{ refreshedEverySeconds }}s
                <span class="next-refresh">• Next in {{ nextRefresh }}s</span>
              </span>
              <span v-else>Auto-refresh paused. Click refresh to update.</span>
            </div>

            <v-expand-transition>
              <div v-if="lastRefreshStatus" class="refresh-status mt-3">
                <v-icon x-small left :color="lastRefreshStatus.color">{{ lastRefreshStatus.icon }}</v-icon>
                <span :class="lastRefreshStatus.color + '--text'">{{ lastRefreshStatus.text }}</span>
              </div>
            </v-expand-transition>
          </v-card>
        </v-col>
      </v-row>

      <!-- LOADING STATE -->
      <div v-if="loadingResults && !safeResults.length">
        <div class="category-block" v-for="n in 2" :key="n">
          <v-skeleton-loader type="heading" class="mb-3" />
          <v-row>
            <v-col cols="12" md="6" v-for="m in 2" :key="m">
              <v-skeleton-loader type="card" />
            </v-col>
          </v-row>
        </div>
      </div>

      <!-- CATEGORY FILTER ACTIVE — No Results -->
      <v-card v-else-if="searchCatResult && !safeResults.length && !loadingResults" class="empty-state pa-6 text-center">
        <v-icon size="48" color="rgba(255,215,0,0.3)" class="mb-3">mdi-filter-off</v-icon>
        <h2 class="glow-text">No Results for This Category</h2>
        <p class="mt-2">No nominees or votes found in the selected category yet.</p>
        <v-btn class="cta-btn mt-4" text color="amber" @click="showAllResults">
          <v-icon left>mdi-view-grid</v-icon>
          Show All Categories
        </v-btn>
      </v-card>

      <!-- RESULTS -->
      <div v-else-if="safeResults.length">
        <v-slide-y-transition group>
          <div
            v-for="cat in safeResults"
            :key="cat.category_id || cat.id"
            class="category-block"
          >
            <div class="category-header">
              <div>
                <span class="section-kicker">Category</span>
                <h2 class="category-title">{{ cat.category_name || cat.name }}</h2>
                <p class="category-meta">
                  <v-icon x-small left>mdi-account-group</v-icon>
                  {{ getNominees(cat).length }} nominees
                  <span v-if="cat.leader_name" class="ml-2">
                    <v-icon x-small left color="gold">mdi-crown</v-icon>
                    Leader: <strong class="gold--text">{{ cat.leader_name }}</strong>
                  </span>
                </p>
              </div>
            </div>

            <v-row>
              <v-col
                cols="12"
                md="6"
                v-for="(nom, idx) in getNominees(cat)"
                :key="nom.nominee_id || nom.id"
              >
                <v-card
                  class="nominee-card fade-card"
                  :class="{ leader: nom.is_leader, 'top-three': idx < 3 }"
                >
                  <div class="rank-ribbon" v-if="idx < 3">
                    <v-icon small color="black">mdi-medal</v-icon>
                    {{ idx + 1 }}
                  </div>

                  <div class="nominee-top">
                    <div class="flex-grow-1">
                      <div class="d-flex align-center gap-2 mb-1">
                        <div class="rank-chip" :class="{ 'rank-gold': idx === 0, 'rank-silver': idx === 1, 'rank-bronze': idx === 2 }">
                          #{{ nom.rank || idx + 1 }}
                        </div>
                        <v-icon v-if="nom.is_leader" x-small color="gold">mdi-crown</v-icon>
                      </div>
                      <h3>{{ nom.nominee_name || nom.name }}</h3>
                      <small>
                        <v-icon x-small left>mdi-map-marker</v-icon>
                        {{ nom.location || nom.county || "Location not set" }}
                        <span v-if="nom.church"> • {{ nom.church }}</span>
                      </small>
                    </div>
                    <div class="percent-block text-right">
                      <div class="percent-big">{{ formatPercent(nom.percentage) }}%</div>
                      <div class="percent-label">vote share</div>
                    </div>
                  </div>

                  <div class="percentage-row">
                    <span class="caption grey--text">Rank #{{ nom.rank || idx + 1 }}</span>
                    <strong class="gold--text">{{ formatPercent(nom.percentage) }}%</strong>
                  </div>

                  <v-progress-linear
                    :value="animatedValues[nom.nominee_id || nom.id] || 0"
                    height="14"
                    rounded
                    background-color="rgba(255,255,255,0.06)"
                    :color="idx === 0 ? 'amber' : idx === 1 ? 'grey lighten-1' : idx === 2 ? '#cd7f32' : 'rgba(255,255,255,0.3)'"
                  >
                    <template #default="{ value }">
                      <span class="progress-label-small">{{ Math.ceil(value) }}%</span>
                    </template>
                  </v-progress-linear>
                </v-card>
              </v-col>
            </v-row>
          </div>
        </v-slide-y-transition>
      </div>

      <!-- EMPTY STATE -->
      <v-card v-else class="empty-state pa-6 text-center">
        <v-icon size="64" color="rgba(255,215,0,0.2)" class="mb-3">mdi-poll-box-outline</v-icon>
        <h2 class="glow-text">No Results Yet</h2>
        <p class="mt-2">No categories or nominees have been loaded. This could be a connection issue.</p>
        <div class="d-flex justify-center gap-2 mt-4">
          <v-btn class="cta-btn" rounded @click="RefreshData">
            <v-icon left>mdi-refresh</v-icon>
            Try Again
          </v-btn>
          <v-btn text color="amber" rounded to="/nominate">
            <v-icon left>mdi-plus</v-icon>
            Nominate First
          </v-btn>
        </div>
      </v-card>
    </v-container>

    <!-- TOAST for refresh -->
    <v-snackbar v-model="refreshToast.show" :color="refreshToast.color" bottom timeout="3000">
      <v-icon left small>{{ refreshToast.icon }}</v-icon>
      {{ refreshToast.message }}
    </v-snackbar>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  name: "ResultsLeaderboard",
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
      countdownInterval: null,
      loadingResults: false,
      loadingCategories: false,
      categoryCount: 0,
      totalNominees: 0,
      leaderCount: 0,
      refreshedEverySeconds: 60,
      lastFetchedAt: null,
      autoRefresh: true,
      nextRefresh: 60,
      isOnline: navigator.onLine,
      isLive: false,
      lastRefreshStatus: null,
      globalStatus: { show: false, type: "info", icon: "", title: "", message: "" },
      refreshToast: { show: false, message: "", color: "success", icon: "mdi-check" },
    };
  },

  computed: {
    safeResults() {
      if (Array.isArray(this.Results)) {
        return this.Results.map((cat) => ({
          ...cat,
          nominees: Array.isArray(cat.nominees) ? cat.nominees : [],
        }));
      }
      return [];
    },
    timeAgo() {
      if (!this.lastFetchedAt) return "Never";
      const diff = Math.floor((Date.now() - new Date(this.lastFetchedAt).getTime()) / 1000);
      if (diff < 5) return "Just now";
      if (diff < 60) return `${diff}s ago`;
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      return `${Math.floor(diff / 3600)}h ago`;
    },
  },

  async mounted() {
    window.addEventListener("online", () => (this.isOnline = true));
    window.addEventListener("offline", () => (this.isOnline = false));
    await this.fetchEverythingOnOpen();
    this.startAutoRefresh();
  },

  beforeDestroy() {
    this.clearAllIntervals();
    window.removeEventListener("online", () => {});
    window.removeEventListener("offline", () => {});
  },

  methods: {
    showGlobal(type, title, message) {
      this.globalStatus = { show: true, type, icon: type === "error" ? "mdi-alert" : "mdi-information", title, message };
      setTimeout(() => (this.globalStatus.show = false), 6000);
    },

    showToast(message, color = "success", icon = "mdi-check") {
      this.refreshToast = { show: true, message, color, icon };
    },

    startAutoRefresh() {
      this.clearAllIntervals();
      if (!this.autoRefresh) return;
      this.nextRefresh = this.refreshedEverySeconds;
      this.countdownInterval = setInterval(() => {
        if (this.nextRefresh > 0) this.nextRefresh--;
      }, 1000);
      this.refreshInterval = setInterval(() => {
        if (this.isOnline) {
          this.RefreshData(true);
          this.nextRefresh = this.refreshedEverySeconds;
        }
      }, this.refreshedEverySeconds * 1000);
    },

    clearAllIntervals() {
      if (this.refreshInterval) { clearInterval(this.refreshInterval); this.refreshInterval = null; }
      if (this.countdownInterval) { clearInterval(this.countdownInterval); this.countdownInterval = null; }
    },

    toggleAutoRefresh() {
      this.autoRefresh = !this.autoRefresh;
      if (this.autoRefresh) {
        this.startAutoRefresh();
        this.showToast("Auto-refresh resumed", "success", "mdi-play");
      } else {
        this.clearAllIntervals();
        this.showToast("Auto-refresh paused", "info", "mdi-pause");
      }
    },

    async manualRefresh() {
      if (this.loadingResults) return;
      await this.RefreshData(false);
      this.nextRefresh = this.refreshedEverySeconds;
    },

    async fetchEverythingOnOpen() {
      this.loadingCategories = true;
      await this.fetchCategories();
      this.loadingCategories = false;
      await this.fetchOverview();
      this.showAllResults();
    },

    normalizePayload(data) {
      const results = Array.isArray(data && data.results)
        ? data.results
        : Array.isArray(data) ? data : [];

      this.categoryCount = Number((data && data.category_count) || results.length || 0);
      this.refreshedEverySeconds = Number((data && data.refreshed_every_seconds) || 60);
      this.lastFetchedAt = (data && data.lastFetchedAt) || new Date().toISOString();

      let nominees = 0;
      let leaders = 0;
      const normalized = results.map((cat) => {
        const noms = Array.isArray(cat.nominees) ? cat.nominees : [];
        nominees += noms.length;
        if (noms.some(n => n.is_leader)) leaders++;
        return { ...cat, nominees: noms };
      });
      this.totalNominees = nominees;
      this.leaderCount = leaders;
      return normalized;
    },

    getNominees(cat) {
      return Array.isArray(cat.nominees) ? cat.nominees : [];
    },

    async fetchCategories() {
      try {
        const { data } = await axios.get("https://amacserver-production-8cab.up.railway.app/api/categories/getAll");
        this.categories = Array.isArray(data) ? data : [];
      } catch (error) {
        console.error("fetchCategories error:", error);
        this.categories = [];
        this.showGlobal("error", "Connection Error", "Failed to load categories. Some filters may not work.");
      }
    },

    async fetchOverview(silent = false) {
      if (!silent) this.loadingResults = true;
      try {
        const { data } = await axios.get("https://amacserver-production-8cab.up.railway.app/api/votes/overview");
        const results = this.normalizePayload(data);
        this.allResults = results;
        this.Results = results;
        this.setTopLeader();
        this.animateBars();
        this.isLive = true;
        setTimeout(() => (this.isLive = false), 2000);
        this.lastRefreshStatus = { text: `Updated ${this.timeAgo}`, color: "green", icon: "mdi-check-circle" };
        if (silent) this.showToast("Results updated", "success", "mdi-refresh");
      } catch (error) {
        console.error("fetchOverview error:", error);
        this.lastRefreshStatus = { text: "Update failed", color: "red", icon: "mdi-alert-circle" };
        if (!silent) {
          this.showGlobal("error", "Failed to Load", "Could not fetch results. Please check your connection and try again.");
        } else {
          this.showToast("Update failed — using cached data", "error", "mdi-alert");
        }
      } finally {
        this.loadingResults = false;
      }
    },

    async fetchOverviewByCategory() {
      if (!this.searchCatResult) { this.showAllResults(); return; }
      this.loadingResults = true;
      try {
        const { data } = await axios.get(
          `https://amacserver-production-8cab.up.railway.app/api/votes/overview/${this.searchCatResult}`
        );
        const results = this.normalizePayload(data);
        this.Results = results;
        this.setTopLeader();
        this.animateBars();
        this.lastRefreshStatus = { text: "Category filtered", color: "amber", icon: "mdi-filter" };
      } catch (error) {
        console.error("fetchOverviewByCategory error:", error);
        this.Results = [];
        this.topLeader = null;
        this.showGlobal("error", "Filter Error", "Could not load results for this category.");
      } finally {
        this.loadingResults = false;
      }
    },

    handleCategoryFilter() {
      if (this.searchCatResult) { this.fetchOverviewByCategory(); }
      else { this.showAllResults(); }
    },

    RefreshData(silent = false) {
      if (this.searchCatResult) { this.fetchOverviewByCategory(); }
      else { this.fetchOverview(silent); }
    },

    showAllResults() {
      this.searchCatResult = null;
      this.Results = this.allResults;
      this.setTopLeader();
      this.animateBars();
      this.lastRefreshStatus = { text: "Showing all categories", color: "blue", icon: "mdi-view-grid" };
    },

    setTopLeader() {
      let maxPercent = -1;
      let leader = null;
      this.safeResults.forEach((cat) => {
        this.getNominees(cat).forEach((nom) => {
          const pct = Number(nom.percentage || 0);
          if (pct > maxPercent) {
            maxPercent = pct;
            leader = { ...nom, category_name: cat.category_name || cat.name };
          }
        });
      });
      this.topLeader = leader && maxPercent > 0 ? leader : null;
    },

    animateBars() {
      this.safeResults.forEach((cat) => {
        this.getNominees(cat).forEach((nom) => {
          const key = nom.nominee_id || nom.id;
          this.$set(this.animatedValues, key, 0);
          setTimeout(() => {
            this.$set(this.animatedValues, key, Number(nom.percentage || 0));
          }, 180);
        });
      });
    },

    formatPercent(value) {
      const num = Number(value || 0);
      return num.toFixed(num % 1 === 0 ? 0 : 1);
    },
  },
};
</script>

<style scoped>
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
.results-hero {
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
.hero-content { max-width: 760px; }
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
.connection-alert {
  border-radius: 12px !important;
  background: rgba(255, 183, 77, 0.08) !important;
}

/* SUMMARY */
.summary-card {
  background: rgba(17, 17, 17, 0.95) !important;
  border: 1px solid rgba(255, 215, 0, 0.14);
  border-radius: 20px !important;
  padding: 20px;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.42);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}
.summary-card:hover {
  border-color: rgba(255, 215, 0, 0.3);
  transform: translateY(-2px);
}
.summary-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(255, 215, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}
.summary-card span {
  opacity: 0.55;
  font-size: 0.78rem;
  display: block;
}
.summary-card h2 {
  color: gold;
  font-weight: 900;
  margin-top: 6px;
  margin-bottom: 0;
  font-size: 1.6rem;
}
.small-time { font-size: 1.1rem; }
.pulse-live {
  animation: borderPulse 2s ease-in-out infinite;
}
@keyframes borderPulse {
  0%, 100% { border-color: rgba(255, 215, 0, 0.14); box-shadow: 0 18px 45px rgba(0,0,0,0.42); }
  50% { border-color: rgba(255, 215, 0, 0.5); box-shadow: 0 18px 45px rgba(255,215,0,0.08); }
}
.live-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  font-size: 0.72rem;
  color: #76ff7a;
}
.pulse-dot {
  width: 8px;
  height: 8px;
  background: #76ff7a;
  border-radius: 50%;
  box-shadow: 0 0 10px #76ff7a;
  animation: pulseDot 1.3s infinite;
}
.pulse-dot.paused {
  background: #888;
  box-shadow: none;
  animation: none;
}
@keyframes pulseDot {
  0% { opacity: 0.4; transform: scale(0.85); }
  50% { opacity: 1; transform: scale(1.1); }
  100% { opacity: 0.4; transform: scale(0.85); }
}

/* CARDS */
.leader-card, .filter-card, .nominee-card, .empty-state {
  background: rgba(17, 17, 17, 0.95) !important;
  border: 1px solid rgba(255, 215, 0, 0.12);
  border-radius: 20px !important;
  backdrop-filter: blur(14px);
  box-shadow: 0 22px 55px rgba(0, 0, 0, 0.48);
}
.leader-skeleton { border-radius: 20px !important; }

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
  min-height: 200px;
}
.leader-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top right, rgba(255, 215, 0, 0.18), transparent 50%);
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
  font-size: clamp(1.6rem, 4vw, 2.4rem);
  font-weight: 900;
  margin-bottom: 6px;
  text-shadow: 0 0 18px rgba(255, 215, 0, 0.35);
}
.leader-meta {
  opacity: 0.7;
  margin-bottom: 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
}
.leader-medal {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, gold, #ffcc00);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.35);
  position: relative;
  z-index: 2;
}
.leader-progress {
  position: relative;
  z-index: 2;
  margin-top: 28px;
}
.leader-progress span { opacity: 0.7; }
.progress-label {
  font-size: 0.7rem;
  font-weight: 900;
  color: black;
  text-shadow: none;
}
.empty-leader .glow-text { font-size: 1.6rem; }

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
.refresh-btn {
  background: rgba(255, 215, 0, 0.08);
  border: 1px solid rgba(255, 215, 0, 0.16);
}
.filter-actions { margin-top: 10px; }
.live-chip {
  margin-top: 16px;
  padding: 11px 14px;
  border-radius: 14px;
  background: rgba(255, 215, 0, 0.06);
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.82rem;
  display: flex;
  align-items: center;
  gap: 10px;
}
.next-refresh { opacity: 0.6; }
.refresh-status {
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
}

/* CATEGORY */
.category-block { margin-top: 40px; }
.category-header {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: flex-end;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
.category-title {
  color: gold;
  margin: 0;
  font-weight: 900;
  font-size: 1.4rem;
}
.category-meta {
  margin: 6px 0 0;
  opacity: 0.65;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
}

/* NOMINEE CARD */
.nominee-card {
  padding: 20px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}
.nominee-card::before {
  content: "";
  position: absolute;
  height: 3px;
  width: 40%;
  left: 20px;
  top: 0;
  background: linear-gradient(90deg, gold, transparent);
  opacity: 0.6;
}
.nominee-card:hover {
  transform: translateY(-5px);
  border-color: rgba(255, 215, 0, 0.4);
  box-shadow: 0 16px 42px rgba(255, 215, 0, 0.12);
}
.nominee-card.leader {
  border-color: rgba(255, 215, 0, 0.5);
  background: radial-gradient(circle at top right, rgba(255, 215, 0, 0.12), transparent 45%), rgba(17, 17, 17, 0.95) !important;
}
.nominee-card.top-three::before {
  width: 60%;
  opacity: 0.9;
}
.rank-ribbon {
  position: absolute;
  top: 0;
  right: 0;
  background: linear-gradient(135deg, gold, #ffcc00);
  color: black;
  font-weight: 900;
  font-size: 0.75rem;
  padding: 4px 10px;
  border-bottom-left-radius: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}
.nominee-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}
.nominee-top h3 {
  margin-bottom: 5px;
  font-size: 1.05rem;
  font-weight: 800;
}
.nominee-top small {
  display: block;
  opacity: 0.55;
  font-size: 0.8rem;
}
.rank-chip {
  display: inline-block;
  margin-bottom: 8px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 900;
  color: gold;
  background: rgba(255, 215, 0, 0.08);
  border: 1px solid rgba(255, 215, 0, 0.18);
}
.rank-gold { background: linear-gradient(135deg, gold, #ffcc00) !important; color: black !important; border-color: gold !important; }
.rank-silver { background: #c0c0c0 !important; color: black !important; border-color: #c0c0c0 !important; }
.rank-bronze { background: #cd7f32 !important; color: black !important; border-color: #cd7f32 !important; }

/* PERCENT BLOCK — replaces vote count */
.percent-block { min-width: 70px; }
.percent-big {
  color: gold;
  font-weight: 900;
  font-size: 1.6rem;
  line-height: 1;
}
.percent-label {
  font-size: 0.7rem;
  opacity: 0.5;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.percentage-row {
  margin: 14px 0 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.progress-label-small {
  font-size: 0.65rem;
  font-weight: 900;
  color: rgba(0,0,0,0.7);
}

/* EMPTY */
.empty-state {
  margin-top: 30px;
}
.empty-state p {
  opacity: 0.72;
  max-width: 400px;
  margin: 0 auto;
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
.gap-2 { gap: 8px; }

/* ANIMATION */
.fade-card {
  animation: fadeUp 0.65s ease;
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(22px); }
  to { opacity: 1; transform: translateY(0); }
}

/* MOBILE */
@media (max-width: 768px) {
  .nav-btn {
    padding-left: 12px !important;
    padding-right: 12px !important;
    font-size: 0.75rem !important;
  }
  .brand { font-size: 0.9rem; }
  .brand-sub { display: none; }
  .results-hero {
    min-height: 180px;
    padding: 84px 16px 28px;
  }
  .hero-title { font-size: 2rem; }
  .hero-subtitle { font-size: 0.88rem; }
  .main-container {
    margin-top: 20px;
    padding-left: 14px;
    padding-right: 14px;
    padding-bottom: 55px;
  }
  .summary-card {
    padding: 16px;
    border-radius: 16px !important;
  }
  .summary-card h2 { font-size: 1.3rem; }
  .small-time { font-size: 0.9rem !important; }
  .leader-card, .filter-card {
    padding: 18px !important;
    border-radius: 16px !important;
  }
  .leader-top { align-items: center; }
  .leader-name { font-size: 1.4rem; }
  .leader-medal {
    width: 48px;
    height: 48px;
  }
  .category-header {
    align-items: flex-start;
    flex-direction: column;
  }
  .nominee-card { padding: 17px; }
  .nominee-top { flex-direction: column; }
  .percent-block { text-align: left; margin-top: 8px; }
  .rank-ribbon { padding: 3px 8px; font-size: 0.7rem; }
}
@media (max-width: 420px) {
  .hero-title { font-size: 1.75rem; }
  .results-hero { min-height: 165px; }
}
</style>