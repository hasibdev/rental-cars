<script setup>
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useToast } from "vue-toastification"
import { useAxios, api } from '@/use/useAxios'

import InputControl from '@/components/dashboard/form/InputControl.vue'
import CalenderControl from "@/components/dashboard/form/CalenderControl.vue"
import SelectControl from '@/components/dashboard/form/SelectControl.vue'
import FormTextarea from "../shared/FormTextarea.vue"
import BRadio from "@/components/base/BRadio.vue"
import BButton from "@/components/base/BButton.vue"
import WFileUploader from "@/components/base/wfileuploader"
import ArtBoard from "@/components/dashboard/shared/ArtBoard.vue"
import PrimaryButton from "@/components/buttons/PrimaryButton.vue"
// import BTextarea from "@/components/base/BTextarea.vue";
// import FormRadio from "../shared/FormRadio.vue"
// import "@vuepic/vue-datepicker/dist/main.css"

const { t } = useI18n({ useScope: 'global' })
const toast = useToast()
const router = useRouter()

const { data: fleetClasseData } = useAxios('/admin/fleetclass')
const { data: manufacturerData } = useAxios('/admin/manufacturer')
const { data: FuelData } = useAxios('/get-fuel/en')
const { data: locationData } = useAxios('/get-location')

const form = reactive({
  model: '',
  vehicle_name: "",
  plateno: "",
  fleet_date: "",
  class_id: "",
  manufacturer_id: "",
  odometer: "",
  fuel_id: "",
  fuel_lable: "",
  gearshift: "",
  checks: [
    {
      check: "",
      check_date: "",
    },
  ],
  store_id: "",
  art: "",
  note: "",
  files: [],
})

const addCheck = () => {
  form.checks.push({
    check: "",
    check_date: "",
  })
}
const artboardHandler = (fileName) => {
  form.art = fileName
}
const cancelToCreate = () => router.push('')
const savingState = ref(false)
const documents = ref([])

const submitForm = async () => {
  try {
    savingState.value = true
    const formData = new FormData()
    formData.append("documents", documents)

    for (var key of Object.keys(form)) {
      formData.append(key, form[key] ?? '')
    }

    await api.post("/admin/vehicle/store", formData)
    documents.value = []

    toast.success(`${t('toast.addText')}`)
    router.push(`/fuhrparks`)
  } catch (err) {
    toast.error(`${t('toast.failureAddText')}`)
  } finally {
    savingState.value = false
  }
}

</script>

