<script setup>
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import InputControl from '@/components/dashboard/form/InputControl.vue'
import ModalControl from '@/components/common/modals/ModalControl.vue'
import ConfirmDialog from '@/components/common/modals/ConfirmDialog.vue'
import BackButton from '@/components/buttons/BackButton.vue'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import DataTable from '@/components/common/DataTable.vue'
import EditIcon from '@/icons/EditIcon.vue'
import TrashIcon from '../../../../icons/TrashIcon.vue'
// import IconLock from '@/icons/IconLock.vue'
import { useToast } from "vue-toastification"
import { useAxios, api } from '@/use/useAxios'
const toast = useToast()

const {
  data: userList,
  loading,
  reFetch,
  onApiDelete,
  deleting
} = useAxios("/admin/users")

const { t } = useI18n({ useScope: 'global' })


const fields = [
  {
    field: 'name',
    label: t('accountSettings.label-name'),
    thClass: "text-13",
    tdClass: "text-14",
  },
  {
    field: 'email',
    label: t('accountSettings.label-email'),
    thClass: "text-13",
    tdClass: "text-14",

  },
  {
    field: 'actions',
    label: t('accountSettings.label-edit'),

  }
]

// Adding
const showAddModal = ref(false)
const addingStatus = ref(false)
const addAccountFrom = reactive({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  password: '', 
  role_id: 1,
  user_type: '2',
  status: 1,
  photo: '',
  company_id: 1,
  store_id: 1,
  created_by: 1,
  updated_by: 1,
  // created_at: new Date().toISOString(),
  // updated_at: new Date().toISOString(),
  join_date: '',
})

// Creating
const onSave = async () => {
  try {
    addingStatus.value = true
    await api.post('/admin/users/store', addAccountFrom)
    reFetch()

    showAddModal.value = false
    clearAddForm()
    toast.success(`${t('toast.addText')}`)
  } catch (error) {
    console.error(error)
    toast.error(`${t('toast.failureAddText')}`)
  } finally {
    addingStatus.value = false
  }
}


const clearAddForm = () => {
  const newForm = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '', 
    role_id: 1,
    user_type: '2',
    status: 1,
    photo: '',
    company_id: 1,
    store_id: 1,
    created_by: 1,
    updated_by: 1,
    // created_at: new Date().toISOString(),
    // updated_at: new Date().toISOString(),
    join_date: '',
  }
  Object.assign(addAccountFrom, newForm)
}

// Editing
const editForm = reactive({
  data: {
    // updated_at: new Date().toISOString(),
  }
})
const editingState = ref(false)
const showEditModal = ref(false)
const openEditModal = (data) => {
  Object.assign(editForm.data, data)
  showEditModal.value = true
}

const onUpdate = async () => {
  const formData = new FormData()
  for (let key in editForm.data) {
    formData.append(key, editForm.data[key] ?? '')
  }
  try {
    editingState.value = true

    await api.post(`/admin/users/update/${editForm.data.id}`, formData)
    reFetch()

    toast.success(`${t('toast.updateText')}`)
    showEditModal.value = false
  }
  catch (error) {
    console.error(error)
    toast.error(`${t('toast.failureUpdateText')}`)
  }
  finally {
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
    await onApiDelete(`/admin/users/delete/${activeDeleteId.value}`)
    reFetch()

    showDeleteModal.value = false
    toast.success(`${t('toast.deleteText')}`)
  } catch (error) {
    toast.error(`${t('toast.failureDeleteText')}`)
  }
}

const createNewRecord = () => {
  showAddModal.value = true
}

</script>

