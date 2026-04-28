<template>
  <div class="gallery-wrapper">

    <!-- HEADER -->
    <div class="gallery-header text-center">
      <h1 class="title">Gallery</h1>
      <p class="subtitle">
        The Elegant Edition — November 24th, 2024 at KICC
      </p>
    </div>

    <!-- 3 COLUMN GRID -->
    <v-container fluid>
      <v-row>

        <!-- COLUMN 1 -->
        <v-col cols="12" md="4">
          <v-carousel
            height="500"
            cycle
            hide-delimiter-background
            :show-arrows="false"
            class="column-carousel"
          >
            <v-carousel-item v-for="(item,i) in items" :key="i">
              <div class="slide">
                <v-img :src="item.src" class="img" cover />
                <div class="overlay"></div>
              </div>
            </v-carousel-item>
          </v-carousel>
        </v-col>

        <!-- COLUMN 2 -->
        <v-col cols="12" md="4">
          <v-carousel
            height="500"
            cycle
            hide-delimiter-background
            :show-arrows="false"
            class="column-carousel"
          >
            <v-carousel-item v-for="(item,i) in items2" :key="i">
              <div class="slide">
                <v-img :src="item.src" class="img" cover />
                <div class="overlay"></div>
              </div>
            </v-carousel-item>
          </v-carousel>
        </v-col>

        <!-- COLUMN 3 -->
        <v-col cols="12" md="4">
          <v-carousel
            height="500"
            cycle
            hide-delimiter-background
            :show-arrows="false"
            class="column-carousel"
          >
            <v-carousel-item v-for="(item,i) in items3" :key="i">
              <div class="slide">
                <v-img :src="item.src" class="img" cover />
                <div class="overlay"></div>
              </div>
            </v-carousel-item>
          </v-carousel>
        </v-col>

      </v-row>
    </v-container>

  </div>
</template>

<script>
import g1 from "@/assets/gallery/app-1.jpg";
import g3 from "@/assets/gallery/app-3.jpg";
import g4 from "@/assets/gallery/app-4.png";
import g5 from "@/assets/gallery/app-5.jpg";
import g6 from "@/assets/gallery/app-6.jpg";
import g7 from "@/assets/gallery/app-7.jpg";
import g8 from "@/assets/gallery/app-8.jpg";
import g9 from "@/assets/gallery/app-9.jpg";
import g10 from "@/assets/gallery/app-10.jpg";
import g11 from "@/assets/gallery/app-11.jpg";

export default {
  data() {
    return {
      items: [{ src: g1 }, { src: g3 }, { src: g4 }, { src: g5 }],
      items2: [{ src: g6 }, { src: g7 }, { src: g8 }],
      items3: [{ src: g9 }, { src: g10 }, { src: g11 }]
    };
  }
};
</script>

<style scoped>

/* WRAPPER */
.gallery-wrapper {
  padding-top: 0px;
}

/* HEADER */
.gallery-header {
  margin-bottom: 40px;
}

.title {
  font-size: 2.3rem;
  color: gold;
}

.subtitle {
  opacity: 0.7;
}

/* CAROUSEL */
.column-carousel {
  border-radius: 12px;
  overflow: hidden;
}

/* SLIDE */
.slide {
  position: relative;
  height: 100%;
}

/* IMAGE */
.img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.05);
  transition: transform 5s ease;
}

/* ZOOM EFFECT */
.v-carousel-item--active .img {
  transform: scale(1.15);
}

/* OVERLAY */
.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to top,
    rgba(0,0,0,0.7),
    rgba(0,0,0,0.2),
    transparent
  );
}

/* MOBILE */
@media (max-width: 960px) {
  .column-carousel {
    height: 350px !important;
  }
}

</style>