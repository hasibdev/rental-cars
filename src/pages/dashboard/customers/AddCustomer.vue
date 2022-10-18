<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
// import BButton from "../../../components/base/BButton.vue"
// import BRadio from "../../../components/base/BRadio.vue"
import RadioControl from '@/components/dashboard/form/RadioControl.vue'
// import ProfileUploader from "../../../components/base/ProfileUploader.vue"
import { api, useAxios } from "../../../use/useAxios"

// import countries from "../../../static/countries.json"
import InputControl from "@/components/dashboard/form/InputControl.vue"
import SelectControl from "@/components/dashboard/form/SelectControl.vue"
import CalenderControl from "@/components/dashboard/form/CalenderControl.vue"
import PrimaryButton from "@/components/buttons/PrimaryButton.vue"
import BackButton from "@/components/buttons/BackButton.vue"
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import DocumentsCameraUploader from '@/components/dashboard/form/DocumentsCameraUploader.vue'

const { t } = useI18n({ useScope: 'global' })
const router = useRouter()
const toast = useToast()

const { data: countries } = useAxios('admin/country')


const form = reactive({
  customer_type: "",
  first_name: "",
  last_name: "",
  name_title: "Mr.",
  date_of_birth: "",
  country_of_birth: "",
  place_of_birth: "",
  nationality: "",
  address: "",
  city: "",
  zip: "",
  province: "",
  country: "",
  tax_id: "",
  phone: "",
  mobile: "",
  email: "",
  idcard_type: "Identity card",
  id_no: "",
  place_of_id_issuance: "",
  date_ofissunceotcard: "",
  expiry_dateoftheidcard: "",
  drivers_license_no: "",
  marketing_purposes: "Yes",
  store_id: "",
  company_name: "",
  // photo: "",
  date_of_issunce_of_driving_license: '',
  place_of_issunce_of_driving_license: '',
  expiry_date_of_driving_license: ''
})

const customerTypes = ref([{ label: t('dashboard-customer.commercial'), id: "Commercial" }, { label: t('dashboard-customer.private'), id: "Private" }])
const savingState = ref(false)
const documents = ref([])

const cancelToCreate = () => router.push(`/kunden`)
const submitForm = async () => {
  try {
    savingState.value = true
    const formData = new FormData()

    for (let i = 0; i < documents.value.length; i++) {
      formData.append(`documents[${i}]`, documents.value[i])
    }

    for (var key of Object.keys(form)) {
      formData.append(key, form[key] ?? '')
    }

    await api.post("/admin/customer/store", formData)
    documents.value = []

    toast.success(`${t('toast.addText')}`)
    router.push(`/kunden`)
  } catch (err) {
    toast.error(`${t('toast.failureAddText')}`)
  } finally {
    savingState.value = false
  }
}
const maxBirthYear = new Date((new Date()).getFullYear() - 21, (new Date()).getMonth(), (new Date()).getDate())

const titleOptions = [
  { label: t('home-booking-request-form.mr'), value: 'Mr.' },
  { label: t('home-booking-request-form.mrs'), value: 'Mrs.' },
]
const marketingOptions = [
  { label: t('form-fields.yes'), value: 'Yes' },
  { label: t('form-fields.no'), value: 'No' },
]

const cardOptions = [
  { label: t('form-fields.identity-card'), value: 'Identity card' },
  { label: t('form-fields.passport'), value: 'Passport' },
]
</script>

