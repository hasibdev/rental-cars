<script setup>
import { ref, computed, watch, defineProps } from 'vue'
import FormInput from "@/components/dashboard/shared/FormInput.vue"
import SelectControl from "@/components/dashboard/form/SelectControl.vue"
// import InputControl from "@/components/dashboard/form/InputControl.vue"
// import FormSelect from "@/components/dashboard/shared/FormSelect.vue"
import CurrencyControl from "@/components/dashboard/form/CurrencyControl.vue"
import { api } from "@/use/useAxios"
import { useReservationStore } from '@/stores/reservation'
import { useI18n } from 'vue-i18n'
import { deCurrency } from '@/use/useUtil'

const { t } = useI18n({ useScope: 'global' })
const reserveStore = useReservationStore()

const props = defineProps({
  validation: {
    type: Object,
    default: () => { }
  }
})

const paymentMethods = ref([])
const taxRate = ref(0)
const currency = ref('')


const getPaymentMethods = async () => {
  try {
    const data = await api.get(`/paymentmethods`)
    paymentMethods.value = data.data
  } catch (err) {
    console.error(err)
  }
}
getPaymentMethods()

const getGeneralInfo = async () => {
  try {
    const res = await api.get(
      `/admin/general-information`
    )
    taxRate.value = res.data.tax_rates
    currency.value = res.data.store_currency
  } catch (err) {
    console.error(err)
  }
}
getGeneralInfo()

// Watch per hour and summ it pickup free
watch(() => reserveStore.endRental.km_at_return, () => {
  reserveStore.endRental.additional_km = Math.abs((reserveStore.endRental.km_at_return - reserveStore.endRental.km_at_pick_up) - reserveStore.endRental.km_included)
  reserveStore.endRental.charges_for_additional_km = reserveStore.endRental.additional_km * reserveStore.endRental.cost_per_extra_km
})

const getRentalPeriod = computed(() => {
  const days = parseInt(reserveStore.endRental.rental_hours / 24)
  const hours = parseInt(reserveStore.endRental.rental_hours % 24)

  return `${days} ${days > 1 ? `days` : `day`}${hours > 0 ? `, ${hours} hour` : ''}`
})

// Watch per hour and summ it pickup free
watch(() => reserveStore.endRental.per_hour_rate, () => {
  reserveStore.endRental.pick_up_fee = reserveStore.endRental.per_hour_rate * reserveStore.endRental.rental_hours
})

// Total Rental Price
const getTotalRentalPrice = computed(() => {
  const total_rental_price = Number(reserveStore.endRental.per_hour_rate * reserveStore.endRental.rental_hours).toFixed(2)
  return total_rental_price
})

// Get Total without vat
const getTotalWithuotVat = computed(() => {
  const total = (Number(reserveStore.endRental.total_rental_price) + Number(reserveStore.endRental.return_fee) + Number(reserveStore.endRental.refueling_fee) + Number(reserveStore.endRental.pick_up_fee) + Number(reserveStore.endRental.out_of_hours_fee) + Number(reserveStore.endRental.charges_for_extras))
  const discounts = total / 100 * reserveStore.endRental.discount
  return total - discounts
})

// Get Discount without vat
const getDiscountWithuotVat = computed(() => {
  const total = (Number(reserveStore.endRental.total_rental_price) + Number(reserveStore.endRental.return_fee) + Number(reserveStore.endRental.refueling_fee) + Number(reserveStore.endRental.pick_up_fee) + Number(reserveStore.endRental.out_of_hours_fee) + Number(reserveStore.endRental.charges_for_extras))
  const discounts = total / 100 * reserveStore.endRental.discount
  return discounts
})

// Get SubTotal without vat
const getSubTotalWithuotVat = computed(() => {
  const total = (Number(reserveStore.endRental.total_rental_price) + Number(reserveStore.endRental.return_fee) + Number(reserveStore.endRental.refueling_fee) + Number(reserveStore.endRental.pick_up_fee) + Number(reserveStore.endRental.out_of_hours_fee) + Number(reserveStore.endRental.charges_for_extras))
  return total 
})

const getVat = computed(() => {
  const vat = Number(getTotalWithuotVat.value / 100 * taxRate.value).toFixed(2)
  return vat
})

watch(() => getTotalWithuotVat.value, () => {
  reserveStore.endRental.total_without_vat = Number(getTotalWithuotVat.value).toFixed(2)
})

