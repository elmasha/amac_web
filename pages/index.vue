<template>
  <v-app class="app-bg">

    <!-- NAVBAR -->
    <v-app-bar app dark elevate-on-scroll class="glass-nav">

      <v-app-bar-nav-icon
        v-if="showBurger"
        @click="drawer = !drawer"
      />

      <!-- BRAND -->
      <div class="d-flex align-center">
        <v-avatar size="34">
          <v-img :src="logo"></v-img>
        </v-avatar>
        <span class="brand ml-3">AMAC Awards</span>
      </div>

      <!-- SPONSORS -->
      <div v-if="!showBurger" class="sponsor-strip">
        <span class="sponsor-label">Sponsored by</span>

        <v-img src="@/assets/clients/1.png" class="sponsor-logo" />
        <v-img src="@/assets/clients/2.png" class="sponsor-logo" />
        <v-img src="@/assets/clients/3.png" class="sponsor-logo" />
      </div>

      <v-spacer />

      <!-- NAV LINKS -->
      <div v-if="!showBurger" class="nav-links">
        <span @click="scrollToSection('home')">Home</span>
        <span @click="scrollToSection('about')">About</span>
        <span @click="scrollToSection('gallery')">Gallery</span>
        <span @click="scrollToSection('team')">Team</span>
        <span @click="scrollToSection('contact')">Contact</span>
        <span @click="scrollToSection('partners')">Partners</span>

      </div>

      <!-- CTA -->
      <v-btn class="cta-btn ml-6" rounded to="/nomination">
        Nominate Now
      </v-btn>

    </v-app-bar>

    <!-- MOBILE -->
    <v-navigation-drawer v-model="drawer" app dark temporary class="glass-nav">
      <v-list>
        <v-list-item @click="goSection('home')">Home</v-list-item>
        <v-list-item @click="goSection('about')">About</v-list-item>
        <v-list-item @click="goSection('gallery')">Gallery</v-list-item>
        <v-list-item @click="goSection('team')">Team</v-list-item>
        <v-list-item @click="goSection('contact')">Contact</v-list-item>
        <v-list-item @click="goSection('partners')">Partners</v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- HERO -->
    <section id="home" class="hero-section fade-section">

      <div class="light-beam"></div>

      <div class="symbol-overlay">
        <img src="/symbol.png" />
      </div>

      <div class="hero-overlay">
        <home />
      </div>

    </section>

    <!-- ABOUT -->
    <section id="about" class="section fade-section">
      <about />
    </section>

    <!-- GALLERY -->
    <section id="gallery" class="section fade-section">
      <gallery />
    </section>

    <!-- TEAM -->
    <section id="team" class="section dark fade-section">
      <team />
    </section>

    <!-- PARTNERS -->
    <section id="partners" class="section fade-section">
      <partners />
    </section>

    <!-- CONTACT (FINAL SECTION) -->
    <section id="contact" class="section final-section fade-section">
      <contact />
    </section>

  </v-app>
</template>

<script>
import logo from "@/assets/logo.png";

import Home from "@/components/Home.vue";
import About from "@/components/About.vue";
import Gallery from "@/components/Gallery.vue";
import Team from "@/components/Team.vue";
import Contact from "@/components/Contact.vue";
import Partners from "@/components/Partners.vue";

export default {
  components: {
    Home,
    About,
    Gallery,
    Team,
    Contact,
    Partners
  },

  data() {
    return {
      drawer: false,
      showBurger: false,
      logo
    };
  },

  mounted() {
    this.onResize();
    window.addEventListener("resize", this.onResize);
    this.initAnimations();
  },

  methods: {

    onResize() {
      this.showBurger = window.innerWidth < 960;
    },

    goSection(id) {
      this.drawer = false;
      this.scrollToSection(id);
    },

    scrollToSection(id) {
      const el = document.getElementById(id);
      if (!el) return;

      window.scrollTo({
        top: el.offsetTop - 70,
        behavior: "smooth"
      });
    },

    initAnimations() {
      const sections = document.querySelectorAll(".fade-section");

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });

      sections.forEach(el => observer.observe(el));
    }

  }
};
</script>

<style>

/* BASE */
.app-bg {
  background: #000;
  color: #fff;
}

/* ANKARA SIDES */
.app-bg::before,
.app-bg::after {
  content: "";
  position: fixed;
  width: 60px;
  height: 100%;
  opacity: 0.05;
  background-image: url("https://www.transparenttextures.com/patterns/african-pattern.png");
}
.app-bg::before { left: 0; }
.app-bg::after { right: 0; }

/* NAVBAR */
.glass-nav {
  backdrop-filter: blur(16px);
  background: rgba(0,0,0,0.9) !important;
}

/* BRAND */
.brand {
  color: #d4af37;
  font-weight: bold;
}

/* NAV LINKS */
.nav-links span {
  margin: 0 14px;
  cursor: pointer;
  color: rgba(255,255,255,0.7);
}
.nav-links span:hover {
  color: #d4af37;
}

/* SPONSORS */
.sponsor-strip {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: 20px;
}
.sponsor-label {
  font-size: 0.7rem;
  color: rgba(255,255,255,0.4);
}
.sponsor-logo {
  width: 60px;
  height: 30px;
  object-fit: contain;
  filter: grayscale(100%);
  opacity: 0.6;
}

/* CTA */
.cta-btn {
  background: linear-gradient(135deg, gold, #ffcc00);
  color: black !important;
}

/* HERO */
.hero-section {
  height: 100vh;
  position: relative;
}
.light-beam {
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at top, rgba(255,215,0,0.2), transparent);
}
.symbol-overlay {
  position: absolute;
  top: 20%;
  width: 100%;
  text-align: center;
  opacity: 0.05;
}

/* SECTIONS */
.section {
  padding: 100px 20px;
}

/* FINAL SECTION (adds bottom spacing) */
.final-section {
  padding-bottom: 120px;
}

/* FADE */
.fade-section {
  opacity: 0;
  transform: translateY(60px);
  transition: 1s;
}
.fade-section.visible {
  opacity: 1;
  transform: translateY(0);
}

</style>