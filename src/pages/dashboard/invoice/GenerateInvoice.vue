<script setup>
import { onBeforeMount, computed, ref } from 'vue'

import OutlineBgBtn from "../../../components/buttons/OutlineBgBtn.vue"
import PrimaryButton from "../../../components/buttons/PrimaryButton.vue"
import { useInvoiceStore } from '../../../stores/invoice'
import { useAuthStore } from '../../../stores/auth'
import { useRouter } from 'vue-router'
// import { apiBaseUrl } from '@/main'
import { api } from '../../../use/useAxios'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { formPreview, formCustomer, invoiceStage, clearForm } = useInvoiceStore()
const { user } = useAuthStore()
const toast = useToast()
const { locale } = useI18n({ useScope: 'global' })

// Before Mount
onBeforeMount(() => {
  if (!invoiceStage.hasData) {
    router.replace(`/rechnung/erstellen`)
  }
})

const hasTerms = computed(() => {
  return formPreview.termas_conditions.filter(con => con.description).length
})

const savingState = ref(false)
const saveInvoice = async () => {
  try {
    savingState.value = true
    const res = await api.post('admin/invoice/store', {
      ...formPreview,
      termas_conditions: formPreview.termas_conditions.filter(tc => tc.description.trim())
    })
    toast.success("Created Successfully")

    router.push(`/rechnung/vorschau/${res.data.invoice_id}`)

    clearForm()
  } catch (error) {
    console.error(error)
    toast.error('Request Fail!')
  } finally {
    savingState.value = false
  }
}


</script>

