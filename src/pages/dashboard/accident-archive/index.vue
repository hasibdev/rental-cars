<script setup>

import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from "vue-toastification"
import { useAxios, api } from '@/use/useAxios'

// import PageHeader from "@/components/dashboard/PageHeader.vue"

import InputControl from '@/components/dashboard/form/InputControl.vue'
import CalenderControl from "@/components/dashboard/form/CalenderControl.vue"
import FormSelect from "@/components/dashboard/shared/FormSelect.vue"
import SelectControl from '@/components/dashboard/form/SelectControl.vue'
import ActionDropdown from '../../../components/common/ActionDropdown.vue'
import ConfirmDialog from '@/components/common/modals/ConfirmDialog.vue'
import ModalControl from '@/components/common/modals/ModalControl.vue'
import DataTable from '@/components/common/DataTable.vue'
import StatusButton from "../../../components/dashboard/shared/StatusButton.vue"
import BPagination from "@/components/base/BPagination.vue"
// import WFileUploader from "@/components/base/wfileuploader"
import BInput from "@/components/base/BInput.vue"
import IconSearch from "@/icons/IconSearch.vue"
import DocumentsUploader from '@/components/dashboard/form/DocumentsUploaderSmall.vue'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import moment from 'moment'
import { imageBaseUrl } from '@/main'
// import vehicleImage from '@/assets/images/vehicle-image.png'
import _ from 'lodash'

const { t, locale } = useI18n({ useScope: 'global' })
const toast = useToast()

const {
  data: accidentData,
  loading,
  onApiDelete,
  deleting,
  reFetch,
  pageCount,
} = useAxios('/admin/accident')


const { data: locationData } = useAxios('/get-location')
const { data: reservationData } = useAxios('/admin/reservation')
const currentPage = ref(1)

const fields = [
  {
    field: 'id',
    label: 'ID',
    tdClass: 'text-12 fw-400 center-align',
  },
  {
    field: 'accidentImage',
    label: t('Accident.accident-image'),
  },
  {
    field: 'accidentDate',
    label: t('Accident.issue-date'),
    tdClass: 'text-14 fw-500 center-align',
  },
  {
    field: 'location',
    label: t('Accident.location'),
    tdClass: 'text-14 fw-500 center-align',
  },
  {
    field: 'speed',
    label: t('Accident.speed'),
    tdClass: 'text-14 fw-500 center-align',
  },
  {
    field: 'vehicleData',
    label: t('Accident.vehicle'),
    tdClass: 'center-align',
  },
  {
    field: 'fine',
    label: t('Accident.fines'),
    tdClass: 'text-14 fw-500 center-align',
  },
  {
    field: 'status',
    label: t('speedingTickets.status'),
    tdClass: 'text-14 fw-500 center-align',
  },
  {
    field: 'actions',
    label: t('locationSettings.action'),
    thClass: 'text-right',
    tdClass: 'text-right',
    hideTh: true,
  }
]
const status = [
  {
    id: "Active",
    label: t('form-fields.active'),
  },
  {
    id: "Inactive",
    label: t('form-fields.inactive'),
  }
]

const filters = [
  {
    label: t('form-fields.all'),
    id: ''
  },
  {
    label: t('form-fields.active'),
    id: 'Active'
  },
  {
    label: t('form-fields.inactive'),
    id: 'Inactive'
  }
]

const getReservation = (val) => {
  (`admin/invoice/reservation?reservation_no=${val}`)
}

const addModalStatus = ref(false)
const addForm = reactive({
  accident_date: '',
  reservation_id: '',
  location_id: '',
  notes: '',
  fines_amount: '',
  status: '',
  speed: '',
})
const documents = ref([])

const clearAddForm = () => {
  const newForm = {
    accident_date: '',
    reservation_id: '',
    location_id: '',
    notes: '',
    fines_amount: '',
    status: '',
    speed: '',
  }
  Object.assign(addForm, newForm)
}

const addingState = ref(false)
const onAddAccident = async () => {
  const formData = new FormData()
  for (let i = 0; i < documents.value.length; i++) {
    formData.append(`documents[${i}]`, documents.value[i])
  }
  for (let key in addForm) {
    formData.append(key, addForm[key] ?? '')
  }
  try {
    addingState.value = true
    await api.post('/admin/accident/store', formData)
    reFetch()

    toast.success(`${t('toast.addText')}`)
    addModalStatus.value = false
    clearAddForm()
  } catch (error) {
    // console.error(error)
    toast.error(`${t('toast.failureAddText')}`)
  } finally {
    addingState.value = false
  }
}

const previousDocuments = ref(null)

