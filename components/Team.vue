<template>
  <div class="team-section" style="background: black;">

    <!-- HEADER -->
    <div class="text-center header">
      <h2 class="title">Our Dedicated Team</h2>
      <p class="subtitle">
        The people behind the vision and excellence
      </p>
    </div>

    <!-- GRID -->
    <v-container>
      <v-row justify="center">

        <v-col
          v-for="(member, i) in team"
          :key="i"
          cols="12"
          sm="6"
          md="3"
        >
          <div class="card">

            <!-- IMAGE -->
            <div class="image-box">
              <v-img :src="member.img" class="img" height="220" contain/>
            </div>

            <!-- INFO -->
            <div class="" style="background-color: black;">
              <h3 class="info_h3">{{ member.name }}</h3>
              <p class="info_p">{{ member.role }}</p>
            </div>

          </div>
        </v-col>

      </v-row>
    </v-container>

  </div>
</template>

<script>
import t1 from "@/assets/team/1.png";
import t2 from "@/assets/team/2.png";
import t3 from "@/assets/team/3.png";
import t4 from "@/assets/team/4.png";

export default {
  data() {
    return {
      team: [
        { name: "JOHN NYOGOT", role: "Director - Business Development", img: t1 },
        { name: "OMBATI ISAAC", role: "Director, Logistics & Operations", img: t3 },
        { name: "LILIAN KOECH MEMUSI", role: "Product Director, Partnerships", img: t2 },
        { name: "BENJAMIN ACHUTI", role: "Director - Resource Mobilization", img: t4 }
      ]
    };
  }
};
</script>

<style scoped>

/* PURE BLACK */
.team-section {
  background: #000;
  background-color: #000;
  padding: 0px 0px;
}

/* HEADER */
.header {
  margin-bottom: 50px;
}

.title {
  color: #d4af37;
  font-size: 1.8rem;
}

.subtitle {
  color: rgba(255,255,255,0.6);
  font-size: 0.9rem;
}

/* CARD */
.card {
  background: #0a0a0a;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.05);
  transition: 0.3s;
}

/* HOVER */
.card:hover {
  transform: translateY(-6px);
  border-color: #d4af37;
}

/* IMAGE FIX (IMPORTANT) */
.image-box {
  height: 220px;
  background: #000;
}

.img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* THIS FIXES YOUR ISSUE */
  object-position: center top; /* keeps faces visible */
}

/* INFO */
.info {
  
}

.info_h3 {
  color: #fff;
  font-size: 0.95rem;
  font-weight: bold;
  padding: 15px;
  text-align: center;
}

.info_p {
  color: rgba(255,255,255,0.6);
  font-size: 0.8rem;
  padding: 15px;
  text-align: center;
}

/* MOBILE */
@media (max-width: 960px) {
  .image-box {
    height: 180px;
  }
}

</style>