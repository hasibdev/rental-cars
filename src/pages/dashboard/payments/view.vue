<script setup>
import { reactive, watch, ref, computed } from 'vue'
import moment from 'moment'
import { useI18n } from 'vue-i18n'
import { useAxios, api } from '@/use/useAxios'
import { useRoute, useRouter } from 'vue-router'
import BackButton from '../../../components/buttons/BackButton.vue'
import Carousel from '../../../components/carousel/Carousel.vue'
import CarouselSlide from '../../../components/carousel/CarouselSlide.vue'
import ModalControl from '@/components/common/modals/ModalControl.vue'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import { useToast } from "vue-toastification"
import fileDownload from 'js-file-download'
import VuePdfEmbed from 'vue-pdf-embed'

const route = useRoute()
const router = useRouter()

const { data: invoiceData, reFetch, loading } = useAxios(`admin/invoice/view/${route.params.invoiceId}`)
const { data: previousData, reFetch: reFetchPayments } = useAxios(`admin/paymentregister/prevous-payment/${route.params.invoiceId}`)

const { t } = useI18n({ useScope: 'global' })
const toast = useToast()

const form = reactive({
  invoice_id: route.params.invoiceId,
  custome_id: '',
  amount: '',
  payment_date: moment(new Date()).format('YYYY/MM/DD'),
  payment_method: '',
})

const pdfBlogUrl = ref('')
const fetchPDF = async () => {
  try {
    const res = await api.get(`admin/invoice/pdf/${route.params.invoiceId}`, {
      responseType: 'blob'
    })

    pdfBlogUrl.value = window.URL.createObjectURL(res.data)
  } catch (error) {
    //
  }
}
fetchPDF()


watch(() => invoiceData.value, (data) => {
  if (data?.invoicesinfo) {
    form.custome_id = data.invoicesinfo.customer_id
    form.payment_method = data.invoicesinfo.accepted_payment_method
    form.amount = data.invoicesinfo.due_amount
  }
})


// Previous payment slider
const activeSlide = ref(0)
const hasNext = computed(() => activeSlide.value < previousData.value?.length - 1)
const hasPrev = computed(() => activeSlide.value > 0)
const slideDirection = ref('left')
const nextSlide = () => {
  if (hasNext.value) activeSlide.value += 1
  slideDirection.value = 'left'
}
const prevSlide = () => {
  if (hasPrev.value) activeSlide.value -= 1
  slideDirection.value = 'right'
}

// Set as unpaid
const showSetAsUnpaidModal = ref(false)
const setAsUnpaidLoading = ref(false)
const onSetAsUnpaid = async () => {
  try {
    setAsUnpaidLoading.value = true
    await api.post(`admin/invoice/preivouspaymentunpaid/${route.params.invoiceId}`)

    reFetch()
    reFetchPayments()
    showSetAsUnpaidModal.value = false
    toast.success(`${t('toast.updateText')}`)
  } catch (error) {
    toast.error(`${t('toast.failureUpdateText')}`)
  } finally {
    setAsUnpaidLoading.value = false
  }
}

// Download XML
const downloadXML = async () => {
  try {
    const res = await api.get(`admin/paymentregister/xml-download/${route.params.invoiceId}`, {
      responseType: 'blob',
    })
    fileDownload(res.data, `payments-${route.params.invoiceId}.xml`)
  } catch (err) {
    //
  }
}
</script>

