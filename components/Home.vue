<!-- Please remove this file from your project -->
<template>
<div style="margin-top: 50px;">
<div class="d-flex">    
<countdown style="font-size: small;" targetDate="2026-08-11"></countdown>
</div>
    <v-carousel height="700" :continuous="true" :cycle="cycle" :show-arrows="false" hide-delimiter-background delimiter-icon="mdi-minus">
        <v-carousel-item v-for="(item,i) in items" :key="i" :src="item.src">
            <div class=" gradient-background">
                <v-row>

                    <v-col cols="12" md="6">
                        <div class="container text-start" style="margin-top: 300px;color:white;">
                            <h1 class="typing-title">
                                {{ item.title+"\n" }}
                            </h1>
                            <div class="d-flex" style="margin-top: 50px;">
                                <v-btn color="white" rounded>
                                    <p style="color: black; margin-top: 14px;">Nominate now</p>
                                </v-btn>

                            </div>
                        </div>
                    </v-col>

                    <v-col cols="12" md="6">

                    </v-col>
                </v-row>

            </div>
        </v-carousel-item>
    </v-carousel>

    
</div>
</template>

<script>
import h1 from "@/assets/h1.jpg";
import h2 from "@/assets/h2.jpg";
import h3 from "@/assets/h3.jpg";
import axios from "axios";
import numeral from "numeral";
import Countdown from "../components/Countdown2.vue";

export default {
    name: 'NuxtTutorial',
    components: {
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
                    title: "Wecolme to Amac   "
                },
                {
                    src: h2,
                    title: "Enjoy the experience"
                },
                {
                    src: h3,
                    title: ""
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
    background: linear-gradient(to right,
            #0c0b0393,
            #0000004d,
            #0000004d,
            #0000001f,
            transparent,
            transparent,
            transparent,
            transparent);
    background-size: 200% 100%;
    animation: gradient-animation 3s linear infinite;
    
}

.typing-title {
    overflow: hidden;
    white-space: nowrap;
    border-right: 3px solid currentColor;
    width: 0;
    animation:
        typing 3s steps(30, end) forwards,
        blink 0.8s step-end infinite;
    font-size: 2.4rem;
    color: white;
    font-weight: 1200;
}

/* Typing animation */
@keyframes typing {
    from {
        width: 0;
    }

    to {
        width: 100%;
    }
}

/* Cursor blink */
@keyframes blink {
    50% {
        border-color: transparent;
    }
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
