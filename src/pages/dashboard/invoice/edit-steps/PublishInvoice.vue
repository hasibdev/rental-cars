<script setup>
import { defineProps, ref, reactive, defineEmits, watch } from 'vue'
import moment from 'moment'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import CalenderControl from '@/components/dashboard/form/CalenderControl.vue'
import InputRightIcon from '@/components/dashboard/form/InputRightIcon.vue'
import ModalControl from '@/components/common/modals/ModalControl.vue'
import CheckBox from '@/components/dashboard/form/CheckBox.vue'
import { useI18n } from 'vue-i18n'
import { useAxios, api } from '@/use/useAxios'
import { useRoute, useRouter } from 'vue-router'
import VuePdfEmbed from 'vue-pdf-embed'

import { useToast } from 'vue-toastification'
import fileDownload from 'js-file-download'

defineEmits(['changeTab', 'save'])
defineProps({
  info: {
    type: Object
  },
  savingStatus: {
    type: Boolean,
    default: () => false
  }
})

const route = useRoute()
const router = useRouter()
const toast = useToast()

const { data: invoiceData, loading, reFetch } = useAxios(`admin/invoice/view/${route.params.id}`)

const { t } = useI18n({ useScope: 'global' })

// Payment methods
const paymentMethods = ref([])
const getPaymentMethods = async () => {
  try {
    const res = await api.get(`/paymentmethods`)
    paymentMethods.value = res.data
  } catch (err) {
    console.error(err)
  }
}
getPaymentMethods()

// Print / PDF
const pdfBlogUrl = ref('')
const fetchPDF = async () => {
  try {
    const res = await api.get(`admin/invoice/pdf/${route.params.id}`, {
      responseType: 'blob'
    })

    pdfBlogUrl.value = window.URL.createObjectURL(res.data)
  } catch (error) {
    //
  }
}

const loadingPrint = ref(false)
const loadingSaveasPdf = ref(false)

const pdfFrame = ref(null)
const Print = async () => {
  pdfFrame.value.print()
}

const SaveAsPdf = async (inv_no, first_name, last_name) => {
  try {
    loadingSaveasPdf.value = true
    const res = await api.get(`admin/invoice/pdf/${route.params.id}`, {
      responseType: 'blob',
    })

    fileDownload(res.data, `Rechnung_${inv_no}_${first_name}_${last_name}.pdf`)

  } catch (error) {
    console.error(error)
  } finally {
    loadingSaveasPdf.value = false
  }
}

const sendEmailLoading = ref(false)
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