// Editing
const editForm = reactive({
  data: {
    accident_date: '',
    reservation_id: '',
    location_id: '',
    notes: '',
    fines_amount: '',
    status: '',
    speed: '',
  }
})

const editModalStatus = ref(false)
const editingState = ref(false)

const openEditModal = (data) => {
  Object.assign(editForm.data, data)
  editModalStatus.value = true
  previousDocuments.value = data.documents.map(doc => ({
    img: doc.file_name,
    id: doc.id,
    url: imageBaseUrl(`/documents/${doc.file_name}`)
  }))
}
const imgForm = reactive({
  data: {
    imgUrl: ''
  }
})
const imageModalStatus = ref(false)
const openImageModal = (data) => {
  imgForm.data.imgUrl = data
  imageModalStatus.value = true
}


const onEditAccident = async () => {
  const formData = new FormData()
  for (let i = 0; i < documents.value.length; i++) {
    formData.append(`documents[${i}]`, documents.value[i])
  }
  for (let key in editForm.data) {
    formData.append(key, editForm.data[key] ?? '')
  }
  try {
    editingState.value = true
    await api.post(`/admin/accident/update/${editForm.data.id}`, formData)
    reFetch()

    toast.success(`${t('toast.updateText')}`)
    editModalStatus.value = false

  } catch (error) {
    console.error(error)
    toast.error(`${t('toast.failureUpdateText')}`)
  } finally {
    editingState.value = false
  }
}

const removePrevDoc = id => {
  previousDocuments.value = previousDocuments.value.filter(doc => doc.id != id)
}

// Deleting
const activeDeleteId = ref()
const showDeleteModal = ref(false)
const openDeleteModal = (id) => {
  activeDeleteId.value = id
  showDeleteModal.value = true
}
const onDelete = async () => {
  try {
    await onApiDelete(`/admin/accident/delete/${activeDeleteId.value}`)
    reFetch()

    showDeleteModal.value = false
    toast.success(`${t('toast.deleteText')}`)
  } catch (error) {
    toast.error(`${t('toast.failureDeleteText')}`)
  }
}


// Search
const searchValue = ref('')
// Filter
const activeFilter = ref('')
const filterData = async (filter) => {
  activeFilter.value = filter
  currentPage.value = 1

  reFetch(`admin/accident?page=${currentPage.value}&status=${filter}&name=${searchValue.value}`)
}
const onSearch = _.debounce(() => {
  currentPage.value = 1
  reFetch(`admin/accident?page=${currentPage.value}&status=${activeFilter.value}&name=${searchValue.value}`)
}, 500)

// Change Page
const changePage = () => {
  reFetch(`admin/accident?page=${currentPage.value}&status=${activeFilter.value}&name=${searchValue.value}`)
}

const getStatus = (val) => {
  if (val == 'Inactive') return 'warning'

  return 'success'
}

const closeAddModal = () => {
  addModalStatus.value = false
  clearAddForm()
}

const createNewRecord = () => {
  addModalStatus.value = true
}


</script>

