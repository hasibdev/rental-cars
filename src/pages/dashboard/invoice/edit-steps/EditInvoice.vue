<script setup>
import { ref, defineProps, watch, computed, defineEmits } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import InputControl from "@/components/dashboard/form/InputControl.vue"
import CalenderControl from "@/components/dashboard/form/CalenderControl.vue"
import SelectControl from "@/components/dashboard/form/SelectControl.vue"
import RadioControl from '@/components/dashboard/form/RadioControl.vue'
import RepeatableItem from '@/components/dashboard/RepeatableItemDark.vue'
import FormSelect from "@/components/dashboard/shared/FormSelect.vue"
import TextControl from '@/components/dashboard/form/TextControl.vue'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import StepFooter from '../new-steps/StepFooter.vue'
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
const { edit, formCustomer } = useInvoiceStore()

const rentForOptions = computed(() => [
  { label: t('form-fields.day'), value: 'day_rate' },
  { label: t('form-fields.week'), value: 'week_rate' },
  { label: t('form-fields.month'), value: 'month_rate' },
])

const { t, locale } = useI18n({ useScope: 'global' })

const { data: reservations, reFetch, loading } = useAxios('admin/invoice/reservation')
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
    component: 'InputControl',
    width: "180px",
    props: {
      placeholder: t('form-fields.price'),
    }
  },
  {
    label: t('form-fields.total-net'),
    name: "amount",
    width: "180px",
    component: 'InputControl',
    props: {
      placeholder: t('form-fields.amount'),
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
  edit.lines.push({ ...f })
}

// Resrvation
const getReservation = (val) => {
  reFetch(`admin/invoice/reservation?reservation_no=${val}`)
}

// Fetch invoice
const loadingInvoice = ref(false)
const fetchInvoice = async () => {
  try {
    loadingInvoice.value = true
    const res = await api.get(`admin/invoice/edit/${route.params.id}`)
    Object.assign(edit, res.data.invoiceinfo)
    edit.reservation_id = res.data.invoiceinfo.reservation_id

    linesCopy.value = res.data.invoicedeatils.map(line => ({
      ...line,
      rate: deCurrency(line.rate),
      amount: deCurrency(line.amount),
    }))
    edit.lines = res.data.invoicedeatils
  } catch (error) {
    //
  } finally {
    loadingInvoice.value = false
  }
}
fetchInvoice()

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

const form$v = useVuelidate(formRules, edit)

// Watch Reservation id
watch(() => edit.reservation_id, (rid) => {
  if (!reservations.value) return

  const find = reservations.value.resarvations.data.find(r => r.id == rid)

  // Customer
  formCustomer.full_name = find.full_name
  formCustomer.phone = find.phone
  formCustomer.email = find.email
  formCustomer.country = find.country
  formCustomer.province = find.province
  formCustomer.city = find.city
  formCustomer.address = find.address
  formCustomer.zip = find.zip

})

// Sub total
const getSubTotal = computed(() => {
  return edit.lines.reduce((acc, item) => {
    return acc += Number(item.amount)
  }, 0)
})
watch(() => getSubTotal.value, (val) => {
  edit.sub_total = val
})

const getDiscountAmount = computed(() => {
  const d = Number(edit.discount)
  const discount = edit.discount_type == 'Round' ? d : (getSubTotal.value / 100) * d

  return discount
})
watch(() => getDiscountAmount.value, (val) => {
  edit.discount_amount = val
})

// Grand Total
const getGrandTotal = computed(() => {
  return (Number(getSubTotal.value) - Number(edit.discount_amount)) + Number(edit.tax_amount)
})
watch(() => getGrandTotal.value, (val) => {
  edit.grand_total = val
})

const onLineChange = ({ item, index }) => {
  const total = Number(item.quantity) * Number(item.rate)
  edit.lines[index].amount = total
  linesCopy.value[index].amount = deCurrency(total)
}


watch(() => [edit.invoice_date, edit.payment_term], ([invoiceDate, termId]) => {
  const find = paymentTerms.value?.find(pt => pt.id == termId)
  if (find)
    edit.due_date = moment(invoiceDate).add(find.days, 'days').format('YYYY-MM-DD')
})

const setTaxAmount = () => {
  edit.tax_amount = ((edit.sub_total - edit.discount_amount) / 100) * edit.tax
}
const onVatRateChange = (val) => {
  if (val == 'excl-vat') {
    edit.tax_amount = 0
  } else {
    setTaxAmount()
  }
}


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
            <div class="text-10 fw-400 pb-2">{{ t('form-fields.invoice-date') }}:</div>
          </div>
          <div class="">
            <div class="text-10 fw-400 pb-2">
              {{ moment(edit.invoice_date).format('DD.MM.YYYY') }}
            </div>
          </div>
        </div>
        <div class="d-flex justify-content-end">
          <div class="pe-2 text-right">
            <div class="text-10 fw-400 pb-2">{{ t('form-fields.due-date') }}:</div>
          </div>
          <div class="">
            <div class="text-10 fw-400 pb-2">
              {{ moment(edit.due_date).format('DD.MM.YYYY') }}
            </div>
          </div>
        </div>

        <!-- Company info -->
        <div class="text-6 fw-400" style="width: 170px">
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

        <div class="text-20 fw-700 my-5">{{ t('form-fields.invoice') }} {{edit.invoice_no}}</div>
        <div class="dashed-text-field w-75 mb-3">
          <InputControl v-model="edit.introduction_text" :placeholder="t('dashboard-invoice.introductory-text')" class="" />
        </div>
        <div class="list">
          <RepeatableItem :fields="fields" v-model:items="edit.lines" @input="onLineChange">
            <template #rate="{item, index}">
              <CurrencyControl v-model="edit.lines[index].rate" v-model:currency="linesCopy[index].rate" @update:modelValue="onLineChange({item,index})" />
            </template>
            <template #amount="{item, index}">
              <CurrencyControl :disabled="true" v-model="edit.lines[index].amount" v-model:currency="linesCopy[index].amount" @update:modelValue="onLineChange({item,index})" />
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
              <div class="text-12 fw-500 text-right">{{ deCurrency(edit.sub_total) }}</div>
            </div>
          </div>
          <div class="row pb-1 mb-2">
            <div class="col-md-10">
              <div class="text-12 fw-400 text-right" style="color: rgba(0,0,0,0.6);">{{t('form-fields.discount')}}</div>
            </div>
            <div class="col-md-2">
              <div class="text-12 fw-500 text-right">{{deCurrency(edit.discount_amount)}}</div>
            </div>
          </div>
          <div class="row pb-1 mb-4">
            <div class="col-md-10">
              <div class="text-12 fw-400 text-right" style="color: rgba(0,0,0,0.6);">{{t('form-fields.tax')}}({{
              edit.tax }}%)</div>
            </div>
            <div class="col-md-2">
              <div class="text-12 fw-500 text-right">{{ deCurrency(edit.tax_amount) }}</div>
            </div>
          </div>
          <div class="d-flex justify-content-end">
            <div class="bg-dark text-white d-flex align-items-center justify-content-between" style="border-radius: 4px; padding: 10px 22px;">
              <span class="text-14 fw-700 me-5">{{t('form-fields.grand-total')}}</span>
              <span class="text-22 fw-700">{{ deCurrency(edit.grand_total) }}</span>
            </div>
          </div>
        </div>
        <div class="pb-4">
          <div class="text-12 fw-400 pb-2">{{ t('dashboard-invoice.thankyou-text') }}</div>
          <!-- <div class="text-12 fw-400">{{ t('dashboard-invoice.total-amount-is-payable-until') }} {{moment(edit.due_date).format('DD MMM YYYY')}}. </div> -->
          <div class="text-12 fw-400" v-if="locale == 'de'">Der Gesamtbetrag ist <span v-if="edit.accepted_payment_method">{{edit.accepted_payment_method}}</span> zu zahlen bis
            {{moment(edit.due_date).format('DD.MM.YYYY')}}.
          </div>
          <div class="text-12 fw-400" v-else>The total amount is payable <span v-if="edit.accepted_payment_method">by {{edit.accepted_payment_method}}</span> until
            {{moment(edit.due_date).format('DD/MM/YYYY')}}.
          </div>
        </div>
        <div class="w-50 dashed-text-field mb-4">
          <div class="text-12 fw-700" style="color: rgba(0,0,0,0.6);">{{ t('dashboard-invoice.terms-and-conditions') }}
          </div>
          <TextControl v-model="edit.termas_conditions" :placeholder="t('dashboard-invoice.terms-and-conditions')" class="mt-2"></TextControl>
        </div>
        <div class="dashed-text-field w-75 mb-5">
          <InputControl v-model="edit.final_text" :placeholder="t('dashboard-invoice.final-text')" class="" />
        </div>
      </div>
      <!-- Footer -->
      <StepFooter :info="props" />
    </div>
    <div class="mb-4" style="width: 350px; margin-left: 60px;">
      <div class="borderd-content">
        <div class="text-18 fw-700 mb-4">{{t('form-fields.basic-info')}}</div>
        <div class="text-14 fw-500 mb-2 label">{{t('form-fields.reservation-id')}}</div>
        <FormSelect disabled v-model="edit.reservation_id" :frontError="form$v" :searching="loading" errorField="reservation_id" :options="reservations?.resarvations.data || []" variant="dark" displayProperty="reservation_no" valueProperty="id" :placeholder="t('form-fields.reservation-id')" search :search-placeholder="t('Accident.reservation-id')" no-border @search="getReservation">
        </FormSelect>

        <div class="text-14 fw-500 mt-3 mb-2 label">{{t('form-fields.billed-to')}}</div>
        <InputControl stack disabled v-model="formCustomer.full_name" :placeholder="t('form-fields.customer-name')" class="" />
        <div class="text-14 fw-500 mt-3 mb-2 label">{{t('form-fields.invoice-no')}}</div>
        <InputControl stack disabled v-model="edit.invoice_no" placeholder="WSY-00008" class="" />
        <div class="text-14 fw-500 mt-3 mb-2 label">{{t('form-fields.invoice-date')}}</div>
        <CalenderControl stack :errors="form$v" v-model="edit.invoice_date" :placeholder="t('form-fields.invoice-date')" errorField="invoice_date" data-field="invoice_date" />
        <div class="text-14 fw-500 mt-3 mb-2 label">{{t('form-fields.payment-term')}}</div>
        <SelectControl stack :errors="form$v" v-model="edit.payment_term" :options="paymentTerms || []" optionLabel="paymentterms_name" errorField="payment_term" data-field="payment_term" />
        <div class="text-14 fw-500 mt-3 mb-2 label">{{t('form-fields.accepted-payment-method')}}</div>
        <SelectControl stack :errors="form$v" v-model="edit.accepted_payment_method" :options="payMethods ?? []" optionLabel="name" errorField="accepted_payment_method" data-field="accepted_payment_method" />
        <div class="text-14 fw-500 mt-3 mb-2 label">{{t('form-fields.price-rate')}}</div>

        <RadioControl v-model="edit.price_rate_status" name="price_rate_status" @update:modelValue="onVatRateChange" :options="priceRateOptions" class="mb-3" />

        <div class="row">
          <div class="col-6">
            <p class="mb-1 text-14 fw-500 mt-3 mb-2 label">{{ t('form-fields.vat') }}</p>
            <div class="input-group">
              <input v-model="edit.tax" type="number" @input="setTaxAmount" :disabled="edit.price_rate_status == 'excl-vat'" class="form-control" :placeholder="t('form-fields.vat')">
              <span class="input-group-text" id="basic-addon2">%</span>
            </div>
          </div>
          <div class="col-6">
            <p class="mb-1 text-14 fw-500 mt-3 mb-2 label">{{ t('form-fields.discount') }}</p>
            <div class="input-group">
              <input v-model="edit.discount" type="number" class="form-control" :placeholder="t('form-fields.discount')">
              <span class="input-group-text" id="basic-addon2"> {{ edit.discount_type == 'Round' ? '€': '%' }}</span>
            </div>
          </div>
        </div>

        <div class="text-14 fw-500 mt-3 mb-2 label">{{t('form-fields.language')}}</div>
        <SelectControl stack :errors="form$v" v-model="edit.language" :options="languages" errorField="language" data-field="language" />

        <div class="text-14 fw-500 mt-3 mb-2 label">{{t('form-fields.currency')}}</div>
        <InputControl disabled :errors="form$v" v-model="edit.currency" :placeholder="t('form-fields.currency')" errorField="currency" data-field="currency" />

        <div class="text-14 fw-500 mt-3 mb-2 label">{{t('form-fields.total-amount-paid')}}</div>
        <InputControl disabled stack :errors="form$v" v-model="edit.total_amount_paid" :placeholder="t('form-fields.total-amount-paid')" errorField="total_amount_paid" data-field="total_amount_paid" />
      </div>

      <div class="mt-4 d-flex justify-content-end">

        <button @click="router.push('/rechnung')" type="button" class="btn btn-outline-danger px-4">
          {{ t('button.cancel') }}
        </button>
        <button @click="saveInvoice" :disabled="savingStatus" type="button" class="btn btn-outline-dark px-4 mx-3">
          <span v-if="savingStatus" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          {{ t('button.update') }}
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
