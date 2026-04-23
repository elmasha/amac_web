
<template>
<div>
    <div class="container text-center" style="margin-top: 80px;">
        <h1>Previous sponsors</h1>
        <p></p>
    </div>

    <v-row>
        <v-col cols="12" md="12" sm="12">

        </v-col>

        <v-col cols="12" md="4" sm="12">
            <div class="">
                <v-carousel height="300" width="100%" :continuous="true" :cycle="cycle" :show-arrows="false" hide-delimiter-background delimiter-icon="mdi-minus">

                    <v-carousel-item width="100%" v-for="(item,i) in items" :key="i">
                        <v-img :src="item.src" height="200" contain></v-img>
                    </v-carousel-item>

                </v-carousel>
            </div>
        </v-col>
        <v-col cols="12" md="4" sm="12">
            <div class="">
                <v-carousel height="300" width="100%" :continuous="true" :cycle="cycle" :show-arrows="false" hide-delimiter-background delimiter-icon="mdi-minus">

                    <v-carousel-item width="100%" v-for="(item,i) in items2" :key="i">
                        <v-img :src="item.src" height="200" contain></v-img>
                    </v-carousel-item>

                </v-carousel>
            </div>
        </v-col>
        <v-col cols="12" md="4" sm="12">
            <div class="">
                <v-carousel height="300" width="100%" :continuous="true" :cycle="cycle" :show-arrows="false" hide-delimiter-background delimiter-icon="mdi-minus">

                    <v-carousel-item width="100%" v-for="(item,i) in items3" :key="i">
                        <v-img :src="item.src" height="200" contain></v-img>
                    </v-carousel-item>

                </v-carousel>
            </div>
        </v-col>

    </v-row>

</div>
</template>

<script>
import g1 from "@/assets/clients/1.png";
import g3 from "@/assets/clients/2.png";
import g4 from "@/assets/clients/3.png";
import g5 from "@/assets/clients/5.png";
import g6 from "@/assets/clients/6.png";
import g7 from "@/assets/clients/7.png";
import g8 from "@/assets/clients/8.png";
import g9 from "@/assets/clients/9.png";
import g10 from "@/assets/clients/10.jpg";
import g11 from "@/assets/clients/11.jpg";
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
                

            ],items3: [
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
