<!-- <template>
  <v-container>
    <v-card>
      <v-card-title>My Tickets</v-card-title>
      <v-data-table :items="tickets" :headers="headers">
        <template v-slot:item.qr="{ item }">
          <qrcode-vue :value="item.qr_token" :size="100"></qrcode-vue>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import QrcodeVue from "vue-qrcode-component";

export default {
  components: { QrcodeVue },
  data() {
    return {
      tickets: [],
      headers: [
        { text: "Event", value: "event_id" },
        { text: "Category", value: "category_id" },
        { text: "QR Code", value: "qr" },
        { text: "Status", value: "status" },
      ],
    };
  },
  mounted() {
    this.fetchTickets();
  },
  methods: {
    async fetchTickets() {
      const res = await this.$axios.get("/tickets/get-user-tickets");
      this.tickets = res.data;
    },
  },
};
</script> -->