<script setup>
import { useAxios } from '@/use/useAxios'
import { useRoute } from 'vue-router'

import LoadingView from '@/components/common/LoadingView.vue'
import Switcher from "@/components/dashboard/form/Switcher.vue"
import { imageBaseUrl } from '@/main'
import moment from "moment"
import { api } from "@/use/useAxios"
import { useToast } from "vue-toastification"

import StatusButton from "@/components/dashboard/shared/StatusButton.vue"
import BackButton from '@/components/buttons/BackButton.vue'

import { useI18n } from 'vue-i18n'
const route = useRoute()
const { t, locale } = useI18n({ useScope: 'global' })
const toast = useToast()

const { data: vehicleData, loading } = useAxios(`/admin/vehicle/view/${route.params.id}`)
const { data: fleetClasseData } = useAxios('/admin/fleetclass')
const { data: locationData } = useAxios('/get-location')

const getStatus = (val) => {
  if (val == 'Reserved') return 'info'
  if (val == 'Rented') return 'warning'
  if (val == 'Completed') return 'success'
  if (val == 'Cancelled') return 'danger'

  return 'primary'
}

// Change Status
const onStatusChange = async (val, row) => {
  try {
    await api.post(`/admin/vehicle/status/${row.id}`, {
      status: val,
    })
    toast.success(`${t('FleetIndex.statusUpdateText')}`)
  } catch (error) {
    row.status = !row.status

    console.error(error)
    toast.error(`${t('FleetIndex.statusUpdateFailureText')}`)
  }
}

</script>