<template>

  <!-- <pre>{{userList}}</pre> -->
  <div class="d-flex justify-content-between align-items-center">
    <BackButton :label="t('title.settings')" />

    <button @click="showAddModal = true" class="btn btn-dark">
      <span class="me-1 text-17">+</span> {{t('accountSettings.add-account-text')}}
    </button>
  </div>

  <h5 class="mt-4 mb-3">{{t('accountSettings.title')}} </h5>

  <div class="borderd-content my-3">
    <DataTable bordered :data="userList || []" :fields="fields" :loading="loading">
      <template #actions="{ row }">
        <EditIcon @click="openEditModal(row)" class="pointer me-3" />
        <TrashIcon @click="openDeleteModal(row.id)" class="pointer me-3" />
        <!-- <IconLock @click="openEditPasswordModal(row)" class="pointer" title="Edit Password" /> -->
      </template>

      <!-- Pagination -->
      <template #pagination>
        <div class="d-flex justify-content-end">
          <!-- <Paginate :page-count="pageCount" :page-range="3" :margin-pages="2" :click-handler="changePage" :prev-text="'Prev'" :next-text="'Weiter'" :container-class="'pagination'" :page-class="'page-item'"></Paginate> -->
        </div>
      </template>
      <template #createNew>
        <div class="text-25 fw-400 pointer" style="font-size: 25px; color: #276EF1;" @click="createNewRecord">{{t('button.click-here-to-create-a-new-record')}}</div>
      </template>
    </DataTable>
  </div>
  <div>

    <!-- Add Account -->
    <ModalControl v-model="showAddModal">
      <div class="modal-header">
        <div class="h6 modal-title" id="preview_image_remore_label">{{t('accountSettings.add-modal-title')}}</div>
      </div>
      <div class="modal-body">
        <InputControl v-model="addAccountFrom.first_name" :label="t('accountSettings.label-first-name')" :placeholder="t('accountSettings.label-first-name')" errorField="first_name" />
        <InputControl v-model="addAccountFrom.last_name" :label="t('accountSettings.label-last-name')" class="mt-3" :placeholder="t('accountSettings.label-last-name')" errorField="last_name" />
        <InputControl v-model="addAccountFrom.email" :label="t('accountSettings.label-email')" type="email" class="mt-3" :placeholder="t('accountSettings.label-email')" errorField="email" />
        <InputControl v-model="addAccountFrom.password" :label="t('accountSettings.label-password')" type="password" class="mt-3" :placeholder="t('accountSettings.label-password')" />
        <!-- <SelectControl v-model="addAccountFrom.role_id" :options="userRoles" :label="t('accountSettings.label-role')" class="mt-3" /> -->
        <!-- <InputControl v-model="addAccountFrom.phone" :label="t('accountSettings.label-phone')" type="date" class="mt-3" :placeholder="t('accountSettings.label-phone')"  /> -->

      </div>
      <div class="modal-footer border-0 mt-2">
        <button type="button" class="btn btn-cancel px-5 py-2 btn-sm " data-bs-dismiss="modal">{{t('button.cancel')}}</button>
        <PrimaryButton @click="onSave" style="min-width: 180px;" :loading="addingStatus">{{t('button.save')}}</PrimaryButton>
      </div>
    </ModalControl>

    <!-- Edit Account -->
    <ModalControl v-model="showEditModal">
      <div class="modal-header">
        <h5 class="modal-title" id="preview_image_remore_label">{{t('accountSettings.edit-modal-title')}}</h5>
      </div>
      <div class="modal-body">
        <InputControl v-model="editForm.data.first_name" :label="t('accountSettings.label-first-name')" :placeholder="t('accountSettings.label-first-name')" errorField="first_name" />
        <InputControl v-model="editForm.data.last_name" :label="t('accountSettings.label-last-name')" class="mt-3" :placeholder="t('accountSettings.label-last-name')" errorField="last_name" />
        <InputControl v-model="editForm.data.email" :label="t('accountSettings.label-email')" type="email" class="mt-3" :placeholder="t('accountSettings.label-email')" errorField="email" />
        <InputControl v-model="editForm.data.password" :label="t('accountSettings.label-password')" type="password" class="mt-3" :placeholder="t('accountSettings.label-password')" errorField="password" />

      </div>
      <div class="modal-footer border-0 mt-2">
        <button @click="showEditModal = false" class="btn btn-cancel px-5 py-2 btn-sm ">{{t('button.cancel')}}</button>
        <PrimaryButton @click="onUpdate" style="min-width: 180px;" :loading="editingState">{{t('button.edit')}}</PrimaryButton>
      </div>
    </ModalControl>

    <!-- Delete Modal -->
    <ConfirmDialog v-model="showDeleteModal" @onOk="onDelete" :okLoading="deleting" :title="t('accountSettings.delete-user')" :message="t('accountSettings.delete-modal-text')"></ConfirmDialog>

  </div>

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
    height: 42px; 
    &:hover{
      border-color: transparent;
    }
  }
}
</style>
