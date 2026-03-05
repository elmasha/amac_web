<template>
<v-container class="tickets-container">
    <h2 class="title">Your Tickets</h2>

    <div v-if="loading" class="loading">Loading tickets...</div>
    <div v-else-if="tickets.length === 0" class="no-tickets">
        No tickets found for this order.
    </div>

    <div v-else class="tickets-grid">
        <div v-for="ticket in tickets" :key="ticket.id" class="ticket-card">
        <div class="d-flex">

            <div>
<div class="ticket-header">
                <strong>Row {{ ticket.row_no }} - Seat {{ ticket.seat_no }}</strong>
                <span :class="['status', ticket.status]">{{ ticket.status }}</span>
            </div>

            <div class="qr-code">
                <img :src="getQrUrl(ticket.qr_code)" alt="QR Code" />
            </div>

            <div class="ticket-footer">
                <small>ID: {{ ticket.id }}</small>
            </div>
            </div>
        </div>
            
        </div>
    </div>
</v-container>
</template>

<script>
import axios from "axios";

export default {
    props: {
        orderId: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            tickets: [],
            loading: true
        };
    },
    mounted() {
        this.fetchTickets();
    },
    methods: {
        async fetchTickets() {
            try {
                const {
                    data
                } = await axios.get(
                    `https://amacserver-production-ebd5.up.railway.app/api/tickets/order/${this.orderId}`
                );

                if (data.success) {
                    this.tickets = data.tickets;
                }
            } catch (err) {
                console.error("Failed to fetch tickets:", err);
            } finally {
                this.loading = false;
            }
        },
        getQrUrl(qrToken) {
            // Use any QR generator API (e.g., goqr.me)
            return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrToken}`;
        }
    }
};
</script>

<style scoped>
.tickets-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
}

.title {
    text-align: center;
    margin-bottom: 20px;
}

.loading,
.no-tickets {
    text-align: center;
    font-size: 1.2rem;
    color: #555;
}

.tickets-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    justify-content: center;
}

.ticket-card {
    width: 200px;
    border: 2px solid #2196f3;
    border-radius: 12px;
    padding: 12px;
    text-align: center;
    background: #f5f5f5;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    transition: transform 0.2s;
}

.ticket-card:hover {
    transform: scale(1.05);
}

.ticket-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    font-weight: bold;
}

.status {
    text-transform: capitalize;
    padding: 2px 6px;
    border-radius: 6px;
    font-size: 0.8rem;
    color: white;
}

.status.valid {
    background: #4caf50;
}

.status.used {
    background: #f44336;
}

.status.cancelled {
    background: #ff9800;
}

.qr-code img {
    width: 120px;
    height: 120px;
    margin: 0 auto;
}

.ticket-footer {
    margin-top: 8px;
    font-size: 0.7rem;
    color: #666;
}
</style>
