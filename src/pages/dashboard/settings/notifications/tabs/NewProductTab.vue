<script setup>
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'

import DataTable from '@/components/common/DataTable.vue'
import TrashIcon from '@/components/icons/TrashIcon.vue'
import EditIcon from '@/components/icons/EditIcon.vue'
import InputControl from '@/components/form/InputControl.vue'

const tabledata = [
  {
    id: 1,
    title: 'New Supv Cars Available!',
    type: "Open App",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
  },
  {
    id: 2,
    title: 'New Supv Cars Available!',
    type: "Open App",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
  },
  {
    id: 3,
    title: 'New Supv Cars Available!',
    type: "Open App",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
  },
]

const fields = [
  'title',
  {
    field: 'type',
    label: 'Notification type',

  },
  {
    field: 'image',
    label: 'Product Image',

  },
  {
    field: 'actions',
    label: 'Actions',
    thClass: 'text-right',
    tdClass: 'text-right',
  }
]

const { t } = useI18n({ useScope: 'global' })

const editNotification = reactive({
  title: '',
  category: ''
})

</script>

<template>
  <div class="mt-4">
    <DataTable :data="tabledata" :fields="fields">
      <template #image="{col}">
        <img :src="col" class="rounded" style="width: 100px" />
      </template>
      <template #actions>
        <div>
          <EditIcon data-bs-toggle="modal" data-bs-target="#edit_notification_modal" class="pointer" />
          <TrashIcon data-bs-toggle="modal" data-bs-target="#remove_new_product" class="ms-3 pointer" />
        </div>
      </template>
    </DataTable>

    <!-- Edit Notification Modal -->
    <!-- ////////////////////// -->
    <div class="modal fade" id="edit_notification_modal" tabindex="-1" aria-labelledby="location_remore_label" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="preview_image_remore_label">Edit Notification</h5>
          </div>
          <div class="modal-body">
            <InputControl v-model="editNotification.title" :label="t('field.title')" placeholder="Tab Name Here" />
            <InputControl v-model="editNotification.category" :label="t('field.category')" class="mt-3" placeholder="Type Category" />
          </div>
          <div class="modal-footer border-0 mt-2">
            <button type="button" class="btn btn-light px-5 py-2 btn-sm " data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary px-5 py-2 btn-sm" data-bs-dismiss="modal">Save</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Remove Product Modal -->
    <div class="modal fade" id="remove_new_product" tabindex="-1" aria-labelledby="location_remore_label" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="preview_image_remore_label">Remove New product</h5>
          </div>
          <div class="modal-body">
            Are you sure want to remove this new product?
          </div>
          <div class="modal-footer border-0 mt-2">
            <button type="button" class="btn btn-light px-5 py-2 btn-sm " data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-danger px-5 py-2 btn-sm" data-bs-dismiss="modal">Remove</button>
          </div>
        </div>
      </div>
    </div>

  </div>

</template>


<style lang="scss" scoped>
</style>