watch(() => getSubTotalWithuotVat.value, () => {
  reserveStore.endRental.subtotal = Number(getSubTotalWithuotVat.value).toFixed(2)
})

watch(() => getDiscountWithuotVat.value, () => {
  reserveStore.endRental.total_without_vat = Number(getDiscountWithuotVat.value).toFixed(2)
})

const getTotalWithVat = computed(() => {
  const vatAmount = parseInt(getTotalWithuotVat.value) / 100 * taxRate.value
  return Number(getTotalWithuotVat.value + vatAmount).toFixed(2)
})

// watch(() => reserveStore.endRental.return_fee, reserveStore.endRental.refueling_fee, reserveStore.endRental.others_costs, reserveStore.endRental.charges_for_extras, () => {
//   reserveStore.endRental.total_amount_paid = Number(reserveStore.endRental.return_fee).toFixed(2) + Number(reserveStore.endRental.refueling_fee).toFixed(2) + Number(reserveStore.endRental.others_costs).toFixed(2) + Number(reserveStore.endRental.charges_for_extras).toFixed(2)
// })


watch(() => getTotalWithVat.value, () => {
  reserveStore.form.to_pay = Number(getTotalWithVat.value - reserveStore.endRental.total_amount_paid).toFixed(2)
  reserveStore.endRental.vat_amount = Number(Number(getTotalWithVat.value) * taxRate.value / 100).toFixed(2)
})

</script>

