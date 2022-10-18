<script setup>
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from "vue-toastification"
import { useAxios, api } from '@/use/useAxios'


import BackButton from '@/components/buttons/BackButton.vue'
import InputControl from '@/components/dashboard/form/InputControl.vue'
import ConfirmDialog from '@/components/common/modals/ConfirmDialog.vue'
import ModalControl from '@/components/common/modals/ModalControl.vue'
import DataTable from '@/components/common/DataTable.vue'
import EditIcon from '@/icons/EditIcon.vue'
import TrashIcon from '@/icons/TrashIcon.vue'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'

const { t } = useI18n({ useScope: 'global' })
const toast = useToast()

const {
  data: manufacturerData,
  loading,
  onApiDelete,
  deleting,
  reFetch,

} = useAxios('/admin/manufacturer')

const fields = [
  {
    field: 'manufactures_name',
    label: t('manufacturerSettings.manufacturer-name'),
  },
  {
    field: 'actions',
    label: t('locationSettings.action'),
    // label:  'Actions' ,
    thClass: 'text-right',
    tdClass: 'text-right',
  }
]

const addModalStatus = ref(false)
const addForm = reactive({
  manufactures_name: '',
})
const addingState = ref(false)
const onAddManufacturer = async () => {
  const formData = new FormData()
  for (let key in addForm) {
    formData.append(key, addForm[key] ?? '')
  }
  try {
    addingState.value = true
    await api.post('/admin/manufacturer/store', formData)
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

// Editing
const editForm = reactive({
  data: {
    updated_at: new Date().toISOString(),
  }
})

const editModalStatus = ref(false)
const editingState = ref(false)

const openEditModal = (data) => {
  Object.assign(editForm.data, data)
  editModalStatus.value = true
}

const onEditManufacturer = async () => {
  const formData = new FormData()
  for (let key in editForm.data) {
    formData.append(key, editForm.data[key] ?? '')
  }
  try {
    editingState.value = true
    await api.post(`/admin/manufacturer/update/${editForm.data.id}`, formData)
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
    await onApiDelete(`/admin/manufacturer/delete/${activeDeleteId.value}`)
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
      <span class="ms-3">+ {{t('manufacturerSettings.add-manufacturer-text')}}</span>
    </button>
  </div>
  <h5 class="mt-4">{{t('manufacturerSettings.title')}}</h5>

  <div class="borderd-content my-3">
    <DataTable bordered :data="manufacturerData || []" :fields="fields" :loading="loading">
      <template #actions="{ row }">
        <EditIcon @click="openEditModal(row)" class="pointer" />
        <TrashIcon @click="openDeleteModal(row.id)" class="ms-3 pointer" />
      </template>
    </DataTable>
  </div>

  <!-- Add Modal -->
  <ModalControl v-model="addModalStatus" dialogClass="modal-md">
    <div class="modal-header">
      <p class="mb-1">{{t('manufacturerSettings.add-manufacturer-text')}}</p>
    </div>
    <div class="modal-body">
      <!-- <p class="fw-500">{{t('locationSettings.edit-modal-text')}}</p> -->
      <InputControl v-model="addForm.manufactures_name" :label="t('manufacturerSettings.manufacturer-name')" placeholder="e.g. Audi" errorField="manufactures_name" class="mt-3" />
    </div>
    <div class="modal-footer border-0 mt-2">
      <button @click="addModalStatus = false" type="button" class="btn btn-cancel px-5 py-2 btn-sm ">{{t('button.cancel')}}</button>
      <PrimaryButton class="btn-save" @click="onAddManufacturer" :loading="addingState">{{t('button.save')}}</PrimaryButton>
    </div>
  </ModalControl>

  <!-- Edit Modal -->
  <ModalControl v-model="editModalStatus" dialogClass="modal-md">
    <div class="modal-header">
      <p class="mb-1">{{t('manufacturerSettings.edit-manufacturer')}}</p>
    </div>
    <div v-if="editForm.data" class="modal-body">
      <InputControl v-model="editForm.data.manufactures_name" :label="t('manufacturerSettings.manufacturer-name')" placeholder="e.g. Audi" errorField="manufactures_name" class="mt-3" />

    </div>
    <div class="modal-footer border-0 mt-2">
      <button @click="editModalStatus = false" type="button" class="btn btn-cancel px-5 py-2 btn-sm ">{{t('button.cancel')}}</button>
      <PrimaryButton @click="onEditManufacturer" :loading="editingState">{{t('button.save')}}</PrimaryButton>
    </div>
  </ModalControl>

  <!-- Delete Modal -->
  <!-- <ConfirmDialog v-model="showDeleteModal" @onOk="onDelete" :okLoading="deleting" :title="t('locationSettings.remove-location')" :message="t('locationSettings.delete-location-text')"></ConfirmDialog> -->
  <ConfirmDialog v-model="showDeleteModal" @onOk="onDelete" :okLoading="deleting" title="Delete Manufacturer" :message="t('manufacturerSettings.delete-modal-text')"></ConfirmDialog>

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
