<template>
<v-app style="margin-top: 80px;" >
    <div class="container text-center ">
        <v-row>
            <v-col cols="12" md="12" sm="12">
                <div class="container text-center" style="margin-top: 10px;">
                    <h1>Aims and Objectives</h1>
                    <br>
                    <br>
                </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" class="">
                <div class="container box">
                    <h3 style="color: #FFD700;">
                        Spiritual Upliftment
                    </h3>
                    <p>
                        We believe in using music as a powerful tool to enhance spiritual growth, creating an atmosphere where individuals can connect with God on a deeper level.
                    </p>
                </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" >
                <div class="container box">
                    <h3 style="color: #FFD700;">
                        Unity and Collaboration showcase
                    </h3>
                    <p>
                        We value the unity of the Seventh-day Adventist community and seek to foster collaboration among musicians, singers, and composers, promoting a sense of togetherness in worship. </p>
                </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" >
                <div class="container box">
                    <h3 style="color: #FFD700;">
                        No Competition, Only Celebration
                    </h3>
                    <p>
                        AMAC is committed to creating an environment where musical talents are celebrated, and there is no emphasis on competition. We believe in recognizing and appreciating the unique contributions of each individual or group. </p>
                </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" >
                <div class="container box">
                    <h3 style="color: #FFD700;">
                        Celebration of Diversity and Cultural Relevance.
                    </h3>
                    <p>
                        We celebrate the diverse musical talents within the Adventist community, acknowledging that each unique expression adds richness to our worship experience. We recognize and appreciate the cultural diversity within the Adventist community in Kenya, encouraging the incorporation of various musical styles and traditions that resonate with our members.
                    </p>
                </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" >
                <div class="container box">
                    <h3 style="color: #FFD700;">
                        Community Engagement
                    </h3>
                    <p>
                        The Amac Awards actively engage with the communities it aims to represent, seeking input and involvement from diverse individuals and organizations. This includes partnerships with community-based initiatives, advocacy groups, and platforms that promote inclusivity and uplift underrepresented artists
                    </p>
                    <br>
                    <br>
                </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" >
                <div class="container box">
                    <h3 style="color: #FFD700;">
                        Empowerment of all church ministries and departments.
                    </h3>
                    <p>
                        AMAC aims to provide a platform for SDA musicians to showcase their talents, encouraging their active participation in the musical ministry of the Seventh-day Adventist Church.
                    </p>
                    <br>
                    <br>
                </div>
            </v-col>
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
    border-radius: 12px;
}

.box1 {
    background-color: rgb(255 255 255 / 30%);
    backdrop-filter: blur(14px);
}
</style>
