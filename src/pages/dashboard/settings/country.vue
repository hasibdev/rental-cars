<script setup>

// import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// import InputControl from '@/components/dashboard/settings/form/InputControl.vue'
// import SelectControl from '@/components/dashboard/settings/form/SelectControl.vue'
// import ConfirmDialog from "@/components/dashboard/settings/modals/ConfirmDialog.vue"
// import ModalControl from "@/components/dashboard/settings/modals/ModalControl.vue"
import BackButton from '@/components/buttons/BackButton.vue'
// import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import DataTable from '@/components/common/DataTable.vue'
// import EditIcon from '@/icons/EditIcon.vue'
// import TrashIcon from '@/icons/TrashIcon.vue'
// import { useToast } from "vue-toastification"

import { useAxios } from '../../../use/useAxios'
// const toast = useToast()


const {
  data: countryData,
  loading
} = useAxios("/admin/country")

const { t } = useI18n({ useScope: 'global' })

const fields = [
  {
    field: 'country_code',
    label: t('countrySettings.label-country-code'),
  },
  {
    field: 'country_en',
    label: t('countrySettings.label-country-en'),
  },
  {
    field: 'country_de',
    label: t('countrySettings.label-country-de'),
  },
  {
    field: 'iso_2',
    label: 'ISO - 2',
  },
  {
    field: 'iso_3',
    label: 'ISO - 3',
  },
  //   {
  //     field: 'actions',
  //     label:  t('countrySettings.label-action') ,
  //     // label:  'Actions' ,
  //     thClass: 'text-right',
  //     tdClass: 'text-right',
  //   }
]
</script>

<template>

  <!-- <pre>{{countryData}}</pre> -->
  <div class="d-flex justify-content-between align-items-center">
    <BackButton :label="t('title.settings')" />
    <!-- <button @click="showAddModal = true" class="btn btn-dark">
        <span class="me-1 text-17">+</span> {{t('countrySettings.add-country-text')}}
      </button> -->
  </div>

  <h5 class="mt-4 mb-3">{{t('countrySettings.title')}} </h5>

  <div class="borderd-content my-3">
    <DataTable bordered :data="countryData?.countrys || []" :fields="fields" :loading="loading">

    </DataTable>
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
