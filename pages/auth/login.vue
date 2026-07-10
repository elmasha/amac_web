<template>
  <v-app class="login-bg">
    <!-- Progress Bar -->
    <v-progress-linear
      v-show="loading"
      indeterminate
      color="gold"
      height="3"
      absolute
      top
    />

    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="5" lg="4">
          <!-- Logo / Brand -->
          <div class="text-center mb-6">
            <v-avatar size="64" class="login-avatar mb-3">
              <v-img :src="logo" />
            </v-avatar>
            <h1 class="brand-title">AMAC Awards</h1>
            <p class="brand-subtitle">Admin Portal</p>
          </div>

          <!-- Login Card -->
          <v-card class="login-card" elevation="8">
            <v-card-text class="pa-6">
              <div class="text-center mb-5">
                <h2 class="login-title">Sign In</h2>
                <p class="login-subtitle">Enter your credentials to access the admin dashboard</p>
              </div>

              <v-form ref="loginForm" v-model="isFormValid" @submit.prevent="handleLogin">
                <!-- Email -->
                <v-text-field
                  v-model="auth.email"
                  label="Email Address"
                  type="email"
                  outlined
                  dense
                  prepend-inner-icon="mdi-email"
                  :rules="[rules.required, rules.email]"
                  :disabled="loading"
                  class="mb-3"
                  autocomplete="email"
                  @keyup.enter="handleLogin"
                />

                <!-- Password -->
                <v-text-field
                  v-model="auth.password"
                  label="Password"
                  :type="showPassword ? 'text' : 'password'"
                  outlined
                  dense
                  prepend-inner-icon="mdi-lock"
                  :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  :rules="[rules.required, rules.minLength]"
                  :disabled="loading"
                  @click:append="showPassword = !showPassword"
                  @keyup.enter="handleLogin"
                />

                <!-- Remember Me & Forgot Password -->
                <div class="d-flex justify-space-between align-center mt-2 mb-4">
                  <v-checkbox
                    v-model="rememberMe"
                    label="Remember me"
                    dense
                    hide-details
                    color="gold"
                    class="mt-0"
                  />
                  <v-btn
                    text
                    small
                    color="gold"
                    class="forgot-btn"
                    @click="forgotPassword"
                  >
                    Forgot password?
                  </v-btn>
                </div>

                <!-- Login Button -->
                <v-btn
                  block
                  large
                  class="login-btn"
                  :loading="loading"
                  :disabled="!isFormValid || loading"
                  @click="handleLogin"
                >
                  <v-icon left>mdi-login</v-icon>
                  Sign In
                </v-btn>

                <!-- Divider -->
                <div class="divider my-4">
                  <span>or</span>
                </div>

                <!-- Back to Public Site -->
                <v-btn
                  block
                  text
                  color="grey"
                  @click="$router.push('/')"
                >
                  <v-icon left small>mdi-arrow-left</v-icon>
                  Back to AMAC Awards
                </v-btn>
              </v-form>
            </v-card-text>
          </v-card>

          <!-- Footer -->
          <div class="text-center mt-6 footer-text">
            <p>AMAC Awards Voting System</p>
            <p class="caption">© 2026 Adventist Music Awards Committee</p>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- Success Snackbar -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="4000"
      bottom
      rounded
    >
      <div class="d-flex align-center">
        <v-icon left class="mr-2">{{ snackbar.icon }}</v-icon>
        <span>{{ snackbar.message }}</span>
      </div>
      <template #action>
        <v-btn text @click="snackbar.show = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
