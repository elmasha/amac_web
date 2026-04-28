<template>
  <section class="contact-section">

    <!-- HEADER -->
    <div class="text-center mb-10">
      <h2 class="title">Get In Touch</h2>
      <p class="subtitle">
        We'd love to hear from you. Reach out for inquiries, partnerships or support.
      </p>
    </div>

    <v-container>

      <v-row justify="center">

        <!-- ADDRESS -->
        <v-col cols="12" md="4">
          <v-card class="contact-card" elevation="0">
            <div class="icon-wrap">
              <v-icon>mdi-map-marker</v-icon>
            </div>
            <h3>Address</h3>
            <p>Twiga Towers<br>Nairobi, Kenya</p>
          </v-card>
        </v-col>

        <!-- PHONE -->
        <v-col cols="12" md="4">
          <v-card class="contact-card" elevation="0">
            <div class="icon-wrap">
              <v-icon>mdi-phone</v-icon>
            </div>
            <h3>Call Us</h3>
            <p>+254 727 815 885</p>
          </v-card>
        </v-col>

        <!-- EMAIL -->
        <v-col cols="12" md="4">
          <v-card class="contact-card" elevation="0">
            <div class="icon-wrap">
              <v-icon>mdi-email</v-icon>
            </div>
            <h3>Email</h3>
            <p>info@amac.africa</p>
          </v-card>
        </v-col>

      </v-row>

      <!-- OPTIONAL CONTACT FORM -->
      <v-row justify="center" class="mt-10">

        <v-col cols="12" md="6">
          <v-card class="form-card pa-6">

            <h3 class="form-title">Send a Message</h3>

            <v-text-field
              v-model="name"
              label="Full Name"
              outlined dense
            />

            <v-text-field
              v-model="email"
              label="Email"
              outlined dense
            />

            <v-text-field
              v-model="subject"
              label="Subject"
              outlined dense
            />

            <v-textarea
              v-model="message"
              label="Message"
              outlined dense
              rows="4"
            />

            <v-btn block class="cta-btn mt-4">
              Send Message
            </v-btn>

          </v-card>
        </v-col>

      </v-row>

    </v-container>

  </section>
</template>

<script>
export default {
  data() {
    return {
      name: "",
      email: "",
      subject: "",
      message: ""
    };
  }
};
</script>

<style scoped>

/* SECTION */
.contact-section {
  background: #000;
  padding: 0px 0px;
  color: #fff;
}

/* HEADER */
.title {
  color: #d4af37;
  font-size: 2rem;
}

.subtitle {
  color: rgba(255,255,255,0.6);
  max-width: 500px;
  margin: auto;
}

/* CONTACT CARD */
.contact-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(212,175,55,0.2);
  border-radius: 14px;
  text-align: center;
  padding: 30px 20px;
  transition: 0.3s;
}

.contact-card:hover {
  transform: translateY(-8px);
  border-color: #d4af37;
  box-shadow: 0 0 25px rgba(212,175,55,0.2);
}

/* ICON */
.icon-wrap {
  width: 60px;
  height: 60px;
  margin: auto;
  margin-bottom: 15px;
  border-radius: 50%;
  background: rgba(212,175,55,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-wrap .v-icon {
  color: #d4af37;
  font-size: 28px;
}

/* TEXT */
h3 {
  margin-top: 10px;
  font-size: 1.2rem;
}

p {
  color: rgba(255,255,255,0.7);
  font-size: 0.95rem;
}

/* FORM */
.form-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(212,175,55,0.2);
  border-radius: 14px;
}

.form-title {
  margin-bottom: 20px;
  color: #d4af37;
}

/* BUTTON */
.cta-btn {
  background: linear-gradient(135deg, #d4af37, #ffcc00);
  color: #000;
  font-weight: bold;
  border-radius: 10px;
}

/* MOBILE */
@media (max-width: 960px) {
  .contact-card {
    margin-bottom: 20px;
  }
}

</style>