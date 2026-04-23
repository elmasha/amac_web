<template>
  <v-app class="app-bg">

    <!-- NAV -->
    <v-app-bar app dark class="glass-nav">
      <div class="d-flex align-center">
        <v-avatar size="30">
          <v-img :src="logo"></v-img>
        </v-avatar>
        <span class="ml-2 glow-text title">Live Results</span>
      </div>

      <v-spacer></v-spacer>

      <v-btn class="cta-btn" rounded to="/voting">
        Vote Now
      </v-btn>
    </v-app-bar>

    <!-- HERO -->
    <div class="hero">
      <h1 class="glow-text big-title">🏆 Live Voting Results</h1>
      <p class="subtitle">Real-time leaderboard</p>
    </div>

    <v-container>

      <!-- LEADER SPOTLIGHT -->
      <div v-if="topLeader" class="leader-spotlight fade-in">
        <h3>🔥 Leading Candidate</h3>
        <h1 class="glow-text">{{ topLeader.nominee_name }}</h1>
        <p>{{ topLeader.category_name }}</p>

        <v-progress-linear
          :value="topLeader.percentage"
          height="20"
          rounded
          color="amber"
        >
          <strong>{{ topLeader.percentage }}%</strong>
        </v-progress-linear>
      </div>

      <!-- FILTER -->
      <v-row class="mb-4">
        <v-col cols="12" md="6">
          <v-select
            v-model="searchCatResult"
            :items="categories"
            item-text="name"
            item-value="id"
            label="Filter Category"
            outlined dense
            @change="fetchOverview33"
          />
        </v-col>

        <v-col cols="12" md="6" class="text-right">
          <v-btn icon @click="RefreshData">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <!-- RESULTS -->
      <div v-for="cat in Results" :key="cat.category_id" class="category-block">

        <h2 class="category-title">{{ cat.category_name }}</h2>

        <v-row>

          <v-col
            cols="12"
            md="6"
            v-for="nom in cat.nominees"
            :key="nom.nominee_id"
          >
            <v-card class="nominee-card fade-card">

              <div class="d-flex justify-space-between align-center">

                <div>
                  <h3>{{ nom.nominee_name }}</h3>
                  <small>{{ nom.location }} • {{ nom.church }}</small>
                </div>

                <div v-if="nom.is_leader" class="leader-badge">
                  🥇 Leader
                </div>

              </div>

              <v-progress-linear
                :value="animatedValues[nom.nominee_id] || 0"
                height="14"
                rounded
                background-color="#1a1a1a"
                color="amber"
                class="mt-3"
              >
                <strong>{{ nom.percentage }}%</strong>
              </v-progress-linear>

            </v-card>
          </v-col>

        </v-row>

      </div>

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
      searchCatResult: null,
      animatedValues: {},
      topLeader: null
    };
  },

  async mounted() {
    await this.fetchCategories();
    await this.fetchOverview();

    // auto refresh every 5s
    setInterval(() => {
      this.fetchOverview();
    }, 5000);
  },

  methods: {

    async fetchCategories() {
      const { data } = await axios.get(
        "https://amacserver-production-48fd.up.railway.app/api/categories/getAll"
      );
      this.categories = data;
    },

    async fetchOverview() {
      const { data } = await axios.get(
        "https://amacserver-production-48fd.up.railway.app/api/votes/overview"
      );

      this.Results = data;

      this.setTopLeader();
      this.animateBars();
    },

    async fetchOverview33() {
      const { data } = await axios.get(
        `https://amacserver-production-48fd.up.railway.app/api/votes/overview/${this.searchCatResult}`
      );

      this.Results = data;

      this.setTopLeader();
      this.animateBars();
    },

    RefreshData() {
      this.searchCatResult = null;
      this.fetchOverview();
    },

    setTopLeader() {
      let max = 0;
      let leader = null;

      this.Results.forEach(cat => {
        cat.nominees.forEach(nom => {
          if (nom.percentage > max) {
            max = nom.percentage;
            leader = { ...nom, category_name: cat.category_name };
          }
        });
      });

      this.topLeader = leader;
    },

    animateBars() {
      this.Results.forEach(cat => {
        cat.nominees.forEach(nom => {
          this.$set(this.animatedValues, nom.nominee_id, 0);

          setTimeout(() => {
            this.$set(this.animatedValues, nom.nominee_id, nom.percentage);
          }, 200);
        });
      });
    }

  }
};
</script>

<style>
.app-bg {
  background: radial-gradient(circle at top, #0a0a0a, #000);
  color: #e5e5e5;
}

/* NAV */
.glass-nav {
  background: rgba(0,0,0,0.6) !important;
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

/* HERO */
.hero {
  text-align: center;
  padding: 140px 20px 60px;
}

.big-title {
  font-size: 3rem;
  font-weight: 700;
}

.subtitle {
  opacity: 0.6;
}

/* LEADER */
.leader-spotlight {
  text-align: center;
  margin-bottom: 40px;
  padding: 30px;
  background: rgba(255,215,0,0.05);
  border-radius: 16px;
}

/* CATEGORY */
.category-title {
  color: gold;
  margin-bottom: 20px;
}

/* CARD */
.nominee-card {
  background: rgba(255,255,255,0.03);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s ease;
}

.nominee-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 40px rgba(255,215,0,0.15);
}

/* BADGE */
.leader-badge {
  background: gold;
  color: black;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
}

/* BUTTON */
.cta-btn {
  background: linear-gradient(135deg, gold, #ffcc00) !important;
  color: black !important;
  font-weight: bold;
}

/* GLOW */
.glow-text {
  color: gold;
  text-shadow: 0 0 15px rgba(255,215,0,0.6);
}

/* ANIMATIONS */
.fade-in {
  animation: fadeUp 1s ease;
}

.fade-card {
  animation: fadeUp 0.8s ease;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>