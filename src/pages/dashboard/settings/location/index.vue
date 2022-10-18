<script setup>
import { reactive, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from "vue-toastification"
import { useAxios, api } from '@/use/useAxios'


import BackButton from '@/components/buttons/BackButton.vue'
import InputControl from '@/components/dashboard/form/InputControl.vue'
import SelectControl from '@/components/dashboard/form/SelectControl.vue'
import Switcher from '@/components/dashboard/settings/form/Switcher.vue'
import ConfirmDialog from '@/components/dashboard/settings/modals/ConfirmDialog.vue'
import ModalControl from '@/components/dashboard/settings/modals/ModalControl.vue'
import LoadingView from '@/components/dashboard/settings/LoadingView.vue'
import ActionDropdown from '@/components/dashboard/settings/ActionDropdown.vue'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'


const { t } = useI18n({ useScope: 'global' })
const toast = useToast()

const { data: countryData } = useAxios('/get-countries/en')
const {
  data: locationData,
  loading,
  onApiDelete,
  deleting,
  reFetch
} = useAxios('/admin/location')

const addModalStatus = ref(false)
const addForm = reactive({
  location_name: '',
  store_name: '',
  street: '',
  city_id: '',
  zip_code: '',
  address: '',
  country_id: '',
  lat: '',
  long: '',
  phones: '',
  emails: '',
  images: null,

  sunday_status: true,
  sunday_open: '10:00 AM',
  sunday_close: '08:00 PM',

  monday_status: true,
  monday_open: '10:00 AM',
  monday_close: '08:00 PM',

  tuesday_status: true,
  tuesday_open: '10:00 AM',
  tuesday_close: '08:00 PM',

  wednesday_status: true,
  wednesday_open: '10:00 AM',
  wednesday_close: '08:00 PM',

  thursday_status: true,
  thursday_open: '10:00 AM',
  thursday_close: '08:00 PM',

  friday_status: true,
  friday_open: '10:00 AM',
  friday_close: '08:00 PM',

  saturday_status: true,
  saturday_open: '10:00 AM',
  saturday_close: '08:00 PM',
})


const onFileSelect = e => {
  addForm.images = e.target.files[0]
}
const removeImageFile = () => {
  addForm.images = null
}


// Editing
const editForm = reactive({
  data: {
    store_name: '',
    sunday_status: true,
    sunday_open: '10:00 AM',
    sunday_close: '08:00 PM',

    monday_status: true,
    monday_open: '10:00 AM',
    monday_close: '08:00 PM',

    tuesday_status: true,
    tuesday_open: '10:00 AM',
    tuesday_close: '08:00 PM',

    wednesday_status: true,
    wednesday_open: '10:00 AM',
    wednesday_close: '08:00 PM',

    thursday_status: true,
    thursday_open: '10:00 AM',
    thursday_close: '08:00 PM',

    friday_status: true,
    friday_open: '10:00 AM',
    friday_close: '08:00 PM',

    saturday_status: true,
    saturday_open: '10:00 AM',
    saturday_close: '08:00 PM',
  }
})

const onEditFileSelect = e => {
  editForm.data.images = e.target.files[0]
}
const removeEditImageFile = () => {
  editForm.data.images = null
}


const editModalStatus = ref(false)
const editingState = ref(false)

const openEditModal = (data) => {
  Object.assign(editForm.data, data)
  editModalStatus.value = true
}

const onEditLocation = async () => {
  const formData = new FormData()

  for (let key in editForm.data) {
    formData.append(key, editForm.data[key] ?? '')
  }

  try {
    editingState.value = true
    await api.post(`/admin/location/update/${editForm.data.branc_id}`, formData)
    reFetch()

    toast.success('Aktualisierung erfolgreich')
    editModalStatus.value = false
  } catch (error) {
    console.error(error)
    toast.error('Antrag scheitert')
  } finally {
    editingState.value = false
  }
}
const addingState = ref(false)
const onAddLocation = async () => {
  const formData = new FormData()

  for (let key in addForm) {
    formData.append(key, addForm[key] ?? '')
  }

  try {
    addingState.value = true
    await api.post('/admin/location/store', formData)
    reFetch()

    toast.success(`${t('toast.addText')}`)
    addModalStatus.value = false
  } catch (error) {
    // console.error(error)
    toast.error(`${t('toast.failureAddText')}`)
  } finally {
    addingState.value = false
  }
}

const getEditImageName = computed(() => {
  if (typeof editForm.data.images === 'string') {
    return editForm.data.images
  }
  return editForm.data?.images?.name
})

// Deleting
const activeDeleteId = ref()
const showDeleteModal = ref(false)
const openDeleteModal = (id) => {
  activeDeleteId.value = id
  showDeleteModal.value = true
}
const onDelete = async () => {
  try {
    await onApiDelete(`/admin/location/delete/${activeDeleteId.value}`)
    reFetch()

    showDeleteModal.value = false
    toast.success(`${t('toast.deleteText')}`)
  } catch (error) {
    toast.error(`${t('toast.failureDeleteText')}`)
  }
}
</script>


<template>

  <div class="d-flex justify-content-between align-items-center">
    <BackButton :label="t('title.settings')" />

    <button @click="addModalStatus = true" class="btn btn-dark">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>

      <span class="ms-3">{{t('locationSettings.add-location-text')}}</span>
    </button>
  </div>
  <h5 class="mt-4">{{t('locationSettings.title')}}</h5>

  <p v-if="!loading && !locationData.length">No Data found!</p>

  <LoadingView :loading="loading">
    <div v-for="(loc, i) in locationData || []" :key="i" class="borderd-content position-relative mt-3">
      <div class="row">
        <div class="col-xl-3 col-lg-3 col-md-6">
          <img v-if="loc.images" :src="getImgUrl(`/images/${loc.images}`)" class="rounded location__img img-fluid">
          <img v-else src="@/assets/images/location.png" class="rounded location__img img-fluid">
        </div>

        <div class="col-xl-3 col-lg-4 col-md-6">
          <h5 v-if="loc.store_name" class="location_item_title">{{loc.store_name}}</h5>
          <h5 class="location_item_title">Area Cars Exclusive</h5>

          <ul class="mt-4">
            <li class="mb-3 d-flex">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.9999 16.9201V19.9201C22.0011 20.1986 21.944 20.4743 21.8324 20.7294C21.7209 20.9846 21.5572 21.2137 21.352 21.402C21.1468 21.5902 20.9045 21.7336 20.6407 21.8228C20.3769 21.912 20.0973 21.9452 19.8199 21.9201C16.7428 21.5857 13.7869 20.5342 11.1899 18.8501C8.77376 17.3148 6.72527 15.2663 5.18993 12.8501C3.49991 10.2413 2.44818 7.27109 2.11993 4.1801C2.09494 3.90356 2.12781 3.62486 2.21643 3.36172C2.30506 3.09859 2.4475 2.85679 2.6347 2.65172C2.82189 2.44665 3.04974 2.28281 3.30372 2.17062C3.55771 2.05843 3.83227 2.00036 4.10993 2.0001H7.10993C7.59524 1.99532 8.06572 2.16718 8.43369 2.48363C8.80166 2.80008 9.04201 3.23954 9.10993 3.7201C9.23656 4.68016 9.47138 5.62282 9.80993 6.5301C9.94448 6.88802 9.9736 7.27701 9.89384 7.65098C9.81408 8.02494 9.6288 8.36821 9.35993 8.6401L8.08993 9.9101C9.51349 12.4136 11.5864 14.4865 14.0899 15.9101L15.3599 14.6401C15.6318 14.3712 15.9751 14.1859 16.3491 14.1062C16.723 14.0264 17.112 14.0556 17.4699 14.1901C18.3772 14.5286 19.3199 14.7635 20.2799 14.8901C20.7657 14.9586 21.2093 15.2033 21.5265 15.5776C21.8436 15.9519 22.0121 16.4297 21.9999 16.9201Z" stroke="#808080" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <span v-if="loc.phones" class="ms-3 text-14">{{ loc.phones }}</span>
              <span v-else class="ms-3 text-14">030– 327 678 86</span>
            </li>
            <li class="mb-3 d-flex">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="#808080" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="#808080" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <span class="ms-3 text-14">{{ loc.location_name }} {{ loc.postcodes }} {{ loc.street }} {{ loc.city }}</span>
            </li>
            <li class="mb-3 d-flex">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="#808080" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M22 6L12 13L2 6" stroke="#808080" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <span v-if="loc.emails" class="ms-3 text-14">{{ loc.emails }}</span>
              <span v-else class="ms-3 text-14">exclusive@areacars.de</span>
            </li>
          </ul>
        </div>

        <div class="col-xl-3 col-lg-4 col-md-6">
          <div class="text-14 my-4 fw-medium" style="font-weight:500;">{{t('locationSettings.opening-hours')}}</div>

          ' <ul class="">
            <li class="mt-2 text-14">
              <div class="row">
                <div class="col-md-6">
                  <div class="text-14 text-muted">{{t('locationSettings.monday')}} - {{t('locationSettings.friday')}}</div>
                </div>
                <div class="col-md-6">
                  <div v-if="loc.weekdays_open" class="text-14 color-dark fw-500" style="font-weight: 500;">{{ loc.weekdays_open }}</div>
                  <div v-else class="text-14 color-dark" style="font-weight: 500;">09 AM – 6 PM</div>
                </div>
              </div>
            </li>
            <li class="mt-2 text-14">
              <div class="row">
                <div class="col-md-6">
                  <div class="text-14 text-muted">{{t('locationSettings.saturday')}}</div>
                </div>
                <div class="col-md-6">
                  <div v-if="loc.weekday_saturday_open" class="text-14 color-dark" style="font-weight: 500;">{{ loc.weekday_saturday_open }}</div>
                  <div v-else class="text-14 color-dark" style="font-weight: 500;">Closed</div>
                </div>
              </div>
            </li>
            <li class="mt-2 text-14">
              <div class="row">
                <div class="col-md-6">
                  <div class="text-14 text-muted">{{t('locationSettings.sunday')}}</div>
                </div>
                <div class="col-md-6">
                  <div v-if="loc.weekday_sunday_open" class="text-14 color-dark" style="font-weight: 500;">{{ loc.weekday_sunday_open }}</div>
                  <div v-else class="text-14 color-dark" style="font-weight: 500;">Closed</div>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <div class="col-xl-3 col-lg-1 col-md-6 d-flex align-items-center justify-content-end">
          <div class=" ">
            <ActionDropdown>
              <li @click="openEditModal(loc)">
                <span class="dropdown-item py-2 pointer">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.333 2.00004C11.5081 1.82494 11.716 1.68605 11.9447 1.59129C12.1735 1.49653 12.4187 1.44775 12.6663 1.44775C12.914 1.44775 13.1592 1.49653 13.3879 1.59129C13.6167 1.68605 13.8246 1.82494 13.9997 2.00004C14.1748 2.17513 14.3137 2.383 14.4084 2.61178C14.5032 2.84055 14.552 3.08575 14.552 3.33337C14.552 3.58099 14.5032 3.82619 14.4084 4.05497C14.3137 4.28374 14.1748 4.49161 13.9997 4.66671L4.99967 13.6667L1.33301 14.6667L2.33301 11L11.333 2.00004Z" stroke="#B2B2B2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>

                  <span class="ms-3 text-14">{{t('button.edit')}}</span>
                </span>
              </li>
              <li @click="openDeleteModal(loc.id)">
                <span class="dropdown-item py-2 pointer">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 4H3.33333H14" stroke="#B2B2B2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M5.33301 4.00016V2.66683C5.33301 2.31321 5.47348 1.97407 5.72353 1.72402C5.97358 1.47397 6.31272 1.3335 6.66634 1.3335H9.33301C9.68663 1.3335 10.0258 1.47397 10.2758 1.72402C10.5259 1.97407 10.6663 2.31321 10.6663 2.66683V4.00016M12.6663 4.00016V13.3335C12.6663 13.6871 12.5259 14.0263 12.2758 14.2763C12.0258 14.5264 11.6866 14.6668 11.333 14.6668H4.66634C4.31272 14.6668 3.97358 14.5264 3.72353 14.2763C3.47348 14.0263 3.33301 13.6871 3.33301 13.3335V4.00016H12.6663Z" stroke="#B2B2B2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <span class="ms-3 text-14">{{t('button.delete')}}</span>
                </span>
              </li>
            </ActionDropdown>
          </div>
        </div>

      </div>

    </div>
  </LoadingView>

  <!-- Edit Modal -->
  <ModalControl v-model="editModalStatus" dialogClass="modal-lg modal-large">
    <div class="modal-header">
      <p class="mb-1">{{t('locationSettings.edit-location')}}</p>
    </div>
    <div v-if="editForm.data" class="modal-body">
      <p class="fw-500">{{t('locationSettings.edit-modal-text')}}</p>

      <InputControl v-model="editForm.data.store_name" :label="t('locationSettings.store-name')" class="mt-3" />
      <InputControl v-model="editForm.data.street" :label="t('locationSettings.street')" class="mt-3" />
      <InputControl v-model="editForm.data.zip_code" :label="t('locationSettings.zip_code')" class="mt-3" />
      <InputControl v-model="editForm.data.city_id" :label="t('locationSettings.city')" class="mt-3" />

      <SelectControl v-model="editForm.data.country_id" :options="countryData?.countrys || []" optionLabel="country_en" :label="t('locationSettings.country')" class="mt-3" />
      <InputControl v-model="editForm.data.phones" :label="t('locationSettings.telephone')" type="tel" class="mt-3" />
      <InputControl v-model="editForm.data.emails" :label="t('locationSettings.email')" type="email" placeholder="example@mail.com" class="mt-3" />

      <div class="row mt-3">
        <div class="col-md-4">
          <p class="label location_modal_title">{{t('locationSettings.opening-times')}}</p>
        </div>
        <div class="col-md-8">
          <div class="row mt-3 align-items-center">
            <div class="col-4 text-muted">{{t('locationSettings.monday')}}</div>
            <div class="col-3">
              <input v-model="editForm.data.monday_open" :disabled="!editForm.data.monday_status" type="text" class="form-control" :placeholder="t('locationSettings.open')">
            </div>
            <div class="col-3">
              <input v-model="editForm.data.monday_close" :disabled="!editForm.data.monday_status" type="text" class="form-control" :placeholder="t('locationSettings.closed')">
            </div>
            <div class="col-2 d-flex align-items-center justify-content-center flex-column">
              <Switcher v-model="editForm.data.monday_status" activeColor="#276EF1" activeBackground="#D5E4FF" />
              <p class="text-13">{{ editForm.data.monday_status ? 'Open' : 'Closed' }}</p>
            </div>
          </div>
          <div class="row mt-3 align-items-center">
            <div class="col-4 text-muted">{{t('locationSettings.tuesday')}}</div>
            <div class="col-3">
              <input v-model="editForm.data.tuesday_open" :disabled="!editForm.data.tuesday_status" type="text" class="form-control" :placeholder="t('locationSettings.open')">
            </div>
            <div class="col-3">
              <input v-model="editForm.data.tuesday_close" :disabled="!editForm.data.tuesday_status" type="text" class="form-control" :placeholder="t('locationSettings.closed')">
            </div>
            <div class="col-2 d-flex align-items-center justify-content-center flex-column">
              <Switcher v-model="editForm.data.tuesday_status" activeColor="#276EF1" activeBackground="#D5E4FF" />
              <p class="text-13">{{ editForm.data.tuesday_status ? 'Open' : 'Closed' }}</p>
            </div>
          </div>
          <div class="row mt-3 align-items-center">
            <div class="col-4 text-muted">{{t('locationSettings.wednesday')}}</div>
            <div class="col-3">
              <input v-model="editForm.data.wednesday_open" :disabled="!editForm.data.wednesday_status" type="text" class="form-control" :placeholder="t('locationSettings.open')">
            </div>
            <div class="col-3">
              <input v-model="editForm.data.wednesday_close" :disabled="!editForm.data.wednesday_status" type="text" class="form-control" :placeholder="t('locationSettings.closed')">
            </div>
            <div class="col-2 d-flex align-items-center justify-content-center flex-column">
              <Switcher v-model="editForm.data.wednesday_status" activeColor="#276EF1" activeBackground="#D5E4FF" />
              <p class="text-13">{{ editForm.data.wednesday_status ? 'Open' : 'Closed' }}</p>
            </div>
          </div>
          <div class="row mt-3 align-items-center">
            <div class="col-4 text-muted">{{t('locationSettings.thursday')}}</div>
            <div class="col-3">
              <input v-model="editForm.data.thursday_open" :disabled="!editForm.data.thursday_status" type="text" class="form-control" :placeholder="t('locationSettings.open')">
            </div>
            <div class="col-3">
              <input v-model="editForm.data.thursday_close" :disabled="!editForm.data.thursday_status" type="text" class="form-control" :placeholder="t('locationSettings.closed')">
            </div>
            <div class="col-2 d-flex align-items-center justify-content-center flex-column">
              <Switcher v-model="editForm.data.thursday_status" activeColor="#276EF1" activeBackground="#D5E4FF" />
              <p class="text-13">{{ editForm.data.thursday_status ? `${t('locationSettings.open')}` : `${t('locationSettings.closed')}` }}</p>
            </div>
          </div>
          <div class="row mt-3 align-items-center">
            <div class="col-4 text-muted">{{t('locationSettings.friday')}}</div>
            <div class="col-3">
              <input v-model="editForm.data.friday_open" :disabled="!editForm.data.friday_status" type="text" class="form-control" :placeholder="t('locationSettings.open')">
            </div>
            <div class="col-3">
              <input v-model="editForm.data.friday_close" :disabled="!editForm.data.friday_status" type="text" class="form-control" :placeholder="t('locationSettings.closed')">
            </div>
            <div class="col-2 d-flex align-items-center justify-content-center flex-column">
              <Switcher v-model="editForm.data.friday_status" activeColor="#276EF1" activeBackground="#D5E4FF" />
              <p class="text-13">{{ editForm.data.friday_status ? `${t('locationSettings.open')}` : `${t('locationSettings.closed')}` }}</p>
            </div>
          </div>
          <div class="row mt-3 align-items-center">
            <div class="col-4 text-muted">{{t('locationSettings.saturday')}}</div>
            <div class="col-3">
              <input v-model="editForm.data.saturday_open" :disabled="!editForm.data.saturday_status" type="text" class="form-control" :placeholder="t('locationSettings.open')">
            </div>
            <div class="col-3">
              <input v-model="editForm.data.saturday_close" :disabled="!editForm.data.saturday_status" type="text" class="form-control" :placeholder="t('locationSettings.closed')">
            </div>
            <div class="col-2 d-flex align-items-center justify-content-center flex-column">
              <Switcher v-model="editForm.data.saturday_status" activeColor="#276EF1" activeBackground="#D5E4FF" />
              <p class="text-13">{{ editForm.data.saturday_status ? `${t('locationSettings.open')}` : `${t('locationSettings.closed')}` }}</p>
            </div>
          </div>
          <div class="row mt-3 align-items-center">
            <div class="col-4 text-muted">{{t('locationSettings.sunday')}}</div>
            <div class="col-3">
              <input v-model="editForm.data.sunday_open" :disabled="!editForm.data.sunday_status" type="text" class="form-control" :placeholder="t('locationSettings.open')">
            </div>
            <div class="col-3">
              <input v-model="editForm.data.sunday_close" :disabled="!editForm.data.sunday_status" type="text" class="form-control" :placeholder="t('locationSettings.closed')">
            </div>
            <div class="col-2 d-flex align-items-center justify-content-center flex-column">
              <Switcher v-model="editForm.data.sunday_status" activeColor="#276EF1" activeBackground="#D5E4FF" />
              <p class="text-13">{{ editForm.data.sunday_status ? `${t('locationSettings.open')}` : `${t('locationSettings.closed')}` }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="row mt-3">
        <div class="col-md-4">
          <p class="label">{{t('locationSettings.image')}}</p>
        </div>
        <div class="col-md-8">
          <div class="d-flex justify-content-between">
            <label class="btn btn-outline-primary">
              Upload {{t('locationSettings.image')}}
              <input @input="onEditFileSelect" type="file" class="visually-hidden" />
            </label>

            <p v-if="editForm.data.images" class="ms-2 text-truncate d-flex align-items-center">
              <span class="me-2">{{ getEditImageName }}</span>
              <span @click="removeEditImageFile()" class="remove-icon">&#10073;</span>
            </p>

          </div>
          <div class="text-12 mt-3">{{t('locationSettings.image-text')}}</div>
        </div>
      </div>

    </div>
    <div class="modal-footer border-0 mt-2">
      <button @click="editModalStatus = false" type="button" class="btn btn-cancel px-5 py-2 btn-sm ">{{t('button.cancel')}}</button>
      <PrimaryButton @click="onEditLocation" :loading="editingState">{{t('button.save')}}</PrimaryButton>
    </div>
  </ModalControl>

  <!-- Add Modal -->
  <ModalControl v-model="addModalStatus" dialogClass="modal-lg modal-large">
    <div class="modal-header">
      <p class="mb-1">{{t('locationSettings.add-location')}}</p>
    </div>
    <div class="modal-body">
      <p class="fw-500">{{t('locationSettings.edit-modal-text')}}</p>

      <InputControl v-model="addForm.store_name" :label="t('locationSettings.store-name')" errorField="store_name" class="mt-3" />
      <InputControl v-model="addForm.street" :label="t('locationSettings.street')" class="mt-3" errorField="street" />
      <InputControl v-model="addForm.zip_code" :label="t('locationSettings.zip_code')" class="mt-3" errorField="zip_code" />
      <InputControl v-model="addForm.city_id" :label="t('locationSettings.city')" class="mt-3" errorField="city_id" />
      <SelectControl v-model="addForm.country_id" :options="countryData?.countrys || []" optionLabel="country_en" :label="t('locationSettings.country')" class="mt-3" errorField="country_id" />
      <InputControl v-model="addForm.phones" :label="t('locationSettings.telephone')" type="tel" class="mt-3" errorField="phones" />
      <InputControl v-model="addForm.emails" :label="t('locationSettings.email')" type="email" placeholder="example@mail.com" class="mt-3" errorField="emails" />

      <div class="row mt-3">
        <div class="col-md-4">
          <p class="label location_modal_title">{{t('locationSettings.opening-times')}}</p>
        </div>
        <div class="col-md-8">
          <div class="row mt-3 align-items-center">
            <div class="col-4 text-muted">{{t('locationSettings.monday')}}</div>
            <div class="col-3">
              <input v-model="addForm.monday_open" :disabled="!addForm.monday_status" type="text" class="form-control" :placeholder="t('locationSettings.open')">
            </div>
            <div class="col-3">
              <input v-model="addForm.monday_close" :disabled="!addForm.monday_status" type="text" class="form-control" :placeholder="t('locationSettings.closed')">
            </div>
            <div class="col-2 d-flex align-items-center justify-content-center flex-column">
              <Switcher v-model="addForm.monday_status" activeColor="#276EF1" activeBackground="#D5E4FF" />
              <p class="text-13">{{ addForm.monday_status ? `${t('locationSettings.open')}` : `${t('locationSettings.closed')}` }}</p>
            </div>
          </div>
          <div class="row mt-3 align-items-center">
            <div class="col-4 text-muted">{{t('locationSettings.tuesday')}}</div>
            <div class="col-3">
              <input v-model="addForm.tuesday_open" :disabled="!addForm.tuesday_status" type="text" class="form-control" :placeholder="t('locationSettings.open')">
            </div>
            <div class="col-3">
              <input v-model="addForm.tuesday_close" :disabled="!addForm.tuesday_status" type="text" class="form-control" :placeholder="t('locationSettings.closed')">
            </div>
            <div class="col-2 d-flex align-items-center justify-content-center flex-column">
              <Switcher v-model="addForm.tuesday_status" activeColor="#276EF1" activeBackground="#D5E4FF" />
              <p class="text-13">{{ addForm.tuesday_status ? `${t('locationSettings.open')}` : `${t('locationSettings.closed')}` }}</p>
            </div>
          </div>
          <div class="row mt-3 align-items-center">
            <div class="col-4 text-muted">{{t('locationSettings.wednesday')}}</div>
            <div class="col-3">
              <input v-model="addForm.wednesday_open" :disabled="!addForm.wednesday_status" type="text" class="form-control" :placeholder="t('locationSettings.open')">
            </div>
            <div class="col-3">
              <input v-model="addForm.wednesday_close" :disabled="!addForm.wednesday_status" type="text" class="form-control" :placeholder="t('locationSettings.closed')">
            </div>
            <div class="col-2 d-flex align-items-center justify-content-center flex-column">
              <Switcher v-model="addForm.wednesday_status" activeColor="#276EF1" activeBackground="#D5E4FF" />
              <p class="text-13">{{ addForm.wednesday_status ? `${t('locationSettings.open')}` : `${t('locationSettings.closed')}` }}</p>
            </div>
          </div>
          <div class="row mt-3 align-items-center">
            <div class="col-4 text-muted">{{t('locationSettings.thursday')}}</div>
            <div class="col-3">
              <input v-model="addForm.thursday_open" :disabled="!addForm.thursday_status" type="text" class="form-control" :placeholder="t('locationSettings.open')">
            </div>
            <div class="col-3">
              <input v-model="addForm.thursday_close" :disabled="!addForm.thursday_status" type="text" class="form-control" :placeholder="t('locationSettings.closed')">
            </div>
            <div class="col-2 d-flex align-items-center justify-content-center flex-column">
              <Switcher v-model="addForm.thursday_status" activeColor="#276EF1" activeBackground="#D5E4FF" />
              <p class="text-13">{{ addForm.thursday_status ? `${t('locationSettings.open')}` : `${t('locationSettings.closed')}` }}</p>
            </div>
          </div>
          <div class="row mt-3 align-items-center">
            <div class="col-4 text-muted">{{t('locationSettings.friday')}}</div>
            <div class="col-3">
              <input v-model="addForm.friday_open" :disabled="!addForm.friday_status" type="text" class="form-control" :placeholder="t('locationSettings.open')">
            </div>
            <div class="col-3">
              <input v-model="addForm.friday_close" :disabled="!addForm.friday_status" type="text" class="form-control" :placeholder="t('locationSettings.closed')">
            </div>
            <div class="col-2 d-flex align-items-center justify-content-center flex-column">
              <Switcher v-model="addForm.friday_status" activeColor="#276EF1" activeBackground="#D5E4FF" />
              <p class="text-13">{{ addForm.friday_status ? `${t('locationSettings.open')}` : `${t('locationSettings.closed')}` }}</p>
            </div>
          </div>
          <div class="row mt-3 align-items-center">
            <div class="col-4 text-muted">{{t('locationSettings.saturday')}}</div>
            <div class="col-3">
              <input v-model="addForm.saturday_open" :disabled="!addForm.saturday_status" type="text" class="form-control" :placeholder="t('locationSettings.open')">
            </div>
            <div class="col-3">
              <input v-model="addForm.saturday_close" :disabled="!addForm.saturday_status" type="text" class="form-control" :placeholder="t('locationSettings.closed')">
            </div>
            <div class="col-2 d-flex align-items-center justify-content-center flex-column">
              <Switcher v-model="addForm.saturday_status" activeColor="#276EF1" activeBackground="#D5E4FF" />
              <p class="text-13">{{ addForm.saturday_status ? `${t('locationSettings.open')}` : `${t('locationSettings.closed')}` }}</p>
            </div>
          </div>
          <div class="row mt-3 align-items-center">
            <div class="col-4 text-muted">{{t('locationSettings.sunday')}}</div>
            <div class="col-3">
              <input v-model="addForm.sunday_open" :disabled="!addForm.sunday_status" type="text" class="form-control" :placeholder="t('locationSettings.open')">
            </div>
            <div class="col-3">
              <input v-model="addForm.sunday_close" :disabled="!addForm.sunday_status" type="text" class="form-control" :placeholder="t('locationSettings.closed')">
            </div>
            <div class="col-2 d-flex align-items-center justify-content-center flex-column">
              <Switcher v-model="addForm.sunday_status" activeColor="#276EF1" activeBackground="#D5E4FF" />
              <p class="text-13">{{ addForm.sunday_status ? `${t('locationSettings.open')}` : `${t('locationSettings.closed')}` }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="row mt-3">
        <div class="col-md-4">
          <p class="label">{{t('locationSettings.image')}}</p>
        </div>

        <div class="col-md-8">
          <div class="d-flex justify-content-between">
            <label class="btn btn-outline-primary">
              Upload {{t('locationSettings.image')}}
              <input @input="onFileSelect" type="file" class="visually-hidden" />
            </label>

            <p v-if="addForm.images" class="ms-2 text-truncate d-flex align-items-center">
              <span class="me-2">{{ addForm.images.name }}</span>
              <span @click="removeImageFile" class="remove-icon">&#10073;</span>
            </p>
          </div>
          <div class="text-12 mt-3">{{t('locationSettings.image-text')}}</div>
        </div>
      </div>

    </div>
    <div class="modal-footer border-0 mt-2">
      <button @click="addModalStatus = false" type="button" class="btn btn-cancel px-5 py-2 btn-sm ">{{t('button.cancel')}}</button>
      <PrimaryButton class="btn-save" @click="onAddLocation" :loading="addingState">{{t('button.save')}}</PrimaryButton>
    </div>
  </ModalControl>

  <!-- Delete Modal -->
  <ConfirmDialog v-model="showDeleteModal" @onOk="onDelete" :okLoading="deleting" :title="t('locationSettings.remove-location')" :message="t('locationSettings.delete-location-text')"></ConfirmDialog>

</template>

<style lang="scss">
@media (min-width: 1200px) {
  .modal-dialog.modal-large {
    max-width: 720px !important;
  }
}
@media (min-width: 576px) {
  .modal-dialog.modal-large {
    max-width: 600px;
    margin: 1.75rem auto;
  }
}

.fw-medium {
  color: #333;
}
.text-12 {
  font-size: 12px;
  color: $lighter-gray;
}
.text-14 {
  font-size: 14px;
  font-weight: 400;
  color: $dark-black-2;
}
.location_modal_title {
  font-weight: 600;
  font-size: 16px;
}

.locaton_item_title {
  font-size: 20px;
  font-weight: 600;
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
}
.btn-save {
  background: $secondary-color;
  color: white;
}
.location__img {
  aspect-ratio: 16/10;
  object-fit: cover;
}
</style>
