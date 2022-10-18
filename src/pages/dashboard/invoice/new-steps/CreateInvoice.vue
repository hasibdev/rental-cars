<script setup>
import { ref, defineProps, watch, computed, defineEmits } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import InputControl from "@/components/dashboard/form/InputControl.vue"
import CalenderControl from "@/components/dashboard/form/CalenderControl.vue"
import SelectControl from "@/components/dashboard/form/SelectControl.vue"
import RadioControl from '@/components/dashboard/form/RadioControl.vue'
import RepeatableItem from '@/components/dashboard/RepeatableItemDark.vue'
import FormSelect from "@/components/dashboard/shared/FormSelect.vue"
import CurrencyControl from "@/components/dashboard/form/CurrencyControl.vue"
import TextControl from '@/components/dashboard/form/TextControl.vue'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import StepFooter from './StepFooter.vue'
import { useAxios, api } from '@/use/useAxios'
import { useInvoiceStore } from '@/stores/invoice'
import moment from 'moment'
import useVuelidate from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import { useI18n } from 'vue-i18n'
import { deCurrency } from '@/use/useUtil'

const emits = defineEmits(['changeTab', 'save'])

const props = defineProps({
  info: {
    type: Object
  },
  savingStatus: {
    type: Boolean,
    default: () => false
  }
})

const router = useRouter()
const route = useRoute()
const { form, formCustomer } = useInvoiceStore()

const rentForOptions = computed(() => [
  { label: t('form-fields.day'), value: 'day_rate' },
  { label: t('form-fields.week'), value: 'week_rate' },
  { label: t('form-fields.month'), value: 'month_rate' },
])

const { t } = useI18n({ useScope: 'global' })

const { data: reservations, reFetch, loading } = useAxios('admin/invoice/reservation')
const { data: autoInvoiceNo } = useAxios('admin/invoice/invoice-no')
const { data: paymentTerms } = useAxios('admin/payment_terms')
const { data: payMethods } = useAxios('paymentmethods')

const fields = ref([
  {
    label: t('form-fields.description'),
    name: "description",
    component: 'InputControl',
    width: "200px",
    props: {
      placeholder: t('form-fields.description')
    }
  },
  {
    label: 'Qty',
    name: "quantity",
    component: 'InputControl',
    width: "80px",
    props: {
      placeholder: t('form-fields.qty'),
      type: 'number'
    }
  },
  {
    label: t('form-fields.unit'),
    name: "unit",
    component: 'SelectControl',
    width: "180px",
    props: {
      placeholder: t('form-fields.unit'),
      options: rentForOptions.value,
      trackBy: 'value'
    }
  },
  {
    label: t('form-fields.price'),
    name: "rate",
    component: 'CurrencyControl',
    width: "180px",
    // appendIcon: "€",
    props: {
      placeholder: t('form-fields.price'),
    }
  },
  {
    label: t('form-fields.total-net'),
    name: "amount",
    component: 'CurrencyControl',
    width: "180px",
    // appendIcon: "€",
    props: {
      placeholder: t('form-fields.amount'),
      disabled: true
    }
  },
])


const languages = [
  {
    id: "de",
    label: t('language.german')
  },
  {
    id: "en",
    label: t('language.english')
  }
]

const priceRateOptions = [
  { label: t('form-fields.incl-vat'), value: 'incl-vat' },
  { label: t('form-fields.excl-vat'), value: 'excl-vat' },
]

const linesCopy = ref([
  {
    description: null,
    quantity: '',
    unit: null,
    rate: '',
    amount: '',
  }
])

// Lines
const addNewLine = () => {
  const f = {
    description: null,
    quantity: '',
    unit: null,
    rate: '',
    amount: '',
  }
  linesCopy.value.push({ ...f })
  form.lines.push({ ...f })
}

// Resrvation
const getReservation = (val) => {
  reFetch(`admin/invoice/reservation?reservation_no=${val}`)
}

// Validation rules
const formRules = {
  reservation_id: { required: helpers.withMessage(t('dashboard-invoice.reservation-is-required'), required) },
  invoice_date: { required: helpers.withMessage(t('dashboard-invoice.date-is-required'), required) },
  payment_term: { required: helpers.withMessage(t('dashboard-invoice.payment-term-is-required'), required) },
  accepted_payment_method: { required: helpers.withMessage(t('dashboard-invoice.accepted-payment-mathod-is-required'), required) },
  total_amount_paid: { required: helpers.withMessage(t('dashboard-invoice.amount-is-required'), required) },
  language: { required: helpers.withMessage(t('dashboard-invoice.language-is-required'), required) },
  currency: { required: helpers.withMessage(t('dashboard-invoice.currency-is-required'), required) },
}

