<script setup>
import { ref, watch, defineProps } from 'vue'
// import { storeToRefs } from 'pinia'
import moment from 'moment'
import SelectControl from "@/components/dashboard/form/SelectControl.vue"
import FormSelect from "@/components/dashboard/shared/FormSelect.vue"
import FormSelectTime from "@/components/dashboard/shared/FormSelectTime.vue"
import FormInput from "@/components/dashboard/shared/FormInput.vue"
import CalenderControl from "@/components/dashboard/form/CalenderControl.vue"
import CurrencyControl from "@/components/dashboard/form/CurrencyControl.vue"
// import FormDate from "@/components/dashboard/shared/FormDate.vue"
import FormTextarea from "@/components/dashboard/shared/FormTextarea.vue"
// import http from "@/helpers/http"
import times from "@/static/times.json"
import { useI18n } from 'vue-i18n'
import { useReservationStore } from '@/stores/reservation'
import { api } from '@/use/useAxios'

const reserveStore = useReservationStore()
const { t } = useI18n({ useScope: 'global' })
const localeTime = ref(times)

const props = defineProps({
  validation: {
    type: Object,
    default: () => { }
  }
})

// const customers = ref([])
const users = ref([])
const vehicles = ref([])
const locations = ref([])
const fuelLevels = ref([])
// const languges = ref(["German", "English"])

// const getCustomers = async (keyowrd = "") => {
//   try {
//     const data = await http.get(
//       `/admin/customer/selectsearch?name=${keyowrd}`
//     )
//     customers.value = data
//   } catch (err) {
//     console.error(err)
//   }
// }
// getCustomers()

const getUsers = async (keyowrd = "") => {
  try {
    const data = await api.get(`/admin/users/search?name=${keyowrd}`)
    users.value = data.data
  } catch (err) {
    console.error(err)
  }
}
getUsers()

// const getVehicles = async (keyowrd = "") => {
//   try {
//     const data = await http.get(
//       `/admin/vehicle/search?name=${keyowrd}`
//     )
//     vehicles.value = data
//   } catch (err) {
//     console.error(err)
//   }
// }
// getVehicles()


const getVehicles = async (keyowrd = "") => {
  try {
    const res = await api.get(
      `/admin/vehicle/search?name=${keyowrd}`
    )
    vehicles.value = res.data
  } catch (err) {
    console.error(err)
  } 
}
getVehicles()

const getLocations = async (keyowrd = "") => {
  try {
    const data = await api.get(
      `/admin/location/search/en?name=${keyowrd}`
    )

    locations.value = data.data
  } catch (err) {
    console.error(err)
  }
}
getLocations()

// Get fuel lavels
const getFuelLevels = async (keyowrd = "") => {
  try {
    const res = await api.get(
      `/admin/fuel-lavel/search?name=${keyowrd}`
    )
    fuelLevels.value = res.data
  } catch (err) {
    console.error(err)
  }
}
getFuelLevels()


const parseTime = (s) => {
  let parts = s.split(":")
  let hh = parseInt(parts[0], 10)
  let mm = parseInt(parts[1], 10)

  return { hh, mm }
}
// Watch Additional KM

// Watch date and time
// const { form } = storeToRefs(reserveStore)


watch(() => [reserveStore.endRental.actual_end_date, reserveStore.endRental.actual_end_time], ([ed, et]) => {
  if (ed && et) {

    const start = moment(new Date(reserveStore.endRental.start_date).setHours(parseTime(reserveStore.endRental.start_time).hh, parseTime(reserveStore.endRental.start_time).mm))
    const end = moment(new Date(ed).setHours(parseTime(et).hh, parseTime(et).mm))

    reserveStore.endRental.rental_hours = end.diff(start, 'hours')
    reserveStore.endRental.total_rental_price = (reserveStore.endRental.rental_hours * reserveStore.endRental.per_hour_rate)

    if (reserveStore.endRental.per_hour_rate) {
      reserveStore.endRental.pick_up_fee = Number(reserveStore.endRental.rental_hours * reserveStore.endRental.per_hour_rate).toFixed(2)
    }
  }
})


watch(() => reserveStore.endRental.closed_by, () => {
  reserveStore.endRental.closed_by_name = users.value?.find((user) => user.id == reserveStore.endRental.closed_by).name
})

</script>

