<script setup>
import { ref, watch, defineProps } from 'vue'
import { storeToRefs } from 'pinia'
import moment from 'moment'
import FormSelect from "@/components/dashboard/shared/FormSelect.vue"
import FormSelectTime from "@/components/dashboard/shared/FormSelectTime.vue"
import FormInput from "@/components/dashboard/shared/FormInput.vue"
import InputControl from "@/components/dashboard/form/InputControl.vue"
import CurrencyControl from "@/components/dashboard/form/CurrencyControl.vue"
// import FormTextarea from "@/components/dashboard/shared/FormTextarea.vue"
import TextControl from '@/components/dashboard/form/TextControl.vue'
import times from "@/static/times.json"
import CalenderControl from "@/components/dashboard/form/CalenderControl.vue"
import { useI18n } from 'vue-i18n'
import { useReservationStore } from '@/stores/reservation'
import { api } from '@/use/useAxios'
import { useValidationStore } from '@/stores/validation'
import { deCurrency } from '@/use/useUtil'
// import Checkbox from '@/components/dashboard/form/CheckBox.vue'
// import { moneyFormat } from '@/main'

const props = defineProps({
  validation: {
    type: Object,
    default: () => { }
  }
})

const validationStore = useValidationStore()
const reserveStore = useReservationStore()
const { t, locale } = useI18n({ useScope: 'global' })
const localeTime = ref(times)

const customers = ref([])
const users = ref([])
const vehicles = ref([])
const pickupLocations = ref([])
const returnLocations = ref([])
const fuelLevels = ref([])
const languges = ref([
  {
    id: "de",
    label: t('language.german')
  },
  {
    id: "en",
    label: t('language.english')
  }
])

const getCustomers = async (keyowrd = "") => {
  try {
    const res = await api.get(
      `/admin/customer/selectsearch?name=${keyowrd}`
    )
    customers.value = res.data
  } catch (err) {
    console.error(err)
  }
}
getCustomers()

// Searching User
const searchingUsers = ref(false)
const getUsers = async (keyowrd = "") => {
  try {
    searchingUsers.value = true
    const data = await api.get(`/admin/users/search?name=${keyowrd}`)
    users.value = data.data
  } catch (err) {
    console.error(err)
  } finally {
    searchingUsers.value = false
  }
}
getUsers()

// Searching Vehicle
const searchingVehicle = ref(false)
const getVehicles = async (keyowrd = "") => {
  try {
    searchingVehicle.value = true
    const res = await api.get(
      `/admin/vehicle/search?name=${keyowrd}`
    )
    vehicles.value = res.data
  } catch (err) {
    console.error(err)
  } finally {
    searchingVehicle.value = false
  }
}
getVehicles()

// Searching Pickup Location
const searchingPickupLocation = ref(false)
const getPickupLocations = async (keyowrd = "") => {
  try {
    searchingPickupLocation.value = true
    const res = await api.get(
      `/admin/location/search/en?name=${keyowrd}`
    )

    pickupLocations.value = res.data
  } catch (err) {
    console.error(err)
  } finally {
    searchingPickupLocation.value = false
  }
}
getPickupLocations()

// Searching Return Location
const searchingReturnLocation = ref(false)
const getReturnLocations = async (keyowrd = "") => {
  try {
    searchingReturnLocation.value = true
    const res = await api.get(
      `/admin/location/search/en?name=${keyowrd}`
    )

    returnLocations.value = res.data
  } catch (err) {
    console.error(err)
  } finally {
    searchingReturnLocation.value = false
  }
}
getReturnLocations()

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

// Parse Time
const parseTime = (s) => {
  let parts = s.split(":")
  let hh = parseInt(parts[0], 10)
  let mm = parseInt(parts[1], 10)

  return { hh, mm }
}

// On Vehicle Select
const onVehicleSelect = async id => {
  const vehicle = vehicles.value.find(v => v.id == id)
  reserveStore.createInfo.day_rate = vehicle.day_rate
  reserveStore.createInfo.week_rate = vehicle.week_rate
  reserveStore.createInfo.month_rate = vehicle.month_rate

  reserveStore.form.per_hour_rate = vehicle[reserveStore.form.rent_option]
  reserveStore.formCurrency.per_hour_rate = deCurrency(vehicle[reserveStore.form.rent_option])

  // reserveStore.form.damages_art = vehicle.art
  // reserveStore.createInfo.artCopy = vehicle.art
  reserveStore.form.damages_content = vehicle.additional_note
  reserveStore.form.vehicleclass_id = vehicle.class_id

  try {
    const artRes = await api.get(`/admin/vehicle/getart/${id}`)
    reserveStore.form.damages_art = artRes.data.artimage
    reserveStore.createInfo.artCopy = artRes.data.artimage
  } catch (error) {
    //
  }
}

