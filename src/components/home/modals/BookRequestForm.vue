<template>
  <form class="booking-request__form" @submit.prevent="submitRequest">

    <!-- Company Name -->
    <b-input v-model="bookingForm.company_name" :placeholder="$t('home-booking-request-form.company')" />

    <RadioControl v-model="bookingForm.name_title" name="name_title" :options="titleOptions" errorField="name_title" class="my-3" />

    <!-- First / Last Name -->
    <div class="row">
      <div class="col-md-6">
        <b-input v-model="bookingForm.first_name" :placeholder="$t('home-booking-request-form.first-name')" errorField="first_name" />
      </div>
      <div class="col-md-6 m-last__name">
        <b-input v-model="bookingForm.last_name" :placeholder="$t('home-booking-request-form.last-name')" errorField="last_name" />
      </div>
    </div>

    <!-- Phone -->
    <b-input v-model="bookingForm.phone" :placeholder="$t('home-booking-request-form.phone')" class="mt-3" errorField="phone" />

    <!-- Email -->
    <b-input v-model="bookingForm.email" :placeholder="$t('home-booking-request-form.email')" class="mt-3" errorField="email" />

    <!-- Message -->
    <b-textarea v-model="bookingForm.message" :placeholder="$t('home-booking-request-form.message')" :height="150" class="mt-3" errorField="message" />

    <!-- Actions buttons -->
    <div class="booking__form-acitons">
      <button class="base-btn base-btn__primary" @click="requestRejected">
        {{ $t("home-booking-request-form.cancel") }}
      </button>
      <button :disabled="requestLoading" class="base-btn base-btn__dark" type="submit">
        {{ $t("home-booking-request-form.request") }}
      </button>
    </div>
  </form>
</template>

<script>
import BInput from "@/components/base/BInput.vue"
import BTextarea from "@/components/base/BTextarea.vue"
import RadioControl from '@/components/dashboard/form/RadioControl.vue'
import { api } from '@/plugins/api'
import { mapState, mapActions } from 'pinia'
import { useReservationStore } from '@/stores/reservation'

export default {
  name: "BookRequestForm",
  components: {
    BInput,
    BTextarea,
    RadioControl

  },
  props: {
    searchData: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      countries: [],
      requestLoading: false
    }
  },
  computed: {
    ...mapState(useReservationStore, ['bookingForm']),
    titleOptions() {
      return [
        { label: this.$t('home-booking-request-form.mr'), value: 'Mr.' },
        { label: this.$t('home-booking-request-form.mrs'), value: 'Mrs.' },
      ]
    }
  },
  methods: {
    ...mapActions(useReservationStore, ['clearBookingForm']),
    async submitRequest() {
      try {
        this.requestLoading = true
        await api.post('request-booking', {
          ...this.bookingForm,
          lang: this.$i18n.locale,
        })
        this.$emit("submited", { status: true })
        this.clearBookingForm()
      }
      catch (error) {
        console.error(error)
      } finally {
        this.requestLoading = false
      }
    },
    requestRejected() {
      this.$emit("submited", { status: false })
    },
  },
  async created() {
    const resCountries = await api.get(`get-countries`)
    this.countries = resCountries.data.countrys
  },

}
</script>

<style lang="scss">
.booking-form {
  textarea::placeholder {
    font-weight: 500 !important;
  }
}
</style>

<style scoped>
.date__picker {
  margin-bottom: 1rem;
}

.inline-input__inner {
  display: flex;
  grid-gap: 1rem;
}

.booking__form-acitons {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 1rem;
}

@media (max-width: 576px) {
  .inline-input__inner {
    display: block;
  }

  .inline-input__inner .last-input {
    margin-bottom: 1rem;
  }

  .m-last__name {
    margin-top: 1rem;
  }
}
</style>
