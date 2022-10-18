<script setup>
import { ref } from 'vue'
import PageHeader from "../../../components/dashboard/PageHeader.vue"

import DataTable from '@/components/common/DataTable.vue'
import ModalControl from '@/components/common/modals/ModalControl.vue'
import BPagination from "@/components/base/BPagination.vue"
import StatusButton from "@/components/dashboard/shared/StatusButton.vue"
import ActionDropdown from '../../../components/common/ActionDropdown.vue'
import ConfirmDialog from '@/components/common/modals/ConfirmDialog.vue'
import SelectControl from '../../../components/dashboard/form/SelectControl.vue'
import PrimaryButton from '../../../components/buttons/PrimaryButton.vue'
import { useAxios, api } from '../../../use/useAxios'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import _ from 'lodash'

const { t, locale } = useI18n({ useScope: 'global' })
const toast = useToast()
const { data: reservations, loading, pageCount, reFetch } = useAxios('/admin/reservation')

const currentPage = ref(1)

const fields = [
  {
    field: "customer_id",
    label: `#${t("form-fields.id&customer")}`,
    thClass: 'text-13 fw-500',
  },
  {
    field: "to_pay",
    label: t("form-fields.price"),
    thClass: 'text-13 fw-500',
  },
  {
    field: "vehicle_name",
    label: t("form-fields.vehicle"),
    thClass: 'text-13 fw-500',
  },
  {
    field: "pickup_name",
    label: t("form-fields.pickup"),
    thClass: 'text-13 fw-500',
  },
  {
    field: "return_name",
    label: t("form-fields.return"),
    thClass: 'text-13 fw-500',
  },
  {
    field: "create_name",
    label: t("form-fields.created"),
    thClass: 'text-13 fw-500',
  },
  {
    field: "reservation_status",
    label: t("form-fields.status"),
    thClass: 'text-13 fw-500',
  },
  {
    field: "actions",
    label: t("form-fields.actions"),
    thClass: "text-right text-13",
    tdClass: "text-14 text-right",
    hideTh: true,
  },
]

// Status
const activeStatusModal = ref(null)
const statusData = ref(null)
const statusModal = ref(false)
const savingStatus = ref(false)

const filters = [
  { label: t('form-fields.all'), id: '' },
  { label: t('form-fields.reserved'), id: 'Reserved' },
  { label: t('form-fields.rented'), id: 'Rented' },
  { label: t('form-fields.completed'), id: 'Completed' },
  { label: t('form-fields.cancelled'), id: 'Cancelled' },
  // { label: t('form-fields.confirmed'), id: 'Confirmed' },
  // { label: t('requests.declined'), id: 'Declined' },
  // { label: t('text.expired'), id: 'Expired' },
]

const statusOptions = [
  { label: t('form-fields.reserved'), id: 'Reserved' },
  { label: t('form-fields.rented'), id: 'Rented' },
  { label: t('form-fields.completed'), id: 'Completed' },
  { label: t('form-fields.cancelled'), id: 'Cancelled' },
  // { label: t('form-fields.confirmed'), id: 'Confirmed' },
  // { label: t('requests.declined'), id: 'Declined' },
  // { label: t('text.expired'), id: 'Expired' },
]

const getStatus = (val) => {
  if (val == 'Reserved') return 'info'
  if (val == 'Rented') return 'warning'
  if (val == 'Completed') return 'success'
  if (val == 'Cancelled') return 'danger'
  if (val == 'Confirmed') return 'primary'
  if (val == 'Declined') return 'danger'
  if (val == 'Expired') return 'grey'

  return 'primary'
}

// Change Status
const changeStatus = async () => {
  try {
    savingStatus.value = true

    await api.post(`admin/reservation/status/${activeStatusModal.value.id}`, {
      reservation_status: statusData.value
    })

    statusModal.value = false
    reFetch()
  } catch (error) {
    console.error(error)
  } finally {
    savingStatus.value = false
  }
}


// const openStatusModal = (row) => {
//   statusModal.value = true
//   statusData.value = row.reservation_status
//   activeStatusModal.value = row
// }

