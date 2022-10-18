<script setup>
import { reactive, watch, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { useAxios, api } from '../../../use/useAxios'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'

import BackButton from '@/components/buttons/BackButton.vue'
import InputControl from '@/components/dashboard/form/InputControl.vue'
import SelectControl from '@/components/dashboard/form/SelectControl.vue'
import LogoUploader from '@/components/base/LogoUploader.vue'

const toast = useToast()
const { t, locale } = useI18n({ useScope: 'global' })

const { data, reFetch } = useAxios('/admin/general-information')

const logoFile = ref(null)

const form = reactive({
  data: {
    compnay_name: '',
    account_email: '',
    customer_email: '',
    store_currency: '',
    tax_rates: '',
    tax_no: '',
    legal_name_of_the_company: '',
    street: '',
    postcode: '',
    city: '',
    country: '',
    logo: null,
    reservation_prefix: '',
    invoice_prefix: '',
    mobile_number: '',
    default_lang: 'de',
  }
})

const langOptions = [
  { label: t('language.english'), id: 'en' },
  { label: t('language.german'), id: 'de' },
]
const switchLocale = (lang) => {
  locale.value = lang
  localStorage.setItem('lang', lang)
  document.documentElement.setAttribute('lang', lang) 
}


watch(data, (value) => {
  if (value) {
    form.data = { ...value }
  }
})

const savingState = ref(false)
const saveSettings = async () => {
  try {
    savingState.value = true

    const formData = new FormData()

    for (const key in form.data) {
      formData.append(key, form.data[key] ?? '')
      formData.append('logo', logoFile.value ?? '')
    }

    await api.post('/admin/general-information/store', formData)

    toast.success(`${t('toast.updateText')}`)
    reFetch('/admin/general-information')
  } catch (error) {
    console.error(error)
    toast.error(`${t('toast.failureUpdateText')}`)
  } finally {
    savingState.value = false
  }
}
// const changeLogo = function(e){
//   const file = e.target.files[0];
//   form.data.logo = URL.createObjectURL(file);
// }


</script>

<template>

  <BackButton :label="t('title.settings')" />
  <h5 class="mt-4 mb-3">{{t('generalSettings.pageTitle') }}</h5>

  <div class="row">
    <div class="col-lg-6 col-md-12">
      <div class="borderd-content">
        <h6 class="mb-3"> {{t('generalSettings.storeDetailTitle')}} </h6>
        <p class="text-muted text-14">{{ t('generalSettings.storeDetail-text')}}</p>

        <InputControl v-model="form.data.compnay_name" :label="t('generalSettings.companyName')" :placeholder="t('generalSettings.companyName')" errorField="compnay_name" />
        <InputControl v-model="form.data.account_email" :label="t('generalSettings.accountEmail')" placeholder="Example@mail.com" type="email" errorField="account_email" class="my-3" />

        <div class="row my-2">
          <div class="col-md-8 offset-md-4">
            <p class="text-muted text-14">{{t('generalSettings.accountEmailText')}}</p>
          </div>
        </div>

        <InputControl v-model="form.data.customer_email" :label="t('generalSettings.customerEmail')" placeholder="example@mail.com" errorField="customer_email" type="email" class="my-3" />

        <div class="row my-2">
          <div class="col-md-8 offset-md-4">
            <p class="text-muted text-14">{{ t('generalSettings.customerEmailText')}}</p>
          </div>
        </div>

        <InputControl v-model="form.data.mobile_number" :label="t('form-fields.phone-number')" :placeholder="t('form-fields.phone-number')" errorField="mobile_number" type="number" class="my-3" />

        <InputControl v-model="form.data.reservation_prefix" :label="t('generalSettings.reservation')" errorField="reservation_prefix" class="my-3" />
        <InputControl v-model="form.data.invoice_prefix" :label="t('generalSettings.invoice')" errorField="invoice_prefix" class="my-3" />

      </div>

      <div class="borderd-content mt-3 text-center">
        <LogoUploader v-model="logoFile" :image="imageBaseUrl(`/logo/${form.data.logo}`)" errorField="logo" data-field="logo" />

        <!-- <div
            id="uploaded-logo-div"
            class="w-80 pb-3"
          >
            <img v-if="form.data.logo == null " src="@/assets/images/Group.png" class="img-fluid" alt="Logo" />
            <img v-else id="uploaded-logo" :src="imageBaseUrl(`/logo/${form.data.logo}`)" class="img-fluid" alt="Logo" />
          </div> -->
        <!-- <div class="py-3"></div>
          <div class="logo-upload-div">
            <label class="btn-upload py-2 fw-500 p" for="upload-logo" >
              Upload Logo
              <input type="file" id="upload-logo" @change="changeLogo" name="upload-logo"  />
            </label>
          </div> -->
      </div>
    </div>
    <div class="col-lg-6 col-md-12">
      <div class="borderd-content">
        <h6>{{t('generalSettings.storeAddressTitle')}}</h6>
        <p class="text-14 text-muted mb-5">{{t('generalSettings.storeAddressText')}}</p>

        <InputControl v-model="form.data.legal_name_of_the_company" :label="t('generalSettings.businessName')" :placeholder="t('generalSettings.businessName')" errorField="legal_name_of_the_company" />
        <InputControl v-model="form.data.street" :label="t('generalSettings.street')" :placeholder="t('generalSettings.street')" class="mt-3" errorField="street" />
        <InputControl v-model="form.data.postcode" :label="t('generalSettings.zipcode')" :placeholder="t('generalSettings.zipcode')" class="mt-3" errorField="postcode" />
        <InputControl v-model="form.data.city" :label="t('generalSettings.city')" :placeholder="t('generalSettings.city')" class="mt-3" errorField="city" />
        <InputControl v-model="form.data.country" :label="t('generalSettings.country')" class="mt-3" errorField="country" />

        <SelectControl v-model="form.data.default_lang" :options="langOptions" @update:modelValue="switchLocale" :label="t('form-fields.language')" class="mt-3"></SelectControl>
        <InputControl v-model="form.data.tax_no" :label="t('form-fields.tax-number')" :placeholder="t('form-fields.tax-number')" class="mt-3" errorField="tax_no" />
      </div>

      <div class="borderd-content mt-3">
        <h6>{{t('generalSettings.storeCurrencyTitle')}}</h6>
        <p class="text-muted text-14">{{t('generalSettings.storeCurrencyText')}}</p>

        <InputControl disabled v-model="form.data.store_currency" :label="t('generalSettings.storeCurrency')" placeholder="EUR" errorField="store_currency" class="my-3" />
        <InputControl v-model="form.data.tax_rates" :label="t('generalSettings.taxRate')" errorField="tax_rates" class="my-3" />

        <div class="py-3"></div>

      </div>
    </div>

    <div class="col-md-12 mt-4 text-right">
      <!-- <button type="button" class="btn btn-cancel me-3">
          <app-link to="/settings">Abbrechen</app-link>
        </button> -->
      <app-link path="/einstellungen" class="btn btn-cancel mx-3">{{t('button.cancel')}}</app-link>
      <!-- <button type="button" class="btn btn-save" @click="saveSettings" :loading="savingState">Save</button> -->
      <PrimaryButton type="button" style="min-width: 180px;" class="btn btn-save" @click="saveSettings" :loading="savingState">{{t('button.save')}}</PrimaryButton>
    </div>
  </div>

  <!-- <div class="d-flex justify-content-end mb-3">
      <button class="btn btn-light me-3">Abbrechen</button>
      <PrimaryButton @click="saveSettings" :loading="savingState">Speichern</PrimaryButton>
    </div> -->

</template>

<style lang="scss" scoped>
@import "../../../styles/scss/_variables.scss";

.label {
  font-size: 16px;
  font-weight: 500px;
  color: $light-gray;
}

.btn-cancel {
  background: #eeeeee;
  border-radius: 4px;
  color: $light-gray;
  font-size: 1rem;

  &:hover {
    border-color: #eeeeee;
  }
}

.btn-save {
  background: $secondary-color;
  color: white;
}

.btn-upload {
  width: 60%;
  color: #000000;
  background: #eeeeee;
  border: 1px solid #000000;
  border-radius: 4px;
  cursor: pointer;
}

.logo-upload-div input[type="file"] {
  display: none;
}
</style>