const form$v = useVuelidate(formRules, form)

// Watch Reservation list for Query parameter
watch(() => reservations.value, async () => {
  if (route.query.reservationId) {
    form.reservation_id = route.query.reservationId
    const find = reservations.value.resarvations.data.find(r => r.id == route.query.reservationId)
    if (!find) {
      try {
        const res = await api.get(`admin/reservation/view/${route.query.reservationId}`)
        reservations.value.resarvations.data.push(res.data.reservation)
      } catch (error) {
        console.error(error)
      }

    }
  }
})

// Watch Reservation id
watch(() => form.reservation_id, (rid) => {
  form.lines = []
  linesCopy.value = []
  const find = reservations.value.resarvations.data.find(r => r.id == rid)

  form.customer_id = find.customer_id
  form.discount = find.discount
  form.tax = find.vat_rate
  form.tax_amount = find.vat_amount
  form.total_amount_paid = find.total_amount_paid
  form.language = find.contact_language
  form.accepted_payment_method = find.payment_method
  form.discount_type = find.discount_type

  // Customer
  formCustomer.full_name = find.full_name
  formCustomer.phone = find.phone
  formCustomer.email = find.email
  formCustomer.country = find.country
  formCustomer.province = find.province
  formCustomer.city = find.city
  formCustomer.address = find.address
  formCustomer.zip = find.zip

  const getRentQty = () => {
    let qty = 0
    if (find.rent_option === 'day_rate') {
      const dayCeil = find.rent_days <= 0 ? 1 : Math.ceil(find.rent_days)
      qty = dayCeil
    }
    if (find.rent_option === 'week_rate') {
      const weekCeil = Math.ceil(find.rent_days / 7)
      qty = weekCeil
    }
    if (find.rent_option === 'month_rate') {
      const monthCeil = Math.ceil(find.rent_days / 30)
      qty = monthCeil
    }
    return qty
  }

  // Rental Price
  const l1 = {
    description: t('form-fields.rental-price'),
    quantity: getRentQty(),
    unit: find.rent_option,
    rate: find.per_hour_rate,
    amount: find.total_rental_price
  }
  form.lines.push(l1)
  linesCopy.value.push({ ...l1, rate: deCurrency(find.per_hour_rate), amount: deCurrency(find.total_rental_price) })

  // Pick-Up-Fee
  if (find.pick_up_fee) {
    const l2 = {
      description: t('form-fields.pick-up-fee'),
      quantity: 1,
      unit: find.rent_option,
      rate: find.pick_up_fee,
      amount: find.pick_up_fee
    }
    form.lines.push(l2)
    linesCopy.value.push({ ...l2, rate: deCurrency(find.pick_up_fee), amount: deCurrency(find.pick_up_fee) })
  }

  // Out-of-Hours Fee
  if (find.out_of_hours_fee) {
    const l3 = {
      description: t('form-fields.out-of-hours-fee'),
      quantity: 1,
      unit: find.rent_option,
      rate: find.out_of_hours_fee,
      amount: find.out_of_hours_fee
    }
    form.lines.push(l3)
    linesCopy.value.push({ ...l3, rate: deCurrency(find.out_of_hours_fee), amount: deCurrency(find.out_of_hours_fee) })
  }

  // Other Costs
  if (find.others_costs) {
    const l4 = {
      description: t('form-fields.other-costs'),
      quantity: 1,
      unit: find.rent_option,
      rate: find.others_costs,
      amount: find.others_costs
    }
    form.lines.push(l4)
    linesCopy.value.push({ ...l4, rate: deCurrency(find.others_costs), amount: deCurrency(find.others_costs) })
  }

  // Charges for Extras
  if (find.charges_for_extras) {
    const l5 = {
      description: t('form-fields.charges-for-extras'),
      quantity: 1,
      unit: find.rent_option,
      rate: find.charges_for_extras,
      amount: find.charges_for_extras
    }
    form.lines.push(l5)
    linesCopy.value.push({ ...l5, rate: deCurrency(find.charges_for_extras), amount: deCurrency(find.charges_for_extras) })
  }

})

// Sub total
const getSubTotal = computed(() => {
  return form.lines.reduce((acc, item) => {
    return acc += Number(item.amount)
  }, 0)
})
watch(() => getSubTotal.value, (val) => {
  form.sub_total = val
})

