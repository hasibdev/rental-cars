import { defineStore } from 'pinia';

export const useToaster = defineStore('toaster', {
  state: () => ({
    messages: [],
    config: {
        timeInterval: 3000,
        position: 'top right'
    }
  }),

  actions: {
    setToaster(message) {
      this.messages.push({
        ...message,
        id: (Math.random().toString(36) + Date.now().toString(36)).substr(2)
      })
    },
    removeToaster(payload) {
        const index = this.messages.indexOf(payload);
        if (index > -1) {
            this.messages.splice(index, 1);
        }
    },
  }
})