<template>

  <div class="d-flex justify-content-between align-items-center">
    <div class="d-flex align-items-center mb-4">
      <BackButton /> <span class="add-fleet__title ms-3">{{t('FleetView.vehicle-details')}}</span>
    </div>
    <button class="btn btn-dark">
      <app-link class="w-100 text-white" path="/flotte/erstellen">
        <svg width="24" height="21" viewBox="0 0 24 21" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M6.85744 11.4024C6.85744 12.1432 6.25645 12.7437 5.51561 12.7437C4.77477 12.7437 4.17432 12.1432 4.17432 11.4024C4.17432 10.6615 4.77479 10.0605 5.51561 10.0605C6.25644 10.0605 6.85744 10.6615 6.85744 11.4024Z"
            fill="#EEEEEE" />
          <path
            d="M19.6768 11.4024C19.6768 12.1432 19.0763 12.7437 18.3355 12.7437C17.5947 12.7437 16.9937 12.1432 16.9937 11.4024C16.9937 10.6615 17.5946 10.0605 18.3355 10.0605C19.0763 10.0605 19.6768 10.6615 19.6768 11.4024Z"
            fill="#EEEEEE" />
          <path
            d="M20.9438 6.48411L19.7512 2.53394C19.3041 0.968511 17.8879 0 16.3225 0H7.45311C5.88769 0 4.54639 1.04341 4.02441 2.53394L2.83179 6.48411C1.19263 7.45318 0 9.24164 0 11.4033V14.3843C0 15.8748 1.19262 17.0675 2.68313 17.0675H2.83233V17.1418V19.0795C2.83233 19.6015 3.27944 20.0485 3.8014 20.0485C4.32337 20.0485 4.77046 19.6014 4.77046 19.0795V17.1418V17.0675H19.2295V17.1418V19.0795C19.2295 19.6015 19.6766 20.0485 20.1986 20.0485C20.7206 20.0485 21.1677 19.6014 21.1677 19.0795V17.1418V17.0675H21.3169C22.8074 17.0675 24 15.8748 24 14.3843V11.4033C23.8503 9.24164 22.6576 7.45315 20.9436 6.48411H20.9438ZM5.06863 5.81345L5.8885 3.05591C6.11205 2.31038 6.78272 1.78894 7.52819 1.78894L16.3975 1.78842C17.1431 1.78842 17.8138 2.3104 18.0372 3.05539L18.8571 5.81293H5.66493L5.06863 5.81345ZM21.9872 14.3843C21.9872 14.8314 21.6145 15.2042 21.1674 15.2042H2.68361C2.2365 15.2042 1.86373 14.8314 1.86373 14.3843V11.4033C1.86373 9.31643 3.50342 7.67673 5.5903 7.67673H18.2605C20.273 7.67673 21.987 9.31643 21.987 11.4033L21.9872 14.3843Z"
            fill="#EEEEEE" />
        </svg>
        <span class="ms-3">{{t('dashboard-fleet.add-fleet')}}</span>
      </app-link>
    </button>
  </div>
  <LoadingView :loading="loading">
    <div class="row mx-0 mt-3 ">
      <div class="col-xl-9 col-md-12 px-0">
        <div class="row mx-0 mb-2 fleet-view-header">
          <div class="col-md-4 col-sm-12">
            <div class="card mb-2">
              <div class="card-body">
                <div class="row mx-0 d-flex align-items-center mb-3">
                  <div class="col-sm-2">
                    <svg width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M10.2898 2.86118L1.81978 17.0012C1.64514 17.3036 1.55274 17.6465 1.55177 17.9957C1.55079 18.3449 1.64127 18.6883 1.8142 18.9917C1.98714 19.2951 2.2365 19.5479 2.53748 19.725C2.83847 19.9021 3.18058 19.9973 3.52978 20.0012H20.4698C20.819 19.9973 21.1611 19.9021 21.4621 19.725C21.7631 19.5479 22.0124 19.2951 22.1854 18.9917C22.3583 18.6883 22.4488 18.3449 22.4478 17.9957C22.4468 17.6465 22.3544 17.3036 22.1798 17.0012L13.7098 2.86118C13.5315 2.56729 13.2805 2.3243 12.981 2.15567C12.6814 1.98703 12.3435 1.89844 11.9998 1.89844C11.656 1.89844 11.3181 1.98703 11.0186 2.15567C10.7191 2.3243 10.468 2.56729 10.2898 2.86118V2.86118Z"
                        stroke="#F56C6B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M12 8V12" stroke="#F56C6B" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" />
                      <path d="M12 16H12.01" stroke="#F56C6B" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" />
                    </svg>
                  </div>
                  <div class="col-sm-10">
                    <span class="text-13">{{t('FleetView.damages')}}</span>
                  </div>
                </div>
                <!-- <h5>{{vehicleData?.datainfo.fuel_lable || ''}}</h5> -->
                <div class="row mx-0">
                  <div class="col-sm-10 offset-sm-2">
                    <h5 v-if="vehicleData.datainfo.art_count === null">0</h5>
                    <h5 v-else>{{vehicleData.datainfo.art_count}} </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-4 col-sm-12">
            <div class="card mb-2">
              <div class="card-body">
                <div class="row mx-0 d-flex align-items-center mb-3">
                  <div class="col-sm-2">
                    <svg width="26" height="22" viewBox="0 0 26 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M21.5658 12.2965H23.4646C23.4624 12.2631 23.46 12.2298 23.4575 12.1965M21.5658 12.2965L20.9022 6.09881C20.9242 6.12398 20.946 6.14925 20.9678 6.17463M21.5658 12.2965C21.178 12.2979 20.8643 12.6118 20.8627 12.9996C20.8619 13.1867 20.9356 13.3665 21.0675 13.4995M21.5658 12.2965L21.0675 13.4995M23.4575 12.1965H23.5578C23.3841 9.87555 22.4649 7.76529 21.0386 6.1036L20.9678 6.17463M23.4575 12.1965C23.2843 9.90318 22.3762 7.81796 20.9678 6.17463M23.4575 12.1965H21.5658L21.5654 12.1965C21.1226 12.1981 20.7645 12.5566 20.7627 12.9992C20.7618 13.2128 20.8459 13.4181 20.9965 13.5699M20.9678 6.17463L19.6307 7.51568L19.6306 7.51573C19.4793 7.66724 19.2741 7.75247 19.06 7.75247C18.8459 7.75247 18.6406 7.66725 18.4895 7.51568M18.4895 7.51568L18.9059 19.637M18.4895 7.51568L18.5603 7.44508L18.4897 7.51584C18.4896 7.51579 18.4895 7.51573 18.4895 7.51568ZM20.9965 13.5699C21.147 13.7217 21.3516 13.8073 21.5654 13.8082H21.5658H23.456M20.9965 13.5699L21.0675 13.4995M20.9965 13.5699C20.9965 13.5699 20.9965 13.5699 20.9965 13.5699L21.0675 13.4995M23.456 13.8082C23.2929 15.9285 22.4915 17.9498 21.1543 19.6023M23.456 13.8082C23.4586 13.7749 23.461 13.7416 23.4633 13.7082L23.456 13.8082ZM21.1543 19.6023L20.043 18.4949L19.972 18.5654M21.1543 19.6023C21.1332 19.6284 21.112 19.6543 21.0907 19.6801L19.972 18.5654M21.1543 19.6023L21.2255 19.6733L18.9766 19.5663M19.972 18.5654L20.0426 18.4945L20.0428 18.4947C19.8915 18.3426 19.686 18.2572 19.4716 18.2572L19.4708 18.2572C19.2587 18.2588 19.0558 18.3441 18.9061 18.4945M19.972 18.5654C19.8395 18.432 19.6595 18.3572 19.4716 18.3572C19.2857 18.3586 19.1078 18.4334 18.9766 18.5654M18.9061 18.4945C18.7541 18.6456 18.6685 18.8513 18.6685 19.0658C18.6685 19.2803 18.7541 19.4858 18.9059 19.637M18.9061 18.4945L18.9766 18.5654M18.9061 18.4945C18.906 18.4946 18.9059 18.4947 18.9057 18.4949L18.9766 18.5654M18.9059 19.637L18.9766 19.5663M18.9059 19.637L18.9766 19.5663M18.9766 19.5663L18.9061 19.6371L20.6196 21.3507L20.6194 21.3509L20.6238 21.3546L20.6304 21.3643L20.6475 21.3753L20.6476 21.3754C20.6919 21.416 20.7405 21.4515 20.7927 21.4813C20.7965 21.4838 20.8002 21.4861 20.8036 21.4882L20.8035 21.4883L20.8082 21.4908C21.1221 21.6606 21.5102 21.6035 21.762 21.3507L21.7623 21.3505C21.7841 21.3284 21.8047 21.305 21.8239 21.2803C23.9287 19.038 25.1 16.0772 25.1 13C25.1 6.32564 19.6742 0.9 12.9999 0.9C6.32556 0.9 0.9 6.32556 0.9 12.9999C0.9 16.075 2.07514 19.0337 4.17702 21.2757C4.19699 21.302 4.21863 21.3269 4.24156 21.3502L4.242 21.3507C4.39316 21.5027 4.59891 21.5881 4.81337 21.5881C5.0278 21.5881 5.23325 21.5028 5.38454 21.3509L18.9766 19.5663ZM18.9766 19.5663C18.8435 19.4337 18.7685 19.2537 18.7685 19.0658C18.7685 18.8779 18.8435 18.6977 18.9766 18.5654M18.9766 19.5663L20.6903 21.2799L18.9766 19.5663ZM6.52842 18.2574H6.52863C6.74236 18.2579 6.94733 18.3432 7.0982 18.4949C7.25013 18.646 7.33547 18.8517 7.33547 19.066C7.33547 19.2805 7.25008 19.4859 7.0982 19.6372L6.52842 18.2574ZM6.52842 18.2574C6.31407 18.2574 6.1084 18.3427 5.95725 18.4949M6.52842 18.2574L5.95725 18.4949M5.95725 18.4949L5.95699 18.4951M5.95725 18.4949L5.95699 18.4951M5.95699 18.4951L4.84971 19.6024C3.51187 17.95 2.70773 15.9287 2.54399 13.8085L4.43242 13.8085C4.43249 13.8085 4.43257 13.8085 4.43265 13.8085H4.43283V13.7085C4.62093 13.7092 4.80172 13.6348 4.93467 13.5017C5.0678 13.3687 5.14225 13.1879 5.14147 12.9998C5.14068 12.8125 5.06564 12.6333 4.9327 12.5015M5.95699 18.4951L5.00538 13.5724M4.9327 12.5015L5.00315 12.4306M4.9327 12.5015C4.79976 12.3696 4.61994 12.2959 4.43283 12.2967M4.9327 12.5015L5.00309 12.4305C5.00311 12.4305 5.00313 12.4305 5.00315 12.4306M5.00315 12.4306C5.15493 12.581 5.24057 12.7857 5.24147 12.9994C5.24236 13.2141 5.15739 13.4206 5.00538 13.5724M5.00315 12.4306L4.43283 12.2967M5.00538 13.5724C5.0054 13.5724 5.00541 13.5723 5.00543 13.5723L4.93471 13.5017L5.00532 13.5724C5.00534 13.5724 5.00536 13.5724 5.00538 13.5724ZM4.43283 12.2967V12.1967H4.43265L13 5.14268C12.8127 5.1419 12.6335 5.06686 12.5018 4.93391M4.43283 12.2967L4.43241 12.1967L2.54245 12.1967C2.71572 9.9023 3.62417 7.81555 5.03358 6.17179L6.37341 7.51553C6.37343 7.51555 6.37345 7.51556 6.37346 7.51558C6.52462 7.66761 6.73035 7.75301 6.94478 7.75301C7.15923 7.75301 7.36468 7.66761 7.51597 7.51572C7.66743 7.36444 7.75263 7.15921 7.75263 6.94516C7.75263 6.73109 7.66741 6.52579 7.51584 6.37468L6.17197 5.03342C7.81571 3.62403 9.90196 2.71648 12.1969 2.54364L12.1969 4.43363C12.1969 4.43371 12.1969 4.43378 12.1969 4.43386V4.43405H12.2969M12.2969 4.43405C12.2961 4.62115 12.3698 4.80097 12.5018 4.93391M12.2969 4.43405V2.53659V4.43405ZM12.5018 4.93391L12.4307 5.00431C12.4307 5.00433 12.4308 5.00434 12.4308 5.00436M12.5018 4.93391L12.4308 5.00436M12.4308 5.00436C12.5812 5.15615 12.7859 5.24178 12.9996 5.24268C13.2143 5.24358 13.4207 5.15863 13.5725 5.00664L12.4308 5.00436ZM13.8087 2.5437L13.8087 4.43363L13.8087 2.5437ZM13.8087 2.5437C16.1019 2.71771 18.1854 3.6258 19.8282 5.03492M13.8087 2.5437L19.8282 5.03492M19.8282 5.03492L18.4897 6.37473L19.8282 5.03492ZM5.3847 21.3507L7.09805 19.6374L5.3847 21.3507ZM17.6974 9.44441L17.6976 9.4442C18.0102 9.12986 18.0102 8.62215 17.6976 8.3078C17.5463 8.15557 17.3407 8.07018 17.1262 8.07018C16.9119 8.07018 16.7062 8.15554 16.555 8.30771C16.5549 8.30777 16.5549 8.30784 16.5548 8.30791L13.802 11.0607C13.5542 10.9568 13.2836 10.8992 12.9999 10.8992C11.8483 10.8992 10.8981 11.8479 10.8981 12.9996C10.8981 14.1513 11.8482 15.1014 12.9999 15.1014C14.1516 15.1014 15.1003 14.1512 15.1003 12.9996C15.1003 12.7174 15.0431 12.4484 14.9401 12.2018L17.6974 9.44441ZM13.3432 12.6516L13.3426 12.6521L13.352 12.6599C13.3581 12.665 13.3645 12.6702 13.3711 12.6755C13.4443 12.7597 13.4888 12.8717 13.4888 12.9996C13.4888 13.2778 13.2783 13.4883 13.0001 13.4883C12.7219 13.4883 12.5114 13.2778 12.5114 12.9996C12.5114 12.7214 12.7217 12.5109 12.9999 12.5109C13.1261 12.5109 13.2365 12.5547 13.3207 12.6268C13.3279 12.6349 13.3354 12.6432 13.3432 12.6516ZM18.4896 6.37486L18.5603 6.44554L18.4896 6.37486Z"
                        fill="#528BF4" stroke="#528BF4" stroke-width="0.2" />
                    </svg>
                  </div>
                  <div class="col-sm-10">
                    <span class="text-13">{{t("FleetView.odometer")}}</span>
                  </div>
                </div>
                <div class="row mx-0">
                  <div class="col-sm-10 offset-sm-2">
                    <h5>{{vehicleData.datainfo.odometer}}</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-4 col-sm-12">
            <div class="card mb-2">
              <div class="card-body">
                <div class=" row mx-0 d-flex align-items-center mb-3">
                  <div class="col-sm-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M13.4133 22.6668H3.93333C3.68232 22.6748 3.43225 22.6323 3.198 22.5418C2.96375 22.4512 2.75009 22.3145 2.56973 22.1398C2.38937 21.965 2.24599 21.7558 2.14811 21.5245C2.05024 21.2932 1.99987 21.0446 2 20.7934V3.2401C2.01911 2.72842 2.24041 2.24522 2.61536 1.89652C2.99031 1.54781 3.48828 1.36209 4 1.3801H13.48C13.7255 1.37461 13.9695 1.41901 14.1973 1.51062C14.425 1.60223 14.6318 1.73915 14.8051 1.91307C14.9784 2.08698 15.1146 2.29428 15.2054 2.52239C15.2962 2.7505 15.3397 2.99467 15.3333 3.2401V20.7934C15.3325 21.0432 15.2819 21.2902 15.1846 21.5202C15.0872 21.7502 14.945 21.9584 14.7663 22.1328C14.5875 22.3072 14.3758 22.4442 14.1435 22.5359C13.9112 22.6276 13.663 22.6721 13.4133 22.6668ZM3.93333 2.66677C3.85606 2.6641 3.77903 2.67691 3.70678 2.70444C3.63452 2.73197 3.5685 2.77367 3.5126 2.82709C3.4567 2.88051 3.41204 2.94456 3.38126 3.01549C3.35047 3.08642 3.33418 3.16279 3.33333 3.2401V20.7934C3.33333 20.9473 3.39444 21.0948 3.50321 21.2036C3.61198 21.3123 3.75951 21.3734 3.91333 21.3734H13.4133C13.5729 21.3756 13.7273 21.3168 13.845 21.209C13.9627 21.1012 14.0348 20.9526 14.0467 20.7934V3.2401C14.0332 3.08216 13.9604 2.93518 13.8428 2.82879C13.7253 2.72241 13.5718 2.66451 13.4133 2.66677H3.93333Z"
                        fill="#FFA42F" />
                      <path
                        d="M19.6866 22.666C19.3785 22.6687 19.0729 22.6103 18.7875 22.4942C18.5021 22.3781 18.2425 22.2066 18.0237 21.9897C17.8049 21.7728 17.6312 21.5147 17.5127 21.2303C17.3942 20.9459 17.3332 20.6408 17.3332 20.3327V15.3327C17.3332 14.9791 17.1927 14.6399 16.9427 14.3899C16.6926 14.1398 16.3535 13.9993 15.9999 13.9993H15.0465C14.8697 13.9993 14.7002 13.9291 14.5751 13.8041C14.4501 13.6791 14.3799 13.5095 14.3799 13.3327C14.3799 13.1559 14.4501 12.9863 14.5751 12.8613C14.7002 12.7363 14.8697 12.666 15.0465 12.666H15.9999C16.7071 12.666 17.3854 12.947 17.8855 13.4471C18.3856 13.9472 18.6665 14.6254 18.6665 15.3327V20.3327C18.6665 20.5979 18.7719 20.8523 18.9594 21.0398C19.147 21.2273 19.4013 21.3327 19.6665 21.3327C19.9318 21.3327 20.1861 21.2273 20.3737 21.0398C20.5612 20.8523 20.6665 20.5979 20.6665 20.3327V11.5327L18.5799 6.86602C18.4552 6.60596 18.2594 6.38654 18.0152 6.23316C17.771 6.07978 17.4883 5.99871 17.1999 5.99935H16.7132C16.5364 5.99935 16.3668 5.92911 16.2418 5.80409C16.1168 5.67906 16.0465 5.50949 16.0465 5.33268C16.0465 5.15587 16.1168 4.9863 16.2418 4.86128C16.3668 4.73625 16.5364 4.66602 16.7132 4.66602H17.1999C17.7542 4.66573 18.2967 4.82616 18.7617 5.12789C19.2267 5.42961 19.5943 5.85968 19.8199 6.36602L21.9599 11.1393C21.999 11.2252 22.0194 11.3184 22.0199 11.4127V20.3327C22.0199 20.9515 21.7741 21.545 21.3365 21.9826C20.8989 22.4202 20.3054 22.666 19.6866 22.666Z"
                        fill="#FFA42F" />
                      <path
                        d="M11.9998 5.99935H5.33317C5.15636 5.99935 4.98679 5.92911 4.86177 5.80409C4.73674 5.67906 4.6665 5.50949 4.6665 5.33268C4.6665 5.15587 4.73674 4.9863 4.86177 4.86128C4.98679 4.73625 5.15636 4.66602 5.33317 4.66602H11.9998C12.1766 4.66602 12.3462 4.73625 12.4712 4.86128C12.5963 4.9863 12.6665 5.15587 12.6665 5.33268C12.6665 5.50949 12.5963 5.67906 12.4712 5.80409C12.3462 5.92911 12.1766 5.99935 11.9998 5.99935Z"
                        fill="#FFA42F" />
                      <path
                        d="M11.9998 8.66732H5.33317C5.15636 8.66732 4.98679 8.59708 4.86177 8.47206C4.73674 8.34703 4.6665 8.17746 4.6665 8.00065C4.6665 7.82384 4.73674 7.65427 4.86177 7.52925C4.98679 7.40422 5.15636 7.33398 5.33317 7.33398H11.9998C12.1766 7.33398 12.3462 7.40422 12.4712 7.52925C12.5963 7.65427 12.6665 7.82384 12.6665 8.00065C12.6665 8.17746 12.5963 8.34703 12.4712 8.47206C12.3462 8.59708 12.1766 8.66732 11.9998 8.66732Z"
                        fill="#FFA42F" />
                      <path
                        d="M16.6667 8.05404C16.4899 8.05404 16.3203 7.9838 16.1953 7.85877C16.0702 7.73375 16 7.56418 16 7.38737V3.38737C16 3.21056 16.0702 3.04099 16.1953 2.91597C16.3203 2.79094 16.4899 2.7207 16.6667 2.7207C16.8435 2.7207 17.013 2.79094 17.1381 2.91597C17.2631 3.04099 17.3333 3.21056 17.3333 3.38737V7.38737C17.3333 7.56418 17.2631 7.73375 17.1381 7.85877C17.013 7.9838 16.8435 8.05404 16.6667 8.05404Z"
                        fill="#FFA42F" />
                    </svg>
                  </div>
                  <div class="col-sm-10">
                    <span class="text-13">{{t('FleetView.fuel')}}</span>
                  </div>
                </div>
                <div class="row mx-0">
                  <div class="col-sm-10 offset-sm-2">
                    <h5>{{vehicleData.datainfo.label_name}}</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="px-3 mb-3">
          <div class="card px-3 py-4">
            <div class="row mx-0">
              <div class="col-md-4 col-sm-12">
                <img v-if="vehicleData.datainfo.picture" :src="imageBaseUrl(`/documents/${vehicleData.datainfo.picture}`)" class="img-fluid" alt="">
                <img v-else src="../../../assets/images/carPlaceholder.svg" class="w-100" alt="">
              </div>
              <div class="col-md-6 col-sm-12">
                <div class="text-18 mb-lg-3 mb-md-2 mt-md-0 mt-sm-3">{{vehicleData.datainfo.vehicle_name}}</div>
                <div class="row mx-0 mb-1">
                  <div class="col-md-4 col-sm-6">
                    <p class="label-color">{{t('FleetView.class')}}</p>
                  </div>
                  <div class="col-md-8 col-sm-6">
                    <p class="text-color fw-500" v-if="vehicleData">
                      {{ fleetClasseData?.find(x => x.id == vehicleData.datainfo.class_id)?.classname }}
                    </p>
                  </div>
                </div>
                <div class="row mx-0 mb-1">
                  <div class="col-md-4 col-sm-6">
                    <p class="label-color">{{t('FleetView.plate-number')}}</p>
                  </div>
                  <div class="col-md-8 col-sm-6">
                    <p class="text-color fw-500">{{vehicleData.datainfo.plateno}}</p>
                  </div>
                </div>
                <div class="row mx-0 mb-1">
                  <div class="col-md-4 col-sm-6">
                    <p class="label-color">ID</p>
                  </div>
                  <div class="col-md-8 col-sm-6">
                    <p class="text-color fw-500">
                      {{vehicleData.datainfo.id}}
                    </p>
                  </div>
                </div>
                <div class="row mx-0">
                  <div class="col-md-4 col-sm-6">
                    <p class="label-color">{{t('FleetView.base-location')}}</p>
                  </div>
                  <div class="col-md-8 col-sm-6">
                    <p class="text-color fw-500" v-if="vehicleData">
                      {{ locationData?.lcoations.find(x => x.id == vehicleData.datainfo.store_id)?.location_name }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="col-md-2 col-sm-12">
                <div class="row mx-0">
                  <div class="col-md-12 col-sm-5 text-md-center text-sm-start">
                    <p class="label-color mb-2">{{t('FleetView.gear')}}</p>
                  </div>
                  <div class="col-md-12 col-sm-7 mb-3 text-md-center text-sm-start">
                    <p class="text-color fw-500"
                      v-if="vehicleData.datainfo.gearshift == 'Automatic' || vehicleData.datainfo.gearshift== 'Automatik' ">
                      {{t('form-fields.automatic')}}</p>
                    <p class="text-color fw-500" v-else>{{t('form-fields.manual')}}</p>
                  </div>
                  <div class="col-md-12 col-sm-6 mb-3 text-center">
                    <button class="btn edit-btn w-100 px-sm-0" v-if="vehicleData">
                      <app-link :path="`/flotte/aktualisieren/${vehicleData.datainfo.id}`" class="w-100">
                        <span class="text-12">{{ $t("form-fields.edit") }}</span>
                      </app-link>
                    </button>
                  </div>
                  <div class="col-md-12 col-sm-6 text-center" v-if="vehicleData">
                    <div class="status-switcher w-100 ps-2 py-1"
                      :class="{ active: Boolean(vehicleData.datainfo.status) }">
                      <span class="me-1 text-13 fw-medium">
                        {{
                        vehicleData.datainfo.status ? t("FleetIndex.active") : t("FleetIndex.inactive")
                        }}
                      </span>
                      <Switcher v-model.number="vehicleData.datainfo.status"
                        @change="onStatusChange($event.target.checked, vehicleData.datainfo)" />
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row mx-0 mb-3">
          <div class="col-md-6 mb-sm-2">
            <div class="card">
              <div class="card-body px-4 py-4">
                <div class="text-18 fw-500 mb-3">
                  {{t('FleetView.damages')}}
                </div>
                <div class="text-center" v-if="vehicleData.datainfo.art">
                  <img :src="vehicleData.datainfo.art" class="img-fluid" alt="">
                </div>
              </div>
              <div v-if="vehicleData.datainfo.note" class="list-group list-group-flush px-4 py-4">
                <div class="list-group-item">
                  <p class="text-justify text-color mb-2">
                    {{vehicleData.datainfo.note}}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6 mb-sm-2">
            <div class="card mb-3">
              <div class="card-body px-4 py-4">
                <div class="text-18 fw-500 mb-3">
                  {{t('FleetView.checks')}}
                </div>
                <div class="mb-2" v-if=JSON.parse(vehicleData.datainfo.checks).length>
                  <div class="row mx-0 mb-2" v-for="(ck, index) in JSON.parse(vehicleData.datainfo.checks)"
                    :key="index">
                    <div class="col-md-5 col-sm-5 h6" style="color: #353A46">
                      {{index +1}}. {{ck.check}}
                    </div>
                    <div class="col-md-7 col-sm-7 p" style="color: #676B74">
                      <span v-if="locale === 'en'">{{ moment(ck.check_date).format('DD/MM/YYYY') }}</span>
                      <span v-else>{{ moment(ck.check_date).format('DD.MM.YYYY') }}</span>
                    </div>
                  </div>
                </div>
                <div v-else>{{t('FleetView.no-checks')}}!</div>
              </div>
            </div>
            <div class="card">
              <div class="card-body px-4 py-4">
                <div class="text-18 fw-500 mb-3">
                  {{t('FleetView.documents')}}
                </div>
                <div>
                  <div class="row mx-0 mb-2" v-for="(doc, i) in vehicleData.documents || []" :key="i">
                    <div class="col-md-3 col-sm-3">
                      <div class="text-14">
                        <span v-if="locale === 'en'">{{ moment(doc.created_at).format('DD/MM/YYYY') }}</span>
                        <span v-else>{{ moment(doc.created_at).format('DD.MM.YYYY') }}</span>
                      </div>
                    </div>
                    <div class="col-md-9 col-sm-9">
                      <div class="text-14 fw-500 text-truncate w-100">
                        <a :href="imageBaseUrl(`/${doc.folder}/${doc.file_name}`)" target="_blank"
                          class="text-primary text-underline">
                          <u>{{doc.file_name}}</u>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div v-if="!vehicleData.documents.length">
                    {{t('FleetView.no-document')}}!
                  </div>
                </div>
              </div>
            </div>
            <div v-if="vehicleData.datainfo.additional_note" class="card mt-3">
              <div class="card-body px-4 py-4">
                <div class="text-18 fw-500 mb-3">
                  {{t('form-fields.note')}}
                </div>
                <div style="color: #353A46" class="text-16 fw-400">
                  {{vehicleData.datainfo.additional_note}}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-3 col-md-12 px-0">
        <div class="card pa-5">
          <div class="card-body">
            <div class="text-18 mb-3">{{t('FleetView.rental-history')}}</div>
            <template v-if="!loading">
              <div class="history-card-div" v-for="(reservation, i) in vehicleData?.reservations" :key="i">
                <div class="history-card py-4 row mx-0">
                  <div class="col-md-4 col-sm-4 px-0">
                    <img v-if="vehicleData.datainfo.picture" :src="imageBaseUrl(`/documents/${vehicleData.datainfo.picture}`)" class="img-fluid mb-2" alt="">
                    <img v-else src="../../../assets/images/carPlaceholder.svg" class="img-fluid mb-2" style="width: 90px;" alt="">
                    
                    <div class="text-center" style="color: #666">
                      <div class="text-10 mb-2">ID {{reservation.reservation_no}}</div>
                      <div class="text-14 fw-500" style="color: #020918;">{{moneyFormat(reservation.to_pay, locale)}}
                      </div>
                    </div>
                  </div>
                  <div class="col-md-8 col-sm-8">
                    <h6 class="mb-3">{{vehicleData.datainfo.vehicle_name}} {{vehicleData.datainfo.model}}</h6>
                    <div class="row mx-0 mb-4">
                      <div class="col-md-6 col-sm-6 col-xs-12 px-md-0">
                        <div class="text-10 mb-1" style="color: #808080;" v-if="locale === 'en'">
                          {{moment(reservation.start_time, "HH:mm:ss").format("hh:mm A")}}</div>
                        <div class="text-10 mb-1" style="color: #808080;" v-else>{{moment(reservation.start_time,
                        "HH:mm:ss").format("HH:mm")}}</div>
                        <div class="text-14 fw-500" v-if="locale === 'en'">
                          {{moment(reservation.start_date).format('DD/MM/YYYY')}}</div>
                        <div class="text-14 fw-500" v-else>{{moment(reservation.start_date).format('DD.MM.YYYY')}}</div>
                      </div>
                      <div class="col-md-6 col-sm-6 col-xs-12 px-md-0">
                        <div class="text-10 mb-1" style="color: #808080;" v-if="locale === 'en'">
                          {{moment(reservation.end_time, "HH:mm:ss").format("hh:mm A")}}</div>
                        <div class="text-10 mb-1" style="color: #808080;" v-else>{{moment(reservation.end_time,
                        "HH:mm:ss").format("HH:mm")}}</div>
                        <div class="text-14 fw-500" v-if="locale === 'en'">
                          {{moment(reservation.end_date).format('DD/MM/YYYY')}}</div>
                        <div class="text-14 fw-500" v-else>{{moment(reservation.end_date).format('DD.MM.YYYY')}}</div>
                      </div>
                    </div>
                    <div class="text-end">
                      <StatusButton :type="getStatus(reservation.reservation_status)">
                        <span v-if="reservation.reservation_status == 'Reserved'">{{ t('form-fields.reserved') }}</span>
                        <span v-if="reservation.reservation_status == 'Rented'">{{ t('form-fields.rented') }}</span>
                        <span v-if="reservation.reservation_status == 'Completed'">{{ t('form-fields.completed')
                        }}</span>
                        <span v-if="reservation.reservation_status == 'Cancelled'">{{ t('form-fields.cancelled')
                        }}</span>
                      </StatusButton>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <template v-if="!loading && !vehicleData.reservations.length">
              <div class="">
                {{t('FleetView.no-history')}}!
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </LoadingView>

</template>

<style lang="scss" scoped>
.fleet-view-header .card .card-body{
  min-height: 104px; 
}
.label-color {
  color: $light-grey-color-3;
}

.text-color {
  color: $text-color-2;
}

.edit-btn {
  border-color: #000000;

  span {
    color: #000000;
  }
}

// .status-btn-active{
//     color: $success-color;
//     cursor: default;
//     border-color: $success-color;
//     svg{
//         color: $success-color
//     }
// }
// .status-btn-inactive{
//     color: $warning-color;
//     cursor: default;
//     border-color: $warning-color;
//     svg{
//         color: $warning-color;
//     }
// }
.history-card-div .history-card {
  border-bottom: 1px solid #eeeeee !important;
}

.history-card-div:last-child .history-card {
  border-bottom: 1px solid transparent !important;
}

.status-switcher {
  display: inline-flex;
  align-items: center;
  color: $warning-color;
  border: 1px solid $warning-color;
  border-radius: 5px;
  padding: 2px 6px;
  min-width: 90px;
  justify-content: space-between;

  &.active {
    color: $success-color;
    border-color: $success-color;
  }
}
</style>