<template>

  <div class="add-customer">
    <h2 class="add-customer__title d-flex">
      <BackButton /> <span class="ms-2">{{t('dashboard-customer.add-customer')}}</span>
    </h2>
    <h3 class="add-customer__sub-title">{{t('dashboard-reservation.customer-info')}}</h3>
    <div class="add-customer__container">
      <div class="row">
        <!-- First Column -->
        <div class="col-md-4">
          <SelectControl v-model="form.customer_type" :options="customerTypes" :placeholder="t('form-fields.customer-type')" class="mb-3" />
          <InputControl v-if="form.customer_type == 'Commercial' " v-model="form.company_name" :placeholder="t('generalSettings.companyName')" errorField="company_name" class="mb-3" />

          <!-- <b-radio v-model="form.name_title" color="#276EF1" inline :options="[
            { label: 'Mr', name: 'nameTitle' },
            { label: 'Mrs', name: 'nameTitle' },
          ]" /> -->
          <RadioControl v-model="form.name_title" name="name_title" :options="titleOptions" errorField="name_title" />

          <InputControl v-model="form.first_name" :placeholder="t('profile.first-name')" errorField="first_name" class="mb-3" />
          <InputControl v-model="form.last_name" :placeholder="t('profile.last-name')" errorField="last_name" class="mb-3" />
          <InputControl v-model="form.tax_id" :placeholder="t('form-fields.tax-id')" class="mb-3" />
          <InputControl v-model="form.address" :placeholder="t('form-fields.address')" class="mb-3" />
          <InputControl v-model="form.city" :placeholder="t('form-fields.city/town')" class="mb-3" />

          <InputControl v-model="form.zip" :placeholder="t('form-fields.zip-code')" class="mb-3" />
          <InputControl v-model="form.province" :placeholder="t('form-fields.province')" class="mb-3" />
          <SelectControl v-model="form.country" track="id" optionLabel="country_name" :options="countries?.countrys || []" :placeholder="t('form-fields.country')" class="mb-3" />
          <InputControl v-model="form.place_of_birth" :placeholder="t('form-fields.place-of-birth')" class="mb-3" />
          <SelectControl v-model="form.nationality" track="id" optionLabel="nationality_name" :options="countries?.countrys || []" :placeholder="t('form-fields.nationality')" class="mb-3" />

        </div>
        <!-- Second Column -->
        <div class="col-md-4">

          <SelectControl stack v-model="form.country_of_birth" track="id" optionLabel="country_name" :options="countries?.countrys || []" :placeholder="t('form-fields.country-of-birth')" :label="$t('form-fields.country-of-birth')" class="mb-3" />
          <CalenderControl v-model="form.date_of_birth" :maxDate="maxBirthYear" :placeholder="t('form-fields.date-of-birth')" class="mb-3" />

          <!-- <b-radio v-model="form.idcard_type" color="#276EF1" inline :options="[
            { label: t('form-fields.identity-card'), name: 'identity' },
            { label: t('form-fields.passport'), name: 'identity' },
          ]" /> -->
          <RadioControl v-model="form.idcard_type" name="idcard_type" :options="cardOptions" />
          <InputControl v-model="form.id_no" :placeholder="t('form-fields.id-card-number')" class="mb-3" />
          <InputControl v-model="form.place_of_id_issuance" :placeholder="t('form-fields.id-place-of-issuance')" class="mb-3" />

          <CalenderControl v-model="form.date_ofissunceotcard" :placeholder="t('form-fields.id-date-of-issuance')" class="mb-3" />
          <CalenderControl v-model="form.expiry_dateoftheidcard" :placeholder="t('form-fields.id-expiry-date')" class="mb-3" />
          <p class="mt-5" style="color: #666666;"> {{t('dashboard-customer.consent-text')}} </p>
          <!-- <b-radio v-model="form.marketing_purposes" color="#276EF1" inline :options="[
          { label: 'Yes', name: 'marketing' },
          { label: 'No', name: 'marketing' },
          ]" /> -->
          <RadioControl v-model="form.marketing_purposes" name="marketing_purpose" :options="marketingOptions" />
          <InputControl v-model="form.phone" :placeholder="t('form-fields.mobile-no')" errorField="phone" class="mb-3 mt-4" />
          <InputControl v-model="form.email" :placeholder="t('form-fields.email')" errorField="email" type="email" class="mb-3" />
        </div>
        <!-- Third Column -->
        <div class="col-md-4">
          <div class="row">
            <div class="col-md-10">
              <InputControl v-model="form.drivers_license_no" :placeholder="t('form-fields.driving-license-no')" class="mb-3" />
              <CalenderControl v-model="form.date_of_issunce_of_driving_license" :placeholder="t('form-fields.date-of-issue')" class="mb-3" />
              <InputControl v-model="form.place_of_issunce_of_driving_license" :placeholder="t('form-fields.place-of-issue')" class="mb-3" />
              <CalenderControl v-model="form.expiry_date_of_driving_license" :placeholder="t('form-fields.expiry-date')" class="mb-4" />

              <DocumentsCameraUploader v-model="documents" errorField="picture"></DocumentsCameraUploader>
            </div>
          </div>
        </div>

      </div>
      <div class="row">
        <div class="col-md-12">
          <div class="add-customer__actions text-end">
            <button class="btn btn-cancel me-3" @click="cancelToCreate">{{t('button.back')}}</button>
            <PrimaryButton variant="dark" @click="submitForm" :loading="savingState">
              {{t('dashboard-customer.add-customer')}}</PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>


<style lang="scss" scoped>
.add-customer {
  border: 1px solid var(--color-light-grey);
  padding: 1rem;
  border-radius: 4px;
  padding-bottom: 0;

  &__title {
    font-size: 1rem;
    margin-bottom: 1.5rem;
    // text-transform: capitalize;
  }

  &__sub-title {
    font-size: 1.3rem;
    font-weight: 500;
    margin-bottom: 1rem;
    text-transform: capitalize;
  }

  &__actions {
    text-align: center;
  }
}
</style>
