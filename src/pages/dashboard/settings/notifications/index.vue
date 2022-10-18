<script setup>
import { ref, reactive, markRaw } from 'vue'
import { useI18n } from 'vue-i18n'
import BackButton from '@/components/buttons/BackButton.vue'
import TrashIcon from '@/components/icons/TrashIcon.vue'
import EditIcon from '@/components/icons/EditIcon.vue'
import InputControl from '@/components/form/InputControl.vue'

import NewNotificationTab from './tabs/NewNotificationTab.vue'
// import NewProductTab from './tabs/NewProductTab.vue'
// import PriceDropTab from './tabs/PriceDropTab.vue'
// import SalePriceTab from './tabs/SalePriceTab.vue'
import NewsTab from './tabs/NewsTab.vue'

const { t } = useI18n({ useScope: 'global' })

const tabData = [
  {
    id: 1,
    name: 'New Notification',
    component: NewNotificationTab
  },
  // {
  //    id: 2,
  //    name: 'New Product',
  //    component: NewProductTab
  // },
  // {
  //    id: 3,
  //    name: 'Price Drop',
  //    component: PriceDropTab
  // },
  // {
  //    id: 4,
  //    name: 'Sale Price',
  //    component: SalePriceTab
  // },
  {
    id: 5,
    name: 'Neuigkeiten',
    component: NewsTab
  },

]

const activeTab = ref(null)
const changeTab = id => {
  const find = tabData.find(v => v.id == id)
  activeTab.value = markRaw(find)
}
changeTab(5)

const addNotificationForm = reactive({
  title: '',
  category: ''
})

</script>

<template>
  <default-layout>
    <div class="d-flex justify-content-between align-items-center">
      <BackButton :label="t('title.settings')" />

      <button data-bs-toggle="modal" data-bs-target="#add_notification_modal" class="btn btn-dark">
        <span class="me-1 text-17">+</span> New Notification
      </button>
    </div>
    <h5 class="my-4">Notification</h5>

    <div class="borderd-content">
      <div class="d-flex">
        <div class="auto-tab-grid">
          <button v-for="(item, i) in tabData" :key="i" @click="changeTab(item.id)" :class="`${item.id == activeTab.id ? 'btn-primary' : 'btn-light'}`" class="btn grid-btn text-nowrap px-2">
            {{ item.name }}
          </button>

          <button data-bs-toggle="modal" data-bs-target="#add_notification_modal" class="btn btn-sm btn-outline-primary text-17 plus-btn">+</button>
        </div>

        <div class="d-flex ms-auto">
          <EditIcon data-bs-toggle="modal" data-bs-target="#add_notification_modal" class="pointer" />
          <TrashIcon data-bs-toggle="modal" data-bs-target="#remove_new_product" class="ms-3 pointer" />
        </div>
      </div>

      <component :is="activeTab.component" />
    </div>
    <!-- Add Notification Modal -->
    <!-- ////////////////////// -->
    <div class="modal fade" id="add_notification_modal" tabindex="-1" aria-labelledby="location_remore_label" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="preview_image_remore_label">Add Notification Tab</h5>
          </div>
          <div class="modal-body">
            <InputControl v-model="addNotificationForm.title" :label="t('field.title')" placeholder="Tab Name Here" />
            <InputControl v-model="addNotificationForm.category" :label="t('field.category')" class="mt-3" placeholder="Type Category" />
          </div>
          <div class="modal-footer border-0 mt-2">
            <button type="button" class="btn btn-light px-5 py-2 btn-sm " data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary px-5 py-2 btn-sm" data-bs-dismiss="modal">Save</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Remove Product -->
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
  </default-layout>

</template>

<style lang="scss" scoped>
.auto-tab-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  .grid-btn {
    min-width: 130px;
    max-width: auto;
  }
  .plus-btn {
    padding: 7px 15px;
  }
}
</style>
