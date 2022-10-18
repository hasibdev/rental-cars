import { defineStore } from 'pinia'

export const useValidationStore = defineStore({
   id: 'validation',
   state: () => ({
      errors: {}
   }),
   actions: {
      setErrors(errors) {
         this.errors = errors
      },
      clearErrors() {
         this.errors = {}
      },
   }
})
