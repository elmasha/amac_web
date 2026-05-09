<template>
  <div class="home-wrapper">

    <!-- COUNTDOWN (OUTSIDE CAROUSEL) -->
    <div class="countdown-bar">
      <countdown targetDate="2026-08-11" />
    </div>

    <!-- HERO -->
    <v-carousel
      height="100vh"
      :continuous="true"
      :cycle="cycle"
      :show-arrows="false"
      hide-delimiter-background
      delimiter-icon="mdi-minus"
    >
      <v-carousel-item
        v-for="(item, i) in items"
        :key="i"
        :src="item.src"
      >
        <div class="hero-overlay">

          <!-- LIGHT BEAM -->
          <div class="light-beam"></div>

          <v-container fill-height>
            <v-row align="center" justify="end">

              <!-- RIGHT CONTENT -->
              <v-col cols="12" md="6" class="text-right hero-content">

                <h1 class="hero-title">
                  {{ item.title }}
                </h1>

                <p class="hero-sub">
                  Celebrating Excellence in Gospel & Ministry
                </p>

                <v-btn class="cta-btn mt-6" large to="/voting" rounded>
                  Vote Now
                </v-btn>

              </v-col>

            </v-row>
          </v-container>

        </div>
      </v-carousel-item>
    </v-carousel>

  </div>
</template>

<script>
import h1 from "@/assets/h1.jpg";
import h2 from "@/assets/h2.jpg";
import h3 from "@/assets/h3.jpg";
import Countdown from "../components/Countdown2.vue";

export default {
  components: { Countdown },

  props: {
    showBurger: Boolean
  },

  data() {
    return {
      cycle: true,
      items: [
        { src: h1, title: "Welcome to AMAC Awards" },
        { src: h2, title: "Celebrating Gospel Excellence" },
        { src: h3, title: "Your Vote Matters" }
      ]
    };
  }
};
</script>

<style scoped>

/* WRAPPER */
.home-wrapper {
  position: relative;
}

/* COUNTDOWN BAR */
.countdown-bar {
  position: absolute;
  top: 70px;
  right: 40px;
  z-index: 10;
  background: rgba(0,0,0,0.6);
  padding: 10px 20px;
  border-radius: 30px;
  backdrop-filter: blur(10px);
  color: gold;
  font-weight: bold;
}

/* HERO OVERLAY */
.hero-overlay {
  width: 100%;
  height: 100%;
  position: relative;
  background: linear-gradient(
    to left,
    rgba(0,0,0,0.9),
    rgba(0,0,0,0.6),
    rgba(0,0,0,0.2),
    transparent
  );
}

/* LIGHT BEAM */
.light-beam {
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at top, rgba(255,215,0,0.25), transparent 70%);
  animation: pulse 4s infinite;
}

@keyframes pulse {
  0%,100% { opacity: 0.3; }
  50% { opacity: 0.6; }
}

/* HERO TEXT */
.hero-content {
  z-index: 2;
}

.hero-title {
  font-size: 3rem;
  font-weight: 900;
  color: gold;
  text-shadow: 0 0 20px rgba(255,215,0,0.5);
}

.hero-sub {
  margin-top: 10px;
  opacity: 0.7;
  font-size: 1.1rem;
}

/* CTA */
.cta-btn {
  background: linear-gradient(135deg, gold, #ffcc00) !important;
  color: black !important;
  font-weight: bold;
  box-shadow: 0 0 15px rgba(255,215,0,0.4);
}

/* REMOVE OLD TYPING EFFECT */
.typing-title {
  all: unset;
}

/* RESPONSIVE */
@media (max-width: 960px) {
  .hero-content {
    text-align: center !important;
  }

  .countdown-bar {
    right: 10px;
    top: 80px;
  }
}

</style>