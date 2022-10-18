<script setup>
// import ActionDropdown from "@/components/common/ActionDropdown.vue"
import DataTable from "@/components/common/DataTable.vue"
import ConfirmDialog from "@/components/common/modals/ConfirmDialog.vue"
import { ref, defineEmits } from "vue"
import { useToast } from "vue-toastification"
import { useI18n } from 'vue-i18n'
import { useAxios } from "@/use/useAxios"

const { t } = useI18n({ useScope: 'global' })
const toast = useToast()
const {
  data: cancellationReasonData,
  loading,
  onApiDelete,
  reFetch,
  deleting,
} = useAxios("/admin/cancellation-reason")

const emit = defineEmits(["update"])
const openEditModal = (data) => {
  emit("update", data)
}
const createNewRecord = () => {
  emit("add") 
}
const fields = [
  {
    field: 'reason_name',
    label: t('billingSettings.reason-name'),
  },
  {
    field: 'actions',
    label: t('locationSettings.action'),
    // label:  'Actions' ,
    thClass: 'text-right',
    tdClass: 'text-right',
  }
]

const activeDeleteId = ref()
const showDeleteModal = ref(false)
const openDeleteModal = (id) => {
  activeDeleteId.value = id
  showDeleteModal.value = true
}
const onDelete = async () => {
  try {
    await onApiDelete(`/admin/cancellation-reason/delete/${activeDeleteId.value}`)
    reFetch()

    showDeleteModal.value = false
    toast.success(`${t('toast.deleteText')}`)
  } catch (error) {
    toast.error(`${t('toast.failureDeleteText')}`)
  }
};
</script>

<template>
  <div class="mt-4">
    <DataTable :loading="loading" :data="cancellationReasonData?.reasondata || []" :fields="fields">
      <template #actions="{ row }">
        <ul class="d-flex justify-content-end align-items-center me-3">
          <li @click="openEditModal(row)" class="me-4">
            <span class="dropdown-item py-2 pointer">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.333 2.00004C11.5081 1.82494 11.716 1.68605 11.9447 1.59129C12.1735 1.49653 12.4187 1.44775 12.6663 1.44775C12.914 1.44775 13.1592 1.49653 13.3879 1.59129C13.6167 1.68605 13.8246 1.82494 13.9997 2.00004C14.1748 2.17513 14.3137 2.383 14.4084 2.61178C14.5032 2.84055 14.552 3.08575 14.552 3.33337C14.552 3.58099 14.5032 3.82619 14.4084 4.05497C14.3137 4.28374 14.1748 4.49161 13.9997 4.66671L4.99967 13.6667L1.33301 14.6667L2.33301 11L11.333 2.00004Z" stroke="#B2B2B2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>

              <!-- <span class="ms-3 text-14">{{t('button.edit')}}</span> -->
            </span>
          </li>
          <li @click="openDeleteModal(row.id)">
            <span data-bs-toggle="modal" data-bs-target="#area_remore_modal" class="dropdown-item py-2 pointer">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 4H3.33333H14" stroke="#B2B2B2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M5.33301 4.00016V2.66683C5.33301 2.31321 5.47348 1.97407 5.72353 1.72402C5.97358 1.47397 6.31272 1.3335 6.66634 1.3335H9.33301C9.68663 1.3335 10.0258 1.47397 10.2758 1.72402C10.5259 1.97407 10.6663 2.31321 10.6663 2.66683V4.00016M12.6663 4.00016V13.3335C12.6663 13.6871 12.5259 14.0263 12.2758 14.2763C12.0258 14.5264 11.6866 14.6668 11.333 14.6668H4.66634C4.31272 14.6668 3.97358 14.5264 3.72353 14.2763C3.47348 14.0263 3.33301 13.6871 3.33301 13.3335V4.00016H12.6663Z" stroke="#B2B2B2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <!-- <span class="ms-3 text-14">{{t('button.delete')}}</span> -->
            </span>
          </li>
        </ul>
      </template>
      <template #createNew>
        <div class="text-25 fw-400 pointer" style="font-size: 25px; color: #276EF1;" @click="createNewRecord">{{t('button.click-here-to-create-a-new-record')}}</div>
      </template>
    </DataTable>
  </div>

  <!-- Entfernen Modal -->
  <ConfirmDialog v-model="showDeleteModal" @onOk="onDelete" :okLoading="deleting" :title="t('billingSettings.delete-modal-title')" :message="t('billingSettings.delete-modal-text')"></ConfirmDialog>
</template>

<style lang="scss" scoped></style>