// Delte
const deleting = ref(false)
const activeDeleteId = ref()
const showDeleteModal = ref(false)
const onDelete = async () => {
  try {
    deleting.value = true
    await api.delete(`admin/reservation/delete/${activeDeleteId.value}`)

    reFetch()
    showDeleteModal.value = false
    toast.success("Deleted Successfully")
  } catch (error) {
    toast.error('Request Fail!')
  } finally {
    deleting.value = false
  }
}

// Open Delete Modal
const openDeleteModal = (id) => {
  activeDeleteId.value = id
  showDeleteModal.value = true
}

// Search
const searchValue = ref('')
// Filter
const activeFilter = ref('')
const filterData = async (filter) => {
  activeFilter.value = filter
  currentPage.value = 1

  reFetch(`admin/reservation?page=${currentPage.value}&status=${filter}&name=${searchValue.value}`)
}

// Search method
const onSearch = _.debounce((val) => {
  searchValue.value = val
  currentPage.value = 1
  reFetch(`admin/reservation?page=${currentPage.value}&status=${activeFilter.value}&name=${searchValue.value}`)
}, 500)

// Change Page
const changePage = () => {
  reFetch(`admin/reservation?page=${currentPage.value}&status=${activeFilter.value}&name=${searchValue.value}`)
}
</script>

