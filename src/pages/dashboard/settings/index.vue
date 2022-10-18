<script setup>

import { useI18n } from 'vue-i18n'

const { t } = useI18n({ useScope: 'global' })

</script>

<template>

  <div>
    <div class="row settings-section">
      <!-- General  -->
      <div class="col-md-4 mb-4">
        <div class="card rounded h-100">
          <div class="card-body">
            <app-link path="/einstellungen/allgemein" class="">
              <div class="d-flex align-items-center">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M5 16.666V31.666C5 32.5501 5.35119 33.3979 5.97631 34.023C6.60143 34.6482 7.44928 34.9993 8.33333 34.9993H31.6667C32.5507 34.9993 33.3986 34.6482 34.0237 34.023C34.6488 33.3979 35 32.5501 35 31.666V16.666"
                    stroke="#AAAAAA" stroke-width="2" />
                  <path
                    d="M24.7217 34.9993V24.9993C24.7217 24.1153 24.3705 23.2674 23.7454 22.6423C23.1202 22.0172 22.2724 21.666 21.3883 21.666H18.055C17.171 21.666 16.3231 22.0172 15.698 22.6423C15.0729 23.2674 14.7217 24.1153 14.7217 24.9993V34.9993"
                    stroke="#AAAAAA" stroke-width="2" stroke-miterlimit="16" />
                  <path
                    d="M36.3634 15.6067L33.54 5.725C33.4803 5.51608 33.3541 5.33231 33.1806 5.2015C33.0071 5.07069 32.7957 4.99995 32.5784 5H25.8334L26.625 14.5067C26.637 14.6595 26.6853 14.8073 26.7659 14.9378C26.8465 15.0682 26.957 15.1776 27.0884 15.2567C27.7384 15.645 29.0084 16.3617 30 16.6667C31.6934 17.1883 34.1667 17 35.5767 16.8267C35.7138 16.8089 35.8453 16.7615 35.9622 16.6877C36.0791 16.6139 36.1784 16.5155 36.2533 16.3993C36.3282 16.2832 36.3769 16.1521 36.3959 16.0152C36.4149 15.8782 36.4038 15.7388 36.3634 15.6067Z"
                    stroke="#AAAAAA" stroke-width="2" />
                  <path
                    d="M23.3334 16.6667C24.28 16.375 25.48 15.71 26.15 15.3133C26.3062 15.2204 26.4329 15.0851 26.5155 14.9232C26.5981 14.7613 26.6332 14.5793 26.6167 14.3983L25.8334 5H14.1667L13.3834 14.3983C13.3666 14.5796 13.4015 14.7619 13.4841 14.9242C13.5667 15.0864 13.6936 15.2219 13.85 15.315C14.52 15.71 15.72 16.375 16.6667 16.6667C19.155 17.4333 20.845 17.4333 23.3334 16.6667V16.6667Z"
                    stroke="#AAAAAA" stroke-width="2" />
                  <path
                    d="M6.46003 5.725L3.63669 15.6083C3.59684 15.7403 3.58619 15.8794 3.60547 16.0159C3.62475 16.1524 3.67351 16.283 3.74836 16.3988C3.82321 16.5145 3.92236 16.6126 4.03892 16.6862C4.15548 16.7598 4.28666 16.8072 4.42336 16.825C5.83169 17 8.30669 17.1867 10 16.6667C10.9917 16.3617 12.2634 15.645 12.9117 15.2583C13.0433 15.1791 13.154 15.0695 13.2346 14.9387C13.3152 14.808 13.3633 14.6598 13.375 14.5067L14.1667 5H7.42169C7.20439 4.99995 6.99299 5.07069 6.81948 5.2015C6.64597 5.33231 6.51978 5.51608 6.46003 5.725V5.725Z"
                    stroke="#AAAAAA" stroke-width="2" />
                </svg>
                <h5 class="mb-0 ms-4 title">{{ t('settings.general') }}</h5>
              </div>
              <p class="text mt-4 pt-2">{{ t('settings.generalSub') }}</p>
            </app-link>
          </div>
        </div>
      </div>
      <!-- Locations Manages -->
      <div class="col-md-4 mb-4">
        <div class="card rounded h-100">
          <div class="card-body">
            <app-link path="/einstellungen/standort-verwaltung" class="">
              <div class="d-flex align-items-center">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M35 16.6665C35 28.3332 20 38.3332 20 38.3332C20 38.3332 5 28.3332 5 16.6665C5 12.6883 6.58035 8.87295 9.3934 6.0599C12.2064 3.24686 16.0218 1.6665 20 1.6665C23.9782 1.6665 27.7936 3.24686 30.6066 6.0599C33.4196 8.87295 35 12.6883 35 16.6665Z"
                    stroke="#AAAAAA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <path
                    d="M20 21.6665C22.7614 21.6665 25 19.4279 25 16.6665C25 13.9051 22.7614 11.6665 20 11.6665C17.2386 11.6665 15 13.9051 15 16.6665C15 19.4279 17.2386 21.6665 20 21.6665Z"
                    stroke="#AAAAAA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <h5 class="mb-0 ms-4 title">{{ t('settings.location-manages') }}</h5>
              </div>
              <p class="text mt-4 pt-2">{{ t('settings.locationSub') }}</p>
            </app-link>
          </div>
        </div>
      </div>
      <!-- Vehicle -->
      <div class="col-md-4 mb-4">
        <div class="card rounded h-100">
          <div class="card-body">
            <app-link path="/einstellungen/fahrzeugdaten" class="">
              <div class="d-flex align-items-center">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M5.33333 11.9993V33.3327L14.6667 27.9993L25.3333 33.3327L34.6667 27.9993V6.66602L25.3333 11.9993L14.6667 6.66602L5.33333 11.9993Z"
                    stroke="#AAAAAA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M14.6667 6.66602V27.9993" stroke="#AAAAAA" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
                  <path d="M25.3333 12V33.3333" stroke="#AAAAAA" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
                </svg>
                <h5 class="mb-0 ms-4 title">{{ t('settings.vehiclesData') }}</h5>
              </div>
              <p class="text mt-4 pt-2">{{ t('settings.vehiclesDataSub') }}</p>
            </app-link>
          </div>
        </div>
      </div>
      <!-- Billing -->
      <div class="col-md-4 mb-4">
        <div class="card rounded h-100">
          <div class="card-body">
            <app-link path="/einstellungen/abrechnung" class="">
              <div class="d-flex align-items-center">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M5.33333 11.9993V33.3327L14.6667 27.9993L25.3333 33.3327L34.6667 27.9993V6.66602L25.3333 11.9993L14.6667 6.66602L5.33333 11.9993Z"
                    stroke="#AAAAAA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M14.6667 6.66602V27.9993" stroke="#AAAAAA" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
                  <path d="M25.3333 12V33.3333" stroke="#AAAAAA" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
                </svg>
                <h5 class="mb-0 ms-4 title">{{ t('settings.billing') }}</h5>
              </div>
              <p class="text mt-4 pt-2">{{ t('settings.billingSub') }}</p>
            </app-link>
          </div>
        </div>
      </div>
      <!-- payment-terms -->
      <!-- <div class="col-md-4 mb-4">
          <div class="card rounded h-100">
            <div class="card-body">
              <app-link path="/settings/payment-terms">
                <div class="d-flex align-items-center">
                  <svg width="42" height="32" viewBox="0 0 42 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.849999 7.1951L0.850001 7.19572C0.856766 8.80849 1.4953 10.3535 2.62694 11.4943C3.75863 12.6351 5.29183 13.2792 6.89278 13.286H6.89342H6.89342H6.89343H6.89344H6.89345H6.89346H6.89347H6.89348H6.89349H6.8935H6.89351H6.89353H6.89353H6.89354H6.89355H6.89356H6.89357H6.89358H6.89358H6.89359H6.8936H6.89361H6.89362H6.89364H6.89365H6.89366H6.89367H6.89368H6.8937H6.89371H6.89373H6.89374H6.89375H6.89377H6.89379H6.8938H6.89382H6.89384H6.89385H6.89387H6.89389L6.89389 27.3167C6.88029 27.8955 6.98156 28.4712 7.19177 29.01C7.40221 29.5494 7.7176 30.041 8.11942 30.4558C8.52125 30.8707 9.00141 31.2004 9.53166 31.4254C10.0619 31.6505 10.6315 31.7663 11.2069 31.7662C11.2069 31.7662 11.2069 31.7662 11.2069 31.7662H30.6928C31.8326 31.7662 32.9258 31.3116 33.7338 30.5019C34.5418 29.6923 34.9989 28.5936 35.0058 27.4458V27.4449V13.2394C35.7633 13.2489 36.5164 13.1155 37.226 12.8454C37.9842 12.5568 38.6773 12.1181 39.2644 11.5552C39.8515 10.9923 40.3208 10.3167 40.6446 9.56814C40.9685 8.81962 41.1403 8.01335 41.15 7.19688V7.1951V6.94229C41.1502 6.13159 40.9898 5.32896 40.6782 4.58149C40.3665 3.83401 39.91 3.1567 39.3351 2.58932C38.7603 2.02194 38.0788 1.57591 37.3306 1.27745C36.5829 0.979183 35.7836 0.834314 34.9796 0.851345H6.89342C5.29021 0.851345 3.75292 1.49336 2.61965 2.63577C1.48643 3.77813 0.85 5.32726 0.85 6.94229L0.849999 7.1951ZM4.58668 7.37206H4.5866L4.58675 7.37678C4.59422 7.61367 4.6909 7.83903 4.8575 8.00697C5.02413 8.17494 5.2482 8.27284 5.48423 8.2804L5.48422 8.28048H5.48903H6.89389V11.5198C6.33426 11.5165 5.7807 11.4022 5.26481 11.1833C4.74881 10.9644 4.28055 10.6451 3.88681 10.2437C3.49307 9.84223 3.18156 9.36646 2.97013 8.84351C2.7587 8.32056 2.65151 7.76072 2.6547 7.19594V7.1951V6.94229C2.6547 5.80834 3.10157 4.72107 3.89662 3.91961C4.69163 3.11819 5.76963 2.66818 6.89342 2.66818H34.9812C35.5377 2.66818 36.0887 2.77867 36.6029 2.99336C37.1171 3.20806 37.5843 3.52278 37.978 3.91961C38.3717 4.31645 38.684 4.78762 38.8971 5.30627C39.1102 5.82491 39.2199 6.38084 39.2199 6.94229V7.24446C39.2006 8.36766 38.7461 9.43843 37.9539 10.2279C37.1973 10.9818 36.1901 11.422 35.1312 11.4657V8.28048H36.536C36.7758 8.28048 37.0054 8.18447 37.1745 8.01398C37.343 7.84414 37.4377 7.61425 37.4384 7.37464C37.4422 7.25458 37.4217 7.13496 37.378 7.02312C37.334 6.91045 37.2674 6.80804 37.1823 6.72228C37.0973 6.63652 36.9955 6.56927 36.8834 6.52476C36.7721 6.48059 36.6531 6.45979 36.5335 6.46364H5.48903C5.24932 6.46364 5.01967 6.55964 4.85054 6.73014C4.68146 6.90059 4.58668 7.13152 4.58668 7.37206ZM32.3926 29.0682C31.9441 29.538 31.3346 29.8169 30.6892 29.8482H11.2077C10.5446 29.8418 9.91019 29.5735 9.44091 29.1004C8.97161 28.6273 8.70495 27.9873 8.69859 27.3178V8.28048H20.361V24.6893C20.361 24.9097 20.4478 25.1213 20.6028 25.2776C20.7578 25.4338 20.9683 25.5219 21.1881 25.5219C21.4078 25.5219 21.6184 25.4338 21.7734 25.2776C21.9284 25.1213 22.0152 24.9097 22.0152 24.6893V8.28048H26.7309V17.459C26.7309 17.6794 26.8177 17.8911 26.9727 18.0473C27.1277 18.2036 27.3382 18.2916 27.558 18.2916C27.7778 18.2916 27.9883 18.2036 28.1433 18.0473C28.2983 17.8911 28.3851 17.6794 28.3851 17.459V8.28048H33.1008V27.3181C33.0952 27.9715 32.8417 28.5977 32.3926 29.0682Z" fill="#AAAAAA" stroke="#AAAAAA" stroke-width="0.3"/>
                    <path d="M14.6923 19.0531C14.4725 19.0531 14.262 19.1411 14.107 19.2974C13.952 19.4536 13.8651 19.6653 13.8651 19.8857V24.5879C13.8651 24.8083 13.952 25.02 14.107 25.1762C14.262 25.3325 14.4725 25.4205 14.6923 25.4205C14.912 25.4205 15.1225 25.3325 15.2775 25.1762C15.4325 25.02 15.5194 24.8083 15.5194 24.5879V19.8857C15.5194 19.6653 15.4325 19.4536 15.2775 19.2974C15.1225 19.1411 14.912 19.0531 14.6923 19.0531Z" fill="#AAAAAA" stroke="#AAAAAA" stroke-width="0.3"/>
                  </svg>
                  <h5 class="mb-0 ms-4 title">{{ t('settings.payment-terms') }}</h5>
                </div>
                <p class="mt-4 pt-2 text">{{ t('settings.payment-termsSub') }}</p>
              </app-link>
            </div>
          </div>
        </div> -->
      <!-- User Manages -->
      <div class="col-md-4 mb-4">
        <div class="card rounded h-100">
          <div class="card-body">
            <app-link path="einstellungen/benutzer-verwaltung" class="">
              <div class="d-flex align-items-center">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M33.3334 35V31.6667C33.3334 29.8986 32.631 28.2029 31.3807 26.9526C30.1305 25.7024 28.4348 25 26.6667 25H13.3334C11.5652 25 9.86955 25.7024 8.61931 26.9526C7.36907 28.2029 6.66669 29.8986 6.66669 31.6667V35"
                    stroke="#AAAAAA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <path
                    d="M20 18.3333C23.6819 18.3333 26.6666 15.3486 26.6666 11.6667C26.6666 7.98477 23.6819 5 20 5C16.3181 5 13.3333 7.98477 13.3333 11.6667C13.3333 15.3486 16.3181 18.3333 20 18.3333Z"
                    stroke="#AAAAAA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <h5 class="mb-0 ms-4 title">{{ t('settings.accounts') }}</h5>
              </div>
              <p class="mt-4 pt-2 text">{{ t('settings.accountsSub') }}</p>
            </app-link>
          </div>
        </div>
      </div>
      <!-- Legal -->
      <!-- <div class="col-md-4 mb-4">
        <div class="card rounded h-100">
          <div class="card-body">
            <app-link path="/settings/legal" class="">
              <div class="d-flex align-items-center">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.0001 36.6668C20.0001 36.6668 33.3334 30.0002 33.3334 20.0002V8.3335L20.0001 3.3335L6.66675 8.3335V20.0002C6.66675 30.0002 20.0001 36.6668 20.0001 36.6668Z" stroke="#AAAAAA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <h5 class="mb-0 ms-4 title">{{ t('settings.legal') }}</h5>
              </div>
              <p class="mt-4 pt-2 text">{{ t('settings.legalSub') }}</p>
            </app-link>
          </div>
        </div>
      </div> -->
    </div>
  </div>

