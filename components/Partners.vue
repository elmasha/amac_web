<template>
  <div class="partners-section">

    <!-- HEADER -->
    <div class="text-center header">
      <h2 class="title">Our Sponsors</h2>
      <p class="subtitle">
        Trusted partners who made this event possible
      </p>
    </div>

    <!-- SCROLL WRAPPER -->
    <div class="scroll-container">

      <div class="scroll-track">

        <!-- LOOP 1 -->
        <div
          v-for="(logo, i) in logos"
          :key="'a'+i"
          class="logo-card"
        >
          <v-img :src="logo.src" contain class="logo"/>
        </div>

        <!-- LOOP 2 (for infinite effect) -->
        <div
          v-for="(logo, i) in logos"
          :key="'b'+i"
          class="logo-card"
        >
          <v-img :src="logo.src" contain class="logo"/>
        </div>

      </div>

    </div>

  </div>
</template>

<script>
import g1 from "@/assets/clients/1.png";
import g2 from "@/assets/clients/2.png";
import g3 from "@/assets/clients/3.png";
import g5 from "@/assets/clients/5.png";
import g6 from "@/assets/clients/6.png";
import g7 from "@/assets/clients/7.png";
import g8 from "@/assets/clients/8.png";

export default {
  data() {
    return {
      logos: [
        { src: g1 },
        { src: g2 },
        { src: g3 },
        { src: g5 },
        { src: g6 },
        { src: g7 },
        { src: g8 },
      ]
    };
  }
};
</script>

<style scoped>

/* SECTION */
.partners-section {
  background: #000;
  padding: 80px 0;
  overflow: hidden;
}

/* HEADER */
.header {
  margin-bottom: 40px;
}

.title {
  color: #d4af37;
  font-size: 1.8rem;
}

.subtitle {
  color: rgba(255,255,255,0.6);
}

/* SCROLL */
.scroll-container {
  overflow: hidden;
  width: 100%;
}

.scroll-track {
  display: flex;
  width: max-content;
  animation: scroll 25s linear infinite;
}

/* LOGO CARD */
.logo-card {
  width: 160px;
  height: 100px;
  margin: 0 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* LOGO */
.logo {
  max-width: 120px;
  filter: grayscale(100%) brightness(0.7);
  transition: 0.3s;
}

/* HOVER */
.logo-card:hover .logo {
  filter: grayscale(0%) brightness(1);
  transform: scale(1.1);
}

/* PAUSE ON HOVER */
.scroll-container:hover .scroll-track {
  animation-play-state: paused;
}

/* ANIMATION */
@keyframes scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

/* MOBILE */
@media (max-width: 960px) {
  .logo-card {
    width: 120px;
    margin: 0 10px;
  }
}

</style>