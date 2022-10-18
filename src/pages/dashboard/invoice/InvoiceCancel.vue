<script setup>
import { reactive, ref, watch } from 'vue'
import BackButton from '../../../components/buttons/BackButton.vue'
import PrimaryButton from '../../../components/buttons/PrimaryButton.vue'
import InputControl from '../../../components/dashboard/form/InputControl.vue'
import FormSelect from "@/components/dashboard/shared/FormSelect.vue"
import CheckBox from '../../../components/dashboard/form/CheckBox.vue'
import StepFooter from './new-steps/StepFooter.vue'
import { capitalize } from '@/use/useUtil'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAxios, api } from '@/use/useAxios'
import { required, helpers } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import { apiBaseUrl } from '@/main'
import { useToast } from 'vue-toastification'
const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()
const toast = useToast()
const { data: invoiceData, loading } = useAxios(`admin/invoice/view/${route.params.id}`)
const { data: paymentMethods } = useAxios('paymentmethods')
const { data: generalInfo } = useAxios('admin/general-information')
const { data: cancleReason } = useAxios('admin/cancellation-reason')

const form = reactive({
  reason_id: '',
  payment_method: '',
  invoice_id: ''
})
const cancleNo = ref('')
const cancleId = ref('')
const goToInvoices = () => {
  router.push('/invoice')
}

// Step
const activeStep = ref({
  id: 1,
  name: t('billingSettings.cancellation-reason'),
})
const steps = ref([
  {
    id: 1,
    name: t('billingSettings.cancellation-reason'),
  },
  {
    id: 2,
    name: t('dashboard-invoice.refund'),
  },
  {
    id: 3,
    name: t('dashboard-invoice.publish-invoice'),
  },
])
// Validation
const reasonTab = {
  reason_id: { required: helpers.withMessage(t('dashboard-reservation.reason-is-required'), required) }
}
const refundTab = {
  payment_method: { required: helpers.withMessage(t('dashboard-reservation.payment-method-is-required'), required) }
}
const reason$v = useVuelidate(reasonTab, form)
const refund$v = useVuelidate(refundTab, form)
// Change Tab
const changeTab = async (id) => {
  if (id == 2) {
    const result = await reason$v.value.$validate()
    if (!result)
      return
  }
  activeStep.value = steps.value.find(step => step.id == id)
}
const onCancelInvoice = async () => {
  const result = await refund$v.value.$validate()
  if (!result) return
  try {
    const res = await api.post('/admin/invoicecancellation/store', form)
    cancleNo.value = res.data.cancellation_no
    cancleId.value = res.data.id
    changeTab(3)
  } catch (error) {
    console.error(error)
  }
}
// Print /PDF
const saveAsPdf = async () => {
  try {
    const res = await api.get(`admin/invoicecancellation/pdf/${cancleId.value}`)
    const url = `${apiBaseUrl}/${res.data.location}${res.data.file_name}`
    window.open(url)
  } catch (error) {
    console.error(error)
  }
}
// Mail send
const sendEmailForm = reactive({
  cc_me_status: false,
})
const emailId = ref([
  {
    cc_email: ''
  },
])
const addEmailId = () => {
  emailId.value.push({
    cc_email: "",
  })
}

const removeEmail = idx => {
  emailId.value.splice(idx, 1)
}