export default {
  name: "AdminLogin",
  data() {
    return {
      logo: require("@/assets/logo.png"),
      auth: {
        email: "",
        password: "",
      },
      showPassword: false,
      rememberMe: false,
      loading: false,
      isFormValid: false,
      snackbar: {
        show: false,
        message: "",
        color: "error",
        icon: "mdi-alert-circle",
      },
      rules: {
        required: (v) => !!v || "This field is required",
        email: (v) => /.+@.+\..+/.test(v) || "Enter a valid email address",
        minLength: (v) => v.length >= 6 || "Password must be at least 6 characters",
      },
    };
  },

  mounted() {
    // Check if already logged in
    this.checkAuthState();
    // Load remembered email
    const savedEmail = localStorage.getItem("amac_admin_email");
    if (savedEmail) {
      this.auth.email = savedEmail;
      this.rememberMe = true;
    }
  },

  methods: {
    async handleLogin() {
      if (!this.$refs.loginForm.validate()) return;

      this.loading = true;

      try {
        const mAuth = this.$fire.auth;
        await mAuth.signInWithEmailAndPassword(this.auth.email, this.auth.password);

        // Save email if remember me is checked
        if (this.rememberMe) {
          localStorage.setItem("amac_admin_email", this.auth.email);
        } else {
          localStorage.removeItem("amac_admin_email");
        }

        this.showSnackbar("Login successful! Redirecting...", "success", "mdi-check-circle");

        // Small delay for UX
        setTimeout(() => {
          this.$router.push("/admin");
        }, 800);

      } catch (error) {
        console.error("Login error:", error);
        let message = "An error occurred. Please try again.";

        // Firebase auth error mapping
        const errorMap = {
          "auth/invalid-email": "Invalid email address format.",
          "auth/user-disabled": "This account has been disabled.",
          "auth/user-not-found": "No account found with this email.",
          "auth/wrong-password": "Incorrect password. Please try again.",
          "auth/too-many-requests": "Too many failed attempts. Please try again later.",
          "auth/network-request-failed": "Network error. Check your internet connection.",
        };

        if (error.code && errorMap[error.code]) {
          message = errorMap[error.code];
        } else if (error.message) {
          message = error.message;
        }

        this.showSnackbar(message, "error", "mdi-alert-circle");
      } finally {
        this.loading = false;
      }
    },

    async forgotPassword() {
      if (!this.auth.email) {
        this.showSnackbar("Please enter your email address first.", "warning", "mdi-information");
        return;
      }

      if (!/.+@.+\..+/.test(this.auth.email)) {
        this.showSnackbar("Please enter a valid email address.", "warning", "mdi-information");
        return;
      }

      this.loading = true;
      try {
        await this.$fire.auth.sendPasswordResetEmail(this.auth.email);
        this.showSnackbar("Password reset email sent! Check your inbox.", "success", "mdi-email-check");
      } catch (error) {
        console.error("Password reset error:", error);
        let message = "Failed to send reset email.";
        if (error.code === "auth/user-not-found") {
          message = "No account found with this email.";
        }
        this.showSnackbar(message, "error", "mdi-alert-circle");
      } finally {
        this.loading = false;
      }
    },

    checkAuthState() {
      this.$fire.auth.onAuthStateChanged((user) => {
        if (user) {
          // Already logged in, redirect to admin
          this.$router.push("/admin");
        }
      });
    },

    showSnackbar(message, color, icon) {
      this.snackbar = { show: true, message, color, icon };
    },
  },
};
</script>

<style scoped>
.login-bg {
  background: #000;
  min-height: 100vh;
}

.login-avatar {
  border: 2px solid rgba(255, 215, 0, 0.4);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.2);
}

.brand-title {
  color: gold;
  font-weight: 900;
  font-size: 1.6rem;
  letter-spacing: 0.5px;
  text-shadow: 0 0 14px rgba(255, 215, 0, 0.4);
  margin-bottom: 2px;
}

.brand-subtitle {
  color: rgba(255, 255, 255, 0.55);
  font-size: 0.85rem;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.login-card {
  background: rgba(17, 17, 17, 0.95) !important;
  border: 1px solid rgba(255, 215, 0, 0.15);
  border-radius: 20px !important;
  backdrop-filter: blur(14px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
}

.login-title {
  color: #fff;
  font-weight: 800;
  font-size: 1.4rem;
  margin-bottom: 4px;
}

.login-subtitle {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.85rem;
  margin: 0;
}

.login-btn {
  background: linear-gradient(135deg, gold, #ffcc00) !important;
  color: black !important;
  font-weight: 900;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 20px rgba(255, 215, 0, 0.35);
  transition: all 0.25s ease;
}

.login-btn:hover {
  box-shadow: 0 6px 28px rgba(255, 215, 0, 0.5);
  transform: translateY(-1px);
}

.login-btn:disabled {
  opacity: 0.6;
  transform: none;
}

.forgot-btn {
  text-transform: none;
  font-weight: 500;
  letter-spacing: 0;
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  color: rgba(255, 255, 255, 0.3);
  font-size: 0.8rem;
}

.divider::before,
.divider::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.divider span {
  padding: 0 12px;
}

.footer-text {
  color: rgba(255, 255, 255, 0.35);
  font-size: 0.8rem;
}

.footer-text p {
  margin: 2px 0;
}

/* Override Vuetify dark inputs */
:deep(.v-text-field--outlined fieldset) {
  border-color: rgba(255, 255, 255, 0.15);
}

:deep(.v-text-field--outlined:hover fieldset) {
  border-color: rgba(255, 215, 0, 0.4);
}

:deep(.v-text-field--outlined.v-input--is-focused fieldset) {
  border-color: gold !important;
}

:deep(.v-input__icon--prepend-inner .v-icon) {
  color: rgba(255, 255, 255, 0.4);
}

:deep(.v-label) {
  color: rgba(255, 255, 255, 0.5) !important;
}

:deep(.v-input input) {
  color: #fff !important;
}

:deep(.v-messages__message) {
  color: #ff4d4d !important;
}

/* Checkbox */
:deep(.v-input--checkbox .v-label) {
  color: rgba(255, 255, 255, 0.6) !important;
  font-size: 0.85rem;
}

/* Mobile */
@media (max-width: 600px) {
  .brand-title {
    font-size: 1.3rem;
  }
  .login-card {
    border-radius: 16px !important;
  }
  .login-title {
    font-size: 1.2rem;
  }
}
</style>