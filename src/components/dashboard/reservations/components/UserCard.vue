<script setup>
import { defineProps } from 'vue'
// import {useAxios} from '@/use/useAxios'
import moment from 'moment'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n({ useScope: 'global' })
const props = defineProps({
  user: {
    type: Object,
    required: true,
    default: null
  }
})
  // const {countryData} = useAxios('/admin/country')
</script>
<template>

  <div v-if="user" class="user-card">
    <div class="user-card__header">
      <div class="user__img d-flex align-items-center justify-content-center">
        <!-- <img v-if="user.photo" :src="imageBaseUrl(`/profile/${user.photo}`)"  alt="" /> -->
        <!-- <img v-else src="@/assets/images/default-user.png" alt="user" /> -->
        <h3 class="mb-0">{{props.user.first_name.charAt(0)}}{{props.user.last_name.charAt(0)}}</h3>
      </div>
      <div class="user">
        <h5 class="user__name">{{ props.user.full_name }}</h5>
        <div class="row mx-0">
          <div class="col-lg-5 col-md-12 ps-0">
            <div class="row mx-0 align-items-center">
              <div class="col-lg-6 col-md-5 col-sm-5 px-0">
                <h6 class="mb-1">{{ $t('form-fields.nationality') }}</h6>
              </div>
              <div class="col-lg-6 col-md-7 col-sm-7 ps-0">
                <p class="mb-1">{{ props.user.nationality_name }}</p>
              </div>
            </div>
            <div class="row mx-0 align-items-center">
              <div class="col-lg-6 col-md-5 col-sm-5 px-0">
                <h6 class="mb-1">{{ $t('form-fields.customer-type') }}</h6>
              </div>
              <div class="col-lg-6 col-md-7 col-sm-7 ps-0">
                <p class="mb-1" v-if="props.user.customer_type == 'Private'">{{ t('dashboard-customer.private') }}</p>
                <p class="mb-1" v-if="props.user.customer_type == 'Commercial'">{{ t('dashboard-customer.commercial') }}</p>
              </div>
            </div>
          </div>
          <div class="col-lg-7 col-md-12 px-0">
            <div class="row mx-0 align-items-center">
              <div class="col-lg-4 col-md-5 col-sm-5 ps-0">
                <h6 class="mb-1">{{ $t('form-fields.email') }}</h6>
              </div>
              <div class="col-lg-8 col-md-7 col-sm-7 ps-0 pe-0">
                <p class="mb-1">{{ props.user.email }}</p>
              </div>
            </div>
            <div class="row mx-0 align-items-center">
              <div class="col-lg-4 col-md-5 col-sm-5 ps-0">
                <h6 class="mb-1">{{ $t('form-fields.phone-no') }}</h6>
              </div>
              <div class="col-lg-8 col-md-7 col-sm-5 ps-0">
                <p class="mb-1">{{ props.user.phone }}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
    <div class="user-card__body">
      <div class="row mx-0">
        <div class="col-lg-5 col-md-12">
          <div class="row mx-0 align-items-center mb-2">
            <div class="col-lg-5 col-md-7 col-sm-12 px-0">
              <div class="p label text-16 fw-500">{{ $t('form-fields.tax-id') }}: </div>
            </div>
            <div class="col-lg-7 col-md-5 col-sm-12 px-0">
              <div class="p value text-16 fw-400">{{props.user.tax_id}}</div>
            </div>
          </div>
          <div class="row mx-0 align-items-center mb-2">
            <div class="col-lg-5 col-md-7 col-sm-12 px-0">
              <div class="p label text-16 fw-500">{{ $t('form-fields.address') }}: </div>
            </div>
            <div class="col-lg-7 col-md-5 col-sm-12 px-0">
              <div class="p value text-16 fw-400">{{props.user.address}}</div>
            </div>
          </div>
          <div class="row mx-0 align-items-center mb-2">
            <div class="col-lg-5 col-md-7 col-sm-12 px-0">
              <div class="p label text-16 fw-500">{{ $t('form-fields.city/town') }}: </div>
            </div>
            <div class="col-lg-7 col-md-5 col-sm-12 px-0">
              <div class="p value text-16 fw-400">{{props.user.city}}</div>
            </div>
          </div>
          <div class="row mx-0 align-items-center mb-2">
            <div class="col-lg-5 col-md-7 col-sm-12 px-0">
              <div class="p label text-16 fw-500">{{ $t('form-fields.zip') }}: </div>
            </div>
            <div class="col-lg-7 col-md-5 col-sm-12 px-0">
              <div class="p value text-16 fw-400">{{props.user.zip}}</div>
            </div>
          </div>
          <div class="row mx-0 align-items-center mb-2">
            <div class="col-lg-5 col-md-7 col-sm-12 px-0">
              <div class="p label text-16 fw-500">{{ $t('form-fields.province')}}: </div>
            </div>
            <div class="col-lg-7 col-md-5 col-sm-12 px-0">
              <div class="p value text-16 fw-400">{{props.user.province}}</div>
            </div>
          </div>
          <div class="row mx-0 align-items-center mb-2">
            <div class="col-lg-5 col-md-7 col-sm-12 px-0">
              <div class="p label text-16 fw-500">{{ $t('form-fields.country')}}: </div>
            </div>
            <div class="col-lg-7 col-md-5 col-sm-12 px-0">
              <div class="p value text-16 fw-400">{{props.user.country_name}}</div>
            </div>
          </div>
          <div class="row mx-0 align-items-center mb-2">
            <div class="col-lg-5 col-md-7 col-sm-12 px-0">
              <div class="p label text-16 fw-500">{{ $t('form-fields.date-of-birth') }}: </div>
            </div>
            <div class="col-lg-7 col-md-5 col-sm-12 px-0">
              <div v-if="props.user.date_of_birth">
                <div class="p value text-16 fw-400" v-if="locale === 'en'">{{moment(props.user.date_of_birth).format('DD/MM/YYYY')}}</div>
                <div class="p value text-16 fw-400" v-else>{{moment(props.user.date_of_birth).format('DD.MM.YYYY')}}</div>
              </div>
            </div>
          </div>
          <div class="row mx-0 align-items-center mb-2">
            <div class="col-lg-5 col-md-7 col-sm-12 px-0">
              <div class="p label text-16 fw-500">{{ $t('form-fields.place-of-birth') }}: </div>
            </div>
            <div class="col-lg-7 col-md-5  col-sm-12 px-0">
              <div class="p value text-16 fw-400">{{props.user.place_of_birth}}</div>
            </div>
          </div>
        </div>
        <div class="col-lg-7 col-md-12">
          <div class="row mx-0 align-items-center mb-2">
            <div class="col-lg-8 col-md-7 col-sm-12 px-0">
              <div class="p label text-16 fw-500">{{ $t('form-fields.id-card-type') }}: </div>
            </div>
            <div class="col-lg-4 col-md-5 col-sm-12 px-0">
              <div class="p value text-16 fw-400">{{props.user.idcard_type}}</div>
            </div>
          </div>
          <div class="row mx-0 align-items-center mb-2">
            <div class="col-lg-8 col-md-7 col-sm-12 px-0">
              <div class="p label text-16 fw-500">{{ $t('form-fields.id-card-number') }}: </div>
            </div>
            <div class="col-lg-4 col-md-5 col-sm-12 px-0">
              <div class="p value text-16 fw-400">{{props.user.id_no}}</div>
            </div>
          </div>
          <div class="row mx-0 align-items-center mb-2">
            <div class="col-lg-8 col-md-7 col-sm-12 px-0">
              <div class="p label text-16 fw-500">{{ $t('form-fields.date-of-issuance') }}: </div>
            </div>
            <div class="col-lg-4 col-md-5 col-sm-12 px-0">
              <div class="p value text-16 fw-400" v-if="locale == 'en'">{{props.user.date_ofissunceotcard ? moment(props.user.date_ofissunceotcard).format('DD/MM/YYYY') : ''}}</div>
              <div class="p value text-16 fw-400" v-else>{{props.user.date_ofissunceotcard ? moment(props.user.date_ofissunceotcard).format('DD.MM.YYYY') : ''}}</div>
            </div>
          </div>
          <div class="row mx-0 align-items-center mb-2">
            <div class="col-lg-8 col-md-7 col-sm-12 px-0">
              <div class="p label text-16 fw-500">{{ $t('form-fields.place-of-issuance') }}: </div>
            </div>
            <div class="col-lg-4 col-md-5 col-sm-12 px-0">
              <div class="p value text-16 fw-400">{{props.user.place_of_id_issuance}}</div>
            </div>
          </div>
          <div class="row mx-0 align-items-center mb-2">
            <div class="col-lg-8 col-md-7 col-sm-12 px-0">
              <div class="p label text-16 fw-500">{{ $t('form-fields.expiry-date-of-card') }}: </div>
            </div>
            <div class="col-lg-4 col-md-5 col-sm-12 px-0">
              <div v-if="props.user.expiry_dateoftheidcard">
                <div class="p value text-16 fw-400" v-if="locale == 'en'">{{props.user.expiry_dateoftheidcard ? moment(props.user.expiry_dateoftheidcard).format('DD/MM/YYYY') : ''}}</div>
                <div class="p value text-16 fw-400" v-else>{{props.user.expiry_dateoftheidcard ? moment(props.user.expiry_dateoftheidcard).format('DD.MM.YYYY') : ''}}</div>
              </div>
            </div>
          </div>
          <hr>
          <div class="row mx-0 align-items-center mb-2">
            <div class="col-lg-8 col-md-7 col-sm-12 px-0">
              <div class="p label text-16 fw-500">{{ $t('form-fields.driving-license-no') }}: </div>
            </div>
            <div class="col-lg-4 col-md-5 col-sm-12 px-0">
              <div class="p value text-16 fw-400">{{user.drivers_license_no}}</div>
            </div>
          </div>
          <div class="row mx-0 align-items-center mb-2">
            <div class="col-lg-8 col-md-7 col-sm-12 px-0">
              <div class="p label text-16 fw-500">{{ $t('form-fields.date-of-issue') }}: </div>
            </div>
            <div class="col-lg-4 col-md-5 col-sm-12 px-0">
              <div class="p value text-16 fw-400" v-if="locale == 'en'">{{user.date_of_issunce_of_driving_license ? moment(user.date_of_issunce_of_driving_license).format('DD/MM/YYYY') : ''}}</div>
              <div class="p value text-16 fw-400" v-else>{{user.date_of_issunce_of_driving_license ? moment(user.date_of_issunce_of_driving_license).format('DD.MM.YYYY') : ''}}</div>
            </div>
          </div>
          <div class="row mx-0 align-items-center mb-2">
            <div class="col-lg-8 col-md-7 col-sm-12 px-0">
              <div class="p label text-16 fw-500">{{ $t('form-fields.place-of-issue') }}: </div>
            </div>
            <div class="col-lg-4 col-md-5 col-sm-12 px-0">
              <div class="p value text-16 fw-400" v-if="user.place_of_issunce_of_driving_license">{{user.place_of_issunce_of_driving_license}}</div>
            </div>
          </div>
          <div class="row mx-0 align-items-center mb-2">
            <div class="col-lg-8 col-md-7 col-sm-12 px-0">
              <div class="p label text-16 fw-500">{{ $t('form-fields.expiry-date') }}: </div>
            </div>
            <div class="col-lg-4 col-md-5 col-sm-12 px-0"> 
              <div class="p value text-16 fw-400" v-if="user.expiry_date_of_driving_license">
                <span v-if="locale == 'en'">{{moment(user.expiry_date_of_driving_license).format('DD/MM/YYYY')}}</span>
                <span v-else>{{moment(user.expiry_date_of_driving_license).format('DD.MM.YYYY')}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.user-card {
  width: 100%;
  border: 1px solid var(--color-light-grey-2);
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 1rem;
  .label {
    color: #666666;
  }
  .value {
    color: #020918;
  }

  &__header {
    display: flex;
    align-items: center;
    background-color: var(--color-light-grey);
    justify-content: flex-start;
    padding: 1rem;
  }

  .user {
    flex: 1 1 auto;

    &__img {
      --size: 100px;
      width: var(--size);
      height: var(--size);
      overflow: hidden;
      border-radius: 50%;
      background: #2b5797;
      color: white;
      margin-right: 2rem;
      // flex: 0 0 auto;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    &__name {
      margin-bottom: 1rem;
    }
  }

  .details {
    display: flex;
    flex-wrap: wrap;

    &__item {
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      width: 50%;
      margin-bottom: 0.75rem;

      &__label {
        font-size: 1rem;
        font-weight: 500;
        color: var(--color-heading);
        text-transform: capitalize;
        width: 35%;
        margin-bottom: 0;
      }

      &__value {
        margin-bottom: 0;
        font-size: 1rem;
        font-weight: 400;
        width: 65%;
      }
    }
  }

  &__body {
    padding: 1rem;
  }
}
</style>
