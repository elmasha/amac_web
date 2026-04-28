<template>
  <footer class="footer">

    <v-container>
      <v-row>

        <!-- BRAND -->
        <v-col cols="12" md="4">
          <div class="footer-brand">
            <v-avatar size="40">
              <v-img :src="logo"></v-img>
            </v-avatar>

            <h3 class="mt-3 brand-text">AMAC Awards</h3>

            <p class="footer-desc">
              Celebrating talent, worship, and excellence in the Adventist music community.
            </p>
          </div>
        </v-col>

        <!-- QUICK LINKS -->
        <v-col cols="6" md="4">
          <h4 class="footer-title">Quick Links</h4>

          <div class="footer-links">
            <span @click="$router.push('/')">Home</span>
            <span @click="$router.push('/vote')">Vote</span>
            <span @click="$router.push('/nomination')">Nominate</span>
            <span @click="$router.push('/live-results')">Live Results</span>
          </div>
        </v-col>

        <!-- CONTACT / SOCIAL -->
        <v-col cols="6" md="4">
          <h4 class="footer-title">Connect</h4>

          <p class="footer-text">Nairobi, Kenya</p>
          <p class="footer-text">+254 727 815 885</p>
          <p class="footer-text">info@amac.africa</p>

          <div class="socials mt-3">
            <v-btn icon><v-icon>mdi-facebook</v-icon></v-btn>
            <v-btn icon><v-icon>mdi-instagram</v-icon></v-btn>
            <v-btn icon><v-icon>mdi-whatsapp</v-icon></v-btn>
          </div>
        </v-col>

      </v-row>

      <!-- BOTTOM -->
      <div class="footer-bottom text-center mt-6">
        © {{ new Date().getFullYear() }} AMAC Awards • All Rights Reserved
      </div>

    </v-container>

  </footer>
</template>

<script>
export default {
  props: {
    logo: String
  }
};
</script>

<style scoped>

/* BASE */
.footer {
  background: #000;
  padding: 60px 20px 30px;
  border-top: 1px solid rgba(255,255,255,0.05);
}

/* BRAND */
.brand-text {
  color: #d4af37;
  font-weight: 700;
}

.footer-desc {
  color: rgba(255,255,255,0.6);
  font-size: 0.9rem;
  margin-top: 10px;
}

/* TITLES */
.footer-title {
  color: #d4af37;
  margin-bottom: 12px;
  font-weight: 600;
}

/* LINKS */
.footer-links span {
  display: block;
  margin: 6px 0;
  cursor: pointer;
  color: rgba(255,255,255,0.6);
  transition: 0.3s;
}

.footer-links span:hover {
  color: #d4af37;
}

/* TEXT */
.footer-text {
  color: rgba(255,255,255,0.6);
  font-size: 0.9rem;
}

/* SOCIAL */
.socials v-btn {
  margin-right: 8px;
}

.socials .v-icon {
  color: #d4af37;
}

/* BOTTOM */
.footer-bottom {
  color: rgba(255,255,255,0.4);
  font-size: 0.8rem;
}

</style>