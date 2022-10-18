<script setup>
import { markRaw, reactive, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import { useToast } from "vue-toastification"
import { api } from "@/use/useAxios"
// import { useAuthStore } from "@/stores/auth"

import BackButton from "@/components/buttons/BackButton.vue"
import ModalControl from "@/components/common/modals/ModalControl.vue"
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import FuelManagement from './tabs/FuelManagement.vue'
import FuelLevelManagement from './tabs/FuelLevelManagement.vue'
import FleetClassManagement from './tabs/FleetClassManagement.vue'
import ManufacturerManagement from './tabs/ManufacturerManagement.vue'
import PaymentTermsManagement from './tabs/PaymentTermsManagement.vue'
// import CountryManagement from './tabs/CountryManagement.vue'

const { t } = useI18n({ useScope: 'global' })
const toast = useToast()
// const auth = useAuthStore()
const form = reactive({})
const statickey = ref(1)
const savingStatus = ref(false)
const addModalStatus = ref(false)
const activeTab = ref(null)
const acitveTabObj = reactive({ tab: null })

const vehicleData = [
  {
    id: 1,
    name: t('form-fields.fuel'),
    component: FuelManagement,
    postEndPoint: "/admin/fuel/store",
    updateEndPoint: "/admin/fuel/update/",
    fields: [
      {
        name: "fuel_name",
        image: false,
        label: t('fuelSettings.fuel-name'),
        placeholder: t('fuelSettings.fuel-name'),
        hide: false,
      },
    ],
    // forAdmin: false,
  },
  {
    id: 2,
    name: t('fuelLevelSettings.fuel-level'),
    component: FuelLevelManagement,
    postEndPoint: "/admin/fuel-lavel/store",
    updateEndPoint: "/admin/fuel-lavel/update/",
    fields: [
      {
        name: "label_name",
        image: false,
        label: t('fuelLevelSettings.fuel-level'),
        placeholder: t('fuelLevelSettings.fuel-level'),
        hide: false,
      },
      // {
      //   name: "note",
      //   image: false,
      //   label: t('fuelLevelSettings.note'),
      //   placeholder: 'Note',
      //   hide: false,
      // },
    ],
    // forAdmin: false,
  },
  {
    id: 3,
    name: t('FleetCreate.fleet-class'), 
    component: FleetClassManagement,
    postEndPoint: "/admin/fleetclass/store",
    updateEndPoint: "/admin/fleetclass/update/",
    fields: [
      {
        name: 'classname',
        label: t('fleetSettings.class-name'),
        image: false,
        placeholder: t('fleetSettings.class-name'),
        hide: false,
      },
      {
        name: 'day_rate',
        label: t('fleetSettings.day-rate'),
        image: false,
        placeholder: t('fleetSettings.day-rate'),
        hide: false,
        append: true,
      },
      {
        name: 'week_rate',
        label: t('fleetSettings.week-rate'),
        image: false,
        placeholder: t('fleetSettings.week-rate'),
        hide: false,
        append: true,
      },
      {
        name: 'month_rate',
        label: t('fleetSettings.month-rate'),
        image: false,
        placeholder: t('fleetSettings.month-rate'),
        append: true,
        hide: false,
      },

      // {
      //   name: 'hour_rate',
      //   label:   t('fleetSettings.hour-rate-in-EUR')   ,
      //   image: false,
      //   placeholder: 'e.g. 500',
      //   hide: false,
      // },
      // {
      //   name: "note",
      //   image: false,
      //   label: t('fuelLevelSettings.note'),
      //   placeholder: 'Note',
      //   hide: false,
      // },
    ],
    // forAdmin: false,
  },
  {
    id: 4,
    name: t('FleetCreate.manufacturer'), 
    component: ManufacturerManagement,
    postEndPoint: "/admin/manufacturer/store",
    updateEndPoint: "/admin/manufacturer/update/",
    fields: [
      {
        name: "manufactures_name",
        image: false,
        label: t('manufacturerSettings.manufacturer-name'),
        placeholder: t('manufacturerSettings.manufacturer-name'),
        hide: false,
      }
    ],
    // forAdmin: false,
  },
  // {
  //   id: 5,
  //   name: 'Country',
  //   component: CountryManagement,
  //   postEndPoint: "/admin/country/store",
  //   updateEndPoint: "/admin/country/update/",
  //   fields: [
  //     {
  //       name: "country_name",
  //       image: false,
  //       label: t('countrySettings.label-country-name'),
  //       placeholder: 'e.g. Germany',
  //       hide: false,
  //     },
  //     {
  //       name: "country_code",
  //       image: false,
  //       label: t('countrySettings.label-country-code'),
  //       placeholder: 'e.g. +49',
  //       hide: false,
  //     },
  //     {
  //       name: "iso_2",
  //       image: false,
  //       label: t('countrySettings.label-iso-2'),
  //       placeholder: 'e.g. DE',
  //       hide: false,
  //     },
  //     {
  //       name: "iso_3",
  //       image: false,
  //       label: t('countrySettings.label-iso-3'),
  //       placeholder: 'e.g. DEU',
  //       hide: false,
  //     },
  //     {
  //       name: "lang",
  //       image: false,
  //       label: t('countrySettings.label-language'),
  //       placeholder: 'e.g. Germany',
  //       hide: true,
  //     }
  //   ],
  //   // forAdmin: false,
  // },
  {
    id: 5,
    name: t('settings.payment-terms'), 
    component: PaymentTermsManagement,
    postEndPoint: "/admin/payment_terms/store",
    updateEndPoint: "/admin/payment_terms/update/",
    fields: [
      {
        name: "paymentterms_name",
        image: false,
        label: t('paymentTermsSettings.term-name'),
        placeholder: t('paymentTermsSettings.term-name'),
        hide: false,
      },
      {
        name: "days",
        image: false,
        type: "number", 
        label: t('paymentTermsSettings.days'),
        placeholder: t('paymentTermsSettings.days'),
        hide: false,
      },
      // {
      //   name: "note",
      //   image: false,
      //   label: t('paymentTermsSettings.note'),
      //   placeholder: 'e.g. Note',
      //   hide: false,
      // },
    ],
    // forAdmin: false,
  },
]

const changeTab = (item) => {
  acitveTabObj.tab = item

  const find = vehicleData.find((v) => v.id == item.id)
  activeTab.value = markRaw(find)
}
changeTab(vehicleData[0])

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
      <span class="me-1 text-17">+</span> {{ acitveTabObj.tab.name }} <span style="text-transform: lowercase;">{{t('button.add')}}</span>
    </button>
  </div>
  <h5 class="mt-4">{{t('settings.vehiclesData')}}</h5>

  <div class="borderd-content">
    <div class="auto-tab-grid">
      <button v-for="(item, i) in vehicleData" :key="i" @click="changeTab(item)" :class="`${item.id == activeTab.id ? 'btn-secondary' : 'btn-inactive'}`" class="btn text-nowrap px-2">
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
        <div v-if="feild.image" class="image__input mt-3">
          <p class="label">{{ feild.label }}</p>
          <div class="vehicle__input-file">
            <ButtonImageUploader v-model="form[feild.name]" label="Upload Datei" :file="form[feild.name] ? form[feild.name] : null" />
          </div>
        </div>
        <div v-if="feild.hide" class="" style="display: none">
          <InputControl v-bind:value="en" v-model="form[feild.lang]" />
        </div>
        <div v-else-if="feild.options" class="mt-3">
          <SelectControl v-model="form[feild.name]" :options="feild.options" :trackBy="feild.trackBy" :optionLabel="feild.optionLabel" :label="feild.label" :errorField="feild.name" />
        </div>
        <template v-else>
          <InputControl class="mt-3" v-if="feild.append" v-model="form[feild.name]" :label="feild.label" :placeholder="`${feild.placeholder}`" :errorField="feild.name" appendIcon="€" />
          <InputControl class="mt-3" :type="feild.type == 'number'? 'number' : 'text' " v-else v-model="form[feild.name]" :label="feild.label" :placeholder="`${feild.placeholder}`" :errorField="feild.name" />
        </template>
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
