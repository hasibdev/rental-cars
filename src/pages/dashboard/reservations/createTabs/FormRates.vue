<script setup>
import { ref, computed, defineProps, watch } from 'vue'
import InputControl from "@/components/dashboard/form/InputControl.vue"
import CurrencyControl from "@/components/dashboard/form/CurrencyControl.vue"
import FormSelect from "@/components/dashboard/shared/FormSelect.vue"
import RadioControl from '@/components/dashboard/form/RadioControl.vue'
import { api } from "@/use/useAxios"
import { useReservationStore } from '@/stores/reservation'
import { useI18n } from 'vue-i18n'
import { deCurrency } from '@/use/useUtil'

const { t } = useI18n({ useScope: 'global' })
const props = defineProps({
  validation: {
    type: Object,
    default: () => { }
  }
})

const reserveStore = useReservationStore()

const paymentMethods = ref([])
const taxRate = ref(0)

const currency = ref('')

const getPaymentMethods = async () => {
  try {
    const res = await api.get(`/paymentmethods`)
    paymentMethods.value = res.data
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
    reserveStore.form.vat_rate = res.data.tax_rates
    reserveStore.form.calculate_value = "Automatic"
  } catch (err) {
    console.error(err)
  }
}
getGeneralInfo()

const getRentalPeriod = computed(() => {
  // let days = parseInt(reserveStore.form.rental_hours / 24)
  // let hours = parseInt(reserveStore.form.rental_hours % 24)

  const rd = reserveStore.form.rent_days
  // Month
  if (rd >= 30) {
    let mm = parseInt(rd / 30)
    let dd = parseInt(rd % 30)
    return `${mm} ${mm > 1 ? t('form-fields.months') : t('form-fields.month')}${dd > 0 ? `, ${dd} ${dd > 1 ? t('form-fields.days') : t('form-fields.day')}` : ``}`
  }

  // Week
  if (rd >= 7) {
    let week = parseInt(rd / 7)
    let dd = parseInt(rd % 7)
    return `${week} ${week > 1 ? t('form-fields.weeks') : t('form-fields.week')}${dd > 0 ? `, ${dd} ${dd > 1 ? t('form-fields.days') : t('form-fields.day')}` : ``}`
  }

  // Day
  // ${hours > 0 ? `, ${hours} hour` : ''
  return `${rd} ${rd > 1 ? t('form-fields.days') : t('form-fields.day')}`
})

const calculateOptions = computed(() => [
  { label: t('form-fields.automatic'), value: 'Automatic' },
  { label: t('form-fields.manual'), value: 'Manual' },
])

// const discountTypes = computed(() => [
//   { label: t('form-fields.round'), value: 'Round' },
//   { label: t('form-fields.percentage'), value: 'Percentage' },
// ])

const rentForOptions = computed(() => [
  { label: t('form-fields.day'), value: 'day_rate' },
  { label: t('form-fields.week'), value: 'week_rate' },
  { label: t('form-fields.month'), value: 'month_rate' },
])

const setTotalRentalPrice = () => {
  const rd = reserveStore.form.rent_days
  const rentOption = reserveStore.form.rent_option
  const rate = reserveStore.createInfo[rentOption]

  if (rentOption === 'day_rate') {
    const dayCeil = rd <= 0 ? 1 : Math.ceil(rd)
    const total = Number((rate * dayCeil).toFixed(2))
    reserveStore.form.total_rental_price = total
    reserveStore.formCurrency.total_rental_price = deCurrency(total)
  }
  if (rentOption === 'week_rate') {
    const weekCeil = Math.ceil(rd / 7)
    const total = Number((rate * weekCeil).toFixed(2))
    reserveStore.form.total_rental_price = total
    reserveStore.formCurrency.total_rental_price = deCurrency(total)
  }
  if (rentOption === 'month_rate') {
    const monthCeil = Math.ceil(rd / 30)
    const total = Number((rate * monthCeil).toFixed(2))
    reserveStore.form.total_rental_price = total
    reserveStore.formCurrency.total_rental_price = deCurrency(total)
  }
}

const onRentOptionChange = val => {
  const rate = reserveStore.createInfo[val]
  reserveStore.form.per_hour_rate = rate
  reserveStore.formCurrency.per_hour_rate = deCurrency(rate)

  if (reserveStore.form.calculate_value == "Automatic") {
    setTotalRentalPrice()
  }
}

const onCalculateValueChange = (val) => {
  if (val == 'Automatic') {
    setTotalRentalPrice()
  }
}