<template>
  <div class="detailsInfo-form">
    <div class="row">
      <div class="col-xl-5 col-lg-6">
        <SelectControl v-model="reserveStore.endRental.vehicle_id" :options="vehicles" optionLabel="vehicle_name" track="id" :label="t('form-fields.vehicle')" errorField="vehicle_id" disabled class="mb-3"></SelectControl>
        <FormSelect v-model="reserveStore.endRental.closed_by" :options="users" displayProperty="name" valueProperty="id" search :search-placeholder="t('form-fields.search-by-created-by')" no-border @search="getUsers" :label="t('form-fields.closed-by')" placeholder="Select Closed By" errorField="closed_by" :frontError="props.validation"  />

        <SelectControl v-model="reserveStore.endRental.return_location" :options="locations" optionLabel="location_name" track="id" :label="t('form-fields.return-location')" :placeholder="t('form-fields.location')" errorField="vehicle_id" disabled class="mb-3 mt-3"></SelectControl>
        <FormSelect v-model="reserveStore.endRental.actual_return_location" :options="locations" displayProperty="location_name" valueProperty="id" search :search-placeholder="t('form-fields.search-location')" no-border @search="getLocations" :label="t('form-fields.actual-return-location')" :placeholder="t('form-fields.location')" class="mb-3" errorField="actual_return_location"  />

        <CalenderControl v-model="reserveStore.endRental.end_date" :label="t('form-fields.end-date')" :placeholder="t('form-fields.end-date')" errorField="end_date" class="mb-3" disabled />
        <SelectControl disabled v-model="reserveStore.endRental.end_time" :options="localeTime[$i18n.locale]" optionLabel="time" trackBy="24_hour" :label="t('form-fields.end-time')" :placeholder="t('form-fields.end-time')" errorField="end_time" caret="clock" class="mb-3" />
        <!-- <FormSelectTime disabled v-model="reserveStore.endRental.end_time" :options="localeTime[$i18n.locale]" displayProperty="time" valueProperty="24_hour" :label="t('form-fields.end-time')" :placeholder="t('form-fields.end-time')" errorField="end_time" /> -->
        <CalenderControl v-model="reserveStore.endRental.actual_end_date" :minDate="reserveStore.endRental.start_date" :label="t('form-fields.actual-end-date')" :placeholder="t('form-fields.actual-end-date')" errorField="actual_end_date" class="mb-3" :frontError="props.validation"  />
        <FormSelectTime  v-model="reserveStore.endRental.actual_end_time" :options="localeTime[$i18n.locale]" displayProperty="time" valueProperty="24_hour" :label="t('form-fields.actual-end-time')" :placeholder="t('form-fields.end-time')" errorField="actual_end_time" class="timeSelect" :frontError="props.validation"  />
      </div>

      <div class="col-xl-5 col-lg-6 offset-xl-2">
        <SelectControl v-model="reserveStore.endRental.fuel_level_at_pick_up_id" :options="fuelLevels" optionLabel="label_name" track="id" :placeholder="t('form-fields.fuel-level-at-pickup')" :label="t('form-fields.fuel-level-at-pickup')" errorField="fuel_level_at_pick_up_id" disabled class="mb-3"  ></SelectControl>
        <FormSelect v-model="reserveStore.endRental.fuel_level_at_return" :options="fuelLevels" displayProperty="label_name" valueProperty="id" :placeholder="t('form-fields.fuel-level-at-return')" :label="t('form-fields.fuel-level-at-return')" errorField="fuel_level_at_return" :frontError="props.validation" />
        <FormInput class="mt-3" v-model="reserveStore.endRental.km_included" :placeholder="t('form-fields.km-included')" :label="t('form-fields.km-included')" errorField="km_included" disabled />
        <CurrencyControl v-model="reserveStore.endRental.cost_per_extra_km" v-model:currency="reserveStore.endRentalCurrency.cost_per_extra_km" :placeholder="t('form-fields.cost-per-extra-km')" :label="t('form-fields.cost-per-extra-km')" errorField="cost_per_extra_km" class="mb-3" disabled/>
        <!-- <FormInput v-model="reserveStore.endRental.cost_per_extra_km" :placeholder="t('form-fields.cost-per-extra-km')" :label="t('form-fields.cost-per-extra-km')" errorField="cost_per_extra_km" disabled /> -->
        <FormInput v-model="reserveStore.endRental.km_at_pick_up" :placeholder="t('form-fields.km-at-pickup')" :label="t('form-fields.km-at-pickup')" errorField="km_at_pick_up" disabled />
        <FormInput v-model="reserveStore.endRental.km_at_return" :placeholder="t('form-fields.km-at-return')" :label="t('form-fields.km-at-return')" errorField="km_at_return" :frontError="props.validation" />
        <FormTextarea v-model="reserveStore.endRental.note" :placeholder="t('form-fields.type-a-note-here')" :label="t('form-fields.note')" errorField="note" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.detailsInfo-form {
  .label {
    color: #666 !important;
    font-weight: 400;
    opacity: 0.8 !important;
  }
}
</style>
