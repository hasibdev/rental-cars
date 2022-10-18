<script setup>
import {  ref } from 'vue'
// import { storeToRefs } from 'pinia'
import moment from 'moment'
import UserCard from "@/components/dashboard/reservations/components/UserCard.vue"
// import FormSelect from "@/components/dashboard/shared/FormSelect.vue"
// import FormSelectTime from "@/components/dashboard/shared/FormSelectTime.vue"
// import FormInput from "@/components/dashboard/shared/FormInput.vue"
// import CalenderControl from "@/components/dashboard/form/CalenderControl.vue"
// import FormTextarea from "@/components/dashboard/shared/FormTextarea.vue"
// import http from "@/helpers/http"
// import times from "@/static/times.json"
import { useI18n } from 'vue-i18n'
import { useReservationStore } from '@/stores/reservation'
import { useAxios } from '@/use/useAxios'
import { useRoute } from 'vue-router'

const route = useRoute()

const reserveStore = useReservationStore()
const { t, locale } = useI18n({ useScope: 'global' })
// const localeTime = ref(times)

const { data, loading } = useAxios(`admin/reservation/view/${route.params.id}`)
const { data: userData } = useAxios(`admin/users`)
const { data: fuelLevelData } = useAxios('/admin/fuel-lavel')
  const closedBy = ref('')
  closedBy.value = userData?.data?.find(x=> x.id == reserveStore.endRental.closed_by).name

const getImageUrl = (x) => {
  return URL.createObjectURL(x)
}
</script>