const getDiscountAmount = computed(() => {
  const d = Number(form.discount)
  const discount = form.discount_type == 'Round' ? d : (getSubTotal.value / 100) * d

  return discount
})
watch(() => getDiscountAmount.value, (val) => {
  form.discount_amount = val
})

// Grand Total
const getGrandTotal = computed(() => {
  return (Number(getSubTotal.value) - Number(form.discount_amount)) + Number(form.tax_amount)
})
watch(() => getGrandTotal.value, (val) => {
  form.grand_total = val
})

const onLineChange = ({ item, index }) => {
  const total = Number(item.quantity) * Number(item.rate)
  form.lines[index].amount = total
  linesCopy.value[index].amount = deCurrency(total)
}


watch(() => [form.invoice_date, form.payment_term], ([invoiceDate, termId]) => {
  const find = paymentTerms.value?.find(pt => pt.id == termId)
  if (find)
    form.due_date = moment(invoiceDate).add(find.days, 'days').format('YYYY/MM/DD')
})

const setTaxAmount = () => {
  form.tax_amount = ((form.sub_total - form.discount_amount) / 100) * form.tax
}
const onVatRateChange = (val) => {
  if (val == 'excl-vat') {
    form.tax_amount = 0
  } else {
    setTaxAmount()
  }
}

// watch(() => form.tax, () => {
//   setTaxAmount()
// })

watch(() => autoInvoiceNo.value, (val) => {
  form.invoice_no = val
})

const goToPreview = async () => {
  const result = await form$v.value.$validate()
  if (result)
    emits('changeTab', 2)
}

const saveInvoice = async () => {
  const result = await form$v.value.$validate()
  if (result)
    emits('save')
}

</script>

