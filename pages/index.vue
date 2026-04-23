<template>
  <v-app class="app-bg" style="background-color: black;">

    <!-- NAVBAR -->
    <v-app-bar app dark elevate-on-scroll class="glass-nav" height="60px">
      <v-app-bar-nav-icon
        v-if="showBurger"
        @click="drawer = !drawer"
      />

      <div class="d-flex align-center">
        <v-avatar size="32">
          <v-img :src="logo"></v-img>
        </v-avatar>
        <span class="ml-2 font-weight-bold glow-text">Amac</span>
      </div>

      <v-spacer></v-spacer>

      <div v-if="!showBurger" class="nav-links">
        <span @click="scrollToSection('home')">Home</span>
        <span @click="scrollToSection('about')">About</span>
        <span @click="scrollToSection('aim')">Aim</span>
        <span @click="scrollToSection('gallery')">Gallery</span>
        <span @click="scrollToSection('team')">Team</span>
        <span @click="scrollToSection('contact')">Contact</span>
      </div>

      <v-btn class="ml-4 cta-btn"  rounded to="/nomination">
        Nominate
      </v-btn>
    </v-app-bar>

    <!-- MOBILE -->
    <v-navigation-drawer v-model="drawer" app dark temporary color="#00000" class="glass-nav">
      <v-list>
        <v-list-item @click="goSection('home')">Home</v-list-item>
        <v-list-item @click="goSection('about')">About</v-list-item>
        <v-list-item @click="goSection('aim')">Aim</v-list-item>
        <v-list-item @click="goSection('gallery')">Gallery</v-list-item>
        <v-list-item @click="goSection('team')">Team</v-list-item>
        <v-list-item @click="goSection('contact')">Contact</v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- HERO -->
    <section id="home" class="hero-section fade-section">
      <div class="hero-overlay">
        <home />
      </div>
    </section>

    <!-- CONTENT -->
    <section id="about" class="section fade-section"><about /></section>
    <section id="aim" class="section dark fade-section" style="background-color: black;"><aim /></section>
    <section id="gallery" class="section fade-section"><gallery /></section>
    <section id="team" class="section dark fade-section" style="background-color: black;"><team /></section>

    <section id="contact" class="section fade-section">
      <partners />
      <contact />
    </section>

    <!-- DIALOG -->
    <v-dialog v-model="nomineeDialog" max-width="500">
      <v-card class="pa-4 cinematic-card">

        <div class="d-flex align-center mb-3">
          <h3 class="mb-0 glow-text">Nominate Someone</h3>
          <v-spacer />
          <v-btn icon @click="nomineeDialog = false">
            <v-icon color="red">mdi-close</v-icon>
          </v-btn>
        </div>

        <v-select v-model="selectedCategory" :items="categories"
          item-text="name" item-value="id" label="Category" outlined dense />

        <v-text-field v-model="nomineeName"
          label="Nominee Name" outlined dense />

        <v-autocomplete v-model="location"
          :items="counties" label="County" outlined dense />

        <v-text-field v-model="church"
          label="Church" outlined dense />

        <v-btn block class="mt-4 cta-btn" @click="submitNominee">
          Submit Nominee
        </v-btn>

      </v-card>
    </v-dialog>

  </v-app>
</template>

<script>
import axios from "axios";
import logo from "@/assets/logo.png";

import Home from "../components/Home.vue";
import Gallery from "../components/Gallery.vue";
import About from "../components/About.vue";
import Aim from "../components/Aim.vue";
import Team from "../components/Team.vue";
import Contact from "../components/Contact.vue";
import Partners from "../components/Partners.vue";

export default {
  components: {
    Contact,
    Team,
    Gallery,
    Aim,
    About,
    Home,
    Partners
  },

  data() {
    return {
      drawer: false,
      showBurger: false,
      nomineeDialog: false,
      logo,

      categories: [],
      nomineeName: "",
      selectedCategory: "",
      location: "",
      church: "",
      counties: []
    };
  },

  mounted() {
    this.onResize();
    this.fetchCategories();
    window.addEventListener("resize", this.onResize);
    this.initAnimations();
  },

  methods: {

    onResize() {
      this.showBurger = window.innerWidth < 950;
    },

    goSection(id) {
      this.drawer = false;
      this.scrollToSection(id);
    },

    async fetchCategories() {
      const { data } = await axios.get(
        "https://amacserver-production-48fd.up.railway.app/api/categories/getAll"
      );
      this.categories = data;
    },

    async submitNominee() {
      await axios.post(
        "https://amacserver-production-48fd.up.railway.app/api/nominee/addNominee",
        {
          name: this.nomineeName,
          category_id: this.selectedCategory,
          location: this.location,
          church: this.church,
        }
      );

      this.nomineeDialog = false;
      this.nomineeName = "";
      this.selectedCategory = "";
      this.location = "";
      this.church = "";
    },

    scrollToSection(id) {
      const el = document.getElementById(id);
      if (!el) return;

      window.scrollTo({
        top: el.offsetTop - 60,
        behavior: "smooth"
      });
    },

    initAnimations() {
      const sections = document.querySelectorAll(".fade-section");

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
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
  background: #000000;
  color: #e5e5e5;
}

/* NAVBAR */
.glass-nav {
  backdrop-filter: blur(14px);
  background: rgba(0,0,0,0.85) !important;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

/* HERO */
.hero-section {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.hero-overlay {
  width: 100%;
  text-align: center;
  animation: heroFade 1.5s ease;
}

/* CINEMATIC FADE */
.fade-section {
  opacity: 0;
  transform: translateY(60px) scale(0.98);
  transition: all 1s ease;
}

.fade-section.visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* SECTION */
.section {
  padding: 100px 20px;
}

.section.dark {
  background: #0f0f0f;
}

/* NAV */
.nav-links span {
  margin: 0 14px;
  cursor: pointer;
  transition: 0.3s;
}

.nav-links span:hover {
  color: gold;
  text-shadow: 0 0 10px rgba(255,215,0,0.7);
}

/* CTA */
.cta-btn {
  background: linear-gradient(135deg, gold, #ffcc00) !important;
  color: black !important;
  font-weight: bold;
  box-shadow: 0 0 15px rgba(255,215,0,0.4);
}

/* GLOW TEXT */
.glow-text {
  color: gold;
  text-shadow: 0 0 12px rgba(255,215,0,0.6);
}

/* CARD */
.cinematic-card {
  background: #0f0f0f !important;
  border: 1px solid rgba(255,255,255,0.05);
}

/* HERO ANIMATION */
@keyframes heroFade {
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