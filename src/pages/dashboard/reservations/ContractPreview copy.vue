<script setup>

import artImage from "@/assets/images/artImage.png"
import { useRoute } from 'vue-router'
import { ref, reactive, watch } from 'vue'
import { useAxios, api } from '../../../use/useAxios'
import ModalControl from '@/components/common/modals/ModalControl.vue'
import InputControl from '@/components/dashboard/form/InputControl.vue'
import PrimaryButton from '../../../components/buttons/PrimaryButton.vue'
import CheckBox from '../../../components/dashboard/form/CheckBox.vue'
import { apiBaseUrl } from '@/main'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import fileDownload from 'js-file-download'

const { t, locale } = useI18n({ useScope: 'global' })
const toast = useToast()

const route = useRoute()
const signatureErrorText = ref(false)
const signatureFinalErrorText = ref(false)

const { data, loading, reFetch } = useAxios(`admin/reservation/view/${route.params.id}`)

const generalInfo = ref()

const getGeneralInfo = async () => {
  try {
    const res = await api.get('/admin/general-information')
    generalInfo.value = res.data
  } catch (err) {
    console.error(err)
  }
}
getGeneralInfo()

// Signature
const form = reactive({
  singature: '',
  signature_label: '',
  agreement_singature: '',
  agreement_signature_label: '',
  reservation_status: 'Rented'
})


// Finish Contract Form
const finalForm = reactive({
  return_singature: '',
  return_signature_label: '',
  reservation_status: 'Completed',
})

const signatureModalStatus = ref(false)
const signatureFinishContractModalStatus = ref(false)
// const nonSmokingSignatureModalStatus = ref(false)
const signaturePad = ref()

const openSignatureModal = () => {
  signatureModalStatus.value = true
}

const openSignatureModalForFinish = () => {
  signatureFinishContractModalStatus.value = true
}



// const undoSignature = async () => {
//   signaturePad.value.undoSignature()
// }

const clearSignature = () => {
  signaturePad.value.clearSignature()
  form.singature = ''
  finalForm.return_singature = ''
}

const onSignatureEnd = () => {
  form.singature = signaturePad.value.saveSignature().data
}

const onSignatureEndFinishContract = () => {
  finalForm.return_singature = signaturePad.value.saveSignature().data
}

// const onSignatureEndNonSmoking = () => {
//   form.agreement_singature = signaturePad.value.saveSignature().data
// }
 
const onSignatureBegin = () => {
  form.singature = signaturePad.value.resizeCanvas()
}

const onSignatureBeginFinishContract = () => {
  finalForm.return_singature = signaturePad.value.resizeCanvas()
}
// const onSignatureBeginNonSmoking = () => {
//   form.agreement_singature = signaturePad.value.resizeCanvas()
// }

const contractStatus = ref('')
const contractModalStatus = ref(false)
const contactLoading = ref(false)
const finalContactLoading = ref(false)

const createContract = async () => {
  if (!form.singature) {
    signatureErrorText.value = true
    toast.error(t('text.signature-is-required'))
  }
  else {
    signatureErrorText.value = false
    try {
      contactLoading.value = true
      await api.post(`admin/reservation/create-contact/${route.params.id}`, form)
      // await api.post(`admin/reservation/status/${route.params.id}`, {
      //   reservation_status: 'Rented'
      // })
      contractModalStatus.value = true
      contractStatus.value = "Created"
      reFetch()

    } catch (error) {
      console.error(error)
    } finally {
      contactLoading.value = false
    }
  }
}

const finishContract = async () => {
  if (!finalForm.return_singature) {
    signatureFinalErrorText.value = true
    toast.error(t('text.signature-is-required'))
  }
  else {
    try {
      finalContactLoading.value = true
      await api.post(`admin/reservation/contact-finish/${route.params.id}`, finalForm)

      contractModalStatus.value = true
      contractStatus.value = "Completed"
      reFetch()
    } catch (error) {
      console.error(error)
    } finally {
      finalContactLoading.value = false
    }
  }
}

const pdfLoading = ref(false)
const print = async () => {
  try {
    pdfLoading.value = true
    const res = await api.get(`admin/reservation/contact-print/${route.params.id}`)
    const url = `${apiBaseUrl}/${res.data.location}${res.data.file_name}`
    window.open(url)
  } catch (error) {
    console.error(error)
  } finally {
    pdfLoading.value = false
  }
}

const saveAsPdfLoading = ref(false)
const saveAsPdf = async (rev_no, first_name, last_name) => {
  try {
    saveAsPdfLoading.value = true
    const res = await api.get(`admin/reservation/contact-pdf/${route.params.id}`, {
      responseType: 'blob',
    })
    fileDownload(res.data, `Vertrag_${rev_no}_${first_name}_${last_name}.pdf`)
  } catch (error) {
    console.error(error)
  } finally {
    saveAsPdfLoading.value = false
  }
}

// const customerEmail = ref('')
// customerEmail.value = data?.customerinfo?.email
// console.log(customerEmail.value)

const sendEmailLoading = ref(false)
const sendEmailForm = reactive({
  cc_me_status: false,
})
const emailId = ref([
  {
    cc_email: ''
  },
])
const addEmailId = () => {
  emailId.value.push({
    cc_email: "",
  })
}

const removeEmail = idx => {
  emailId.value.splice(idx, 1)
}

const sendEmail = async () => {
  try {
    sendEmailLoading.value = true
    const formData = new FormData()
    for (let i = 0; i < emailId.value.length; i++) {
      formData.append(`cc_email[${i}]`, emailId.value[i].cc_email ?? '')
    }
    formData.append('cc_me_status', sendEmailForm.cc_me_status)
    await api.post(`admin/reservation/contact-sendmail/${route.params.id}`, formData)
    toast.success(`${t('toast.email-sent-successfully')}`)

    sendEmailForm.cc_me_status = false
    emailId.value = [{ cc_email: '' }]

  } catch (error) {
    console.error(error)
    toast.error(`${t('toast.email-sending-error')}`)
  } finally {
    sendEmailLoading.value = false
  }
}


watch(() => data.value, (newData) => {
  emailId.value[0].cc_email = newData.customerinfo.email
})

</script>