<template>
  <div class="row">
    <div class="col-md-5">
      <!-- <FormInput v-model.number="reserveStore.endRental.per_hour_rate" type="number" :placeholder="`00.00 ${currency}`" label="Rental Price Per Hour" errorField="per_hour_rate" /> -->
      <FormInput disabled :modelValue="getRentalPeriod" :placeholder="t('form-fields.rental-period')" :label="t('form-fields.rental-period')" errorField="rental_hours" />
      <FormInput disabled :modelValue="deCurrency(getTotalRentalPrice)" :placeholder="t('form-fields.total-rental-price')" :label="t('form-fields.total-rental-price')" errorField="total_rental_price" />
      <!-- <CurrencyControl disabled v-model.number="reserveStore.endRental.total_rental_price"  v-model:currency="reserveStore.endRentalCurrency.total_rental_price" :placeholder="t('form-fields.total-rental-price')" :label="t('form-fields.total-rental-price')" errorField="total_rental_price" class="mb-3" /> -->
      <CurrencyControl v-model.number="reserveStore.endRental.return_fee" v-model:currency="reserveStore.endRentalCurrency.return_fee" :placeholder="t('form-fields.return-fee')" :label="t('form-fields.return-fee')" errorField="return_fee" class="mb-3" />
      <CurrencyControl v-model.number="reserveStore.endRental.refueling_fee" v-model:currency="reserveStore.endRentalCurrency.refueling_fee" :placeholder="t('form-fields.refueling-fee')" :label="t('form-fields.refueling-fee')" errorField="refueling_fee" class="mb-3" />
      <CurrencyControl v-model.number="reserveStore.endRental.pick_up_fee" v-model:currency="reserveStore.endRentalCurrency.pick_up_fee" :placeholder="t('form-fields.pickup-fee')" :label="t('form-fields.pickup-fee')" errorField="pick_up_fee" class="mb-3" />
      <CurrencyControl v-model.number="reserveStore.endRental.out_of_hours_fee" v-model:currency="reserveStore.endRentalCurrency.out_of_hours_fee" :placeholder="t('form-fields.out-of-hours-fee')" :label="t('form-fields.out-of-hours-fee')" errorField="out_of_hours_fee" :errors="props.validation" class="mb-3" />
      <CurrencyControl v-model.number="reserveStore.endRental.others_costs" v-model:currency="reserveStore.endRentalCurrency.others_costs" :placeholder="t('form-fields.other-costs')" :label="t('form-fields.other-costs')" errorField="others_costs" class="mb-3 d-none" />
      <CurrencyControl v-model.number="reserveStore.endRental.charges_for_extras" v-model:currency="reserveStore.endRentalCurrency.charges_for_extras" :placeholder="t('form-fields.charges-for-extras')" :label="t('form-fields.charges-for-extras')" errorField="charges_for_extras" class="mb-3" />
      <FormInput disabled v-model.number="reserveStore.endRental.discount" :placeholder="`00.00 ${currency}`" :label="t('form-fields.discount')" errorField="discount" class="d-none" />
      <CurrencyControl disabled v-model.number="reserveStore.endRental.charges_for_additional_km" v-model:currency="reserveStore.endRentalCurrency.charges_for_additional_km" :placeholder="t('form-fields.charges-for-additional-km')" :label="t('form-fields.charges-for-additional-km')" errorField="charges_for_additional_km" class="mb-3 d-none" />
      <!-- <FormInput v-model="reserveStore.endRental.return_fee" :placeholder="`00.00 ${currency}`" :label="t('form-fields.return-fee')" errorField="return_fee" /> -->
      <!-- <FormInput v-model="reserveStore.endRental.refueling_fee" :placeholder="`00.00 ${currency}`" :label="t('form-fields.refueling-fee')" errorField="refueling_fee" /> -->
      <!-- <FormInput v-model.number="reserveStore.endRental.out_of_hours_fee" :placeholder="`00.00 ${currency}`" label="Out-of-Hours Fee" errorField="out_of_hours_fee" /> -->
      <!-- <FormInput v-model.number="reserveStore.endRental.others_costs" :placeholder="`00.00 ${currency}`" :label="t('form-fields.other-costs')" errorField="others_costs" /> -->
      <!-- <FormInput v-model.number="reserveStore.endRental.charges_for_extras" :placeholder="`00.00 ${currency}`" :label="t('form-fields.charges-for-extras')" errorField="charges_for_extras" /> -->
      <!-- <FormInput disabled v-model.number="reserveStore.endRental.discount" :placeholder="`00.00 ${currency}`" :label="t('form-fields.discount')" errorField="discount" /> -->
      <!-- <FormInput disabled v-model="reserveStore.endRental.charges_for_additional_km" :placeholder="`00.00 ${currency}`" :label="t('form-fields.charges-for-additional-km')" errorField="charges_for_additional_km" /> -->

      <FormInput disabled :modelValue="deCurrency(getVat)" :placeholder="`00.00 ${currency}`" :label="`${t('form-fields.vat')} (${taxRate}%)`" errorField="vat_amount" class="d-none" />
      <FormInput disabled :modelValue="deCurrency(getTotalWithVat)" :placeholder="t('form-fields.total-without-vat')" :label="t('form-fields.total-without-vat')" errorField="total_without_vat" class="d-none" />
      <FormInput disabled :modelValue="deCurrency(reserveStore.endRental.total_amount_paid)" :placeholder="`0 €`" :label="t('form-fields.total-amount-paid')" errorField="total_amount_paid" class="d-none" />
      <FormInput disabled :modelValue="deCurrency(reserveStore.endRental.to_pay)" :placeholder="`00.00 ${currency}`" :label="t('form-fields.to-pay')" errorField="to_pay" class="d-none" />
      <!-- <FormSelect disabled v-model="reserveStore.endRental.payment_method" :options="paymentMethods" displayProperty="name" valueProperty="id" label="Payment Method" placeholder="Payment Method" errorField="payment_method" /> -->
      <SelectControl disabled v-model="reserveStore.endRental.payment_method" :options="paymentMethods" optionLabel="name" track="id" :label="t('form-fields.payment-method')" :placeholder="t('form-fields.payment-method')" errorField="payment_method"></SelectControl>
    </div>

    <div class="offset-md-2 col-md-5">
      <CurrencyControl disabled v-model.number="reserveStore.endRental.deposit" v-model:currency="reserveStore.endRentalCurrency.deposit" :placeholder="t('form-fields.deposit')" :label="t('form-fields.deposit')" errorField="deposit" class="mb-3" />
      <!-- <FormInput disabled v-model="reserveStore.endRental.deposit" type="number" :placeholder="`e.g. 20 ${currency}`" :label="t('form-fields.deposit')" errorField="deposit" /> -->
      <SelectControl disabled v-model="reserveStore.endRental.payment_method_for_deposit" :options="paymentMethods" optionLabel="name" track="id" :label="t('form-fields.payment-method')" :placeholder="t('form-fields.payment-method')" errorField="payment_method_for_deposit" class="mb-3"></SelectControl>
      <!-- <FormSelect disabled v-model="reserveStore.endRental.payment_method_for_deposit" :options="paymentMethods" displayProperty="name" valueProperty="id" label="Payment Method for Deposit" placeholder="Payment Method for Deposit" errorField="payment_method_for_deposit" /> -->
      <FormInput disabled v-model="reserveStore.endRental.preauthorization_code" type="number" placeholder="e.g. 958763" :label="t('form-fields.preauthorization-code')" errorField="preauthorization_code" />
      <!-- <FormInput disabled v-model="reserveStore.endRental.deductible_fire_theft" type="number" :placeholder="`e.g. 456 ${currency}`" :label="t('form-fields.deductible-fire/theft')" errorField="deductible_fire_theft" /> -->
      <!-- <FormInput disabled v-model="reserveStore.endRental.deductible_damage" type="number" :placeholder="`e.g. 50 ${currency}`" :label="t('form-fields.deductible-damage')" errorField="deductible_damage" /> -->
      <!-- <FormInput disabled v-model="reserveStore.endRental.deductible_liability" type="number" placeholder="Deductible Liability" label="Deductible Liability" errorField="deductible_liability" /> -->
      <!-- <FormInput v-model="reserveStore.endRental.withheld_deductible" type="number" :placeholder="`e.g. 20 ${currency}`" :label="t('form-fields.deductible-liability')" errorField="withheld_deductible" /> -->

      <CurrencyControl disabled v-model.number="reserveStore.endRental.deductible_fire_theft" v-model:currency="reserveStore.endRentalCurrency.deductible_fire_theft" :placeholder="t('form-fields.deductible-fire/theft')" :label="t('form-fields.deductible-fire/theft')" errorField="deductible_fire_theft" class="mb-3" />
      <CurrencyControl disabled v-model.number="reserveStore.endRental.deductible_damage" v-model:currency="reserveStore.endRentalCurrency.deductible_damage" :placeholder="t('form-fields.deductible-damage')" :label="t('form-fields.deductible-damage')" errorField="deductible_damage" class="mb-3" />
      <CurrencyControl disabled v-model.number="reserveStore.endRental.deductible_liability" v-model:currency="reserveStore.endRentalCurrency.deductible_liability" :placeholder="t('form-fields.deductible-liability')" :label="t('form-fields.deductible-liability')" errorField="deductible_liability" class="mb-3" />
      <CurrencyControl v-model.number="reserveStore.endRental.withheld_deductible" v-model:currency="reserveStore.endRentalCurrency.withheld_deductible" :placeholder="t('form-fields.withheld-deductible')" :label="t('form-fields.withheld-deductible')" errorField="withheld_deductible" class="mb-3 d-none" />

      <div class="total-calculation-div my-5 mx-auto p-4">
        <div class="text-18 fw-700 mb-4">{{t('dashboard-reservation.billing-amount')}}</div>
        <div class="calculation-div">
          <div class="d-flex align-items-center item">
            <div class="col-md-6 ps-5 d-flex align-items-center">
              <span class="me-3">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g opacity="0.32" clip-path="url(#clip0_5678_2101)">
                  <path d="M13.9993 2.66699H1.99935C1.26297 2.66699 0.666016 3.26395 0.666016 4.00033V12.0003C0.666016 12.7367 1.26297 13.3337 1.99935 13.3337H13.9993C14.7357 13.3337 15.3327 12.7367 15.3327 12.0003V4.00033C15.3327 3.26395 14.7357 2.66699 13.9993 2.66699Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M0.666016 6.66699H15.3327" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </g>
                  <defs>
                  <clipPath id="clip0_5678_2101">
                  <rect width="16" height="16" fill="white"/>
                  </clipPath>
                  </defs>
                </svg>
              </span>
              <span class="text text-14 fw-400">{{t('form-fields.subtotal')}}</span>
            </div>
            <div class="col-md-6 text-16 fw-500 ps-4">{{deCurrency(getSubTotalWithuotVat)}}</div>
          </div>
          <div class="d-flex align-items-center item">
            <div class="col-md-6 ps-5 d-flex align-items-center">
              <span class="me-3">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g opacity="0.32">
                  <g clip-path="url(#clip0_5678_2090)">
                  <path d="M13.0402 2.2395H2.95983C2.16451 2.2395 1.51978 2.88424 1.51978 3.67956V13.76C1.51978 14.5553 2.16451 15.2 2.95983 15.2H13.0402C13.8355 15.2 14.4803 14.5553 14.4803 13.76V3.67956C14.4803 2.88424 13.8355 2.2395 13.0402 2.2395Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M10.8811 0.800003V3.68012" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M5.11938 0.800003V3.68012" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M1.51978 6.55966H14.4803" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </g>
                  </g>
                  <defs>
                  <clipPath id="clip0_5678_2090">
                  <rect width="16" height="16" fill="white"/>
                  </clipPath>
                  </defs>
                </svg>
              </span>
              <span class="text text-14 fw-400">{{t('form-fields.discount')}}</span>
            </div>
            <div class="col-md-6 text-16 fw-500 ps-4">{{deCurrency(getDiscountWithuotVat)}}</div>
          </div>
          <div class="d-flex align-items-center item">
            <div class="col-md-6 ps-5 d-flex align-items-center">
              <span class="me-3">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g opacity="0.32" clip-path="url(#clip0_5678_2107)">
                  <path d="M10.8438 9.4375C11.1022 9.4375 11.3125 9.64497 11.3125 9.9H12.25C12.25 9.29162 11.8581 8.77291 11.3125 8.58028V7.5625H10.375V8.58062C9.82941 8.77412 9.4375 9.29516 9.4375 9.90625C9.4375 10.6817 10.0683 11.3125 10.8438 11.3125C11.1022 11.3125 11.3125 11.5228 11.3125 11.7813C11.3125 12.0397 11.1022 12.25 10.8438 12.25C10.5853 12.25 10.375 12.0397 10.375 11.7813H9.4375C9.4375 12.3923 9.82941 12.9134 10.375 13.1069V14.1188H11.3125V13.1069C11.8581 12.9134 12.25 12.3923 12.25 11.7813C12.25 11.0058 11.6192 10.375 10.8438 10.375C10.5853 10.375 10.375 10.1647 10.375 9.90625C10.375 9.64778 10.5853 9.4375 10.8438 9.4375Z" fill="black"/>
                  <path d="M10.8438 5.6875C10.6857 5.6875 10.5294 5.69506 10.375 5.70903V2.8125C10.375 1.99966 9.79537 1.26219 8.74294 0.735969C7.79375 0.261375 6.54219 0 5.21875 0C3.89262 0 2.63103 0.260844 1.66634 0.734438C0.591813 1.26203 0 2 0 2.8125V11.3125C0 12.125 0.591813 12.863 1.66634 13.3906C2.63103 13.8642 3.89262 14.125 5.21875 14.125C5.75028 14.125 6.27022 14.0826 6.76922 13.9999C7.71331 15.2159 9.18859 16 10.8438 16C13.6869 16 16 13.6869 16 10.8438C16 8.00059 13.6869 5.6875 10.8438 5.6875ZM2.07953 1.576C2.906 1.17022 4.05019 0.9375 5.21875 0.9375C7.70494 0.9375 9.4375 1.92566 9.4375 2.8125C9.4375 3.69934 7.70494 4.6875 5.21875 4.6875C4.05019 4.6875 2.906 4.45478 2.07953 4.049C1.35375 3.69269 0.9375 3.242 0.9375 2.8125C0.9375 2.383 1.35375 1.93231 2.07953 1.576ZM0.9375 4.44578C1.14762 4.60631 1.391 4.75537 1.66634 4.89056C2.63103 5.36416 3.89262 5.625 5.21875 5.625C6.54219 5.625 7.79375 5.36363 8.74294 4.88903C9.00416 4.75841 9.23616 4.61478 9.4375 4.46022V5.88241C8.50325 6.14756 7.67628 6.67019 7.03819 7.36828C6.46706 7.49713 5.85581 7.5625 5.21875 7.5625C4.05019 7.5625 2.906 7.32978 2.07953 6.924C1.35375 6.56769 0.9375 6.117 0.9375 5.6875V4.44578ZM0.9375 7.32078C1.14762 7.48131 1.391 7.63037 1.66634 7.76556C2.63103 8.23916 3.89262 8.5 5.21875 8.5C5.58066 8.5 5.93569 8.48059 6.28191 8.44253C5.97391 9.02534 5.77434 9.67381 5.71025 10.3611C5.54741 10.3701 5.38322 10.375 5.21875 10.375C4.05019 10.375 2.906 10.1423 2.07953 9.7365C1.35375 9.38019 0.9375 8.9295 0.9375 8.5V7.32078ZM5.21875 13.1875C4.05019 13.1875 2.906 12.9548 2.07953 12.549C1.35375 12.1927 0.9375 11.742 0.9375 11.3125V10.1333C1.14762 10.2938 1.391 10.4428 1.66634 10.578C2.63103 11.0517 3.89262 11.3125 5.21875 11.3125C5.38219 11.3125 5.54559 11.3084 5.70794 11.3004C5.76544 11.9525 5.94478 12.5701 6.22312 13.1303C5.89625 13.168 5.56053 13.1875 5.21875 13.1875ZM10.8438 15.0625C8.51753 15.0625 6.625 13.17 6.625 10.8438C6.625 8.51753 8.51753 6.625 10.8438 6.625C13.17 6.625 15.0625 8.51753 15.0625 10.8438C15.0625 13.17 13.17 15.0625 10.8438 15.0625Z" fill="black"/>
                  </g>
                  <defs>
                  <clipPath id="clip0_5678_2107">
                  <rect width="16" height="16" fill="white"/>
                  </clipPath>
                  </defs>
                </svg>
              </span>
              <span class="text text-14 fw-400">{{t('form-fields.tax')}} ({{taxRate}}%)</span>
            </div>
            <div class="col-md-6 text-16 fw-500 ps-4">{{deCurrency(getVat)}}</div>
          </div>
          <div class="d-flex align-items-center item">
            <div class="col-md-6 ps-5 d-flex align-items-center">
              <span class="me-3">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_5678_2586)">
                  <path d="M5.99664 10.3202C5.72339 10.0469 5.50874 9.73704 5.35221 9.40623H8.94183V8.46873H5.07055C5.02605 8.15798 5.02605 7.84198 5.07055 7.53123H9.87936V6.59373H5.35224C5.50877 6.26291 5.72343 5.95301 5.99668 5.67976C7.27605 4.40041 9.35774 4.40045 10.6371 5.67979L11.3 5.01688C9.65511 3.37198 6.97864 3.37198 5.3338 5.01688C4.87383 5.47685 4.54258 6.01754 4.33986 6.59373H3.31689V7.53123H4.1263C4.09177 7.8427 4.09177 8.15726 4.1263 8.46873H3.31689V9.40623H4.33986C4.54258 9.98241 4.87383 10.5231 5.3338 10.9831C6.13058 11.7799 7.18999 12.2188 8.31686 12.2188C9.44374 12.2188 10.5031 11.7799 11.3 10.9831L10.6371 10.3202C9.35774 11.5995 7.27605 11.5996 5.99664 10.3202Z" fill="#B2B2B2"/>
                  <path d="M8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0ZM8 15.0625C4.0995 15.0625 0.9375 11.9005 0.9375 8C0.9375 4.0995 4.0995 0.9375 8 0.9375C11.9005 0.9375 15.0625 4.0995 15.0625 8C15.0625 11.9005 11.9005 15.0625 8 15.0625Z" fill="#B2B2B2"/>
                  </g>
                  <defs>
                  <clipPath id="clip0_5678_2586">
                  <rect width="16" height="16" fill="white"/>
                  </clipPath>
                  </defs>
                </svg>
              </span>
              <span class="text text-14 fw-400">{{t('form-fields.total-amount-paid')}} </span>
            </div>
            <div class="col-md-6 text-16 fw-500 ps-4">{{deCurrency(reserveStore.endRental.total_amount_paid)}}</div>
          </div> 
        </div>
        <div class="grand-total-div d-flex align-items-center mt-3">
          <div class="col-md-6 text-label text-right text-14 fw-500 pe-3">{{t('form-fields.grand-total')}}</div>
          <div class="col-md-6 text-28 text-amount fw-700 ps-3">{{deCurrency(reserveStore.endRental.to_pay)}}</div>
        </div>
      </div>

    </div>
  </div>
</template>

<style lang="scss" scoped>
.total-calculation-div{
  width: 427px;
  border: 1px solid #DDDDDD;
  border-radius: 4px;
  .calculation-div{
    width: 379px;
    background: #FFFFFF;
    border: 1px solid #EEEEEE;
    box-shadow: 0px 2px 16px rgba(0, 0, 0, 0.12);
    border-radius: 4px;
    .item{
      padding: 16px; 
      .text{
        color: rgba(0, 0, 0, 0.8); 
      }
    }
    .item:not(:last-child){
      border-bottom: 1px solid #EEEEEE;
    }
    
  }
  .grand-total-div{
    .text-label{
      color: rgba(0, 0, 0, 0.6);
    }
    .text-28{
      font-size: 28px; 
    }
  }
}
</style>
