<script setup>

import ActionDropdown from "@/components/common/ActionDropdown.vue"
import DataTable from "@/components/common/DataTable.vue"
import Switcher from "@/components/dashboard/form/Switcher.vue"

import { ref } from "vue"
import { useI18n } from "vue-i18n"
import { useToast } from "vue-toastification"
import BPagination from "@/components/base/BPagination.vue"
import ConfirmDialog from "@/components/common/modals/ConfirmDialog.vue"
import { api, useAxios } from "@/use/useAxios"
import _ from 'lodash'

const { t } = useI18n({ useScope: 'global' })

const toast = useToast()
const {
  data: vehicleList,
  loading,
  pageCount,
  onApiDelete,
  reFetch,
  deleting,
} = useAxios("/admin/vehicle")

const currentPage = ref(1)

const fields = [
  {
    field: "id",
    label: t("FleetIndex.id"),
    thClass: "text-13",
    tdClass: "text-12 fw-400"
  },
  {
    field: "vehicle",
    label: t("FleetIndex.vehicle"),
    thClass: "text-13",
  },
  {
    field: "location_name",
    label: t("FleetIndex.base-location"),
    thClass: "text-13",
    tdClass: "text-14 fw-400"
  },
  {
    field: "odometer",
    label: t("FleetIndex.odometer"),
    thClass: "text-13",
    tdClass: "text-14 fw-500"
  },
  {
    field: "label_name",
    label: t("FleetIndex.fuel-level"),
    thClass: "text-13",
    tdClass: "text-14 fw-500"
  },
  {
    field: 'checks',
    label: t("FleetIndex.checks"),
    thClass: "text-13",
    tdClass: "text-14 fw-500"
  },
  {
    field: "accident_count",
    label: t("FleetIndex.damages"),
    thClass: "text-13",
    tdClass: "text-14 fw-500"
  },
  {
    field: "status",
    label: t("FleetIndex.status"),
    thClass: "text-13",
  },
  {
    field: "actions",
    label: t("form-fields.actions"),
    thClass: "text-13 text-right",
    tdClass: "text-right",
    hideTh: true,
  },
]

const filters = [
  { label: t('form-fields.all'), id: '' },
  { label: t('form-fields.active'), id: 'Active' },
  { label: t('form-fields.inactive'), id: 'Inactive' }
]

// Deleting
const activeDeleteId = ref()
const showDeleteModal = ref(false)
const openDeleteModal = (id) => {
  activeDeleteId.value = id
  showDeleteModal.value = true
}
const onDelete = async () => {
  try {
    await onApiDelete(`/admin/vehicle/delete/${activeDeleteId.value}`)
    reFetch()

    showDeleteModal.value = false
    toast.success(`${t('toast.deleteText')}`)
  } catch (error) {
    toast.error(`${t('toast.failureDeleteText')}`)
  }
}

// Change Status
const onStatusChange = async (val, row) => {
  try {
    await api.post(`/admin/vehicle/status/${row.id}`, {
      status: val,
    })
    toast.success(`${t('FleetIndex.statusUpdateText')}`)
  } catch (error) {
    row.status = !row.status

    console.error(error)
    toast.error(`${t('FleetIndex.statusUpdateFailureText')}`)
  }
}

// Search
const searchValue = ref('')
// Filter
const activeFilter = ref('')
const filterData = async (filter) => {
  activeFilter.value = filter
  currentPage.value = 1

  reFetch(`admin/vehicle?page=${currentPage.value}&status=${filter}&name=${searchValue.value}`)
}
const onSearch = _.debounce((val) => {
  searchValue.value = val
  currentPage.value = 1
  reFetch(`admin/vehicle?page=${currentPage.value}&status=${activeFilter.value}&name=${searchValue.value}`)
}, 500)

// Change Page
const changePage = () => {
  reFetch(`admin/vehicle?page=${currentPage.value}&status=${activeFilter.value}&name=${searchValue.value}`)
}

</script>

