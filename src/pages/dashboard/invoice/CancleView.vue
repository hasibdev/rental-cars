<script setup>
import { reactive, ref, watch } from 'vue'
import BackButton from '../../../components/buttons/BackButton.vue'
import PrimaryButton from '../../../components/buttons/PrimaryButton.vue'
import InputControl from '../../../components/dashboard/form/InputControl.vue'
import CheckBox from '../../../components/dashboard/form/CheckBox.vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAxios, api } from '@/use/useAxios'
import { useToast } from 'vue-toastification'
import fileDownload from 'js-file-download'
import VuePdfEmbed from 'vue-pdf-embed'

const { t } = useI18n()
const route = useRoute()
const toast = useToast()

const { data: invoiceData, loading } = useAxios(`admin/invoicecancellation/view/${route.params.id}`)

// Step
const activeStep = ref({
  id: 3,
  name: 'Publish invoice',
})
const steps = ref([
  {
    id: 1,
    name: t('billingSettings.cancellation-reason'),
  },
  {
    id: 2,
    name: t('dashboard-invoice.refund'),
  },
  {
    id: 3,
    name: t('dashboard-invoice.publish-invoice'),
  },
])

// Print /PDF
const pdfBlogUrl = ref('')
const fetchPDF = async () => {
  try {
    const res = await api.get(`admin/invoicecancellation/pdf/${invoiceData.value?.invoicecancalltion?.id}`, {
      responseType: 'blob'
    })

    pdfBlogUrl.value = window.URL.createObjectURL(res.data)
  } catch (error) {
    //
  }
}

const pdfFrame = ref(null)
const saveAsPrint = async () => {
  pdfFrame.value.print()
}

const saveAsPdf = async () => {
  try {
    const res = await api.get(`admin/invoicecancellation/pdf/${invoiceData.value?.invoicecancalltion?.id}`, {
      responseType: 'blob'
    })
    fileDownload(res.data, `invoice-cancle-${invoiceData.value.invoicecancalltion.id}.pdf`)
  } catch (error) {
    console.error(error)
  }
}

// Mail send
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

