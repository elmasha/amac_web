<template>
<v-app style="background-color: black;">
    <div class="parallax_about">
        <div class="">
            <div class="text-center">
                <h1>
                    Contact Us
                </h1>
                <br>
                <br>
                <br>
            </div>
            <v-row>
                <v-col cols="12" md="12" class="fade-in-right">
                    <v-row>
                        <v-col cols="12" md="4" class="fade-in-right">
                            <v-card outlined>
                                <div class="container text-center">
                                    <v-icon color="primary">mdi-map-marker-outline</v-icon>
                                    <br>
                                    <h3>
                                        Address
                                    </h3>
                                    <h5>Twiga towers , Nairobi Kenya</h5>
                                </div>
                            </v-card>

                        </v-col>
                        <v-col cols="12" md="4" class="fade-in-right">
                            <v-card outlined>
                                <div class="container text-center">
                                    <v-icon color="primary">mdi-phone-outline</v-icon>
                                    <br>
                                    <h3>
                                        Call us
                                    </h3>
                                    <h5>+254 727 815 885</h5>
                                </div>
                            </v-card>

                        </v-col>
                        <v-col cols="12" md="4" class="fade-in-right">
                            <v-card outlined>
                                <div class="container text-center">
                                    <v-icon color="primary">mdi-email-multiple-outline</v-icon>
                                    <br>
                                    <h3>
                                        Email us
                                    </h3>
                                    <h5>info@amac.africa</h5>
                                </div>
                            </v-card>

                        </v-col>
                    </v-row>

                </v-col>
                <v-col cols="12" md="12" class="box">

                    <v-form v-model="valid" style="padding: 30px;">

                        <v-text-field outlined rounded v-model="firstname" :counter="10" placeholder="Full name" required></v-text-field>

                        <v-text-field outlined rounded v-model="email" placeholder="Email" required></v-text-field>

                        <v-textarea outlined rounded v-model="email" placeholder="Send a Message" required></v-textarea>

                        <v-btn large outlined color="primary" rounded width="50%">
                            Send us a Message
                            <v-icon right dark>
                                mdi-chat
                            </v-icon>
                        </v-btn>

                    </v-form>

                </v-col>
            </v-row>
        </div>
    </div>
</v-app>
</template>

<script>
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
            otherError: 'An error occurred'
        }
    },
    // head () {
    //   const title =
    //     this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    //   return {
    //     title
    //   }
    // }
}
</script>

<style scoped>
    .box {
    background-color: rgb(255 255 255 / 30%);
    backdrop-filter: blur(5px);
    border-radius: 12px;
}
 .parallax_about {
    background-image: url('~/assets/p2.svg');
    background-attachment: fixed;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    width:100%;
}
</style>
