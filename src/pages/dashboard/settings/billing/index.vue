<script setup>
import { markRaw, reactive, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import { useToast } from "vue-toastification"
import { api } from "@/use/useAxios"
// import { useAuthStore } from "@/stores/auth"

import BackButton from "@/components/buttons/BackButton.vue"
import ModalControl from "@/components/common/modals/ModalControl.vue"
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'

import CancellationReason from './tabs/CancellationReason.vue'
import TextControl from '../../../../components/dashboard/form/TextControl.vue'

const { t, locale } = useI18n({ useScope: 'global' })
const toast = useToast()
// const auth = useAuthStore()
const form = reactive({})
const statickey = ref(1)
const savingStatus = ref(false)
const addModalStatus = ref(false)
const activeTab = ref(null)
const acitveTabObj = reactive({ tab: null })

const billingData = [
  {
    id: 1,
    name: t('billingSettings.cancellation-reason'),
    component: CancellationReason,
    postEndPoint: "/admin/cancellation-reason/store",
    updateEndPoint: "/admin/cancellation-reason/update/",
    fields: [
      {
        name: "reason_name",
        // image: false,
        label: t('billingSettings.enter-reason'),
        placeholder: t('billingSettings.reason-name'),
        // hide: false,
        textfield: true,
      },
      // {
      //   name: "note",
      //   image: false,
      //   label: t('form-fields.note'),
      //   placeholder: t('form-fields.note'),
      //   hide: false,
      // },
    ],
    // forAdmin: false,
  },

]

const changeTab = (item) => {
  acitveTabObj.tab = item

  const find = billingData.find((v) => v.id == item.id)
  activeTab.value = markRaw(find)
}
changeTab(billingData[0])

watch(addModalStatus, () => {
  if (!addModalStatus.value) {
    Object.keys(form).forEach((key) => {
      delete form[key]
    })
  }
})

const resetForm = () => {
  Object.keys(form).forEach((key) => {
    form[key] = ''
  })
}

const submitForm = async () => {
  const formData = new FormData()

  for (let key in form) {
    formData.append(key, form[key] ?? '')
  }

  try {
    savingStatus.value = true
    await api.post(acitveTabObj.tab.postEndPoint, formData)

    toast.success(`${t('toast.addText')}`)
    // addModalStatus.value = false;

    resetForm()
    statickey.value = ++statickey.value
    addModalStatus.value = false
  } catch (error) {
    toast.error(`${t('toast.failureAddText')}`)
  } finally {
    savingStatus.value = false
  }
}

const onAddModalClose = () => {
  isUpdate.value = false
}

const isUpdate = ref(false)
const onSubmitUpdate = async () => {
  const formData = new FormData()

  for (let key in form) {
    formData.append(key, form[key] ?? '')
  }

  try {
    savingStatus.value = true
    await api.post(`${acitveTabObj.tab.updateEndPoint}${form.id}`, formData)

    toast.success(`${t('toast.updateText')}`)
    addModalStatus.value = false
    statickey.value = ++statickey.value
  } catch (error) {
    toast.error(`${t('toast.failureUpdateText')}`)
  } finally {
    savingStatus.value = false
  }
}

const updateEventHandler = (event) => {
  Object.assign(form, event)
  isUpdate.value = true
  addModalStatus.value = true
}

const addEventHandler = () => {
  addModalStatus.value = true
}

</script>

<template>

  <div class="d-flex justify-content-between align-items-center">
    <BackButton :label="t('title.settings')" />

    <button @click="addModalStatus = true" class="btn btn-dark" style="min-width: 13.25rem;">
      <span class="me-1 text-17">+</span> <span v-if="locale == 'en'" class="me-1">{{t('button.add')}}</span> {{ acitveTabObj.tab.name }} <span v-if="locale == 'de'" style="text-transform: lowercase;">{{t('button.add')}}</span>
    </button>
  </div>
  <h5 class="mt-4">{{t('settings.billing-information')}}</h5>

  <div class="borderd-content">
    <div class="auto-tab-grid">
      <button v-for="(item, i) in billingData" :key="i" @click="changeTab(item)" :class="`${item.id == activeTab.id ? 'btn-secondary' : 'btn-inactive'}`" class="btn text-nowrap px-2">
        {{ item.name }}
      </button>
    </div>

    <component @update="updateEventHandler" @add="addEventHandler" :is="activeTab.component" :key="statickey" /> 
  </div>

  <!-- Add / Edit model form -->
  <ModalControl v-model="addModalStatus" @onHide="onAddModalClose">
    <div class="modal-header">
      <h5 v-if="acitveTabObj.tab.createModalTitle" class="modal-title">
        {{ acitveTabObj.tab.createModalTitle }}
      </h5>
      <h5 v-else class="modal-title">
        {{ acitveTabObj.tab.name }} <span style="text-transform: lowercase;">{{ isUpdate ? t('button.update') : t('button.add') }}</span> 
      </h5>
    </div>
    <div class="modal-body">
      <template v-for="feild in acitveTabObj.tab.fields" :key="feild">
        <!-- <div v-if="feild.image" class="image__input mt-3">
          <p class="label">{{ feild.label }}</p>
          <div class="vehicle__input-file">
            <ButtonImageUploader v-model="form[feild.name]" label="Upload Datei" :file="form[feild.name] ? form[feild.name] : null" />
          </div>
        </div> -->
        
        <div v-if="feild.textfield" class="">
          <div class="text-16 fw-500 pb-3">{{feild.label}}</div>
          <TextControl v-model="form[feild.name]" :placeholder="`${feild.placeholder}`" ></TextControl>
        </div>
        
        <!-- <div v-else-if="feild.options" class="mt-3">
          <SelectControl v-model="form[feild.name]" :options="feild.options" :trackBy="feild.trackBy" :optionLabel="feild.optionLabel" :label="feild.label" :errorField="feild.name" />
        </div>
        <template v-else>
          <InputControl class="mt-3" v-if="feild.append" v-model="form[feild.name]" :label="feild.label" :placeholder="`${feild.placeholder}`" :errorField="feild.name" appendIcon="€" />
          <InputControl class="mt-3" :type="feild.type == 'number'? 'number' : 'text' " v-else v-model="form[feild.name]" :label="feild.label" :placeholder="`${feild.placeholder}`" :errorField="feild.name" />
        </template> -->
      </template>
    </div>
    <div class="modal-footer border-0 mt-2">
      <button @click="addModalStatus = false" type="button" class="btn btn-cancel px-5 py-2 btn-sm">
        {{t('button.cancel')}}
      </button>
      <PrimaryButton v-if="isUpdate" style="min-width: 180px;" @click="onSubmitUpdate" :loading="savingStatus">{{t('button.update')}}</PrimaryButton>
      <PrimaryButton v-else @click="submitForm" style="min-width: 180px;" :loading="savingStatus">{{t('button.save')}}</PrimaryButton>
    </div>
  </ModalControl>

</template>

<style lang="scss" scoped>
.auto-tab-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  .btn {
    min-width: 8.75rem;
    max-width: auto;
    border: 1px solid transparent;
    &:hover {
      background-color: #000000;
      color: white;
    }
  }
}
.btn-secondary {
  background-color: #000000;
}
.btn-inactive {
  background-color: #eeeeee;
  height: 42px; 
  &:hover{
    border-color: transparent; 
  }
}

.image__input {
  display: flex;
  align-items: center;
  justify-content: flex-start;

  .label {
    width: 35%;
    margin: 0;
    padding: 0;
  }

  .select-label {
    width: 38%;
  }

  .vehicle__input-file {
    flex: 1 1 auto;
  }

  .upload-wrapper {
    height: 150px !important;
    width: 100% !important;
  }
}
</style>
