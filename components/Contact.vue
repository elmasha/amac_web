<template>
<div>
    <div class="container">
        <div class="text-center" style="margin-top: 40px;">
            <h1 style="padding: 50px;">
                Contact Us
            </h1>

        </div>
        <v-row>
            <v-col cols="12" md="12" class="fade-in-right">
                <v-row>
                    <v-col cols="12" md="4" class="fade-in-right">
                        <v-card outlined>
                            <div class="container text-center">
                                <v-icon color="primary">mdi-map-marker-outline</v-icon>
                                <br>
                                <h3 style="font-size: 1.2rem;">
                                    Address
                                </h3>
                                <h5 style="font-size: 1.2rem;">Twiga towers , Nairobi Kenya</h5>
                            </div>
                        </v-card>

                    </v-col>
                    <v-col cols="12" md="4" class="fade-in-right">
                        <v-card outlined>
                            <div class="container text-center">
                                <v-icon color="primary">mdi-phone-outline</v-icon>
                                <h3 style="font-size: 1.2rem;">
                                    Call us
                                </h3>
                                <h5 style="font-size: 1.2rem;">+254 727 815 885</h5>
                            </div>
                        </v-card>

                    </v-col>
                    <v-col cols="12" md="4" class="fade-in-right">
                        <v-card outlined>
                            <div class="container text-center">
                                <v-icon color="primary">mdi-email-multiple-outline</v-icon>
                                <h3 style="font-size: 1.2rem;">
                                    Email us
                                </h3>
                                <h5 style="font-size: 1.2rem;">info@amac.africa</h5>
                            </div>
                        </v-card>

                    </v-col>
                </v-row>

            </v-col>
            <v-col cols="12" md="6" class="box" v-show="false">

                <div class=" text-center">
                    <v-form v-model="valid">

                        <v-text-field outlined rounded v-model="firstname" :counter="10" placeholder="Full name" required></v-text-field>

                        <v-text-field outlined rounded v-model="email" placeholder="Email" required></v-text-field>

                        <v-text-field outlined rounded v-model="email" placeholder="Subject" required></v-text-field>

                        <v-textarea outlined rounded v-model="email" placeholder="Send a Message" required></v-textarea>

                        <v-btn large outlined color="primary" rounded width="100%">
                            Send
                            <v-icon right dark>
                                mdi-chat
                            </v-icon>
                        </v-btn>

                    </v-form>
                </div>

            </v-col>
        </v-row>
    </div>
</div>
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
 
}
</script>

<style scoped>
.box {
    background-color: rgb(255 255 255 / 30%);
    backdrop-filter: blur(5px);
    border-radius: 12px;
}

.parallax_about {
    background-image: url('~/assets/p4.svg');
    background-attachment: fixed;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    width: 100%;
}
</style>