<template>
  <div class="p-4">
    <!-- Loading -->
    <Loading v-if="loading" class="my-3" />

    <template v-if="!loading && data?.reservation && data?.customerinfo">
      <!-- Customer Info   -->
      <div class="bordered-content py-3 px-4 mb-4" style="border: 1px solid #dddddd; border-radius: 4px">
        <h5 class="mb-4">{{t('dashboard-reservation.customer-info')}}</h5>
        <div class="row">
          <div class="col-lg-8 offset-lg-2 col-md-10 offset-md-1 col-sm-12">
            <UserCard :user="data?.customerinfo" />
          </div>
          <div class="col-lg-2 col-md-1 d-sm-none"></div>
        </div>
      </div>

      <!-- Reservation Details -->
      <!-- <pre>{{userData}}</pre> -->
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
                    <p class="mb-0" v-if="data?.reservation?.create_name">
                      {{ data?.reservation?.create_name }}
                    </p>
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
                    <!-- <p class="mb-0">{{reserveStore.endRental.closed_by}}</p> -->
                    <p class="mb-0" v-if="reserveStore?.endRental?.closed_by">{{ reserveStore?.endRental?.closed_by_name }}</p>
                    <!-- <p class="mb-0" v-if="reserveStore?.endRental?.closed_by">{{ reserveStore.endRental.closed_by }}</p> -->
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
                    <p class="mb-0" v-if="locale == 'de'">{{moment(data?.reservation?.start_date).format('DD.MM.YYYY')}}</p>
                    <p class="mb-0" v-else>{{moment(data?.reservation?.start_date).format('DD/MM/YYYY')}}</p>
                  </div>
                </div>
                <div class="row mx-0 mb-2">
                  <div class="col-lg-5 col-md-6 col-sm-12">
                    <h6 class="text-gray">{{t('form-fields.start-time')}}</h6>
                  </div>
                  <div class="col-lg-7 col-md-6 col-sm-12">
                    <p class="mb-0" v-if="locale == 'de'">{{moment(data?.reservation?.start_time, "HH:mm:ss").format('HH:mm')}}</p>
                    <p class="mb-0" v-else>{{moment(data?.reservation?.start_time, "HH:mm:ss").format('h:mm A')}}</p>
                  </div>
                </div>
                <div class="row mx-0 mb-2">
                  <div class="col-lg-5 col-md-6 col-sm-12">
                    <h6 class="text-gray">{{t('form-fields.end-date')}}</h6>
                  </div>
                  <div class="col-lg-7 col-md-6 col-sm-12">
                    <p class="mb-0" v-if="locale == 'de'">{{moment(reserveStore.endRental.actual_end_date).format('DD.MM.YYYY')}}</p>
                    <p class="mb-0" v-else>{{moment(reserveStore.endRental.actual_end_date).format('DD/MM/YYYY')}}</p>
                  </div>
                </div>
                <div class="row mx-0 mb-2">
                  <div class="col-lg-5 col-md-6 col-sm-12">
                    <h6 class="text-gray">{{t('form-fields.end-time')}}</h6>
                  </div>
                  <div class="col-lg-7 col-md-6 col-sm-12">
                    <p class="mb-0" v-if="locale == 'de'">{{moment(reserveStore.endRental.actual_end_time, "HH:mm:ss").format('HH:mm')}}</p>
                    <p class="mb-0" v-else>{{moment(reserveStore.endRental.actual_end_time, "HH:mm:ss").format('h:mm A')}}</p>
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
                    <p class="mb-0" v-if="reserveStore.endRental.fuel_level_at_return">{{ fuelLevelData?.find(x => x.id == reserveStore.endRental.fuel_level_at_return).label_name }}</p>
                    <!-- <p class="mb-0">{{reserveStore.endRental.fuel_level_at_return_id}}</p> -->
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
                    <p class="mb-0">{{moneyFormat(Number(data?.reservation?.cost_per_extra_km).toFixed(2), locale) }}</p> 
                  </div>
                </div>
                <!-- <div class="row mx-0 mb-2">
                  <div class="col-md-6 col-sm-12">
                    <h6 class="text-gray">{{t('form-fields.pick-up-fee')}}</h6> 
                  </div>
                  <div class="col-md-6 col-sm-12">
                    <p class="mb-0">{{moneyFormat(Number(reserveStore.endRental.pick_up_fee).toFixed(2), locale) }}</p> 
                  </div>
                </div> -->
                <div class="row mx-0 mb-2">
                  <div class="col-md-6 col-sm-12">
                    <h6 class="text-gray">{{t('form-fields.km-at-pickup')}}</h6>
                  </div>
                  <div class="col-md-6 col-sm-12">
                    <p class="mb-0">{{data?.reservation?.km_at_pick_up}} km</p>
                  </div>
                </div>
                <div class="row mx-0 mb-2">
                  <div class="col-md-6 col-sm-12">
                    <h6 class="text-gray">{{t('form-fields.km-at-return')}}</h6>
                  </div>
                  <div class="col-md-6 col-sm-12">
                    <p class="mb-0">{{reserveStore.endRental.km_at_return}} km</p>
                  </div>
                </div>
                <!-- <div class="row mx-0 mb-2">
                  <div class="col-md-6 col-sm-12">
                    <h6 class="text-gray">{{t('form-fields.return-fee')}}</h6> 
                  </div>
                  <div class="col-md-6 col-sm-12">
                    <p class="mb-0">{{moneyFormat(Number(reserveStore.endRental.return_fee).toFixed(2), locale) }}</p> 
                  </div>
                </div>
                <div class="row mx-0 mb-2">
                  <div class="col-md-6 col-sm-12">
                    <h6 class="text-gray">{{t('form-fields.refueling-fee')}}</h6> 
                  </div>
                  <div class="col-md-6 col-sm-12">
                    <p class="mb-0">{{moneyFormat(Number(reserveStore.endRental.refueling_fee).toFixed(2), locale) }}</p> 
                  </div>
                </div> -->
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
                    <p class="mb-0">{{reserveStore.endRental.note}}</p>
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
                        <div v-if="data.customerinfo.date_of_birth">
                        <p class="details__item__value" v-if="locale == 'de' ">{{ moment(data.customerinfo.date_of_birth).format('DD.MM.YYYY') }}</p>
                        <p class="details__item__value" v-else>{{ moment(data.customerinfo.date_of_birth).format('DD/MM/YYYY') }}</p>
                        </div>
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
                        <h6 class="details__item__label">{{t('form-fields.driving-license-no') }}:</h6>
                      </div>
                      <div class="col-md-6 col-sm-12">
                        <p class="details__item__value">{{ data.customerinfo.drivers_license_no }}</p>
                      </div>
                    </div>
                    <div class="row mx-0">
                      <div class="col-md-6 col-sm-12 px-0">
                        <h6 class="details__item__label">{{t('form-fields.place-of-issue') }}:</h6>
                      </div>
                      <div class="col-md-6 col-sm-12">
                        <p class="details__item__value">{{ data.customerinfo.place_of_issunce_of_driving_license }}</p>
                      </div>
                    </div>
                    <div class="row mx-0">
                      <div class="col-md-6 col-sm-12 px-0">
                        <h6 class="details__item__label">{{t('form-fields.date-of-issue') }}:</h6>
                      </div>
                      <div class="col-md-6 col-sm-12">
                        <div v-if="data.customerinfo.date_of_issunce_of_driving_license">
                          <p class="details__item__value" v-if="locale == 'de'">{{ moment(data.customerinfo.date_of_issunce_of_driving_license).format('DD.MM.YYYY') }}</p>
                          <p class="details__item__value" v-else>{{ moment(data.customerinfo.date_of_issunce_of_driving_license).format('DD/MM/YYYY') }}</p>
                        </div>
                      </div>
                    </div>
                    <div class="row mx-0">
                      <div class="col-md-6 col-sm-12 px-0">
                        <h6 class="details__item__label">{{t('form-fields.due-date') }}:</h6>
                      </div>
                      <div class="col-md-6 col-sm-12">
                        <div v-if="data.customerinfo.expiry_date_of_driving_license">
                        <p class="details__item__value" v-if="locale == 'de' ">{{ moment(data.customerinfo.expiry_date_of_driving_license).format('DD.MM.YYYY') }}</p>
                        <p class="details__item__value" v-else>{{ moment(data.customerinfo.expiry_date_of_driving_license).format('DD/MM/YYYY') }}</p>
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
                          <div v-if="driver.date_of_birth">
                            <p class="details__item__value" v-if="locale == 'de'">{{ moment(driver.date_of_birth).format('DD.MM.YYYY') }}</p>
                            <p class="details__item__value" v-else>{{ moment(driver.date_of_birth).format('DD/MM/YYYY') }}</p>
                          </div>
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
                          <h6 class="details__item__label">{{t('form-fields.date-of-issue') }}:</h6>
                        </div>
                        <div class="col-md-6 col-sm-12">
                          <div v-if="driver.date_of_issue">
                            <p class="details__item__value" v-if="locale == 'de' ">{{ moment(driver.date_of_issue).format('DD.MM.YYYY') }}</p>
                            <p class="details__item__value" v-else>{{ moment(driver.date_of_issue).format('DD/MM/YYYY') }}</p>
                          </div>
                        </div>
                      </div>
                      <div class="row mx-0">
                        <div class="col-md-6 col-sm-12 px-0">
                          <h6 class="details__item__label">{{t('form-fields.due-date') }}:</h6>
                        </div>
                        <div class="col-md-6 col-sm-12">
                          <div v-if="driver.due_date">
                            <p class="details__item__value" v-if="locale == 'de' ">{{ moment(driver.due_date).format('DD.MM.YYYY') }}</p>
                            <p class="details__item__value" v-else>{{ moment(driver.due_date).format('DD/MM/YYYY') }}</p>
                          </div>
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

      <!-- Damage Photos -->
      <div class="bordered-content py-3 px-4 mb-4" style="border: 1px solid #dddddd; border-radius: 4px">
        <h5 class="mb-4">{{t('form-fields.damages')}}</h5>
        <div class="row">
          <div class="col-md-10 offset-md-1 col-sm-12">
            <h6 class="mb-3" style="#333333">{{t('form-fields.damage-description-at-handover')}}</h6>
            <div class="row mx-0 details-section">
              <div class="col-lg-4 col-md-12 col-sm-12">
                <div class="bordered-content py-3 px-4" style="border: 1px solid #dddddd; border-radius: 4px;width: 100%; min-height: 292px;">
                  {{reserveStore.endRental.return_content}} 
                </div>
              </div>
              <div class="col-lg-8 col-md-12 col-sm-12 ">
                <div v-if="reserveStore.endRental.return_art != null" class="text-right">
                  <img class="img-fluid" :src="reserveStore.endRental.return_art" alt="" style="background: #f0f0f0; padding-left: 2.5rem; padding-right: 2.5rem">
                </div>
                <div v-else class="text-right">
                  <img :src="require('@/assets/images/car-art.png')" alt="" class="img-fluid py-2" style="background: #f0f0f0; padding-left: 2.5rem; padding-right: 2.5rem">
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
        <div class="row mx-0 mt-3" v-if="reserveStore.endRental.returns_photos">
          <div class="col-md-10 offset-md-1 col-sm-12">
            <div class="row mx-0">
              <div class="col-md-4 col-sm-6 col-xs-12" v-for="photo in reserveStore.endRental.returns_photos" :key="photo.id">
                <div class="mb-2">
                  <a :href="getImageUrl(photo)" target="_blank" class="text-decoration-none">
                    <img class="img-fluid" :src="getImageUrl(photo)" alt="">
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-1 d-sm-none"></div>
        </div>
      </div>
      
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
                    <p class="mb-0">{{parseInt(reserveStore.endRental.rental_hours / 24)}} Days {{reserveStore.endRental.rental_hours % 24}} Hours </p>
                  </div>
                </div>
                <div class="row mx-0 mb-2">
                  <div class="col-lg-5 col-md-6 col-sm-12">
                    <h6 class="text-gray">{{t('form-fields.pickup-fee')}}</h6>
                  </div>
                  <div class="col-lg-7 col-md-6 col-sm-12">
                    <p class="mb-0">{{moneyFormat(reserveStore.endRental.pick_up_fee, locale) }}</p>
                  </div>
                </div>
                <div class="row mx-0 mb-3">
                  <div class="col-lg-5 col-md-6 col-sm-12">
                    <h6 class="text-gray">{{t('form-fields.out-of-hours-fee')}}</h6>
                  </div>
                  <div class="col-lg-7 col-md-6 col-sm-12">
                    <p class="mb-0">{{moneyFormat(reserveStore.endRental.out_of_hours_fee, locale)}} </p>
                  </div>
                </div>
                <!-- <div class="row mx-0 mb-2">
                  <div class="col-lg-5 col-md-6 col-sm-12">
                    <h6 class="text-gray">{{t('form-fields.other-costs')}}</h6>
                  </div>
                  <div class="col-lg-7 col-md-6 col-sm-12">
                    <p class="mb-1">{{moneyFormat(data?.reservation?.others_costs, locale)}} </p>
                  </div>
                </div> -->
                <div class="row mx-0 mb-3">
                  <div class="col-lg-5 col-md-6 col-sm-12">
                    <h6 class="text-gray">{{t('form-fields.charges-for-extras')}}</h6>
                  </div>
                  <div class="col-lg-7 col-md-6 col-sm-12">
                    <p class="mb-1">{{moneyFormat(reserveStore.endRental.charges_for_extras, locale)}} </p>
                  </div>
                </div>
                <div class="row mx-0 mb-2">
                  <div class="col-lg-5 col-md-6 col-sm-12">
                    <h6 class="text-gray">{{t('form-fields.discount') }}</h6>
                  </div>
                  <div class="col-lg-7 col-md-6 col-sm-12">
                    <p class="mb-0">{{data?.reservation?.discount}} %</p>
                  </div>
                </div>
                <div class="row mx-0 mb-2">
                  <div class="col-lg-5 col-md-6 col-sm-12">
                    <h6 class="text-gray">{{t('form-fields.vat')}}</h6>
                  </div>
                  <div class="col-lg-7 col-md-6 col-sm-12">
                    <p class="mb-0">{{moneyFormat(Number(reserveStore.endRental.vat_amount).toFixed(2), locale)}}</p>
                  </div>
                </div>
                <div class="row mx-0 mb-2">
                  <div class="col-lg-5 col-md-6 col-sm-12">
                    <h6 class="text-gray">{{t('form-fields.total-without-vat')}}</h6>
                  </div>
                  <div class="col-lg-7 col-md-6 col-sm-12">
                    <p class="mb-0">{{moneyFormat(Number(reserveStore.endRental.total_without_vat).toFixed(2), locale)}}</p>
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
                    <p class="mb-0">{{moneyFormat(Number(reserveStore.endRental.to_pay, locale).toFixed(2), locale)}}</p>
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
      <!-- <div class="row mx-0">
            <div class="col-md-12 text-right">
                <PrimaryButton variant="light">
                    <app-link :path="`/reservations`" class="pointer" style="color: #333">
                        Back
                    </app-link>
                </PrimaryButton>
                <PrimaryButton variant="dark">
                    <app-link :path="`/reservations/contract-preview/${data?.reservation?.id}`" class="pointer text-white">
                        End Rental
                    </app-link>
                </PrimaryButton>
            </div>
        </div> -->
    </template>
  </div>
</template>


<style lang="scss" scoped>
</style>