// Calculate total Rerntal Price
// Calculate price and set to Global store
const setTotalRentalPrice = () => {
  const rd = reserveStore.form.rent_days
  const rentOption = reserveStore.form.rent_option
  const rate = reserveStore.createInfo[rentOption]

  let price = null
  if (rentOption === 'day_rate') {
    const dayCeil = rd <= 0 ? 1 : Math.ceil(rd)
    price = Number((rate * dayCeil).toFixed(2))
  }
  if (rentOption === 'week_rate') {
    const weekCeil = Math.ceil(rd / 7)
    price = Number((rate * weekCeil).toFixed(2))
  }
  if (rentOption === 'month_rate') {
    const monthCeil = Math.ceil(rd / 30)
    price = Number((rate * monthCeil).toFixed(2))
  }

  // Set data to Global store
  reserveStore.form.total_rental_price = price

  // Set data to fake currency store
  reserveStore.formCurrency.total_rental_price = deCurrency(price)
}


const convertkmIncluded = () => {
  if (isNaN(reserveStore.form.km_included) && /[0-9]{1,3}(?:.[0-9]{3})*(?:,[0-9]+)/.test(reserveStore.form.km_included)) {
    reserveStore.form.km_included = (reserveStore.form.km_included).replace('.', '').replace(',', '.')
    if (locale.value == 'de') {
      reserveStore.form.km_included = Number(reserveStore.form.km_included).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }
    else {
      reserveStore.form.km_included = Number(reserveStore.form.km_included).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }
  }
  else {
    if (locale.value == 'de') {
      const num = Number(reserveStore.form.km_included).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      reserveStore.form.km_included = num
    }
    else {
      const num = Number(reserveStore.form.km_included).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      reserveStore.form.km_included = num
    }
  }
}

// Watch date and time
const { form } = storeToRefs(reserveStore)

watch(() => [form.value.start_date, form.value.start_time, form.value.end_date, form.value.end_time, form.value.vehicle_id], async ([sd, st, ed, et, vId]) => {
  const checkCondition = sd && st && ed && et

  // Calculate duration
  if (checkCondition) {
    const start = moment(new Date(sd).setHours(parseTime(st).hh, parseTime(st).mm))
    const end = moment(new Date(ed).setHours(parseTime(et).hh, parseTime(et).mm))

    // Set Form data to Global store
    reserveStore.form.rental_hours = end.diff(start, 'hours')
    reserveStore.form.rent_days = end.diff(start, 'days') + 1
  }

  if (checkCondition && vId) {
    // Check for Already booked or not
    const payload = {
      vehicle_id: reserveStore.form.vehicle_id,
      start_date: sd,
      start_time: st,
      end_date: ed,
      end_time: et
    }

    validationStore.clearErrors()

    try {
      // Calculate Automatic Total Rental Price
      if (reserveStore.form.calculate_value === 'Automatic') {
        // Calculate price and set to Global store
        setTotalRentalPrice()
      }

      // Check Date and Vehicle avilable
      await api.post(`/admin/reservation/vichlewisedatacheck`, payload)
    } catch (error) {
      console.error(error)
    }
  }


})

</script>

