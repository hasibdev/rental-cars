<script setup>
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from "vue-toastification"
import { useAxios, api } from '@/use/useAxios'


import BackButton from '@/components/buttons/BackButton.vue'
import InputControl from '@/components/dashboard/form/InputControl.vue'
import SelectControl from '@/components/dashboard/form/SelectControl.vue'
import ConfirmDialog from '@/components/common/modals/ConfirmDialog.vue'
import ModalControl from '@/components/common/modals/ModalControl.vue'
import DataTable from '@/components/common/DataTable.vue'
import EditIcon from '@/icons/EditIcon.vue'
import TrashIcon from '@/icons/TrashIcon.vue'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'

const { t } = useI18n({ useScope: 'global' })
const toast = useToast()

const { data: countryData } = useAxios('/admin/country')
const {
  data: locationData,
  loading,
  onApiDelete,
  deleting,
  reFetch,

} = useAxios('/admin/location')


const fields = [
  {
    field: 'location_name',
    label: t('locationSettings.location-name'),
    thClass: "text-13",
    tdClass: "text-14",
  },
  {
    field: 'postcode',
    label: t('locationSettings.post-code'),
    thClass: "text-13",
    tdClass: "text-14",
  },
  {
    field: 'street',
    label: t('locationSettings.street'),
    thClass: "text-13",
    tdClass: "text-14",
  },
  {
    field: 'city',
    label: t('locationSettings.city'),
    thClass: "text-13",
    tdClass: "text-14",
  },
  {
    field: 'country',
    label: t('locationSettings.country'),
    thClass: "text-13",
    tdClass: "text-14",
    // handler: (row) => countryData.countrys.find(r => r.id == row.country).label
  },
  {
    field: 'actions',
    label: t('locationSettings.action'),
    // label:  'Actions' , 
    thClass: 'text-13 text-right',
    tdClass: 'text-right',
  }
]
// const lang = [
//   {
//     label: 'en',
//   },
//   {
//     label: 'de'
//   }
// ]

const addModalStatus = ref(false)
const addForm = reactive({
  location_name: '',
  postcode: '',
  street: '',
  city: '',
  country: '',
  lang: 'de',
})
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
    clearAddForm()
  } catch (error) {
    // console.error(error)
    toast.error(`${t('toast.failureAddText')}`)
  } finally {
    addingState.value = false
  }
}

const clearAddForm = () => {
  const newForm = {
    location_name: '',
    postcode: '',
    street: '',
    city: '',
    country: '',
    lang: 'de',
  }
  Object.assign(addForm, newForm)
}

// Editing
const editForm = reactive({
  data: {
    lang: 'de'
  }
})

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
    await api.post(`/admin/location/update/${editForm.data.id}`, formData)
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

const createNewRecord = () => {
  addModalStatus.value = true
}
</script>


<template>

  <!-- <pre>{{countryData.countrys}}</pre> -->
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

  <div class="borderd-content my-3">
    <DataTable bordered :data="locationData || []" :fields="fields" :loading="loading">
      <template #country={row}>
        {{countryData?.countrys.find(r => r.id == row.country)?.country_name}}
      </template>
      <template #actions="{ row }">
        <EditIcon @click="openEditModal(row)" class="pointer" />
        <TrashIcon @click="openDeleteModal(row.id)" class="ms-3 pointer" />
      </template>
      <template #createNew>
        <div class="text-25 fw-400 pointer" style="font-size: 25px; color: #276EF1;" @click="createNewRecord">{{t('button.click-here-to-create-a-new-record')}}</div>
      </template>
    </DataTable>
  </div>

  <!-- Edit Modal -->
  <ModalControl v-model="editModalStatus" dialogClass="modal-lg modal-large">
    <div class="modal-header">
      <p class="mb-1">{{t('locationSettings.edit-location')}}</p>
    </div>
    <div v-if="editForm.data" class="modal-body">
      <p class="fw-500">{{t('locationSettings.edit-modal-text')}}</p>

      <InputControl v-model="editForm.data.location_name" :label="t('locationSettings.location-name')" :placeholder="t('locationSettings.location-name')" errorField="location_name" class="mt-3" />
      <InputControl v-model="editForm.data.postcode" :label="t('locationSettings.post-code')" errorField="postcode" :placeholder="t('locationSettings.post-code')" class="mt-3" />
      <InputControl v-model="editForm.data.street" :label="t('locationSettings.street')" :placeholder="t('locationSettings.street')" class="mt-3" />
      <InputControl v-model="editForm.data.city" :label="t('locationSettings.city')" :placeholder="t('locationSettings.city')" errorField="city" class="mt-3" />
      <SelectControl v-model="editForm.data.country" :options="countryData?.countrys || []" optionLabel="country_name" :label="t('locationSettings.country')" class="mt-3" />
      <!-- <SelectControl v-model="editForm.data.lang" :options="lang" optionLabel="label" :label="t('locationSettings.language')" class="mt-3" /> -->

    </div>
    <div class="modal-footer border-0 mt-2">
      <button @click="editModalStatus = false" type="button" class="btn btn-cancel px-5 py-2 btn-sm ">{{t('button.cancel')}}</button>
      <PrimaryButton @click="onEditLocation" style="min-width: 180px;" :loading="editingState">{{t('button.save')}}</PrimaryButton>
    </div>
  </ModalControl>

  <!-- Add Modal -->
  <ModalControl v-model="addModalStatus" dialogClass="modal-lg">
    <div class="modal-header">
      <p class="mb-1">{{t('locationSettings.add-location')}}</p>
    </div>
    <div class="modal-body">
      <!-- <p class="fw-500">{{t('locationSettings.edit-modal-text')}}</p> -->

      <InputControl v-model="addForm.location_name" :label="t('locationSettings.location-name')" :placeholder="t('locationSettings.location-name')" errorField="location_name" class="mt-3" />
      <InputControl v-model="addForm.postcode" :label="t('locationSettings.post-code')" :placeholder="t('locationSettings.post-code')" class="mt-3" errorField="postcode" mt-3 />
      <InputControl v-model="addForm.street" :label="t('locationSettings.street')" :placeholder="t('locationSettings.street')" class="mt-3" errorField="street" />
      <InputControl v-model="addForm.city" :label="t('locationSettings.city')" :placeholder="t('locationSettings.city')" class="mt-3" errorField="city" />
      <SelectControl v-model="addForm.country" :options="countryData?.countrys || []" optionLabel="country_name" :label="t('locationSettings.country')" class="mt-3" errorField="country" />
      <!-- <SelectControl v-model="addForm.lang" :options="lang" optionLabel="label" :label="t('locationSettings.language')" class="mt-3" errorField="lang" /> -->

    </div>
    <div class="modal-footer border-0 mt-2">
      <button @click="addModalStatus = false" type="button" class="btn btn-cancel px-5 py-2 btn-sm ">{{t('button.cancel')}}</button>
      <PrimaryButton class="btn-save" style="min-width: 180px;" @click="onAddLocation" :loading="addingState">{{t('button.save')}}</PrimaryButton>
    </div>
  </ModalControl>

  <!-- Delete Modal -->
  <ConfirmDialog v-model="showDeleteModal" @onOk="onDelete" :okLoading="deleting" :title="t('locationSettings.remove-location')" :message="t('locationSettings.delete-location-text')"></ConfirmDialog>
  <!-- <ConfirmDialog v-model="showDeleteModal" @onOk="onDelete" :okLoading="deleting" title="Confirm Modal" :message="t('accountSettings.delete-modal-text')"></ConfirmDialog> -->

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