const sendEmailLoading = ref(false)
const sendEmail = async () => {
  try {
    sendEmailLoading.value = true
    const formData = new FormData()
    for (let i = 0; i < emailId.value.length; i++) {
      formData.append(`cc_email[${i}]`, emailId.value[i].cc_email ?? '')
    }
    formData.append('cc_me_status', sendEmailForm.cc_me_status)
    await api.post(`admin/invoicecancellation/cancellation-mail/${invoiceData.value?.cancellation?.id}`, formData)
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

watch(() => invoiceData.value, (newData) => {
  emailId.value[0].cc_email = newData.invoicesinfo.customerinfo.email

  fetchPDF()
})

</script>

<template>
  <Loading v-if="loading" class="my-3" />
  <template v-else>
    <h6 class="d-flex align-items-center mb-4">
      <BackButton /> <span class="ms-3"> {{t('dashboard-reservation.invoices')}} </span>
    </h6>
    <h5 class="mb-4 py-2">{{t('dashboard-invoice.cancellation')}}</h5>
    <!-- Main Row Left/right -->
    <div class="borderd-content">
      <div class="d-flex justify-content-center flex-wrap w-100 scrollbar">
        <!-- Invoice Preview col -->
        <div class="mb-4 mx-0" style="width: 696px;">
          <VuePdfEmbed ref="pdfFrame" :source="pdfBlogUrl" class="invoice_print" />
        </div>

        <div class="mb-4" style="width: 550px; margin-left: 32px;">
          <!-- Stepper -->
          <div class="stepper_wrapper my-4">
            <div v-for="(step, i) in steps" :key="i" class="step" :class="{'active': step.id <= activeStep.id }">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 2C19.713 2 23.274 3.475 25.8995 6.1005C28.525 8.72601 30 12.287 30 16C30 19.713 28.525 23.274 25.8995 25.8995C23.274 28.525 19.713 30 16 30C12.287 30 8.72601 28.525 6.1005 25.8995C3.475 23.274 2 19.713 2 16C2 12.287 3.475 8.72601 6.1005 6.1005C8.72601 3.475 12.287 2 16 2ZM14.256 18.762L11.146 15.65C11.0345 15.5385 10.9021 15.4501 10.7565 15.3897C10.6108 15.3294 10.4547 15.2983 10.297 15.2983C10.1393 15.2983 9.9832 15.3294 9.83752 15.3897C9.69185 15.4501 9.55949 15.5385 9.448 15.65C9.22283 15.8752 9.09633 16.1806 9.09633 16.499C9.09633 16.8174 9.22283 17.1228 9.448 17.348L13.408 21.308C13.5192 21.4201 13.6514 21.509 13.7972 21.5697C13.9429 21.6304 14.0992 21.6616 14.257 21.6616C14.4148 21.6616 14.5711 21.6304 14.7168 21.5697C14.8626 21.509 14.9948 21.4201 15.106 21.308L23.306 13.106C23.419 12.995 23.5089 12.8627 23.5705 12.7167C23.6321 12.5708 23.6641 12.4141 23.6649 12.2557C23.6656 12.0973 23.635 11.9403 23.5748 11.7938C23.5145 11.6473 23.4259 11.5142 23.3139 11.4021C23.202 11.29 23.069 11.2012 22.9225 11.1408C22.7761 11.0804 22.6191 11.0496 22.4607 11.0501C22.3023 11.0507 22.1456 11.0826 21.9996 11.144C21.8536 11.2054 21.7212 11.2951 21.61 11.408L14.256 18.762Z" fill="#DDDDDD" />
              </svg>
              <p class="mt-2">{{ step.name }}</p>
            </div>
          </div>

          <!-- Print / PDF / Email  -->
          <!-- Only show on publish invoice -->
          <div class="row mt-5">
            <div class="col-lg-9 col-xl-7 mx-auto">

              <PrimaryButton @click="saveAsPrint" class="w-100">
                <svg class="me-2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9V2H18V9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M6 18H4C3.46957 18 2.96086 17.7893 2.58579 17.4142C2.21071 17.0391 2 16.5304 2 16V11C2 10.4696 2.21071 9.96086 2.58579 9.58579C2.96086 9.21071 3.46957 9 4 9H20C20.5304 9 21.0391 9.21071 21.4142 9.58579C21.7893 9.96086 22 10.4696 22 11V16C22 16.5304 21.7893 17.0391 21.4142 17.4142C21.0391 17.7893 20.5304 18 20 18H18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M18 14H6V22H18V14Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>

                {{ t('button.print') }}
              </PrimaryButton>
              <PrimaryButton @click="saveAsPdf" variant="light" class="w-100 mt-4">
                <svg class="me-2" width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.5 15V19C21.5 19.5304 21.2893 20.0391 20.9142 20.4142C20.5391 20.7893 20.0304 21 19.5 21H5.5C4.96957 21 4.46086 20.7893 4.08579 20.4142C3.71071 20.0391 3.5 19.5304 3.5 19V15" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M7.5 10L12.5 15L17.5 10" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M12.5 15V3" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>

                {{ t('button.save-as-pdf') }}
              </PrimaryButton>

              <!-- Mail section -->
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
                <CheckBox v-model="sendEmailForm.cc_me_status" class="mt-3" :label="t('form-fields.cc-me')" style="display: block" />

                <PrimaryButton variant="light" class="w-100 mt-4" @click="sendEmail" :loading="sendEmailLoading">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_4203_5677)">
                      <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6ZM20 6L12 10.99L4 6H20ZM20 18H4V8L12 13L20 8V18Z" fill="black" fill-opacity="0.5" />
                    </g>
                    <defs>
                      <clipPath id="clip0_4203_5677">
                        <rect width="24" height="24" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>

                  {{ t('button.send-email') }}
                </PrimaryButton>

                <!-- <p class="text-12 fst-italic fw-lighter mt-2 mb-0">{{ t('dashboard-invoice.successfully-sent-on') }} 23, May 2022 03:44 PM</p> -->
              </div>

            </div>

          </div>

          <div class="row mt-5">
            <div class="col-lg-10 col-xl-9 mx-auto">
              <div class="d-flex bg-light-grey p-4 rounded-top">
                <div class="w-50">
                  <p class="text-black fw-500">{{t('billingSettings.cancellation-reason')}} </p>
                  <p class="text-black fw-500 mb-0">{{t("form-fields.payment-method")}} </p>
                </div>
                <div>
                  <p>{{ invoiceData?.invoicecancalltion?.reason_name }}</p>
                  <p class="mb-0">{{ invoiceData?.invoicecancalltion?.payment_method }}</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  </template>
</template>


<style lang="scss" scoped>
.invoice_print {
  border: 1px solid #ddd;
  border-radius: 5px;
  overflow: hidden;
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

.bg-light-grey {
  background: rgba(204, 206, 209, 0.32);
}

.invoice__content {
  position: relative;
  overflow: hidden;

  .paid__badge {
    position: absolute;
    top: 22px;
    right: -40px;

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
  .badge__sucess {
    background: #46b276;
  }
}

.stepper_wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
  width: 540px;

  .step {
    text-align: center;
    width: 150px;
    position: relative;

    &:not(:first-child)::after {
      content: "";
      width: 80px;
      height: 1px;
      background: #ddd;
      position: absolute;
      right: 90%;
      top: 15px;
    }

    &.active {
      color: #46b276;

      &::after {
        background: #46b276;
      }

      svg path {
        fill: #46b276;
      }
    }
  }
}

.invoice-out-padding {
  padding: 2rem;
}

.table_wrapper {
  thead {
    letter-spacing: 0.7px;

    tr {
      padding: 0;

      th {
        .span {
          background-color: #000000;
          display: block;
          padding: 15px;
        }

        padding: 0;
      }
    }

    tr:first-child th:first-child .span {
      border-top-left-radius: 5px;
    }

    tr:last-child th:last-child .span {
      border-top-right-radius: 5px;
      text-align: right;
    }
  }

  tbody {
    // Even Odd
    tr.even td .span {
      background-color: #eeeeee;
    }

    tr.odd td .span {
      background-color: #f6f7fb;
    }

    // Even Odd
    tr.even_row td .span {
      background-color: #eeeeee;
    }

    tr.odd_row td .span {
      background-color: #f6f7fb;
    }

    // reset
    tr {
      padding: 0;

      td {
        padding: 0;

        .span {
          padding: 13px;
          display: block;
          text-align: right;
        }
      }
    }

    // Left right color
    tr {
      td:first-child {
        .span {
          border-left: 1px solid #dddddd;
        }
      }

      td:last-child {
        .span {
          border-right: 1px solid #dddddd;
        }
      }
    }

    // Bottom border
    tr:last-child .span {
      border-bottom: 1px solid #dddddd;
    }

    // Border radius
    tr:last-child td:first-child .span {
      border-bottom-left-radius: 5px;
      overflow: hidden;
    }

    tr:last-child td:last-child .span {
      border-bottom-right-radius: 5px;
      overflow: hidden;
    }
  }
}

#print_area.border-content {
  // border-bottom: 1px solid transparent;
  border-bottom: none !important;
  border-radius: 5px 5px 0px 0px !important;
}

.footer {
  border: 1px solid #ddd;
  border-top: none !important;
  border-radius: 0px 0px 5px 5px;
}

.divider {
  width: 90px;
  height: 1px;
}

.card {
  background: #ffffff;
  box-shadow: 0px 0px 35px rgba(0, 0, 0, 0.09);
  border-radius: 4px;
  border: none !important;

  .card-header {
    background: rgba(204, 206, 209, 0.32);
    border-radius: 4px 4px 0px 0px;
    padding: 20px 20px 8px 20px;
    border: none;

    .text-40 {
      font-size: 40px;
    }
  }

  .card-body {
    padding: 40px 60px 30px 60px;
  }
}
</style>
