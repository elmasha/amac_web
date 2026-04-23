<!-- <template>
<v-container>
        <v-card-title>Create Organizer</v-card-title>
        <v-card-text>
            <v-form ref="form">
                <v-text-field label="Name" v-model="name" required></v-text-field>
                <v-text-field label="Email" v-model="email" required></v-text-field>
                <v-text-field label="Phone" v-model="phone" required></v-text-field>
                <v-btn color="primary" @click="createOrganizer">Create</v-btn>
            </v-form>
        </v-card-text>

        <v-card-title>All Organizers</v-card-title>
        <v-data-table :items="organizers" :headers="headers"></v-data-table>
</v-container>
</template>

<script>
import axios from "axios";
export default {
    data() {
        return {
            name: "",
            email: "",
            phone: "",
            organizers: [],
            headers: [{
                    text: "Name",
                    value: "name"
                },
                {
                    text: "Email",
                    value: "email"
                },
                {
                    text: "Phone",
                    value: "phone"
                },
            ],
        };
    },
    mounted() {
        this.fetchOrganizers();
    },
    methods: {
        async createOrganizer() {
            await this.axios.post("https://amacserver-production-ebd5.up.railway.app/api/organizers/create", {
                name: this.name,
                email: this.email,
                phone: this.phone,
            });
            this.name = this.email = this.phone = "";
            this.fetchOrganizers();
        },
        async fetchOrganizers() {
            const res = await this.axios.get("https://amacserver-production-ebd5.up.railway.app/api/organizers/get-all");
            this.organizers = res.data;
        },
    },
};
</script> -->
