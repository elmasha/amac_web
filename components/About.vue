<template>
 <v-app style="margin-top: 30px;" class="parallax_about">
    <div class="">
    <v-row>
        <v-col cols="12" md="12" sm="12">
            <div class="container text-center" style="margin-top: 120px;">
                <h1>What is Amac</h1>
            </div>
        </v-col>
        <v-col cols="12" md="3" sm="12"></v-col>

        <v-col cols="12" md="3" sm="12" >
            <div class="container ">
                <br>

                <p>The Adventist Music Annual Concert and Awards (AMAC) is a unique initiative aimed at cultivating a harmonious and spiritually uplifting atmosphere within the Seventh-day Adventist community.</p>

                <p>Our mission is to recognize, appreciate, and nurture the musical talents within the Seventh-day Adventist Church within the field.</p>

                <p>Through AMAC, we aim to create a platform that unites musicians, singers, and composers in the spirit of collaboration and shared worship, fostering an environment where their God-given gifts are acknowledged, celebrated, and utilized for the glory of the Lord.</p>
            </div>
        </v-col>
        <v-col cols="12" md="3" sm="12">
            <v-img :src="about" height="500" contain />
        </v-col>
        <v-col cols="12" md="3" sm="12"></v-col>
    </v-row>

</div>
 </v-app>   

</template>

<script>
import about from "@/assets/about.jpg";

export default {
    name: 'About',
    layout: 'empty',
    props: {
        error: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            about,
            pageNotFound: '404 Not Found',
            otherError: 'An error occurred'
        }
    },
    //   head () {
    //     const title =
    //       this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    //     return {
    //       title
    //     }
    //   }
}
</script>

<style scoped>

.parallax_about {
    background-image: url('~/assets/p1.svg');
    background-attachment: fixed;
    background-position: center;
    background-repeat: no-repeat;
    width:100%;
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

.float-container {
    position: relative;
    /* adjust as needed */
    justify-content: center;
    align-items: center;
}

.floating-image {
    height: auto;
    animation: float 4s ease-in-out infinite;
}

/* Smooth floating effect */
@keyframes float {
    0% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-15px);
    }

    100% {
        transform: translateY(0);
    }
}

.box {
    background-color: rgb(255 255 255 / 30%);
    backdrop-filter: blur(5px);
}

.box1 {
    background-color: rgb(255 255 255 / 30%);
    backdrop-filter: blur(14px);
}
</style>
