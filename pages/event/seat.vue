<!-- <template>
<v-container class="auditorium-container">

    <div class="stage">
        <div class="stage-label">🎤 STAGE</div>
    </div>

    <div class="seating-area">
        <div v-for="(row, rIndex) in seatRows" :key="rIndex" class="seat-row" :style="getRowStyle(rIndex)">
            <div class="row-label">{{ getRowLabel(rIndex) }}</div>

            <div v-for="seat in row" :key="seat.id" class="seat" :class="getSeatClass(seat)" @click="toggleSeat(seat)">
                <div class="chair-back"></div>
                <div class="chair-seat">
                    {{ seat.seat_no }}
                </div>
            </div>
        </div>
    </div>

    <div class="selected-seats" v-if="selectedSeats.length">
        <strong>Selected:</strong>
        <span v-for="seat in selectedSeats" :key="seat.id" class="selected-chip">
            Row {{ getRowLabel(seat.row_no - 1) }} - {{ seat.seat_no }} - KES {{ seat.price }}
        </span>
        <div class="total">Total: KES {{ totalAmount }}</div>
    </div>

    <v-text-field label="Phone Number" v-model="phone" :prefix="prefix"></v-text-field>
    <v-btn color="primary" class="buy-btn" @click="buyTickets" :disabled="!selectedSeats.length">
        Buy Tickets
    </v-btn>

    <v-btn color="secondary" class="buy-btn" @click="generateTickets">
        Generate Tickets
    </v-btn>

    <v-btn color="secondary" class="buy-btn" to="/event/scan">
        Scan Tickets
    </v-btn>

    <Tickets :orderId="'d23bf691-71ad-4bef-b654-f09ffa2567df'" />
</v-container>
<v-snackbar color="white--text" :timeout="4000" v-model="snackbar" center>
    {{ snackbarText }}
</v-snackbar>
<v-snackbar color="red" :timeout="4000" v-model="snackbar2" outlined bottom center>
    {{ snackbarText2 }}
</v-snackbar>
</template>

<script>
import axios from "axios";

export default {
    components: {
        Tickets: () => import("../../components/Tickets.vue")
    },
    data() {

        return {
            snackbar: false,
            snackbarText: "No error message",
            snackbarText2: "No error message",
            snackbar2: false,
            showLogin: false,
            snackbarText2: "",
            prefix: "254",
            seatRows: [],
            selectedSeats: [],
            eventId: "33302ecb-17d5-11f1-9f1e-a2aab1a5696f",
            userUid: "user-32434254435",
            phone: ""
        };
    },

    computed: {
        totalAmount() {

            let total = this.selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
            return total.toLocaleString(); // Format with commas
        }
    },

    async mounted() {
        await this.fetchSeats();
    },

    methods: {
       
        async fetchSeats() {
            try {
                const {
                    data
                } = await axios.get(`https://amacserver-production-ebd5.up.railway.app/api/seats/event/${this.eventId}`);
                const rowsMap = {};
                data.forEach(seat => {
                    if (!rowsMap[seat.row_no]) rowsMap[seat.row_no] = [];
                    rowsMap[seat.row_no].push(seat);
                });
                this.seatRows = Object.keys(rowsMap)
                    .sort((a, b) => a - b)
                    .map(key => rowsMap[key].sort((a, b) => a.seat_no - b.seat_no));
            } catch (err) {
                console.error(err);
            }
        },

        getSeatClass(seat) {
            if (seat.status === "sold") return "sold";
            if (this.selectedSeats.find(s => s.id === seat.id)) return "selected";
            return "available";
        },

        toggleSeat(seat) {
            if (seat.status === "sold") return;
            const index = this.selectedSeats.findIndex(s => s.id === seat.id);
            if (index > -1) this.selectedSeats.splice(index, 1);
            else this.selectedSeats.push(seat);
        },

        getRowLabel(index) {
            return String.fromCharCode(65 + index);
        },

        getRowStyle(rIndex) {
            const totalRows = this.seatRows.length;
            const curveStrength = 0; // smaller = subtle curve
            const offset = (rIndex - totalRows / 2) * curveStrength;
            return {
                transform: `translateX(${offset}px)`
            };
        },

        async buyTickets() {
            let phone = this.prefix + this.phone;
            if (phone.length < 12) {
                alert("Please enter your phone number.");
                return;
            }

            const payload = {
                event_id: this.eventId,
                user_uid: this.userUid,
                phone: phone,
                items: this.selectedSeats.map(s => ({
                    seat_id: s.id,
                    price: s.price
                }))
            };

            await axios.post(
                    "https://amacserver-production-ebd5.up.railway.app/api/orders/create",
                    payload
                ).then((response) => {
                    console.log(response.data);
                    alert("STK Push initiated! Check your phone for payment.");
                })
                .catch((error) => {
                    console.error(error);
                    alert("Failed to initiate payment. Please try again.");
                });

        },
        async generateTickets() {
            axios
                .post("https://amacserver-production-ebd5.up.railway.app/api/tickets/generate", {
                    order_id: "d23bf691-71ad-4bef-b654-f09ffa2567df",
                    event_id: this.eventId,
                    user_id: this.userUid,
                })
                .then(function (response) {
                    console.log(response.data);
                })
                .catch(function (error) {
                    console.error(error);
                });

        }
    }
};
</script>

<style scoped>
.auditorium-container {
    perspective: 1200px;
    width: 100%;
    overflow-x: auto;
    padding-bottom: 40px;
}

.stage {
    width: 100%;
    height: 80px;
    background: linear-gradient(to bottom, #444, #111);
    border-radius: 0 0 100px 100px;
    margin-bottom: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
}

.stage-label {
    color: white;
    font-weight: bold;
}

.seating-area {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.seat-row {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    margin: 8px 0;
    align-items: center;
}

.seat {
    width: 40px;
    margin: 4px;
    cursor: pointer;
    text-align: center;
}

.chair-back {
    width: 100%;
    height: 16px;
    background: #555;
    border-radius: 6px 6px 0 0;
}

.chair-seat {
    width: 100%;
    height: 18px;
    background: #777;
    border-radius: 4px;
    font-size: 0.7rem;
    line-height: 18px;
    color: white;
    font-weight: bold;
}

.row-label {
    width: 20px;
    margin-right: 8px;
    font-weight: bold;
    color: #f7f7f7;
    display: flex;
    align-items: center;
    justify-content: center;
}

.available .chair-seat {
    background: #4caf50;
}

.sold .chair-seat {
    background: #f44336;
    cursor: not-allowed;
    opacity: 0.6;
}

.selected .chair-seat {
    background: #2196f3;
}

.selected-seats {
    margin-top: 20px;
    text-align: center;
}

.selected-chip {
    background: #2196f3;
    color: white;
    padding: 4px 8px;
    border-radius: 16px;
    margin: 2px;
    display: inline-block;
    font-size: 0.75rem;
}

.total {
    margin-top: 8px;
    font-weight: bold;
    font-size: 0.9rem;
}

.buy-btn {
    margin-top: 20px;
    width: 100%;
    max-width: 200px;
}

@media (max-width: 600px) {
    .seat {
        width: 30px;
        margin: 2px;
    }

    .chair-seat {
        font-size: 0.6rem;
        line-height: 14px;
    }
}
</style> -->