<template>

  <DataTable filterable searchable :bordered="false" @onSearch="onSearch" :loading="loading" :fields="fields"
    :data="vehicleList?.data || []" tableRootClass="borderd-content">
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

    <!-- Toolbar slot -->
    <template #toolbar-append>
      <app-link path="/flotte/erstellen" class="d-flex align-items-center justify-content-center btn btn-dark ms-3 ">
        <svg width="24" height="21" viewBox="0 0 24 21" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M6.85744 11.4024C6.85744 12.1432 6.25645 12.7437 5.51561 12.7437C4.77477 12.7437 4.17432 12.1432 4.17432 11.4024C4.17432 10.6615 4.77479 10.0605 5.51561 10.0605C6.25644 10.0605 6.85744 10.6615 6.85744 11.4024Z"
            fill="white" />
          <path
            d="M19.6768 11.4024C19.6768 12.1432 19.0763 12.7437 18.3355 12.7437C17.5947 12.7437 16.9937 12.1432 16.9937 11.4024C16.9937 10.6615 17.5946 10.0605 18.3355 10.0605C19.0763 10.0605 19.6768 10.6615 19.6768 11.4024Z"
            fill="white" />
          <path
            d="M20.9438 6.48411L19.7512 2.53394C19.3041 0.968511 17.8879 0 16.3225 0H7.45311C5.88769 0 4.54639 1.04341 4.02441 2.53394L2.83179 6.48411C1.19263 7.45318 0 9.24164 0 11.4033V14.3843C0 15.8748 1.19262 17.0675 2.68313 17.0675H2.83233V17.1418V19.0795C2.83233 19.6015 3.27944 20.0485 3.8014 20.0485C4.32337 20.0485 4.77046 19.6014 4.77046 19.0795V17.1418V17.0675H19.2295V17.1418V19.0795C19.2295 19.6015 19.6766 20.0485 20.1986 20.0485C20.7206 20.0485 21.1677 19.6014 21.1677 19.0795V17.1418V17.0675H21.3169C22.8074 17.0675 24 15.8748 24 14.3843V11.4033C23.8503 9.24164 22.6579 7.45315 20.9438 6.48411ZM5.06863 5.81345L5.8885 3.05591C6.11205 2.31038 6.78272 1.78894 7.52819 1.78894L16.3975 1.78842C17.1431 1.78842 17.8138 2.3104 18.0372 3.05539L18.8571 5.81293H5.66493L5.06863 5.81345ZM21.9872 14.3843C21.9872 14.8314 21.6145 15.2042 21.1674 15.2042H2.68361C2.2365 15.2042 1.86373 14.8314 1.86373 14.3843V11.4033C1.86373 9.31643 3.50342 7.67673 5.5903 7.67673H18.2605C20.273 7.67673 21.987 9.31643 21.987 11.4033L21.9872 14.3843Z"
            fill="white" />
        </svg>
        <span class="ms-3">{{ t("dashboard-fleet.add-fleet") }}</span>
      </app-link>
    </template>

    <!-- Vehicle slot -->
    <template #vehicle={row}>
      <div class="d-flex">
        <div class="car__img">
          <img v-if="row.image" :src="imageBaseUrl(`/documents/${row.image.file_name}`)" class="img-fluid" style="width: 48px" />
          <img v-else src="../../../assets/images/carPlaceholder.svg" class="img-fluid" style="width: 48px;" />
        </div>

        <div class="ms-3">
          <div class="text-14 mb-3">{{ row.vehicle_name }}</div>
          <div class="text-12 ">
            <span class="me-2 fw-400">{{row.classname}}</span>
            <span class="fw-500">{{ row.model }}</span>
          </div>
        </div>
      </div>
    </template>

    <!-- Vehicle slot -->
    <template #fuel={row}>
      <div>
        {{row.fuel_lable}}
        <!-- {{fuelLevelData.find(r => r.id == row.fuel_lable).label_name}} -->
      </div>
    </template>

    <!-- Vehicle slot -->
    <template #art_count={row}>
      <div v-if="row.art_count == null">0</div>
      <div v-else>{{row.art_count}}</div>
    </template>

    <template #checks={row}>
      <div>{{ JSON.parse(row.checks).length }}</div>
    </template>

    <!-- Status -->
    <template #status="{ row }">
      <div class="status-switcher" :class="{ active: Boolean(row.status) }">
        <span class="me-1 text-13 fw-medium">
          {{
          row.status ? t("FleetIndex.active") : t("FleetIndex.inactive")
          }}
        </span>
        <Switcher v-model.number="row.status" @change="onStatusChange($event.target.checked, row)" />
      </div>
    </template>

    <!-- Action Dropdown -->
    <template #actions="{ row }">
      <ActionDropdown>
        <li>
          <app-link :path="`/flotte/ansicht/${row.id}`" class="dropdown-item py-2 pointer">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_258_6146)">
                <path
                  d="M0.666748 7.99935C0.666748 7.99935 3.33341 2.66602 8.00008 2.66602C12.6667 2.66602 15.3334 7.99935 15.3334 7.99935C15.3334 7.99935 12.6667 13.3327 8.00008 13.3327C3.33341 13.3327 0.666748 7.99935 0.666748 7.99935Z"
                  stroke="#B2B2B2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path
                  d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z"
                  stroke="#B2B2B2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </g>
              <defs>
                <clipPath id="clip0_258_6146">
                  <rect width="16" height="16" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <span class="ms-3 text-14">{{ t("button.view") }}</span>
          </app-link>
        </li>
        <li>
          <app-link :path="`/flotte/aktualisieren/${row.id}`" class="dropdown-item py-2 pointer">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M11.3333 1.99955C11.5083 1.82445 11.7162 1.68556 11.945 1.5908C12.1738 1.49604 12.419 1.44727 12.6666 1.44727C12.9142 1.44727 13.1594 1.49604 13.3882 1.5908C13.617 1.68556 13.8248 1.82445 13.9999 1.99955C14.175 2.17465 14.3139 2.38252 14.4087 2.61129C14.5034 2.84006 14.5522 3.08526 14.5522 3.33288C14.5522 3.58051 14.5034 3.8257 14.4087 4.05448C14.3139 4.28325 14.175 4.49112 13.9999 4.66622L4.99992 13.6662L1.33325 14.6662L2.33325 10.9995L11.3333 1.99955Z"
                stroke="#B2B2B2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="ms-3 text-14">{{ t("button.edit") }}</span>
          </app-link>
        </li>
        <!-- <li>
            <span class="dropdown-item py-2 pointer">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.6666 8H11.9999L9.99992 14L5.99992 2L3.99992 8H1.33325" stroke="#B2B2B2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <span class="ms-3 text-14">{{ t("button.maintenance") }}</span>
            </span>
          </li> -->
        <li @click="openDeleteModal(row.id)">
          <span class="dropdown-item py-2 pointer">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 4H3.33333H14" stroke="#B2B2B2" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" />
              <path
                d="M5.33325 4.00065V2.66732C5.33325 2.3137 5.47373 1.97456 5.72378 1.72451C5.97383 1.47446 6.31296 1.33398 6.66659 1.33398H9.33325C9.68687 1.33398 10.026 1.47446 10.2761 1.72451C10.5261 1.97456 10.6666 2.3137 10.6666 2.66732V4.00065M12.6666 4.00065V13.334C12.6666 13.6876 12.5261 14.0267 12.2761 14.2768C12.026 14.5268 11.6869 14.6673 11.3333 14.6673H4.66659C4.31296 14.6673 3.97382 14.5268 3.72378 14.2768C3.47373 14.0267 3.33325 13.6876 3.33325 13.334V4.00065H12.6666Z"
                stroke="#B2B2B2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="ms-3 text-14">{{ t("button.remove") }}</span>
          </span>
        </li>
      </ActionDropdown>
    </template>

    <!-- Pagination -->
    <template #pagination>
      <div class="d-flex justify-content-end">
        <BPagination v-model="currentPage" :total-pages="pageCount" @change="changePage" />
      </div>
    </template>

    <template #createNew>
      <div class="text-25 fw-400 pointer" style="font-size: 25px; color: #276EF1;">
        <app-link path="/flotte/erstellen">{{t('button.click-here-to-create-a-new-record')}}</app-link>
      </div>
    </template>
  </DataTable>

  <!-- Delete Modal -->
  <ConfirmDialog v-model="showDeleteModal" @onOk="onDelete" :okLoading="deleting"
    :title="t('FleetIndex.delete-vehicle')" :message="t('FleetIndex.delete-modal-text')"></ConfirmDialog>
</template>

<style lang="scss" scoped>
.status-switcher {
  display: inline-flex;
  align-items: center;
  color: #ffa42f;
  border: 1px solid #ffa42f;
  border-radius: 5px;
  padding: 2px 6px;
  min-width: 110px;
  justify-content: space-between;

  &.active {
    color: #1bce6c;
    border-color: #1bce6c;
  }
}
.car__img {
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;  
    aspect-ratio: 16/10;
  }
   @include responsive-max("md") {
      width: 100px;
      height: 40px;
    }
}
</style>