<template>

  <div class="d-flex justify-content-end align-items-center">
    <div class="header__search-container d-flex align-items-center">
      <div class="header__search-bar">
        <b-input v-model="searchValue" @update:modelValue="onSearch" icon :placeholder="$t('form-fields.search')">
          <IconSearch />
        </b-input>
      </div>
      <div class="header__filters mx-2">
        <ActionDropdown>
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
          <li v-for="(filter, i) in filters" :key="i" @click="filterData(filter.id)" class="dropdown-item py-2 pointer">{{ filter.label }}</li>
        </ActionDropdown>
      </div>
    </div>

    <button @click="addModalStatus = true" class="btn btn-dark" style="height: 42px;">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 8V21H3V8" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M23 3H1V8H23V3Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M10 12H14" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <span class="ms-3"> {{t('Accident.add-accident')}}</span>
    </button>
  </div>

  <div class="borderd-content my-3">
    <!-- <pre>{{accidentData}}</pre> -->
    <DataTable bordered :data="accidentData?.data || []" :fields="fields" :loading="loading">
      <template #location="{ row }">
        {{locationData?.lcoations.find(r => r.id == row.location_id)?.location_name}}
      </template>
      <template #accidentDate="{ row }">
        <span v-if="locale === 'en'">{{moment(row.accident_date).format("DD/MM/YYYY")}}</span>
        <span v-else>{{moment(row.accident_date).format("DD.MM.YYYY")}}</span>
      </template>
      <template #accidentImage="{ row }">
        <div v-if="row.documents[0]">
          <img :src="imageBaseUrl(`/${row.documents[0].folder_name}/${row.documents[0].file_name}`)" @click="openImageModal(imageBaseUrl(`/${row.documents[0].folder_name}/${row.documents[0].file_name}`))" alt="" class="pointer" style="width: 80px; height: 66px;">
        </div>
      </template>
      <template #vehicleData="{ row }">
        <div class="d-flex align-items-center " v-if="row.vehicle != null ">
          <div class="me-2" style="width: 48px; height: 40px;" v-if="row.vehicle.file_name != null && row.vehicle.folder_name != null ">
            <img :src="imageBaseUrl(`/${row.vehicle.folder}/${row.vehicle.file_name}`)" style="width: 48px; height: 40px;" alt="">
          </div>
          <div class="">
            <div class="text-14 fw-500 mb-2">{{row.vehicle.vehicle_name}}</div>
            <div class="text-12 fw-400">{{row.vehicle.classname}} <span class="fw-500 ms-3">{{row.vehicle.plateno}}</span></div>
          </div>
        </div>
        <div v-else>{{t('FleetView.no-vehicle')}}</div>
      </template>
      <template #fine="{ row }">
        {{moneyFormat(row.fines_amount, locale)}}
      </template>
      <template #status="{ row }">
        <StatusButton :type="getStatus(row.status)">
          <span v-if="row.status == 'Active'">{{ t('form-fields.active') }}</span>
          <span v-else>{{ t('form-fields.inactive') }}</span>
        </StatusButton>
      </template>
      <template #actions="{row}">
        <ActionDropdown>
          <li @click="openEditModal(row)">
            <span class="dropdown-item py-2 pointer">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.333 2.00004C11.5081 1.82494 11.716 1.68605 11.9447 1.59129C12.1735 1.49653 12.4187 1.44775 12.6663 1.44775C12.914 1.44775 13.1592 1.49653 13.3879 1.59129C13.6167 1.68605 13.8246 1.82494 13.9997 2.00004C14.1748 2.17513 14.3137 2.383 14.4084 2.61178C14.5032 2.84055 14.552 3.08575 14.552 3.33337C14.552 3.58099 14.5032 3.82619 14.4084 4.05497C14.3137 4.28374 14.1748 4.49161 13.9997 4.66671L4.99967 13.6667L1.33301 14.6667L2.33301 11L11.333 2.00004Z" stroke="#B2B2B2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <span class="ms-3 text-14">{{ t("button.edit") }}</span>
            </span>
          </li>
          <li @click="openDeleteModal(row.id)">
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

      <!-- Pagination -->
      <template #pagination>
        <div class="d-flex justify-content-end">
          <BPagination v-model="currentPage" :total-pages="pageCount" @change="changePage" />
        </div>
      </template>

      <template #createNew>
        <div class="text-25 fw-400 pointer" style="font-size: 25px; color: #276EF1;" @click="createNewRecord">{{t('button.click-here-to-create-a-new-record')}}</div>
      </template>
    </DataTable>
  </div>

  <!-- Add Modal -->
  <ModalControl v-model="addModalStatus" dialogClass="modal-md">
    <div class="modal-header">
      <p class="mb-1">{{t('Accident.add-accident')}}</p>
    </div>
    <div class="modal-body">
      <p class="fw-500">{{t('Accident.details')}}</p>
      <CalenderControl v-model="addForm.accident_date" :placeholder="t('Accident.accident-date')" class="mb-3" errorField="accident_date" />
      <FormSelect v-model="addForm.reservation_id" :searching="loading" errorField="reservation_id" :options="reservationData?.data || []" displayProperty="reservation_no" valueProperty="id" :placeholder="t('Accident.reservation-id')" search :search-placeholder="t('Accident.reservation-id')" no-border @search="getReservation">
      </FormSelect>
      <!-- <SelectControl v-model="addForm.reservation_id" track="id" optionLabel="reservation_no" :options="reservationData?.reversions.data || [] " :placeholder="t('Accident.reservation-id')" errorField="reservation_id" class="mt-3" /> -->
      <InputControl v-model="addForm.speed" :placeholder="t('Accident.speed-in-km/h')" errorField="speed" class="mt-3" />
      <InputControl v-model="addForm.notes" :placeholder="t('Accident.notes')" errorField="notes" class="mt-3" />
      <SelectControl v-model="addForm.location_id" optionLabel="location_name" :options="locationData?.lcoations || [] " :placeholder="t('Accident.location')" errorField="location_id" class="mt-3" />
      <InputControl v-model="addForm.fines_amount" :placeholder="t('Accident.fine-amounts')" errorField="fines_amount" class="mt-3" />
      <SelectControl v-model="addForm.status" :options="status" trackBy="id" optionLabel="label" :placeholder="t('Accident.status')" class="mt-3 my-4" errorField="status" />
      <DocumentsUploader v-model="documents"></DocumentsUploader>
    </div>
    <div class="modal-footer border-0 mt-2">
      <button @click="closeAddModal" type="button" class="btn btn-cancel px-5 py-2 btn-sm ">{{t('button.cancel')}}</button>
      <PrimaryButton class="btn-save" style="min-width: 180px;" @click="onAddAccident" :loading="addingState">{{t('button.save')}}</PrimaryButton>
    </div>
  </ModalControl>

  <!-- Edit Modal -->
  <ModalControl v-model="editModalStatus" dialogClass="modal-md">
    <div class="modal-header">
      <p class="mb-1">{{t('Accident.edit-accident')}}</p>
    </div>
    <div v-if="editForm.data" class="modal-body">
      <p class="fw-500">{{t('Accident.details')}}</p>
      <CalenderControl v-model="editForm.data.accident_date" :placeholder="t('Accident.accident-date')" class="mb-3" errorField="accident_date" />
      <FormSelect v-model="editForm.data.reservation_id" :searching="loading" errorField="reservation_id" :options="reservationData?.data || []" displayProperty="reservation_no" valueProperty="id" :placeholder="t('Accident.reservation-id')" search :search-placeholder="t('Accident.reservation-id')" no-border @search="getReservation">
      </FormSelect>
      <InputControl v-model="editForm.data.speed" :placeholder="t('Accident.speed-in-km/h')" errorField="speed" class="mt-3" />
      <InputControl v-model="editForm.data.notes" :placeholder="t('Accident.notes')" errorField="notes" class="mt-3" />
      <SelectControl v-model="editForm.data.location_id" optionLabel="location_name" :options="locationData?.lcoations || [] " :placeholder="t('Accident.location')" errorField="location_id" class="mt-3" />
      <InputControl v-model="editForm.data.fines_amount" :placeholder="t('Accident.fine-amounts')" errorField="fines_amount" class="mt-3" />
      <SelectControl v-model="editForm.data.status" :options="status" trackBy="id" optionLabel="label" :placeholder="t('Accident.status')" class="my-3" errorField="status" />
      <DocumentsUploader :previousDocuments="previousDocuments" v-model="documents" @removePrev="removePrevDoc"></DocumentsUploader>
    </div>
    <div class="modal-footer border-0 mt-2">
      <button @click="editModalStatus = false" type="button" class="btn btn-cancel px-5 py-2 btn-sm ">{{t('button.cancel')}}</button>
      <PrimaryButton @click="onEditAccident" style="min-width: 180px;" :loading="editingState">{{t('button.update')}}</PrimaryButton>
    </div>
  </ModalControl>

  <!-- Image Modal -->
  <ModalControl v-model="imageModalStatus" dialogClass="modal-lg img-modal">
    <div class="modal-header p-0 m-0 d-flex justify-content-end" style="border:none">
      <p class="mb-0 text-white pointer" @click="imageModalStatus = false">x</p>
    </div>
    <div v-if="imgForm.data" class="modal-body text-center">
      <img :src="imgForm.data.imgUrl" class="img-fluid" alt="">
    </div>
  </ModalControl>

  <!-- Delete Modal -->
  <ConfirmDialog v-model="showDeleteModal" @onOk="onDelete" :okLoading="deleting" :title="t('Accident.delete-modal')" :message="t('Accident.delete-modal-text')"></ConfirmDialog>

</template>

<style lang="scss">
.center-align {
  vertical-align: middle;
}

.remove-icon {
  color: white;
  background: var(--color-error);
  transform: rotate(90deg);
  width: 16px;
  height: 16px;
  font-size: 9px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  font-weight: 600;
  cursor: pointer;
}
.btn-cancel {
  background: #eeeeee;
  border-radius: 4px;
  color: $light-gray;
  height: 42px;
  &:hover {
    border-color: transparent;
    background: #eeeeee;
  }
}
.btn-save {
  background: $secondary-color;
  color: white;
}
.header__search-container {
  .btn {
    width: 100%;
    display: block;
    text-align: center;
    padding: 12px;
    color: var(--color-white);
    border: 1px solid #dddddd;
    border-radius: 4px;
  }

  header__search-container {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .header__search-bar {
    flex: 1 1 auto;
  }
}
.img-modal .modal-content {
  background: transparent;
  border: none;
}

.btn-save {
  background: $secondary-color;
  color: white;
}
</style>