</template>

<style lang="scss" scoped>
@import "../../../styles/scss/_variables.scss";

.settings-section {
  .card {
    transition: 0.5s;

    .title {
      color: $dark-black;
    }

    .text {
      color: $lighter-gray;
    }

    &:hover {
      // background: linear-gradient(94.27deg, #276ef1 1.42%, #7ba9ff 97.32%);
      background: #000000;
      box-shadow: 0px 8px 32px rgba(0, 0, 0, 0.24);

      // box-shadow: 0 1px 5px 0 #276ef175;
      // border-radius: 4px;
      // background: #7ba9ffb5;
      .title {
        color: white;
      }

      .text {
        color: white;
      }

      svg path {
        stroke: #ffffff;
      }
    }
  }
}

// .settings-box {
//   padding: 33px;
//   &:hover {
//     color: white;
//     background: linear-gradient(90deg, #276ef1, #7ba9ff);
//     box-shadow: 0 8px 32px 0 #276ef175;
//     border-color: #7ba9ffb5 !important;
//     cursor: pointer;
//     .text-muted {
//       color: white !important;
//     }

//     svg,
//     path {
//       stroke: #8cb4ff;
//     }

//     &.billing {
//       path {
//         fill: #8cb4ff;
//       }
//     }
//   }
// }
</style>
