<script setup>
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import InputControl from '@/components/dashboard/form/InputControl.vue'
// import SelectControl from '@/components/dashboard/form/SelectControl.vue'
import ConfirmDialog from "@/components/common/modals/ConfirmDialog.vue"
import ModalControl from "@/components/common/modals/ModalControl.vue"
import BackButton from '@/components/buttons/BackButton.vue'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import DataTable from '@/components/common/DataTable.vue'
import EditIcon from '@/icons/EditIcon.vue'
import TrashIcon from '@/icons/TrashIcon.vue'
import { useToast } from "vue-toastification"

import { useAxios, api } from '@/use/useAxios'
const toast = useToast()

const {
  data: countryData,
  loading,
  onApiDelete,
  deleting,
  reFetch,
} = useAxios("/admin/country")

const { t } = useI18n({ useScope: 'global' })

const fields = [
  {
    field: 'country_name',
    label: t('countrySettings.label-country-name'),
  },
  {
    field: 'country_code',
    label: t('countrySettings.label-country-code'),
  },
  {
    field: 'actions',
    label: t('countrySettings.label-action'),
    thClass: 'text-right',
    tdClass: 'text-right',
  }
]
// const lang= [
//     {
//         label: 'En',
//     },
//     {
//         label: 'De'
//     }
// ]

const addModalStatus = ref(false)
const addForm = reactive({
  country_name: '',
  country_code: '',
  iso_2: '',
  iso_3: '',
  lang: 'de',
  flag: ''
})
const addingState = ref(false)
const onAddCountry = async () => {
  const formData = new FormData()
  for (let key in addForm) {
    formData.append(key, addForm[key] ?? '')
  }
  try {
    addingState.value = true
    await api.post('/admin/country/store', formData)
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
    lang: 'de',
  }
})
const editModalStatus = ref(false)
const editingState = ref(false)

const openEditModal = (data) => {
  Object.assign(editForm.data, data)
  editModalStatus.value = true
}

const onEditCountry = async () => {
  const formData = new FormData()
  for (let key in editForm.data) {
    formData.append(key, editForm.data[key] ?? '')
  }
  try {
    editingState.value = true
    await api.post(`/admin/country/update/${editForm.data.id}`, formData)
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
    await onApiDelete(`/admin/country/delete/${activeDeleteId.value}`)
    reFetch()

    showDeleteModal.value = false
    toast.success(`${t('toast.deleteText')}`)
  } catch (error) {
    toast.error(`${t('toast.failureDeleteText')}`)
  }
}
</script>

<template>

  <!-- <pre>{{countryData}}</pre> -->

  <div class="d-flex justify-content-between align-items-center">
    <BackButton :label="t('title.settings')" />
    <button @click="addModalStatus = true" class="btn btn-dark">
      <span class="ms-3">+ {{t('countrySettings.add-country-text')}}</span>
    </button>
  </div>

  <h5 class="mt-4 mb-3">{{t('countrySettings.title')}} </h5>

  <div class="borderd-content my-3">
    <DataTable bordered :data="countryData?.countrys || []" :fields="fields" :loading="loading">
      <template #actions="{ row }">
        <EditIcon @click="openEditModal(row)" class="pointer" />
        <TrashIcon @click="openDeleteModal(row.id)" class="ms-3 pointer" />
      </template>
    </DataTable>
  </div>

  <!-- Add Modal -->
  <ModalControl v-model="addModalStatus" dialogClass="modal-lg">
    <div class="modal-header">
      <p class="mb-1">{{t('countrySettings.add-country-text')}}</p>
    </div>
    <div class="modal-body">

      <InputControl v-model="addForm.country_name" :label="t('countrySettings.label-country-name')" placeholder="e.g. Germany" errorField="country_name" class="mt-3" />
      <InputControl v-model="addForm.country_code" :label="t('countrySettings.label-country-code')" placeholder="e.g. +49" errorField="country_code" class="mt-3" />
      <InputControl v-model="addForm.iso_2" :label="t('countrySettings.label-iso-2')" placeholder="e.g. DE" class="mt-3" />
      <InputControl v-model="addForm.iso_3" :label="t('countrySettings.label-iso-3')" placeholder="e.g. DEU" class="mt-3" />
      <!-- <SelectControl v-model="addForm.lang" :options="lang" optionLabel="label" :label="t('locationSettings.language')" class="mt-3" errorField="lang" /> -->

    </div>
    <div class="modal-footer border-0 mt-2">
      <button @click="addModalStatus = false" type="button" class="btn btn-cancel px-5 py-2 btn-sm ">{{t('button.cancel')}}</button>
      <PrimaryButton class="btn-save" @click="onAddCountry" :loading="addingState">{{t('button.save')}}</PrimaryButton>
    </div>
  </ModalControl>

  <!-- Edit Modal -->
  <ModalControl v-model="editModalStatus" dialogClass="modal-lg modal-large">
    <div class="modal-header">
      <p class="mb-1">{{t('countrySettings.edit-country')}}</p>
    </div>
    <div v-if="editForm.data" class="modal-body">
      <InputControl v-model="editForm.data.country_name" :label="t('countrySettings.label-country-name')" placeholder="e.g. Germany" errorField="country_name" class="mt-3" />
      <InputControl v-model="editForm.data.country_code" :label="t('countrySettings.label-country-code')" placeholder="e.g. +49" errorField="country_code" class="mt-3" />
      <InputControl v-model="editForm.data.iso_2" :label="t('countrySettings.label-iso-2')" placeholder="e.g. DE" class="mt-3" />
      <InputControl v-model="editForm.data.iso_3" :label="t('countrySettings.label-iso-3')" placeholder="e.g. DEU" class="mt-3" />
      <!-- <SelectControl v-model="editForm.data.lang" :options="lang" optionLabel="label" :label="t('locationSettings.language')" class="mt-3" errorField="lang" /> -->

    </div>
    <div class="modal-footer border-0 mt-2">
      <button @click="editModalStatus = false" type="button" class="btn btn-cancel px-5 py-2 btn-sm ">{{t('button.cancel')}}</button>
      <PrimaryButton @click="onEditCountry" :loading="editingState">{{t('button.save')}}</PrimaryButton>
    </div>
  </ModalControl>

  <!-- Delete Modal -->
  <ConfirmDialog v-model="showDeleteModal" @onOk="onDelete" :okLoading="deleting" title="Delete Country" :message="t('countrySettings.delete-modal-text')"></ConfirmDialog>

</template>

<style lang="scss" scoped>
.settings-box {
  padding: 33px;
  min-height: 230px;
}
.modal-body {
  .label {
    font-size: 1rem;
    font-weight: 500;
    color: $light-gray;
  }
  .input-text {
    font-size: 12px;
    color: $lighter-gray;
  }
}
.modal-footer {
  .btn-cancel {
    background: #eeeeee;
    border-radius: 4px;
    color: $light-gray;
  }
}
</style>