<template>
  <div class="d-flex justify-content-center flex-wrap w-100 scrollbar">
    <div class="mb-4" style="width: 596px;">
      <div class="borderd-content" style="border-radius: 4px 4px 0px 0px; border-bottom: none; ">
        <!-- Logo -->
        <div>
          <img :src="imageBaseUrl(`/logo/${props.info?.logo}`)" alt="Logo" class="mt-3 mb-4" style="width: 132px;">
        </div>
        <!-- Dates -->
        <div class="d-flex justify-content-end">
          <div class="pe-2 text-right">
            <div class="text-10 fw-500 pb-2">{{ t('form-fields.invoice-date') }}:</div>
          </div>
          <div class="">
            <div class="text-10 fw-500 pb-2">
              {{ moment(form.invoice_date).format('DD.MM.YYYY') }}
            </div>
          </div>
        </div>
        <div class="d-flex justify-content-end">
          <div class="pe-2 text-right">
            <div class="text-10 fw-400 pb-2">{{ t('form-fields.due-date') }}:</div>
          </div>
          <div class="">
            <div class="text-10 fw-400 pb-2">
              {{ moment(new Date(form.due_date)).format('DD.MM.YYYY') }}
            </div>
          </div>
        </div>

        <!-- Company info -->
        <div class="text-8 fw-400" style="width: 170px">
          <span v-if="props.info?.compnay_name" class="fw-600 text-6">{{ props.info?.compnay_name }} GmbH </span>
          <span v-if="props.info?.street" class="fw-400 text-6">{{ props.info?.street }},</span>
          <span v-if="props.info?.postcode" class="fw-400 text-6">{{ props.info?.postcode }} </span>
          <span v-if="props.info?.city" class="fw-400 text-6">{{", "}}{{ props.info?.city }}</span>
          <span v-if="props.info?.country" class="fw-400 text-6">{{", "}}{{ props.info?.country }}</span>
        </div>
        <!-- Customer Info -->
        <div class="mt-2">
          <p class="mb-0 text-10 fw-600" style="width: 170px" v-if="formCustomer?.full_name">{{ formCustomer?.full_name }}
            <span class="mb-0 text-10 fw-400" v-if="formCustomer?.address">{{ formCustomer?.address }} </span>
            <span class="mb-0 text-10 fw-400">
              <span v-if="formCustomer?.zip"> {{ formCustomer?.zip }} {{' '}}</span>
              <span v-if="formCustomer?.city">{{ formCustomer?.city }}</span>
            </span>
          </p>
        </div>

        <div class="text-20 fw-700 my-5">{{ t('form-fields.invoice') }} {{autoInvoiceNo}}</div>
        <div class="dashed-text-field w-75 mb-3">
          <InputControl v-model="form.introduction_text" :placeholder="t('dashboard-invoice.introductory-text')" class="" />
        </div>
        <div class="list">
          <RepeatableItem :fields="fields" v-model:items="form.lines" @input="onLineChange">
            <template #rate="{item, index}">
              <CurrencyControl v-model="form.lines[index].rate" v-model:currency="linesCopy[index].rate" @update:modelValue="onLineChange({item,index})" />
            </template>
            <template #amount="{item, index}">
              <CurrencyControl :disabled="true" v-model="form.lines[index].amount" v-model:currency="linesCopy[index].amount" @update:modelValue="onLineChange({item,index})" />
            </template>

            <template #footer>
              <div class="text-right mt-2">
                <span @click="addNewLine" class="text-16 fw-600 w-100 pointer text-primary">+ {{
                t('form-fields.add-new-line') }}</span>
              </div>
            </template>
          </RepeatableItem>
        </div>
        <div class="total-summary my-4">
          <div class="row mb-2">
            <div class="col-md-10">
              <div class="text-12 fw-400 text-right" style="color: rgba(0,0,0,0.6);">{{t('form-fields.subtotal')}}</div>
            </div>
            <div class="col-md-2">
              <div class="text-12 fw-500 text-right pe-4">{{ deCurrency(form.sub_total) }}</div>
            </div>
          </div>
          <div class="row pb-1 mb-2">
            <div class="col-md-10">
              <div class="text-12 fw-400 text-right" style="color: rgba(0,0,0,0.6);">{{t('form-fields.discount')}}</div>
            </div>
            <div class="col-md-2">
              <div class="text-12 fw-500 text-right pe-4">{{deCurrency(form.discount_amount)}}</div>
            </div>
          </div>
          <div class="row pb-1 mb-4">
            <div class="col-md-10">
              <div class="text-12 fw-400 text-right" style="color: rgba(0,0,0,0.6);">{{t('form-fields.tax')}}({{
              form.tax }}%)</div>
            </div>
            <div class="col-md-2">
              <div class="text-12 fw-500 text-right pe-4">{{ deCurrency(form.tax_amount) }}</div>
            </div>
          </div>
          <div class="d-flex justify-content-end">
            <div class="bg-dark text-white d-flex align-items-center justify-content-between" style="border-radius: 4px; padding: 10px 22px;">
              <span class="text-14 fw-700 me-5">{{t('form-fields.grand-total')}}</span>
              <span class="text-22 fw-700">{{ deCurrency(form.grand_total) }}</span>
            </div>
          </div>
        </div>
        <div class="pb-4">
          <div class="text-12 fw-400 pb-2">{{ t('dashboard-invoice.thankyou-text') }}</div>
          <div class="text-12 fw-400" v-if="locale == 'de'">Der Gesamtbetrag ist <span v-if="form.accepted_payment_method">{{form.accepted_payment_method}}</span> zu zahlen bis
            {{moment(form.due_date).format('DD.MM.YYYY')}}.
          </div>
          <div class="text-12 fw-400" v-else>The total amount is payable <span v-if="form.accepted_payment_method">by {{form.accepted_payment_method}}</span> until
            {{moment(form.due_date).format('DD/MM/YYYY')}}.
          </div>
        </div>
        <div class="w-50 dashed-text-field mb-4">
          <div class="text-12 fw-700" style="color: rgba(0,0,0,0.6);">{{ t('dashboard-invoice.terms-and-conditions') }}
          </div>
          <TextControl v-model="form.termas_conditions" :placeholder="t('dashboard-invoice.terms-and-conditions')" class="mt-2"></TextControl>
        </div>
        <div class="dashed-text-field w-75 mb-5">
          <InputControl v-model="form.final_text" :placeholder="t('dashboard-invoice.final-text')" class="" />
        </div>
      </div>
      <!-- Footer -->
      <StepFooter :info="props" />
    </div>
    <div class="mb-4 px-4" style="width: 350px; margin-left: 60px;">
      <div class="borderd-content">
        <div class="text-18 fw-700 mb-4">{{t('form-fields.basic-info')}}</div>
        <div class="text-14 fw-500 mb-2 label">{{t('form-fields.reservation-id')}}</div>
        <FormSelect v-model="form.reservation_id" :frontError="form$v" :searching="loading" errorField="reservation_id" :options="reservations?.resarvations.data || []" variant="dark" displayProperty="reservation_no" valueProperty="id" :placeholder="t('form-fields.reservation-id')" search :search-placeholder="t('Accident.reservation-id')" no-border @search="getReservation">
        </FormSelect>

        <div class="text-14 fw-500 mt-3 mb-2 label">{{t('form-fields.billed-to')}}</div>
        <InputControl stack disabled v-model="formCustomer.full_name" :placeholder="t('form-fields.customer-name')" class="" />
        <div class="text-14 fw-500 mt-3 mb-2 label">{{t('form-fields.invoice-no')}}</div>
        <InputControl stack disabled v-model="autoInvoiceNo" placeholder="WSY-00008" class="" />
        <div class="text-14 fw-500 mt-3 mb-2 label">{{t('form-fields.invoice-date')}}</div>
        <CalenderControl stack :errors="form$v" v-model="form.invoice_date" :placeholder="t('form-fields.invoice-date')" errorField="invoice_date" data-field="invoice_date" />
        <div class="text-14 fw-500 mt-3 mb-2 label">{{t('form-fields.payment-term')}}</div>
        <SelectControl stack :errors="form$v" v-model="form.payment_term" :options="paymentTerms || []" optionLabel="paymentterms_name" errorField="payment_term" data-field="payment_term" />
        <div class="text-14 fw-500 mt-3 mb-2 label">{{t('form-fields.accepted-payment-method')}}</div>
        <SelectControl stack :errors="form$v" v-model="form.accepted_payment_method" :options="payMethods ?? []" optionLabel="name" errorField="accepted_payment_method" data-field="accepted_payment_method" />
        <div class="text-14 fw-500 mt-3 mb-2 label">{{t('form-fields.price-rate')}}</div>

        <RadioControl v-model="form.price_rate_status" name="price_rate_status" @update:modelValue="onVatRateChange" :options="priceRateOptions" class="mb-3" />

        <div class="row">
          <div class="col-6">
            <p class="mb-1 text-14 fw-500 mt-3 mb-2 label">{{ t('form-fields.vat') }}</p>
            <div class="input-group">
              <input v-model="form.tax" type="number" @input="setTaxAmount" :disabled="form.price_rate_status == 'excl-vat'" class="form-control" :placeholder="t('form-fields.vat')">
              <span class="input-group-text" id="basic-addon2">%</span>
            </div>
          </div>
          <div class="col-6">
            <p class="mb-1 text-14 fw-500 mt-3 mb-2 label">{{ t('form-fields.discount') }}</p>
            <div class="input-group">
              <input v-model="form.discount" type="number" class="form-control" :placeholder="t('form-fields.discount')">
              <span class="input-group-text" id="basic-addon2"> {{ form.discount_type == 'Round' ? '€': '%' }}</span>
            </div>
          </div>
        </div>

        <div class="text-14 fw-500 mt-3 mb-2 label">{{t('form-fields.language')}}</div>
        <SelectControl stack :errors="form$v" v-model="form.language" :options="languages" errorField="language" data-field="language" />

        <div class="text-14 fw-500 mt-3 mb-2 label">{{t('form-fields.currency')}}</div>
        <InputControl disabled :errors="form$v" v-model="form.currency" :placeholder="t('form-fields.currency')" errorField="currency" data-field="currency" />

        <div class="text-14 fw-500 mt-3 mb-2 label">{{t('form-fields.total-amount-paid')}}</div>
        <InputControl disabled stack :errors="form$v" :modelValue="moneyFormat(form.total_amount_paid)" :placeholder="t('form-fields.total-amount-paid')" errorField="total_amount_paid" data-field="total_amount_paid" />
      </div>

      <div class="mt-4 d-flex justify-content-end">

        <button @click="router.push('/rechnung')" type="button" class="btn btn-outline-danger px-4">
          {{ t('button.cancel') }}
        </button>
        <button @click="saveInvoice" :disabled="savingStatus" type="button" class="btn btn-outline-dark px-4 mx-3">
          <span v-if="savingStatus" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          {{ t('button.save') }}
        </button>

        <PrimaryButton @click="goToPreview" class="px-4"> {{ t('button.preview') }} </PrimaryButton>
      </div>
    </div>
  </div>

</template>


<style lang="scss" scoped>
.introduction-text-field {
  input.form-control {
    border: 1px dashed #dddddd !important;
    border-radius: 4px;
  }

  input.form-control::placeholder {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.36);
    font-weight: 700;
  }
}

.label {
  color: #676b74;
}

.blue_box_statics {
  background-color: $secondary-color;
  border-radius: 5px;
  padding: 15px;

  .table {
    th,
    td {
      color: #d4e2fc;
    }

    .text-size-18 {
      font-size: 18px;
    }

    .text-size-20 {
      font-size: 20px;
    }

    .text-size-28 {
      font-size: 28px;
    }
  }
}

.v-middle {
  vertical-align: middle;
}

.signaturepad {
  background-color: #ffffff;
}
</style>
