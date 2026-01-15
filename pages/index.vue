<template>
<v-app style="background-color: black;">
    <v-row v-resize="onResize">
        <v-col cols="12" md="12">
            <div>
                <v-app-bar height="80" dark elevation="0" class="" color="black" fixed>
                    <v-menu offset-y>
                        <template v-slot:activator="{ on, attrs }">

                            <v-app-bar-nav-icon v-show="showBurger" light v-bind="attrs" v-on="on" color="white"></v-app-bar-nav-icon>
                        </template>
                        <v-list>
                            <!-- <v-list-item v-for="(item, index) in items" :key="item.title">
                                                   <v-list-item-action @click="checkNav(item.title)">{{ item.title }}</v-list-item-action>
                                                   <v-list-item-title></v-list-item-title>
                                               </v-list-item> -->

                            <v-list-item> <a id="link" @click.prevent="scrollToSection('home')" style="margin: 8px;">Home</a></v-list-item>
                            <v-list-item><a id="link" @click.prevent="scrollToSection('about')" style="margin: 8px;">About</a></v-list-item>
                            <v-list-item><a id="link" @click.prevent="scrollToSection('aim')" style="margin: 8px;">Aim & Objectives</a></v-list-item>
                            <v-list-item> <a id="link" @click.prevent="scrollToSection('gallery')" style="margin: 8px;">Gallery</a></v-list-item>
                            <v-list-item> <a id="link" @click.prevent="scrollToSection('team')" style="margin: 8px;">Team</a></v-list-item>
                            <v-list-item> <a id="link" @click.prevent="scrollToSection('contact')" style="margin: 8px;">Contact</a></v-list-item>

                        </v-list>
                    </v-menu>
                    <div class="d-flex">
                        <v-avatar color="black" size="28">
                            <v-img :src="logo"></v-img>
                        </v-avatar>
                        <v-toolbar-title style="margin-left: 10px;">Amac </v-toolbar-title>
                    </div>

                    <v-spacer></v-spacer>
                    <div v-show="!showBurger" id="nav_bar_links">
                        <a id="link" @click.prevent="scrollToSection('home')" style="margin: 8px;">Home</a>
                        <a id="link" @click.prevent="scrollToSection('about')" style="margin: 8px;">About</a>
                        <a id="link" @click.prevent="scrollToSection('aim')" style="margin: 8px;">Aim & Objectives</a>
                        <a id="link" @click.prevent="scrollToSection('gallery')" style="margin: 8px;">Gallery</a>
                        <a id="link" @click.prevent="scrollToSection('team')" style="margin: 8px;">Team</a>
                        <a id="link" @click.prevent="scrollToSection('contact')" style="margin: 8px;">Contact</a>
                    </div>
                    <v-spacer></v-spacer>

                    <v-btn outlined color="primary" rounded>
                        <p style="color: white; margin-top: 14px;">Nominate now</p>
                    </v-btn>

                    <!-- <v-btn icon @click="$fire.auth.signOut()" v-if="show_auth">
                                           <v-icon>mdi-logout</v-icon>
                                       </v-btn> -->

                </v-app-bar>

            </div>
        </v-col>
        <v-row>

            <v-col cols="12" md="12">
                <section id="home">
                    <home></home>
                </section>
            </v-col>
            <v-col cols="12" md="12">
                <section id="about" class="bg-gray-100 ">
                    <about></about>
                </section>
            </v-col>
            <v-col cols="12" md="12" class="parallax_about">
                <section id="aim" class="bg-gray-100 ">
                    <aim></aim>
                </section>
            </v-col>
            <v-col cols="12" md="12">
                <section id="gallery" class="bg-gray-100 ">
                    <gallery></gallery>
                </section>
            </v-col>
            <v-col cols="12" md="12">
                <section id="team" class="bg-gray-100 ">
                    <team></team>
                </section>
            </v-col>
            <v-col cols="12" md="12">
                <section id="contact" class="bg-gray-100 ">
                    <contact></contact>
                </section>
            </v-col>
        </v-row>
    </v-row>

</v-app>
<!-- Render HTML here -->
</template>

<script>
import axios from "axios";
import logo from "@/assets/logo.png";
import Home from "../components/Home.vue"
import Gallery from "../components/Gallery.vue"
import About from "../components/About.vue"
import Aim from "../components/Aim.vue"
import Team from "../components/Team.vue"
import Contact from "../components/Contact.vue"

export default {
    components: {
        Contact,
        Team,
        Gallery,
        Aim,
        About,
        Home
    },
    data() {
        return {
            logo,
            windowSize: {
                x: window.innerHeight,
                y: window.innerWidth,
            },
            htmlContent: "",
            showBurger: false,
            showBurger: false,
        };
    },
    async mounted() {
        // await this.fetchCategories();
        // Load external HTML file at runtime
        fetch("/snippets/index.html") // Place myfile.html in `public/` folder
            .then((res) => res.text())
            .then((html) => {
                this.htmlContent = html;
            })
            .catch((err) => {
                console.error("Error loading HTML:", err);
            });
    },
    methods: {
        onResize() {
            this.windowSize = {
                x: window.innerWidth,
                y: window.innerHeight,
            };
            console.log("size", this.windowSize.x);
            if (this.windowSize.x < 950) {
                this.showBurger = true;
            } else {
                this.showBurger = false;
            }
            return this.windowSize;
        },
        scrollToSection(id) {
            const target = document.getElementById(id)
            if (target.id != 'home') {
                this.backToTop = true;
            } else {
                this.backToTop = false;
            }

            if (!target) return
            const start = window.scrollY
            const end = target.offsetTop
            const distance = end - start
            const duration = 800 // ms
            let startTime = null

            function easeInOutQuad(t) {
                return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
            }

            function animation(currentTime) {
                if (startTime === null) startTime = currentTime
                const timeElapsed = currentTime - startTime
                const progress = Math.min(timeElapsed / duration, 1)
                window.scrollTo(0, start + distance * easeInOutQuad(progress))
                if (timeElapsed < duration) requestAnimationFrame(animation)
            }
            requestAnimationFrame(animation)
        }
    },
};
</script>

<style>
.parallax_about {
    background-image: url('~/assets/pg.png');
    background-attachment: fixed;
    background-repeat: no-repeat;
    width: 100%;
}

#link {
    color: gold;
    font-weight: 800;
    transition: 0.3s;
}

#link:hover {
    color: #fff;
    font-weight: 800;
}
</style>
