<!-- Please remove this file from your project -->
<template>
<v-app style="background-color: black;margin-top: 50px;" class="gradient-background" >
    <div class="gradient-background">
        <v-carousel height="800" :continuous="true" :cycle="cycle" :show-arrows="false" hide-delimiter-background delimiter-icon="mdi-minus" style=" background: linear-gradient(to right,
            #FFD700,
            transparent,
            transparent,
            transparent);" >
            <v-carousel-item v-for="(item,i) in items" :key="i" :src="item.src"></v-carousel-item>
        </v-carousel>
        <div>
            <countdown targetDate="2026-02-11"></countdown>
        </div>
    </div>
</v-app>
</template>

<script>
import h1 from "@/assets/h1.jpg";
import h2 from "@/assets/h2.jpg";
import h3 from "@/assets/h3.jpg";
import axios from "axios";
import numeral from "numeral";
import Countdown from "../components/Countdown.vue";

export default {
    name: 'NuxtTutorial',
    components:{
        Countdown
    },
    props: {
        showBurger: {
            type: Boolean,
            required: true,
        },
    },
    data() {
        return {
            cycle: true,
            products: [],
            numeral,
            items: [{
                    src: h1,
                },
                {
                    src: h2,
                },
                {
                    src: h3,
                },

            ],
            pageNotFound: '404 Not Found',
            otherError: 'An error occurred'
        }
    },
    methods: {
        sendData(val) {
            this.$emit("send-data", val);
        },

    },
    mounted() {
        /// this.Fetch_Products();
    }
}
</script>

<style scoped>
    .gradient-background {
    width: 100%;
    height: 100vh;
    /* You can adjust the height as needed */
    background: linear-gradient(to left,
            #FFD700,
            transparent,
            transparent,
            transparent);
    background-size: 200% 100%;
    animation: gradient-animation 3s linear infinite;
}
.box {
    background-color: rgb(255 255 255 / 30%);
    backdrop-filter: blur(5px);
}

.fade-section {
    opacity: 0;
    transform: translateY(40px);
    transition: all 0.8s ease;
    text-align: center;
    padding: 60px;
    background: #f4f4f4;
    margin: 10px;
    border-radius: 10px;
}

/* Active animation */
.fade-in {
    opacity: 1;
    transform: translateY(0);
}

.fade-demo {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
    padding: 40px;
}

/* Fade In from Top */
.fade-in-up {
    opacity: 0;
    transform: translateY(30px);
    animation: fadeInUp 1.5s ease forwards;
}

@keyframes fadeInUp {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Fade In from Bottom */
.fade-in-down {
    opacity: 0;
    transform: translateY(-30px);
    animation: fadeInDown 1.5s ease forwards;
}

@keyframes fadeInDown {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Fade In from Left */
.fade-in-left {
    opacity: 0;
    transform: translateX(-30px);
    animation: fadeInLeft 1.5s ease forwards;
}

@keyframes fadeInLeft {
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

/* Fade In from Right */
.fade-in-right {
    opacity: 0;
    transform: translateX(30px);
    animation: fadeInRight 1.5s ease forwards;
}

@keyframes fadeInRight {
    to {
        opacity: 1;
        transform: translateX(0);
    }
}
</style>
