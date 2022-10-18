<!-- eslint-disable no-unused-vars -->
<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import ActionDropdown from '../../../components/common/ActionDropdown.vue'
import PrimaryButton from '../../../components/buttons/PrimaryButton.vue'
import CalenderControl from '../../../components/dashboard/form/CalenderControl.vue'
import { useAxios, api } from '@/use/useAxios'
import ModalControl from '../../../components/common/modals/ModalControl.vue'
import CheckBox from '../../../components/dashboard/form/CheckBox.vue'
import StatusButton from "../../../components/dashboard/shared/StatusButton.vue"
import FormSelect from "@/components/dashboard/shared/FormSelect.vue"
import BPagination from "@/components/base/BPagination.vue"
import moment from 'moment'
import useVuelidate from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import { useI18n } from 'vue-i18n'
import { useToast } from "vue-toastification"
import _ from 'lodash'
import { apiBaseUrl } from '@/main'
import InputControl from '../../../components/dashboard/form/InputControl.vue'
import InputRightIcon from '../../../components/dashboard/form/InputRightIcon.vue'
import fileDownload from 'js-file-download'

const { t } = useI18n({ useScope: 'global' })
const toast = useToast()
const { data, loading, pageCount, reFetch } = useAxios('admin/invoice')
const { data: cancleReason } = useAxios('admin/cancellation-reason')
const router = useRouter()
const currentPage = ref(1)

const getStatus = (val) => {
  if (val == 'Cancelled') return 'primary'
  if (val == 'Posted') return 'success'
  if (val == 'Draft') return 'grey'
  if (val == 'Not paid') return 'danger'
  if (val == 'Paid') return 'success'

  return 'primary'
}

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

// All Check Mark
const allChecked = ref(false)
const selectedIds = ref([])

const onAllCheck = () => {
  if (allChecked.value)
    selectedIds.value = data.value.data.map(invoice => invoice.id)
  else
    selectedIds.value = []
}

const onSingleSelect = () => {
  allChecked.value = (selectedIds.value.length === data.value.data.length)
}

// Due date
const selectedDuedate = ref('')

// Searching
const searchValue = ref('')

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
    reFetch()
    paymentForm.amount = 0
    amountCurrency.value = 0
  } catch (error) {
    //
  } finally {
    paymentLoading.value = false
  }
}

const openPaymentModal = (invoice) => {
  console.log(invoice)
  showPaymentModal.value = true

  paymentForm.invoice_id = invoice.id
  paymentForm.invoice_no = invoice.invoice_no
  paymentForm.custome_id = invoice.customer_id
  paymentForm.payment_method = invoice.accepted_payment_method
  paymentForm.due_amount = invoice.due_amount
}

const showSetAsUnpaidModal = ref(false)
const setAsUnpaidLoading = ref(false)
const unpaidId = ref()
const onSetAsUnpaid = async () => {
  try {
    setAsUnpaidLoading.value = true
    await api.post(`admin/invoice/preivouspaymentunpaid/${unpaidId.value}`)

    reFetch()
    showSetAsUnpaidModal.value = false
    toast.success(`${t('toast.updateText')}`)
  } catch (error) {
    toast.error(`${t('toast.failureUpdateText')}`)
  } finally {
    setAsUnpaidLoading.value = false
  }
}

const openUnpaidModal = id => {
  showSetAsUnpaidModal.value = true
  unpaidId.value = id
}

// Sort data by date
const sortAsc = ref(true)
const sortByDate = () => {
  sortAsc.value = !sortAsc.value
  const sortedArray = _.orderBy(data.value.data, (o) => {
    return moment(o.invoice_date).format('YYYYMMDD')
  }, [sortAsc.value ? 'asc' : 'desc'])

  data.value.data = sortedArray
}

// Filter
const filters = [
  { key: 'invoice_status', name: '', label: t('form-fields.all') },
  { key: 'invoice_status', name: 'Draft', label: t('dashboard-invoice.draft') },
  { key: 'invoice_status', name: 'Posted', label: t('dashboard-invoice.posted') },
  { key: 'invoice_status', name: 'Cancelled', label: t('form-fields.cancelled'), borderBottom: true },
  { key: 'payment_status', name: 'Not Paid', label: t('dashboard-invoice.not-paid') },
  { key: 'payment_status', name: 'Paid', label: t('dashboard-payment.paid') },
  { key: 'due_amount', name: 'Due', label: t('form-fields.due'), borderBottom: true },
]

const activeFilter = ref({
  key: 'invoice_status',
  name: '',
  label: 'Filter'
})

// const queryValue = computed(() => activeFilter.value.name == 'All' ? "" : activeFilter.value.name)
const changeFilter = async (filter) => {
  activeFilter.value = filter

  // Query string for filter
  // `invoice_status=Draf&payment_status=Paid&invoice_no=W393884&due_amount=1&due_date=22.10.2022`
  try {
    reFetch(`admin/invoice?${activeFilter.value.key}=${activeFilter.value.name}`)
  } catch (error) {
    //
  }
}

const filterByDueDate = (d) => {
  changeFilter({
    key: 'due_date',
    name: d,
    label: 'Due'
  })
}
const filterByInvoiceNo = (e) => {
  changeFilter({
    key: 'invoice_no',
    name: e.target.invoiceNo.value,
    label: 'Invoice'
  })
}

// Page Change
const changePage = () => {
  reFetch(`admin/invoice?page=${currentPage.value}&${activeFilter.value.key}=${activeFilter.value.name}&name=${searchValue.value}`)
}

