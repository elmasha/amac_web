<template>
    <div class="container text-center parallax_about">

        <h1 class="container" style="padding-top: 80px;">Our Dedicated team</h1>

        <div class="container">
            <v-row class="text-center">
                <v-col cols="6" md="3" class="">
                    <v-card elevation="0" color="transparent">
                        <v-img :src="t1" contain height="300"></v-img>
                        <v-card-subtitle>
                            <b style="font-size: 1.1rem; font-weight: 700; color: white;">Kevin Kamau Njeri
                            </b>
                            <p>Founder & Managing Director
                                <br>
                                Europe / Kenya</p>
                        </v-card-subtitle>

                    </v-card>

                </v-col>
                <v-col cols="6" md="3" class="">
                    <v-card elevation="0" color="transparent">
                        <v-img :src="t3" contain height="300"></v-img>
                        <v-card-subtitle>
                            <b style="font-size: 1.1rem; font-weight: 700; color: white;">Lucy Muchene Schumacher
                            </b>
                            <p>Director and Shareholder
                                <br>

                                Europe / Kenya</p>
                        </v-card-subtitle>

                    </v-card>

                </v-col>
                <v-col cols="6" md="3" class="">
                    <v-card elevation="0" color="transparent">
                        <v-img :src="t2" contain height="300"></v-img>
                        <v-card-subtitle>
                            <b style="font-size: 1.1rem; font-weight: 700; color: white;">Allan Mwema
                            </b>
                            <p>Chief Executive Officer (CEO) <br>

                                Nairobi, Kenya</p>
                        </v-card-subtitle>

                    </v-card>

                </v-col>
                <v-col cols="6" md="3" class="">
                    <v-card elevation="0" color="transparent">
                        <v-img :src="t4" contain height="300"></v-img>
                        <v-card-subtitle>
                            <b style="font-size: 1.1rem; font-weight: 700; color: white;">Stella
                                Wmabui</b>
                            <p>Head of Human Resources &
                                Training
                                <br>
                                Nairobi, Kenya</p>
                        </v-card-subtitle>

                    </v-card>

                </v-col>
                <v-col cols="6" md="12" class="">
                    <div class="container">
                        <h1 class="container" style="padding-top: 80px;">Sponsors</h1>
                    </div>
                </v-col>
            </v-row>
        </div>

    </div>

</template>

<script>
import t1 from "@/assets/team/1.png";
import t2 from "@/assets/team/2.png";
import t3 from "@/assets/team/3.png";
import t4 from "@/assets/team/4.png";

export default {
    name: 'EmptyLayout',
    layout: 'empty',
    props: {
        error: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            pageNotFound: '404 Not Found',
            otherError: 'An error occurred',
            t1,
            t2,
            t3,
            t4,
        }
    },
    // head() {
    //     const title =
    //         this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    //     return {
    //         title
    //     }
    // }
}
</script>

<style scoped>

   .parallax_about {
    background-image: url('~/assets/p3.svg');
    background-attachment: fixed;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    width:100%;
} 
/* .parallax_about {
    background-image: url('~/assets/p_about.png');
    background-attachment: fixed;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
} */
</style>