<template>
  <div class="detailsInfo-form">
    <div class="row">
      <div class="col-xl-5 col-lg-6">
        <FormSelect v-model="reserveStore.form.origin_of_customer" class="mb-3" :options="['Walk-in customers', 'Online', 'Phone', 'Recommendation']" :label="t('form-fields.origin-of-customer')" :placeholder="t('form-fields.select-origin-of-customer')" />
        <FormSelect v-model="reserveStore.form.create_by" class="mb-3" :options="users" displayProperty="name" valueProperty="id" search :searching="searchingUsers" :search-placeholder="t('form-fields.search-by-created-by')" no-border @search="getUsers" :label="t('form-fields.created-by')" :placeholder="t('form-fields.select-created-by')" errorField="create_by" :frontError="props.validation" />
        <FormSelect v-model="reserveStore.form.vehicle_id" @update:modelValue="onVehicleSelect" :options="vehicles" class="mb-3" displayProperty="vehicle_name" valueProperty="id" search :searching="searchingVehicle" :search-placeholder="t('form-fields.search-by-vehicle-name')" no-border @search="getVehicles" :label="t('form-fields.vehicle')" :placeholder="t('form-fields.select-vehicle')" errorField="vehicle_id" :frontError="props.validation" />

        <FormSelect v-model="reserveStore.form.pick_up_loaction" :options="pickupLocations" class="mb-3" displayProperty="location_name" valueProperty="id" search :searching="searchingPickupLocation" :search-placeholder="t('form-fields.search-location')" no-border @search="getPickupLocations" :label="t('home-search-form.pick-location')" :placeholder="t('form-fields.location')" errorField="pick_up_loaction" :frontError="props.validation" />
        <FormSelect v-model="reserveStore.form.return_location" :options="returnLocations" class="mb-4" displayProperty="location_name" valueProperty="id" search :searching="searchingReturnLocation" :search-placeholder="t('form-fields.search-location')" no-border @search="getReturnLocations" :label="t('form-fields.return-location')" :placeholder="t('form-fields.location')" errorField="return_location" :frontError="props.validation" />
        <CalenderControl v-model="reserveStore.form.start_date" :minDate="new Date()" :maxDate="reserveStore.form.end_date" :label="t('form-fields.start-date')" :placeholder="t('form-fields.start-date')" class="my-3" labelClasses="label-muted" errorField="start_date" :errors="props.validation" />
        <FormSelectTime v-model="reserveStore.form.start_time" :options="localeTime[locale]" displayProperty="time" valueProperty="24_hour" :label="t('form-fields.start-time')" :placeholder="t('form-fields.start-time')" errorField="start_time" :frontError="props.validation" />
        <CalenderControl v-model="reserveStore.form.end_date" :minDate="reserveStore.form.start_date" :label="t('form-fields.end-date')" :placeholder="t('form-fields.end-date')" class="my-3" labelClasses="label-muted" errorField="end_date" :errors="props.validation" />
        <FormSelectTime v-model="reserveStore.form.end_time" :options="localeTime[locale]" displayProperty="time" valueProperty="24_hour" :label="t('form-fields.end-time')" :placeholder="t('form-fields.end-time')" errorField="end_time" :frontError="props.validation" />
      </div>

      <div class="col-xl-6 col-lg-6 offset-xl-1">
        <FormSelect v-model="reserveStore.form.fuel_level_at_pick_up_id" :options="fuelLevels" class="mb-3" displayProperty="label_name" valueProperty="id" :placeholder="t('form-fields.fuel-level-at-pickup')" :label="t('form-fields.fuel-level-at-pickup')" errorField="fuel_level_at_pick_up_id" :frontError="props.validation" />
        <InputControl v-model="reserveStore.form.km_included" @blur="convertkmIncluded" :placeholder="t('form-fields.km-included')" :label="t('form-fields.km-included')" :hints="t('text.0-for-unlimited')" errorField="km_included" :errors="props.validation" appendIcon="km" class="mb-3" />
        <CurrencyControl v-model.number="reserveStore.form.cost_per_extra_km" v-model:currency="reserveStore.formCurrency.cost_per_extra_km" :placeholder="t('form-fields.cost-per-extra-km')" :label="t('form-fields.cost-per-extra-km')" errorField="cost_per_extra_km" :errors="props.validation" class="mb-3" />
        <!-- <InputControl v-model="reserveStore.form.cost_per_extra_km" @blur="convertkmIncluded" :placeholder="t('form-fields.km-included')" :label="t('form-fields.km-included')" errorField="km_included" :errors="props.validation" appendIcon="km" class="mb-3" /> -->
        <!-- <FormInput v-model="reserveStore.form.cost_per_extra_km" :placeholder="t('form-fields.cost-per-extra-km')" :label="t('form-fields.cost-per-extra-km')" errorField="cost_per_extra_km" :frontError="props.validation" /> -->
        <FormInput v-model="reserveStore.form.km_at_pick_up" type="number" :placeholder="t('form-fields.km-at-pickup')" :label="t('form-fields.km-at-pickup')" errorField="km_at_pick_up" :frontError="props.validation" />
        <FormSelect v-model="reserveStore.form.contact_language" :options="languges" class="mb-3" :placeholder="t('language.select-language')" displayProperty="label" valueProperty="id" :label="t('form-fields.contract-language')" errorField="contact_language" :frontError="props.validation" />
        <TextControl v-model="reserveStore.form.note" :label="t('form-fields.note')" :placeholder="t('form-fields.type-a-note-here')" errorField="note" />

        <!-- <Checkbox v-model="reserveStore.form.non_smoking_agreement" :label="t('form-fields.non-smoking-agreement')" class="mt-3" /> -->

      </div>
    </div>
  </div>
</template>


<style lang="scss" scoped>
</style>
