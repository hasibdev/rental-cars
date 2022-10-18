<script setup>
import { reactive, ref } from "vue"
import { useRouter } from "vue-router"
// import { useToast } from "vue-toastification"
import { useAuthStore } from "@/stores/auth"
import { useI18n } from 'vue-i18n'

const auth = useAuthStore()
const router = useRouter()
// const toast = useToast()

const { t } = useI18n({ useScope: 'global' })

const form = reactive({
  email: '',
  password: ''
})

const hasError = ref(false)
const showPassword = ref(false)
// const errorMsg = ref("")
const loginState = ref(false)
const onLogin = async () => {
  try {
    loginState.value = true
    await auth.login('/login', form)
    hasError.value = true
    router.push('/dashboard')
    // toast.success("Login Success")
  } catch (error) {
    hasError.value = true
    // if (error.response?.status == 422) {
    //   errorMsg.value = error.response.data.message
    // }
  }
  finally {
    loginState.value = false
  }
}
</script>

<template>
  <div class="">
    <div class="login-header">
      <router-link to="/">
        <div class="log">
          <img src="@/assets/logo.png" alt="Logo" />
        </div>
      </router-link>
    </div>

    <div class="container">
      <div class="login-box">
        <form @submit.prevent="onLogin" class="input-box">
          <h2 class="input-box__title">{{ t('form-fields.welcome') }}</h2>

          <!-- Email -->
          <label class="input-box__label">{{ t('form-fields.email') }}</label>
          <input v-model="form.email" class="input-box__input" :style="hasError ? 'border: 0.125rem solid #E31313; background: #FFF0ED;' : 'border: 0.125rem solid #eee; background: #EEEEEE' " type="email" name="" />

          <!-- Password -->
          <label class="input-box__label">{{ t('form-fields.password') }}</label>
          <div class="position-relative">
            <input v-model="form.password" class="input-box__input" :style="hasError ? 'border: 0.125rem solid #E31313; background: #FFF0ED;' : 'border: 0.125rem solid #eee; background: #EEEEEE' " :type="showPassword? 'text' : 'password' " name="" />
            <div v-if="form.password.length > 0" class="position-absolute icon-append pointer" style="top: 10px; right: 10px;">
              <svg v-if="!showPassword" @click="showPassword = !showPassword" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 10.3333C3 10.3333 5.66667 5 10.3333 5C15 5 17.6667 10.3333 17.6667 10.3333C17.6667 10.3333 15 15.6667 10.3333 15.6667C5.66667 15.6667 3 10.3333 3 10.3333Z" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M10.333 12.3334C11.4376 12.3334 12.333 11.4379 12.333 10.3334C12.333 9.2288 11.4376 8.33337 10.333 8.33337C9.22844 8.33337 8.33301 9.2288 8.33301 10.3334C8.33301 11.4379 9.22844 12.3334 10.333 12.3334Z" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <svg v-else @click="showPassword = !showPassword" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.2933 14.2934C13.1537 15.162 11.7661 15.6433 10.3333 15.6667C5.66667 15.6667 3 10.3334 3 10.3334C3.82926 8.78795 4.97942 7.43776 6.37333 6.37335M8.93333 5.16002C9.39222 5.0526 9.86204 4.99891 10.3333 5.00002C15 5.00002 17.6667 10.3334 17.6667 10.3334C17.262 11.0904 16.7794 11.8032 16.2267 12.46M11.7467 11.7467C11.5636 11.9432 11.3428 12.1008 11.0974 12.2101C10.8521 12.3194 10.5873 12.3782 10.3187 12.3829C10.0502 12.3877 9.78344 12.3383 9.53441 12.2377C9.28537 12.1371 9.05915 11.9874 8.86923 11.7975C8.67931 11.6075 8.5296 11.3813 8.42901 11.1323C8.32842 10.8832 8.27902 10.6165 8.28376 10.348C8.28849 10.0794 8.34727 9.81458 8.45658 9.56925C8.5659 9.32392 8.7235 9.10312 8.92 8.92002" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M3 3L17.6667 17.6667" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
          </div>

          <!-- error message -->
          <div class="my-3" v-if="hasError">
            <span class="text-14 fw-400" style="color: #E31313;">
              Wrong email or password.
            </span>
          </div>

          <div class="btn-box">
            <button type="submit" :disabled="loginState" class="w-100 mt-4 btn-box__next d-flex justify-content-center align-items-center">
              <span class="me-1">Login</span>
              <div v-if="loginState">
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-header {
  background-color: var(--color-dark);
  padding: 1.4rem;

  &__logo {
    width: 9.688rem;
    cursor: pointer;
  }
}

.login-box {
  width: 476px;
  margin: 2rem auto;
  padding: 0rem 3.2rem 3.5rem 3.2rem;
  border-radius: 0.25rem;
  box-shadow: 0 4px 16px rgb(0 0 0 / 12%);
}

.input-box {
  padding-top: 2rem;
  padding-bottom: 2rem;

  &__title {
    font-size: 2.25rem;
    font-weight: 500;
  }

  &__label {
    font-size: 0.813rem;
    font-weight: 400;
    padding-top: 1.3rem;
    margin-bottom: 0.5rem;
  }

  &__input {
    width: 100%;
    border: 0.125rem solid #eee;
    padding: 0.6rem;
    border-radius: 4px;
    outline: none;
    background-color: #eee;
    transition: all 0.5s ease;
  }

  &__input:focus {
    border: 0.125rem solid var(--color-dark) !important;
    background-color: #eee;
  }
}

.new-user {
  display: flex;
  gap: 0.2rem;
  color: #000;
  padding-top: 7rem;

  &__contact-us {
    color: var(--color-primary) !important;
  }
}

.btn-box {
  padding-top: 1.25rem;
  padding-bottom: 2.5rem;

  &__next {
    border: none;
    outline: none;
    border-radius: 4px;
    background-color: var(--color-dark);
    color: #fff;
    width: 6.75rem;
    height: 2.35rem;
    font-weight: 500;
    float: right;
    font-weight: 500;
  }
}
</style>