const sendEmailLoading = ref(false)
const sendEmail = async () => {
  try {
    sendEmailLoading.value = true
    const formData = new FormData()
    for (let i = 0; i < emailId.value.length; i++) {
      formData.append(`cc_email[${i}]`, emailId.value[i].cc_email ?? '')
    }
    formData.append('cc_me_status', sendEmailForm.cc_me_status)
    await api.post(`admin/invoicecancellation/cancellation-mail/${cancleId.value}`, formData)
    toast.success(`${t('toast.email-sent-successfully')}`)
    sendEmailForm.cc_me_status = false
    emailId.value = [{ cc_email: '' }]
  } catch (error) {
    console.error(error)
    toast.error(`${t('toast.email-sending-error')}`)
  } finally {
    sendEmailLoading.value = false
  }
}
watch(() => invoiceData.value, (data) => {
  form.invoice_id = data.invoicesinfo?.id
  form.payment_method = data.invoicesinfo.accepted_payment_method

  emailId.value[0].cc_email = data.invoicesinfo.customerinfo.email
})
</script>
<template>
  <Loading v-if="loading" class="my-3" />
  <template v-if="!loading && invoiceData?.invoicedetails && invoiceData?.invoicesinfo">
    <h6 class="d-flex align-items-center mb-4">
      <BackButton /> <span class="ms-3"> {{t('dashboard-reservation.invoices')}} </span>
    </h6>
    <h5 class="mb-4 py-2">{{t('dashboard-invoice.cancellation')}}</h5>
    <!-- Main Row Left/right -->
    <div class="borderd-content">
      <div class="row">
        <!-- Invoice Preview col -->
        <div class="col-xl-6">
          <div class="borderd-content invoice__content" style="border-radius: 4px 4px 0px 0px; border-bottom: none; font-size: 85%; ">
            <!-- Logo -->
            <div class="mt-4">
              <img :src="imageBaseUrl(`/logo/${invoiceData?.invoicesinfo?.logo}`)" alt="Logo" class="mt-3 mb-4" style="width: 132px;">
            </div>
            <!-- Dates -->
            <div class="d-flex justify-content-end">
              <div class="pe-3 text-right">
                <div class="text-12 fw-400 pb-2">{{ t('form-fields.invoice-date') }}:</div>
                <div class="text-12 fw-400 pb-2">{{ t('form-fields.due-date') }}:</div>
                <div class="text-12 fw-400 pb-2">{{ t('form-fields.invoice-no') }}:</div>
              </div>
              <div class="">
                <div class="text-12 ta-r fw-400 pb-2">
                  {{ moment(invoiceData?.invoicesinfo?.invoice_date).format('DD.MM.YYYY') }}
                </div>
                <div class="text-12 ta-r fw-400 pb-2">
                  {{ moment(invoiceData?.invoicesinfo?.due_date).format('DD.MM.YYYY') }}
                </div>
                <div class="text-12 ta-r fw-400 pb-2">
                  {{invoiceData?.invoicesinfo?.invoice_no}}
                </div>
              </div>
            </div>
            <!-- Company info -->
            <div class="text-14 fw-400">
              <span v-if="invoiceData?.invoicesinfo?.compnay_name">{{ invoiceData?.invoicesinfo?.compnay_name }}</span>
              <span v-if="invoiceData?.invoicesinfo?.street">, {{ invoiceData?.invoicesinfo?.street }}</span>
              <span v-if="invoiceData?.invoicesinfo?.postcode">,{{ invoiceData?.invoicesinfo?.postcode }} </span>
              <span v-if="invoiceData?.invoicesinfo?.city">{{" "}}{{ invoiceData?.invoicesinfo?.city }}</span>
            </div>
            <!-- Customer Info -->
            <div class="mt-2">
              <p class="mb-0" v-if="invoiceData?.invoicesinfo?.customerinfo?.full_name">{{
              invoiceData?.invoicesinfo?.customerinfo?.full_name }}</p>
              <p class="mb-0" v-if="invoiceData?.invoicesinfo?.customerinfo?.address">{{
              invoiceData?.invoicesinfo?.customerinfo?.address }}</p>
              <p class="mb-0">
                <span v-if="invoiceData?.invoicesinfo?.customerinfo?.zip">{{
                invoiceData?.invoicesinfo?.customerinfo?.zip }}
                  {{' '}}</span>
                <span v-if="invoiceData?.invoicesinfo?.customerinfo?.city">{{
                invoiceData?.invoicesinfo?.customerinfo?.city
                }}</span>
              </p>
            </div>
            <h5 class="mt-5 mb-4">{{t('dashboard-invoice.cancellation-invoice')}}
              {{invoiceData?.invoicesinfo?.invoice_no}}</h5>
            <!-- <p>We will credit you the following amount from invoice {{ invoiceData?.invoicesinfo?.invoice_no }} dated {{
            moment(invoiceData?.invoicesinfo?.invoice_date).format('DD.MM.YYYY') }}:</p> -->
            <p v-if="locale == 'de'">Wir werden Ihnen den folgenden Betrag aus der Rechnung {{ invoiceData?.invoicesinfo?.invoice_no }} vom {{ moment(invoiceData?.invoicesinfo?.invoice_date).format('DD.MM.YYYY') }} gutschreiben::</p>
            <p v-else>We will credit you the following amount from invoice {{ invoiceData?.invoicesinfo?.invoice_no }} dated {{ moment(invoiceData?.invoicesinfo?.invoice_date).format('DD/MM/YYYY') }}:</p>

            <p class="text-12 fw-400">{{ invoiceData?.invoicesinfo?.introduction_text }}</p>
            <table class="table table-borderless rounded overflow-hidden">
              <thead class="bg-black text-white">
                <tr>
                  <th class="p-3">{{ t('form-fields.description') }}</th>
                  <th class="p-3">{{ t('form-fields.quantity') }}</th>
                  <th class="p-3">{{ t('form-fields.unit') }}</th>
                  <th class="p-3">{{ t('form-fields.price') }}</th>
                  <th class="p-3">{{ t('form-fields.total-net') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(line, ii) in invoiceData.invoicedetails" :key="ii" :style="{background: ii % 2 == 0 ? '#f6f7fb' : '#eee'}">
                  <td class="p-4" style="width: 250px;">{{ line.description }}</td>
                  <td class="p-4">{{ line.quantity }}</td>
                  <td class="p-4">{{ capitalize(line.unit.split('_')[0]) }}</td>
                  <td class="p-4 nowrap">-{{ moneyFormat(line.rate) }}</td>
                  <td class="p-4 nowrap">-{{ moneyFormat(line.amount) }}</td>
                </tr>
              </tbody>
            </table>
            <div class="total-summary my-4">
              <div class="row mb-2">
                <div class="col-md-10">
                  <div class="text-12 fw-400 text-right" style="color: rgba(0,0,0,0.6);">{{t('form-fields.subtotal')}}
                  </div>
                </div>
                <div class="col-md-2">
                  <div class="text-12 fw-500 text-right">-{{ moneyFormat(invoiceData?.invoicesinfo?.sub_total) }}</div>
                </div>
              </div>
              <div class="row pb-1 mb-2">
                <div class="col-md-10">
                  <div class="text-12 fw-400 text-right" style="color: rgba(0,0,0,0.6);">{{t('form-fields.discount')}}
                  </div>
                </div>
                <div class="col-md-2">
                  <div class="text-12 fw-500 text-right">-{{moneyFormat(invoiceData?.invoicesinfo?.discount_amount)}}
                  </div>
                </div>
              </div>
              <div class="row pb-1 mb-4">
                <div class="col-md-10">
                  <div class="text-12 fw-400 text-right" style="color: rgba(0,0,0,0.6);">{{t('form-fields.tax')}}({{
                  invoiceData?.invoicesinfo?.tax }}%)</div>
                </div>
                <div class="col-md-2">
                  <div class="text-12 fw-500 text-right">-{{ moneyFormat(invoiceData?.invoicesinfo?.tax_amount) }}</div>
                </div>
              </div>
              <div class="d-flex justify-content-end">
                <div class="bg-dark text-white d-flex align-items-center justify-content-between" style="border-radius: 4px; padding: 10px 22px;">
                  <span class="text-14 fw-700 me-5">{{t('form-fields.grand-total')}}</span>
                  <span class="text-22 fw-700">-{{ moneyFormat(invoiceData?.invoicesinfo?.grand_total) }}</span>
                </div>
              </div>
            </div>
            <p class="text-12 fw-400">{{ invoiceData?.invoicesinfo?.final_text }}</p>
            <p class="mt-5">{{t('dashboard-invoice.para-1')}} <br>
              {{t('dashboard-invoice.para-2')}}.</p>
          </div>
          <!-- Footer -->
          <StepFooter :info="{info: generalInfo}" />
        </div>
        <div class="col-xl-6 mx-auto">
          <!-- Stepper -->
          <div class="stepper_wrapper my-4">
            <div v-for="(step, i) in steps" :key="i" @click="changeTab(step.id)" class="step" :class="{'active': step.id <= activeStep.id }">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 2C19.713 2 23.274 3.475 25.8995 6.1005C28.525 8.72601 30 12.287 30 16C30 19.713 28.525 23.274 25.8995 25.8995C23.274 28.525 19.713 30 16 30C12.287 30 8.72601 28.525 6.1005 25.8995C3.475 23.274 2 19.713 2 16C2 12.287 3.475 8.72601 6.1005 6.1005C8.72601 3.475 12.287 2 16 2ZM14.256 18.762L11.146 15.65C11.0345 15.5385 10.9021 15.4501 10.7565 15.3897C10.6108 15.3294 10.4547 15.2983 10.297 15.2983C10.1393 15.2983 9.9832 15.3294 9.83752 15.3897C9.69185 15.4501 9.55949 15.5385 9.448 15.65C9.22283 15.8752 9.09633 16.1806 9.09633 16.499C9.09633 16.8174 9.22283 17.1228 9.448 17.348L13.408 21.308C13.5192 21.4201 13.6514 21.509 13.7972 21.5697C13.9429 21.6304 14.0992 21.6616 14.257 21.6616C14.4148 21.6616 14.5711 21.6304 14.7168 21.5697C14.8626 21.509 14.9948 21.4201 15.106 21.308L23.306 13.106C23.419 12.995 23.5089 12.8627 23.5705 12.7167C23.6321 12.5708 23.6641 12.4141 23.6649 12.2557C23.6656 12.0973 23.635 11.9403 23.5748 11.7938C23.5145 11.6473 23.4259 11.5142 23.3139 11.4021C23.202 11.29 23.069 11.2012 22.9225 11.1408C22.7761 11.0804 22.6191 11.0496 22.4607 11.0501C22.3023 11.0507 22.1456 11.0826 21.9996 11.144C21.8536 11.2054 21.7212 11.2951 21.61 11.408L14.256 18.762Z" fill="#DDDDDD" />
              </svg>
              <p class="mt-2">{{ step.name }}</p>
            </div>
          </div>
          <div class="card">
            <div class="card-header text-center">
              <div class="text-16 fw-400 pb-1">Amount paid out</div>
              <div class="text-40 fw-500">{{ moneyFormat(invoiceData?.invoicesinfo?.total_amount_paid) }}</div>
            </div>
            <div class="card-body">
              <!-- Cancellation reason -->
              <div v-if="activeStep.id == 1">
                <div class="mx-xl-4">
                  <div class="text-16 fw-400 pb-2">{{t('billingSettings.cancellation-reason')}}</div>
                  <FormSelect v-model="form.reason_id" :frontError="reason$v" errorField="reason_id" placeholder="Please choose" :options="cancleReason?.reasondata || []" displayProperty="reason_name" valueProperty="id" no-border>
                  </FormSelect>
                </div>
                <PrimaryButton variant="dark" @click="changeTab(2)" class="w-100 mt-4">{{t('button.next')}}
                </PrimaryButton>
              </div>
              <!-- Refund -->
              <div v-if="activeStep.id == 2">
                <div v-if="invoiceData?.invoicesinfo?.total_amount_paid">
                  <div class="text-16 fw-400 pb-2">{{t('form-fields.payment-method')}}</div>
                  <FormSelect v-model="form.payment_method" :frontError="refund$v" errorField="payment_method" placeholder="Please choose" :options="paymentMethods || []" displayProperty="name" valueProperty="id" no-border>
                  </FormSelect>
                </div>
                <div v-else class="text-center pb-4">
                  <div class="text-16 fw-400" style="color: rgba(0,0,0,0.6)">
                    {{t('dashboard-invoice.this-invoice-had-no-payments')}}.</div>
                </div>
                <PrimaryButton variant="dark" @click="onCancelInvoice" :loading="cancellingState" class="w-100 mt-4">
                  {{t('button.cancel')}} {{t('billingSettings.invoice')}}</PrimaryButton>
              </div>
              <!-- Publish invoice -->
              <div v-if="activeStep.id == 3">
                <div v-if="invoiceData?.invoicesinfo?.total_amount_paid" class="icon text-center mb-4">
                  <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="36" cy="36" r="36" fill="#46B276" fill-opacity="0.16" />
                    <path d="M35.6537 16.6152C40.703 16.6152 45.5455 18.6575 49.1159 22.2929C52.6863 25.9282 54.6922 30.8587 54.6922 35.9998C54.6922 41.141 52.6863 46.0715 49.1159 49.7068C45.5455 53.3422 40.703 55.3845 35.6537 55.3845C30.6044 55.3845 25.7619 53.3422 22.1915 49.7068C18.6211 46.0715 16.6152 41.141 16.6152 35.9998C16.6152 30.8587 18.6211 25.9282 22.1915 22.2929C25.7619 18.6575 30.6044 16.6152 35.6537 16.6152ZM33.282 39.8242L29.0528 35.5152C28.9012 35.3609 28.7212 35.2384 28.5231 35.1549C28.325 35.0713 28.1127 35.0283 27.8982 35.0283C27.6838 35.0283 27.4715 35.0713 27.2734 35.1549C27.0753 35.2384 26.8953 35.3609 26.7437 35.5152C26.4375 35.827 26.2655 36.2499 26.2655 36.6908C26.2655 37.1317 26.4375 37.5545 26.7437 37.8663L32.1289 43.3494C32.2801 43.5045 32.4599 43.6277 32.6581 43.7117C32.8562 43.7957 33.0688 43.839 33.2834 43.839C33.4981 43.839 33.7106 43.7957 33.9088 43.7117C34.1069 43.6277 34.2868 43.5045 34.438 43.3494L45.5891 31.9928C45.7427 31.839 45.8649 31.6559 45.9487 31.4538C46.0325 31.2517 46.0761 31.0348 46.0771 30.8154C46.0781 30.5961 46.0364 30.3787 45.9545 30.1759C45.8726 29.973 45.7521 29.7887 45.5998 29.6335C45.4476 29.4783 45.2667 29.3554 45.0676 29.2717C44.8684 29.1881 44.655 29.1454 44.4396 29.1462C44.2242 29.1469 44.011 29.1911 43.8125 29.2762C43.6139 29.3612 43.4338 29.4854 43.2827 29.6417L33.282 39.8242Z" fill="#46B276" />
                  </svg>
                  <div class="text-center pb-4">
                    <div class="text-16 fw-400" style="color: rgba(0,0,0,0.6)">Cancellation <span class="text-primary">{{ cancleNo }}</span> was successfully created.</div>
                  </div>
                </div>
                <div v-else class="text-muted">
                  <p>{{t('billingSettings.cancellation-reason')}}: Client complain</p>
                  <p>{{t('form-fields.payment-method')}}: {{t('dashboard-invoice.this-invoice-had-no-payment')}}.</p>
                </div>
                <PrimaryButton variant="dark" @click="goToInvoices" class="w-100 mt-4">
                  {{t('dashboard-payment.go-to-invoices')}}</PrimaryButton>
              </div>
            </div>
          </div>
          <!-- Print / PDF / Email  -->
          <!-- Only show on publish invoice -->
          <div v-if="activeStep.id == 3" class="mt-5 mx-4 mx-xl-5">
            <PrimaryButton @click="saveAsPdf" class="w-100">
              <svg class="me-2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 9V2H18V9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M6 18H4C3.46957 18 2.96086 17.7893 2.58579 17.4142C2.21071 17.0391 2 16.5304 2 16V11C2 10.4696 2.21071 9.96086 2.58579 9.58579C2.96086 9.21071 3.46957 9 4 9H20C20.5304 9 21.0391 9.21071 21.4142 9.58579C21.7893 9.96086 22 10.4696 22 11V16C22 16.5304 21.7893 17.0391 21.4142 17.4142C21.0391 17.7893 20.5304 18 20 18H18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M18 14H6V22H18V14Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              {{ t('button.print') }}
            </PrimaryButton>
            <PrimaryButton @click="saveAsPdf" variant="light" class="w-100 mt-4">
              <svg class="me-2" width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.5 15V19C21.5 19.5304 21.2893 20.0391 20.9142 20.4142C20.5391 20.7893 20.0304 21 19.5 21H5.5C4.96957 21 4.46086 20.7893 4.08579 20.4142C3.71071 20.0391 3.5 19.5304 3.5 19V15" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M7.5 10L12.5 15L17.5 10" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M12.5 15V3" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              {{ t('button.save-as-pdf') }}
            </PrimaryButton>
            <!-- Mail section -->
            <div class="mt-5">
              <div v-for="(email, idx) in emailId" :key="idx" class="email__item mb-1">
                <InputControl v-model="email.cc_email" type="email" placeholder="Example@mail.com" />

                <!-- Remove Icon -->
                <svg v-if="emailId.length !== 1" @click="removeEmail(idx)" class="remove_icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 4H3.33333H14" stroke="#F23E3D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M5.33301 3.99967V2.66634C5.33301 2.31272 5.47348 1.97358 5.72353 1.72353C5.97358 1.47348 6.31272 1.33301 6.66634 1.33301H9.33301C9.68663 1.33301 10.0258 1.47348 10.2758 1.72353C10.5259 1.97358 10.6663 2.31272 10.6663 2.66634V3.99967M12.6663 3.99967V13.333C12.6663 13.6866 12.5259 14.0258 12.2758 14.2758C12.0258 14.5259 11.6866 14.6663 11.333 14.6663H4.66634C4.31272 14.6663 3.97358 14.5259 3.72353 14.2758C3.47348 14.0258 3.33301 13.6866 3.33301 13.333V3.99967H12.6663Z" stroke="#F23E3D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
              <div class="d-flex justify-content-end">
                <button class="base-btn fleet-form__check-btn py-1 pe-0 text-10 me-4 text-primary" @click="addEmailId">
                  + {{t('form-fields.add-recipient')}}
                </button>
              </div>
              <CheckBox v-model="sendEmailForm.cc_me_status" :label="t('form-fields.cc-me')" style="display: block" />
              <PrimaryButton variant="light" class="w-100 mt-4" @click="sendEmail" :loading="sendEmailLoading">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_4203_5677)">
                    <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6ZM20 6L12 10.99L4 6H20ZM20 18H4V8L12 13L20 8V18Z" fill="black" fill-opacity="0.5" />
                  </g>
                  <defs>
                    <clipPath id="clip0_4203_5677">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                {{ t('button.send-email') }}
              </PrimaryButton>
              <!-- <p class="text-12 fst-italic fw-lighter mt-2 mb-0">{{ t('dashboard-invoice.successfully-sent-on') }} 23,
                May 2022 03:44 PM</p> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
</template>
<style lang="scss" scoped>
.email__item {
  position: relative;
  .remove_icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: calc(100% + 7px);
    cursor: pointer;
  }
}