<template>
  <div class="fleet-form">
    <div class="add-customer__container">
      <div class="row">
        <div class="col-lg-6 col-md-6 col-sm-12">
          <InputControl v-model="form.vehicle_name" :label="t('FleetCreate.vehicle-name')" placeholder="Eg: BMW"
            errorField="vehicle_name" class="mt-3" />
          <InputControl v-model="form.model" :label="t('FleetCreate.model')" placeholder="Eg: BMW GH2890"
            errorField="model" class="mt-3" />
          <InputControl v-model="form.plateno" :label="t('FleetCreate.plate-no')" placeholder="Eg: 12345678"
            errorField="plateno" class="mt-3" />
          <CalenderControl v-model="form.fleet_date" :label="$t('FleetCreate.fleet-date')" placeholder="DD/MM/YYYY"
            class="mt-3" errorField="fleet_date" />
          <SelectControl v-model="form.class_id" optionLabel="classname" :options="fleetClasseData || [] "
            :placeholder="t('FleetCreate.select-fleet-class')" :label="t('FleetCreate.select-fleet-class')"
            errorField="classname" class="mt-3" />
          <SelectControl v-model="form.manufacturer_id" optionLabel="manufactures_name"
            :options="manufacturerData || [] " :placeholder="t('FleetCreate.manufacturer')"
            :label="t('FleetCreate.select-manufacturer')" errorField="manufacturer_id" class="mt-3" />
          <InputControl v-model="form.odometer" :label="t('FleetCreate.odometer')" placeholder="Eg: 1234567"
            errorField="odometer" class="mt-3" />
          <SelectControl v-model="form.fuel_id" optionLabel="fuel_name" :options="FuelData?.fules || [] "
            :placeholder="t('FleetCreate.select-fuel')" :label="t('FleetCreate.fuel')" errorField="fuel_id"
            class="mt-3" />
          <InputControl v-model="form.fuel_lable" :label="t('FleetCreate.fuel-level')" placeholder="Eg: 100%"
            errorField="fuel_lable" class="mt-3" />
          <!-- <b-radio v-model="form.gearshift" :label="$t('FleetCreate.gearshift')" color="#276EF1" inline :options="[
                { label: 'Automatic', name: 'gearshift' },
                { label: 'Manual', name: 'gearshift' },
              ]"  errorField="gearshift" class="mt-3" /> -->
          <div class="row mx-0 mt-4 d-md-flex align-items-center">
            <div class="col-md-4 col-sm-12 ps-0">
              <p class="mb-1">Gearshift</p>
            </div>
            <div class="col-md-8 col-sm-12">
              <b-radio v-model="form.gearshift" :label="$t('FleetCreate.gearshift')" color="#276EF1"
                style="font-weight:400" inline :options="[
                  { label: 'Automatic', name: 'gearshift' },
                  { label: 'Manual', name: 'gearshift' },
                ]" errorField="gearshift" />
            </div>
          </div>
          <!-- <FormRadio v-model="form.gearshift" class="mt-4" :options="[
              { label: 'Automatic', name: 'gearshift' },
              { label: 'Manual', name: 'gearshift' },
            ]" :label="$t('FleetCreate.gearshift')" /> -->
          <template v-for="(checks, idx) in form.checks" :key="idx">
            <InputControl v-model="checks.check" type="text" :label="t('FleetCreate.checks')"
              placeholder="Eg: Main Inspection" class="mt-3" />
            <CalenderControl v-model="checks.check_date" :label="$t('FleetCreate.check-date')" placeholder="DD/MM/YYYY"
              class="mt-3" />
          </template>
          <button class="base-btn fleet-form__check-btn mt-2 ps-3" @click="addCheck">
            + {{$t('FleetCreate.add-check')}}
          </button>
          <SelectControl v-model="form.store_id" optionLabel="location_name" :options="locationData?.lcoations || [] "
            :placeholder="t('FleetCreate.base-location')" :label="t('FleetCreate.base-location')" errorField="store_id"
            class="mt-3" />
        </div>
        <div class="col-lg-5 col-md-6 offset-lg-1 col-sm-12">
          <div class="row mx-0 mb-4">
            <div class="col-lg-4 col-md-3 col-sm-3">
              <p>{{$t('FleetCreate.photo')}}</p>
            </div>
            <div class="col-lg-8 col-md-9 col-sm-9">
              <W-file-uploader v-model="form.files" max="5242880" form-name="form"
                endpoint="/admin/documentsupload/store" rm-endpoint="/admin/documentsupload/delete"
                rm-all-endpoint="/admin/documentsupload/all-delete" :types="['image/png', 'application/pdf']"
                color="#276EF1" value-property="id" />
            </div>
          </div>
          <div class="mb-4">
            <ArtBoard @update="artboardHandler" endpoint="/admin/documentsupload/singlestore"
              :deleteEndpoint="`/admin/documentsupload/single-delete/${form.art}`" :select-file="form.art" />
          </div>
          <FormTextarea v-model="form.note" :label="$t('FleetCreate.damages')"
            :placeholder="t('FleetCreate.Type-text-here')" />
          <!-- <b-textarea v-model="form.note" :label="$t('FleetCreate.damages')" :placeholder="$t('FleetCreate.Type-text-here')" :height="150" />  -->

          <div class="fleet-form__actions text-end">
            <BButton style="width: 150px" :loading="false" theme="light" @click="cancelToCreate">Cancel</BButton>
            <!-- <BButton style="width: 150px" :loading="false" theme="secondary" @click="submitForm">{{ loading ? "Saving..." : "Save Fleet" }}</BButton> -->
            <PrimaryButton @click="submitForm" :loading="savingState">Add Customer</PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.fleet-form {
  border: 1px solid var(--color-light-grey);
  padding: 1rem;
  border-radius: 4px;
  padding-bottom: 0;

  &__actions {
    text-align: center;
  }

  &__check-btn {
    padding: 0;
    margin-bottom: 1rem;
    font-size: 0.9375rem;
    color: var(--color-secondary);
    font-weight: 500;
    margin-left: 33%;
  }

  &__right-col {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
    height: 100%;
  }
}
</style>
