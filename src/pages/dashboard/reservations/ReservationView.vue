<template>

  <!-- Customer Info -->
  <div class="reservation-view-card dashboard-container">
    <div class="row">
      <div class="col-lg-2">
        <h2 class="reservation-view-card__title">{{$t('dashboard-reservation.customer-info')}}</h2>
      </div>
      <div class="col-lg-8">
        <UserCard :user="customerInfo" />
      </div>
    </div>
  </div>
  <!-- Details -->
  <div class="reservation-view-card dashboard-container">
    <div class="row">
      <div class="col-lg-2">
        <h2 class="reservation-view-card__title">{{$t('dashboard-reservation.details')}}</h2>
      </div>
      <div class="col-lg-8">
        <DetailsCard :card-data="reservationDetails" :currency="currency" />
      </div>
    </div>
  </div>
  <!-- Driver -->
  <div class="reservation-view-card dashboard-container">
    <div class="row">
      <div class="col-lg-2">
        <h2 class="reservation-view-card__title">{{$t('dashboard-reservation.driver')}}</h2>
      </div>
      <div class="col-lg-8">
        <template v-for="driver in drivers" :key="driver">
          <DriverCard :driver="driver" />
        </template>
      </div>
    </div>
  </div>
  <!-- Damages and photos -->
  <div class="reservation-view-card dashboard-container">
    <div class="row">
      <div class="col-lg-2">
        <h2 class="reservation-view-card__title">{{$t('form-fields.customer-info')}}</h2>
      </div>
      <div class="col-lg-8">
        <DamagesViewCard :card-data="reservationDetails" />
      </div>
    </div>
    <div class="row">
      <div class="col-lg-2">
        <h2 class="reservation-view-card__title">{{$t('form-fields.photos')}}</h2>
      </div>
      <div class="col-lg-8">
        <Gellary :card-data="photos" />
      </div>
    </div>
  </div>
  <!-- Rates -->
  <div class="reservation-view-card dashboard-container">
    <div class="row">
      <div class="col-lg-2">
        <h2 class="reservation-view-card__title">{{$t('form-fields.rates')}}</h2>
      </div>
      <div class="col-lg-8">
        <RatesView :card-data="reservationDetails" :currency="currency" />
      </div>
    </div>
  </div>
  <FormActionButtons style="min-width: 180px;" buttonTextLeft="Back" buttonTextMid="Edit" buttonTextRight="Start Rental"
    midButton outlined @submit="submitHandler" />

</template>

<script>

import UserCard from "../../../components/dashboard/reservations/components/UserCard.vue"
import DetailsCard from "../../../components/dashboard/reservations/components/DetailsCard.vue"
import DriverCard from "../../../components/dashboard/reservations/components/DriverCard.vue"
import DamagesViewCard from "../../../components/dashboard/reservations/components/DamagesViewCard.vue"
import Gellary from "../../../components/dashboard/reservations/components/Gellary.vue"
import RatesView from "../../../components/dashboard/reservations/components/RatesView.vue"
import FormActionButtons from "../../../components/dashboard/shared/FormActionButtons.vue"
import http from "@/helpers/http"
export default {
  components: {
    UserCard,
    DetailsCard,
    DriverCard,
    DamagesViewCard,
    Gellary,
    RatesView,
    FormActionButtons,
  },
  name: "ReservationView",

  data() {
    return {
      customerInfo: null,
      reservationDetails: null,
      drivers: [],
      photos: [],
      currency: "",
    }
  },
  created() {
    this.getReservation()
    this.getGeneralInfo()
  },
  methods: {
    async getReservation() {
      try {
        const { reservation, handoverphoto, customerinfo, drivers } =
          await http.get(
            `/admin/reservation/view/${this.$route.params.id}`
          )

        this.reservationDetails = reservation
        this.customerInfo = customerinfo
        this.drivers = drivers
        this.photos = handoverphoto
      } catch (err) {
        console.error(err)
      }
    },

    async getGeneralInfo() {
      try {
        const { store_currency } = await http.get(
          `/admin/general-information`
        )
        this.currency = store_currency
      } catch (err) {
        console.error(err)
      }
    },

    submitHandler(event) {
      if (event === "next") {
        // this.sendForRent();
      } else if (event === "middle") {
        // edit url
        this.$router.push(
          `/reservierungen/aktualisieren/${this.$route.params.id}`
        )
      } else {
        this.$router.push(`/reservierungen`)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.reservation-view-card {
  padding: 2rem;
  margin-bottom: 2rem;

  &__title {
    font-size: 1.3rem;
    font-weight: 500;
    text-transform: capitalize;
    color: var(--color-heading);
    margin-bottom: 1.5rem;
  }
}
</style>