<template>
  <BackButton :label="t('dashboard-payment.payment')" />

  <h6 class="my-4">{{t('button.view-payment')}}</h6>
  <div v-if="!loading" class="d-flex justify-content-center flex-wrap w-100 scrollbar">
    <div class="mb-4 " style="width: 596px;">
      <VuePdfEmbed ref="pdfFrame" :source="pdfBlogUrl" class="invoice_print" />
    </div>
    <div class="mb-4" style="width: 350px; margin-left: 60px;">
      <!-- Previous payment -->
      <div class="borderd-content payment">
        <div class="mb-4 text-18 fw-700">{{t('dashboard-invoice.previous-payments')}}</div>

        <div class="text-center py-3">
          <p class="text-muted mb-1">{{t("form-fields.total-amount-paid")}}</p>
          <h4 class="fw-bold">{{ moneyFormat(invoiceData?.invoicesinfo?.total_amount_paid) }}</h4>
        </div>

        <p v-if="previousData?.length == 0" class="my-4 text-center">{{t('text.no-data-found')}}</p>

        <Carousel v-else style="height: 290px;">
          <CarouselSlide v-for="(prevPay, i) in previousData || []" :key="i" :index="i" :activeSlide="activeSlide" :direction="slideDirection">
            <div class="card">
              <p class="text-center py-3 fw-bold mb-0">{{ prevPay.payment_no }}</p>
              <table class="table table-card">
                <tbody>
                  <tr class="py-5">
                    <td>
                      <span class="me-md-3 card__item">
                        <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M13.9998 1.66699H1.99984C1.26346 1.66699 0.666504 2.26395 0.666504 3.00033V11.0003C0.666504 11.7367 1.26346 12.3337 1.99984 12.3337H13.9998C14.7362 12.3337 15.3332 11.7367 15.3332 11.0003V3.00033C15.3332 2.26395 14.7362 1.66699 13.9998 1.66699Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M0.666504 5.66699H15.3332" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                      </span>
                      <span class="text-14">{{t('form-fields.payment-method')}}</span>
                    </td>
                    <td>
                      <span class="fw-bold">
                        <span class="icon" v-if="prevPay.payment_method == 'Cash' ">
                          <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">
                            <g>
                              <g>
                                <path d="M191.9,330.246c-8.744-8.744-15.613-18.661-20.622-29.247h114.868v-30H162.265c-1.424-9.944-1.424-20.056,0-30h153.882
                                  v-30H171.279c5.009-10.586,11.878-20.503,20.622-29.247c40.94-40.939,107.554-40.938,148.493,0.001l21.213-21.213
                                  c-52.636-52.637-138.283-52.637-190.918,0c-14.719,14.719-25.319,32.021-31.806,50.459h-32.735v30h25.901
                                  c-1.105,9.967-1.105,20.033,0,30h-25.901v30h32.735c6.487,18.438,17.087,35.74,31.806,50.459
                                  c25.497,25.5,59.398,39.542,95.458,39.542s69.961-14.042,95.459-39.541l-21.213-21.213
                                  C299.455,371.185,232.841,371.186,191.9,330.246z" />
                              </g>
                            </g>
                            <g>
                              <g>
                                <path d="M256,0C114.615,0,0,114.615,0,256s114.615,256,256,256s256-114.615,256-256S397.385,0,256,0z M256,482
                                  C131.184,482,30,380.816,30,256S131.184,30,256,30s226,101.184,226,226S380.816,482,256,482z" />
                              </g>
                            </g>

                          </svg>
                        </span>
                        <span class="icon" v-if="prevPay.payment_method == 'Check' || prevPay.payment_method == 'Card' ">
                          <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">
                            <g>
                              <g>
                                <path d="M481.28,81.92H30.72C13.783,81.92,0,95.703,0,112.64v286.72c0,16.937,13.783,30.72,30.72,30.72h450.56
                                  c16.937,0,30.72-13.783,30.72-30.72V112.64C512,95.703,498.217,81.92,481.28,81.92z M491.52,399.36
                                  c0,5.632-4.608,10.24-10.24,10.24H30.72c-5.652,0-10.24-4.608-10.24-10.24V112.64c0-5.653,4.588-10.24,10.24-10.24h450.56
                                  c5.632,0,10.24,4.587,10.24,10.24V399.36z" />
                              </g>
                            </g>
                            <g>
                              <g>
                                <rect x="10.24" y="174.08" width="491.52" height="40.96" />
                              </g>
                            </g>
                            <g>
                              <g>
                                <path d="M501.76,163.84H10.24C4.588,163.84,0,168.427,0,174.08v40.96c0,5.653,4.588,10.24,10.24,10.24h491.52
                                  c5.652,0,10.24-4.587,10.24-10.24v-40.96C512,168.427,507.412,163.84,501.76,163.84z M491.52,204.8H20.48v-20.48h471.04V204.8z" />
                              </g>
                            </g>
                            <g>
                              <g>
                                <path d="M276.48,286.72H92.16c-5.652,0-10.24,4.588-10.24,10.24c0,5.652,4.588,10.24,10.24,10.24h184.32
                                  c5.652,0,10.24-4.588,10.24-10.24C286.72,291.307,282.132,286.72,276.48,286.72z" />
                              </g>
                            </g>
                            <g>
                              <g>
                                <path d="M194.56,327.68H92.16c-5.652,0-10.24,4.588-10.24,10.24s4.588,10.24,10.24,10.24h102.4c5.652,0,10.24-4.588,10.24-10.24
                                  S200.212,327.68,194.56,327.68z" />
                              </g>
                            </g>
                          </svg>
                        </span>
                        <span class="icon" v-if="prevPay.payment_method == 'Bank transfer' ">
                          <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 469.333 469.333" style="enable-background:new 0 0 469.333 469.333;" xml:space="preserve">
                            <g>
                              <g>
                                <g>
                                  <path d="M234.646,63.979c-23.542,0-42.688,19.146-42.688,42.688s19.146,42.687,42.688,42.687
                                    c23.542,0,42.687-19.146,42.687-42.687S258.187,63.979,234.646,63.979z M234.646,128.021c-11.771,0-21.354-9.583-21.354-21.354
                                    s9.583-21.354,21.354-21.354c11.771,0,21.354,9.583,21.354,21.354S246.417,128.021,234.646,128.021z" />
                                  <path d="M458.667,192c5.896,0,10.667-4.742,10.667-10.637v-42.662c0-3.76-1.979-7.249-5.219-9.166L255.458,5.621
                                    c-0.094-0.063-0.188-0.115-0.281-0.167c-12.969-7.187-27.594-7.405-41.313,0.146L5.219,129.535
                                    C1.979,131.451,0,134.941,0,138.701v42.662C0,187.258,4.771,192,10.667,192h32v192.009C19.135,384.009,0,403.142,0,426.671
                                    v31.997c0,5.895,4.771,10.666,10.667,10.666h448c5.896,0,10.667-4.77,10.667-10.666v-31.997
                                    c0-23.529-19.135-42.662-42.667-42.662V192H458.667z M448,426.667V448H21.333v-21.333c0-11.76,9.573-21.333,21.333-21.333h10.667
                                    H416h10.667C438.427,405.333,448,414.906,448,426.667z M64,384V192h42.667v192H64z M128,384V192h64v192H128z M213.333,384V192
                                    H256v192H213.333z M277.333,384V192h64v192H277.333z M362.667,384V192h42.667v192H362.667z M21.333,170.667V144.74
                                    L224.448,24.073c6.646-3.656,13.708-3.646,20.271-0.073L448,144.74v25.927H21.333z" />
                                </g>
                              </g>
                            </g>
                          </svg>
                        </span>
                        <span>{{ prevPay.payment_method }}</span>
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <span class="card__item me-3">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M13.04 2.23926H2.95959C2.16427 2.23926 1.51953 2.88399 1.51953 3.67931V13.7597C1.51953 14.555 2.16427 15.1998 2.95959 15.1998H13.04C13.8353 15.1998 14.48 14.555 14.48 13.7597V3.67931C14.48 2.88399 13.8353 2.23926 13.04 2.23926Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M10.8804 0.799805V3.67992" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M5.11914 0.799805V3.67992" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M1.51953 6.55957H14.48" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                      </span>
                      <span class="text-14">{{t('form-fields.collection-date')}}</span>
                    </td>
                    <td>
                      <span class="fw-bold">{{ prevPay.payment_date }}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span class="card__item me-3">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10.8438 9.4375C11.1022 9.4375 11.3125 9.64497 11.3125 9.9H12.25C12.25 9.29162 11.8581 8.77291 11.3125 8.58028V7.5625H10.375V8.58062C9.82941 8.77412 9.4375 9.29516 9.4375 9.90625C9.4375 10.6817 10.0683 11.3125 10.8438 11.3125C11.1022 11.3125 11.3125 11.5228 11.3125 11.7813C11.3125 12.0397 11.1022 12.25 10.8438 12.25C10.5853 12.25 10.375 12.0397 10.375 11.7813H9.4375C9.4375 12.3923 9.82941 12.9134 10.375 13.1069V14.1188H11.3125V13.1069C11.8581 12.9134 12.25 12.3923 12.25 11.7813C12.25 11.0058 11.6192 10.375 10.8438 10.375C10.5853 10.375 10.375 10.1647 10.375 9.90625C10.375 9.64778 10.5853 9.4375 10.8438 9.4375Z" fill="black" />
                          <path d="M10.8438 5.6875C10.6857 5.6875 10.5294 5.69506 10.375 5.70903V2.8125C10.375 1.99966 9.79537 1.26219 8.74294 0.735969C7.79375 0.261375 6.54219 0 5.21875 0C3.89262 0 2.63103 0.260844 1.66634 0.734438C0.591813 1.26203 0 2 0 2.8125V11.3125C0 12.125 0.591813 12.863 1.66634 13.3906C2.63103 13.8642 3.89262 14.125 5.21875 14.125C5.75028 14.125 6.27022 14.0826 6.76922 13.9999C7.71331 15.2159 9.18859 16 10.8438 16C13.6869 16 16 13.6869 16 10.8438C16 8.00059 13.6869 5.6875 10.8438 5.6875ZM2.07953 1.576C2.906 1.17022 4.05019 0.9375 5.21875 0.9375C7.70494 0.9375 9.4375 1.92566 9.4375 2.8125C9.4375 3.69934 7.70494 4.6875 5.21875 4.6875C4.05019 4.6875 2.906 4.45478 2.07953 4.049C1.35375 3.69269 0.9375 3.242 0.9375 2.8125C0.9375 2.383 1.35375 1.93231 2.07953 1.576ZM0.9375 4.44578C1.14762 4.60631 1.391 4.75537 1.66634 4.89056C2.63103 5.36416 3.89262 5.625 5.21875 5.625C6.54219 5.625 7.79375 5.36363 8.74294 4.88903C9.00416 4.75841 9.23616 4.61478 9.4375 4.46022V5.88241C8.50325 6.14756 7.67628 6.67019 7.03819 7.36828C6.46706 7.49713 5.85581 7.5625 5.21875 7.5625C4.05019 7.5625 2.906 7.32978 2.07953 6.924C1.35375 6.56769 0.9375 6.117 0.9375 5.6875V4.44578ZM0.9375 7.32078C1.14762 7.48131 1.391 7.63037 1.66634 7.76556C2.63103 8.23916 3.89262 8.5 5.21875 8.5C5.58066 8.5 5.93569 8.48059 6.28191 8.44253C5.97391 9.02534 5.77434 9.67381 5.71025 10.3611C5.54741 10.3701 5.38322 10.375 5.21875 10.375C4.05019 10.375 2.906 10.1423 2.07953 9.7365C1.35375 9.38019 0.9375 8.9295 0.9375 8.5V7.32078ZM5.21875 13.1875C4.05019 13.1875 2.906 12.9548 2.07953 12.549C1.35375 12.1927 0.9375 11.742 0.9375 11.3125V10.1333C1.14762 10.2938 1.391 10.4428 1.66634 10.578C2.63103 11.0517 3.89262 11.3125 5.21875 11.3125C5.38219 11.3125 5.54559 11.3084 5.70794 11.3004C5.76544 11.9525 5.94478 12.5701 6.22312 13.1303C5.89625 13.168 5.56053 13.1875 5.21875 13.1875ZM10.8438 15.0625C8.51753 15.0625 6.625 13.17 6.625 10.8438C6.625 8.51753 8.51753 6.625 10.8438 6.625C13.17 6.625 15.0625 8.51753 15.0625 10.8438C15.0625 13.17 13.17 15.0625 10.8438 15.0625Z" fill="black" />
                        </svg>

                      </span>
                      <span class="text-14">{{ t('form-fields.amount') }}</span>
                    </td>
                    <td>
                      <span class="fw-bold">{{ moneyFormat(prevPay.amount) }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CarouselSlide>
        </Carousel>

        <div v-if="previousData?.length > 0" class="d-flex justify-content-center align-items-center">
          <span @click="prevSlide" :class="{'pointer': hasPrev}">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g filter="url(#filter0_d_4203_3787)">
                <rect x="4" y="2" width="32" height="32" rx="4" fill="white" />
                <path d="M23 12L17 18L23 24" stroke="black" :stroke-opacity="hasPrev ? 1 : 0.32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </g>
              <defs>
                <filter id="filter0_d_4203_3787" x="0" y="0" width="40" height="40" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                  <feFlood flood-opacity="0" result="BackgroundImageFix" />
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                  <feOffset dy="2" />
                  <feGaussianBlur stdDeviation="2" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.16 0" />
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4203_3787" />
                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_4203_3787" result="shape" />
                </filter>
              </defs>
            </svg>

          </span>
          <span @click="nextSlide" :class="{'pointer': hasNext}">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g filter="url(#filter0_d_4203_3791)">
                <rect x="36" y="34" width="32" height="32" rx="4" transform="rotate(180 36 34)" fill="white" />
                <path d="M17 24L23 18L17 12" :stroke-opacity="hasNext ? 1 : 0.32" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </g>
              <defs>
                <filter id="filter0_d_4203_3791" x="0" y="0" width="40" height="40" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                  <feFlood flood-opacity="0" result="BackgroundImageFix" />
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                  <feOffset dy="2" />
                  <feGaussianBlur stdDeviation="2" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.16 0" />
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4203_3791" />
                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_4203_3791" result="shape" />
                </filter>
              </defs>
            </svg>

          </span>
        </div>
      </div>

      <div class="mt-5 text-center d-flex flex-column align-items-center px-4">
        <p @click="showSetAsUnpaidModal = true" class="text-danger pointer">{{t("dashboard-payment.set-as-unpaid")}}</p>

        <button @click="downloadXML" type="button" class="btn btn-outline-dark w-100">{{t("dashboard-payment.download-xml-file")}}</button>
        <button type="button" class="btn btn-outline-danger mt-3 w-100" @click="router.back()">{{t("button.cancel")}}</button>

      </div>
    </div>

  </div>

  <Loading v-else />

  <!-- Set as unpaid Modal -->
  <ModalControl v-model="showSetAsUnpaidModal">
    <div class="modal-header d-flex mx-0 ps-4">
      <div class="mb-1 text-16 fw-400" style="color: #333333;">{{t('button.set-as-unpaid')}}</div>
      <svg @click="showSetAsUnpaidModal = false" width="24" height="24" class="pointer me-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_5455_4085)">
          <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="black" />
        </g>
        <defs>
          <clipPath id="clip0_5455_4085">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
    <div class="modal-body">
      <div class="text-14 fw-400">{{t('text.set-as-unpaid-modal-text')}}</div>
    </div>
    <div class="modal-footer border-0">
      <PrimaryButton variant="dark" @click="onSetAsUnpaid" :loading="setAsUnpaidLoading" class="pointer w-100">{{t('button.confirm')}}</PrimaryButton>
    </div>
  </ModalControl>
</template>


<style lang="scss" scoped>
.invoice_print {
  border: 1px solid #ddd;
  border-radius: 5px;
  overflow: hidden;
}

.invoice__content {
  position: relative;
  overflow: hidden;

  .paid__badge {
    position: absolute;
    top: 22px;
    right: -40px;
    background: #46b276;
    color: #fff;
    width: 150px;
    text-align: center;
    font-weight: 700;
    font-size: 14px;
    line-height: 16px;
    padding: 7px;
    transform: rotate(45deg);
    letter-spacing: 0.7px;
  }
}

.label {
  color: #666;
}

.table {
  tbody {
    border-left: 1px solid #eee;
    border-right: 1px solid #eee;
    border-bottom: 1px solid #eee;
  }
}

.payment {
  border: 1px solid #dddddd;
  border-radius: 4px;

  .card {
    box-shadow: 0px 2px 16px rgba(0, 0, 0, 0.12);
    border: none;
    border-radius: 5px;

    p {
      background-color: #eeeeee;
      color: #000000;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      font-weight: 500;
    }

    &__item svg {
      opacity: 0.32;
    }
  }
}
.icon svg {
  width: 24px;
  margin-right: 10px;
}

.table-card {
  border: none;
  margin-bottom: 0;
}

tr td {
  padding: 1.25rem 0;
}

tr:last-child > td {
  border: none;
}

.card__item {
  margin-left: 10px;
}

@media (min-width: 1412px) {
  .card__item {
    margin-left: 56px;
  }
}
@media (max-width: 991px) {
  .right-sideblock {
    margin-left: 0 !important;
  }
}
</style>
