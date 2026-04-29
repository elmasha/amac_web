<template>
  <section class="about-section">

    <v-container>

      <v-row align="center">

        <!-- LEFT CONTENT -->
        <v-col cols="12" md="6">

          <div class="about-content">

            <h2 class="section-title">
              What is <span>AMAC</span>
            </h2>

            <div class="gold-line"></div>

            <p class="about-text">
              The Adventist Music Annual Concert and Awards (AMAC) is a unique initiative
              aimed at cultivating a harmonious and spiritually uplifting atmosphere within
              the Seventh-day Adventist community.
            </p>

            <p class="about-text">
              Our mission is to recognize, appreciate, and nurture musical talent within
              the church, creating a platform where gifts are celebrated and elevated.
            </p>

            <p class="about-text">
              Through AMAC, we unite musicians, singers, and composers in the spirit of
              worship, collaboration, and excellence — honoring God through music.
            </p>

            <!-- <v-btn class="cta-btn mt-6" rounded to="/vote">
              Explore Awards
            </v-btn> -->

          </div>

        </v-col>

        <!-- RIGHT IMAGE -->
        <v-col cols="12" md="6">

          <div class="image-wrapper">
            <v-img :src="about" class="about-img" />
            <div class="gold-border"></div>
          </div>

        </v-col>

      </v-row>

    </v-container>

  </section>
</template>

<script>
import about from "@/assets/about.jpg";

export default {
  data() {
    return {
      about
    };
  }
};
</script>

<style scoped>

/* SECTION */
.about-section {
  background: #000;
  padding: 120px 20px;
  color: #fff;
  position: relative;
}

/* TITLE */
.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #fff;
}

.section-title span {
  color: #d4af37;
}

/* GOLD LINE */
.gold-line {
  width: 60px;
  height: 3px;
  background: linear-gradient(to right, #d4af37, #ffcc00);
  margin: 20px 0;
}

/* TEXT */
.about-text {
  color: rgba(255,255,255,0.75);
  margin-bottom: 15px;
  line-height: 1.7;
}

/* BUTTON */
.cta-btn {
  background: linear-gradient(135deg, #d4af37, #ffcc00);
  color: #000;
  font-weight: bold;
  box-shadow: 0 0 20px rgba(212,175,55,0.3);
}

/* IMAGE */
.image-wrapper {
  position: relative;
  max-width: 500px;
  margin: auto;
}

.about-img {
  border-radius: 14px;
  position: relative;
  z-index: 2;
}

/* GOLD BORDER EFFECT */
.gold-border {
  position: absolute;
  top: -15px;
  left: -15px;
  width: 100%;
  height: 100%;
  border: 2px solid #d4af37;
  border-radius: 14px;
  z-index: 1;
  opacity: 0.6;
}

/* MOBILE */
@media (max-width: 960px) {
  .section-title {
    font-size: 2rem;
  }

  .image-wrapper {
    margin-top: 40px;
  }
}

</style>