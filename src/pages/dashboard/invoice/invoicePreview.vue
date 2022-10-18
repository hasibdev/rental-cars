<script setup>
import { reactive, ref, watch } from 'vue'

// import OutlineBgBtn from "../../../components/buttons/OutlineBgBtn.vue"
import PrimaryButton from "../../../components/buttons/PrimaryButton.vue"
import BackButton from "@/components/buttons/BackButton.vue"
import CheckBox from '@/components/dashboard/form/CheckBox.vue'
import { useAxios, api } from '../../../use/useAxios'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import InputControl from "../../../components/dashboard/form/InputControl.vue"
import fileDownload from 'js-file-download'
import VuePdfEmbed from 'vue-pdf-embed'

const route = useRoute()
const toast = useToast()
const { t } = useI18n({ useScope: 'global' })
const { data: invoiceData, loading } = useAxios(`admin/invoice/view/${route.params.id}`)

const pdfLoading = ref(false)
const savepdfLoading = ref(false)

const pdfBlogUrl = ref('')
const fetchPDF = async () => {
  try {
    const res = await api.get(`admin/invoice/pdf/${route.params.id}`, {
      responseType: 'blob'
    })

    pdfBlogUrl.value = window.URL.createObjectURL(res.data)
  } catch (error) {
    //
  }
}
fetchPDF()

const pdfFrame = ref(null)
const printPdf = async () => {
  pdfFrame.value.print()
}
const saveprintPdf = async (inv_no, first_name, last_name) => {
  try {
    savepdfLoading.value = true
    const res = await api.get(`admin/invoice/pdf/${route.params.id}`, {
      responseType: 'blob',
    })

    fileDownload(res.data, `Rechnung_${inv_no}_${first_name}_${last_name}.pdf`)
    // const url = `${apiBaseUrl}/${res.data.location}${res.data.file_name}`
    // window.open(url)
  } catch (error) {
    console.error(error)
  } finally {
    savepdfLoading.value = false
  }
}

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
    await api.post(`admin/invoice/invoice-mail/${route.params.id}`, formData)
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
})
</script>

<template>

  <!-- <pre>{{invoiceData}}</pre> -->

  <!-- Loading -->
  <Loading v-if="loading" class="my-3" />

  <template v-if="!loading && invoiceData?.invoicesinfo?.customerinfo">
    <h5 class="d-flex align-items-center mb-4 pb-2">
      <BackButton /> <span class="ms-3"> {{t('dashboard-invoice.preview-invoice')}} </span>
    </h5>
    <!-- Main Row Left/right -->
    <div class="d-flex justify-content-center flex-wrap w-100 scrollbar">
      <!-- Invoice Preview col -->
      <div class="mb-4 " style="width: 596px;">
        <VuePdfEmbed ref="pdfFrame" :source="pdfBlogUrl" class="invoice_print">
          Loading...
        </VuePdfEmbed>
      </div>
      <!-- columns end-->

      <!-- Side buttons col -->
      <div class="mb-4 px-4" style="width: 350px; margin-left: 60px;">
        <PrimaryButton @click="printPdf" :loading="pdfLoading" class="w-100 mt-3 text-white">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 9V2H18V9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M6 18H4C3.46957 18 2.96086 17.7893 2.58579 17.4142C2.21071 17.0391 2 16.5304 2 16V11C2 10.4696 2.21071 9.96086 2.58579 9.58579C2.96086 9.21071 3.46957 9 4 9H20C20.5304 9 21.0391 9.21071 21.4142 9.58579C21.7893 9.96086 22 10.4696 22 11V16C22 16.5304 21.7893 17.0391 21.4142 17.4142C21.0391 17.7893 20.5304 18 20 18H18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M18 14H6V22H18V14Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>

          {{t('form-fields.print')}}
        </PrimaryButton>

        <PrimaryButton @click="saveprintPdf(invoiceData?.invoicesinfo?.invoice_no, invoiceData?.invoicesinfo?.customerinfo?.first_name, invoiceData?.invoicesinfo?.customerinfo?.last_name)" :loading="savepdfLoading" class="w-100 mt-3 text-white">
          <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.5 15V19C21.5 19.5304 21.2893 20.0391 20.9142 20.4142C20.5391 20.7893 20.0304 21 19.5 21H5.5C4.96957 21 4.46086 20.7893 4.08579 20.4142C3.71071 20.0391 3.5 19.5304 3.5 19V15" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M7.5 10L12.5 15L17.5 10" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M12.5 15V3" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>

          {{t('form-fields.save-as-pdf')}}
        </PrimaryButton>

        <app-link :path="`/reservierungen`">
          <PrimaryButton class="w-100 mt-3 text-white">
            <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.3842 19.5C20.0863 19.5 19.8277 19.2771 19.7779 18.9681C19.3339 16.286 16.8237 11.6049 10.4562 11.3314V14.7726C10.4562 15.0111 10.3274 15.2295 10.1225 15.3387C9.91758 15.4477 9.67091 15.4292 9.48339 15.2906L0.257619 8.47257C0.0959356 8.35307 0 8.16011 0 7.95456C0 7.74895 0.0959356 7.55604 0.257619 7.43658L9.48343 0.618581C9.67091 0.479986 9.91762 0.461441 10.1225 0.570544C10.3274 0.679646 10.4562 0.898106 10.4562 1.13655V4.62966C14.3922 5.03586 21 7.97531 21 18.8634C21 19.1946 20.7545 19.4705 20.4355 19.4978C20.4183 19.4992 20.4012 19.5 20.3842 19.5Z" fill="#ffffff" />
            </svg>
            {{t('dashboard-invoice.go-to-reservation')}}
          </PrimaryButton>
        </app-link>

        <!-- Mail section -->
        <div class="mt-5">
          <div v-for="(email, idx) in emailId" :key="idx" class="email__item mt-2">
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

          <PrimaryButton variant="light" class="w-100 mt-4" @click="sendEmail">
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
  </template>

</template>


<style lang="scss" scoped>
.invoice_print {
  border: 1px solid #ddd;
  border-radius: 5px;
  overflow: hidden;
}

// .invoice-left-side{
//   width: 600px;
//   overflow-x: auto;
// }
// .invoice-right-side{
//   width: 350px;
//   overflow-x: auto;
//   margin-left: 96px;
// }
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
  padding: 8px;
  transform: rotate(45deg);
  letter-spacing: 0.7px;
}
.paid__badge.paid {
  background: #46b276;
}
.paid__badge.not-paid {
  background: #f23e3d;
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
          background-color: #276ef1;
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
    }
  }

  tbody {
    // Even Odd
    tr.even td .span {
      background-color: #f6f7fb;
    }

    tr.odd td .span {
      background-color: #d4e2fc;
    }

    // Even Odd
    tr.even_row td .span {
      background-color: #f6f7fb;
    }

    tr.odd_row td .span {
      background-color: #d4e2fc;
    }

    // reset
    tr {
      padding: 0;

      td {
        padding: 0;

        .span {
          padding: 13px;
          display: block;
        }
      }
    }

    // Left right color
    tr {
      td:first-child {
        .span {
          border-left: 1px solid #276ef1;
        }
      }

      td:last-child {
        .span {
          border-right: 1px solid #276ef1;
        }
      }
    }

    // Bottom border
    tr:last-child .span {
      border-bottom: 1px solid #276ef1;
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
</style>