const sendEmail = async () => {
  try {
    sendEmailLoading.value = true
    const formData = new FormData()
    for (let i = 0; i < emailId.value.length; i++) {
      formData.append(`cc_email[${i}]`, emailId.value[i].cc_email ?? '')
    }
    formData.append('cc_me_status', sendEmailForm.cc_me_status)
    await api.post(`admin/invoice/invoice-mail/${route.params.id}`, formData)
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


// Payments
const paymentForm = reactive({
  invoice_id: '',
  invoice_no: '',
  custome_id: '',
  amount: '',
  payment_date: moment(new Date()).format('YYYY/MM/DD'),
  payment_method: '',
  due_amount: '',
})
const amountCurrency = ref('')

const paymentLoading = ref(false)
const paymentSuccess = ref(false)
const showPaymentModal = ref(false)

const submitPayment = async () => {
  try {
    paymentLoading.value = true
    await api.post(`admin/paymentregister/store`, paymentForm)

    paymentSuccess.value = true
    paymentForm.amount = 0
    reFetch()
  } catch (error) {
    //
  } finally {
    paymentLoading.value = false
  }
}

const openPaymentModal = (invoice) => {
  showPaymentModal.value = true

  paymentForm.invoice_id = invoice.id
  paymentForm.invoice_no = invoice.invoice_no
  paymentForm.custome_id = invoice.customer_id
  paymentForm.payment_method = invoice.accepted_payment_method
  paymentForm.due_amount = invoice.due_amount
}

watch(() => invoiceData.value, (newData) => {
  emailId.value[0].cc_email = newData.invoicesinfo.customerinfo.email

  fetchPDF()
})
</script>

<template>
  <div v-if="!loading" class="d-flex justify-content-center flex-wrap w-100 scrollbar">
    <div class="mb-4" style="width: 596px;">
      <VuePdfEmbed ref="pdfFrame" :source="pdfBlogUrl" class="invoice_print" />
    </div>
    <div class="mb-4 px-4" style="width: 350px; margin-left: 60px;">
      <PrimaryButton class="w-100" @click="Print" :loading="loadingPrint">
        <svg class="me-2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 9V2H18V9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M6 18H4C3.46957 18 2.96086 17.7893 2.58579 17.4142C2.21071 17.0391 2 16.5304 2 16V11C2 10.4696 2.21071 9.96086 2.58579 9.58579C2.96086 9.21071 3.46957 9 4 9H20C20.5304 9 21.0391 9.21071 21.4142 9.58579C21.7893 9.96086 22 10.4696 22 11V16C22 16.5304 21.7893 17.0391 21.4142 17.4142C21.0391 17.7893 20.5304 18 20 18H18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M18 14H6V22H18V14Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

        {{ t('button.print') }}
      </PrimaryButton>
      <PrimaryButton variant="light" class="w-100 mt-4" @click="SaveAsPdf(invoiceData?.invoicesinfo?.invoice_no, invoiceData?.invoicesinfo?.customerinfo?.first_name, invoiceData?.invoicesinfo?.customerinfo?.last_name)" :loading="loadingSaveasPdf">
        <svg class="me-2" width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21.5 15V19C21.5 19.5304 21.2893 20.0391 20.9142 20.4142C20.5391 20.7893 20.0304 21 19.5 21H5.5C4.96957 21 4.46086 20.7893 4.08579 20.4142C3.71071 20.0391 3.5 19.5304 3.5 19V15" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M7.5 10L12.5 15L17.5 10" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M12.5 15V3" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

        {{ t('button.save-as-pdf') }}
      </PrimaryButton>
      <PrimaryButton @click="router.push(`/reservierungen/reservierungsvorschau/${invoiceData?.invoicesinfo?.reservation_id}`)" variant="light" class="w-100 mt-4">
        <svg class="me-2" width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.3842 19.5C20.0863 19.5 19.8277 19.2771 19.7779 18.9681C19.3339 16.286 16.8237 11.6049 10.4562 11.3314V14.7726C10.4562 15.0111 10.3274 15.2295 10.1225 15.3387C9.91758 15.4477 9.67091 15.4292 9.48339 15.2906L0.257619 8.47257C0.0959356 8.35307 0 8.16011 0 7.95456C0 7.74895 0.0959356 7.55604 0.257619 7.43658L9.48343 0.618581C9.67091 0.479986 9.91762 0.461441 10.1225 0.570544C10.3274 0.679646 10.4562 0.898106 10.4562 1.13655V4.62966C14.3922 5.03586 21 7.97531 21 18.8634C21 19.1946 20.7545 19.4705 20.4355 19.4978C20.4183 19.4992 20.4012 19.5 20.3842 19.5Z" fill="black" />
        </svg>

        {{ t('button.go-to-reservation') }}
      </PrimaryButton>
      <PrimaryButton @click="openPaymentModal(invoiceData?.invoicesinfo)" variant="light" class="w-100 mt-4">
        <svg class="me-2" width="9" height="14" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.16289 6.18771V3.29917C5.87587 3.4034 6.54815 3.65695 7.1229 4.03772C7.23748 4.10581 7.37193 4.14276 7.51112 4.14438C7.95708 4.14438 8.32069 3.83337 8.3254 3.44687C8.32634 3.28112 8.25155 3.12192 8.1171 3.00375C7.2867 2.38746 6.24516 2.02394 5.15343 1.96978V1.00145C5.15343 0.724892 4.89494 0.500868 4.57584 0.500868C4.56921 0.500056 4.56256 0.500056 4.55594 0.500056C4.23212 0.495942 3.96511 0.719991 3.96036 1.00145V1.93695C1.82993 2.06825 0.381244 3.20891 0.381244 4.72703C0.381244 6.5898 2.20868 7.10681 3.96036 7.5171V10.7996C3.03621 10.6921 2.16512 10.3597 1.45118 9.83945C1.31673 9.74673 1.15006 9.69503 0.977734 9.69175C0.541236 9.71801 0.205109 10.0348 0.210764 10.4139C0.209826 10.5796 0.284622 10.7388 0.419066 10.857C1.39718 11.6202 2.65462 12.0592 3.96979 12.0961V12.9988C3.96979 13.0046 3.97073 13.0103 3.97073 13.0161C3.98588 13.2967 4.26142 13.5133 4.58524 13.4994C4.90434 13.4994 5.16283 13.2754 5.16283 12.9988V12.0797C7.74775 11.932 8.7893 10.5698 8.7893 9.12554C8.78935 7.18887 6.9146 6.59803 5.16289 6.18771ZM3.96985 5.92512C2.93777 5.66253 2.13295 5.39173 2.13295 4.62856C2.13295 3.86539 2.86204 3.31557 3.96985 3.24174V5.92512ZM5.16289 10.816V7.82895C6.23285 8.09155 7.06607 8.4444 7.0566 9.30604C7.0566 9.92972 6.56423 10.6683 5.16289 10.816Z" fill="#666666" />
        </svg>

        {{ t('button.register-payment') }}
      </PrimaryButton>

      <!-- Mail section -->
      <div class="mt-5">
        <!-- <template v-for="(field, i) in mailFields" :key="i">
          <InputControl v-model="field.value" type="email" placeholder="Enter email" class="mt-2" />
        </template>

        <p @click="addMailField" class="text-end text-primary mt-1 mb-0 pointer">+ {{ t('button.add-recipient') }}</p>
        <CheckBox v-model="cc_me" :label="t('form-fields.cc-me')" /> -->
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

        <!-- <p class="text-12 fst-italic fw-lighter mt-2 mb-0">{{ t('dashboard-invoice.successfully-sent-on') }} 23, May
          2022 03:44 PM</p> -->
      </div>

    </div>

  </div>

  <Loading v-else />

  <!-- Payment Modal -->
  <ModalControl v-model="showPaymentModal" @on-hide="paymentSuccess = false">
    <template v-if="!paymentSuccess">
      <div class="modal-header d-flex mx-0 ps-4">
        <h5 class="mb-1" style="color: #333333;">Payment info</h5>

        <svg @click="showPaymentModal = false" width="24" height="24" class="pointer me-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_5455_4085)">
            <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="black" />
          </g>
          <defs>
            <clipPath id="clip0_5455_4085">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>

      </div>

      <div class="modal-body">
        <!-- Reference invoice -->
        <InputControl stack disabled v-model="paymentForm.invoice_no" label="Reference invoice" errorField="invoice_no" labelClasses="text-black fw-500" />
        <!-- Payment Date -->
        <CalenderControl stack v-model="paymentForm.payment_date" :label="t('form-fields.payment-date')" labelClasses="text-black fw-500" errorField="payment_date" class="mt-3" />

        <!-- Payment method -->
        <SelectControl stack v-model="paymentForm.payment_method" :label="t('form-fields.payment-method')" errorField="payment_method" labelClasses="text-black fw-500" optionLabel="name" :options="paymentMethods" class="mt-3" />
        <!-- Amount -->
        <InputRightIcon stack v-model="paymentForm.amount" v-model:currency="amountCurrency" label="Amount" labelClasses="text-black fw-500" errorField="amount" class="mt-3" />
        <p class="text-danger mt-2 mb-0">Open amount: {{ moneyFormat(paymentForm.due_amount) }}</p>

      </div>

      <div class="modal-footer border-0">
        <PrimaryButton variant="dark" @click="submitPayment" :loading="paymentLoading" :disabled="paymentForm.due_amount == 0" class="pointer w-100">Register Payment</PrimaryButton>
      </div>
    </template>

    <template v-else>
      <div class="modal-body">
        <div class="d-flex flex-column justify-content-center align-items-center py-5 my-5">
          <svg width="104" height="104" viewBox="0 0 104 104" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="52" cy="52" r="52" fill="#46B276" fill-opacity="0.16" />
            <path d="M51.5 24C58.7935 24 65.7882 26.95 70.9454 32.201C76.1027 37.452 79 44.5739 79 52C79 59.4261 76.1027 66.548 70.9454 71.799C65.7882 77.05 58.7935 80 51.5 80C44.2065 80 37.2118 77.05 32.0546 71.799C26.8973 66.548 24 59.4261 24 52C24 44.5739 26.8973 37.452 32.0546 32.201C37.2118 26.95 44.2065 24 51.5 24ZM48.0743 57.524L41.9654 51.3C41.7464 51.077 41.4864 50.9001 41.2002 50.7795C40.9141 50.6588 40.6074 50.5967 40.2977 50.5967C39.988 50.5967 39.6813 50.6588 39.3951 50.7795C39.109 50.9001 38.849 51.077 38.63 51.3C38.1877 51.7503 37.9392 52.3611 37.9392 52.998C37.9392 53.6349 38.1877 54.2457 38.63 54.696L46.4086 62.616C46.627 62.8401 46.8868 63.018 47.173 63.1394C47.4592 63.2607 47.7662 63.3232 48.0763 63.3232C48.3863 63.3232 48.6933 63.2607 48.9795 63.1394C49.2657 63.018 49.5255 62.8401 49.7439 62.616L65.8511 46.212C66.073 45.9899 66.2496 45.7253 66.3705 45.4335C66.4915 45.1416 66.5546 44.8282 66.556 44.5114C66.5575 44.1946 66.4973 43.8806 66.379 43.5876C66.2607 43.2946 66.0865 43.0283 65.8666 42.8042C65.6467 42.58 65.3854 42.4024 65.0978 42.2816C64.8102 42.1608 64.5019 42.0991 64.1907 42.1002C63.8796 42.1013 63.5717 42.1652 63.2849 42.288C62.9981 42.4108 62.738 42.5903 62.5196 42.816L48.0743 57.524Z" fill="#46B276" />
          </svg>

          <p class="mt-4">Your payment has been sucessfully added.</p>
        </div>
      </div>
    </template>
  </ModalControl>
</template>

<style lang="scss" scoped>
.invoice_print {
  border: 1px solid #ddd;
  border-radius: 5px;
  overflow: hidden;
}

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
.table {
  tbody {
    border-left: 1px solid #eee;
    border-right: 1px solid #eee;
    border-bottom: 1px solid #eee;
  }
}
</style>
