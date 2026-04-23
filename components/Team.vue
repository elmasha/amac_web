<template>
    <div class=" text-center ">

        <div class="container" style="margin-top: 0px;">
                    <h1 style="padding: 50px;" >Our Dedicated team</h1>

        </div>

        <div class="">
            <v-row class="text-center">
                <v-col cols="6" md="3" class="">
                    <v-card elevation="0" color="transparent">
                        <v-img :src="t1" contain max-height="200"></v-img>
                        <v-card-subtitle>
                            <b style="font-size: 1.1rem; font-weight: 700; color: white;">JOHN NYOGOT
                            </b>
                            <p>Director - Business Development
                               </p>
                        </v-card-subtitle>

                    </v-card>

                </v-col>
                <v-col cols="6" md="3" class="">
                    <v-card elevation="0" color="transparent">
                        <v-img :src="t3" contain max-height="200"></v-img>
                        <v-card-subtitle>
                            <b style="font-size: 1.1rem; font-weight: 700; color: white;">Ombati Isaac
                            </b>
                            <p>Director, Logistics and Operations</p>
                        </v-card-subtitle>

                    </v-card>

                </v-col>
                <v-col cols="6" md="3" class="">
                    <v-card elevation="0" color="transparent">
                        <v-img :src="t2" contain max-height="200"></v-img>
                        <v-card-subtitle>
                            <b style="font-size: 1.1rem; font-weight: 700; color: white;">Lilian Koech Memusi
                            </b>
                            <p>Product Director, Partnerships</p>
                        </v-card-subtitle>

                    </v-card>

                </v-col>
                <v-col cols="6" md="3" class="">
                    <v-card elevation="0" color="transparent">
                        <v-img :src="t4" contain max-height="200"></v-img>
                        <v-card-subtitle>
                            <b style="font-size: 1.1rem; font-weight: 700; color: white;">BENJAMIN ACHUTI</b>
                            <p>Director - Resource Mobilization</p>
                        </v-card-subtitle>

                    </v-card>

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

 
/* .parallax_about {
    background-image: url('~/assets/p_about.png');
    background-attachment: fixed;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
} */
</style>
