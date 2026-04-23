<!-- <template>
<v-container>
        <v-card-title>Create Event</v-card-title>
        <v-card-text>
            <v-form>
                <v-text-field label="Title" v-model="name" required></v-text-field>
                <v-textarea label="Description" v-model="description"></v-textarea>
                <v-text-field label="Venue" v-model="venue"></v-text-field>
                <v-menu ref="menu" v-model="menu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
                    <template v-slot:activator="{ on, attrs }">
                        <v-text-field v-model="event_date" label="Event Date" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
                    </template>
                    <v-date-picker v-model="event_date" @input="menu = false"></v-date-picker>
                </v-menu>
                <v-btn color="primary" @click="createEvent">Create Event</v-btn>
            </v-form>
        </v-card-text>

        <v-card-title>Published Events</v-card-title>
        <v-data-table :headers="headers" :items="events">
            <template v-slot:item.actions="{ item }">
                <v-btn small color="green" @click="publishEvent(item.id)">Publish</v-btn>
            </template>
        </v-data-table>
</v-container>
</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
            axios,
            name: "",
            description: "",
            venue: "",
            event_date: "",
            menu: false,
            events: [],
            headers: [{
                    text: "Title",
                    value: "name"
                },
                {
                    text: "Venue",
                    value: "venue"
                },
                {
                    text: "Date",
                    value: "event_date"
                },
                {
                    text: "Status",
                    value: "status"
                },
                {
                    text: "Actions",
                    value: "actions",
                    sortable: false
                },
            ],
        };
    },
    mounted() {
        this.fetchEvents();
    },
    methods: {
        async createEvent() {
            await this.axios.post("https://amacserver-production-ebd5.up.railway.app/api/events/create-event", {
                title: this.title,
                description: this.description,
                venue: this.venue,
                event_date: this.event_date,
            });
            this.title = this.description = this.venue = this.event_date = "";
            this.fetchEvents();
        },
        async fetchEvents() {
            const res = await this.axios.get("https://amacserver-production-ebd5.up.railway.app/api/events/get-event");
            this.events = res.data;
            console.log(this.events);
        },
        async publishEvent(id) {
            await this.axios.put(`https://amacserver-production-ebd5.up.railway.app/api/events/${id}/publish`);
            this.fetchEvents();
        },
    },
};
</script> -->