// Search
const onSearch = _.debounce(() => {
  currentPage.value = 1
  reFetch(`admin/invoice?page=${currentPage.value}&name=${searchValue.value}`)
}, 500)

// Save as pdf
const saveAsPdf = async (id, inv_no, first_name, last_name) => {
  try {
    const res = await api.get(`admin/invoice/pdf/${id}`, {
      responseType: 'blob',
    })

    fileDownload(res.data, `Rechnung_${inv_no}_${first_name}_${last_name}.pdf`)
    // const url = `${apiBaseUrl}/${res.data.location}${res.data.file_name}`
    // window.open(url)
  } catch (error) {
    console.error(error)
  }
}

// Cancel
const cancleModalStatus = ref(false)
const activeInvoice = ref()
const cancleNo = ref('')
const cancleId = ref('')
const cancling = ref(false)

const cancleForm = reactive({
  reason_id: '',
  payment_method: '',
  invoice_id: '',
})

const openCancleModal = invoice => {
  cancleForm.invoice_id = invoice.id
  cancleModalStatus.value = true
  activeInvoice.value = invoice
}

// Validation
const reasonTab = {
  reason_id: { required: helpers.withMessage(t('dashboard-invoice.reason-is-required'), required) }
}
const refundTab = {
  payment_method: { required: helpers.withMessage(t('dashboard-reservation.payment-method-is-required'), required) }
}
const reason$v = useVuelidate(reasonTab, cancleForm)
const refund$v = useVuelidate(refundTab, cancleForm)

// Step
const activeStep = ref({
  id: 1,
  name: t('form-fields.reason'),
})
const steps = ref([
  {
    id: 1,
    name: t('form-fields.reason'),
  },
  {
    id: 2,
    name: t('dashboard-invoice.refund'),
  },
  {
    id: 3,
    name: t('dashboard-invoice.publish'),
  },
])

// Change Tab
const changeTab = async (id) => {
  if (id == 2) {
    const result = await reason$v.value.$validate()
    if (!result)
      return
  }

  activeStep.value = steps.value.find(step => step.id == id)
}

// Cancle Download PDF
const pdfBlogUrl = ref('')
const pdfFrame = ref(null)

const saveAsPdfCancle = async (inv_no, first_name, last_name) => {
  try {
    const res = await api.get(`admin/invoicecancellation/pdf/${cancleId.value}`, {
      responseType: 'blob',
    })
    fileDownload(res.data, `Rechnung_${inv_no}_${first_name}_${last_name}.pdf`)
  } catch (error) {
    console.error(error)
  }
}