<template>

  <PageHeader button-path="/reservierungen/erstellen" @search="onSearch" :button-text="`${$t('dashboard-reservation.add-reservation')}`">
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

  <!-- <ReservationTable /> -->

  <DataTable :fields="fields" :data="reservations?.data || []" :loading="loading">

    <!-- Customer Id -->
    <template #customer_id="{row}">
      <div class="d-table-user">
        <div class="d-table-user__avatar">
          <div class="w-100 h-100 d-flex justify-content-center align-items-center bg-primary text-white">
            <h6 class="mb-0 nowrap">{{ row.first_name?.charAt(0) }}{{ row.last_name?.charAt(0) }}</h6>
          </div>
        </div>
        <div class="d-table-user__info">
          <p class="mb-1">#{{ row.reservation_no }}</p>
          <h5 class="nowrap">{{ row.full_name }}</h5>
        </div>
      </div>
    </template>

    <!-- To Pay -->
    <template #to_pay="{row}">
      <p class="mb-1 text-14 nowrap">{{t('form-fields.total')}} {{moneyFormat(row.total_amount_paid, locale)}}</p>
      <p class="text-14 nowrap">{{t('form-fields.due')}} {{moneyFormat( (row.to_pay ?? 0), locale)}}</p>
    </template>

    <!-- Vehicle -->
    <template #vehicle_name="{row}">
      <div v-if="row.vehicle_id" class="d-table-user">
        <div class=" d-table-user__avatar--car me-2" style="width: 60px; height: 60px; border-radius: 50%; overflow: hidden; background: #eee;">
          <img v-if="row.vehiclephoto" :src="imageBaseUrl(`/documents/${row.vehiclephoto.file_name}`)" alt="Vehicle" class="img-fluid img-circle h-100" />
          <img v-else src="../../../assets/images/carPlaceholder.svg" class="img-fluid img-circle h-100" />
        </div>
        <div class="d-table-user__info">
          <div class="text-14 fw-500 mb-1">{{ row.vehicle_name }}</div>
          <div class="text-14 mb-0">{{ row.classname }}</div>
        </div>
      </div>
      <div v-else>{{t('FleetView.no-vehicle')}}</div>
    </template>

    <!-- Pickup -->
    <template #pickup_name="{row}">
      <div class="text-14 mb-1">
        <span v-if="locale == 'en' ">
          <strong>{{ moment(row.start_time, "HH:mm:ss").format('h:mm A') }}</strong> ,
          {{ moment(row.start_date).format('DD/MM/YYYY') }}
        </span>
        <span v-if="locale == 'de' ">
          <strong>{{ moment(row.start_time, "HH:mm:ss").format('HH:mm') }}</strong> ,
          {{ moment(row.start_date).format('DD.MM.YYYY') }}
        </span>
      </div>

      <div class="text-14 mb-0">
        <span v-if="row.pickup_street">{{ row.pickup_street }}</span>
        <span v-if="row.pickup_postcode">, {{ row.pickup_postcode }}</span>
        <span>, {{ row.pickup_name }}</span>
        <span v-if="row.pickup_postcode">, {{ row.pickup_city }}</span>
      </div>
    </template>
    <!-- Return -->
    <template #return_name="{row}">
      <div class="text-14 mb-1">
        <span v-if="locale == 'en' ">
          <strong>{{ moment(row.end_time, "HH:mm:ss").format('h:mm A') }}</strong> ,
          {{ moment(row.end_date).format('DD/MM/YYYY') }}
        </span>
        <span v-if="locale == 'de' ">
          <strong>{{ moment(row.end_time, "HH:mm:ss").format('HH:mm') }}</strong> ,
          {{ moment(row.end_date).format('DD.MM.YYYY') }}
        </span>
      </div>

      <div class="text-14 mb-0">
        <span v-if="row.return_street">{{ row.return_street }}</span>
        <span v-if="row.return_postcode">, {{ row.return_postcode }}</span>
        <span>, {{ row.return_name }} </span>
        <span v-if="row.return_postcode">, {{ row.return_city }}</span>
      </div>
    </template>

    <!-- Created -->
    <template #create_name="{row}">
      <div class="text-14 mb-1" v-if="row.create_name"><strong>{{ row.create_name }}</strong></div>
      <div class="text-14 mb-1" v-else><strong>{{ t('dashboard-reservation.former-employee') }}</strong></div>
      <div class="text-14 mb-0">
        <span v-if="locale == 'en' ">{{ moment(row.created_at).format('h:mm A, DD/MM/YYYY') }}</span>
        <span v-if="locale == 'de' ">{{ moment(row.created_at).format('H:mm, DD.MM.YYYY') }}</span>
      </div>
    </template>

    <!-- Status -->
    <template #reservation_status="{row}">
      <StatusButton :type="getStatus(row.reservation_status)" style="cursor: default;">
        <span v-if="row.reservation_status == 'Reserved'">{{t('form-fields.reserved')}}</span>
        <span v-if="row.reservation_status == 'Rented'">{{t('form-fields.rented')}}</span>
        <span v-if="row.reservation_status== 'Completed' ">{{t('form-fields.completed')}}</span>
        <span v-if="row.reservation_status== 'Cancelled' ">{{t('form-fields.cancelled')}}</span>
        <span v-if="row.reservation_status== 'Confirmed' ">{{t('form-fields.confirmed')}}</span>
        <span v-if="row.reservation_status== 'Expired' ">{{t('text.expired')}}</span>
        <span v-if="row.reservation_status== 'Declined' ">{{t('requests.declined')}}</span>
      </StatusButton>
    </template>

    <!-- Actions -->
    <template #actions="{row}">
      <ActionDropdown>
        <li>
          <app-link :path="`/reservierungen/reservierungsvorschau/${row.id}`" class="dropdown-item py-2 pointer">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_1584_1800)">
                <path d="M0.666016 7.99984C0.666016 7.99984 3.33268 2.6665 7.99935 2.6665C12.666 2.6665 15.3327 7.99984 15.3327 7.99984C15.3327 7.99984 12.666 13.3332 7.99935 13.3332C3.33268 13.3332 0.666016 7.99984 0.666016 7.99984Z" stroke="#B2B2B2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" stroke="#B2B2B2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </g>
              <defs>
                <clipPath id="clip0_1584_1800">
                  <rect width="16" height="16" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <span class="ms-3 text-14">{{ t("button.view") }}</span>
          </app-link>
        </li>
        <li v-if="row.reservation_status === 'Reserved' ">
          <app-link :path="`/reservierungen/aktualisieren/${row.id}`" class="dropdown-item py-2 pointer">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.333 2.00004C11.5081 1.82494 11.716 1.68605 11.9447 1.59129C12.1735 1.49653 12.4187 1.44775 12.6663 1.44775C12.914 1.44775 13.1592 1.49653 13.3879 1.59129C13.6167 1.68605 13.8246 1.82494 13.9997 2.00004C14.1748 2.17513 14.3137 2.383 14.4084 2.61178C14.5032 2.84055 14.552 3.08575 14.552 3.33337C14.552 3.58099 14.5032 3.82619 14.4084 4.05497C14.3137 4.28374 14.1748 4.49161 13.9997 4.66671L4.99967 13.6667L1.33301 14.6667L2.33301 11L11.333 2.00004Z" stroke="#B2B2B2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="ms-3 text-14">{{ t("button.edit") }}</span>
          </app-link>
        </li>
        <li v-if="row.reservation_status === 'Rented'">
          <app-link :path="`/reservierungen/end-miete/${row.id}`" class="dropdown-item py-2 pointer">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.3335 2C11.5086 1.8249 11.7165 1.68601 11.9452 1.59125C12.174 1.49649 12.4192 1.44772 12.6668 1.44772C12.9145 1.44772 13.1597 1.49649 13.3884 1.59125C13.6172 1.68601 13.8251 1.8249 14.0002 2C14.1753 2.1751 14.3142 2.38297 14.4089 2.61174C14.5037 2.84051 14.5524 3.08571 14.5524 3.33333C14.5524 3.58096 14.5037 3.82615 14.4089 4.05493C14.3142 4.2837 14.1753 4.49157 14.0002 4.66667L5.00016 13.6667L1.3335 14.6667L2.3335 11L11.3335 2Z" stroke="#B2B2B2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="ms-3 text-14">{{t('dashboard-reservation.end-rental')}}</span>
          </app-link>
        </li>
        <li v-if="row.reservation_status === 'Completed' || row.reservation_status === 'Rented'">
          <app-link :path="`/reservierungen/vertrags-vorschau/${row.id}`" class="dropdown-item py-2 pointer">
            <svg width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.4912 0.851847L3.64251 0.00166998C3.19106 -0.0257787 2.79951 0.288418 2.76927 0.702643L2.66095 2.18939H0.820311C0.368015 2.18939 0 2.52716 0 2.94229V21.2471C0 21.6622 0.368015 22 0.820311 22H11.4206C11.5125 22 11.6036 21.9655 11.6687 21.906L13.2689 20.4438C13.2852 20.447 13.3018 20.4495 13.3188 20.4505L16.0508 20.6182C16.4868 20.6446 16.8948 20.3191 16.924 19.9173L18.255 1.65336C18.2849 1.24344 17.9378 0.879252 17.4912 0.851847ZM11.7722 20.8963V18.6548C11.7722 18.5956 11.8248 18.5473 11.8894 18.5473H14.3222L11.7722 20.8963ZM16.2225 19.8742C16.211 19.9392 16.1694 19.9726 16.0978 19.9743L13.9284 19.8412L15.4168 18.4812C15.4831 18.4206 15.5203 18.3383 15.5203 18.2525V2.94233C15.5203 2.5272 15.1523 2.18943 14.7 2.18943H11.0441C10.5896 2.18943 10.5896 2.83478 11.0441 2.83478H14.7C14.7647 2.83478 14.8172 2.88305 14.8172 2.94233V17.9019H11.8894C11.4371 17.9019 11.0691 18.2397 11.0691 18.6548V21.3547H0.820311C0.755717 21.3547 0.703123 21.3064 0.703123 21.2471V2.94233C0.703123 2.88305 0.755717 2.83478 0.820311 2.83478H9.17192C9.62646 2.83478 9.62646 2.18943 9.17192 2.18943H3.36562L3.4708 0.745752C3.48224 0.680744 3.52382 0.647402 3.59554 0.645638L17.4443 1.49577C17.5151 1.50627 17.5515 1.54443 17.5534 1.61026L16.2225 19.8742Z" fill="#B2B2B2" />
              <path d="M12.5547 10.1847H2.96631C2.77215 10.1847 2.61475 10.3292 2.61475 10.5074C2.61475 10.6856 2.77215 10.83 2.96631 10.83H12.5547C12.7489 10.83 12.9063 10.6856 12.9063 10.5074C12.9063 10.3292 12.7489 10.1847 12.5547 10.1847Z" fill="#B2B2B2" />
              <path d="M12.5547 12.4339H2.96631C2.77215 12.4339 2.61475 12.5783 2.61475 12.7565C2.61475 12.9347 2.77215 13.0792 2.96631 13.0792H12.5547C12.7489 13.0792 12.9063 12.9347 12.9063 12.7565C12.9063 12.5783 12.7489 12.4339 12.5547 12.4339Z" fill="#B2B2B2" />
              <path d="M2.61475 8.25773C2.61475 8.43593 2.77215 8.5804 2.96631 8.5804H12.5547C12.7489 8.5804 12.9063 8.43593 12.9063 8.25773C12.9063 8.07953 12.7489 7.93506 12.5547 7.93506H2.96631C2.77215 7.93506 2.61475 8.07953 2.61475 8.25773Z" fill="#B2B2B2" />
              <path d="M4.30225 6.00855C4.30225 6.18675 4.45965 6.33122 4.65381 6.33122H10.8641C11.0583 6.33122 11.2157 6.18675 11.2157 6.00855C11.2157 5.83035 11.0583 5.68587 10.8641 5.68587H4.65381C4.45965 5.68587 4.30225 5.83035 4.30225 6.00855Z" fill="#B2B2B2" />
              <path d="M9.12881 18.8642C8.49651 18.8657 7.86421 18.867 7.23192 18.8679C7.01939 18.8682 6.80691 18.8684 6.59442 18.8686C6.20934 18.8688 5.94989 18.7979 5.86364 18.4091C5.7907 18.0804 5.28408 18.1246 5.18564 18.4091C4.94236 19.112 4.53999 18.8366 4.31461 18.3638C4.08976 17.8922 4.0321 17.3643 3.9339 16.8623C3.86171 16.4935 3.25393 16.5969 3.24333 16.9481C3.22937 17.4107 3.1823 17.8658 3.05438 18.3144C2.92243 18.7773 2.72466 19.2221 2.52835 19.6643C2.35721 20.0499 3.03774 20.2157 3.20635 19.8359C3.3803 19.444 3.55449 19.05 3.68415 18.6436C3.92508 19.1753 4.42355 19.7768 5.13385 19.4223C5.26599 19.3564 5.38941 19.2626 5.49774 19.1533C5.86711 19.5451 6.41691 19.5142 6.93136 19.5136C7.66387 19.5128 8.39639 19.5113 9.1289 19.5095C9.5812 19.5085 9.58204 18.8631 9.12881 18.8642Z" fill="#B2B2B2" />
              <path d="M23.7161 10.5887C23.5334 10.4218 23.2823 10.3363 23.0273 10.3299L22.7616 10.3311V9.86997C22.7616 9.58908 22.5798 9.2923 22.3194 9.14452V8.49496C22.3194 7.15828 20.052 7.16409 20.052 8.50124V9.15089C19.7867 9.30138 19.6088 9.56997 19.6088 9.87591V10.3484C18.4385 10.4215 18.4352 12.0583 19.6101 12.1223C19.6176 13.5668 19.6172 14.9876 19.6088 16.4563C19.6065 16.8613 20.3095 16.8851 20.3119 16.4597C20.3203 14.9898 20.3207 13.5677 20.3133 12.122L22.0575 12.1141C22.0575 12.1141 22.0553 16.8831 22.0553 19.0315C22.0553 20.0785 20.3106 20.0855 20.3106 19.0206L20.3112 18.4321C20.3387 18.0157 19.6369 17.9768 19.6094 18.3933V18.9454C19.6094 19.4187 19.7689 19.8195 20.0776 20.1014C20.105 20.7766 20.415 21.4299 20.9386 21.9065C21.0888 22.0433 21.2968 22.0015 21.4422 21.8986C21.975 21.4088 22.2752 20.7631 22.2939 20.0739C22.526 19.8617 22.7583 19.6481 22.7583 18.9167L22.7586 15.9761C23.3666 16.1348 24.0005 15.7029 24.0005 15.1179V11.2169C24.0005 10.9793 23.8995 10.7562 23.7161 10.5887ZM20.3119 10.3423V9.87587C20.3119 9.7804 20.3833 9.70033 20.4794 9.67654L21.8868 9.67013C21.9262 9.67908 21.9625 9.69616 21.9919 9.72309C22.0348 9.76229 22.0585 9.81443 22.0585 9.86997V10.3344L20.3119 10.3423ZM21.1871 8.10509C21.4029 8.10509 21.6162 8.29929 21.6162 8.49496V9.01838L20.7551 9.02229V8.50124C20.7551 8.28385 20.9488 8.10616 21.1871 8.10509ZM21.1866 21.1798C21.0231 20.9672 20.9049 20.7267 20.8389 20.474C20.9478 20.4956 21.058 20.5069 21.1683 20.5069C21.2914 20.5069 21.4145 20.4929 21.5358 20.4657C21.4713 20.7223 21.3533 20.9642 21.1866 21.1798ZM23.2974 15.1179C23.2974 15.4234 22.7606 15.4475 22.7606 15.1236C22.7606 15.1236 22.7612 12.07 22.7616 11.7901C22.7618 11.6096 22.5983 11.4671 22.4073 11.4671L19.6703 11.4795C19.3309 11.4795 19.3388 10.9921 19.6738 10.9905L23.0307 10.9753C23.1931 10.988 23.2819 11.0685 23.2974 11.2169V15.1179H23.2974Z" fill="#B2B2B2" />
            </svg>
            <span class="ms-3 text-14">{{t('dashboard-reservation.contract')}}</span>
          </app-link>
        </li>
        <li v-if="row.reservation_status === 'Completed' || row.reservation_status === 'Rented'">
          <app-link :path="`/rechnung/erstellen?reservationId=${row.id}`" class="dropdown-item py-2 pointer">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H8" stroke="#B2B2B2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M15 2H9C8.44772 2 8 2.44772 8 3V5C8 5.55228 8.44772 6 9 6H15C15.5523 6 16 5.55228 16 5V3C16 2.44772 15.5523 2 15 2Z" stroke="#B2B2B2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <line x1="9" y1="17" x2="15" y2="17" stroke="#B2B2B2" stroke-width="2" stroke-linecap="round" />
              <line x1="9" y1="12" x2="11" y2="12" stroke="#B2B2B2" stroke-width="2" stroke-linecap="round" />
            </svg>
            <span class="ms-3 text-14">{{t('dashboard-reservation.invoices')}}</span>
          </app-link>
        </li>
        <li v-if="row.reservation_status === 'Completed' || row.reservation_status === 'Rented'">
          <app-link :path="`/reservierungen/reservierungsdateien/${row.id}`" class="dropdown-item py-2 pointer">
            <svg width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.4912 0.851847L3.64251 0.00166998C3.19106 -0.0257787 2.79951 0.288418 2.76927 0.702643L2.66095 2.18939H0.820311C0.368015 2.18939 0 2.52716 0 2.94229V21.2471C0 21.6622 0.368015 22 0.820311 22H11.4206C11.5125 22 11.6036 21.9655 11.6687 21.906L13.2689 20.4438C13.2852 20.447 13.3018 20.4495 13.3188 20.4505L16.0508 20.6182C16.4868 20.6446 16.8948 20.3191 16.924 19.9173L18.255 1.65336C18.2849 1.24344 17.9378 0.879252 17.4912 0.851847ZM11.7722 20.8963V18.6548C11.7722 18.5956 11.8248 18.5473 11.8894 18.5473H14.3222L11.7722 20.8963ZM16.2225 19.8742C16.211 19.9392 16.1694 19.9726 16.0978 19.9743L13.9284 19.8412L15.4168 18.4812C15.4831 18.4206 15.5203 18.3383 15.5203 18.2525V2.94233C15.5203 2.5272 15.1523 2.18943 14.7 2.18943H11.0441C10.5896 2.18943 10.5896 2.83478 11.0441 2.83478H14.7C14.7647 2.83478 14.8172 2.88305 14.8172 2.94233V17.9019H11.8894C11.4371 17.9019 11.0691 18.2397 11.0691 18.6548V21.3547H0.820311C0.755717 21.3547 0.703123 21.3064 0.703123 21.2471V2.94233C0.703123 2.88305 0.755717 2.83478 0.820311 2.83478H9.17192C9.62646 2.83478 9.62646 2.18943 9.17192 2.18943H3.36562L3.4708 0.745752C3.48224 0.680744 3.52382 0.647402 3.59554 0.645638L17.4443 1.49577C17.5151 1.50627 17.5515 1.54443 17.5534 1.61026L16.2225 19.8742Z" fill="#B2B2B2" />
              <path d="M12.5547 10.1847H2.96631C2.77215 10.1847 2.61475 10.3292 2.61475 10.5074C2.61475 10.6856 2.77215 10.83 2.96631 10.83H12.5547C12.7489 10.83 12.9063 10.6856 12.9063 10.5074C12.9063 10.3292 12.7489 10.1847 12.5547 10.1847Z" fill="#B2B2B2" />
              <path d="M12.5547 12.4339H2.96631C2.77215 12.4339 2.61475 12.5783 2.61475 12.7565C2.61475 12.9347 2.77215 13.0792 2.96631 13.0792H12.5547C12.7489 13.0792 12.9063 12.9347 12.9063 12.7565C12.9063 12.5783 12.7489 12.4339 12.5547 12.4339Z" fill="#B2B2B2" />
              <path d="M2.61475 8.25773C2.61475 8.43593 2.77215 8.5804 2.96631 8.5804H12.5547C12.7489 8.5804 12.9063 8.43593 12.9063 8.25773C12.9063 8.07953 12.7489 7.93506 12.5547 7.93506H2.96631C2.77215 7.93506 2.61475 8.07953 2.61475 8.25773Z" fill="#B2B2B2" />
              <path d="M4.30225 6.00855C4.30225 6.18675 4.45965 6.33122 4.65381 6.33122H10.8641C11.0583 6.33122 11.2157 6.18675 11.2157 6.00855C11.2157 5.83035 11.0583 5.68587 10.8641 5.68587H4.65381C4.45965 5.68587 4.30225 5.83035 4.30225 6.00855Z" fill="#B2B2B2" />
              <path d="M9.12881 18.8642C8.49651 18.8657 7.86421 18.867 7.23192 18.8679C7.01939 18.8682 6.80691 18.8684 6.59442 18.8686C6.20934 18.8688 5.94989 18.7979 5.86364 18.4091C5.7907 18.0804 5.28408 18.1246 5.18564 18.4091C4.94236 19.112 4.53999 18.8366 4.31461 18.3638C4.08976 17.8922 4.0321 17.3643 3.9339 16.8623C3.86171 16.4935 3.25393 16.5969 3.24333 16.9481C3.22937 17.4107 3.1823 17.8658 3.05438 18.3144C2.92243 18.7773 2.72466 19.2221 2.52835 19.6643C2.35721 20.0499 3.03774 20.2157 3.20635 19.8359C3.3803 19.444 3.55449 19.05 3.68415 18.6436C3.92508 19.1753 4.42355 19.7768 5.13385 19.4223C5.26599 19.3564 5.38941 19.2626 5.49774 19.1533C5.86711 19.5451 6.41691 19.5142 6.93136 19.5136C7.66387 19.5128 8.39639 19.5113 9.1289 19.5095C9.5812 19.5085 9.58204 18.8631 9.12881 18.8642Z" fill="#B2B2B2" />
              <path d="M23.7161 10.5887C23.5334 10.4218 23.2823 10.3363 23.0273 10.3299L22.7616 10.3311V9.86997C22.7616 9.58908 22.5798 9.2923 22.3194 9.14452V8.49496C22.3194 7.15828 20.052 7.16409 20.052 8.50124V9.15089C19.7867 9.30138 19.6088 9.56997 19.6088 9.87591V10.3484C18.4385 10.4215 18.4352 12.0583 19.6101 12.1223C19.6176 13.5668 19.6172 14.9876 19.6088 16.4563C19.6065 16.8613 20.3095 16.8851 20.3119 16.4597C20.3203 14.9898 20.3207 13.5677 20.3133 12.122L22.0575 12.1141C22.0575 12.1141 22.0553 16.8831 22.0553 19.0315C22.0553 20.0785 20.3106 20.0855 20.3106 19.0206L20.3112 18.4321C20.3387 18.0157 19.6369 17.9768 19.6094 18.3933V18.9454C19.6094 19.4187 19.7689 19.8195 20.0776 20.1014C20.105 20.7766 20.415 21.4299 20.9386 21.9065C21.0888 22.0433 21.2968 22.0015 21.4422 21.8986C21.975 21.4088 22.2752 20.7631 22.2939 20.0739C22.526 19.8617 22.7583 19.6481 22.7583 18.9167L22.7586 15.9761C23.3666 16.1348 24.0005 15.7029 24.0005 15.1179V11.2169C24.0005 10.9793 23.8995 10.7562 23.7161 10.5887ZM20.3119 10.3423V9.87587C20.3119 9.7804 20.3833 9.70033 20.4794 9.67654L21.8868 9.67013C21.9262 9.67908 21.9625 9.69616 21.9919 9.72309C22.0348 9.76229 22.0585 9.81443 22.0585 9.86997V10.3344L20.3119 10.3423ZM21.1871 8.10509C21.4029 8.10509 21.6162 8.29929 21.6162 8.49496V9.01838L20.7551 9.02229V8.50124C20.7551 8.28385 20.9488 8.10616 21.1871 8.10509ZM21.1866 21.1798C21.0231 20.9672 20.9049 20.7267 20.8389 20.474C20.9478 20.4956 21.058 20.5069 21.1683 20.5069C21.2914 20.5069 21.4145 20.4929 21.5358 20.4657C21.4713 20.7223 21.3533 20.9642 21.1866 21.1798ZM23.2974 15.1179C23.2974 15.4234 22.7606 15.4475 22.7606 15.1236C22.7606 15.1236 22.7612 12.07 22.7616 11.7901C22.7618 11.6096 22.5983 11.4671 22.4073 11.4671L19.6703 11.4795C19.3309 11.4795 19.3388 10.9921 19.6738 10.9905L23.0307 10.9753C23.1931 10.988 23.2819 11.0685 23.2974 11.2169V15.1179H23.2974Z" fill="#B2B2B2" />
            </svg>
            <span class="ms-3 text-14">{{t('form-fields.files')}}</span>
          </app-link>
        </li>
        <li v-if="row.reservation_status !== 'Rented' && row.reservation_status !== 'Completed' && row.reservation_status !== 'Cancelled'" @click="openDeleteModal(row.id)">
          <span class="dropdown-item py-2 pointer">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 4H3.33333H14" stroke="#B2B2B2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M5.33301 4.00016V2.66683C5.33301 2.31321 5.47348 1.97407 5.72353 1.72402C5.97358 1.47397 6.31272 1.3335 6.66634 1.3335H9.33301C9.68663 1.3335 10.0258 1.47397 10.2758 1.72402C10.5259 1.97407 10.6663 2.31321 10.6663 2.66683V4.00016M12.6663 4.00016V13.3335C12.6663 13.6871 12.5259 14.0263 12.2758 14.2763C12.0258 14.5264 11.6866 14.6668 11.333 14.6668H4.66634C4.31272 14.6668 3.97358 14.5264 3.72353 14.2763C3.47348 14.0263 3.33301 13.6871 3.33301 13.3335V4.00016H12.6663Z" stroke="#B2B2B2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>

            <span class="ms-3 text-14">{{ t("button.remove") }}</span>
          </span>
        </li>
      </ActionDropdown>
    </template>

    <template #createNew>
      <div class="text-25 fw-400 pointer" style="font-size: 25px; color: #276EF1;">
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

  <ModalControl v-model="statusModal">
    <div class="modal-header">
      <div class="h6 modal-title" id="preview_image_remore_label">{{t('dashboard-reservation.change-status')}}</div>
    </div>

    <div class="modal-body">
      <SelectControl stack v-model="statusData" :options="statusOptions" :label="t('dashboard-reservation.select-status')" errorField="reservation_status" />
    </div>
    <div class="modal-footer border-0 mt-2">
      <button type="button" class="btn btn-cancel px-5 py-2 btn-sm " data-bs-dismiss="modal">{{t('button.cancel')}}</button>
      <PrimaryButton @click="changeStatus" :loading="savingStatus">{{t('button.save')}}</PrimaryButton>
    </div>
  </ModalControl>

  <!-- Delete Modal -->
  <ConfirmDialog v-model="showDeleteModal" @onOk="onDelete" :okLoading="deleting" :title="t('dashboard-reservation.delete-modal')" :message="t('dashboard-reservation.delete-modal-text')">
  </ConfirmDialog>
</template>
