<!-- Please remove this file from your project -->
<template>
<v-app style="background-color: black;">
    <div style="margin-top: 30px;">
        <v-row>
            <v-col cols="12" md="12" sm="12">
                <div class="container text-center" style="margin-top: 120px;">
                    <h1>Gallery</h1>
                    <p>The inaugural edition, themed the Elegant Edition, was held on November 24th, 2024, at KICC, attracting over 2,600 attendees.</p>
                </div>
            </v-col>
            <v-col cols="12" md="6" sm="12">
                <div class="">
                    <v-carousel height="500" width="100%" :continuous="true" :cycle="cycle" :show-arrows="false" hide-delimiter-background delimiter-icon="mdi-minus">

                        <v-carousel-item width="100%" v-for="(item,i) in items" :key="i" :src="item.src"></v-carousel-item>

                    </v-carousel>
                </div>
            </v-col>
            <v-col cols="12" md="6" sm="12">
                <div class="">
                    <v-carousel height="500" width="100%" :continuous="true" :cycle="cycle" :show-arrows="false" hide-delimiter-background delimiter-icon="mdi-minus">

                        <v-carousel-item width="100%" v-for="(item,i) in items2" :key="i" :src="item.src"></v-carousel-item>

                    </v-carousel>
                </div>
            </v-col>
        </v-row>

    </div>
</v-app>
</template>

<script>
import g1 from "@/assets/gallery/app-1.jpg";
import g3 from "@/assets/gallery/app-3.jpg";
import g4 from "@/assets/gallery/app-4.jpg";
import g5 from "@/assets/gallery/app-5.jpg";
import g6 from "@/assets/gallery/app-6.jpg";
import g7 from "@/assets/gallery/app-7.jpg";
import g8 from "@/assets/gallery/app-8.jpg";
import g9 from "@/assets/gallery/app-9.jpg";
import g10 from "@/assets/gallery/app-10.jpg";
import g11 from "@/assets/gallery/app-11.jpg";
import axios from "axios";
import numeral from "numeral";

export default {
    name: 'NuxtTutorial',
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
                    src: g1,
                },

                {
                    src: g3,
                },
                {
                    src: g4,
                }, {
                    src: g5,
                },
                {
                    src: g6,
                },

            ],
            items2: [{
                    src: g6,
                },
                {
                    src: g7,
                }, {
                    src: g8,
                },
                {
                    src: g9,
                },
                {
                    src: g10,
                }, {
                    src: g11,
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
