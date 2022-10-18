import { defineStore } from 'pinia';

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    isLoggedIn: true,
    user: {
      name: "Rahaman",
      email: 'rahaman@gmail.com'
    }
  }),
  actions: {
    setLoginUser(payload) {
      this.isLoggedIn = true
      this.user = payload
    }
  }
})