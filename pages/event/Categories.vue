<template>
<v-container>
    <v-card>
        <v-card-title>Create Category</v-card-title>
        <v-card-text>
            <v-form>
                <v-select :items="events" item-text="title" item-value="id" label="Event" v-model="event_id"></v-select>
                <v-text-field label="Category Name" v-model="name"></v-text-field>
                <v-text-field label="Price" type="number" v-model="price"></v-text-field>
                <v-text-field label="Capacity" type="number" v-model="capacity"></v-text-field>
                <v-btn color="primary" @click="createCategory">Create</v-btn>
            </v-form>
        </v-card-text>
    </v-card>

    <v-card class="mt-5">
        <v-card-title>Event Categories</v-card-title>
        <v-data-table :headers="headers" :items="categories"></v-data-table>
    </v-card>
</v-container>
</template>

<script>
import axios from "axios";
export default {
    data() {
        return {
            axios,
            events: [],
            event_id: null,
            name: "",
            price: 0,
            capacity: 0,
            categories: [],
            headers: [{
                    text: "Name",
                    value: "name"
                },
                {
                    text: "Price",
                    value: "price"
                },
                {
                    text: "Capacity",
                    value: "capacity"
                },
            ],
        };
    },
    mounted() {
        this.fetchEvents();
    },
    watch: {
        event_id() {
            this.fetchCategories();
        },
    },
    methods: {
        async fetchEvents() {
            const res = await this.axios.get("https://amacserver-production-ebd5.up.railway.app/api/events/get-event");
            this.events = res.data;
        },
        async createCategory() {
            await this.axios.post("https://amacserver-production-ebd5.up.railway.app/api/categories/create-category", {
                event_id: this.event_id,
                name: this.name,
                price: this.price,
                capacity: this.capacity,
            });
            this.name = "";
            this.price = 0;
            this.capacity = 0;
            this.fetchCategories();
        },
        async fetchCategories() {
            if (!this.event_id) return;
            const res = await this.axios.get(`https://amacserver-production-ebd5.up.railway.app/api/categories/get-by-event/${this.event_id}`);
            this.categories = res.data;
        },
    },
};
</script>
