<script setup>

import { reactive, ref } from 'vue'
// import { useRouter } from 'vue-router'

import PageHeader from '@/components/dashboard/PageHeader.vue'
import DataTable from '@/components/common/DataTable.vue'
import BPagination from '@/components/base/BPagination.vue'
import ActionDropdown from '../../../components/common/ActionDropdown.vue'
import ModalControl from '@/components/common/modals/ModalControl.vue'
// import InputControl from '@/components/dashboard/form/InputControl.vue'
import FormSelect from "../../../components/dashboard/shared/FormSelect.vue"
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import _ from 'lodash'
import { useAxios, api } from '@/use/useAxios'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'

// const router = useRouter()
const { t, locale } = useI18n({ useScope: 'global' })
const toast = useToast()

const { data: reservationData } = useAxios('/booking-reservations')
const { data: requestData, loading, pageCount, reFetch } = useAxios('/booking-get')


const currentPage = ref(1)

const fields = [
  {
    field: "status",
    label: t('form-fields.status'),
    thClass: 'text-13 fw-500',
    tdClass: 'text-12 fw-500 dark-black',
  },
  {
    field: "reservation_no",
    label: t('form-fields.id'),
    thClass: 'text-13 fw-500',
    tdClass: 'text-12 fw-500 dark-black',
  },
  {
    field: "request_from",
    label: t('requests.request-from'),
    thClass: 'text-13 fw-500',
    tdClass: 'text-12 fw-500 dark-black',
  },
  {
    field: "customer_details",
    label: t('requests.customer-details'),
    thClass: 'text-13 fw-500',
    tdClass: 'text-12 fw-500 dark-black',
  },
  {
    field: "message",
    label: t('requests.message'),
    thClass: 'text-13 fw-500',
    tdClass: 'text-12 fw-500 dark-black',
  },
  {
    field: "classname",
    label: t("requests.vehicle-class"),
    thClass: 'text-13 fw-500',
    tdClass: 'text-12 fw-500 dark-black',
  },
  {
    field: "location_name",
    label: t("requests.location"),
    thClass: 'text-13 fw-500',
    tdClass: 'text-12 fw-500 dark-black',
  },
  {
    field: "time_range",
    label: t("requests.time-range"),
    thClass: 'text-13 fw-500',
    tdClass: 'text-12 fw-500 dark-black',
  },
  {
    field: "actions",
    label: t("locationSettings.action"),
    thClass: 'text-13 fw-500',
    tdClass: 'text-12 fw-500 dark-black text-center',
  },
]

const addForm = reactive({
  reservation_id: ''
})

const addingState = ref(false)
const acceptModalStatus = ref(false)
const onAcceptModalRequest = async () => {
  const formData = new FormData()
  formData.append('reservation_id', addForm.reservation_id ?? '')
  try {
    // const res = await api.post(`/booking-accept/${addForm.reservation_id}`, addForm.reservation_id)
    // router.push(`/reservierungen/aktualisieren/${res.data.reservation_id}`)

    addingState.value = true
    await api.post(`/booking-accept/${bookingID.value}`, formData)
    acceptModalStatus.value = false
    addForm.reservation_id = ''
    reFetch()
    toast.success(`${t('toast.updateText')}`)
  } catch (error) {
    toast.error(`${t('toast.failureUpdateText')}`)
  }
  finally {
    addingState.value = false
  }
}

const bookingID = ref()
const onAcceptRequest = async (data) => {
  bookingID.value = data.id
  acceptModalStatus.value = true
}

const activeDeclineId = ref()
const onDeclineRequest = async (data) => {
  activeDeclineId.value = data.id
  try {
    await api.get(`/booking-decline/${activeDeclineId.value}`)
    reFetch()

    toast.success(`${t('toast.updateText')}`)
  } catch (error) {
    toast.error(`${t('toast.failureUpdateText')}`)
  }
}

const activeRevertId = ref()
const onRevertRequest = async (data) => {
  activeRevertId.value = data.id
  try {
    await api.get(`/booking-pening/${activeRevertId.value}`)
    reFetch()

    toast.success(`${t('toast.updateText')}`)
  } catch (error) {
    toast.error(`${t('toast.failureUpdateText')}`)
  }
}

const filters = [
  { label: t("requests.all"), id: '' },
  { label: t("requests.accepted"), id: 'Accept' },
  { label: t("requests.declined"), id: 'Decline' },
]

// Search
const searchValue = ref('')
// Filter
const activeFilter = ref('')
const filterData = async (filter) => {
  activeFilter.value = filter
  currentPage.value = 1
  reFetch(`booking-get?page=${currentPage.value}&status=${filter}&name=${searchValue.value}`)
}

// Search method
const onSearch = _.debounce((val) => {
  searchValue.value = val
  currentPage.value = 1
  reFetch(`booking-get?page=${currentPage.value}&status=${activeFilter.value}&name=${searchValue.value}`)
}, 500)