// GET TOTAL WITHOUT VAL
// TOTAL RENTAL PRICE - DISCOUNT
const getTotalWithuotVat = computed(() => {
  const total = Number(
    + Number(reserveStore.form.total_rental_price)
    + Number(reserveStore.form.pick_up_fee)
    + Number(reserveStore.form.out_of_hours_fee)
    + Number(reserveStore.form.others_costs)
    + Number(reserveStore.form.charges_for_extras)
  )
  const d = Number(reserveStore.form.discount)
  const discount = reserveStore.form.discount_type == 'Round' ? d : (total / 100) * d
  return total - discount
})

const getSubTotalWithuotVat = computed(() => {
  const total = Number(
    + Number(reserveStore.form.total_rental_price)
    + Number(reserveStore.form.pick_up_fee)
    + Number(reserveStore.form.out_of_hours_fee)
    + Number(reserveStore.form.others_costs)
    + Number(reserveStore.form.charges_for_extras)
  )
  return total
})

const getDiscountWithuotVat = computed(() => {
  const total = Number(
    + Number(reserveStore.form.total_rental_price)
    + Number(reserveStore.form.pick_up_fee)
    + Number(reserveStore.form.out_of_hours_fee)
    + Number(reserveStore.form.others_costs)
    + Number(reserveStore.form.charges_for_extras)
  )
  const d = Number(reserveStore.form.discount)
  const discount = reserveStore.form.discount_type == 'Round' ? d : (total / 100) * d

  return discount
})



// GET VAL AMOUNT
// e.g: 19% vat
// Total Without Vat / 100 * 19
const getVatAmount = computed(() => {
  return Number(((getTotalWithuotVat.value / 100) * taxRate.value).toFixed(2))
})

// TO PAY AMOUNT
// Total Without vat + Vat Amount
const getToPayAmount = computed(() => {
  return Number(getTotalWithuotVat.value) + Number(getVatAmount.value)
})

const discountIcon = ref('%')
// const onChangeDiscountType = (val) => {
//   if (val == 'Round') {
//     discountIcon.value = '€'
//   } else {
//     discountIcon.value = '%'
//   }
// }

// Set Vat amount
watch(() => getVatAmount.value, (newVal) => {
  reserveStore.form.vat_amount = newVal
}, { immediate: true })

// Set Total Without vat
watch(() => getTotalWithuotVat.value, (newVal) => {
  reserveStore.form.total_without_vat = newVal
}, { immediate: true })


// Set Discount Without vat
watch(() => getDiscountWithuotVat.value, (newVal) => {
  reserveStore.form.discount_amount = newVal
}, { immediate: true })

// Set to_pay in global form
watch(() => getToPayAmount.value, (newVal) => {
  reserveStore.form.to_pay = newVal
}, { immediate: true })


// Set SubTotal Without vat
watch(() => getSubTotalWithuotVat.value, (newVal) => {
  reserveStore.form.subtotal = newVal
}, { immediate: true })

</script>