<template>

  <p class="fw-500 mb-4">{{t('button.contract-preview')}}</p>

  <!-- Loading -->
  <Loading v-if="loading" class="my-3" />

  <div v-if="!loading" class="d-flex justify-content-center flex-wrap w-100">
    <div class="mb-4 overflow-scroll scrollbar" style="width: 596px; height: 95vh">
      <div class="borderd-content mb-3 px-0">
        <div class=" d-flex justify-content-between">
          <div class="w-20">
            <div class="text-14 fw-500 mb-1 text-center">{{t('dashboard-reservation.rental-contract')}}</div>
            <img :src="imageBaseUrl(`/logo/${generalInfo.logo}`)" class="text-center img-fluid p-2" style="max-height: 50px" alt="">
          </div>
          <div class="w-20 ps-2">
            <div class="text-8 fw-400 text-light-gray">
              {{generalInfo.compnay_name}} GmbH
            </div>
            <div class="text-8 fw-400 text-light-gray">
              {{generalInfo.street}}
            </div>
            <div class="text-8 fw-400 text-light-gray">
              {{generalInfo.postcode}} {{generalInfo.city}}, {{generalInfo.country}}
            </div>
            <div class="text-8 fw-400 text-light-gray">
              {{generalInfo.mobile_number}}
            </div>
            <div class="text-8 fw-400 text-light-gray">
              {{generalInfo.account_email}}
            </div>
            <div class="text-8 fw-400 text-light-gray">
              {{t('form-fields.tax-no')}}: {{generalInfo.tax_no}}
            </div>
          </div>
          <div class="w-20 pe-1">
            <div class="pb-1 text-8 text-light-gray">
              <span class="text-10 fw-500 text-dark pe-1">{{t('form-fields.pick-up')}}</span>
              <span v-if="locale == 'de'" class="text-8 fw-500">
                {{moment(data?.reservation?.start_date).format('DD.MM.YYYY') }} {{moment(data?.reservation?.start_time, "HH:mm:ss").format('HH:mm') }}
              </span>
              <span v-else class="text-8 fw-500">
                {{moment(data?.reservation?.start_date).format('DD/MM/YYYY') }} {{moment(data?.reservation?.start_time, "HH:mm:ss").format('h:mm A') }}
              </span>
            </div>
            <div class="text-8 fw-500 text-light-gray">{{data?.reservation?.pick_locationname}},
              {{data?.reservation?.pick_street}}, {{data?.reservation?.pic_city}}, {{data?.reservation?.pic_country}}
            </div>
          </div>
          <div class="w-20 px-1">

            <div class="text-8 fw-500 text-light-gray">
              <span class="text-10 fw-500 text-dark pe-1">{{t('form-fields.expected-drop-off')}}</span>
              <span v-if="locale == 'de'" class="text-8 fw-500">
                {{moment(data?.reservation?.end_date).format('DD.MM.YYYY') }} {{moment(data?.reservation?.end_time, "HH:mm:ss").format('HH:mm') }}
              </span>
              <span v-else class="text-8 fw-500">
                {{moment(data?.reservation?.end_date).format('DD/MM/YYYY') }} {{moment(data?.reservation?.end_time, "HH:mm:ss").format('h:mm A') }}
              </span>
            </div>
            <div class="text-8 text-light-gray">{{data?.reservation?.return_locationname}},
              {{data?.reservation?.return_street}}, {{data?.reservation?.return_city}},
              {{data?.reservation?.return_country}}</div>
          </div>
          <div class="w-20 ps-1">
            <div class="text-dark fw-700 text-10 pb-1">
              {{t('form-fields.reservation-id')}}: #{{ data?.reservation?.reservation_no }}
            </div>
            <div class="text-8 fw-500">
              <span style="color:#9A9DA3">{{t('form-fields.date')}} : </span>
              <span style="color:#020918;" v-if="locale == 'de'">{{ moment(data?.reservation?.created_at).format('DD.MM.YYYY HH:mm')}}</span>
              <span style="color:#020918;" v-else>{{ moment(data?.reservation?.created_at).format('DD/MM/YYYY hh:mm A')}}</span>
            </div>
          </div>
        </div>
        <hr>
        <div class="row mx-0">
          <div class="col-md-5 col-sm-4 col-xs-12">
            <div class="text-9 fw-500 mb-2" style="color:#020918;">{{t('form-fields.to')}}</div>
            <div class="bodered-content text-white px-3 py-3" style="background-color:#000000; border: 1px solid #dddddd; border-radius: 4px; min-height: 99px;">
              <div class="text-9 fw-600">{{ data?.customerinfo?.full_name }}</div>
              <div class="text-9 fw-400">{{ data?.customerinfo?.address }}</div>
              <div class="text-9 fw-400">{{ data?.customerinfo?.city }} <span v-if="data?.customerinfo?.country != 'null'"> {{ data?.customerinfo?.country }}</span></div>
              <div class="text-9 fw-400">{{ data?.customerinfo?.phone }}</div>
              <div class="text-9 fw-400">{{ data?.customerinfo?.email }}</div>
            </div>
          </div>
          <div class="col-md-7 col-sm-8 col-xs-12">
            <div class="text-9 fw-500 mb-2" style="color:#020918;">{{t('form-fields.lesse')}}</div>
            <div class="bodered-content text-white px-3 py-3" style="border: 1px solid #dddddd; border-radius: 4px; height: 99px;">
              <div>
                <div class="text-9 fw-500 text-secondary pb-1">{{ data?.customerinfo?.full_name }}</div>
                <div class="row">
                  <div class="col-md-6 col-sm-12">
                    <div class="text-9 fw-400 row mx-0">
                      <div class="col-md-6 px-0">
                        <div class="text-9 fw-500" style="color: #020918;">{{t('form-fields.date-of-birth')}}:</div>
                      </div>
                      <div class="col-md-6">
                        <div class="text-9 fw-400" style="color: #020918;" v-if="locale == 'de'">
                          {{moment(data?.customerinfo?.date_of_birth).format('DD.MM.YYYY') }}
                        </div>
                        <div class="text-9 fw-400" style="color: #020918;" v-else>
                          {{moment(data?.customerinfo?.date_of_birth).format('DD/MM/YYYY') }}
                        </div>
                      </div>
                    </div>
                    <div class="text-9 fw-400 row mx-0">
                      <div class="col-md-6 px-0">
                        <div class="text-9 fw-500" style="color: #020918;">{{t('form-fields.driving-license-no')}}:
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="text-9 fw-400" style="color: #020918;">{{ data?.customerinfo?.drivers_license_no }}
                        </div>
                      </div>
                    </div>
                    <div class="text-9 fw-400 row mx-0">
                      <div class="col-md-6 px-0">
                        <div class="text-9 fw-500" style="color: #020918;">{{t('form-fields.place-of-issue')}}:</div>
                      </div>
                      <div class="col-md-6">
                        <div class="text-9 fw-400" style="color: #020918;">{{
                        data?.customerinfo?.place_of_issunce_of_driving_license }}</div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6 col-sm-12">
                    <div class="text-9 fw-400 row mx-0">
                      <div class="col-md-6 px-0">
                        <div class="text-9 fw-500" style="color: #020918;">{{t('form-fields.date-of-issue')}}:</div>
                      </div>
                      <div class="col-md-6">
                        <div class="text-9 fw-400" style="color: #020918;" v-show="data?.customerinfo?.date_of_issunce_of_driving_license">
                          <span v-if="locale == 'de'">{{moment(data?.customerinfo?.date_of_issunce_of_driving_license).format('DD.MM.YYYY') }}</span>
                          <span v-else>{{moment(data?.customerinfo?.date_of_issunce_of_driving_license).format('DD/MM/YYYY') }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="text-9 fw-400 row mx-0">
                      <div class="col-md-6 px-0">
                        <div class="text-9 fw-500" style="color: #020918;">{{t('form-fields.expiry-date')}}:</div>
                      </div>
                      <div class="col-md-6">
                        <div class="text-9 fw-400" style="color: #020918;" v-if="data?.customerinfo?.expiry_date_of_driving_license">
                          <span v-if="locale== 'de'">{{moment(data?.customerinfo?.expiry_date_of_driving_license).format('DD.MM.YYYY') }}</span>
                          <span v-else>{{moment(data?.customerinfo?.expiry_date_of_driving_license).format('DD/MM/YYYY') }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr>
        <div class="row mx-0">

          <div class="col-md-7 col-sm-12">
            <!-- <pre>{{data?.drivers}}</pre> -->
            <!-- Additional Drivers -->
            <div v-if="data?.drivers?.length >0" class="row mx-0">
              <template v-for="(driver, i) in data.drivers" :key="i">
                <!-- Skip first driver -->
                <div class="col-md-6 col-sm-12 ps-0 pe-1">
                  <div class="text-9 fw-500 text-secondary pb-1">{{t('dashboard-reservation.additional-driver')}} {{i+1}}</div>
                  <div class="text-9 fw-500 mb-2" style="color:#020918;">{{ driver.driver_name }}</div>
                  <div class="bordered-content px-3 py-3" style="border: 1px solid #dddddd; border-radius: 4px">
                    <div class="text-9 fw-400 row mx-0">
                      <div class="col-md-6 px-0">
                        <div class="text-9 fw-500" style="color: #020918;">{{t('form-fields.date-of-birth')}}:</div>
                      </div>
                      <div class="col-md-6">
                        <div class="text-9 fw-400" style="color: #020918;" v-if="locale == 'de'">{{moment(driver.date_of_birth).format('DD.MM.YYYY') }}</div>
                        <div class="text-9 fw-400" style="color: #020918;" v-else>{{moment(driver.date_of_birth).format('DD/MM/YYYY') }}</div>
                      </div>
                    </div>
                    <div class="text-9 fw-400 row mx-0">
                      <div class="col-md-6 px-0">
                        <div class="text-9 fw-500" style="color: #020918;">{{t('form-fields.driving-license-no')}}:
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="text-9 fw-400" style="color: #020918;">{{ driver.driving_license_no }}</div>
                      </div>
                    </div>
                    <div class="text-9 fw-400 row mx-0">
                      <div class="col-md-6 px-0">
                        <div class="text-9 fw-500" style="color: #020918;">{{t('form-fields.place-of-issue')}}:</div>
                      </div>
                      <div class="col-md-6">
                        <div class="text-9 fw-400" style="color: #020918;">{{ driver.place_of_issuance }}</div>
                      </div>
                    </div>
                    <div class="text-9 fw-400 row mx-0">
                      <div class="col-md-6 px-0">
                        <div class="text-9 fw-500" style="color: #020918;">{{t('form-fields.date-of-issue')}}:</div>
                      </div>
                      <div class="col-md-6">
                        <div class="text-9 fw-400" style="color: #020918;" v-if="driver.date_of_issue">
                          <span v-if="locale == 'de'">{{moment(driver.date_of_issue).format('DD.MM.YYYY') }}</span>
                          <span v-else>{{moment(driver.date_of_issue).format('DD/MM/YYYY') }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="text-9 fw-400 row mx-0">
                      <div class="col-md-6 px-0">
                        <div class="text-9 fw-500" style="color: #020918;">{{t('form-fields.due-date')}}:</div>
                      </div>
                      <div class="col-md-6">
                        <div class="text-9 fw-400" style="color: #020918;" v-if="driver.due_date">
                          <span v-if="locale == 'de'">{{moment(driver.due_date).format('DD.MM.YYYY') }}</span>
                          <span v-else>{{moment(driver.due_date).format('DD/MM/YYYY') }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
            <!-- Vehicle -->
            <div class="text-9 fw-500 mt-1 mb-2" style="color:#020918;">{{t('form-fields.vehicle')}}</div>
            <div class="bordered-content px-3 py-3" style="border: 1px solid #dddddd; border-radius: 4px">
              <div class="row">
                <div class="col-md-6 col-sm-12">
                  <div class="text-9 fw-400 row mx-0">
                    <div class="col-md-6 px-0">
                      <div class="text-9 fw-500" style="color: #020918;">{{t('FleetCreate.model')}}:</div>
                    </div>
                    <div class="col-md-6">
                      <div class="text-9 fw-400" style="color: #020918;">{{ data?.reservation?.model }}</div>
                    </div>
                  </div>
                  <div class="text-9 fw-400 row mx-0">
                    <div class="col-md-6 px-0">
                      <div class="text-9 fw-500" style="color: #020918;">{{t('FleetCreate.manufacturer')}}:</div>
                    </div>
                    <div class="col-md-6">
                      <div class="text-9 fw-400" style="color: #020918;">{{ data?.reservation?.manufactures_name }}
                      </div>
                    </div>
                  </div>
                  <div class="text-9 fw-400 row mx-0">
                    <div class="col-md-6 px-0">
                      <div class="text-9 fw-500" style="color: #020918;">{{t('FleetView.license-plate')}}:</div>
                    </div>
                    <div class="col-md-6">
                      <div class="text-9 fw-400" style="color: #020918;">{{ data?.reservation?.plateno }}</div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6 col-sm-12">
                  <div class="text-9 fw-400 row mx-0">
                    <div class="col-md-6 px-0">
                      <div class="text-9 fw-500" style="color: #020918;">{{t('FleetView.class')}}:</div>
                    </div>
                    <div class="col-md-6">
                      <div class="text-9 fw-400" style="color: #020918;">{{ data?.reservation.classname }}</div>
                    </div>
                  </div>
                  <div class="text-9 fw-400 row mx-0">
                    <div class="col-md-6 px-0">
                      <div class="text-9 fw-500" style="color: #020918;">{{t('FleetView.max-no-of-people')}}:</div>
                    </div>
                    <div class="col-md-6">
                      <div class="text-9 fw-400" style="color: #020918;">{{ data?.reservation?.max_of_people }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pick Up -->
            <div class="bordered-content px-3 py-3 my-3" style="border: 1px solid #dddddd; border-radius: 4px">
              <div class="row mx-0">
                <div class="col-md-8 col-sm-12">
                  <div class="text-9 fw-500 mt-3 mb-2" style="color:#020918;">{{t('form-fields.pick-up')}}</div>
                  <div class="text-9 fw-400 row mx-0">
                    <div class="col-md-7 px-0">
                      <div class="text-9 fw-500" style="color: #020918;">{{t('fuelLevelSettings.fuel-level')}}:</div>
                    </div>
                    <div class="col-md-5">
                      <div class="text-9 fw-400" style="color: #020918;">{{ data?.reservation.label_name }}</div>
                    </div>
                  </div>
                  <div class="text-9 fw-400 row mx-0">
                    <div class="col-md-7 px-0">
                      <div class="text-9 fw-500" style="color: #020918;">{{t('form-fields.km-at-pickup')}}:</div>
                    </div>
                    <div class="col-md-5">
                      <div class="text-9 fw-400" style="color: #020918;">{{ data?.reservation.km_at_pick_up }}</div>
                    </div>
                  </div>
                  <div class="text-9 fw-400 row mx-0">
                    <div class="col-md-7 px-0">
                      <div class="text-9 fw-500" style="color: #020918;">{{t('form-fields.damage-description')}}:</div>
                    </div>
                    <div class="col-md-5">
                      <div class="text-9 fw-400" style="color: #020918;">{{ data?.reservation.damages_content }}</div>
                    </div>
                  </div>
                </div>
                <div class="col-md-4 col-sm-12 text-center">
                  <div class="text-9 fw-500 mt-3 mb-2" style="color:#020918;">X: {{t('button.scratch')}} - O: {{t('button.dent')}}</div>
                  <div v-if="data?.reservation?.damages_art">
                    <img class="img-fluid" :src="data?.reservation?.damages_art" alt="" style="background: #f0f0f0;">
                  </div>
                  <div v-else>
                    <img :src="artImage" alt="" class="img-fluid py-1 px-2" style="background: #f0f0f0; ">
                  </div>
                </div>
                <div class="row d-flex align-items-center mt-3 pb-2">
                  <div class="col-md-9">
                    <div class="text-9 text-dark mb-3">{{t('form-fields.damage-description-text')}}</div>
                  </div>
                  <div class="col-md-3 pe-0">
                    <div class="w-100 text-center" style="border-bottom: 0.5px solid #CCCED1;">
                      <div v-if="data?.reservation?.singature" class="w-100">
                        <img :src="data.reservation.singature" alt="" class="img-fluid" style="max-height: 70px;">
                      </div>
                      <div v-else class="w-100">
                        <div v-if="form.singature">
                          <img :src="form.singature" alt="" class="img-fluid" style="max-height: 70px;">
                        </div>
                        <div v-else class="w-100">
                          <svg width="25" height="22" viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.4912 0.851847L3.64251 0.00166998C3.19106 -0.0257787 2.79951 0.288418 2.76928 0.702643L2.66095 2.18939H0.820311C0.368015 2.18939 0 2.52716 0 2.94229V21.2471C0 21.6622 0.368015 22 0.820311 22H11.4206C11.5125 22 11.6036 21.9655 11.6687 21.906L13.2689 20.4438C13.2852 20.447 13.3018 20.4495 13.3188 20.4505L16.0508 20.6182C16.4868 20.6446 16.8948 20.3191 16.924 19.9173L18.255 1.65336C18.2849 1.24344 17.9378 0.879252 17.4912 0.851847V0.851847ZM11.7722 20.8963V18.6548C11.7722 18.5956 11.8248 18.5473 11.8894 18.5473H14.3222L11.7722 20.8963ZM16.2225 19.8742C16.211 19.9392 16.1694 19.9726 16.0978 19.9743L13.9284 19.8412L15.4168 18.4812C15.4831 18.4206 15.5203 18.3383 15.5203 18.2525V2.94233C15.5203 2.5272 15.1523 2.18943 14.7 2.18943H11.0441C10.5896 2.18943 10.5896 2.83478 11.0441 2.83478H14.7C14.7647 2.83478 14.8172 2.88305 14.8172 2.94233V17.9019H11.8894C11.4371 17.9019 11.0691 18.2397 11.0691 18.6548V21.3547H0.820311C0.755717 21.3547 0.703123 21.3064 0.703123 21.2471V2.94233C0.703123 2.88305 0.755717 2.83478 0.820311 2.83478H9.17192C9.62646 2.83478 9.62646 2.18943 9.17192 2.18943H3.36562L3.4708 0.745752C3.48224 0.680744 3.52382 0.647402 3.59554 0.645638L17.4443 1.49577C17.5151 1.50627 17.5515 1.54443 17.5534 1.61026L16.2225 19.8742Z" fill="#B2B2B2" />
                            <path d="M12.5552 10.1846H2.9668C2.77264 10.1846 2.61523 10.329 2.61523 10.5072C2.61523 10.6854 2.77264 10.8299 2.9668 10.8299H12.5552C12.7494 10.8299 12.9068 10.6854 12.9068 10.5072C12.9068 10.329 12.7494 10.1846 12.5552 10.1846Z" fill="#B2B2B2" />
                            <path d="M12.5552 12.4341H2.9668C2.77264 12.4341 2.61523 12.5786 2.61523 12.7568C2.61523 12.935 2.77264 13.0794 2.9668 13.0794H12.5552C12.7494 13.0794 12.9068 12.935 12.9068 12.7568C12.9068 12.5786 12.7494 12.4341 12.5552 12.4341Z" fill="#B2B2B2" />
                            <path d="M2.61523 8.25773C2.61523 8.43593 2.77264 8.5804 2.9668 8.5804H12.5552C12.7494 8.5804 12.9068 8.43593 12.9068 8.25773C12.9068 8.07953 12.7494 7.93506 12.5552 7.93506H2.9668C2.77264 7.93506 2.61523 8.07953 2.61523 8.25773Z" fill="#B2B2B2" />
                            <path d="M4.30273 6.00871C4.30273 6.18691 4.46014 6.33138 4.6543 6.33138H10.8646C11.0588 6.33138 11.2162 6.18691 11.2162 6.00871C11.2162 5.83051 11.0588 5.68604 10.8646 5.68604H4.6543C4.46014 5.68604 4.30273 5.83051 4.30273 6.00871V6.00871Z" fill="#B2B2B2" />
                            <path d="M9.12978 18.864C8.49749 18.8655 7.86519 18.8668 7.2329 18.8677C7.02037 18.868 6.80788 18.8682 6.5954 18.8684C6.21032 18.8686 5.95087 18.7977 5.86462 18.4089C5.79168 18.0802 5.28506 18.1244 5.18662 18.4089C4.94334 19.1118 4.54097 18.8364 4.31559 18.3636C4.09073 17.8919 4.03308 17.3641 3.93487 16.8621C3.86269 16.4933 3.25491 16.5967 3.24431 16.9479C3.23034 17.4104 3.18328 17.8656 3.05536 18.3142C2.92341 18.7771 2.72564 19.2219 2.52933 19.6641C2.35819 20.0496 3.03872 20.2155 3.20733 19.8357C3.38128 19.4438 3.55547 19.0498 3.68512 18.6433C3.92606 19.1751 4.42453 19.7766 5.13482 19.4221C5.26696 19.3561 5.39038 19.2624 5.49871 19.1531C5.86809 19.5448 6.41788 19.514 6.93233 19.5134C7.66485 19.5125 8.39736 19.5111 9.12988 19.5093C9.58217 19.5082 9.58302 18.8629 9.12978 18.864V18.864Z" fill="#B2B2B2" />
                            <path d="M23.7166 10.5889C23.5339 10.422 23.2828 10.3365 23.0278 10.3301L22.7621 10.3313V9.87017C22.7621 9.58927 22.5803 9.2925 22.3199 9.14472V8.49516C22.3199 7.15848 20.0525 7.16429 20.0525 8.50144V9.15109C19.7872 9.30158 19.6093 9.57017 19.6093 9.87611V10.3486C18.439 10.4217 18.4357 12.0585 19.6106 12.1225C19.6181 13.567 19.6177 14.9878 19.6093 16.4565C19.607 16.8615 20.31 16.8853 20.3124 16.4599C20.3208 14.99 20.3212 13.5679 20.3137 12.1222L22.058 12.1142C22.058 12.1142 22.0558 16.8833 22.0558 19.0317C22.0558 20.0787 20.3111 20.0857 20.3111 19.0208L20.3117 18.4323C20.3392 18.0159 19.6373 17.977 19.6099 18.3935V18.9456C19.6099 19.4189 19.7693 19.8197 20.0781 20.1016C20.1055 20.7768 20.4155 21.4301 20.9391 21.9067C21.0893 22.0435 21.2973 22.0017 21.4427 21.8988C21.9755 21.409 22.2756 20.7633 22.2944 20.0741C22.5265 19.8619 22.7588 19.6483 22.7588 18.9169L22.7591 15.9762C23.3671 16.135 24.001 15.7031 24.001 15.1181V11.2171C24.001 10.9795 23.9 10.7564 23.7166 10.5889V10.5889ZM20.3124 10.3425V9.87607C20.3124 9.7806 20.3838 9.70053 20.4799 9.67674L21.8873 9.67033C21.9267 9.67928 21.963 9.69636 21.9924 9.72329C22.0353 9.76249 22.0589 9.81463 22.0589 9.87017V10.3346L20.3124 10.3425ZM21.1876 8.10528C21.4034 8.10528 21.6167 8.29949 21.6167 8.49516V9.01858L20.7555 9.02249V8.50144C20.7556 8.28404 20.9493 8.10636 21.1876 8.10528V8.10528ZM21.1871 21.18C21.0236 20.9674 20.9054 20.7269 20.8394 20.4742C20.9482 20.4958 21.0585 20.5071 21.1688 20.5071C21.2919 20.5071 21.415 20.4931 21.5362 20.4659C21.4718 20.7225 21.3538 20.9644 21.1871 21.18ZM23.2979 15.1181C23.2979 15.4236 22.7611 15.4477 22.7611 15.1237C22.7611 15.1237 22.7617 12.0702 22.7621 11.7903C22.7623 11.6098 22.5988 11.4673 22.4078 11.4673L19.6708 11.4797C19.3313 11.4797 19.3393 10.9923 19.6743 10.9907L23.0312 10.9755C23.1936 10.9882 23.2824 11.0687 23.2978 11.2171V15.1181H23.2979Z" fill="#B2B2B2" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div class="text-9 fw-400 pt-2 text-center">{{data?.customerinfo?.full_name}}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bordered-content px-3 py-3 my-3" style="border: 1px solid #dddddd; border-radius: 4px">
              <div class="row mx-0">
                <div class="col-md-8 col-sm-12">
                  <div class="text-9 fw-500 mt-3 mb-2" style="color:#020918;">{{t('form-fields.return')}}</div>
                  <div class="text-9 fw-400 row mx-0">
                    <div class="col-md-7 px-0">
                      <div class="text-9 fw-500" style="color: #020918;">{{t('form-fields.location')}}:</div>
                    </div>
                    <div class="col-md-5">
                      <div class="text-9 fw-400" style="color: #020918;">{{data?.reservation?.return_locationname}},
                        {{data?.reservation?.return_street}}, {{data?.reservation?.return_postcode}},
                        {{data?.reservation?.return_city}},{{data?.reservation?.return_country}} </div>
                    </div>
                  </div>
                  <div class="text-9 fw-400 row mx-0">
                    <div class="col-md-7 px-0">
                      <div class="text-9 fw-500" style="color: #020918;">{{t('form-fields.date')}}:</div>
                    </div>
                    <div class="col-md-5">
                      <div class="text-9 fw-400" style="color: #020918;" v-if="data?.reservation?.actual_end_date">
                        <span v-if="locale == 'de'">
                          {{moment(data?.reservation?.actual_end_date).format('DD.MM.YYYY') }} {{moment(data?.reservation?.actual_end_time, "HH:mm:ss").format('HH:mm') }}
                        </span>
                        <span v-else>
                          {{moment(data?.reservation?.actual_end_date).format('DD/MM/YYYY') }} {{moment(data?.reservation?.actual_end_time, "HH:mm:ss").format('h:mm A') }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="text-9 fw-400 row mx-0">
                    <div class="col-md-7 px-0">
                      <div class="text-9 fw-500" style="color: #020918;">{{t('fuelLevelSettings.fuel-level')}}:</div>
                    </div>
                    <div class="col-md-5">
                      <div class="text-9 fw-400" style="color: #020918;">{{data?.reservation?.fuel_returnlabel}}</div>
                    </div>
                  </div>
                  <div class="text-9 fw-400 row mx-0">
                    <div class="col-md-7 px-0">
                      <div class="text-9 fw-500" style="color: #020918;">{{t('form-fields.km-at-return')}}:</div>
                    </div>
                    <div class="col-md-5">
                      <div class="text-9 fw-400" style="color: #020918;">{{data?.reservation?.km_at_return}}</div>
                    </div>
                  </div>
                  <div class="text-9 fw-400 row mx-0">
                    <div class="col-md-7 px-0">
                      <div class="text-9 fw-500" style="color: #020918;">{{t('form-fields.damage-description')}}:</div>
                    </div>
                    <div class="col-md-5">
                      <div class="text-9 fw-400" style="color: #020918;">{{data?.reservation?.return_content}}</div>
                    </div>
                  </div>

                </div>
                <div class="col-md-4 col-sm-12 text-center">
                  <div class="text-9 fw-500 mt-3 mb-2" style="color:#020918;">X: {{t('button.scratch')}} - O: {{t('button.dent')}}</div>
                  <div v-if="data?.reservation?.return_art">
                    <img class="img-fluid" :src="data?.reservation?.return_art" alt="" style="background: #f0f0f0;">
                  </div>
                  <div v-else>
                    <img :src="artImage" alt="" class="img-fluid py-1 px-2" style="background: #f0f0f0; ">
                  </div>
                </div>
              </div>
              <div class="row d-flex align-items-center mt-3">
                <div class="col-md-8">
                  <div class="text-9 fw-500 mt-3 mb-2" style="color:#020918;">{{t('form-fields.return-confirmation')}}:
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="" style="border-bottom: 0.5px solid #CCCED1;">
                    <div v-if="data?.reservation?.return_singature">
                      <img :src="data.reservation.return_singature" alt="" class="img-fluid" style="max-height: 70px;">
                    </div>
                    <div v-else>
                      <div v-if="finalForm.return_singature">
                        <img :src="finalForm.return_singature" alt="" class="img-fluid" style="max-height: 70px;">
                      </div>
                    </div>
                  </div>
                  <div class="text-9 fw-400 pt-2 text-center"> {{data?.customerinfo?.full_name}} </div>
                </div>
              </div>

            </div>
          </div>
          <div class="col-md-5 col-sm-12">
            <table class="table table-striped text-9 w-100 info-table">
              <thead style="background: #000000;">
                <tr>
                  <th scope="col" style="color:#fff;">{{t('dashboard-reservation.details')}}</th>
                  <th scope="col text-end" style="color:#fff; text-align:right">{{t('form-fields.amount')}}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{t('form-fields.rental-price-per-hour')}}</td>
                  <td class="text-end">{{ moneyFormat(data?.reservation?.per_hour_rate, locale) }} </td>
                </tr>
                <tr>
                  <td>{{t('form-fields.rental-period')}}</td>
                  <td class="text-end">{{ parseInt(data?.reservation?.rental_hours / 24) }} Days {{
                  parseInt(data?.reservation?.rental_hours % 24) }} Hours</td>
                </tr>
                <tr>
                  <td>{{t('form-fields.included-km')}}</td>
                  <td class="text-end">{{ data?.reservation?.km_included }}Km</td>
                </tr>
                <tr>
                  <td>{{t('form-fields.additional-km')}}</td>
                  <td class="text-end">{{data?.reservation?.km_return}} <span v-if="data?.reservation?.km_return">km</span></td>
                </tr>
                <tr>
                  <td>{{t('form-fields.charges-for-additional-km')}}</td>
                  <td class="text-end"><span>
                      {{moneyFormat(data?.reservation?.cost_per_extra_km, locale)}}</span></td>
                </tr>
                <tr>
                  <td>{{t('form-fields.pick-up/return-fee')}}</td>
                  <td class="text-end">{{moneyFormat(data?.reservation?.pick_up_fee, locale)}} </td>
                </tr>
                <tr>
                  <td>{{t('form-fields.refueling-fee')}}</td>
                  <td class="text-end">{{moneyFormat(data?.reservation?.refueling_fee, locale)}}</td>
                </tr>
                <tr>
                  <td>{{t('form-fields.charges-for-extras')}}</td>
                  <td class="text-end">{{moneyFormat(data?.reservation?.charges_for_extras, locale)}}</td>
                </tr>
                <tr>
                  <td>{{t('form-fields.out-of-hours-fee')}}</td>
                  <td class="text-end">{{moneyFormat(data?.reservation?.out_of_hours_fee, locale)}} </td>
                </tr>
                <tr>
                  <td>{{t('form-fields.discount')}}</td>
                  <td class="text-end">{{data?.reservation?.discount}} %</td>
                </tr>
                <tr>
                  <td>{{t('form-fields.vat')}} (19%):</td>
                  <td class="text-end">{{moneyFormat(data?.reservation?.vat_amount, locale)}}</td>
                </tr>
              </tbody>
              <thead style="background: #000000;">
                <tr>
                  <th scope="col text-white" style="color: white">{{t('form-fields.total')}}</th>
                  <th scope="col text-white text-end" style="color: white; text-align: end;">
                    {{moneyFormat(data?.reservation?.vat_amount + data?.reservation?.total_without_vat, locale)}} </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td scope="col">{{t('form-fields.total-amount-paid')}}</td>
                  <td scope="col text-end" style="text-align: end;">{{moneyFormat(data?.reservation?.total_amount_paid,
                  locale)}} </td>
                </tr>
              </tbody>
              <thead style="background: #000000;">
                <tr>
                  <th scope="col text-white" style="color: white">{{t('form-fields.to-pay')}}</th>
                  <th scope="col text-white text-end" style="color: white; text-align: end;">
                    {{moneyFormat(data?.reservation?.to_pay, locale)}} </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td scope="col">{{t('form-fields.payment-method')}}</td>
                  <td scope="col text-end" style="text-align: end;">{{data?.reservation?.payment_method}}</td>
                </tr>
                <tr>
                  <td scope="col">{{t('form-fields.deposit')}}</td>
                  <td scope="col text-end" style="text-align: end;">{{moneyFormat(data?.reservation?.deposit, locale)}}
                  </td>
                </tr>
                <tr>
                  <td scope="col">{{t('form-fields.deposit-payment-method')}}</td>
                  <td scope="col text-end" style="text-align: end;">{{data?.reservation?.payment_method_for_deposit}}
                  </td>
                </tr>
                <tr>
                  <td scope="col">{{t('form-fields.deductible-fire/theft')}}</td>
                  <td scope="col text-end" style="text-align: end;">
                    {{moneyFormat(data?.reservation?.deductible_fire_theft, locale)}}</td>
                </tr>
                <tr>
                  <td scope="col">{{t('form-fields.deductible-damage')}}</td>
                  <td scope="col text-end" style="text-align: end;">{{moneyFormat(data?.reservation?.deductible_damage,
                  locale)}} </td>
                </tr>
                <tr>
                  <td scope="col">{{t('form-fields.deductible-liability')}}</td>
                  <td scope="col text-end" style="text-align: end;">
                    {{moneyFormat(data?.reservation?.deductible_liability, locale)}} </td>
                </tr>
                <tr>
                  <td scope="col">{{t('form-fields.withheld-deductible')}}</td>
                  <td scope="col text-end" style="text-align: end;">
                    {{moneyFormat(data?.reservation?.withheld_deductible, locale)}}</td>
                </tr>
              </tbody>
            </table>
            <div class="py-3 text-9 fw-400" style="color: #353A46">{{t('form-fields.conditional-text')}}</div>
            <div class="d-flex align-items-center justify-content-center w-100 mt-1 mb-4">
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_3585_2144)">
                  <g opacity="0.78">
                    <path d="M11.809 24.2166C11.5041 24.2164 11.2112 24.3355 10.9928 24.5482C10.7744 24.7609 10.6477 25.0506 10.6398 25.3554V30.7781C10.6477 31.0829 10.7744 31.3725 10.9928 31.5853C11.2112 31.798 11.5041 31.917 11.809 31.9169H25.0209L17.3042 24.2166H11.809Z" fill="black" />
                    <path d="M37.6015 30.6916V24.2166H31.1101L37.6015 30.6916Z" fill="black" />
                    <path d="M43.6042 24.2166H39.1613V31.9216H43.6042C43.7534 31.9222 43.9012 31.8931 44.039 31.836C44.1768 31.7788 44.3018 31.6948 44.4068 31.5887C44.5117 31.4827 44.5945 31.3568 44.6502 31.2184C44.7059 31.08 44.7335 30.9319 44.7313 30.7828V25.3624C44.7338 25.2128 44.7065 25.0642 44.651 24.9253C44.5954 24.7864 44.5128 24.6599 44.4079 24.5533C44.303 24.4466 44.1779 24.3619 44.0399 24.3041C43.9019 24.2463 43.7538 24.2165 43.6042 24.2166Z" fill="black" />
                    <path d="M47.8016 8.19846C42.8898 3.29631 36.3287 0.398644 29.3969 0.0701469C22.4652 -0.25835 15.6594 2.00586 10.306 6.42153C4.95265 10.8372 1.43515 17.088 0.439042 23.9556C-0.557062 30.8233 1.0396 37.8158 4.91787 43.5705C8.79614 49.3251 14.6781 53.4296 21.4176 55.084C28.157 56.7384 35.271 55.8242 41.3732 52.5196C47.4753 49.2149 52.1284 43.7566 54.4257 37.2083C56.7229 30.6601 56.4998 23.4911 53.7996 17.0984C52.3961 13.771 50.359 10.7482 47.8016 8.19846ZM28 50.2522C23.8448 50.2515 19.7727 49.0875 16.2449 46.8919C12.7171 44.6963 9.87438 41.5569 8.0387 37.8291C6.20303 34.1013 5.4477 29.934 5.85821 25.7991C6.26872 21.6641 7.82869 17.7267 10.3615 14.4326L41.5698 45.6339C37.6857 48.639 32.9109 50.2641 28 50.2522ZM45.6409 41.5698L14.4326 10.3662C18.715 7.07001 24.0505 5.44487 29.4432 5.79409C34.8359 6.1433 39.9173 8.443 43.7388 12.2639C47.5603 16.0848 49.8607 21.1658 50.2107 26.5585C50.5608 31.9511 48.9364 37.2869 45.6409 41.5698Z" fill="#E01100" />
                    <path d="M40.7233 21.9412C41.233 22.2407 41.7213 22.5751 42.1848 22.942C42.2276 22.9761 42.2778 22.9996 42.3314 23.0106C42.385 23.0216 42.4404 23.0196 42.4931 23.005C42.5458 22.9904 42.5943 22.9636 42.6346 22.9266C42.6749 22.8896 42.7059 22.8436 42.725 22.7924C42.7437 22.7456 42.753 22.7105 42.7601 22.6988C43.1459 21.1882 42.5005 19.5537 41.5114 18.4102C40.5222 17.2667 39.173 16.4787 37.7863 15.8754C37.0567 15.5574 36.3084 15.2768 35.5671 14.9938C34.8773 14.7366 34.0893 14.5121 33.4626 14.1263C33.4146 14.0973 33.3604 14.0805 33.3045 14.0772C33.2486 14.0738 33.1928 14.0841 33.1417 14.1071C33.0907 14.1301 33.046 14.1651 33.0114 14.2092C32.9769 14.2532 32.9536 14.305 32.9435 14.3601C32.9435 14.3882 32.9318 14.5331 32.9318 14.5939C32.9622 15.9292 33.7712 17.1826 34.6692 18.1132C35.5944 19.0262 36.6554 19.7906 37.8143 20.3791L38.0482 20.5054C38.9485 20.9801 39.8558 21.4221 40.7233 21.9412Z" fill="black" />
                  </g>
                </g>
                <defs>
                  <clipPath id="clip0_3585_2144">
                    <rect width="56" height="56" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <div>
              <span class="fw-400 text-9">{{t('form-fields.issued-by')}} </span>
              <span class="text-14 text-dark-black ms-2" v-if="data?.reservation?.create_name">{{data?.reservation?.create_name}}</span>
              <span class="text-14 text-dark-black ms-2" v-else>{{t('dashboard-reservation.former-employee')}}</span>
            </div>
          </div>
        </div>
        <div class="page-footer py-2 text-center">
          <div class="text-9 text-light-gray fw-500 text-center">{{t('dashboard-invoice.page')}} 1/3</div>
        </div>
      </div>
      <div class="borderd-content my-3 text-dark text-9 fw-500">
        <!-- <div class="row">
          <div class="col-md-6">
            <div class="borderd-content my-3" style="height: 142px;">
              <div class="d-flex align-items-center justify-content-center w-100 h-100">
                <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_3585_2144)">
                    <g opacity="0.78">
                      <path d="M11.809 24.2166C11.5041 24.2164 11.2112 24.3355 10.9928 24.5482C10.7744 24.7609 10.6477 25.0506 10.6398 25.3554V30.7781C10.6477 31.0829 10.7744 31.3725 10.9928 31.5853C11.2112 31.798 11.5041 31.917 11.809 31.9169H25.0209L17.3042 24.2166H11.809Z" fill="black" />
                      <path d="M37.6015 30.6916V24.2166H31.1101L37.6015 30.6916Z" fill="black" />
                      <path d="M43.6042 24.2166H39.1613V31.9216H43.6042C43.7534 31.9222 43.9012 31.8931 44.039 31.836C44.1768 31.7788 44.3018 31.6948 44.4068 31.5887C44.5117 31.4827 44.5945 31.3568 44.6502 31.2184C44.7059 31.08 44.7335 30.9319 44.7313 30.7828V25.3624C44.7338 25.2128 44.7065 25.0642 44.651 24.9253C44.5954 24.7864 44.5128 24.6599 44.4079 24.5533C44.303 24.4466 44.1779 24.3619 44.0399 24.3041C43.9019 24.2463 43.7538 24.2165 43.6042 24.2166Z" fill="black" />
                      <path d="M47.8016 8.19846C42.8898 3.29631 36.3287 0.398644 29.3969 0.0701469C22.4652 -0.25835 15.6594 2.00586 10.306 6.42153C4.95265 10.8372 1.43515 17.088 0.439042 23.9556C-0.557062 30.8233 1.0396 37.8158 4.91787 43.5705C8.79614 49.3251 14.6781 53.4296 21.4176 55.084C28.157 56.7384 35.271 55.8242 41.3732 52.5196C47.4753 49.2149 52.1284 43.7566 54.4257 37.2083C56.7229 30.6601 56.4998 23.4911 53.7996 17.0984C52.3961 13.771 50.359 10.7482 47.8016 8.19846ZM28 50.2522C23.8448 50.2515 19.7727 49.0875 16.2449 46.8919C12.7171 44.6963 9.87438 41.5569 8.0387 37.8291C6.20303 34.1013 5.4477 29.934 5.85821 25.7991C6.26872 21.6641 7.82869 17.7267 10.3615 14.4326L41.5698 45.6339C37.6857 48.639 32.9109 50.2641 28 50.2522ZM45.6409 41.5698L14.4326 10.3662C18.715 7.07001 24.0505 5.44487 29.4432 5.79409C34.8359 6.1433 39.9173 8.443 43.7388 12.2639C47.5603 16.0848 49.8607 21.1658 50.2107 26.5585C50.5608 31.9511 48.9364 37.2869 45.6409 41.5698Z" fill="#E01100" />
                      <path d="M40.7233 21.9412C41.233 22.2407 41.7213 22.5751 42.1848 22.942C42.2276 22.9761 42.2778 22.9996 42.3314 23.0106C42.385 23.0216 42.4404 23.0196 42.4931 23.005C42.5458 22.9904 42.5943 22.9636 42.6346 22.9266C42.6749 22.8896 42.7059 22.8436 42.725 22.7924C42.7437 22.7456 42.753 22.7105 42.7601 22.6988C43.1459 21.1882 42.5005 19.5537 41.5114 18.4102C40.5222 17.2667 39.173 16.4787 37.7863 15.8754C37.0567 15.5574 36.3084 15.2768 35.5671 14.9938C34.8773 14.7366 34.0893 14.5121 33.4626 14.1263C33.4146 14.0973 33.3604 14.0805 33.3045 14.0772C33.2486 14.0738 33.1928 14.0841 33.1417 14.1071C33.0907 14.1301 33.046 14.1651 33.0114 14.2092C32.9769 14.2532 32.9536 14.305 32.9435 14.3601C32.9435 14.3882 32.9318 14.5331 32.9318 14.5939C32.9622 15.9292 33.7712 17.1826 34.6692 18.1132C35.5944 19.0262 36.6554 19.7906 37.8143 20.3791L38.0482 20.5054C38.9485 20.9801 39.8558 21.4221 40.7233 21.9412Z" fill="black" />
                    </g>
                  </g>
                  <defs>
                    <clipPath id="clip0_3585_2144">
                      <rect width="56" height="56" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="borderd-content my-3 text-center" style="width: 100%; height: 142px;">

            </div>
          </div>
        </div> -->
        <div>
          <span class="text-14 fw-500 mt-3">{{t('contract.general-conditions-of-contract')}} -
            {{generalInfo?.compnay_name}}: </span><br />
          <div class="mt-3">{{generalInfo?.compnay_name}} Gmbh <span>{{t('contract.paragraph-1-part-1')}}</span>
            ( <span v-if="data?.customerinfo?.name_title == 'Mrs.' || data?.customerinfo?.name_title == 'Frau'">{{t('home-booking-request-form.mrs')}}</span>
            <span v-if="data?.customerinfo?.name_title == 'Mr.' || data?.customerinfo?.name_title == 'Herr'">{{t('home-booking-request-form.mr')}}</span>
            {{data?.customerinfo?.first_name}} {{data?.customerinfo?.last_name}})
            <span>{{t('contract.paragraph-1-part-2')}}</span>
          </div> <br />
          <div class="mb-1">I <span class="ms-3">{{t('contract.general')}}</span></div> <br />
          <div class="ps-3 w-100">
            <div class="d-flex">a) <div class="ps-3">{{t('contract.paragraph-2')}}</div>
            </div> <br />
            <div class="d-flex">b) <div class="ps-3">{{t('contract.paragraph-3')}}</div>
            </div> <br />
            <div class="d-flex">c) <div class="ps-3">{{t('contract.paragraph-4')}}</div>
            </div> <br />
            <div class="d-flex">d) <div class="ps-3">{{t('contract.paragraph-5')}}</div>
            </div> <br />
            <div class="d-flex">e) <div class="ps-3">{{t('contract.paragraph-6')}}</div>
            </div> <br />
            <div class="d-flex">f) <div class="ps-3">{{t('contract.paragraph-7')}}</div>
            </div> <br />
            <div class="d-flex">g) <div class="ps-3">{{t('contract.paragraph-8')}}</div>
            </div> <br />
            <div class="d-flex">h) <div class="ps-3">{{t('contract.paragraph-9')}}</div>
            </div> <br />
          </div>
          <div class="d-flex mb-1">II <span class="ms-3">{{t('contract.rental-price-and-deposit')}}</span></div> <br />
          <div class="ps-3 w-100">{{t('contract.paragraph-10')}}</div> <br />
          <div class="mb-1">III <span class="ms-3">{{t('contract.authorized-drivers')}}</span> </div> <br />
          <div class="ps-3 w-100">{{t('contract.paragraph-11')}}</div> <br />
          <div class="mb-1">IV <span class="ms-3">{{t('contract.vehicle-use')}}</span> </div><br />
          <div class="ps-3 w-100">
            <div class="d-flex">a) <div class="ps-3">{{t('contract.paragraph-12')}}</div>
            </div> <br />
            <div class="d-flex">b) <div class="ps-3">{{t('contract.paragraph-13')}}</div>
            </div> <br />
            <div class="d-flex">c) <div class="ps-3">{{t('contract.paragraph-14')}}</div>
            </div> <br />
          </div>
          <div class="mb-1">V <span class="ms-3">{{t('contract.insurance-and-liability')}}</span></div> <br />
          <div class="ps-3 w-100">
            <div class="d-flex">a) <div class="ps-3">{{t('contract.paragraph-15')}}</div>
            </div> <br />
            <div class="d-flex">b) <div class="ps-3">{{t('contract.paragraph-16')}}</div>
            </div> <br />
            <div class="d-flex">c) <div class="ps-3">{{t('contract.paragraph-17')}}</div>
            </div> <br />
            <span class="ps-3 ms-1">{{t('contract.paragraph-18')}}</span> <br />
            <div class="ps-3 ms-3">
              • <span>{{t('contract.paragraph-19')}}</span> <br />
              • <span>{{t('contract.paragraph-20')}}</span> <br />
              • <span>{{t('contract.paragraph-21')}}</span> <br />
              • <span>{{t('contract.paragraph-22')}}</span> <br />
              • <span>{{t('contract.paragraph-23')}}</span> <br />
              • <span>{{t('contract.paragraph-24')}}</span> <br />
              • <span>{{t('contract.paragraph-25')}}</span> <br />
            </div>
            <div class="ps-3 ms-1">{{t('contract.paragraph-16')}}</div> <br />
          </div>

          <div class="page-footer py-2 text-center">
            <div class="text-9 text-light-gray fw-500 text-center">{{t('dashboard-invoice.page')}} 2/4</div>
          </div>
        </div>
      </div>
      <div class="borderd-content mt-3 text-dark text-9 fw-500">
        <div>
          <div class="ps-3 ms-3">
            <span>{{t('contract.paragraph-27')}}</span> <br />
            <div class="ps-3 ms-3">
              • <span>{{t('contract.paragraph-28')}}</span> <br />
              • <span>{{t('contract.paragraph-29')}}</span> <br />
              • <span>{{t('contract.paragraph-30')}}</span> <br />
              • <span>{{t('contract.paragraph-31')}}</span> <br />
            </div>
            <div class="d-flex">d) <div class="ps-3">{{t('contract.paragraph-32')}}</div> <br /></div>
          </div>
          <div class="d-flex mb-1">VI <span class="ms-3">{{t('contract.liability-of-lessor')}}</span></div> <br />
          <div class="ps-3">{{t('contract.paragraph-33')}}</div> <br />

          <div class="d-flex mb-1">VII <span class="ms-3">{{t('contract.vehicle-return')}}</span></div> <br />
          <div class="ps-3">{{t('contract.paragraph-34')}}</div> <br />
          <div class="ps-3">{{t('contract.paragraph-35')}}</div> <br />

          <div class="d-flex mb-1">VIII <span class="ms-3">{{t('contract.non-fulfillment')}}</span></div> <br />
          <div class="ps-3">{{t('contract.paragraph-36')}}</div> <br />

          <div class="d-flex mb-1">XI <span class="ms-3">{{t('contract.data-storage-terms')}}</span></div> <br />
          <div class="ps-3">{{t('contract.paragraph-37')}}</div> <br />
          <div class="ps-3">{{t('contract.paragraph-38')}}</div> <br />

          <div class="d-flex mb-1">X <span class="ms-3">{{t('contract.users-right')}}</span></div> <br />
          <div class="ps-3">{{t('contract.paragraph-39')}}</div> <br />
          <div class="ps-3" v-if="locale == 'en'">
            Request further information regarding the content of this information, access personal data, obtain its
            rectification or erasure or the restriction of processing concerning him (in the cases provided for by law),
            object to processing (in the cases provided for by law); data portability (in the cases provided for by
            law); revocation of consent, if any. Withdrawal of consent does not affect the lawfulness of the processing
            based on the consent given before the withdrawal. Propose a complaint to the supervisory authority (data
            protection guarantor). <br />
            In relation to the processing of personal data concerning him, as described above, the Customer freely
            expresses his consent in accordance with and for the purposes of the law. If any provision of this Lease is
            void, such voidness shall not determine the invalidity of the other provisions of this Lease. <br />
            If the Customer decides to pay in a currency other than the one in which the rental costs were stated, the
            equivalent will be calculated using the exchange rate published by the Bundesbank plus 4% as reimbursement
            of bank charges and commissions and exchange rate risk. <br />
            For the processing of personal data for the sending of promotional materials and their use in the context of
            analysis and commercial studies and consumption habits, in accordance with the information provided in
            Article 10 (Privacy) point 2 of this contract. <br />
            After reading the Privacy Policy and the General Rental Conditions, the Customer declares to expressly
            approve all the clauses. <br />
          </div>
          <div class="ps-3" v-if="locale == 'de'">
            Fordern Sie weitere Informationen in Bezug auf den Inhalt dieser Informationen an, greifen Sie auf
            personenbezogene Daten zu, erhalten Sie deren Berichtigung oder Löschung oder die Einschränkung der ihn
            betreffenden Verarbeitung (in den gesetzlich vorgesehenen Fällen), lehnen Sie die Verarbeitung ab (in die
            gesetzlich vorgesehenen Fälle); Datenübertragbarkeit (in den gesetzlich vorgesehenen Fällen); gegebenenfalls
            Widerruf der Einwilligung. Der Widerruf der Einwilligung berührt nicht die Rechtmäßigkeit der Verarbeitung
            auf der Grundlage der vor dem Widerruf erteilten Einwilligung. Schlagen Sie eine Beschwerde bei der
            Aufsichtsbehörde (Datenschutzgarant) vor. <br />
            In Bezug auf die Verarbeitung der ihn betreffenden personenbezogenen Daten, wie oben beschrieben, drückt der
            Kunde seine Zustimmung gemäß und für die Zwecke des Gesetzes frei aus. Wenn eine Bestimmung dieses
            Mietvertrags nichtig ist, entscheidet diese Nichtigkeit nicht über die Ungültigkeit der anderen Bestimmungen
            dieses Mietvertrags. <br />
            Wenn der Kunde beschließt, in einer anderen Währung als der zu zahlen, in der die Mietkosten angegeben
            wurden, wird der Gegenwert anhand des von der Bundesbank veröffentlichten Wechselkurses zuzüglich 4% als
            Erstattung der Bankgebühren und Provisionen sowie des Wechselkursrisikos berechnet. <br />
            Zur Verarbeitung personenbezogener Daten für den Versand von Werbematerial und deren Verwendung im Rahmen
            von Analysen und kommerziellen Studien sowie von Konsumgewohnheiten gemäß den Informationen in Artikel 10
            (Datenschutz) Punkt 2 dieses Vertrags. <br />
            Nach dem Lesen der Datenschutzrichtlinie und der Allgemeinen Mietbedingungen erklärt der Kunde, alle
            Klauseln ausdrücklich zu genehmigen. <br />
          </div>

          <div class="mt-5 py-5">
            <div class="d-flex flex-column align-items-end">
              Roadstars GmbH <br />
              Kaiser-Friedrich-Straße 65 <br />
              10627 Berlin, Germany <br />
              030/91439989 <br />
              info@roadstars-cars.de <br />
              {{t('form-fields.tax-no')}} : {{generalInfo.tax_no}} <br />
            </div>
          </div>

          <div class="page-footer py-2 text-center">
            <div class="text-9 text-light-gray fw-500 text-center">{{t('dashboard-invoice.page')}} 3/3</div>
          </div>
        </div>
      </div>
      <!-- <div class="borderd-content my-3 text-dark text-9 fw-500">
        <div>



          <div class="mt-5 py-5">
            <div class="d-flex flex-column align-items-end">
              Roadstars GmbH <br />
              Kaiser-Friedrich-Straße 65 <br />
              10627 Berlin, Germany <br />
              030/91439989 <br />
              info@roadstars-cars.de <br />
              {{t('form-fields.tax-no')}} : {{generalInfo.tax_no}} <br />
            </div>
          </div>

          <div class="page-footer py-2 text-center">
            <div class="text-9 text-light-gray fw-500 text-center">{{t('dashboard-invoice.page')}} 3/3</div>
          </div>
        </div>
      </div> -->
      <!-- <div class="borderd-content my-3 text-dark text-9 fw-500">
        <div>
          a) The rented vehicles are insured with a maximum coverage for personal injury and property damage with a
          total amount of EUR 8 million. The liability insurance cover only includes
          property damage, personal injury and pure financial losses of third parties that occur during the operation of
          the vehicle, but not damage to the rented vehicle and to objects that the
          lessee or third parties have brought into the vehicle. The provisions of the VVG and the AKB apply accordingly
          to the insurance cover and the benefits, insofar as these do not already
          apply directly from the contract. <br />
          b) Without inclusion, there is no vehicle insurance cover for the vehicles in the form of partial or full
          insurance, which covers direct damage, i.e. damage, destruction or loss of the rented
          motor vehicle or parts thereof. This can be included against inclusion of a fully comprehensive insurance with
          a respective agreed deductible. <br />

          <div class="page-footer py-2 text-center " style="margin-top: 3rem">
            <div class="text-9 text-light-gray fw-500 text-center">Page 4/4</div>
          </div>
        </div>
      </div> -->
    </div>

    <div class="mb-4 px-4" style="width: 350px; margin-left: 60px;">
      <div class="btn-section w-100">
        <div v-if="data?.reservation?.reservation_status == 'Completed'">

          <!-- Create Invoice -->
          <button @click="$router.push(`/rechnung/erstellen?reservationId=${data.reservation.id}`)" class="btn contract-btn btn-secondary text-white  mb-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V9L13 2Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M13 2V9H20" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="ps-3 fw-500 primary text-white">{{t('dashboard-invoice.create-invoice')}}</span>
          </button>

          <!-- Print -->
          <PrimaryButton @click="print" class="btn contract-btn mb-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9V2H18V9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M6 18H4C3.46957 18 2.96086 17.7893 2.58579 17.4142C2.21071 17.0391 2 16.5304 2 16V11C2 10.4696 2.21071 9.96086 2.58579 9.58579C2.96086 9.21071 3.46957 9 4 9H20C20.5304 9 21.0391 9.21071 21.4142 9.58579C21.7893 9.96086 22 10.4696 22 11V16C22 16.5304 21.7893 17.0391 21.4142 17.4142C21.0391 17.7893 20.5304 18 20 18H18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M18 14H6V22H18V14Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="ps-3 fw-500 primary text-white">{{t('form-fields.print')}}</span>
          </PrimaryButton>

          <!-- Save as pdf -->
          <PrimaryButton :loading="saveAsPdfLoading" @click="saveAsPdf(data?.reservation?.reservation_no, data?.customerinfo?.first_name, data?.customerinfo?.last_name)" class="btn edit-btn mb-3">
            <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21.5 15V19C21.5 19.5304 21.2893 20.0391 20.9142 20.4142C20.5391 20.7893 20.0304 21 19.5 21H5.5C4.96957 21 4.46086 20.7893 4.08579 20.4142C3.71071 20.0391 3.5 19.5304 3.5 19V15" stroke="#276EF1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M7.5 10L12.5 15L17.5 10" stroke="#276EF1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M12.5 15V3" stroke="#276EF1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="ps-3 fw-500 primary text-secondary">{{t('form-fields.save-as-pdf')}}</span>
          </PrimaryButton>

          <!-- Send email -->
          <div class="mt-5">
            <div v-for="(email, idx) in emailId" :key="idx" class="email__item mb-1">
              <InputControl v-model="email.cc_email" type="email" placeholder="Example@mail.com" />
              <!-- Remove Icon -->
              <svg v-if="emailId.length !== 1" @click="removeEmail(idx)" class="remove_icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 4H3.33333H14" stroke="#F23E3D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M5.33301 3.99967V2.66634C5.33301 2.31272 5.47348 1.97358 5.72353 1.72353C5.97358 1.47348 6.31272 1.33301 6.66634 1.33301H9.33301C9.68663 1.33301 10.0258 1.47348 10.2758 1.72353C10.5259 1.97358 10.6663 2.31272 10.6663 2.66634V3.99967M12.6663 3.99967V13.333C12.6663 13.6866 12.5259 14.0258 12.2758 14.2758C12.0258 14.5259 11.6866 14.6663 11.333 14.6663H4.66634C4.31272 14.6663 3.97358 14.5259 3.72353 14.2758C3.47348 14.0258 3.33301 13.6866 3.33301 13.333V3.99967H12.6663Z" stroke="#F23E3D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <div class="d-flex justify-content-end">
              <button class="base-btn fleet-form__check-btn py-1 pe-0 text-10 me-4 text-primary" @click="addEmailId">
                + {{t('form-fields.add-recipient')}}
              </button>
            </div>
            <CheckBox v-model="sendEmailForm.cc_me_status" :label="t('form-fields.cc-me')" style="display: block" />

            <PrimaryButton @click="sendEmail" :loading="sendEmailLoading" class="btn edit-btn my-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="#276EF1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M22 6L12 13L2 6" stroke="#276EF1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <span class="ps-3 fw-500 primary text-secondary">{{t('button.send-email')}} <span class="text-lowercase">{{t('form-fields.email')}}</span></span>
            </PrimaryButton>
          </div>
        </div>

        <div v-if="data?.reservation?.reservation_status == 'Rented' || data?.reservation?.reservation_status == 'Reserved'">
          <!-- Edit -->
          <button v-if="data?.reservation?.reservation_status == 'Reserved'" @click="$router.push(`/reservierungen/aktualisieren/${$route.params.id}`)" class="btn edit-btn mb-3">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.334 2.00004C11.5091 1.82494 11.7169 1.68605 11.9457 1.59129C12.1745 1.49653 12.4197 1.44775 12.6673 1.44775C12.9149 1.44775 13.1601 1.49653 13.3889 1.59129C13.6177 1.68605 13.8256 1.82494 14.0007 2.00004C14.1757 2.17513 14.3146 2.383 14.4094 2.61178C14.5042 2.84055 14.5529 3.08575 14.5529 3.33337C14.5529 3.58099 14.5042 3.82619 14.4094 4.05497C14.3146 4.28374 14.1757 4.49161 14.0007 4.66671L5.00065 13.6667L1.33398 14.6667L2.33398 11L11.334 2.00004Z" stroke="#276EF1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="ps-3 fw-500 primary text-secondary text-16">{{t('button.edit')}}</span>
          </button>

          <!-- Edit -->
          <button v-if="data?.reservation?.reservation_status == 'Rented'" @click="$router.push(`/reservierungen/end-miete/${$route.params.id}`)" class="btn edit-btn mb-3">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.334 2.00004C11.5091 1.82494 11.7169 1.68605 11.9457 1.59129C12.1745 1.49653 12.4197 1.44775 12.6673 1.44775C12.9149 1.44775 13.1601 1.49653 13.3889 1.59129C13.6177 1.68605 13.8256 1.82494 14.0007 2.00004C14.1757 2.17513 14.3146 2.383 14.4094 2.61178C14.5042 2.84055 14.5529 3.08575 14.5529 3.33337C14.5529 3.58099 14.5042 3.82619 14.4094 4.05497C14.3146 4.28374 14.1757 4.49161 14.0007 4.66671L5.00065 13.6667L1.33398 14.6667L2.33398 11L11.334 2.00004Z" stroke="#276EF1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="ps-3 fw-500 primary text-secondary text-16">{{t('dashboard-reservation.end-rental')}}</span>
          </button>

          <!-- Signature Modal Open -->
          <button @click="openSignatureModalForFinish" v-if="data?.reservation?.reservation_status == 'Rented' " class="btn contract-btn btn-secondary text-white mb-2">
            <svg width="25" height="22" viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <mask id="path-1-inside-1_1596_1279" fill="white">
                <path d="M17.4912 0.851847L3.64251 0.00166998C3.19106 -0.0257787 2.79951 0.288418 2.76927 0.702643L2.66095 2.18939H0.820311C0.368015 2.18939 0 2.52716 0 2.94229V21.2471C0 21.6622 0.368015 22 0.820311 22H11.4206C11.5125 22 11.6036 21.9655 11.6687 21.906L13.2689 20.4438C13.2852 20.447 13.3018 20.4495 13.3188 20.4505L16.0508 20.6182C16.4868 20.6446 16.8948 20.3191 16.924 19.9173L18.255 1.65336C18.2849 1.24344 17.9378 0.879252 17.4912 0.851847ZM11.7722 20.8963V18.6548C11.7722 18.5956 11.8248 18.5473 11.8894 18.5473H14.3222L11.7722 20.8963ZM16.2225 19.8742C16.211 19.9392 16.1694 19.9726 16.0978 19.9743L13.9284 19.8412L15.4168 18.4812C15.4831 18.4206 15.5203 18.3383 15.5203 18.2525V2.94233C15.5203 2.5272 15.1523 2.18943 14.7 2.18943H11.0441C10.5896 2.18943 10.5896 2.83478 11.0441 2.83478H14.7C14.7647 2.83478 14.8172 2.88305 14.8172 2.94233V17.9019H11.8894C11.4371 17.9019 11.0691 18.2397 11.0691 18.6548V21.3547H0.820311C0.755717 21.3547 0.703123 21.3064 0.703123 21.2471V2.94233C0.703123 2.88305 0.755717 2.83478 0.820311 2.83478H9.17192C9.62646 2.83478 9.62646 2.18943 9.17192 2.18943H3.36562L3.4708 0.745752C3.48224 0.680744 3.52382 0.647402 3.59554 0.645638L17.4443 1.49577C17.5151 1.50627 17.5515 1.54443 17.5534 1.61026L16.2225 19.8742Z" />
              </mask>
              <path d="M17.4912 0.851847L3.64251 0.00166998C3.19106 -0.0257787 2.79951 0.288418 2.76927 0.702643L2.66095 2.18939H0.820311C0.368015 2.18939 0 2.52716 0 2.94229V21.2471C0 21.6622 0.368015 22 0.820311 22H11.4206C11.5125 22 11.6036 21.9655 11.6687 21.906L13.2689 20.4438C13.2852 20.447 13.3018 20.4495 13.3188 20.4505L16.0508 20.6182C16.4868 20.6446 16.8948 20.3191 16.924 19.9173L18.255 1.65336C18.2849 1.24344 17.9378 0.879252 17.4912 0.851847ZM11.7722 20.8963V18.6548C11.7722 18.5956 11.8248 18.5473 11.8894 18.5473H14.3222L11.7722 20.8963ZM16.2225 19.8742C16.211 19.9392 16.1694 19.9726 16.0978 19.9743L13.9284 19.8412L15.4168 18.4812C15.4831 18.4206 15.5203 18.3383 15.5203 18.2525V2.94233C15.5203 2.5272 15.1523 2.18943 14.7 2.18943H11.0441C10.5896 2.18943 10.5896 2.83478 11.0441 2.83478H14.7C14.7647 2.83478 14.8172 2.88305 14.8172 2.94233V17.9019H11.8894C11.4371 17.9019 11.0691 18.2397 11.0691 18.6548V21.3547H0.820311C0.755717 21.3547 0.703123 21.3064 0.703123 21.2471V2.94233C0.703123 2.88305 0.755717 2.83478 0.820311 2.83478H9.17192C9.62646 2.83478 9.62646 2.18943 9.17192 2.18943H3.36562L3.4708 0.745752C3.48224 0.680744 3.52382 0.647402 3.59554 0.645638L17.4443 1.49577C17.5151 1.50627 17.5515 1.54443 17.5534 1.61026L16.2225 19.8742Z" fill="white" fill-opacity="0.7" />
              <path d="M3.64251 0.00166998L3.70378 -0.996451L3.7032 -0.996487L3.64251 0.00166998ZM2.76927 0.702643L1.77193 0.629847L1.77192 0.629973L2.76927 0.702643ZM2.66095 2.18939V3.18939H3.59074L3.6583 2.26206L2.66095 2.18939ZM11.6687 21.906L10.9941 21.1678L10.9941 21.1678L11.6687 21.906ZM13.2689 20.4438L13.461 19.4624L12.9664 19.3656L12.5944 19.7056L13.2689 20.4438ZM13.3188 20.4505L13.3801 19.4524L13.3793 19.4524L13.3188 20.4505ZM16.0508 20.6182L15.9895 21.6164L15.9903 21.6164L16.0508 20.6182ZM16.924 19.9173L15.9267 19.8446L15.9267 19.8447L16.924 19.9173ZM18.255 1.65336L17.2576 1.58049L17.2576 1.58069L18.255 1.65336ZM11.7722 20.8963H10.7722V23.1772L12.4497 21.6318L11.7722 20.8963ZM14.3222 18.5473L14.9997 19.2828L16.8837 17.5473H14.3222V18.5473ZM16.2225 19.8742L17.2073 20.0476L17.2161 19.9976L17.2198 19.9469L16.2225 19.8742ZM16.0978 19.9743L16.0365 20.9725L16.0794 20.9751L16.1224 20.974L16.0978 19.9743ZM13.9284 19.8412L13.2539 19.1029L11.5119 20.6947L13.8671 20.8393L13.9284 19.8412ZM15.4168 18.4812L14.7424 17.7428L14.7422 17.7429L15.4168 18.4812ZM14.8172 17.9019V18.9019H15.8172V17.9019H14.8172ZM11.0691 21.3547V22.3547H12.0691V21.3547H11.0691ZM3.36562 2.18943L2.36826 2.11676L2.29011 3.18943H3.36562V2.18943ZM3.4708 0.745752L2.48593 0.572473L2.47714 0.622462L2.47345 0.673084L3.4708 0.745752ZM3.59554 0.645638L3.65681 -0.352483L3.61391 -0.355117L3.57095 -0.35406L3.59554 0.645638ZM17.4443 1.49577L17.5909 0.506577L17.5484 0.500281L17.5055 0.49765L17.4443 1.49577ZM17.5534 1.61026L18.5507 1.68293L18.5544 1.63206L18.553 1.58107L17.5534 1.61026ZM17.5525 -0.146274L3.70378 -0.996451L3.58123 0.999791L17.43 1.84997L17.5525 -0.146274ZM3.7032 -0.996487C2.78591 -1.05226 1.84766 -0.407748 1.77193 0.629847L3.76662 0.77544C3.75952 0.872717 3.71007 0.937352 3.67389 0.96639C3.63883 0.994526 3.60498 1.00124 3.58182 0.999827L3.7032 -0.996487ZM1.77192 0.629973L1.66359 2.11672L3.6583 2.26206L3.76663 0.775313L1.77192 0.629973ZM2.66095 1.18939H0.820311V3.18939H2.66095V1.18939ZM0.820311 1.18939C-0.101821 1.18939 -1 1.89588 -1 2.94229H1C1 3.04103 0.954398 3.11232 0.916733 3.14689C0.880377 3.18026 0.84401 3.18939 0.820311 3.18939V1.18939ZM-1 2.94229V21.2471H1V2.94229H-1ZM-1 21.2471C-1 22.2935 -0.101821 23 0.820311 23V21C0.84401 21 0.880376 21.0091 0.916733 21.0425C0.954398 21.0771 1 21.1484 1 21.2471H-1ZM0.820311 23H11.4206V21H0.820311V23ZM11.4206 23C11.7505 23 12.0854 22.8798 12.3433 22.6442L10.9941 21.1678C11.1217 21.0512 11.2745 21 11.4206 21V23ZM12.3433 22.6442L13.9435 21.182L12.5944 19.7056L10.9941 21.1678L12.3433 22.6442ZM13.0768 21.4252C13.1195 21.4335 13.1827 21.4441 13.2584 21.4487L13.3793 19.4524C13.4209 19.4549 13.4509 19.4604 13.461 19.4624L13.0768 21.4252ZM13.2576 21.4486L15.9895 21.6164L16.1121 19.6201L13.3801 19.4524L13.2576 21.4486ZM15.9903 21.6164C16.8901 21.6709 17.8466 21.0171 17.9214 19.9898L15.9267 19.8447C15.9355 19.723 15.9958 19.6631 16.0147 19.6479C16.0347 19.6319 16.0648 19.6172 16.1113 19.6201L15.9903 21.6164ZM17.9214 19.9899L19.2523 1.72604L17.2576 1.58069L15.9267 19.8446L17.9214 19.9899ZM19.2523 1.72624C19.3287 0.681334 18.4717 -0.0898645 17.5525 -0.146275L17.43 1.84997C17.3981 1.84801 17.3608 1.83357 17.3279 1.79903C17.2942 1.76367 17.2498 1.68743 17.2576 1.58049L19.2523 1.72624ZM12.7722 20.8963V18.6548H10.7722V20.8963H12.7722ZM12.7722 18.6548C12.7722 19.2268 12.2946 19.5473 11.8894 19.5473V17.5473C11.355 17.5473 10.7722 17.9643 10.7722 18.6548H12.7722ZM11.8894 19.5473H14.3222V17.5473H11.8894V19.5473ZM13.6447 17.8118L11.0947 20.1608L12.4497 21.6318L14.9997 19.2828L13.6447 17.8118ZM15.2376 19.7008C15.2636 19.5533 15.3462 19.3372 15.5566 19.1682C15.7573 19.0071 15.9648 18.9773 16.0732 18.9747L16.1224 20.974C16.3024 20.9696 16.5666 20.9222 16.8088 20.7277C17.0607 20.5255 17.1699 20.2601 17.2073 20.0476L15.2376 19.7008ZM16.1591 18.9762L13.9897 18.843L13.8671 20.8393L16.0365 20.9725L16.1591 18.9762ZM14.603 20.5794L16.0913 19.2194L14.7422 17.7429L13.2539 19.1029L14.603 20.5794ZM16.0911 19.2195C16.3542 18.9793 16.5203 18.6335 16.5203 18.2525H14.5203C14.5203 18.0432 14.612 17.8619 14.7424 17.7428L16.0911 19.2195ZM16.5203 18.2525V2.94233H14.5203V18.2525H16.5203ZM16.5203 2.94233C16.5203 1.89593 15.6221 1.18943 14.7 1.18943V3.18943C14.6763 3.18943 14.6399 3.18031 14.6036 3.14694C14.5659 3.11237 14.5203 3.04108 14.5203 2.94233H16.5203ZM14.7 1.18943H11.0441V3.18943H14.7V1.18943ZM11.0441 1.18943C10.6777 1.18943 10.3207 1.32751 10.0595 1.60569C9.81157 1.86966 9.70319 2.20298 9.70319 2.5121C9.70319 2.82123 9.81157 3.15454 10.0595 3.41851C10.3207 3.6967 10.6777 3.83478 11.0441 3.83478V1.83478C11.1832 1.83478 11.3697 1.89218 11.5174 2.04937C11.6516 2.19234 11.7032 2.36431 11.7032 2.5121C11.7032 2.65989 11.6516 2.83187 11.5174 2.97484C11.3697 3.13202 11.1832 3.18943 11.0441 3.18943V1.18943ZM11.0441 3.83478H14.7V1.83478H11.0441V3.83478ZM14.7 3.83478C14.2945 3.83478 13.8172 3.51408 13.8172 2.94233H15.8172C15.8172 2.25202 15.2348 1.83478 14.7 1.83478V3.83478ZM13.8172 2.94233V17.9019H15.8172V2.94233H13.8172ZM14.8172 16.9019H11.8894V18.9019H14.8172V16.9019ZM11.8894 16.9019C10.9673 16.9019 10.0691 17.6084 10.0691 18.6548H12.0691C12.0691 18.7536 12.0235 18.8249 11.9858 18.8594C11.9495 18.8928 11.9131 18.9019 11.8894 18.9019V16.9019ZM10.0691 18.6548V21.3547H12.0691V18.6548H10.0691ZM11.0691 20.3547H0.820311V22.3547H11.0691V20.3547ZM0.820311 20.3547C1.22555 20.3547 1.70312 20.6751 1.70312 21.2471H-0.296877C-0.296877 21.9377 0.285882 22.3547 0.820311 22.3547V20.3547ZM1.70312 21.2471V2.94233H-0.296877V21.2471H1.70312ZM1.70312 2.94233C1.70312 3.51432 1.22555 3.83478 0.820311 3.83478V1.83478C0.285882 1.83478 -0.296877 2.25177 -0.296877 2.94233H1.70312ZM0.820311 3.83478H9.17192V1.83478H0.820311V3.83478ZM9.17192 3.83478C9.5383 3.83478 9.89529 3.6967 10.1565 3.41851C10.4044 3.15454 10.5128 2.82123 10.5128 2.5121C10.5128 2.20298 10.4044 1.86966 10.1565 1.60569C9.89529 1.32751 9.5383 1.18943 9.17192 1.18943V3.18943C9.0328 3.18943 8.84627 3.13202 8.69865 2.97484C8.56439 2.83187 8.51283 2.65989 8.51283 2.5121C8.51283 2.36431 8.56439 2.19234 8.69865 2.04937C8.84627 1.89218 9.0328 1.83478 9.17192 1.83478V3.83478ZM9.17192 1.18943H3.36562V3.18943H9.17192V1.18943ZM4.36297 2.2621L4.46816 0.81842L2.47345 0.673084L2.36826 2.11676L4.36297 2.2621ZM4.45568 0.919031C4.42973 1.06651 4.34707 1.28289 4.13643 1.45191C3.93563 1.61304 3.72809 1.64268 3.62013 1.64534L3.57095 -0.35406C3.39127 -0.349641 3.12708 -0.302447 2.88471 -0.107958C2.63249 0.0944351 2.52332 0.359987 2.48593 0.572473L4.45568 0.919031ZM3.53427 1.64376L17.383 2.49389L17.5055 0.49765L3.65681 -0.352483L3.53427 1.64376ZM17.2976 2.48497C17.1909 2.46915 16.9832 2.41358 16.8008 2.22223C16.6092 2.0212 16.5582 1.78936 16.5538 1.63944L18.553 1.58107C18.5467 1.36533 18.4765 1.08149 18.2485 0.842304C18.0297 0.612793 17.7684 0.532892 17.5909 0.506577L17.2976 2.48497ZM16.556 1.53758L15.2251 19.8016L17.2198 19.9469L18.5507 1.68293L16.556 1.53758Z" fill="white" fill-opacity="0.7" mask="url(#path-1-inside-1_1596_1279)" />
              <mask id="path-3-inside-2_1596_1279" fill="white">
                <path d="M12.5552 10.1846H2.9668C2.77264 10.1846 2.61523 10.329 2.61523 10.5072C2.61523 10.6854 2.77264 10.8299 2.9668 10.8299H12.5552C12.7494 10.8299 12.9068 10.6854 12.9068 10.5072C12.9068 10.329 12.7494 10.1846 12.5552 10.1846Z" />
              </mask>
              <path d="M12.5552 10.1846H2.9668C2.77264 10.1846 2.61523 10.329 2.61523 10.5072C2.61523 10.6854 2.77264 10.8299 2.9668 10.8299H12.5552C12.7494 10.8299 12.9068 10.6854 12.9068 10.5072C12.9068 10.329 12.7494 10.1846 12.5552 10.1846Z" fill="white" fill-opacity="0.7" />
              <path d="M12.5552 9.18457H2.9668V11.1846H12.5552V9.18457ZM2.9668 9.18457C2.3028 9.18457 1.61523 9.69776 1.61523 10.5072H3.61523C3.61523 10.9603 3.24248 11.1846 2.9668 11.1846V9.18457ZM1.61523 10.5072C1.61523 11.3167 2.3028 11.8299 2.9668 11.8299V9.82991C3.24248 9.82991 3.61523 10.0542 3.61523 10.5072H1.61523ZM2.9668 11.8299H12.5552V9.82991H2.9668V11.8299ZM12.5552 11.8299C13.2193 11.8299 13.9068 11.3166 13.9068 10.5072H11.9068C11.9068 10.0542 12.2795 9.82991 12.5552 9.82991V11.8299ZM13.9068 10.5072C13.9068 9.69785 13.2193 9.18457 12.5552 9.18457V11.1846C12.2795 11.1846 11.9068 10.9602 11.9068 10.5072H13.9068Z" fill="white" fill-opacity="0.7" mask="url(#path-3-inside-2_1596_1279)" />
              <mask id="path-5-inside-3_1596_1279" fill="white">
                <path d="M12.5552 12.4341H2.9668C2.77264 12.4341 2.61523 12.5786 2.61523 12.7568C2.61523 12.935 2.77264 13.0794 2.9668 13.0794H12.5552C12.7494 13.0794 12.9068 12.935 12.9068 12.7568C12.9068 12.5786 12.7494 12.4341 12.5552 12.4341Z" />
              </mask>
              <path d="M12.5552 12.4341H2.9668C2.77264 12.4341 2.61523 12.5786 2.61523 12.7568C2.61523 12.935 2.77264 13.0794 2.9668 13.0794H12.5552C12.7494 13.0794 12.9068 12.935 12.9068 12.7568C12.9068 12.5786 12.7494 12.4341 12.5552 12.4341Z" fill="white" fill-opacity="0.7" />
              <path d="M12.5552 11.4341H2.9668V13.4341H12.5552V11.4341ZM2.9668 11.4341C2.3028 11.4341 1.61523 11.9473 1.61523 12.7568H3.61523C3.61523 13.2098 3.24248 13.4341 2.9668 13.4341V11.4341ZM1.61523 12.7568C1.61523 13.5662 2.3028 14.0794 2.9668 14.0794V12.0794C3.24248 12.0794 3.61523 12.3037 3.61523 12.7568H1.61523ZM2.9668 14.0794H12.5552V12.0794H2.9668V14.0794ZM12.5552 14.0794C13.2193 14.0794 13.9068 13.5661 13.9068 12.7568H11.9068C11.9068 12.3038 12.2795 12.0794 12.5552 12.0794V14.0794ZM13.9068 12.7568C13.9068 11.9474 13.2193 11.4341 12.5552 11.4341V13.4341C12.2795 13.4341 11.9068 13.2097 11.9068 12.7568H13.9068Z" fill="white" fill-opacity="0.7" mask="url(#path-5-inside-3_1596_1279)" />
              <mask id="path-7-inside-4_1596_1279" fill="white">
                <path d="M2.61523 8.25773C2.61523 8.43593 2.77264 8.5804 2.9668 8.5804H12.5552C12.7494 8.5804 12.9068 8.43593 12.9068 8.25773C12.9068 8.07953 12.7494 7.93506 12.5552 7.93506H2.9668C2.77264 7.93506 2.61523 8.07953 2.61523 8.25773Z" />
              </mask>
              <path d="M2.61523 8.25773C2.61523 8.43593 2.77264 8.5804 2.9668 8.5804H12.5552C12.7494 8.5804 12.9068 8.43593 12.9068 8.25773C12.9068 8.07953 12.7494 7.93506 12.5552 7.93506H2.9668C2.77264 7.93506 2.61523 8.07953 2.61523 8.25773Z" fill="white" fill-opacity="0.7" />
              <path d="M1.61523 8.25773C1.61523 9.06721 2.3028 9.5804 2.9668 9.5804V7.5804C3.24248 7.5804 3.61523 7.80466 3.61523 8.25773H1.61523ZM2.9668 9.5804H12.5552V7.5804H2.9668V9.5804ZM12.5552 9.5804C13.2193 9.5804 13.9068 9.06713 13.9068 8.25773H11.9068C11.9068 7.80474 12.2795 7.5804 12.5552 7.5804V9.5804ZM13.9068 8.25773C13.9068 7.44834 13.2193 6.93506 12.5552 6.93506V8.93506C12.2795 8.93506 11.9068 8.71072 11.9068 8.25773H13.9068ZM12.5552 6.93506H2.9668V8.93506H12.5552V6.93506ZM2.9668 6.93506C2.3028 6.93506 1.61523 7.44825 1.61523 8.25773H3.61523C3.61523 8.71081 3.24248 8.93506 2.9668 8.93506V6.93506Z" fill="white" fill-opacity="0.7" mask="url(#path-7-inside-4_1596_1279)" />
              <mask id="path-9-inside-5_1596_1279" fill="white">
                <path d="M4.30273 6.00871C4.30273 6.18691 4.46014 6.33138 4.6543 6.33138H10.8646C11.0588 6.33138 11.2162 6.18691 11.2162 6.00871C11.2162 5.83051 11.0588 5.68604 10.8646 5.68604H4.6543C4.46014 5.68604 4.30273 5.83051 4.30273 6.00871Z" />
              </mask>
              <path d="M4.30273 6.00871C4.30273 6.18691 4.46014 6.33138 4.6543 6.33138H10.8646C11.0588 6.33138 11.2162 6.18691 11.2162 6.00871C11.2162 5.83051 11.0588 5.68604 10.8646 5.68604H4.6543C4.46014 5.68604 4.30273 5.83051 4.30273 6.00871Z" fill="white" fill-opacity="0.7" />
              <path d="M3.30273 6.00871C3.30273 6.81819 3.9903 7.33138 4.6543 7.33138V5.33138C4.92998 5.33138 5.30273 5.55563 5.30273 6.00871H3.30273ZM4.6543 7.33138H10.8646V5.33138H4.6543V7.33138ZM10.8646 7.33138C11.5286 7.33138 12.2162 6.81819 12.2162 6.00871H10.2162C10.2162 5.55563 10.5889 5.33138 10.8646 5.33138V7.33138ZM12.2162 6.00871C12.2162 5.19923 11.5286 4.68604 10.8646 4.68604V6.68604C10.5889 6.68604 10.2162 6.46178 10.2162 6.00871H12.2162ZM10.8646 4.68604H4.6543V6.68604H10.8646V4.68604ZM4.6543 4.68604C3.9903 4.68604 3.30273 5.19923 3.30273 6.00871H5.30273C5.30273 6.46178 4.92998 6.68604 4.6543 6.68604V4.68604Z" fill="white" fill-opacity="0.7" mask="url(#path-9-inside-5_1596_1279)" />
              <path d="M9.12978 18.864C8.49749 18.8655 7.86519 18.8668 7.2329 18.8677C7.02037 18.868 6.80788 18.8682 6.5954 18.8684C6.21032 18.8686 5.95087 18.7977 5.86462 18.4089C5.79168 18.0802 5.28506 18.1244 5.18662 18.4089C4.94334 19.1118 4.54097 18.8364 4.31559 18.3636C4.09073 17.8919 4.03308 17.3641 3.93487 16.8621C3.86269 16.4933 3.25491 16.5967 3.24431 16.9479C3.23034 17.4104 3.18328 17.8656 3.05536 18.3142C2.92341 18.7771 2.72564 19.2219 2.52933 19.6641C2.35819 20.0496 3.03872 20.2155 3.20733 19.8357C3.38128 19.4438 3.55547 19.0498 3.68512 18.6433C3.92606 19.1751 4.42453 19.7766 5.13482 19.4221C5.26696 19.3561 5.39038 19.2624 5.49871 19.1531C5.86809 19.5448 6.41788 19.514 6.93233 19.5134C7.66485 19.5125 8.39736 19.5111 9.12988 19.5093C9.58217 19.5082 9.58302 18.8629 9.12978 18.864Z" fill="white" fill-opacity="0.7" />
              <path d="M6.93233 19.5134C7.66485 19.5125 8.39736 19.5111 9.12988 19.5093C9.58217 19.5082 9.58302 18.8629 9.12978 18.864M6.93233 19.5134L6.93218 19.3681C7.03266 19.3679 7.13314 19.3678 7.2336 19.3677C7.86559 19.3668 8.49757 19.3655 9.12953 19.364C9.12953 19.364 9.12953 19.364 9.12953 19.364C9.13001 19.364 9.13049 19.364 9.13097 19.364M6.93233 19.5134C6.89801 19.5134 6.86352 19.5136 6.82894 19.5138C6.36786 19.5161 5.8902 19.5185 5.54794 19.2019L5.49871 19.1531L5.41917 19.2281C5.33135 19.3053 5.23562 19.3718 5.13482 19.4221M6.93233 19.5134L6.93216 19.3681C6.82003 19.3682 6.70789 19.3683 6.59573 19.3684L4.10561 18.9627M9.13097 19.364C9.13098 19.364 9.131 19.364 9.13101 19.364L9.12978 18.864M9.13097 19.364L9.12978 18.864M9.13097 19.364C9.13053 19.364 9.13005 19.364 9.12953 19.3639C9.12953 19.3639 9.12953 19.3639 9.12953 19.3639C9.11406 19.3634 9.0643 19.3536 9.01983 19.3061C8.98069 19.2644 8.96938 19.2185 8.9694 19.1855C8.96942 19.1525 8.98073 19.1076 9.01891 19.0667C9.06382 19.0186 9.11456 19.0093 9.12867 19.0093M9.12978 18.864C8.49749 18.8655 7.86519 18.8668 7.2329 18.8677C7.02037 18.868 6.80788 18.8682 6.5954 18.8684M6.5954 18.8684L9.12869 19.0093H9.12867M6.5954 18.8684C6.21032 18.8686 5.95087 18.7977 5.86462 18.4089M6.5954 18.8684L4.91153 18.9747C4.80839 19.0262 4.73796 19.0317 4.69167 19.0272C4.64309 19.0224 4.58774 19.0029 4.52301 18.9571C4.38333 18.8581 4.24655 18.6682 4.14432 18.4453L4.31407 18.3643L4.14432 18.4452C4.14306 18.4425 4.14181 18.4397 4.14056 18.437L3.71197 17.4911C3.72902 17.3135 3.73882 17.1373 3.74408 16.963C3.74204 17.0305 3.70785 17.0821 3.67992 17.1071C3.65785 17.1268 3.64278 17.1291 3.63859 17.1297L3.63858 17.1297C3.6354 17.1302 3.60482 17.1347 3.55868 17.1095C3.53354 17.0958 3.50609 17.0741 3.48315 17.0431C3.4599 17.0117 3.4486 16.9807 3.44418 16.9581M6.5954 18.8684L6.5955 19.0133L5.86251 18.8101C5.94903 18.9018 6.0641 18.9574 6.24304 18.9871C6.35249 19.0053 6.46682 19.0115 6.59549 19.0133L6.5954 18.8684ZM9.12867 19.0093C8.49676 19.0108 7.86491 19.0121 7.2331 19.013C7.13267 19.0131 7.03223 19.0133 6.93179 19.0134L9.12867 19.0093ZM5.86462 18.4089C5.79168 18.0802 5.28506 18.1244 5.18662 18.4089C4.94334 19.1118 4.54097 18.8364 4.31559 18.3636C4.13639 17.9877 4.06339 17.5761 3.99142 17.1704C3.97309 17.067 3.95482 16.964 3.93487 16.8621M5.86462 18.4089L5.55007 18.4787L5.62847 18.5618L5.62838 18.5618L5.55008 18.4787L5.86462 18.4089ZM3.93487 16.8621C3.86269 16.4933 3.25491 16.5967 3.24431 16.9479C3.23034 17.4104 3.18328 17.8656 3.05536 18.3142M3.93487 16.8621L3.46286 16.9545L3.46282 16.9545L3.44418 16.9581M3.93487 16.8621L3.46271 16.9545L3.46267 16.9545L3.44418 16.9581C3.44418 16.9581 3.44418 16.9581 3.44418 16.9581M3.05536 18.3142C2.92395 18.7751 2.72728 19.2182 2.53177 19.6586L2.52933 19.6641C2.35819 20.0496 3.03872 20.2155 3.20733 19.8357M3.05536 18.3142L3.24778 18.3691L3.20877 18.4914C3.08872 18.8677 2.9259 19.2373 2.75033 19.6328M3.05536 18.3142L3.24779 18.3691L3.53592 17.4657C3.52059 17.3835 3.50653 17.3035 3.49302 17.2266C3.47635 17.1317 3.46052 17.0416 3.44418 16.9581M3.20733 19.8357C3.29224 19.6444 3.3772 19.4526 3.45702 19.2591C3.41086 19.1907 3.36915 19.1215 3.33171 19.0535C3.2373 19.2975 3.13425 19.5333 3.03429 19.7589L3.20733 19.8357ZM3.20733 19.8357L3.03429 19.7589C3.02113 19.7886 3.00803 19.8181 2.995 19.8474L2.98633 19.867C2.99291 19.8521 3.00459 19.8168 3.00142 19.7664C3.00093 19.7585 3.00011 19.7508 2.99898 19.7432L2.75033 19.6328C2.75033 19.6328 2.75033 19.6328 2.75033 19.6328M2.75033 19.6328L2.99898 19.7432C2.99268 19.7008 2.97687 19.662 2.95594 19.6305C2.91139 19.5633 2.86251 19.5519 2.86146 19.5516L2.86145 19.5516C2.8567 19.5505 2.84832 19.5485 2.83051 19.5552C2.80489 19.5648 2.7688 19.5912 2.75033 19.6328ZM3.44113 18.7539L3.68512 18.6433L3.94111 18.725C3.91329 18.6769 3.88768 18.6279 3.86426 18.5788L3.44113 18.7539ZM3.44113 18.7539C3.46043 18.6974 3.47904 18.6405 3.49684 18.5833C3.51046 18.5395 3.52359 18.4955 3.53619 18.4513L3.44113 18.7539ZM4.10561 18.9627C4.08034 19.0354 4.05397 19.1075 4.02679 19.1789C4.29726 19.4773 4.67085 19.6536 5.13482 19.4221M4.10561 18.9627C4.11717 18.9766 4.12896 18.9902 4.14098 19.0035C4.24838 19.1228 4.40849 19.2581 4.62228 19.312C4.77477 19.3504 4.92751 19.3403 5.06749 19.2872L5.13482 19.4221M4.10561 18.9627L5.0675 19.2872L5.13482 19.4221M3.85779 18.5651C3.85993 18.5697 3.86208 18.5742 3.86425 18.5788L3.5362 18.4513C3.58203 18.2906 3.6183 18.1301 3.64692 17.9704C3.70011 18.1708 3.76749 18.3729 3.85779 18.5651Z" stroke="white" stroke-opacity="0.7" />
              <path d="M23.7166 10.5889C23.5339 10.422 23.2828 10.3365 23.0278 10.3301L22.7621 10.3313V9.87017C22.7621 9.58927 22.5803 9.2925 22.3199 9.14472V8.49516C22.3199 7.15848 20.0525 7.16429 20.0525 8.50144V9.15109C19.7872 9.30158 19.6093 9.57017 19.6093 9.87611V10.3486C18.439 10.4217 18.4357 12.0585 19.6106 12.1225C19.6181 13.567 19.6177 14.9878 19.6093 16.4565C19.607 16.8615 20.31 16.8853 20.3124 16.4599C20.3208 14.99 20.3212 13.5679 20.3137 12.1222L22.058 12.1142C22.058 12.1142 22.0558 16.8833 22.0558 19.0317C22.0558 20.0787 20.3111 20.0857 20.3111 19.0208L20.3117 18.4323C20.3392 18.0159 19.6373 17.977 19.6099 18.3935V18.9456C19.6099 19.4189 19.7693 19.8197 20.0781 20.1016C20.1055 20.7768 20.4155 21.4301 20.9391 21.9067C21.0893 22.0435 21.2973 22.0017 21.4427 21.8988C21.9755 21.409 22.2756 20.7633 22.2944 20.0741C22.5265 19.8619 22.7588 19.6483 22.7588 18.9169L22.7591 15.9762C23.3671 16.135 24.001 15.7031 24.001 15.1181V11.2171C24.001 10.9795 23.9 10.7564 23.7166 10.5889ZM20.3124 10.3425V9.87607C20.3124 9.7806 20.3838 9.70053 20.4799 9.67674L21.8873 9.67033C21.9267 9.67928 21.963 9.69636 21.9924 9.72329C22.0353 9.76249 22.0589 9.81463 22.0589 9.87017V10.3346L20.3124 10.3425ZM21.1876 8.10528C21.4034 8.10528 21.6167 8.29949 21.6167 8.49516V9.01858L20.7555 9.02249V8.50144C20.7556 8.28404 20.9493 8.10636 21.1876 8.10528ZM21.1871 21.18C21.0236 20.9674 20.9054 20.7269 20.8394 20.4742C20.9482 20.4958 21.0585 20.5071 21.1688 20.5071C21.2919 20.5071 21.415 20.4931 21.5362 20.4659C21.4718 20.7225 21.3538 20.9644 21.1871 21.18ZM23.2979 15.1181C23.2979 15.4236 22.7611 15.4477 22.7611 15.1237C22.7611 15.1237 22.7617 12.0702 22.7621 11.7903C22.7623 11.6098 22.5988 11.4673 22.4078 11.4673L19.6708 11.4797C19.3313 11.4797 19.3393 10.9923 19.6743 10.9907L23.0312 10.9755C23.1936 10.9882 23.2824 11.0687 23.2978 11.2171V15.1181H23.2979Z" fill="white" fill-opacity="0.7" />
              <path d="M22.058 12.1142L22.2619 12.1143C22.2619 12.1144 22.2619 12.1144 22.2619 12.1144L22.058 12.1142ZM22.5567 15.1237C22.5567 15.1237 22.5567 15.1237 22.5567 15.1237L22.7611 15.1237L22.5567 15.1237Z" stroke="white" stroke-opacity="0.7" />
            </svg>
            <span class="ps-3 fw-500 primary text-white mb-3 text-16">{{t('form-fields.sign')}}</span>
          </button>
          <p v-if="signatureFinalErrorText" class="text-danger text-13 mt-1 mb-0">{{t('text.signature-is-required')}}</p>

          <!-- Signature Modal Open -->
          <button @click="openSignatureModal" v-if="data?.reservation?.reservation_status == 'Reserved' " class="btn contract-btn btn-dark text-white mb-2">
            <svg width="25" height="22" viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <mask id="path-1-inside-1_1596_1279" fill="white">
                <path d="M17.4912 0.851847L3.64251 0.00166998C3.19106 -0.0257787 2.79951 0.288418 2.76927 0.702643L2.66095 2.18939H0.820311C0.368015 2.18939 0 2.52716 0 2.94229V21.2471C0 21.6622 0.368015 22 0.820311 22H11.4206C11.5125 22 11.6036 21.9655 11.6687 21.906L13.2689 20.4438C13.2852 20.447 13.3018 20.4495 13.3188 20.4505L16.0508 20.6182C16.4868 20.6446 16.8948 20.3191 16.924 19.9173L18.255 1.65336C18.2849 1.24344 17.9378 0.879252 17.4912 0.851847ZM11.7722 20.8963V18.6548C11.7722 18.5956 11.8248 18.5473 11.8894 18.5473H14.3222L11.7722 20.8963ZM16.2225 19.8742C16.211 19.9392 16.1694 19.9726 16.0978 19.9743L13.9284 19.8412L15.4168 18.4812C15.4831 18.4206 15.5203 18.3383 15.5203 18.2525V2.94233C15.5203 2.5272 15.1523 2.18943 14.7 2.18943H11.0441C10.5896 2.18943 10.5896 2.83478 11.0441 2.83478H14.7C14.7647 2.83478 14.8172 2.88305 14.8172 2.94233V17.9019H11.8894C11.4371 17.9019 11.0691 18.2397 11.0691 18.6548V21.3547H0.820311C0.755717 21.3547 0.703123 21.3064 0.703123 21.2471V2.94233C0.703123 2.88305 0.755717 2.83478 0.820311 2.83478H9.17192C9.62646 2.83478 9.62646 2.18943 9.17192 2.18943H3.36562L3.4708 0.745752C3.48224 0.680744 3.52382 0.647402 3.59554 0.645638L17.4443 1.49577C17.5151 1.50627 17.5515 1.54443 17.5534 1.61026L16.2225 19.8742Z" />
              </mask>
              <path d="M17.4912 0.851847L3.64251 0.00166998C3.19106 -0.0257787 2.79951 0.288418 2.76927 0.702643L2.66095 2.18939H0.820311C0.368015 2.18939 0 2.52716 0 2.94229V21.2471C0 21.6622 0.368015 22 0.820311 22H11.4206C11.5125 22 11.6036 21.9655 11.6687 21.906L13.2689 20.4438C13.2852 20.447 13.3018 20.4495 13.3188 20.4505L16.0508 20.6182C16.4868 20.6446 16.8948 20.3191 16.924 19.9173L18.255 1.65336C18.2849 1.24344 17.9378 0.879252 17.4912 0.851847ZM11.7722 20.8963V18.6548C11.7722 18.5956 11.8248 18.5473 11.8894 18.5473H14.3222L11.7722 20.8963ZM16.2225 19.8742C16.211 19.9392 16.1694 19.9726 16.0978 19.9743L13.9284 19.8412L15.4168 18.4812C15.4831 18.4206 15.5203 18.3383 15.5203 18.2525V2.94233C15.5203 2.5272 15.1523 2.18943 14.7 2.18943H11.0441C10.5896 2.18943 10.5896 2.83478 11.0441 2.83478H14.7C14.7647 2.83478 14.8172 2.88305 14.8172 2.94233V17.9019H11.8894C11.4371 17.9019 11.0691 18.2397 11.0691 18.6548V21.3547H0.820311C0.755717 21.3547 0.703123 21.3064 0.703123 21.2471V2.94233C0.703123 2.88305 0.755717 2.83478 0.820311 2.83478H9.17192C9.62646 2.83478 9.62646 2.18943 9.17192 2.18943H3.36562L3.4708 0.745752C3.48224 0.680744 3.52382 0.647402 3.59554 0.645638L17.4443 1.49577C17.5151 1.50627 17.5515 1.54443 17.5534 1.61026L16.2225 19.8742Z" fill="white" fill-opacity="0.7" />
              <path d="M3.64251 0.00166998L3.70378 -0.996451L3.7032 -0.996487L3.64251 0.00166998ZM2.76927 0.702643L1.77193 0.629847L1.77192 0.629973L2.76927 0.702643ZM2.66095 2.18939V3.18939H3.59074L3.6583 2.26206L2.66095 2.18939ZM11.6687 21.906L10.9941 21.1678L10.9941 21.1678L11.6687 21.906ZM13.2689 20.4438L13.461 19.4624L12.9664 19.3656L12.5944 19.7056L13.2689 20.4438ZM13.3188 20.4505L13.3801 19.4524L13.3793 19.4524L13.3188 20.4505ZM16.0508 20.6182L15.9895 21.6164L15.9903 21.6164L16.0508 20.6182ZM16.924 19.9173L15.9267 19.8446L15.9267 19.8447L16.924 19.9173ZM18.255 1.65336L17.2576 1.58049L17.2576 1.58069L18.255 1.65336ZM11.7722 20.8963H10.7722V23.1772L12.4497 21.6318L11.7722 20.8963ZM14.3222 18.5473L14.9997 19.2828L16.8837 17.5473H14.3222V18.5473ZM16.2225 19.8742L17.2073 20.0476L17.2161 19.9976L17.2198 19.9469L16.2225 19.8742ZM16.0978 19.9743L16.0365 20.9725L16.0794 20.9751L16.1224 20.974L16.0978 19.9743ZM13.9284 19.8412L13.2539 19.1029L11.5119 20.6947L13.8671 20.8393L13.9284 19.8412ZM15.4168 18.4812L14.7424 17.7428L14.7422 17.7429L15.4168 18.4812ZM14.8172 17.9019V18.9019H15.8172V17.9019H14.8172ZM11.0691 21.3547V22.3547H12.0691V21.3547H11.0691ZM3.36562 2.18943L2.36826 2.11676L2.29011 3.18943H3.36562V2.18943ZM3.4708 0.745752L2.48593 0.572473L2.47714 0.622462L2.47345 0.673084L3.4708 0.745752ZM3.59554 0.645638L3.65681 -0.352483L3.61391 -0.355117L3.57095 -0.35406L3.59554 0.645638ZM17.4443 1.49577L17.5909 0.506577L17.5484 0.500281L17.5055 0.49765L17.4443 1.49577ZM17.5534 1.61026L18.5507 1.68293L18.5544 1.63206L18.553 1.58107L17.5534 1.61026ZM17.5525 -0.146274L3.70378 -0.996451L3.58123 0.999791L17.43 1.84997L17.5525 -0.146274ZM3.7032 -0.996487C2.78591 -1.05226 1.84766 -0.407748 1.77193 0.629847L3.76662 0.77544C3.75952 0.872717 3.71007 0.937352 3.67389 0.96639C3.63883 0.994526 3.60498 1.00124 3.58182 0.999827L3.7032 -0.996487ZM1.77192 0.629973L1.66359 2.11672L3.6583 2.26206L3.76663 0.775313L1.77192 0.629973ZM2.66095 1.18939H0.820311V3.18939H2.66095V1.18939ZM0.820311 1.18939C-0.101821 1.18939 -1 1.89588 -1 2.94229H1C1 3.04103 0.954398 3.11232 0.916733 3.14689C0.880377 3.18026 0.84401 3.18939 0.820311 3.18939V1.18939ZM-1 2.94229V21.2471H1V2.94229H-1ZM-1 21.2471C-1 22.2935 -0.101821 23 0.820311 23V21C0.84401 21 0.880376 21.0091 0.916733 21.0425C0.954398 21.0771 1 21.1484 1 21.2471H-1ZM0.820311 23H11.4206V21H0.820311V23ZM11.4206 23C11.7505 23 12.0854 22.8798 12.3433 22.6442L10.9941 21.1678C11.1217 21.0512 11.2745 21 11.4206 21V23ZM12.3433 22.6442L13.9435 21.182L12.5944 19.7056L10.9941 21.1678L12.3433 22.6442ZM13.0768 21.4252C13.1195 21.4335 13.1827 21.4441 13.2584 21.4487L13.3793 19.4524C13.4209 19.4549 13.4509 19.4604 13.461 19.4624L13.0768 21.4252ZM13.2576 21.4486L15.9895 21.6164L16.1121 19.6201L13.3801 19.4524L13.2576 21.4486ZM15.9903 21.6164C16.8901 21.6709 17.8466 21.0171 17.9214 19.9898L15.9267 19.8447C15.9355 19.723 15.9958 19.6631 16.0147 19.6479C16.0347 19.6319 16.0648 19.6172 16.1113 19.6201L15.9903 21.6164ZM17.9214 19.9899L19.2523 1.72604L17.2576 1.58069L15.9267 19.8446L17.9214 19.9899ZM19.2523 1.72624C19.3287 0.681334 18.4717 -0.0898645 17.5525 -0.146275L17.43 1.84997C17.3981 1.84801 17.3608 1.83357 17.3279 1.79903C17.2942 1.76367 17.2498 1.68743 17.2576 1.58049L19.2523 1.72624ZM12.7722 20.8963V18.6548H10.7722V20.8963H12.7722ZM12.7722 18.6548C12.7722 19.2268 12.2946 19.5473 11.8894 19.5473V17.5473C11.355 17.5473 10.7722 17.9643 10.7722 18.6548H12.7722ZM11.8894 19.5473H14.3222V17.5473H11.8894V19.5473ZM13.6447 17.8118L11.0947 20.1608L12.4497 21.6318L14.9997 19.2828L13.6447 17.8118ZM15.2376 19.7008C15.2636 19.5533 15.3462 19.3372 15.5566 19.1682C15.7573 19.0071 15.9648 18.9773 16.0732 18.9747L16.1224 20.974C16.3024 20.9696 16.5666 20.9222 16.8088 20.7277C17.0607 20.5255 17.1699 20.2601 17.2073 20.0476L15.2376 19.7008ZM16.1591 18.9762L13.9897 18.843L13.8671 20.8393L16.0365 20.9725L16.1591 18.9762ZM14.603 20.5794L16.0913 19.2194L14.7422 17.7429L13.2539 19.1029L14.603 20.5794ZM16.0911 19.2195C16.3542 18.9793 16.5203 18.6335 16.5203 18.2525H14.5203C14.5203 18.0432 14.612 17.8619 14.7424 17.7428L16.0911 19.2195ZM16.5203 18.2525V2.94233H14.5203V18.2525H16.5203ZM16.5203 2.94233C16.5203 1.89593 15.6221 1.18943 14.7 1.18943V3.18943C14.6763 3.18943 14.6399 3.18031 14.6036 3.14694C14.5659 3.11237 14.5203 3.04108 14.5203 2.94233H16.5203ZM14.7 1.18943H11.0441V3.18943H14.7V1.18943ZM11.0441 1.18943C10.6777 1.18943 10.3207 1.32751 10.0595 1.60569C9.81157 1.86966 9.70319 2.20298 9.70319 2.5121C9.70319 2.82123 9.81157 3.15454 10.0595 3.41851C10.3207 3.6967 10.6777 3.83478 11.0441 3.83478V1.83478C11.1832 1.83478 11.3697 1.89218 11.5174 2.04937C11.6516 2.19234 11.7032 2.36431 11.7032 2.5121C11.7032 2.65989 11.6516 2.83187 11.5174 2.97484C11.3697 3.13202 11.1832 3.18943 11.0441 3.18943V1.18943ZM11.0441 3.83478H14.7V1.83478H11.0441V3.83478ZM14.7 3.83478C14.2945 3.83478 13.8172 3.51408 13.8172 2.94233H15.8172C15.8172 2.25202 15.2348 1.83478 14.7 1.83478V3.83478ZM13.8172 2.94233V17.9019H15.8172V2.94233H13.8172ZM14.8172 16.9019H11.8894V18.9019H14.8172V16.9019ZM11.8894 16.9019C10.9673 16.9019 10.0691 17.6084 10.0691 18.6548H12.0691C12.0691 18.7536 12.0235 18.8249 11.9858 18.8594C11.9495 18.8928 11.9131 18.9019 11.8894 18.9019V16.9019ZM10.0691 18.6548V21.3547H12.0691V18.6548H10.0691ZM11.0691 20.3547H0.820311V22.3547H11.0691V20.3547ZM0.820311 20.3547C1.22555 20.3547 1.70312 20.6751 1.70312 21.2471H-0.296877C-0.296877 21.9377 0.285882 22.3547 0.820311 22.3547V20.3547ZM1.70312 21.2471V2.94233H-0.296877V21.2471H1.70312ZM1.70312 2.94233C1.70312 3.51432 1.22555 3.83478 0.820311 3.83478V1.83478C0.285882 1.83478 -0.296877 2.25177 -0.296877 2.94233H1.70312ZM0.820311 3.83478H9.17192V1.83478H0.820311V3.83478ZM9.17192 3.83478C9.5383 3.83478 9.89529 3.6967 10.1565 3.41851C10.4044 3.15454 10.5128 2.82123 10.5128 2.5121C10.5128 2.20298 10.4044 1.86966 10.1565 1.60569C9.89529 1.32751 9.5383 1.18943 9.17192 1.18943V3.18943C9.0328 3.18943 8.84627 3.13202 8.69865 2.97484C8.56439 2.83187 8.51283 2.65989 8.51283 2.5121C8.51283 2.36431 8.56439 2.19234 8.69865 2.04937C8.84627 1.89218 9.0328 1.83478 9.17192 1.83478V3.83478ZM9.17192 1.18943H3.36562V3.18943H9.17192V1.18943ZM4.36297 2.2621L4.46816 0.81842L2.47345 0.673084L2.36826 2.11676L4.36297 2.2621ZM4.45568 0.919031C4.42973 1.06651 4.34707 1.28289 4.13643 1.45191C3.93563 1.61304 3.72809 1.64268 3.62013 1.64534L3.57095 -0.35406C3.39127 -0.349641 3.12708 -0.302447 2.88471 -0.107958C2.63249 0.0944351 2.52332 0.359987 2.48593 0.572473L4.45568 0.919031ZM3.53427 1.64376L17.383 2.49389L17.5055 0.49765L3.65681 -0.352483L3.53427 1.64376ZM17.2976 2.48497C17.1909 2.46915 16.9832 2.41358 16.8008 2.22223C16.6092 2.0212 16.5582 1.78936 16.5538 1.63944L18.553 1.58107C18.5467 1.36533 18.4765 1.08149 18.2485 0.842304C18.0297 0.612793 17.7684 0.532892 17.5909 0.506577L17.2976 2.48497ZM16.556 1.53758L15.2251 19.8016L17.2198 19.9469L18.5507 1.68293L16.556 1.53758Z" fill="white" fill-opacity="0.7" mask="url(#path-1-inside-1_1596_1279)" />
              <mask id="path-3-inside-2_1596_1279" fill="white">
                <path d="M12.5552 10.1846H2.9668C2.77264 10.1846 2.61523 10.329 2.61523 10.5072C2.61523 10.6854 2.77264 10.8299 2.9668 10.8299H12.5552C12.7494 10.8299 12.9068 10.6854 12.9068 10.5072C12.9068 10.329 12.7494 10.1846 12.5552 10.1846Z" />
              </mask>
              <path d="M12.5552 10.1846H2.9668C2.77264 10.1846 2.61523 10.329 2.61523 10.5072C2.61523 10.6854 2.77264 10.8299 2.9668 10.8299H12.5552C12.7494 10.8299 12.9068 10.6854 12.9068 10.5072C12.9068 10.329 12.7494 10.1846 12.5552 10.1846Z" fill="white" fill-opacity="0.7" />
              <path d="M12.5552 9.18457H2.9668V11.1846H12.5552V9.18457ZM2.9668 9.18457C2.3028 9.18457 1.61523 9.69776 1.61523 10.5072H3.61523C3.61523 10.9603 3.24248 11.1846 2.9668 11.1846V9.18457ZM1.61523 10.5072C1.61523 11.3167 2.3028 11.8299 2.9668 11.8299V9.82991C3.24248 9.82991 3.61523 10.0542 3.61523 10.5072H1.61523ZM2.9668 11.8299H12.5552V9.82991H2.9668V11.8299ZM12.5552 11.8299C13.2193 11.8299 13.9068 11.3166 13.9068 10.5072H11.9068C11.9068 10.0542 12.2795 9.82991 12.5552 9.82991V11.8299ZM13.9068 10.5072C13.9068 9.69785 13.2193 9.18457 12.5552 9.18457V11.1846C12.2795 11.1846 11.9068 10.9602 11.9068 10.5072H13.9068Z" fill="white" fill-opacity="0.7" mask="url(#path-3-inside-2_1596_1279)" />
              <mask id="path-5-inside-3_1596_1279" fill="white">
                <path d="M12.5552 12.4341H2.9668C2.77264 12.4341 2.61523 12.5786 2.61523 12.7568C2.61523 12.935 2.77264 13.0794 2.9668 13.0794H12.5552C12.7494 13.0794 12.9068 12.935 12.9068 12.7568C12.9068 12.5786 12.7494 12.4341 12.5552 12.4341Z" />
              </mask>
              <path d="M12.5552 12.4341H2.9668C2.77264 12.4341 2.61523 12.5786 2.61523 12.7568C2.61523 12.935 2.77264 13.0794 2.9668 13.0794H12.5552C12.7494 13.0794 12.9068 12.935 12.9068 12.7568C12.9068 12.5786 12.7494 12.4341 12.5552 12.4341Z" fill="white" fill-opacity="0.7" />
              <path d="M12.5552 11.4341H2.9668V13.4341H12.5552V11.4341ZM2.9668 11.4341C2.3028 11.4341 1.61523 11.9473 1.61523 12.7568H3.61523C3.61523 13.2098 3.24248 13.4341 2.9668 13.4341V11.4341ZM1.61523 12.7568C1.61523 13.5662 2.3028 14.0794 2.9668 14.0794V12.0794C3.24248 12.0794 3.61523 12.3037 3.61523 12.7568H1.61523ZM2.9668 14.0794H12.5552V12.0794H2.9668V14.0794ZM12.5552 14.0794C13.2193 14.0794 13.9068 13.5661 13.9068 12.7568H11.9068C11.9068 12.3038 12.2795 12.0794 12.5552 12.0794V14.0794ZM13.9068 12.7568C13.9068 11.9474 13.2193 11.4341 12.5552 11.4341V13.4341C12.2795 13.4341 11.9068 13.2097 11.9068 12.7568H13.9068Z" fill="white" fill-opacity="0.7" mask="url(#path-5-inside-3_1596_1279)" />
              <mask id="path-7-inside-4_1596_1279" fill="white">
                <path d="M2.61523 8.25773C2.61523 8.43593 2.77264 8.5804 2.9668 8.5804H12.5552C12.7494 8.5804 12.9068 8.43593 12.9068 8.25773C12.9068 8.07953 12.7494 7.93506 12.5552 7.93506H2.9668C2.77264 7.93506 2.61523 8.07953 2.61523 8.25773Z" />
              </mask>
              <path d="M2.61523 8.25773C2.61523 8.43593 2.77264 8.5804 2.9668 8.5804H12.5552C12.7494 8.5804 12.9068 8.43593 12.9068 8.25773C12.9068 8.07953 12.7494 7.93506 12.5552 7.93506H2.9668C2.77264 7.93506 2.61523 8.07953 2.61523 8.25773Z" fill="white" fill-opacity="0.7" />
              <path d="M1.61523 8.25773C1.61523 9.06721 2.3028 9.5804 2.9668 9.5804V7.5804C3.24248 7.5804 3.61523 7.80466 3.61523 8.25773H1.61523ZM2.9668 9.5804H12.5552V7.5804H2.9668V9.5804ZM12.5552 9.5804C13.2193 9.5804 13.9068 9.06713 13.9068 8.25773H11.9068C11.9068 7.80474 12.2795 7.5804 12.5552 7.5804V9.5804ZM13.9068 8.25773C13.9068 7.44834 13.2193 6.93506 12.5552 6.93506V8.93506C12.2795 8.93506 11.9068 8.71072 11.9068 8.25773H13.9068ZM12.5552 6.93506H2.9668V8.93506H12.5552V6.93506ZM2.9668 6.93506C2.3028 6.93506 1.61523 7.44825 1.61523 8.25773H3.61523C3.61523 8.71081 3.24248 8.93506 2.9668 8.93506V6.93506Z" fill="white" fill-opacity="0.7" mask="url(#path-7-inside-4_1596_1279)" />
              <mask id="path-9-inside-5_1596_1279" fill="white">
                <path d="M4.30273 6.00871C4.30273 6.18691 4.46014 6.33138 4.6543 6.33138H10.8646C11.0588 6.33138 11.2162 6.18691 11.2162 6.00871C11.2162 5.83051 11.0588 5.68604 10.8646 5.68604H4.6543C4.46014 5.68604 4.30273 5.83051 4.30273 6.00871Z" />
              </mask>
              <path d="M4.30273 6.00871C4.30273 6.18691 4.46014 6.33138 4.6543 6.33138H10.8646C11.0588 6.33138 11.2162 6.18691 11.2162 6.00871C11.2162 5.83051 11.0588 5.68604 10.8646 5.68604H4.6543C4.46014 5.68604 4.30273 5.83051 4.30273 6.00871Z" fill="white" fill-opacity="0.7" />
              <path d="M3.30273 6.00871C3.30273 6.81819 3.9903 7.33138 4.6543 7.33138V5.33138C4.92998 5.33138 5.30273 5.55563 5.30273 6.00871H3.30273ZM4.6543 7.33138H10.8646V5.33138H4.6543V7.33138ZM10.8646 7.33138C11.5286 7.33138 12.2162 6.81819 12.2162 6.00871H10.2162C10.2162 5.55563 10.5889 5.33138 10.8646 5.33138V7.33138ZM12.2162 6.00871C12.2162 5.19923 11.5286 4.68604 10.8646 4.68604V6.68604C10.5889 6.68604 10.2162 6.46178 10.2162 6.00871H12.2162ZM10.8646 4.68604H4.6543V6.68604H10.8646V4.68604ZM4.6543 4.68604C3.9903 4.68604 3.30273 5.19923 3.30273 6.00871H5.30273C5.30273 6.46178 4.92998 6.68604 4.6543 6.68604V4.68604Z" fill="white" fill-opacity="0.7" mask="url(#path-9-inside-5_1596_1279)" />
              <path d="M9.12978 18.864C8.49749 18.8655 7.86519 18.8668 7.2329 18.8677C7.02037 18.868 6.80788 18.8682 6.5954 18.8684C6.21032 18.8686 5.95087 18.7977 5.86462 18.4089C5.79168 18.0802 5.28506 18.1244 5.18662 18.4089C4.94334 19.1118 4.54097 18.8364 4.31559 18.3636C4.09073 17.8919 4.03308 17.3641 3.93487 16.8621C3.86269 16.4933 3.25491 16.5967 3.24431 16.9479C3.23034 17.4104 3.18328 17.8656 3.05536 18.3142C2.92341 18.7771 2.72564 19.2219 2.52933 19.6641C2.35819 20.0496 3.03872 20.2155 3.20733 19.8357C3.38128 19.4438 3.55547 19.0498 3.68512 18.6433C3.92606 19.1751 4.42453 19.7766 5.13482 19.4221C5.26696 19.3561 5.39038 19.2624 5.49871 19.1531C5.86809 19.5448 6.41788 19.514 6.93233 19.5134C7.66485 19.5125 8.39736 19.5111 9.12988 19.5093C9.58217 19.5082 9.58302 18.8629 9.12978 18.864Z" fill="white" fill-opacity="0.7" />
              <path d="M6.93233 19.5134C7.66485 19.5125 8.39736 19.5111 9.12988 19.5093C9.58217 19.5082 9.58302 18.8629 9.12978 18.864M6.93233 19.5134L6.93218 19.3681C7.03266 19.3679 7.13314 19.3678 7.2336 19.3677C7.86559 19.3668 8.49757 19.3655 9.12953 19.364C9.12953 19.364 9.12953 19.364 9.12953 19.364C9.13001 19.364 9.13049 19.364 9.13097 19.364M6.93233 19.5134C6.89801 19.5134 6.86352 19.5136 6.82894 19.5138C6.36786 19.5161 5.8902 19.5185 5.54794 19.2019L5.49871 19.1531L5.41917 19.2281C5.33135 19.3053 5.23562 19.3718 5.13482 19.4221M6.93233 19.5134L6.93216 19.3681C6.82003 19.3682 6.70789 19.3683 6.59573 19.3684L4.10561 18.9627M9.13097 19.364C9.13098 19.364 9.131 19.364 9.13101 19.364L9.12978 18.864M9.13097 19.364L9.12978 18.864M9.13097 19.364C9.13053 19.364 9.13005 19.364 9.12953 19.3639C9.12953 19.3639 9.12953 19.3639 9.12953 19.3639C9.11406 19.3634 9.0643 19.3536 9.01983 19.3061C8.98069 19.2644 8.96938 19.2185 8.9694 19.1855C8.96942 19.1525 8.98073 19.1076 9.01891 19.0667C9.06382 19.0186 9.11456 19.0093 9.12867 19.0093M9.12978 18.864C8.49749 18.8655 7.86519 18.8668 7.2329 18.8677C7.02037 18.868 6.80788 18.8682 6.5954 18.8684M6.5954 18.8684L9.12869 19.0093H9.12867M6.5954 18.8684C6.21032 18.8686 5.95087 18.7977 5.86462 18.4089M6.5954 18.8684L4.91153 18.9747C4.80839 19.0262 4.73796 19.0317 4.69167 19.0272C4.64309 19.0224 4.58774 19.0029 4.52301 18.9571C4.38333 18.8581 4.24655 18.6682 4.14432 18.4453L4.31407 18.3643L4.14432 18.4452C4.14306 18.4425 4.14181 18.4397 4.14056 18.437L3.71197 17.4911C3.72902 17.3135 3.73882 17.1373 3.74408 16.963C3.74204 17.0305 3.70785 17.0821 3.67992 17.1071C3.65785 17.1268 3.64278 17.1291 3.63859 17.1297L3.63858 17.1297C3.6354 17.1302 3.60482 17.1347 3.55868 17.1095C3.53354 17.0958 3.50609 17.0741 3.48315 17.0431C3.4599 17.0117 3.4486 16.9807 3.44418 16.9581M6.5954 18.8684L6.5955 19.0133L5.86251 18.8101C5.94903 18.9018 6.0641 18.9574 6.24304 18.9871C6.35249 19.0053 6.46682 19.0115 6.59549 19.0133L6.5954 18.8684ZM9.12867 19.0093C8.49676 19.0108 7.86491 19.0121 7.2331 19.013C7.13267 19.0131 7.03223 19.0133 6.93179 19.0134L9.12867 19.0093ZM5.86462 18.4089C5.79168 18.0802 5.28506 18.1244 5.18662 18.4089C4.94334 19.1118 4.54097 18.8364 4.31559 18.3636C4.13639 17.9877 4.06339 17.5761 3.99142 17.1704C3.97309 17.067 3.95482 16.964 3.93487 16.8621M5.86462 18.4089L5.55007 18.4787L5.62847 18.5618L5.62838 18.5618L5.55008 18.4787L5.86462 18.4089ZM3.93487 16.8621C3.86269 16.4933 3.25491 16.5967 3.24431 16.9479C3.23034 17.4104 3.18328 17.8656 3.05536 18.3142M3.93487 16.8621L3.46286 16.9545L3.46282 16.9545L3.44418 16.9581M3.93487 16.8621L3.46271 16.9545L3.46267 16.9545L3.44418 16.9581C3.44418 16.9581 3.44418 16.9581 3.44418 16.9581M3.05536 18.3142C2.92395 18.7751 2.72728 19.2182 2.53177 19.6586L2.52933 19.6641C2.35819 20.0496 3.03872 20.2155 3.20733 19.8357M3.05536 18.3142L3.24778 18.3691L3.20877 18.4914C3.08872 18.8677 2.9259 19.2373 2.75033 19.6328M3.05536 18.3142L3.24779 18.3691L3.53592 17.4657C3.52059 17.3835 3.50653 17.3035 3.49302 17.2266C3.47635 17.1317 3.46052 17.0416 3.44418 16.9581M3.20733 19.8357C3.29224 19.6444 3.3772 19.4526 3.45702 19.2591C3.41086 19.1907 3.36915 19.1215 3.33171 19.0535C3.2373 19.2975 3.13425 19.5333 3.03429 19.7589L3.20733 19.8357ZM3.20733 19.8357L3.03429 19.7589C3.02113 19.7886 3.00803 19.8181 2.995 19.8474L2.98633 19.867C2.99291 19.8521 3.00459 19.8168 3.00142 19.7664C3.00093 19.7585 3.00011 19.7508 2.99898 19.7432L2.75033 19.6328C2.75033 19.6328 2.75033 19.6328 2.75033 19.6328M2.75033 19.6328L2.99898 19.7432C2.99268 19.7008 2.97687 19.662 2.95594 19.6305C2.91139 19.5633 2.86251 19.5519 2.86146 19.5516L2.86145 19.5516C2.8567 19.5505 2.84832 19.5485 2.83051 19.5552C2.80489 19.5648 2.7688 19.5912 2.75033 19.6328ZM3.44113 18.7539L3.68512 18.6433L3.94111 18.725C3.91329 18.6769 3.88768 18.6279 3.86426 18.5788L3.44113 18.7539ZM3.44113 18.7539C3.46043 18.6974 3.47904 18.6405 3.49684 18.5833C3.51046 18.5395 3.52359 18.4955 3.53619 18.4513L3.44113 18.7539ZM4.10561 18.9627C4.08034 19.0354 4.05397 19.1075 4.02679 19.1789C4.29726 19.4773 4.67085 19.6536 5.13482 19.4221M4.10561 18.9627C4.11717 18.9766 4.12896 18.9902 4.14098 19.0035C4.24838 19.1228 4.40849 19.2581 4.62228 19.312C4.77477 19.3504 4.92751 19.3403 5.06749 19.2872L5.13482 19.4221M4.10561 18.9627L5.0675 19.2872L5.13482 19.4221M3.85779 18.5651C3.85993 18.5697 3.86208 18.5742 3.86425 18.5788L3.5362 18.4513C3.58203 18.2906 3.6183 18.1301 3.64692 17.9704C3.70011 18.1708 3.76749 18.3729 3.85779 18.5651Z" stroke="white" stroke-opacity="0.7" />
              <path d="M23.7166 10.5889C23.5339 10.422 23.2828 10.3365 23.0278 10.3301L22.7621 10.3313V9.87017C22.7621 9.58927 22.5803 9.2925 22.3199 9.14472V8.49516C22.3199 7.15848 20.0525 7.16429 20.0525 8.50144V9.15109C19.7872 9.30158 19.6093 9.57017 19.6093 9.87611V10.3486C18.439 10.4217 18.4357 12.0585 19.6106 12.1225C19.6181 13.567 19.6177 14.9878 19.6093 16.4565C19.607 16.8615 20.31 16.8853 20.3124 16.4599C20.3208 14.99 20.3212 13.5679 20.3137 12.1222L22.058 12.1142C22.058 12.1142 22.0558 16.8833 22.0558 19.0317C22.0558 20.0787 20.3111 20.0857 20.3111 19.0208L20.3117 18.4323C20.3392 18.0159 19.6373 17.977 19.6099 18.3935V18.9456C19.6099 19.4189 19.7693 19.8197 20.0781 20.1016C20.1055 20.7768 20.4155 21.4301 20.9391 21.9067C21.0893 22.0435 21.2973 22.0017 21.4427 21.8988C21.9755 21.409 22.2756 20.7633 22.2944 20.0741C22.5265 19.8619 22.7588 19.6483 22.7588 18.9169L22.7591 15.9762C23.3671 16.135 24.001 15.7031 24.001 15.1181V11.2171C24.001 10.9795 23.9 10.7564 23.7166 10.5889ZM20.3124 10.3425V9.87607C20.3124 9.7806 20.3838 9.70053 20.4799 9.67674L21.8873 9.67033C21.9267 9.67928 21.963 9.69636 21.9924 9.72329C22.0353 9.76249 22.0589 9.81463 22.0589 9.87017V10.3346L20.3124 10.3425ZM21.1876 8.10528C21.4034 8.10528 21.6167 8.29949 21.6167 8.49516V9.01858L20.7555 9.02249V8.50144C20.7556 8.28404 20.9493 8.10636 21.1876 8.10528ZM21.1871 21.18C21.0236 20.9674 20.9054 20.7269 20.8394 20.4742C20.9482 20.4958 21.0585 20.5071 21.1688 20.5071C21.2919 20.5071 21.415 20.4931 21.5362 20.4659C21.4718 20.7225 21.3538 20.9644 21.1871 21.18ZM23.2979 15.1181C23.2979 15.4236 22.7611 15.4477 22.7611 15.1237C22.7611 15.1237 22.7617 12.0702 22.7621 11.7903C22.7623 11.6098 22.5988 11.4673 22.4078 11.4673L19.6708 11.4797C19.3313 11.4797 19.3393 10.9923 19.6743 10.9907L23.0312 10.9755C23.1936 10.9882 23.2824 11.0687 23.2978 11.2171V15.1181H23.2979Z" fill="white" fill-opacity="0.7" />
              <path d="M22.058 12.1142L22.2619 12.1143C22.2619 12.1144 22.2619 12.1144 22.2619 12.1144L22.058 12.1142ZM22.5567 15.1237C22.5567 15.1237 22.5567 15.1237 22.5567 15.1237L22.7611 15.1237L22.5567 15.1237Z" stroke="white" stroke-opacity="0.7" />
            </svg>
            <span class="ps-3 fw-500 primary text-white mb-3 text-16">{{t('form-fields.sign')}}</span>
          </button>
          <p v-if="signatureErrorText" class="text-danger text-13 mt-1 mb-0">{{t('text.signature-is-required')}}</p>

          <!-- Non Smoking Signature Modal Open -->
          <!-- <button @click="openNonSmokingSignatureModal" v-if="data?.reservation?.reservation_status == 'Reserved' " class="btn contract-btn btn-dark text-white mb-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.147 10.9049L16.1449 10.9052H15.9697L15.9676 10.9049C15.7996 10.9049 15.6636 11.0409 15.6636 11.2089L15.6638 12.7908V12.8318H15.6718C15.6924 12.9793 15.814 13.0948 15.9673 13.0948H16.1454V13.0945L16.1468 13.0948C16.3001 13.0948 16.4217 12.9793 16.4425 12.8316H16.4508V11.2086C16.4508 11.0406 16.3148 10.9049 16.147 10.9049ZM17.2777 10.9049L17.2756 10.9052H17.1006L17.0985 10.9049C16.9305 10.9049 16.7945 11.0409 16.7945 11.2089H16.7942L16.7945 12.8318H16.8028C16.8233 12.9793 16.9449 13.0948 17.0982 13.0948H17.2764V13.0945L17.2777 13.0948C17.431 13.0948 17.5529 12.9793 17.5734 12.8316H17.5817V11.2086C17.5816 11.1281 17.5496 11.0508 17.4926 10.9939C17.4356 10.9369 17.3583 10.9049 17.2777 10.9049Z" fill="white" />
              <path d="M12 2C6.4768 2 2 6.47813 2 12.0005C2 17.5232 6.4768 22 12 22C17.5232 22 22 17.5232 22 12.0005C22 6.47813 17.5232 2 12 2ZM12 19.8829C7.94693 19.8829 4.11733 16.0531 4.11733 12.0005C4.11588 10.281 4.98678 8.34931 6.09067 7.03093L9.96507 10.9053H6.72507L6.72293 10.9051C6.55493 10.9051 6.41893 11.0411 6.41893 11.2091L6.4192 11.2099H6.41867V12.7912C6.41867 12.9592 6.55467 13.0952 6.72267 13.0952H12.1547L16.9693 17.9099C15.6509 19.0135 13.7193 19.8843 12 19.8829ZM17.9096 16.9693L14.0355 13.0949H14.9589C15.1267 13.0949 15.2629 12.9589 15.2629 12.7909V11.2099L15.2632 11.2088C15.2632 11.0408 15.1269 10.9048 14.9592 10.9048L14.9571 10.9051H11.8459L7.03093 6.0904C8.34912 4.98656 10.2807 4.11564 12 4.11707C16.0528 4.11707 19.8827 7.94827 19.8827 12.0003C19.8842 13.7196 19.0134 15.6511 17.9096 16.9693Z" fill="white" />
            </svg>
            <span class="ps-3 fw-500 primary text-white mb-3 text-16">{{t('button.non-smoking-agreement')}}</span>
          </button> -->

          <!-- Create Contract -->
          <PrimaryButton variant="dark" class="contract-btn mt-2" :loading="contactLoading" @click="createContract" v-if="data?.reservation?.reservation_status == 'Reserved' ">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V9L13 2Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M13 2V9H20" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="ps-3 fw-500 primary text-white">{{t('dashboard-reservation.create-contract')}}</span>
          </PrimaryButton>

          <!-- Finish Contract -->
          <PrimaryButton variant="dark" class="contract-btn mt-2" :loading="contactLoading" @click="finishContract" v-if="data?.reservation?.reservation_status == 'Rented'">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V9L13 2Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M13 2V9H20" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="ps-3 fw-500 primary text-white text-16">{{t('dashboard-reservation.finish-contract')}}</span>
          </PrimaryButton>

        </div>
      </div>
    </div>
  </div>

  <!-- Signature Modal -->
  <ModalControl v-model="signatureModalStatus" class="signature-modal">
    <div class="modal-header bg-dark">
      <div class="d-flex justify-content-between align-items-center w-100 px-4">
        <span class="text-16 fw-500 pointer" @click="signatureModalStatus = false">{{t('button.cancel')}}</span>
        <span class="text-16 fw-500 pointer" @click="signatureModalStatus = false">{{t('button.done')}}</span>
      </div>
    </div>
    <div class="modal-body pb-0">
      <div class="">
        <VueSignaturePad :options="{ maxWidth: 0.5, onEnd: onSignatureEnd, onBegin: onSignatureBegin }" width="100%" height="180px" ref="signaturePad" class="signaturepad" />
        <div class="d-flex justify-content-between py-3" style="border-top: 1px solid #000000">
          <h6 class="text-primary pointer d-flex align-items-center">
            <div class="d-flex align-items-center flex-column me-2">
              <svg width="16" height="9" viewBox="0 0 16 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 8L8 1L15 8" stroke="#276EF1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <svg width="2" height="16" viewBox="0 0 2 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-top: -0.5rem;">
                <path d="M1 15V1" stroke="#276EF1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            {{t('button.upload-signature')}}
          </h6>
          <div class="d-flex align-items-center">
            <!-- <h6 @click="undoSignature" class="text-dark pointer me-3">
              {{t("button.undo")}}
            </h6> -->
            <h6 @click="clearSignature" class="text-dark pointer">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 4V10H7" stroke="#676B74" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M3.51 15.0004C4.15839 16.8408 5.38734 18.4206 7.01166 19.5018C8.63598 20.583 10.5677 21.107 12.5157 20.9949C14.4637 20.8828 16.3226 20.1406 17.8121 18.8802C19.3017 17.6198 20.3413 15.9094 20.7742 14.0068C21.2072 12.1042 21.0101 10.1124 20.2126 8.33154C19.4152 6.55068 18.0605 5.07723 16.3528 4.1332C14.6451 3.18917 12.6769 2.8257 10.7447 3.09755C8.81245 3.36941 7.02091 4.26186 5.64 5.64044L1 10.0004" stroke="#676B74" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <span class="ms-1">{{t('form-fields.reset')}}</span>
            </h6>
          </div>
        </div>
        <!-- <InputControl v-model="form.signature_label" :placeholder="t('form-fields.signature-label')" class="my-3" errorField="signature_label" data-field="signature_label" /> -->
        <!-- <PrimaryButton variant="dark" class="w-100" :loading="contactLoading" @click="signatureModalStatus = false">{{t('button.okay')}}</PrimaryButton> -->
      </div>
    </div>
  </ModalControl>

  <!-- Finish Contract Signature Modal -->
  <ModalControl v-model="signatureFinishContractModalStatus" class="signature-modal">
    <div class="modal-header bg-dark">
      <div class="d-flex justify-content-between align-items-center w-100 px-4">
        <span class="text-16 fw-500 pointer" @click="signatureFinishContractModalStatus = false">{{t('button.cancel')}}</span>
        <span class="text-16 fw-500 pointer" @click="signatureFinishContractModalStatus = false">{{t('button.done')}}</span>
      </div>
    </div>
    <div class="modal-body pb-0">
      <div class="">
        <VueSignaturePad :options="{ maxWidth: 0.5, onEnd: onSignatureEndFinishContract, onBegin: onSignatureBeginFinishContract }" width="100%" height="180px" ref="signaturePad" class="signaturepad" />

        <div class="d-flex justify-content-between py-3" style="border-top: 1px solid #000000">
          <h6 class="text-primary pointer d-flex align-items-center">
            <div class="d-flex align-items-center flex-column me-2">
              <svg width="16" height="9" viewBox="0 0 16 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 8L8 1L15 8" stroke="#276EF1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <svg width="2" height="16" viewBox="0 0 2 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-top: -0.5rem;">
                <path d="M1 15V1" stroke="#276EF1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            {{t('button.upload-signature')}}
          </h6>
          <div class="d-flex align-items-center">
            <!-- <h6 @click="undoSignature" class="text-dark pointer me-3">
              Undo
            </h6> -->
            <h6 @click="clearSignature" class="text-dark pointer">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 4V10H7" stroke="#676B74" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M3.51 15.0004C4.15839 16.8408 5.38734 18.4206 7.01166 19.5018C8.63598 20.583 10.5677 21.107 12.5157 20.9949C14.4637 20.8828 16.3226 20.1406 17.8121 18.8802C19.3017 17.6198 20.3413 15.9094 20.7742 14.0068C21.2072 12.1042 21.0101 10.1124 20.2126 8.33154C19.4152 6.55068 18.0605 5.07723 16.3528 4.1332C14.6451 3.18917 12.6769 2.8257 10.7447 3.09755C8.81245 3.36941 7.02091 4.26186 5.64 5.64044L1 10.0004" stroke="#676B74" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <span class="ms-1">{{t('form-fields.reset')}}</span>
            </h6>
          </div>
        </div>
        <!-- <InputControl v-model="form.agreement_signature_label" :placeholder="t('form-fields.signature-label')" class="my-3" errorField="signature_label" data-field="signature_label" /> -->
        <!-- <PrimaryButton variant="dark" class="w-100" :loading="contactLoading" @click="signatureFinishContractModalStatus = false"> {{t('button.okay')}} </PrimaryButton> -->
      </div>
    </div>
  </ModalControl>

  <!-- Contract Success Modal -->
  <ModalControl v-model="contractModalStatus">
    <div class="modal-body">
      <div class="text-center">
        <svg width="85" height="85" viewBox="0 0 85 85" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="42.5" cy="42.5" r="42.5" fill="#C5FCDE" />
          <path d="M59.6663 30.5L36.7497 53.4167L26.333 43" stroke="#1BCE6C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <h2 class="text-success mt-3 mb-5">{{t('text.success')}}</h2>
        <p v-if="contractStatus == 'Completed'">{{t('text.contract')}} #{{data?.reservation?.reservation_no}}
          {{t('text.completed-text')}}</p>
        <p v-if="contractStatus == 'Created'">{{t('text.contract')}} #{{data?.reservation?.reservation_no}}
          {{t('text.created-text')}}</p>
        <button class="btn btn-sucess mt-4" @click="contractModalStatus = false">{{t('button.close')}}</button>
      </div>
    </div>
  </ModalControl>
</template>

<style lang="scss" scoped>

  .table {
    --bs-table-border-color: transparent !important;
  }

  .table > :not(:first-child) {
    border-top: 2px solid transparent !important;
  }

  .table-striped > tbody > tr:nth-child(2n + 1) > td {
    background-color: #eeeeee;
  }

  .table-striped > tbody > tr > td,
  .table-striped > thead > tr > th {
    padding: 0.5rem;
  }

  .signaturepad {
    background-color: #ffffff;
  }


.email__item {
  position: relative;
  .remove_icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: calc(100% + 7px);
    cursor: pointer;
  }
}

.btn-section {
  .edit-btn {
    background: #eee;
    border: 1px solid #ddd;

    &:hover {
      background: #eee !important;
      border: 1px solid #ddd !important;
    }
  }

  .btn {
    // width: 303px;
    width: 100%;
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .contract-btn {
    background: #000000;
    /* Secondary/V4 */

    border: 1px solid #000000;

    &:hover {
      background: #000000;
      border: 1px solid #000000;
    }
  }
}

@media only screen and (max-width: 1100px) {
  #actionSidebar {
    margin-left: 0px;
  }
}
.w-20 {
  width: 20%;
}
</style>
