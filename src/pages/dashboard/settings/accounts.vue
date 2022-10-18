<script setup>

import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import InputControl from '@/components/dashboard/form/InputControl.vue'
import SelectControl from '@/components/dashboard/form/SelectControl.vue'
import ConfirmDialog from "@/components/dashboard/settings/modals/ConfirmDialog.vue"
import ModalControl from "@/components/dashboard/settings/modals/ModalControl.vue"
import BackButton from '@/components/buttons/BackButton.vue'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import DataTable from '@/components/common/DataTable.vue'
import EditIcon from '@/icons/EditIcon.vue'
import TrashIcon from '@/icons/TrashIcon.vue'
import { useToast } from "vue-toastification"

import { useAxios, api } from '../../../use/useAxios'
const toast = useToast()


const {
  data: userList,
  loading,
  onApiDelete,
  deleting,
  reFetch,
} = useAxios("/admin/users")

const { t } = useI18n({ useScope: 'global' })
const userRoles = [
  {
    id: 1,
    label: t('accountSettings.role-administrator'),
  },
  {
    id: 2,
    label: t('accountSettings.role-editor'),
  },
]

const fields = [
  {
    field: 'name',
    label: t('accountSettings.label-name'),

  },
  {
    field: 'email',
    label: t('accountSettings.label-email'),

  },

  {
    field: 'role_id',
    label: t('accountSettings.label-role'),

    handler: (row) => {
      return userRoles.find(r => r.id == row.status).label
    }
  },
  {
    field: 'actions',
    label: t('accountSettings.label-action'),
    // label:  'Actions' ,
    thClass: 'text-right',
    tdClass: 'text-right',
  }
]



// Adding
const showAddModal = ref(false)
const addingStatus = ref(false)
const addAccountFrom = reactive({
  name: '',
  email: '',
  role_id: ''
})

// Creating
const onSave = async () => {
  try {
    addingStatus.value = true
    await api.post('/admin/users/store', addAccountFrom)
    reFetch()

    showAddModal.value = false
    toast.success(`${t('toast.addText')}`)
  } catch (error) {
    console.error(error)
    toast.error(`${t('toast.failureAddText')}`)
  } finally {
    addingStatus.value = false
  }
}

// Editing
const editForm = reactive({
  data: {}
})
const editingState = ref(false)
const showEditModal = ref(false)
const openEditModal = (data) => {
  Object.assign(editForm.data, data)
  showEditModal.value = true
}

const onUpdate = async () => {
  try {
    editingState.value = true

    await api.post(`/admin/users/update/${editForm.data.users_id}`, editForm.data)
    reFetch()

    toast.success(`${t('toast.updateText')}`)
    showEditModal.value = false
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
    await onApiDelete(`/admin/users/delete/${activeDeleteId.value}`)
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

    <button @click="showAddModal = true" class="btn btn-dark">
      <span class="me-1 text-17">+</span> {{t('accountSettings.add-account-text')}}
    </button>
  </div>

  <h5 class="mt-4 mb-3">{{t('accountSettings.title')}} </h5>

  <div class="borderd-content my-3">
    <DataTable bordered :data="userList || []" :fields="fields" :loading="loading">
      <template #actions="{ row }">
        <EditIcon @click="openEditModal(row)" class="pointer" />
        <TrashIcon @click="openDeleteModal(row.users_id)" class="ms-3 pointer" />
      </template>

      <!-- Pagination -->
      <template #pagination>
        <div class="d-flex justify-content-end">
          <!-- <Paginate :page-count="pageCount" :page-range="3" :margin-pages="2" :click-handler="changePage" :prev-text="'Prev'" :next-text="'Weiter'" :container-class="'pagination'" :page-class="'page-item'"></Paginate> -->
        </div>
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
        <InputControl v-model="addAccountFrom.name" :label="t('accountSettings.label-name')" :placeholder="t('accountSettings.label-name')" />
        <InputControl v-model="addAccountFrom.email" :label="t('accountSettings.label-email')" type="email" class="mt-3" :placeholder="t('accountSettings.label-email')" />
        <SelectControl v-model="addAccountFrom.role_id" :options="userRoles" :label="t('accountSettings.label-role')" class="mt-3" />
        <div v-show="addAccountFrom.role_id">
          <div v-if="editForm.data.role_id == 1" class="col-md-8 offset-md-4 fw-400 input-text pt-2 ps-2">{{t('accountSettings.administrator-permission-text')}}</div>
          <div v-else class="col-md-8 offset-md-4 fw-400 input-text pt-3 ps-3">{{t('accountSettings.editor-permission-text')}}</div>
        </div>
      </div>
      <div class="modal-footer border-0 mt-2">
        <button type="button" class="btn btn-cancel px-5 py-2 btn-sm " data-bs-dismiss="modal">{{t('button.cancel')}}</button>
        <PrimaryButton @click="onSave" :loading="addingStatus">{{t('button.save')}}</PrimaryButton>
      </div>
    </ModalControl>

    <!-- Edit Account -->
    <ModalControl v-model="showEditModal">
      <div class="modal-header">
        <h5 class="modal-title" id="preview_image_remore_label">{{t('accountSettings.edit-modal-title')}}</h5>
      </div>
      <div class="modal-body">
        <InputControl v-model="editForm.data.name" :label="t('accountSettings.label-name')" :placeholder="t('accountSettings.label-name')" />
        <InputControl v-model="editForm.data.email" :label="t('accountSettings.label-email')" type="email" class="mt-3" :placeholder="t('accountSettings.label-email')" />
        <SelectControl v-model.number="editForm.data.role_id" :options="userRoles" :label="t('accountSettings.label-role')" class="mt-3" />
        <div v-if="editForm.data.role_id == 1" class="col-md-8 offset-md-4 fw-400 input-text pt-2 ps-2">{{t('accountSettings.administrator-permission-text')}}</div>
        <div v-else class="col-md-8 offset-md-4 fw-400 input-text pt-2 ps-2">{{t('accountSettings.editor-permission-text')}}</div>
      </div>
      <div class="modal-footer border-0 mt-2">
        <button @click="showEditModal = false" class="btn btn-cancel px-5 py-2 btn-sm ">{{t('button.cancel')}}</button>
        <PrimaryButton @click="onUpdate" :loading="editingState">{{t('button.edit')}}</PrimaryButton>
      </div>
    </ModalControl>

    <!-- Confirm Modal -->
    <ConfirmDialog v-model="showDeleteModal" @onOk="onDelete" :okLoading="deleting" title="Confirm Modal" :message="t('accountSettings.delete-modal-text')"></ConfirmDialog>

  </div>

</template>

<style lang="scss" scoped>
@import "../../../styles/scss/_variables.scss";
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
