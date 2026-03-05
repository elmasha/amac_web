<template>
  <v-container>
    <v-card>
      <v-card-title>Create Order</v-card-title>
      <v-card-text>
        <v-form>
          <v-select :items="events" item-text="title" item-value="id" label="Event" v-model="event_id"></v-select>
          <v-select :items="categories" item-text="name" item-value="id" multiple v-model="selectedCategories" label="Select Categories"></v-select>
          <v-text-field label="Phone" v-model="phone"></v-text-field>
          <v-btn color="primary" @click="createOrder">Pay with M-Pesa</v-btn>
        </v-form>
      </v-card-text>
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
      categories: [],
      event_id: null,
      selectedCategories: [], // [{category_id, quantity}]
      phone: "",
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
    async fetchCategories() {
      if (!this.event_id) return;
      const res = await this.axios.get(`https://amacserver-production-ebd5.up.railway.app/api/categories/get-by-event/${this.event_id}`);
      this.categories = res.data;
    },
    async createOrder() {
      const items = this.selectedCategories.map(c => ({ category_id: c, quantity: 1 }));
      const res = await this.axios.post("https://amacserver-production-ebd5.up.railway.app/api/orders/create-order", {
        event_id: this.event_id,
        items,
        phone: this.phone,
        user_uid: "user-0001", // Replace with actual user UID
      });
      alert("STK push initiated!");
    },
  },
};
</script>