// Cancle Print
const printAsPdfCancle = async () => {
  pdfFrame.value.focus()
  pdfFrame.value.contentWindow.print()
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

// Submit Cancle
const submitCancle = async () => {
  if (activeInvoice.value.total_amount_paid > 0) {
    const result = await refund$v.value.$validate()
    if (!result)
      return
  }

  try {
    cancling.value = true
    const res = await api.post('/admin/invoicecancellation/store', {
      ...cancleForm,
      customer_id: activeInvoice.value.customer_id
    })
    cancleNo.value = res.data.cancellation_no
    cancleId.value = res.data.id
    emailId.value[0].cc_email = res.data.customer_email

    const pdfRes = await api.get(`admin/invoicecancellation/pdf/${cancleId.value}`, {
      responseType: 'blob'
    })
    pdfBlogUrl.value = window.URL.createObjectURL(pdfRes.data)

    changeTab(3)
    reFetch()
  } catch (error) {
    console.error(error)
  } finally {
    cancling.value = false
  }
}

// Export
const onExport = async () => {
  try {
    const res = await api.post(`admin/invoice/excel-generated`, {
      invoices_ids: selectedIds.value
    }, {
      responseType: 'blob',
    })

    fileDownload(res.data, 'invoices.xml')
  } catch (err) {
    console.error(err)
  }
}
</script>

<template>
  <iframe ref="pdfFrame" name="pdf" :src="pdfBlogUrl" style="width:0; height:0;"></iframe>

  <!-- Header -->
  <h5 class="inv-top__title d-xl-none">{{t("dashboard-invoice.invoice")}}</h5>
  <div class="invoice__header d-flex align-items-center mb-4">
    <!-- Title -->
    <h5 class="inv-title">{{t("dashboard-invoice.invoice")}}</h5>

    <!-- Search -->
    <div class="search-input-root ms-auto me-3">
      <input v-model="searchValue" @input="onSearch" type="text" class="search-input" :placeholder="t('form-fields.search')" />
      <div class="search-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#555555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M20.9984 20.9999L16.6484 16.6499" stroke="#555555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
    </div>

    <!-- Filter -->
    <ActionDropdown>
      <template #action-icon>
        <div class="header-slot">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>

          <span class="ms-2">
            <!-- {{ activeFilter.label }} -->
            {{t("dashboard-invoice.filter")}}
          </span>
        </div>
      </template>
      <!-- Filter list -->
      <template v-for="(filter, i) in filters" :key="i">
        <li @click="changeFilter(filter)" class="text-14 dropdown-item py-2 pointer" :class="{'border-bottom-grey': filter.borderBottom}">
          {{ filter.label }}
        </li>
      </template>

      <li class="text-14 dropdown-item py-2 pointer mt-2" style="width: 280px;">
        <form @submit.prevent="filterByInvoiceNo">
          <label class="label d-block mb-1">{{t('form-fields.invoice-no')}}</label>
          <input class="form-control" name="invoiceNo" :placeholder="t('form-fields.invoice-no')" />
          <button type="submit" class="d-none"></button>
        </form>
      </li>
      <li class="text-14 dropdown-item pt-2 pointer mt-2" style="width: 280px;">
        <CalenderControl v-model="selectedDuedate" @update:model-value="filterByDueDate" stack class="mb-3" :label="t('form-fields.due-date')" :placeholder="t('form-fields.select-date')" />
      </li>
    </ActionDropdown>

    <!-- Export -->
    <div>
      <div v-if="selectedIds.length" @click="onExport" class="header-slot pointer mx-3">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M17 8L12 3L7 8" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M12 3V15" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span class="ms-2">{{t("dashboard-invoice.export")}}</span>
      </div>
      <div v-else class="header-slot mx-3">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="#6c757d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M17 8L12 3L7 8" stroke="#6c757d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M12 3V15" stroke="#6c757d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span class="ms-2 text-muted">{{t("dashboard-invoice.export")}}</span>
      </div>
    </div>

    <!-- Create Button -->
    <PrimaryButton @click="router.push('/rechnung/erstellen')" class="d-flex align-items-center">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H8" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M15 2H9C8.44772 2 8 2.44772 8 3V5C8 5.55228 8.44772 6 9 6H15C15.5523 6 16 5.55228 16 5V3C16 2.44772 15.5523 2 15 2Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <line x1="9" y1="17" x2="15" y2="17" stroke="white" stroke-width="2" stroke-linecap="round" />
        <line x1="9" y1="12" x2="11" y2="12" stroke="white" stroke-width="2" stroke-linecap="round" />
      </svg>
      <span class="ms-2"> {{t("dashboard-invoice.create-invoice")}}</span>
    </PrimaryButton>

  </div>

  <!-- Loading -->
  <Loading v-if="loading" class="my-3" />

  <!-- No data -->
  <div v-if="!loading && !data.data.length" class="d-flex flex-column align-items-center justify-content-center w-100 h-100 mt-5">
    <div class="icon mb-4">
      <svg width="132" height="128" viewBox="0 0 132 128" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_4322_1348)">
          <path d="M116.535 14.9965C95.915 -4.99851 62.3639 -4.99851 41.7441 14.9965C21.7356 34.3989 21.1425 65.6077 39.9648 85.7103L32.8352 92.6238L28.989 88.8941C28.5055 88.4253 27.8495 88.1617 27.1656 88.1617C26.4818 88.1617 25.8258 88.4253 25.3423 88.8941L3.10387 110.459C1.10236 112.4 0 114.98 0 117.725C0 120.47 1.10236 123.05 3.10361 124.991C5.10513 126.931 7.76625 128 10.5965 128C13.4271 128 16.0879 126.931 18.0895 124.991L40.3282 103.426C40.8116 102.957 41.0834 102.321 41.0834 101.658C41.0834 100.995 40.8116 100.359 40.3282 99.8899L36.4819 96.1602L43.6115 89.2467C53.6601 98.0938 66.3999 102.517 79.1396 102.517C92.6824 102.517 106.225 97.5187 116.535 87.5211C137.155 67.5258 137.155 34.9915 116.535 14.9965ZM14.4428 121.454C13.4155 122.45 12.0496 122.999 10.5965 122.999C9.14375 122.999 7.7776 122.451 6.75028 121.454C5.72296 120.458 5.15722 119.134 5.15722 117.725C5.15722 116.316 5.72296 114.991 6.75054 113.995L27.1656 94.1983L34.8582 101.658L14.4428 121.454ZM112.888 83.9847C94.2794 102.03 64 102.03 45.391 83.9849C26.7817 65.9395 26.7817 36.5778 45.3907 18.5327C54.6954 9.50996 66.9177 4.99862 79.1396 4.99862C91.3616 4.99862 103.584 9.50996 112.888 18.5327C131.497 36.5778 131.497 65.9395 112.888 83.9847Z" fill="black" />
          <path d="M120.609 50.7703C120.39 49.7248 119.496 48.9137 118.403 48.7784C117.33 48.6456 116.245 49.2082 115.771 50.1526C115.305 51.0806 115.473 52.2138 116.203 52.9689C116.94 53.7311 118.118 53.9659 119.106 53.552C120.205 53.0919 120.848 51.9095 120.609 50.7703Z" fill="black" />
          <path d="M117.047 60.2998C115.688 59.8842 114.24 60.6151 113.812 61.9321C112.046 67.3589 109.036 72.161 104.866 76.2053C97.9941 82.8685 88.8579 86.5385 79.1396 86.5385C69.4216 86.5385 60.2851 82.8688 53.4134 76.2053C39.2282 62.4497 39.2282 40.068 53.4134 26.3124C60.2851 19.6489 69.4216 15.9792 79.1396 15.9792C88.8579 15.9792 97.9941 19.6489 104.866 26.3124C108.989 30.3112 112.088 35.2626 113.827 40.6311C114.253 41.9489 115.701 42.6812 117.059 42.2674C118.418 41.8538 119.174 40.4501 118.747 39.1326C116.76 32.9984 113.221 27.3424 108.512 22.776C100.667 15.1678 90.2351 10.9781 79.1396 10.9781C68.0441 10.9781 57.6126 15.1678 49.7667 22.776C33.5704 38.4815 33.5704 64.036 49.7667 79.7415C57.6126 87.3494 68.0439 91.5394 79.1396 91.5394C90.2354 91.5394 100.667 87.3496 108.512 79.7415C113.208 75.1886 116.741 69.5505 118.73 63.4369C119.158 62.1196 118.405 60.7151 117.047 60.2998Z" fill="black" />
          <path d="M63.3147 66.6042C66.6483 69.8368 72.0726 69.8368 75.4063 66.6042L79.1398 62.9838L82.8731 66.6042C84.54 68.2205 86.7295 69.0287 88.919 69.0287C91.1084 69.0287 93.2979 68.2205 94.9648 66.6042C98.2984 63.3716 98.2984 58.1116 94.9648 54.879L91.2312 51.2586L94.9648 47.6382C98.2984 44.4056 98.2984 39.1458 94.9648 35.913C91.6311 32.6804 86.2068 32.6804 82.8731 35.913L79.1396 39.5337L75.406 35.913C72.0721 32.6804 66.6483 32.6804 63.3144 35.913C59.9808 39.1456 59.9808 44.4056 63.3147 47.6382L67.0482 51.2586L63.3144 54.879C59.981 58.1114 59.9808 63.3714 63.3147 66.6042ZM66.9613 58.4152L72.5182 53.0267C73.0017 52.5578 73.2735 51.9217 73.2735 51.2586C73.2735 50.5955 73.0017 49.9594 72.5182 49.4905L66.9613 44.102C65.6385 42.8193 65.6385 40.7321 66.9613 39.4494C68.2839 38.1669 70.4368 38.1666 71.7593 39.4494L77.3162 44.8379C77.8 45.307 78.4557 45.5703 79.1396 45.5703C79.8234 45.5703 80.4794 45.3067 80.9629 44.8379L86.5198 39.4494C87.8426 38.1666 89.9953 38.1666 91.3178 39.4494C92.6407 40.7321 92.6407 42.8193 91.3178 44.102L85.7609 49.4905C85.2774 49.9594 85.0057 50.5955 85.0057 51.2586C85.0057 51.9217 85.2774 52.5578 85.7609 53.0267L91.3178 58.4152C92.6407 59.6979 92.6407 61.7851 91.3178 63.0678C89.9955 64.3506 87.8429 64.3508 86.5198 63.0678L80.9629 57.6793C80.4794 57.2102 79.8234 56.9469 79.1396 56.9469C78.4557 56.9469 77.7997 57.2105 77.3162 57.6793L71.7593 63.0678C70.4368 64.3506 68.2841 64.3506 66.9613 63.0678C65.6385 61.7851 65.6382 59.6979 66.9613 58.4152Z" fill="black" />
        </g>
        <defs>
          <clipPath id="clip0_4322_1348">
            <rect width="132" height="128" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
    <div class="fw-400 pb-3" style="font-size: 25px; color: #020918;">{{t('text.there-is-no-data-in-the-table')}}</div>
    <div class="text-25 fw-400 pointer" style="font-size: 25px; color: #276EF1;">
      <app-link path="/rechnung/erstellen">{{t('button.click-here-to-create-a-new-record')}}</app-link>
    </div>
  </div>

  <!-- Table -->
  <div class="table__wrapper">
    <table v-if="!loading && data?.data?.length" class="table table-responsive table-borderless">
      <thead>
        <tr>
          <!-- Checkbox -->
          <th>
            <CheckBox v-model="allChecked" @update:model-value="onAllCheck" />
          </th>
          <!-- Invoice No -->
          <th>{{t("form-fields.invoice-no")}}.</th>
          <th>{{t("form-fields.due")}}</th>
          <th>{{t("form-fields.status")}}</th>
          <th>{{t("dashboard-invoice.pay-status")}}</th>
          <th>{{t("form-fields.customer")}} / <br>
            {{t("form-fields.reservation-id")}}</th>
          <th>
            <span class="me-2">{{t("form-fields.date")}}</span>
            <svg @click="sortByDate" class="pointer p-1" :style="{'transform': sortAsc ?' rotate(0deg)' : 'rotate(-180deg)', 'transition': 'all 0.3s ease' }" width="20" height="16" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M0.576162 0.480905C0.810477 0.24659 1.19037 0.24659 1.42469 0.480904L4.57616 3.63238C4.81048 3.86669 5.19037 3.86669 5.42469 3.63238L8.57616 0.480905C8.81048 0.24659 9.19038 0.24659 9.42469 0.480905L9.51897 0.575186C9.75328 0.8095 9.75328 1.1894 9.51897 1.42371L5.47183 5.47085C5.21148 5.7312 4.78937 5.7312 4.52902 5.47085L0.481881 1.42371C0.247567 1.1894 0.247567 0.8095 0.481881 0.575185L0.576162 0.480905Z" fill="#666666" />
            </svg>
          </th>
          <th>{{t("form-fields.total")}}</th>
          <th>{{t("dashboard-invoice.open-amount")}}</th>
          <th>{{t("dashboard-invoice.cancellation-invoice")}}</th>
          <th class="d-inline-block" style="width: 100px;"></th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(invoice, i) in data?.data || []" :key="i">
          <td :class="{'opacity-0' : !selectedIds.includes(invoice.id)}">
            <CheckBox v-model="selectedIds" :value="invoice.id" @update:model-value="onSingleSelect" />
          </td>
          <!-- Invoice No -->
          <td>{{ invoice.invoice_no }}</td>
          <!-- Due -->
          <td :style="invoice.payment_status == 'Paid' ? 'text-decoration: line-through;' : ''">{{
          moment(invoice.due_date).format('DD.MM.YYYY') }}</td>
          <!-- STATUS -->
          <td>
            <StatusButton :type="getStatus(invoice.inv_status)">
              <span v-if="invoice.inv_status == 'Draft' ">{{ t('dashboard-invoice.draft') }}</span>
              <span v-if="invoice.inv_status == 'Not paid' ">{{ t('dashboard-invoice.not-paid') }}</span>
              <span v-if="invoice.inv_status == 'Paid' ">{{ t('dashboard-payment.paid') }}</span>
              <span v-if="invoice.inv_status == 'Posted' ">{{ t('dashboard-invoice.posted') }}</span>
              <span v-if="invoice.inv_status == 'Cancellation' ">{{ t('form-fields.cancelled') }}</span>
            </StatusButton>
          </td>
          <!-- PAY. STATUS -->
          <td>
            <StatusButton :type="getStatus(invoice.payment_status)">
              <span v-if="invoice.payment_status == 'Draft' ">{{ t('dashboard-invoice.draft') }}</span>
              <span v-if="invoice.payment_status == 'Not paid' ">{{ t('dashboard-invoice.not-paid') }}</span>
              <span v-if="invoice.payment_status == 'Paid' ">{{ t('dashboard-payment.paid') }}</span>
              <span v-if="invoice.payment_status == 'Posted' ">{{ t('dashboard-invoice.posted') }}</span>
              <span v-if="invoice.payment_status == 'Cancellation' ">{{ t('form-fields.cancelled') }}</span>
            </StatusButton>
          </td>
          <!-- CUSTOMER / RESERVATION ID -->
          <td>
            <span v-if="invoice.name_title == 'Mrs.' || invoice.name_title == 'Frau' ">{{t('home-booking-request-form.mrs')}}</span>
            <span v-if="invoice.name_title == 'Mr.' || invoice.name_title == 'Herr' ">{{t('home-booking-request-form.mr')}}</span>
            {{ invoice.full_name }}
            <br>
            {{t("dashboard-invoice.reservation-no")}}. {{ invoice.reservation_no }}
          </td>
          <!-- DATE -->
          <td>{{ moment(invoice.invoice_date).format('DD.MM.YYYY') }}</td>
          <!-- TOTAL -->
          <td>{{ moneyFormat(invoice.grand_total) }}</td>
          <!-- OPEN AMOUNT -->
          <td>{{ moneyFormat(invoice.due_amount) }}</td>
          <!-- CANCELLATION INVOICE -->
          <td>
            <!-- {{ invoice.cancellation ? invoice.cancellation?.cancellation_no : '-'}} -->

            <span v-if="invoice.cancellation" class="btn-link">
              <app-link class="text-primary" :path="`rechnung/stornieren/${invoice.cancellation?.id}/ansicht`">
                {{invoice.cancellation?.cancellation_no}}</app-link>
            </span>
            <span v-else>-</span>
          </td>

          <!-- Action -->
          <td class="opacity-0">
            <!-- Money Icon -->
            <svg v-if="invoice.payment_status != 'Paid' || (invoice.inv_status != 'Cancellation' && invoice.cancellation?.payment_method == 'Pay later')   " class="pointer" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" @click="openPaymentModal(invoice)">
              <path d="M9.94238 1.19238C5.11035 1.19238 1.19238 5.11035 1.19238 9.94238C1.19238 14.7744 5.11035 18.6924 9.94238 18.6924C14.7744 18.6924 18.6924 14.7744 18.6924 9.94238C18.6924 5.11035 14.7744 1.19238 9.94238 1.19238ZM9.94238 17.208C5.93066 17.208 2.67676 13.9541 2.67676 9.94238C2.67676 5.93066 5.93066 2.67676 9.94238 2.67676C13.9541 2.67676 17.208 5.93066 17.208 9.94238C17.208 13.9541 13.9541 17.208 9.94238 17.208ZM12.2412 5.71191C11.9307 5.64355 11.5693 5.60645 11.1611 5.60645C9.07715 5.60645 7.66699 6.69434 7.28223 8.53418H6.66113C6.5752 8.53418 6.50488 8.60449 6.50488 8.69043V9.22168C6.50488 9.30762 6.5752 9.37793 6.66113 9.37793H7.17676C7.1709 9.45801 7.1709 9.54199 7.1709 9.62793V10.3486H6.66113C6.5752 10.3486 6.50488 10.4189 6.50488 10.5049V11.0361C6.50488 11.1221 6.5752 11.1924 6.66113 11.1924H7.25098C7.58691 13.1299 9.0166 14.2783 11.1611 14.2783C11.5693 14.2783 11.9307 14.2451 12.2412 14.1787C12.3135 14.1631 12.3662 14.1006 12.3662 14.0264V13.1904C12.3662 13.0928 12.2764 13.0186 12.1807 13.0381C11.8936 13.0928 11.5576 13.1182 11.1689 13.1182C9.83105 13.1182 8.93262 12.4033 8.63379 11.1924H11.1846C11.2705 11.1924 11.3408 11.1221 11.3408 11.0361V10.5049C11.3408 10.4189 11.2705 10.3486 11.1846 10.3486H8.52051V9.64551C8.52051 9.55371 8.52051 9.46191 8.52637 9.37598H11.1807C11.2666 9.37598 11.3369 9.30566 11.3369 9.21973V8.68848C11.3369 8.60254 11.2666 8.53223 11.1807 8.53223H8.6748C9.01074 7.4209 9.8916 6.7666 11.167 6.7666C11.5557 6.7666 11.8916 6.7959 12.1768 6.85254C12.1994 6.85716 12.2228 6.8567 12.2452 6.8512C12.2677 6.8457 12.2886 6.83529 12.3065 6.82071C12.3245 6.80614 12.339 6.78778 12.3489 6.76694C12.3589 6.7461 12.3641 6.7233 12.3643 6.7002V5.86426C12.3643 5.79004 12.3135 5.72754 12.2412 5.71191Z" fill="black" />
            </svg>

            <!-- Download Icon -->
            <svg @click="saveAsPdf(invoice.id, invoice.invoice_no, invoice.first_name, invoice.last_name)" class="mx-2 pointer" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.5 12.5V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V12.5" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M5.83301 8.33301L9.99967 12.4997L14.1663 8.33301" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M10 12.5V2.5" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>

            <!-- Action Icon -->
            <ActionDropdown>
              <li>
                <!-- View / Send -->
                <!-- `/zahlungen/${invoice.id}/ansicht`` -->
                <app-link :path="`/rechnung/vorschau/${invoice.id}`" class="dropdown-item py-2 pointer">
                  <span class="text-14">{{t("form-fields.view")}} / {{t("form-fields.send")}}</span>
                </app-link>
              </li>

              <!-- Edit -->
              <li v-if="invoice.inv_status == 'Draft'">
                <app-link :path="`/rechnung/bearbeiten/${invoice.id}`" class="dropdown-item py-2 pointer">
                  <span class="text-14">{{t("form-fields.edit")}}</span>
                </app-link>
              </li>

              <!-- Add Payment -->
              <li v-if="invoice.payment_status != 'Paid' && invoice.inv_status !== 'Draft' && invoice.inv_status !== 'Cancelled'" @click="openPaymentModal(invoice)">
                <span class="text-14 dropdown-item py-2 pointer">{{t("dashboard-invoice.add-payment")}}</span>
              </li>

              <!-- View payment -->
              <!-- `rechnung/stornieren/${invoice.id}` -->
              <li v-if="invoice.payment_status === 'Paid'">
                <app-link :path="`/zahlungen/${invoice.id}/ansicht`" class="dropdown-item py-2 pointer">
                  <span class="text-14">{{t("button.view-payment")}}</span>
                </app-link>
              </li>

              <!-- Set as unpaid -->
              <li v-if="invoice.payment_status === 'Paid'">
                <span class="dropdown-item py-2 pointer" @click="openUnpaidModal(invoice.id)">
                  <span class="text-14">{{t("button.set-as-unpaid")}}</span>
                </span>
              </li>

              <!-- Cancle and view -->
              <li>
                <app-link v-if="invoice.cancellation" :path="`/rechnung/stornieren/${invoice.id}/ansicht`" class="dropdown-item py-2 pointer">
                  <span class="text-14">{{t("form-fields.view")}} / {{t("form-fields.cancel")}}</span>
                </app-link>
                <div v-else @click="openCancleModal(invoice)" class="dropdown-item py-2 pointer">
                  <span class="text-14">{{t("form-fields.cancel")}}</span>
                </div>
              </li>
            </ActionDropdown>

          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="d-flex justify-content-end">
    <BPagination v-model="currentPage" :total-pages="pageCount" @change="changePage" />
  </div>

  <!-- Payment Modal -->
  <ModalControl v-model="showPaymentModal" @on-hide="paymentSuccess = false">
    <template v-if="!paymentSuccess">
      <div class="modal-header d-flex mx-0 ps-4">
        <h5 class="mb-1" style="color: #333333;">{{t("dashboard-invoice.payment-info")}}</h5>

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
        <InputControl stack disabled v-model="paymentForm.invoice_no" :label="t('form-fields.reference-invoice')" errorField="invoice_no" labelClasses="text-black fw-500" />
        <!-- Payment Date -->
        <CalenderControl stack v-model="paymentForm.payment_date" :label="t('form-fields.payment-date')" labelClasses="text-black fw-500" errorField="payment_date" class="mt-3" />

        <!-- Payment method -->
        <SelectControl stack v-model="paymentForm.payment_method" :label="t('form-fields.payment-method')" errorField="payment_method" labelClasses="text-black fw-500" optionLabel="name" :options="paymentMethods" class="mt-3" />
        <!-- Amount -->
        <InputRightIcon stack v-model="paymentForm.amount" v-model:currency="amountCurrency" :label="t('form-fields.amount')" labelClasses="text-black fw-500" errorField="amount" class="mt-3" />
        <p class="text-danger mt-2 mb-0">{{t("dashboard-invoice.open-amount")}}: {{
        moneyFormat(paymentForm.due_amount) }}</p>

      </div>

      <div class="modal-footer border-0">
        <PrimaryButton variant="dark" @click="submitPayment" :loading="paymentLoading" :disabled="paymentForm.due_amount == 0" class="pointer w-100">{{t("button.register-payment")}}</PrimaryButton>
      </div>
    </template>

    <template v-else>
      <div class="modal-body">
        <div class="d-flex flex-column justify-content-center align-items-center py-5 my-5">
          <svg width="104" height="104" viewBox="0 0 104 104" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="52" cy="52" r="52" fill="#46B276" fill-opacity="0.16" />
            <path d="M51.5 24C58.7935 24 65.7882 26.95 70.9454 32.201C76.1027 37.452 79 44.5739 79 52C79 59.4261 76.1027 66.548 70.9454 71.799C65.7882 77.05 58.7935 80 51.5 80C44.2065 80 37.2118 77.05 32.0546 71.799C26.8973 66.548 24 59.4261 24 52C24 44.5739 26.8973 37.452 32.0546 32.201C37.2118 26.95 44.2065 24 51.5 24ZM48.0743 57.524L41.9654 51.3C41.7464 51.077 41.4864 50.9001 41.2002 50.7795C40.9141 50.6588 40.6074 50.5967 40.2977 50.5967C39.988 50.5967 39.6813 50.6588 39.3951 50.7795C39.109 50.9001 38.849 51.077 38.63 51.3C38.1877 51.7503 37.9392 52.3611 37.9392 52.998C37.9392 53.6349 38.1877 54.2457 38.63 54.696L46.4086 62.616C46.627 62.8401 46.8868 63.018 47.173 63.1394C47.4592 63.2607 47.7662 63.3232 48.0763 63.3232C48.3863 63.3232 48.6933 63.2607 48.9795 63.1394C49.2657 63.018 49.5255 62.8401 49.7439 62.616L65.8511 46.212C66.073 45.9899 66.2496 45.7253 66.3705 45.4335C66.4915 45.1416 66.5546 44.8282 66.556 44.5114C66.5575 44.1946 66.4973 43.8806 66.379 43.5876C66.2607 43.2946 66.0865 43.0283 65.8666 42.8042C65.6467 42.58 65.3854 42.4024 65.0978 42.2816C64.8102 42.1608 64.5019 42.0991 64.1907 42.1002C63.8796 42.1013 63.5717 42.1652 63.2849 42.288C62.9981 42.4108 62.738 42.5903 62.5196 42.816L48.0743 57.524Z" fill="#46B276" />
          </svg>

          <p class="mt-4">{{t("dashboard-payment.successful-message")}}</p>
        </div>
      </div>
    </template>
  </ModalControl>

  <!-- Set as unpaid Modal -->
  <ModalControl v-model="showSetAsUnpaidModal">
    <div class="modal-header d-flex mx-0 ps-4">
      <div class="mb-1 text-16 fw-400" style="color: #333333;">{{t('button.set-as-unpaid')}}</div>
      <svg @click="showSetAsUnpaidModal = false" width="24" height="24" class="pointer me-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
      <div class="text-14 fw-400">{{t('text.set-as-unpaid-modal-text')}}</div>
    </div>
    <div class="modal-footer border-0">
      <PrimaryButton variant="dark" @click="onSetAsUnpaid" :loading="setAsUnpaidLoading" class="pointer w-100">
        {{t('button.confirm')}}</PrimaryButton>
    </div>
  </ModalControl>

  <!-- Cancle Modal -->
  <ModalControl v-model="cancleModalStatus">
    <div class="modal-header d-flex mx-0 ps-4">
      <h5 class="mb-1" style="color: #333333;">{{t("form-fields.cancel")}}</h5>
      <svg @click="cancleModalStatus = false" width="24" height="24" class="pointer me-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
      <!-- Stepper -->
      <div class="stepper_wrapper my-4">
        <div v-for="(step, i) in steps" :key="i" @click="changeTab(step.id)" class="step" :class="{'active': step.id <= activeStep.id }">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 2C19.713 2 23.274 3.475 25.8995 6.1005C28.525 8.72601 30 12.287 30 16C30 19.713 28.525 23.274 25.8995 25.8995C23.274 28.525 19.713 30 16 30C12.287 30 8.72601 28.525 6.1005 25.8995C3.475 23.274 2 19.713 2 16C2 12.287 3.475 8.72601 6.1005 6.1005C8.72601 3.475 12.287 2 16 2ZM14.256 18.762L11.146 15.65C11.0345 15.5385 10.9021 15.4501 10.7565 15.3897C10.6108 15.3294 10.4547 15.2983 10.297 15.2983C10.1393 15.2983 9.9832 15.3294 9.83752 15.3897C9.69185 15.4501 9.55949 15.5385 9.448 15.65C9.22283 15.8752 9.09633 16.1806 9.09633 16.499C9.09633 16.8174 9.22283 17.1228 9.448 17.348L13.408 21.308C13.5192 21.4201 13.6514 21.509 13.7972 21.5697C13.9429 21.6304 14.0992 21.6616 14.257 21.6616C14.4148 21.6616 14.5711 21.6304 14.7168 21.5697C14.8626 21.509 14.9948 21.4201 15.106 21.308L23.306 13.106C23.419 12.995 23.5089 12.8627 23.5705 12.7167C23.6321 12.5708 23.6641 12.4141 23.6649 12.2557C23.6656 12.0973 23.635 11.9403 23.5748 11.7938C23.5145 11.6473 23.4259 11.5142 23.3139 11.4021C23.202 11.29 23.069 11.2012 22.9225 11.1408C22.7761 11.0804 22.6191 11.0496 22.4607 11.0501C22.3023 11.0507 22.1456 11.0826 21.9996 11.144C21.8536 11.2054 21.7212 11.2951 21.61 11.408L14.256 18.762Z" fill="#DDDDDD" />
          </svg>
          <p class="mt-2">{{ step.name }}</p>
        </div>
      </div>
      <!-- Output Here -->
      <div>
        <!-- Reason Tab -->
        <div v-if="activeStep.id == 1">
          <div class="bg-light-grey w-50 mx-auto p-3 text-center rounded-top text-black">
            <div class="text-16 fw-500 pb-1">{{t("dashboard-invoice.amount-paid-out")}}</div>
            <div class="text-40 fw-500 fs-3">{{ moneyFormat(activeInvoice?.total_amount_paid) }}</div>
          </div>
          <FormSelect no-border stack v-model="cancleForm.reason_id" :label="t('billingSettings.cancellation-reason')" :frontError="reason$v" errorField="reason_id" placeholder="Please choose" :options="cancleReason?.reasondata || []" displayProperty="reason_name" valueProperty="id" class="my-3" labelClasses="text-black" />
          <PrimaryButton @click="changeTab(2)" variant="dark" class="pointer w-100">Next</PrimaryButton>
        </div>
        <!-- Refund Tab -->
        <div v-if="activeStep.id == 2">
          <div class="bg-light-grey w-50 mx-auto p-3 text-center rounded-top text-black">
            <div class="text-16 fw-500 pb-1">{{t("dashboard-invoice.amount-paid-out")}}</div>
            <div class="text-40 fw-500 fs-3">{{ moneyFormat(activeInvoice?.total_amount_paid) }}</div>
          </div>
          <FormSelect no-border stack v-model="cancleForm.payment_method" v-if="activeInvoice?.total_amount_paid != 0" label="Payment method" :frontError="refund$v" errorField="payment_method" placeholder="Please choose" :options="paymentMethods || []" displayProperty="name" valueProperty="id" class="mt-3" labelClasses="text-black" />
          <PrimaryButton @click="submitCancle" :loading="cancling" variant="dark" class="pointer w-100 mt-3">Cancle
          </PrimaryButton>
        </div>
        <!-- Publish Tab -->
        <div v-if="activeStep.id == 3">
          <PrimaryButton @click="printAsPdfCancle" class="w-100">
            <svg class="me-2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9V2H18V9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M6 18H4C3.46957 18 2.96086 17.7893 2.58579 17.4142C2.21071 17.0391 2 16.5304 2 16V11C2 10.4696 2.21071 9.96086 2.58579 9.58579C2.96086 9.21071 3.46957 9 4 9H20C20.5304 9 21.0391 9.21071 21.4142 9.58579C21.7893 9.96086 22 10.4696 22 11V16C22 16.5304 21.7893 17.0391 21.4142 17.4142C21.0391 17.7893 20.5304 18 20 18H18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M18 14H6V22H18V14Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            {{ t('button.print') }}
          </PrimaryButton>
          <PrimaryButton @click="saveAsPdfCancle(activeInvoice?.invoice_no, activeInvoice?.first_name, activeInvoice?.last_name)" variant="light" class="w-100 mt-4">
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
          </div>
        </div>
      </div>
    </div>
  </ModalControl>

</template>



<style lang="scss" scoped>
.email__item {
  position: relative;
  .remove_icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: calc(100% + 3px);
    cursor: pointer;
  }
}

.stepper_wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
  width: 446px;

  .step {
    text-align: center;
    width: 120px;
    position: relative;

    &:not(:first-child)::after {
      content: "";
      width: 65px;
      height: 1px;
      background: #ddd;
      position: absolute;
      right: 90%;
      top: 15px;
    }

    &.active {
      color: #46b276;

      &::after {
        background: #46b276;
      }

      svg path {
        fill: #46b276;
      }
    }
  }
}

.border-bottom-grey {
  border-bottom: 1px solid #ddd;
}

.bg-light-grey {
  background: rgba(204, 206, 209, 0.32);
}

.invoice__header {
  .header-slot {
    background: #eeeeee;
    border: 1px solid #dddddd;
    border-radius: 4px;
    padding: 10px;
    min-width: 110px;
    display: flex;
    justify-content: center;
  }
}

$table-height: calc(100vh - 190px);

.table__wrapper {
  height: $table-height;
  width: 100%;
  overflow: auto;

  .table {
    color: #666;

    thead {
      position: sticky;
      top: 0;
      z-index: 6;

      tr {
        vertical-align: middle;
        background-color: #f6f7fb;
      }

      th {
        padding: 5px 10px;
        white-space: nowrap;
        font-size: 13px;
        font-weight: 700;
        color: rgba(0, 0, 0, 0.6);
        text-transform: uppercase;
      }
    }

    tbody {
      tr {
        vertical-align: middle;

        &.bordered:not(:last-child) {
          border-bottom: 1px solid #eee;
        }

        td {
          padding: 1rem 10px;
          color: #000000;
          white-space: nowrap;
          font-size: 12px;
          font-weight: 700;
        }

        &:hover {
          background: #eee;

          td.opacity-0 {
            opacity: 1 !important;
          }
        }
      }
    }
  }
}

.search-input-root {
  position: relative;
  background-color: #f2f2f2;
  border-radius: 5px;

  @include responsive-max("md") {
    width: 162px;
  }

  .search-input {
    border: 0;
    outline: 0;
    padding: 12px 10px 11px 45px;
    background: transparent;
    color: #444;
    display: block;
  }

  .search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
  }
}

.modal-body {
  p {
    color: #000000;
  }

  .label {
    color: rgba(0, 0, 0, 0.87) !important;
  }
}

@media only screen and (max-width: 1024px) {
  .inv-top__title {
    display: none;
  }

  .inv-title {
    display: block;
  }
}

@media only screen and (max-width: 768px) {
  .inv-top__title {
    display: block;
  }

  .inv-title {
    display: none;
  }
}
</style>
