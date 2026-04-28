<template>
<v-app dark style="background-color: black;">
    <v-main style="background-color: black;">
        <Nuxt style="background-color: black;"/>
    </v-main>
    <Footer />
</v-app>
</template>

<script>
import {
    uuid
} from "vue-uuid";
import Footer from "@/components/footer.vue";
export default {
    name: "DefaultLayout",
    components: {
        Footer
    },
    data() {
        return {
            logo: require("@/assets/logo.png"),

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

* {
    font-family: "Quicksand", sans-serif;
    scroll-behavior: smooth;
    overflow: hidden;
    

}

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