// Change Page
const changePage = () => {
  reFetch(`booking-get?page=${currentPage.value}&status=${activeFilter.value}&name=${searchValue.value}`)
}



</script>
<template>

  <!-- <pre>{{requestData}}</pre> -->
  <PageHeader button-path="/reservierungen/erstellen" @search="onSearch" :button-text="` ${ t('dashboard-reservation.add-reservation')}`">
    <template #filter>
      <ActionDropdown class="ms-3">
        <template #action-icon>
          <svg width="48" height="45" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 33V26" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M16 22V15" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M24 33V24" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M24 20V15" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M32 33V28" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M32 24V15" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M13 26H19" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M21 20H27" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M29 28H35" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <rect x="0.5" y="0.5" width="47" height="47" rx="3.5" stroke="#DDDDDD" />
          </svg>

        </template>
        <li v-for="(filter, i) in filters" :key="i" @click="filterData(filter.id)" class="dropdown-item py-2 pointer">{{
        filter.label }}</li>
      </ActionDropdown>
    </template>
    <template #addIcon>
      <svg width="24" height="21" class="me-2" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.4215 3.17773H3.17769C1.97499 3.17773 1 4.15272 1 5.35543V20.5993C1 21.802 1.97499 22.777 3.17769 22.777H18.4215C19.6243 22.777 20.5992 21.802 20.5992 20.5993V5.35543C20.5992 4.15272 19.6243 3.17773 18.4215 3.17773Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M15.1543 1V5.35539" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M6.44336 1V5.35539" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M1 9.71094H20.5992" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M18.7389 25.0002C21.6204 25.0002 23.9563 22.6643 23.9563 19.7828C23.9563 16.9013 21.6204 14.5654 18.7389 14.5654C15.8574 14.5654 13.5215 16.9013 13.5215 19.7828C13.5215 22.6643 15.8574 25.0002 18.7389 25.0002Z" fill="black" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M20.961 18.9209L18.0915 21.7905L16.7871 20.4861" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </template>
  </PageHeader>
  <!-- <pre>{{requestData}}</pre> -->
  <DataTable :fields="fields" :data="requestData?.data || []" :loading="loading">
    <template #status="{row}">
      <div class="text-12 fw-500">
        <span v-if="row.accept_status == 'cccept'">{{t('form-fields.accept')}}</span>
        <span v-if="row.accept_status == 'decline'">{{t('requests.declined')}}</span>
        <span v-if="row.accept_status == 'pending'">{{t('form-fields.pending')}}</span>
        <span v-if="row.accept_status == 'request'">{{t('form-fields.request')}}</span>
        <span v-if="row.accept_status == 'expired'">{{t('form-fields.expired')}}</span>
        <span v-if="row.accept_status == 'confirm'">{{t('form-fields.confirmed')}}</span>
      </div>
    </template>
    <template #request_from="{row}">
      <div class="mb-1" v-if="locale === 'en'">{{ moment(row.pickup_date).format('DD/MM/YYYY') }}</div>
      <div class="mb-1" v-else>{{ moment(row.pickup_date).format('DD.MM.YYYY') }}</div>
      <div v-if="locale === 'en'">{{ moment(row.pickup_time, "HH:mm:ss").format('h:mm A') }}</div>
      <div v-else>{{ moment(row.pickup_time, "HH:mm:ss").format('HH:mm') }}</div>
    </template>

    <!-- Customer Details -->
    <template #customer_details="{row}">
      <div>{{row.company_name}}</div>
      <div>
        <span v-if="row.name_title == 'Mrs.' || row.name_title == 'Frau' ">{{t('home-booking-request-form.mrs')}}</span>
        <span v-if="row.name_title == 'Mr.' || row.name_title == 'Herr' ">{{t('home-booking-request-form.mr')}}</span>
        {{ row.first_name }} {{ row.last_name }}
      </div>
      <div>{{ row.phone }}</div>
      <div>{{ row.email }}</div>
    </template>

    <!-- Message -->
    <template #message="{row}">
      <div style="max-width: 200px">{{ row.message ?? '-' }}</div>
    </template>

    <!-- Time range -->
    <template #time_range="{row}">
      <div class="mb-1" v-if="locale === 'en'">{{t('requests.from')}}: {{ moment(row.pickup_date).format('DD/MM/YYYY')
      }}, {{ moment(row.pickup_time, "HH:mm:ss").format('h:mm A') }}</div>
      <div class="mb-1" v-else>{{t('requests.from')}}: {{ moment(row.pickup_date).format('DD.MM.YYYY') }}, {{
      moment(row.pickup_time, "HH:mm:ss").format('HH:mm') }}</div>
      <div v-if="locale === 'en'">{{t('requests.to')}}: {{ moment(row.return_date).format('DD/MM/YYYY') }}, {{
      moment(row.return_time, "HH:mm:ss").format('h:mm A') }}</div>
      <div v-else>{{t('requests.to')}}: {{ moment(row.return_date).format('DD.MM.YYYY') }}, {{ moment(row.return_time,
      "HH:mm:ss").format('HH:mm') }}</div>
    </template>

    <!-- Status -->
    <template #actions={row}>
      <div v-if="row.status == 'Accept'">
        <button class="btn btn-accepted d-flex justify-content-center" style="width: 80px; cursor: default;">{{t('requests.accepted')}}</button>
      </div>
      <div v-if="row.status == 'Confirm'">
        <button class="btn btn-accepted d-flex justify-content-center" style="width: 80px; cursor: default;">{{t('form-fields.confirmed')}}</button>
      </div>
      <div v-if="row.status == 'Decline'" class="d-flex align-items-center">
        <button class="btn btn-declined d-flex justify-content-center mb-2" style="width: 80px; cursor: default;">{{t('requests.declined')}}</button>
        <!-- <button @click="onRevertRequest(row)" class="btn btn-decline text-white d-flex justify-content-center" style="width: 80px;">{{t('requests.revert')}}</button> -->
        <span class="pointer ms-3" @click="onRevertRequest(row)">
          <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.01569 0C5.63044 0 2.80234 2.57274 2.16675 5.97321L0.839188 4.20989L0 4.92343L2.14903 7.7776C2.25378 7.91632 2.40959 7.99166 2.56862 7.99166C2.64975 7.99166 2.73194 7.97224 2.80878 7.93173L6.03231 6.21921L5.55147 5.19798L3.18272 6.45612C3.62219 3.45123 6.06616 1.14166 9.01569 1.14166C12.2742 1.14166 14.9255 3.95871 14.9255 7.42083C14.9255 10.883 12.2742 13.7 9.01569 13.7V14.8417C12.8667 14.8417 16 11.5126 16 7.42083C16 3.32911 12.8667 0 9.01569 0Z" fill="black" />
          </svg>
        </span>
      </div>
      <div v-if="row.status == 'expired'" class="d-flex align-items-center">
        <!-- <button class="btn btn-declined d-flex justify-content-center mb-2" style="width: 80px; cursor: default;">{{t('requests.expired')}}</button> -->
      </div>
      <div v-if="row.status == 'Pending'" class="d-flex flex-column">
        <button @click="onAcceptRequest(row)" class="btn btn-accept text-white mb-2 d-flex justify-content-center" style="width: 80px;">{{t('requests.accept')}}</button>
        <button @click="onDeclineRequest(row)" class="btn btn-decline text-white d-flex justify-content-center" style="width: 80px;">{{t('requests.decline')}}</button>
      </div>
    </template>

    <template #createNew>
      <div class="text-25 fw-400 pointer text-primary" style="font-size: 25px; color: #276EF1;">
        <app-link path="/reservierungen/erstellen">{{t('button.click-here-to-create-a-new-record')}}</app-link>
      </div>
    </template>

    <!-- Pagination -->
    <template #pagination>
      <div class="d-flex justify-content-end">
        <BPagination v-model="currentPage" :total-pages="pageCount" @change="changePage" />
      </div>
    </template>

  </DataTable>

  <!-- Accept Modal -->
  <ModalControl v-model="acceptModalStatus" dialogClass="modal-md">
    <div class="modal-header">
      <p class="mb-1">{{t('requests.accept-request')}}</p>
    </div>
    <div class="modal-body">
      <FormSelect v-model="addForm.reservation_id" :searching="loading" errorField="reservation_id" :options="reservationData?.reservations || []" displayProperty="reservation_no" valueProperty="id" :label="t('Accident.reservation-id')" :placeholder="t('Accident.reservation-id')" no-border>
      </FormSelect>
    </div>
    <div class="modal-footer border-0 mt-2">
      <button @click="acceptModalStatus= false" type="button" class="btn btn-cancel px-5 py-2 btn-sm me-3">{{t('button.cancel')}}</button>
      <PrimaryButton variant="dark" class="btn-save d-flex align-items-center justify-content-center" style="min-width: 180px;" @click="onAcceptModalRequest" :loading="addingState">
        <span class="me-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M22 6L12 13L2 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
        <span class="">{{t('form-fields.accept')}}</span>
      </PrimaryButton>
    </div>
  </ModalControl>

</template>

<style lang="scss" scoped>
.dark-black {
  color: $dark-black !important;
}

.btn-accept,
.btn-decline,
.btn-accepted,
.btn-declined {
  font-size: 12px;
  font-weight: 500;
  border-color: transparent;

  &:hover {
    border-color: transparent;
  }
}

.btn-accept {
  background-color: #46b276;
}

.btn-accepted {
  background-color: #f3fff8;
  color: #1bce6c;
}

.btn-decline {
  background-color: #ff9594;
}

.btn-declined {
  background: rgba(242, 62, 61, 0.22);
  color: #f23e3d;
}
</style>
