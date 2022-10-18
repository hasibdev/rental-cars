<template>
  <div class="login">
    <div class="login-form">
      <div class="login-form__header">
        <div class="logo">
          <img :src="require(`@/assets/images/${appLogo}`)" alt="logo" />
        </div>
        <h2 class="login-form__title">Welcome back!</h2>
      </div>
      <p v-if="error" class="error__message">{{ error }}</p>
      <div class="login-form__inner">
        <b-input
          ref="email"
          v-model="form.email"
          placeholder="Email"
          required
        />
        <b-input
          ref="password"
          v-model="form.password"
          placeholder="password"
          required
          type="password"
        />
        <button
          class="login-form__btn base-btn base-btn__primary"
          @click="submit"
        >
          Login
        </button>
      </div>
      <app-link path="/" class="login-form__link">Forgot password?</app-link>
    </div>
  </div>
</template>

<script>
import BInput from "@/components/base/BInput.vue";
import { useAuthStore } from "@/stores/authStore";
import { mapState, mapActions } from "pinia";
export default {
  name: "LoginPage",
  components: {
    BInput,
  },

  data() {
    return {
      error: null,
      form: {
        email: "",
        password: "",
      },
    };
  },
  computed: {
    appLogo() {
      return process.env.VUE_APP_LOGO;
    },
    ...mapState(useAuthStore, ["user"]),
  },
  methods: {
    ...mapActions(useAuthStore, ["setLoginUser"]),
    submit() {
      this.$refs.password.vlaidateForm();
      this.$refs.email.vlaidateForm();

      if (this.$refs.email.errorMessage) {
        this.$refs.email.focus();
        return;
      }

      if (this.$refs.email.errorMessage) {
        this.$refs.email.focus();
        return;
      }

      this.formSubmited = true;
      this.login();
    },

    async login() {
      if (this.formSubmited) {
        this.setLoginUser({
          name: "hana",
          email: "hena@gmail.com",
        });
        // try {
        //   await this.$auth.loginWith("local", {
        //     data: this.form,
        //   });
        //   this.reset();
        //   this.error = null;
        // } catch (error) {
        //   this.error = error.response.data[0];
        // }
      }
    },

    reset() {
      this.$refs.email.resetForm();
      this.$refs.password.resetForm();

      this.form.email = "";
      this.form.password = "";
    },
  },
};
</script>

<style lang="scss" scoped>
.login {
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-white);

  @include responsive-max("sm") {
    width: 95%;
    margin: 0 auto;
  }

  .error__message {
    color: var(--color-error);
    font-size: 0.875rem;
    margin-bottom: 0.75rem;
  }

  &-form {
    width: 500px;
    padding: 2rem;
    border-radius: 5px;
    overflow: hidden;
    box-shadow: 0 0px 37px var(--color-light-grey);
    border: 1px solid var(--color-light-grey);

    &__header {
      text-align: center;
      margin-bottom: 2rem;
      .logo {
        margin: 0 auto;
        width: 50%;
        margin-bottom: 1rem;

        @include responsive-max("sm") {
          width: 70%;
        }
      }
    }

    &__title {
      font-size: 1.5rem;
      font-weight: 500;
      color: var(--color-text);
    }

    &__btn {
      width: 100%;
      padding: 0.75rem;
      margin-top: 0.5rem;
      margin-bottom: 1rem;
    }

    &__link {
      font-size: 1rem;
      font-weight: 400;
      color: var(--color-text);

      &:hover {
        color: var(--color-primary);
      }
    }
  }
}
</style>