<template>
  <div class="row">
    <div class="col-md-6 col-xxl-5">
      <RadioControl v-model="reserveStore.form.calculate_value" @update:modelValue="onCalculateValueChange" :options="calculateOptions" :label="t('form-fields.calculation')" name="calculation" labelClasses="label-muted" class="mb-3" />

      <div class="row align-items-center">
        <div class="col-md-4">
          <span class="label-muted">{{ t('form-fields.rent-for') }}</span>
        </div>
        <div class="col-md-8">
          <div class="row mb-3">
            <div class="col-5 col-xxl-4 pe-2">
              <CurrencyControl v-model.number="reserveStore.form.per_hour_rate" v-model:currency="reserveStore.formCurrency.per_hour_rate" :disabled="reserveStore.form.calculate_value == 'Automatic'" errorField="per_hour_rate" />
            </div>
            <div class="col-7 col-xxl-8 ps-2">
              <FormSelect v-model="reserveStore.form.rent_option" @update:modelValue="onRentOptionChange" :options="rentForOptions" displayProperty="label" valueProperty="value" />
            </div>
          </div>
        </div>
      </div>

      <CurrencyControl :disabled="reserveStore.form.calculate_value == 'Automatic'" v-model.number="reserveStore.form.total_rental_price" v-model:currency="reserveStore.formCurrency.total_rental_price" :placeholder="`0.00`" :label="t('form-fields.total-rental-price') " errorField="total_rental_price" :errors="props.validation" class="mb-3" />

      <InputControl disabled :modelValue="getRentalPeriod" :placeholder="t('form-fields.rental-period')" :label="t('form-fields.rental-period')" errorField="rental_hours" :errors="props.validation" class="mb-3" />
      <CurrencyControl v-model.number="reserveStore.form.pick_up_fee" v-model:currency="reserveStore.formCurrency.pick_up_fee" :placeholder="t('form-fields.pick-up-fee')" :label="t('form-fields.pick-up-fee')" errorField="pick_up_fee" :errors="props.validation" class="mb-3" />
      <CurrencyControl v-model.number="reserveStore.form.out_of_hours_fee" v-model:currency="reserveStore.formCurrency.out_of_hours_fee" :placeholder="t('form-fields.out-of-hours-fee')" :label="t('form-fields.out-of-hours-fee')" errorField="out_of_hours_fee" :errors="props.validation" class="mb-3" />
      <CurrencyControl v-model.number="reserveStore.form.others_costs" v-model:currency="reserveStore.formCurrency.others_costs" :placeholder="t('form-fields.other-costs')" :label="t('form-fields.other-costs')" errorField="others_costs" :errors="props.validation" class="mb-3 d-none" />
      <CurrencyControl v-model.number="reserveStore.form.charges_for_extras" v-model:currency="reserveStore.formCurrency.charges_for_extras" :placeholder="t('form-fields.charges-for-extras')" :label="t('form-fields.charges-for-extras')" errorField="charges_for_extras" :errors="props.validation" class="mb-3" />

      <!-- <div class="row pt-1">
        <div class="col-md-4"></div>
        <div class="col-md-8">
          <RadioControl v-model="reserveStore.form.discount_type" @update:modelValue="onChangeDiscountType" :options="discountTypes" name="discountType" />
        </div>
      </div> -->

      <InputControl v-model.number="reserveStore.form.discount" type="number" min="0" :placeholder="t('form-fields.discount')" :label="t('form-fields.discount')" errorField="discount" :errors="props.validation" class="mb-3" :appendIcon="discountIcon" />
      <InputControl disabled :modelValue="getTotalWithuotVat" :placeholder="t('form-fields.total-without-vat')" :label="t('form-fields.total-without-vat')" errorField="total_without_vat" :errors="props.validation" class="mb-3 d-none" />
      <InputControl disabled :modelValue="getVatAmount" :placeholder="`${t('form-fields.vat')} (${taxRate}%)`" :label="`${t('form-fields.vat')} (${taxRate}%)`" errorField="vat_amount" :errors="props.validation" class="mb-3 d-none" />
      <InputControl disabled :modelValue="reserveStore.form.total_amount_paid" :placeholder="t('form-fields.total-amount-paid')" :label="t('form-fields.total-amount-paid')" errorField="total_amount_paid" :errors="props.validation" class="mb-3 d-none" />
      <InputControl disabled :modelValue="reserveStore.form.to_pay" :placeholder="t('form-fields.to-pay')" :label="t('form-fields.to-pay')" errorField="to_pay" :errors="props.validation" class="mb-3 d-none" />
      <FormSelect v-model="reserveStore.form.payment_method" :options="paymentMethods" displayProperty="name" valueProperty="id" :label="t('form-fields.payment-method')" :placeholder="t('form-fields.payment-method')" errorField="payment_method" :frontError="props.validation" />
    </div>

    <div class="col-md-6 offset-xxl-2 col-xxl-5">
      <CurrencyControl v-model.number="reserveStore.form.deposit" v-model:currency="reserveStore.formCurrency.deposit" :placeholder="t('form-fields.deposit')" :label="t('form-fields.deposit')" errorField="deposit" :errors="props.validation" class="mb-3" />
      <!-- <InputControl v-model.number="reserveStore.form.deposit" type="number" :placeholder="t('form-fields.deposit')" :label="t('form-fields.deposit')" errorField="deposit" :errors="props.validation" appendIcon="€" class="mb-3" /> -->
      <FormSelect v-model="reserveStore.form.payment_method_for_deposit" :options="paymentMethods" displayProperty="name" valueProperty="id" class="mb-3" :label="t('form-fields.payment-method-for-deposit')" :placeholder="t('form-fields.payment-method-for-deposit')" errorField="payment_method_for_deposit" :frontError="props.validation" />
      <InputControl v-model="reserveStore.form.preauthorization_code" type="number" :placeholder="t('form-fields.preauthorization-code')" :label="t('form-fields.preauthorization-code')" errorField="preauthorization_code" :errors="props.validation" class="mb-3" />

      <CurrencyControl v-model="reserveStore.form.deductible_fire_theft" v-model:currency="reserveStore.formCurrency.deductible_fire_theft" :placeholder="t('form-fields.deductible-fire/theft')" :label="t('form-fields.deductible-fire/theft')" errorField="deductible_fire_theft" :errors="props.validation" class="mb-3" />
      <CurrencyControl v-model="reserveStore.form.deductible_damage" v-model:currency="reserveStore.formCurrency.deductible_damage" :placeholder="t('form-fields.deductible-damage')" :label="t('form-fields.deductible-damage')" errorField="deductible_damage" :errors="props.validation" class="mb-3" />
      <CurrencyControl v-model="reserveStore.form.deductible_liability" v-model:currency="reserveStore.formCurrency.deductible_liability" :placeholder="t('form-fields.deductible-liability')" :label="t('form-fields.deductible-liability')" errorField="deductible_liability" :errors="props.validation" />

      <div class="total-calculation-div my-5 mx-auto p-4">
        <div class="text-18 fw-700 mb-4">{{t('dashboard-reservation.billing-amount')}}</div>
        <div class="calculation-div">
          <div class="d-flex align-items-center item">
            <div class="col-md-6 ps-5 d-flex align-items-center">
              <span class="me-3">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g opacity="0.32" clip-path="url(#clip0_5678_2101)">
                    <path d="M13.9993 2.66699H1.99935C1.26297 2.66699 0.666016 3.26395 0.666016 4.00033V12.0003C0.666016 12.7367 1.26297 13.3337 1.99935 13.3337H13.9993C14.7357 13.3337 15.3327 12.7367 15.3327 12.0003V4.00033C15.3327 3.26395 14.7357 2.66699 13.9993 2.66699Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M0.666016 6.66699H15.3327" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </g>
                  <defs>
                    <clipPath id="clip0_5678_2101">
                      <rect width="16" height="16" fill="white" />
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
                      <path d="M13.0402 2.2395H2.95983C2.16451 2.2395 1.51978 2.88424 1.51978 3.67956V13.76C1.51978 14.5553 2.16451 15.2 2.95983 15.2H13.0402C13.8355 15.2 14.4803 14.5553 14.4803 13.76V3.67956C14.4803 2.88424 13.8355 2.2395 13.0402 2.2395Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M10.8811 0.800003V3.68012" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M5.11938 0.800003V3.68012" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M1.51978 6.55966H14.4803" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </g>
                  </g>
                  <defs>
                    <clipPath id="clip0_5678_2090">
                      <rect width="16" height="16" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </span>
              <span class="text text-14 fw-400">{{t('form-fields.discount')}}</span>
            </div>
            <div class="col-md-6 text-16 fw-500 ps-4">{{deCurrency(reserveStore.form.discount_amount)}}</div>
          </div>
          <div class="d-flex align-items-center item">
            <div class="col-md-6 ps-5 d-flex align-items-center">
              <span class="me-3">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g opacity="0.32" clip-path="url(#clip0_5678_2107)">
                    <path d="M10.8438 9.4375C11.1022 9.4375 11.3125 9.64497 11.3125 9.9H12.25C12.25 9.29162 11.8581 8.77291 11.3125 8.58028V7.5625H10.375V8.58062C9.82941 8.77412 9.4375 9.29516 9.4375 9.90625C9.4375 10.6817 10.0683 11.3125 10.8438 11.3125C11.1022 11.3125 11.3125 11.5228 11.3125 11.7813C11.3125 12.0397 11.1022 12.25 10.8438 12.25C10.5853 12.25 10.375 12.0397 10.375 11.7813H9.4375C9.4375 12.3923 9.82941 12.9134 10.375 13.1069V14.1188H11.3125V13.1069C11.8581 12.9134 12.25 12.3923 12.25 11.7813C12.25 11.0058 11.6192 10.375 10.8438 10.375C10.5853 10.375 10.375 10.1647 10.375 9.90625C10.375 9.64778 10.5853 9.4375 10.8438 9.4375Z" fill="black" />
                    <path d="M10.8438 5.6875C10.6857 5.6875 10.5294 5.69506 10.375 5.70903V2.8125C10.375 1.99966 9.79537 1.26219 8.74294 0.735969C7.79375 0.261375 6.54219 0 5.21875 0C3.89262 0 2.63103 0.260844 1.66634 0.734438C0.591813 1.26203 0 2 0 2.8125V11.3125C0 12.125 0.591813 12.863 1.66634 13.3906C2.63103 13.8642 3.89262 14.125 5.21875 14.125C5.75028 14.125 6.27022 14.0826 6.76922 13.9999C7.71331 15.2159 9.18859 16 10.8438 16C13.6869 16 16 13.6869 16 10.8438C16 8.00059 13.6869 5.6875 10.8438 5.6875ZM2.07953 1.576C2.906 1.17022 4.05019 0.9375 5.21875 0.9375C7.70494 0.9375 9.4375 1.92566 9.4375 2.8125C9.4375 3.69934 7.70494 4.6875 5.21875 4.6875C4.05019 4.6875 2.906 4.45478 2.07953 4.049C1.35375 3.69269 0.9375 3.242 0.9375 2.8125C0.9375 2.383 1.35375 1.93231 2.07953 1.576ZM0.9375 4.44578C1.14762 4.60631 1.391 4.75537 1.66634 4.89056C2.63103 5.36416 3.89262 5.625 5.21875 5.625C6.54219 5.625 7.79375 5.36363 8.74294 4.88903C9.00416 4.75841 9.23616 4.61478 9.4375 4.46022V5.88241C8.50325 6.14756 7.67628 6.67019 7.03819 7.36828C6.46706 7.49713 5.85581 7.5625 5.21875 7.5625C4.05019 7.5625 2.906 7.32978 2.07953 6.924C1.35375 6.56769 0.9375 6.117 0.9375 5.6875V4.44578ZM0.9375 7.32078C1.14762 7.48131 1.391 7.63037 1.66634 7.76556C2.63103 8.23916 3.89262 8.5 5.21875 8.5C5.58066 8.5 5.93569 8.48059 6.28191 8.44253C5.97391 9.02534 5.77434 9.67381 5.71025 10.3611C5.54741 10.3701 5.38322 10.375 5.21875 10.375C4.05019 10.375 2.906 10.1423 2.07953 9.7365C1.35375 9.38019 0.9375 8.9295 0.9375 8.5V7.32078ZM5.21875 13.1875C4.05019 13.1875 2.906 12.9548 2.07953 12.549C1.35375 12.1927 0.9375 11.742 0.9375 11.3125V10.1333C1.14762 10.2938 1.391 10.4428 1.66634 10.578C2.63103 11.0517 3.89262 11.3125 5.21875 11.3125C5.38219 11.3125 5.54559 11.3084 5.70794 11.3004C5.76544 11.9525 5.94478 12.5701 6.22312 13.1303C5.89625 13.168 5.56053 13.1875 5.21875 13.1875ZM10.8438 15.0625C8.51753 15.0625 6.625 13.17 6.625 10.8438C6.625 8.51753 8.51753 6.625 10.8438 6.625C13.17 6.625 15.0625 8.51753 15.0625 10.8438C15.0625 13.17 13.17 15.0625 10.8438 15.0625Z" fill="black" />
                  </g>
                  <defs>
                    <clipPath id="clip0_5678_2107">
                      <rect width="16" height="16" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </span>
              <span class="text text-14 fw-400">{{t('form-fields.tax')}} ({{taxRate}}%)</span>
            </div>
            <div class="col-md-6 text-16 fw-500 ps-4">{{deCurrency(getVatAmount)}}</div>
          </div>
        </div>
        <div class="grand-total-div d-flex align-items-center mt-3">
          <div class="col-md-6 text-label text-right text-14 fw-500 pe-3">{{t('form-fields.grand-total')}}</div>
          <div class="col-md-6 text-28 text-amount fw-700 ps-3">{{deCurrency(getToPayAmount)}}</div>
        </div>
      </div>

    </div>
  </div>
</template>

<style lang="scss" scoped>
.total-calculation-div {
  width: 427px;
  border: 1px solid #dddddd;
  border-radius: 4px;
  .calculation-div {
    width: 379px;
    background: #ffffff;
    border: 1px solid #eeeeee;
    box-shadow: 0px 2px 16px rgba(0, 0, 0, 0.12);
    border-radius: 4px;
    .item {
      padding: 16px;
      .text {
        color: rgba(0, 0, 0, 0.8);
      }
    }
    .item:not(:last-child) {
      border-bottom: 1px solid #eeeeee;
    }
  }
  .grand-total-div {
    .text-label {
      color: rgba(0, 0, 0, 0.6);
    }
    .text-28 {
      font-size: 28px;
    }
  }
}
</style>
