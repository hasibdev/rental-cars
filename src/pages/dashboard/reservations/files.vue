<script setup>

import StatusButton from "@/components/dashboard/shared/StatusButton.vue"
import UserCard from "@/components/dashboard/reservations/components/UserCard.vue"
// import DriverCard from "@/components/dashboard/reservations/components/DriverCard.vue"
import OutlineBgBtn from "@/components/buttons/OutlineBgBtn.vue"
import PrimaryButton from "@/components/buttons/PrimaryButton.vue"
import { useAxios } from '@/use/useAxios'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n({ useScope: 'global' })
const route = useRoute()
// const router = useRouter()
const { data, loading } = useAxios(`admin/reservation/view/${route.params.id}`)

const getStatus = (val) => {
  if (val == 'Reserved') return 'info'
  if (val == 'Rented') return 'warning'
  if (val == 'Completed') return 'success'
  if (val == 'Cancelled') return 'danger'

  return 'primary'
}

</script>

<template>

  <!-- <pre>{{data}}</pre> -->

  <!-- Loading -->
  <Loading v-if="loading" class="my-3" />

  <template v-if="!loading && data?.reservation && data?.customerinfo">
    <div class="row mx-0">
      <div class="col-md-6 col-xs-12">
        <h6 class="mb-1">{{t('dashboard-reservation.view-reservation')}}</h6>
        <p class="" style="opacity:0.7">#{{data?.reservation?.reservation_no}}</p>
      </div>
      <div class="col-md-6 col-xs-12 text-right">
        <h6 class="mb-1 me-3">{{t('dashboard-reservation.status')}}</h6>
        <!-- <p>{{data?.reservation?.reservation_status}}</p> -->
        <div class="d-flex align-items-center justify-content-end">
          <div class="text-18 fw-500 me-3"
            v-if="data?.reservation?.reservation_status== 'Rented' || data?.reservation?.reservation_status== 'completed'">
            <app-link :path="`/reservierungen/vertrags-vorschau/${data?.reservation?.id}`" class="pointer">
              Open Contract
            </app-link>
          </div>
          <StatusButton :type="getStatus(data?.reservation?.reservation_status)" style="cursor: default;">{{
          data?.reservation?.reservation_status }}</StatusButton>
        </div>
      </div>
    </div>

    <!-- Customer Info -->
    <div class="bordered-content py-3 px-4 mb-4" style="border: 1px solid #dddddd; border-radius: 4px">
      <h5 class="mb-4">{{t('dashboard-reservation.customer-info')}}</h5>
      <div class="row">
        <div class="col-lg-8 offset-lg-2 col-md-10 offset-md-1 col-sm-12">
          <UserCard :user="data.customerinfo" />
        </div>
        <div class="col-lg-2 col-md-1 d-sm-none"></div>
      </div>
    </div>

    <!-- Reservation Details -->
    <div class="bordered-content py-3 px-4 mb-4" style="border: 1px solid #dddddd; border-radius: 4px">
      <h5 class="mb-4">{{t('dashboard-reservation.details')}}</h5>
      <div class="row">
        <div class="col-md-10 offset-md-1 col-sm-12">
          <div class="row mx-0 details-section">
            <div class="col-lg-6 col-md-12 col-sm-12 px-0">
              <div class="row mx-0 mb-2">
                <div class="col-lg-5 col-md-6 col-sm-12">
                  <h6 class="text-gray">{{t('form-fields.origin-of-customer')}}</h6>
                </div>
                <div class="col-lg-7 col-md-6 col-sm-12">
                  <p class="mb-0">{{data?.reservation?.origin_of_customer}}</p>
                </div>
              </div>
              <div class="row mx-0 mb-2">
                <div class="col-lg-5 col-md-6 col-sm-12">
                  <h6 class="text-gray">{{t('form-fields.created-by')}}</h6>
                </div>
                <div class="col-lg-7 col-md-6 col-sm-12">
                  <p class="mb-0">{{data?.reservation?.create_name}}</p>
                </div>
              </div>
              <div class="row mx-0 mb-2">
                <div class="col-lg-5 col-md-6 col-sm-12">
                  <h6 class="text-gray">{{t('form-fields.vehicle')}}</h6>
                </div>
                <div class="col-lg-7 col-md-6 col-sm-12">
                  <p class="mb-0">{{data?.reservation?.vehicle_name}}</p>
                </div>
              </div>
              <div class="row mx-0 mb-3">
                <div class="col-lg-5 col-md-6 col-sm-12">
                  <h6 class="text-gray">{{t('form-fields.closed-by')}}</h6>
                </div>
                <div class="col-lg-7 col-md-6 col-sm-12">
                  <p class="mb-0">{{data?.reservation?.cloesed_name}}</p>
                </div>
              </div>
              <div class="row mx-0 mb-2">
                <div class="col-lg-5 col-md-6 col-sm-12">
                  <h6 class="text-gray">{{t('form-fields.pickup-location')}}</h6>
                </div>
                <div class="col-lg-7 col-md-6 col-sm-12">
                  <p class="mb-1">{{data?.reservation?.pick_locationname}}</p>
                  <p class="mb-1">{{data?.reservation?.pick_street}} {{data?.reservation?.pic_postcode}}</p>
                  <p class="mb-0">{{data?.reservation?.pic_city}} {{data?.reservation?.pic_country}}</p>
                </div>
              </div>
              <div class="row mx-0 mb-3">
                <div class="col-lg-5 col-md-6 col-sm-12">
                  <h6 class="text-gray">{{t('form-fields.return-location')}}</h6>
                </div>
                <div class="col-lg-7 col-md-6 col-sm-12">
                  <p class="mb-1">{{data?.reservation?.return_locationname}}</p>
                  <p class="mb-1">{{data?.reservation?.return_street}} {{data?.reservation?.return_postcode}}</p>
                  <p class="mb-0">{{data?.reservation?.return_city}} {{data?.reservation?.return_country}}</p>
                </div>
              </div>
              <div class="row mx-0 mb-2">
                <div class="col-lg-5 col-md-6 col-sm-12">
                  <h6 class="text-gray">{{t('form-fields.start-date') }}</h6>
                </div>
                <div class="col-lg-7 col-md-6 col-sm-12">
                  <p class="mb-0">{{moment(data?.reservation?.start_date).format('DD MMM YYYY')}}</p>
                </div>
              </div>
              <div class="row mx-0 mb-2">
                <div class="col-lg-5 col-md-6 col-sm-12">
                  <h6 class="text-gray">{{t('form-fields.start-time')}}</h6>
                </div>
                <div class="col-lg-7 col-md-6 col-sm-12">
                  <p class="mb-0">{{moment(data?.reservation?.start_time, "HH:mm:ss").format('h:mm A')}}</p>
                </div>
              </div>
              <div class="row mx-0 mb-2">
                <div class="col-lg-5 col-md-6 col-sm-12">
                  <h6 class="text-gray">{{t('form-fields.end-date')}}</h6>
                </div>
                <div class="col-lg-7 col-md-6 col-sm-12">
                  <p class="mb-0">{{moment(data?.reservation?.end_date).format('DD MMM YYYY')}}</p>
                </div>
              </div>
              <div class="row mx-0 mb-2">
                <div class="col-lg-5 col-md-6 col-sm-12">
                  <h6 class="text-gray">{{t('form-fields.end-time')}}</h6>
                </div>
                <div class="col-lg-7 col-md-6 col-sm-12">
                  <p class="mb-0">{{moment(data?.reservation?.end_time, "HH:mm:ss").format('h:mm A')}}</p>
                </div>
              </div>
            </div>
            <div class="col-lg-6 col-md-12 col-sm-12 px-0">
              <div class="row mx-0 mb-2">
                <div class="col-md-6 col-sm-12">
                  <h6 class="text-gray">{{t('form-fields.fuel-level-at-pickup')}}</h6>
                </div>
                <div class="col-md-6 col-sm-12">
                  <p class="mb-0">{{data?.reservation?.label_name}}</p>
                </div>
              </div>
              <div class="row mx-0 mb-2">
                <div class="col-md-6 col-sm-12">
                  <h6 class="text-gray">{{t('form-fields.fuel-level-at-return')}}</h6>
                </div>
                <div class="col-md-6 col-sm-12">
                  <p class="mb-0">{{data?.reservation?.fuel_returnlabel}}</p>
                </div>
              </div>
              <div class="row mx-0 mb-2">
                <div class="col-md-6 col-sm-12">
                  <h6 class="text-gray">{{t('form-fields.km-included')}}</h6>
                </div>
                <div class="col-md-6 col-sm-12">
                  <p class="mb-0">{{data?.reservation?.km_included}}</p>
                </div>
              </div>
              <div class="row mx-0 mb-2">
                <div class="col-md-6 col-sm-12">
                  <h6 class="text-gray">{{t('form-fields.cost-per-extra-km')}}</h6>
                </div>
                <div class="col-md-6 col-sm-12">
                  <p class="mb-0">{{data?.reservation?.cost_per_extra_km}}</p>
                </div>
              </div>
              <div class="row mx-0 mb-2">
                <div class="col-md-6 col-sm-12">
                  <h6 class="text-gray">{{t('form-fields.km-at-pickup')}}</h6>
                </div>
                <div class="col-md-6 col-sm-12">
                  <p class="mb-0">{{data?.reservation?.km_at_pick_up}}</p>
                </div>
              </div>
              <div class="row mx-0 mb-2">
                <div class="col-md-6 col-sm-12">
                  <h6 class="text-gray">{{t('form-fields.km-at-return')}}</h6>
                </div>
                <div class="col-md-6 col-sm-12">
                  <p class="mb-0">{{data?.reservation?.km_at_return}}</p>
                </div>
              </div>
              <div class="row mx-0 mb-2">
                <div class="col-md-6 col-sm-12">
                  <h6 class="text-gray">{{t('form-fields.contract-language')}}</h6>
                </div>
                <div class="col-md-6 col-sm-12">
                  <p class="mb-0">{{data?.reservation?.contact_language}}</p>
                </div>
              </div>
              <div class="row mx-0 mb-2">
                <div class="col-md-6 col-sm-12">
                  <h6 class="text-gray">{{t('form-fields.note')}}</h6>
                </div>
                <div class="col-md-6 col-sm-12">
                  <p class="mb-0">{{data?.reservation?.note}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-1 d-sm-none"></div>
      </div>
    </div>

    <!-- Driver Details -->
    <div class="bordered-content py-3 px-4 mb-4" style="border: 1px solid #dddddd; border-radius: 4px">
      <h5 class="mb-4">{{t('dashboard-reservation.driver')}}</h5>
      <div class="row">
        <div class="col-lg-8 offset-lg-2 col-md-10 offset-md-1 col-sm-12">
          <div class="driver-card__header p-4 my-2" style="background: #dddddd; border-radius: 8px;">
            <h5 class="driver-card__name mb-3">{{ data.customerinfo.full_name }}</h5>
            <div class="driver-card__details">
              <div class="row mx-0">
                <div class="col-lg-5 col-md-12 col-sm-12 px-0">
                  <div class="row mx-0">
                    <div class="col-md-6 col-sm-12 px-0">
                      <h6 class="details__item__label">{{t('form-fields.date-of-birth') }}:</h6>
                    </div>
                    <div class="col-md-6 col-sm-12">
                      <p class="details__item__value">{{ moment(data.customerinfo.date_of_birth).format('DD.MM.YYYY') }}
                      </p>
                    </div>
                  </div>
                  <div class="row mx-0">
                    <div class="col-md-6 col-sm-12 px-0">
                      <h6 class="details__item__label">{{t('form-fields.place-of-birth') }}:</h6>
                    </div>
                    <div class="col-md-6 col-sm-12">
                      <p class="details__item__value">{{ data.customerinfo.place_of_birth }}</p>
                    </div>
                  </div>
                  <!-- <div class="row mx-0">
                                        <div class="col-md-12">
                                            <ul>
                                                <li
                                                    class="details__item"
                                                    v-for="(file, idx) in driver.driver_documents"
                                                    :key="idx"
                                                >
                                                    <p class="details__item__value">
                                                    {{ idx + 1 }}
                                                    <span>{{ file.name }}</span>
                                                    </p>
                                                </li>
                                            </ul>
                                        </div>
                                    </div> -->
                </div>
                <div class="col-lg-7 col-md-12 col-sm-12 px-0">
                  <div class="row mx-0">
                    <div class="col-md-6 col-sm-12 px-0">
                      <h6 class="details__item__label">Driving license no.:</h6>
                    </div>
                    <div class="col-md-6 col-sm-12">
                      <p class="details__item__value">{{ data.customerinfo.drivers_license_no }}</p>
                    </div>
                  </div>
                  <div class="row mx-0">
                    <div class="col-md-6 col-sm-12 px-0">
                      <h6 class="details__item__label">Place of issue:</h6>
                    </div>
                    <div class="col-md-6 col-sm-12">
                      <p class="details__item__value">{{ data.customerinfo.place_of_issunce_of_driving_license }}</p>
                    </div>
                  </div>
                  <div class="row mx-0">
                    <div class="col-md-6 col-sm-12 px-0">
                      <h6 class="details__item__label">Date of issue:</h6>
                    </div>
                    <div class="col-md-6 col-sm-12">
                      <p class="details__item__value">{{
                      moment(data.customerinfo.date_of_issunce_of_driving_license).format('DD.MM.YYYY') }}</p>
                    </div>
                  </div>
                  <div class="row mx-0">
                    <div class="col-md-6 col-sm-12 px-0">
                      <h6 class="details__item__label">Due Date:</h6>
                    </div>
                    <div class="col-md-6 col-sm-12">
                      <p class="details__item__value">{{
                      moment(data.customerinfo.expiry_date_of_driving_license).format('DD.MM.YYYY') }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-2 col-md-1 d-sm-none"></div>
      </div>
      <div class="row" v-show="data?.drivers.length">
        <div class="col-lg-8 offset-lg-2 col-md-10 offset-md-1 col-sm-12">
          <div v-for="driver in data.drivers" :key="driver">
            <!-- <DriverCard :driver="driver" /> -->

            <div class="driver-card__header p-4 my-2" style="background: #dddddd; border-radius: 8px;">
              <h5 class="driver-card__name mb-3">{{ driver.driver_name }}</h5>
              <div class="driver-card__details">
                <div class="row mx-0">
                  <div class="col-lg-5 col-md-12 col-sm-12 px-0">
                    <div class="row mx-0">
                      <div class="col-md-6 col-sm-12 px-0">
                        <h6 class="details__item__label">{{t('form-fields.date-of-birth') }}:</h6>
                      </div>
                      <div class="col-md-6 col-sm-12">
                        <p class="details__item__value">{{ moment(driver.date_of_birth).format('DD.MM.YYYY') }}</p>
                      </div>
                    </div>
                    <div class="row mx-0">
                      <div class="col-md-6 col-sm-12 px-0">
                        <h6 class="details__item__label">{{t('form-fields.place-of-birth') }}:</h6>
                      </div>
                      <div class="col-md-6 col-sm-12">
                        <p class="details__item__value">{{ driver.place_of_birth }}</p>
                      </div>
                    </div>
                    <div class="row mx-0">
                      <div class="col-md-12">
                        <ul>
                          <li class="details__item" v-for="(file, idx) in driver.driver_documents" :key="idx">
                            <p class="details__item__value">
                              {{ idx + 1 }}
                              <span>{{ file.name }}</span>
                            </p>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-7 col-md-12 col-sm-12 px-0">
                    <div class="row mx-0">
                      <div class="col-md-6 col-sm-12 px-0">
                        <h6 class="details__item__label">{{t('form-fields.driving-license-no') }}:</h6>
                      </div>
                      <div class="col-md-6 col-sm-12">
                        <p class="details__item__value">{{ driver.driving_license_no }}</p>
                      </div>
                    </div>
                    <div class="row mx-0">
                      <div class="col-md-6 col-sm-12 px-0">
                        <h6 class="details__item__label">{{t('form-fields.place-of-issue') }}:</h6>
                      </div>
                      <div class="col-md-6 col-sm-12">
                        <p class="details__item__value">{{ driver.place_of_issuance }}</p>
                      </div>
                    </div>
                    <div class="row mx-0">
                      <div class="col-md-6 col-sm-12 px-0">
                        <h6 class="details__item__label">{{t('form-fields.place-of-birth') }}:</h6>
                      </div>
                      <div class="col-md-6 col-sm-12">
                        <p class="details__item__value">{{ moment(driver.date_of_issue).format('DD.MM.YYYY') }}</p>
                      </div>
                    </div>
                    <div class="row mx-0">
                      <div class="col-md-6 col-sm-12 px-0">
                        <h6 class="details__item__label">{{t('form-fields.due-date') }}:</h6>
                      </div>
                      <div class="col-md-6 col-sm-12">
                        <p class="details__item__value">{{ moment(driver.due_date).format('DD.MM.YYYY') }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-2 col-md-1 d-sm-none"></div>
      </div>
    </div>

    <!-- Driver Details -->
    <div class="bordered-content py-3 px-4 mb-4" style="border: 1px solid #dddddd; border-radius: 4px">
      <h5 class="mb-4">{{t('form-fields.damages')}}</h5>
      <div class="row">
        <div class="col-md-10 offset-md-1 col-sm-12">
          <h6 class="mb-3" style="#333333">{{t('form-fields.damage-description-at-handover')}}</h6>
          <div class="row mx-0 details-section">
            <div class="col-lg-4 col-md-12 col-sm-12">
              <div class="bordered-content py-3 px-4"
                style="border: 1px solid #dddddd; border-radius: 4px;width: 100%; min-height: 174px;">
                {{data?.reservation?.damages_content || 'No Content!'}}
              </div>
            </div>
            <div class="col-lg-8 col-md-12 col-sm-12 ">
              <div v-if="data?.reservation?.damages_art">
                <img class="img-fluid" :src="data?.reservation?.damages_art" alt=""
                  style="background: #f0f0f0; padding-left: 2.5rem; padding-right: 2.5rem">
              </div>
              <div v-else>
                <img :src="require('@/assets/images/car-art.png')" alt="" class="img-fluid py-2"
                  style="background: #f0f0f0; padding-left: 2.5rem; padding-right: 2.5rem">
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-1 d-sm-none"></div>
      </div>
      <div class="row mb-2 mt-5">
        <div class="col-md-1 col-sm-12">
          <h5 class="mb-0">{{t('form-fields.photos')}}</h5>
        </div>
        <div class="col-md-11 col-sm-12">
          <h6 class="mb-0">{{t('dashboard-reservation.photos-at-handover')}}</h6>
        </div>
      </div>
      <div class="row mx-0 mt-3" v-if="data?.handoverphoto">
        <div class="col-md-10 offset-md-1 col-sm-12">
          <div class="row mx-0">
            <div class="col-md-4 col-sm-6 col-xs-12" v-for="photo in data?.handoverphoto" :key="photo.id">
              <div class="mb-2">
                <img class="img-fluid" :src="imageBaseUrl(`/${photo.folder}/${photo.file_name}`)" alt="">
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-1 d-sm-none"></div>
      </div>
    </div>

    <!-- Rates -->
    <div class="bordered-content py-3 px-4 mb-4" style="border: 1px solid #dddddd; border-radius: 4px">
      <h5 class="mb-4">{{t('dashboard-reservation.rates')}}</h5>
      <div class="row">
        <div class="col-md-10 offset-md-1 col-sm-12">
          <div class="row mx-0 details-section">
            <div class="col-lg-6 col-md-12 col-sm-12 px-0">
              <div class="row mx-0 mb-2">
                <div class="col-lg-5 col-md-6 col-sm-12">
                  <h6 class="text-gray">{{t('form-fields.rental-price-per-day')}}</h6>
                </div>
                <div class="col-lg-7 col-md-6 col-sm-12">
                  <p class="mb-0">{{moneyFormat(Number(data?.reservation?.per_hour_rate *24).toFixed(2), locale) }} </p>
                </div>
              </div>
              <div class="row mx-0 mb-2">
                <div class="col-lg-5 col-md-6 col-sm-12">
                  <h6 class="text-gray">{{t('form-fields.rental-days')}}</h6>
                </div>
                <div class="col-lg-7 col-md-6 col-sm-12">
                  <p class="mb-0">{{parseInt(data?.reservation?.rental_hours / 24)}} Days
                    {{data?.reservation?.rental_hours % 24}} Hours </p>
                </div>
              </div>
              <div class="row mx-0 mb-2">
                <div class="col-lg-5 col-md-6 col-sm-12">
                  <h6 class="text-gray">{{t('form-fields.pickup-fee')}}</h6>
                </div>
                <div class="col-lg-7 col-md-6 col-sm-12">
                  <p class="mb-0">{{moneyFormat(data?.reservation?.pick_up_fee, locale) }}</p>
                </div>
              </div>
              <div class="row mx-0 mb-3">
                <div class="col-lg-5 col-md-6 col-sm-12">
                  <h6 class="text-gray">{{t('form-fields.out-of-hours-fee')}}</h6>
                </div>
                <div class="col-lg-7 col-md-6 col-sm-12">
                  <p class="mb-0">{{moneyFormat(data?.reservation?.out_of_hours_fee, locale)}} </p>
                </div>
              </div>
              <div class="row mx-0 mb-2">
                <div class="col-lg-5 col-md-6 col-sm-12">
                  <h6 class="text-gray">{{t('form-fields.other-costs')}}</h6>
                </div>
                <div class="col-lg-7 col-md-6 col-sm-12">
                  <p class="mb-1">{{moneyFormat(data?.reservation?.others_costs, locale)}} </p>
                </div>
              </div>
              <div class="row mx-0 mb-3">
                <div class="col-lg-5 col-md-6 col-sm-12">
                  <h6 class="text-gray">{{t('form-fields.charges-for-extras')}}</h6>
                </div>
                <div class="col-lg-7 col-md-6 col-sm-12">
                  <p class="mb-1">{{moneyFormat(data?.reservation?.charges_for_extras, locale)}} </p>
                </div>
              </div>
              <div class="row mx-0 mb-2">
                <div class="col-lg-5 col-md-6 col-sm-12">
                  <h6 class="text-gray">{{t('form-fields.discount') }}</h6>
                </div>
                <div class="col-lg-7 col-md-6 col-sm-12">
                  <p class="mb-0">{{data?.reservation?.discount}} €</p>
                </div>
              </div>
              <div class="row mx-0 mb-2">
                <div class="col-lg-5 col-md-6 col-sm-12">
                  <h6 class="text-gray">{{t('form-fields.vat')}}</h6>
                </div>
                <div class="col-lg-7 col-md-6 col-sm-12">
                  <p class="mb-0">{{moneyFormat(Number(data?.reservation?.vat_amount).toFixed(2), locale)}}</p>
                </div>
              </div>
              <div class="row mx-0 mb-2">
                <div class="col-lg-5 col-md-6 col-sm-12">
                  <h6 class="text-gray">{{t('form-fields.total-without-vat')}}</h6>
                </div>
                <div class="col-lg-7 col-md-6 col-sm-12">
                  <p class="mb-0">{{moneyFormat(Number(data?.reservation?.total_without_vat).toFixed(2), locale)}}</p>
                </div>
              </div>
              <div class="row mx-0 mb-2">
                <div class="col-lg-5 col-md-6 col-sm-12">
                  <h6 class="text-gray">{{t('form-fields.total-amount-paid')}}</h6>
                </div>
                <div class="col-lg-7 col-md-6 col-sm-12">
                  <p class="mb-0">{{moneyFormat(Number(data?.reservation?.total_amount_paid).toFixed(2), locale)}}</p>
                </div>
              </div>
              <div class="row mx-0 mb-2">
                <div class="col-lg-5 col-md-6 col-sm-12">
                  <h6 class="text-gray">{{t('form-fields.to-pay')}}</h6>
                </div>
                <div class="col-lg-7 col-md-6 col-sm-12">
                  <p class="mb-0">{{moneyFormat(Number(data?.reservation?.to_pay).toFixed(2), locale)}}</p>
                </div>
              </div>
              <div class="row mx-0 mb-2">
                <div class="col-lg-5 col-md-6 col-sm-12">
                  <h6 class="text-gray">{{t('form-fields.payment-method')}}</h6>
                </div>
                <div class="col-lg-7 col-md-6 col-sm-12">
                  <p class="mb-0">{{data?.reservation?.payment_method}}</p>
                </div>
              </div>
            </div>
            <div class="col-lg-6 col-md-12 col-sm-12 px-0">
              <div class="row mx-0 mb-2">
                <div class="col-md-6 col-sm-12">
                  <h6 class="text-gray">{{t('form-fields.deposit')}}</h6>
                </div>
                <div class="col-md-6 col-sm-12">
                  <p class="mb-0">{{moneyFormat(data?.reservation?.deposit, locale)}}</p>
                </div>
              </div>
              <div class="row mx-0 mb-2">
                <div class="col-md-6 col-sm-12">
                  <h6 class="text-gray">{{t('form-fields.payment-method')}}</h6>
                </div>
                <div class="col-md-6 col-sm-12">
                  <p class="mb-0">{{data?.reservation?.payment_method_for_deposit}}</p>
                </div>
              </div>
              <div class="row mx-0 mb-2">
                <div class="col-md-6 col-sm-12">
                  <h6 class="text-gray">{{t('form-fields.preauthorization-code')}}</h6>
                </div>
                <div class="col-md-6 col-sm-12">
                  <p class="mb-0">{{data?.reservation?.preauthorization_code}}</p>
                </div>
              </div>
              <div class="row mx-0 mb-2">
                <div class="col-md-6 col-sm-12">
                  <h6 class="text-gray">{{t('form-fields.deductible-fire/theft')}}</h6>
                </div>
                <div class="col-md-6 col-sm-12">
                  <p class="mb-0">{{moneyFormat(data?.reservation?.deductible_fire_theft, locale)}}</p>
                </div>
              </div>
              <div class="row mx-0 mb-2">
                <div class="col-md-6 col-sm-12">
                  <h6 class="text-gray">{{t('form-fields.deductible-damage')}}</h6>
                </div>
                <div class="col-md-6 col-sm-12">
                  <p class="mb-0">{{moneyFormat(data?.reservation?.deductible_damage, locale)}} </p>
                </div>
              </div>
              <div class="row mx-0 mb-2">
                <div class="col-md-6 col-sm-12">
                  <h6 class="text-gray">{{t('form-fields.deductible-liability')}}</h6>
                </div>
                <div class="col-md-6 col-sm-12">
                  <p class="mb-0">{{moneyFormat(data?.reservation?.deductible_liability, locale)}} </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-1 d-sm-none"></div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="row mx-0">
      <div class="col-md-12 text-right">
        <PrimaryButton variant="light">
          <app-link :path="`/reservierungen`" class="pointer" style="color: #333">
            {{t('button.back')}}
          </app-link>
        </PrimaryButton>
        <OutlineBgBtn style="background-color:white; color: #333; border-color: black;" class="mx-3">
          <app-link :path="`/reservierungen/aktualisieren/${data?.reservation?.id}`" class="pointer"
            style="color: #333; width: 100%; height: 100%; ">
            {{t('button.edit')}}
          </app-link>
        </OutlineBgBtn>
        <PrimaryButton variant="dark">
          <app-link :path="`/reservierungen/vertrags-vorschau/${data?.reservation?.id}`" class="pointer text-white">
            {{t('button.contract-preview')}}
          </app-link>
        </PrimaryButton>
      </div>
    </div>
  </template>

</template>

<style lang="scss" scoped>
.details-section {
  .text-gray {
    color: #666666;
    opacity: 0.8;
  }

  p {
    color: #020918;
    font-weight: 400;
  }
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
    tr:last-child {
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
