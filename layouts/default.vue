<template>
<v-app dark>

    <v-main>
        <Nuxt />
    </v-main>
    <footer bottom fixed>
        <v-card color="#000" dark>
            <v-row>
                <v-col cols="6" md="4">
                    <div class="container">

                        <p style="font-size: 0.6rem; color: grey"></p>
                        <h4 style="font-weight: 200">Amac</h4>
                        <div class="d-flex"></div>
                    </div>
                </v-col>
                <v-col cols="6" md="4">
                    <div class="container">
                        <h6 style="font-weight: 200">Follow us on</h6>
                        <div class="d-flex">
                            <a href="" style="margin: 2px">
                                <v-icon small>mdi-facebook</v-icon>
                            </a>
                            <a href="" style="margin: 2px">
                                <v-icon small>mdi-instagram</v-icon>
                            </a>
                            <a href="" style="margin: 2px">
                                <v-icon small>mdi-whatsapp</v-icon>
                            </a>
                        </div>
                    </div>
                </v-col>
                <v-col cols="12" md="4">
                    <div class="container text-center">
                        <span style="font-size: 0.6rem; color: grey"> © Copyright Amac</span>
                        <span style="font-size: 0.6rem; color: grey"> All Rights Reserved</span><br />
                     
                    </div>
                </v-col>
            </v-row>
        </v-card>
    </footer>
</v-app>
</template>

<script>
import {
    uuid
} from "vue-uuid";
export default {
    name: "DefaultLayout",
    data() {
        return {
            clipped: false,
            drawer: false,
            fixed: false,
            items: [{
                    icon: "mdi-apps",
                    title: "Welcome",
                    to: "/",
                },
                {
                    icon: "mdi-chart-bubble",
                    title: "Inspire",
                    to: "/inspire",
                },
            ],
            miniVariant: false,
            right: true,
            rightDrawer: false,
            title: "Charge24 Mpesa",
        };
    },
};
</script>

<style>
/* @media (max-width: 100%) {
  .section span {
    width: calc(10vw - 2px);
    height: calc(10vw - 2px);
  }
}
@media (max-width: 600px) {
  .section span {
    width: calc(20vw - 2px);
    height: calc(20vw - 2px);
  }
} */
</style>