<template>

  <h5 class="mb-4 pb-2">Invoice Preview</h5>
  <!-- Main Row Left/right -->
  <div class="row">
    <!-- Invoice Preview col -->
    <div class="col-lg-8 col-xl-8">
      <div id="print_area" class="borderd-content invoice-out-padding" style="padding-bottom: 0;">
        <div class="row">
          <div class="col">
            <img src="@/assets/images/roadstars-invoice.png" alt="Logo" style="width: 200px;">
          </div>
          <!-- Header logo -->
          <div class="col d-flex justify-content-end">
            <div>
              <h1>INVOICE</h1>
              <h5>#{{formPreview.invoice_no}}</h5>
            </div>
          </div>

          <!-- Customer Info -->
          <div class="mt-5">
            <h5>Billed To</h5>

            <div class="row mt-4">
              <div class="col-3">
                <div class="d-flex">
                  <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M13.3332 14V12.6667C13.3332 11.9594 13.0522 11.2811 12.5521 10.781C12.052 10.281 11.3737 10 10.6665 10H5.33317C4.62593 10 3.94765 10.281 3.44755 10.781C2.94746 11.2811 2.6665 11.9594 2.6665 12.6667V14"
                      stroke="#9A9DA3" stroke-linecap="round" stroke-linejoin="round" />
                    <path
                      d="M8.00016 7.33333C9.47292 7.33333 10.6668 6.13943 10.6668 4.66667C10.6668 3.19391 9.47292 2 8.00016 2C6.5274 2 5.3335 3.19391 5.3335 4.66667C5.3335 6.13943 6.5274 7.33333 8.00016 7.33333Z"
                      stroke="#9A9DA3" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>

                  <p class="ms-3 text-muted">{{ formCustomer.full_name }}</p>
                </div>

                <div class="d-flex">
                  <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M14.6665 11.2807V13.2807C14.6672 13.4664 14.6292 13.6502 14.5548 13.8203C14.4804 13.9904 14.3713 14.1431 14.2345 14.2686C14.0977 14.3941 13.9362 14.4897 13.7603 14.5492C13.5844 14.6087 13.398 14.6308 13.2131 14.614C11.1617 14.3911 9.19113 13.6901 7.45979 12.5674C5.84901 11.5438 4.48335 10.1782 3.45979 8.56738C2.33311 6.82818 1.63195 4.84804 1.41313 2.78738C1.39647 2.60303 1.41838 2.41722 1.47746 2.2418C1.53654 2.06637 1.63151 1.90518 1.7563 1.76846C1.8811 1.63175 2.033 1.52252 2.20232 1.44773C2.37164 1.37294 2.55469 1.33422 2.73979 1.33405H4.73979C5.06333 1.33086 5.37699 1.44543 5.6223 1.6564C5.86761 1.86737 6.02784 2.16035 6.07313 2.48072C6.15754 3.12076 6.31409 3.7492 6.53979 4.35405C6.62949 4.59266 6.6489 4.85199 6.59573 5.1013C6.54256 5.35061 6.41903 5.57946 6.23979 5.76072L5.39313 6.60738C6.34216 8.27641 7.7241 9.65834 9.39313 10.6074L10.2398 9.76071C10.4211 9.58147 10.6499 9.45795 10.8992 9.40478C11.1485 9.35161 11.4078 9.37102 11.6465 9.46071C12.2513 9.68641 12.8797 9.84297 13.5198 9.92738C13.8436 9.97307 14.1394 10.1362 14.3508 10.3857C14.5622 10.6352 14.6746 10.9538 14.6665 11.2807Z"
                      stroke="#9A9DA3" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>

                  <p class="ms-3 text-muted">{{ formCustomer.phone }} </p>
                </div>
              </div>
              <div class="col-5">
                <div class="d-flex">
                  <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M2.66683 2.66602H13.3335C14.0668 2.66602 14.6668 3.26602 14.6668 3.99935V11.9993C14.6668 12.7327 14.0668 13.3327 13.3335 13.3327H2.66683C1.9335 13.3327 1.3335 12.7327 1.3335 11.9993V3.99935C1.3335 3.26602 1.9335 2.66602 2.66683 2.66602Z"
                      stroke="#9A9DA3" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M14.6668 4L8.00016 8.66667L1.3335 4" stroke="#9A9DA3" stroke-linecap="round"
                      stroke-linejoin="round" />
                  </svg>

                  <p class="ms-3 text-muted">{{ formCustomer.email }}</p>
                </div>

                <div class="d-flex">
                  <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M14 6.66602C14 11.3327 8 15.3327 8 15.3327C8 15.3327 2 11.3327 2 6.66602C2 5.07472 2.63214 3.54859 3.75736 2.42337C4.88258 1.29816 6.4087 0.666016 8 0.666016C9.5913 0.666016 11.1174 1.29816 12.2426 2.42337C13.3679 3.54859 14 5.07472 14 6.66602Z"
                      stroke="#9A9DA3" stroke-linecap="round" stroke-linejoin="round" />
                    <path
                      d="M8 8.66602C9.10457 8.66602 10 7.77059 10 6.66602C10 5.56145 9.10457 4.66602 8 4.66602C6.89543 4.66602 6 5.56145 6 6.66602C6 7.77059 6.89543 8.66602 8 8.66602Z"
                      stroke="#9A9DA3" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>

                  <p class="ms-3 text-muted">
                    {{ formCustomer.address }}
                    <span v-if="formCustomer.city !== 'null'">, {{formCustomer.city }}</span>
                    <span v-if="formCustomer.country !== 'null'">, {{ formCustomer.country }}</span>
                  </p>
                </div>
              </div>
              <div class="col-4">
                <div class="d-flex justify-content-end">
                  <p class="ms-3"><span class="text-muted">Invoice Date : <strong style="white-space: nowrap;">{{
                  moment(formPreview.invoice_date).format('DD MMM YYYY') }}</strong></span></p>
                </div>

                <div class="d-flex justify-content-end">
                  <p v-if="formPreview.due_date" class="ms-3"><span class="text-muted">Due Date : <strong
                        style="white-space: nowrap;">{{ moment(formPreview.due_date).format('DD MMM YYYY')
                        }}</strong></span></p>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- List -->
        <div class="table_wrapper mt-4">
          <table class="table table-borderless fw-500">
            <thead class="text-white">
              <tr>
                <th><span class="span">Description</span></th>
                <th><span class="span">Quantity</span></th>
                <th><span class="span">Rate</span></th>
                <th><span class="span">Amount</span></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in formPreview.lines" :key="i" :class="i % 2 == 0 ? 'even_row' : 'odd_row'">
                <td><span class="span">{{ item.description }}</span> </td>
                <td><span class="span">{{ item.quantity }}</span> </td>
                <td><span class="span">{{ moneyFormat(item.rate, locale) }}</span> </td>
                <td><span class="span">{{ moneyFormat(item.amount, locale) }}</span> </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Total summery -->
        <div class="row mt-5">
          <div class="col-lg-6">
            <h5 class="mb-3 mt-5">Payment Method</h5>
            <!-- <img src="@/assets/images/sepa_card.png" class="img-fluid"> -->
            <h5>{{ formPreview.accepted_payment_method }}</h5>
          </div>
          <div class="col-lg-5 ms-auto">
            <div class="row mt-2">
              <div class="col-7 text-right text-muted">Subtotal</div>
              <div class="col-4 mx-auto text-left fw-bold">{{ moneyFormat(Number(formPreview.sub_total).toFixed(2),
              locale) }}</div>
            </div>
            <div class="row mt-2">
              <div class="col-7 text-right text-muted">Tax({{formPreview.tax}})</div>
              <div class="col-4 mx-auto text-left fw-bold">{{ moneyFormat(Number(formPreview.tax_amount).toFixed(2),
              locale) }}</div>
            </div>
            <div class="row mt-2">
              <div class="col-7 text-right text-muted">Discout</div>
              <div class="col-4 mx-auto text-left fw-bold">{{
              moneyFormat(Number(formPreview.discount_amount).toFixed(2), locale) }}</div>
            </div>
            <div class="row mt-2">
              <div class="col-7 text-right text-muted">Total amount paid</div>
              <div class="col-4 mx-auto text-left fw-bold">{{
              moneyFormat(Number(formPreview.total_amount_paid).toFixed(2), locale) }}</div>
            </div>
            <div class="row mt-2">
              <div class="col-7 text-right text-muted">To Pay</div>
              <div class="col-4 mx-auto text-left fw-bold">{{ moneyFormat(Number(formPreview.due_amount).toFixed(2),
              locale) }}</div>
            </div>

            <div class="row mt-2 bg-primary text-white rounded py-2">
              <div class="col-7 text-right">Grand Totalx</div>
              <div class="col-4 mx-auto text-left fw-bold">{{ moneyFormat(formPreview.paid_amount, locale) }}</div>
            </div>

          </div>
        </div>

        <!-- Terms & Conditions -->
        <div class="row align-items-center pt-5 mt-5" style="margin-left: -2.75rem; margin-right: -2.75rem;">
          <div class="col-7" style="position: relative">
            <img :src="require('@/assets/images/invoice-preview.png')" class="img-fluid" style="max-height: 17.5rem; "
              alt="" />
            <div style="position: absolute; top: 10%; left: 5% transform: height: 100%" class="ps-4">
              <!-- Terms -->
              <template v-if="hasTerms">
                <div class="h5 text-dark pb-2 fw-500">Terms & Conditions</div>
                <div v-for="(term, i) in formPreview.termas_conditions" :key="i" class="text-muted text-14 pb-2">
                  {{ i+1 }}. {{ term.description }}
                </div>
              </template>

              <!-- Note -->
              <template v-if="formPreview.addiontal_notes">
                <h5 class=" text-dark pt-3 pb-2 fw-500">Additional Notes</h5>
                <p class="text-muted text-14 pb-2">{{ formPreview.addiontal_notes }}</p>
              </template>
            </div>
          </div>
          <div class="col-5 pb-1">

            <div class="text-center">
              <!-- <div class="fs-1">
                    <img :src="formPreview.singature" alt="Signature" class="img-fluid">
                  </div> -->

              <h6>With kind regards</h6>
              <h3>{{ user?.name }}</h3>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f2f2f2; margin-left: -2rem; margin-right: -2rem;" class="py-3">
          <div class="d-md-flex justify-content-center align-items-center">
            <div class="d-flex justify-content-center align-items-center mx-3">
              <svg width="13" height="16" viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12.4545 6.72727C12.4545 11.1818 6.72727 15 6.72727 15C6.72727 15 1 11.1818 1 6.72727C1 5.20831 1.60341 3.75155 2.67748 2.67748C3.75155 1.60341 5.20831 1 6.72727 1C8.24624 1 9.70299 1.60341 10.7771 2.67748C11.8511 3.75155 12.4545 5.20831 12.4545 6.72727Z"
                  stroke="#676B74" stroke-linecap="round" stroke-linejoin="round" />
                <path
                  d="M6.72696 8.63654C7.78132 8.63654 8.63605 7.78181 8.63605 6.72745C8.63605 5.67309 7.78132 4.81836 6.72696 4.81836C5.6726 4.81836 4.81787 5.67309 4.81787 6.72745C4.81787 7.78181 5.6726 8.63654 6.72696 8.63654Z"
                  stroke="#676B74" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <div class="text-12 ms-2" style="color: #676B74;">Kaiser-Friedrich Str. 65 10627 Berlin</div>
            </div>
            <div class="d-flex justify-content-center align-items-center mx-3">
              <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M2.33268 1.33398H11.666C12.3077 1.33398 12.8327 1.85898 12.8327 2.50065V9.50065C12.8327 10.1423 12.3077 10.6673 11.666 10.6673H2.33268C1.69102 10.6673 1.16602 10.1423 1.16602 9.50065V2.50065C1.16602 1.85898 1.69102 1.33398 2.33268 1.33398Z"
                  stroke="#676B74" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M12.8327 2.50195L6.99935 6.58529L1.16602 2.50195" stroke="#676B74" stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
              <div class="text-12 ms-2" style="color: #676B74;">info@roadstars-cars.de</div>
            </div>
            <div class="d-flex justify-content-center align-items-center mx-3">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12.8097 9.90271V11.659C12.8104 11.8221 12.777 11.9834 12.7116 12.1328C12.6463 12.2822 12.5505 12.4163 12.4304 12.5265C12.3102 12.6368 12.1684 12.7207 12.0139 12.7729C11.8595 12.8252 11.6958 12.8446 11.5334 12.8299C9.73197 12.6341 8.00152 12.0186 6.48115 11.0326C5.06664 10.1338 3.86738 8.9345 2.96854 7.51999C1.97914 5.99271 1.36342 4.25385 1.17126 2.44427C1.15663 2.28238 1.17587 2.11922 1.22775 1.96517C1.27963 1.81112 1.36303 1.66956 1.47262 1.54951C1.58221 1.42945 1.7156 1.33353 1.86429 1.26785C2.01298 1.20218 2.17372 1.16818 2.33627 1.16803H4.09257C4.37669 1.16523 4.65213 1.26584 4.86755 1.4511C5.08297 1.63637 5.22368 1.89364 5.26344 2.17497C5.33757 2.73703 5.47505 3.2889 5.67325 3.82004C5.75201 4.02959 5.76906 4.25731 5.72237 4.47625C5.67568 4.69518 5.5672 4.89614 5.4098 5.05531L4.6663 5.79881C5.4997 7.26447 6.71325 8.47802 8.17891 9.31142L8.92241 8.56792C9.08158 8.41052 9.28254 8.30204 9.50147 8.25535C9.72041 8.20866 9.94813 8.22571 10.1577 8.30447C10.6888 8.50267 11.2407 8.64015 11.8027 8.71428C12.0871 8.7544 12.3469 8.89764 12.5325 9.11676C12.7182 9.33588 12.8168 9.6156 12.8097 9.90271Z"
                  stroke="#676B74" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <div class="text-12 ms-2" style="color: #676B74;">+49 173 694 5581</div>
            </div>
          </div>
        </div>

      </div>

    </div> <!-- columns end-->

    <!-- Side buttons col -->
    <div class="col-lg-4 col-xl-3 mx-auto">
      <app-link :path="`/rechnung/erstellen`">
        <OutlineBgBtn class="w-100 mt-3">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M11.3335 1.99955C11.5086 1.82445 11.7165 1.68556 11.9452 1.5908C12.174 1.49604 12.4192 1.44727 12.6668 1.44727C12.9145 1.44727 13.1597 1.49604 13.3884 1.5908C13.6172 1.68556 13.8251 1.82445 14.0002 1.99955C14.1753 2.17465 14.3142 2.38252 14.4089 2.61129C14.5037 2.84006 14.5524 3.08526 14.5524 3.33288C14.5524 3.58051 14.5037 3.8257 14.4089 4.05448C14.3142 4.28325 14.1753 4.49112 14.0002 4.66622L5.00016 13.6662L1.3335 14.6662L2.3335 10.9995L11.3335 1.99955Z"
              stroke="#276EF1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>

          <span class="ms-3">Edit</span>
        </OutlineBgBtn>
      </app-link>

      <PrimaryButton @click="saveInvoice" :loading="savingState" class="w-100 mt-3 text-white">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M13 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V9L13 2Z"
            stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M13 2V9H20" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

        Create Invoice
      </PrimaryButton>

    </div>
  </div>

</template>


<style lang="scss" scoped>
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
