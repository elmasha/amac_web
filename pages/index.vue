<template>
<!-- Render HTML here -->
<div dark v-html="htmlContent"></div>
</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
            htmlContent: "",
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

    },
};
</script>
