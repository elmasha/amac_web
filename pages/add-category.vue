<template>
  <div class="container mx-auto p-4 max-w-md">
    <h1 class="text-2xl font-bold mb-4">Add New Category</h1>

    <form @submit.prevent="submitForm" class="space-y-4">
      <!-- Name -->
      <div>
        <label class="block font-medium mb-1">Category Name *</label>
        <input
          v-model="name"
          type="text"
          placeholder="Enter category name"
          class="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <!-- Description -->
      <div>
        <label class="block font-medium mb-1">Description</label>
        <textarea
          v-model="description"
          placeholder="Enter description"
          class="w-full border rounded px-3 py-2"
          rows="3"
        ></textarea>
      </div>

      <!-- Submit v-btn -->
      <v-btn
        type="submit"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        :disabled="loading"
      >
        {{ loading ? 'Saving...' : 'Add Category' }}
      </v-btn>
    </form>

    <!-- Success/Error messages -->
    <div v-if="message" :class="`mt-4 p-2 rounded ${error ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`">
      {{ message }}
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      name: '',
      description: '',
      loading: false,
      message: '',
      error: false,
    }
  },
  methods: {
    async submitForm() {
      if (!this.name) return;

      this.loading = true;
      this.message = '';
      this.error = false;

      try {
        const response = await axios.post('https://amacserver-production-6a8c.up.railway.app/api/categories/add', {
          name: this.name,
          description: this.description,
        });

        this.message = `Category "${response.data.name}" created successfully!`;
        this.name = '';
        this.description = '';
      } catch (err) {
        console.error(err);
        this.message = err.response?.data?.message || 'Error adding category';
        this.error = true;
      } finally {
        this.loading = false;
      }
    },
  },
}
</script>

<style scoped>
/* optional basic styling */
</style>