.stepper_wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
  width: 540px;

  .step {
    text-align: center;
    width: 150px;
    position: relative;

    &:not(:last-child)::after {
      content: "";
      width: 80px;
      height: 1px;
      background: #ddd;
      position: absolute;
      left: 90%;
      top: 15px;
    }

    &.active {
      color: #46b276;

      svg path {
        fill: #46b276;
      }
    }
  }
}

.invoice-out-padding {
  padding: 2rem;
}

.table_wrapper {
  thead {
    letter-spacing: 0.7px;

    tr {
      padding: 0;

      th {
        .span {
          background-color: #000000;
          display: block;
          padding: 15px;
        }

        padding: 0;
      }
    }

    tr:first-child th:first-child .span {
      border-top-left-radius: 5px;
    }

    tr:last-child th:last-child .span {
      border-top-right-radius: 5px;
      text-align: right;
    }
  }

  tbody {
    // Even Odd
    tr.even td .span {
      background-color: #eeeeee;
    }

    tr.odd td .span {
      background-color: #f6f7fb;
    }

    // Even Odd
    tr.even_row td .span {
      background-color: #eeeeee;
    }

    tr.odd_row td .span {
      background-color: #f6f7fb;
    }

    // reset
    tr {
      padding: 0;

      td {
        padding: 0;

        .span {
          padding: 13px;
          display: block;
          text-align: right;
        }
      }
    }

    // Left right color
    tr {
      td:first-child {
        .span {
          border-left: 1px solid #dddddd;
        }
      }

      td:last-child {
        .span {
          border-right: 1px solid #dddddd;
        }
      }
    }

    // Bottom border
    tr:last-child .span {
      border-bottom: 1px solid #dddddd;
    }

    // Border radius
    tr:last-child td:first-child .span {
      border-bottom-left-radius: 5px;
      overflow: hidden;
    }

    tr:last-child td:last-child .span {
      border-bottom-right-radius: 5px;
      overflow: hidden;
    }
  }
}

#print_area.border-content {
  // border-bottom: 1px solid transparent;
  border-bottom: none !important;
  border-radius: 5px 5px 0px 0px !important;
}

.footer {
  border: 1px solid #ddd;
  border-top: none !important;
  border-radius: 0px 0px 5px 5px;
}

.divider {
  width: 90px;
  height: 1px;
}

.card {
  background: #ffffff;
  box-shadow: 0px 0px 35px rgba(0, 0, 0, 0.09);
  border-radius: 4px;
  border: none !important;

  .card-header {
    background: rgba(204, 206, 209, 0.32);
    border-radius: 4px 4px 0px 0px;
    padding: 20px 20px 8px 20px;
    border: none;

    .text-40 {
      font-size: 40px;
    }
  }

  .card-body {
    padding: 40px 60px 30px 60px;
  }
}
</style>
