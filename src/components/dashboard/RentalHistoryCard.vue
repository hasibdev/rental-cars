<script setup>
import { defineProps } from 'vue'
import { useI18n } from 'vue-i18n'
// import VehicleImage from '@/assets/images/carPLaceholder.svg'

import StatusButton from "@/components/dashboard/shared/StatusButton.vue"

const { locale } = useI18n({ useScope: 'global' })
const props = defineProps({
  history: {
    type: Object,
    required: true
  }
})

const getStatus = (val) => {
  if (val == 'Reserved') return 'primary'
  if (val == 'Rented') return 'warning'
  if (val == 'Completed') return 'success'
  if (val == 'Cancelled') return 'danger'

  return 'primary'
}

</script>

<template>
  <div class="r-history-card">
    <div class="r-history-card__left">
      <div class="r-history-card__left-img">
        <app-link :path="`/reservierungen/reservierungsvorschau/${props.history.id}`">
          <img v-if="props.history.picture" :src="imageBaseUrl(`/documents/${props.history.picture}`)" alt="" />
          <img v-else src="../../assets/images/carPlaceholder.svg" alt="" />
        </app-link>
      </div>
      <p class="r-history-card__left-id">ID #{{ props.history.reservation_no }}</p>
      <h5 class="r-history-card__left-price">{{ moneyFormat(props.history.vat_amount, locale) }}</h5>
    </div>

    <div class="r-history-card__right">
      <h4 class="r-history-card__right-title">{{ props.history.vehicle_name }} {{ props.history.model }}</h4>

      <div class="r-history-card__right-dsc">
        <div>
          <div v-if="locale === 'en' ">
            <p class="r-history-card__left-id date">{{ moment(props.history.start_date).format('DD/MM/YYYY') }}</p>
            <h6 class="time">{{ moment(props.history.start_time, "HH:mm:ss").format('h:mm A') }}</h6>
          </div>
          <div v-else>
            <p class="r-history-card__left-id date">{{ moment(props.history.start_date).format('DD.MM.YYYY') }}</p>
            <h6 class="time">{{ moment(props.history.start_time, "HH:mm:ss").format('HH:mm') }}</h6>
          </div>
        </div>
        <div>
          <div v-if="locale === 'en'">
            <p class="r-history-card__left-id date">{{ moment(props.history.end_date).format('DD/MM/YYYY') }}</p>
            <h6 class="time">{{ moment(props.history.end_time, "HH:mm:ss").format('h:mm A') }} </h6>
          </div>
          <div v-else>
            <p class="r-history-card__left-id date">{{ moment(props.history.end_date).format('DD.MM.YYYY') }}</p>
            <h6 class="time">{{ moment(props.history.end_time, "HH:mm:ss").format('HH:mm') }} </h6>
          </div>
        </div>
      </div>

      <div class="r-history-card__actions">
        <StatusButton :type="getStatus(props.history.reservation_status)"
          v-if="props.history.reservation_status == 'Reserved'">{{ $t('form-fields.reserved') }}</StatusButton>
        <StatusButton :type="getStatus(props.history.reservation_status)"
          v-if="props.history.reservation_status == 'Rented'">{{ $t('form-fields.rented') }}</StatusButton>
        <StatusButton :type="getStatus(props.history.reservation_status)"
          v-if="props.history.reservation_status == 'Cancelled'">{{ $t('form-fields.cancelled') }}</StatusButton>
        <StatusButton :type="getStatus(props.history.reservation_status)"
          v-if="props.history.reservation_status == 'Completed'">{{ $t('form-fields.completed') }}</StatusButton>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.r-history-card {
  display: flex;
  justify-content: space-between;
  width: 100%;
  border: 1px solid var(--color-light-grey);
  margin-bottom: 10px;
  border-radius: 5px;
  padding: 0.65rem;

  &:hover {
    border-color: var(--color-light-grey-2);
  }

  &__left {
    margin-right: 1rem;

    &-img {
      width: 90px;
      height: auto;
      overflow: hidden;
      border-radius: 5px;
      margin-bottom: 0.25rem;

      img {
        width: 100%;
        height: auto;
        aspect-ratio: 16/10;
        object-fit: cover;
      }
    }

    &-id {
      font-size: 10px;
      font-weight: 400;
      color: var(--color-grey);
      text-align: center;
      margin-bottom: 0.25rem;
    }

    &-price {
      font-weight: 500;
      font-size: 14px;
      text-align: center;
      color: var(--color-dark);
    }
  }

  &__right {
    flex: 1 1 auto;

    &-title {
      font-weight: 500;
      font-size: 1rem;
      text-align: left;
      color: var(--color-dark);
      margin-bottom: 0.25rem;
    }

    &-dsc {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.75rem;

      .date {
        margin-bottom: 0.25rem;
      }

      .time {
        font-size: 14px;
        font-weight: 500;
        color: var(--color-dark);
        margin-bottom: 0;
      }
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .action__btn {
      background-color: var(--color-success);
      color: var(--color-white);
      font-weight: 400;
      padding: 6px 14px;
      width: 50%;
      font-size: 0.875rem;

      &--red {
        background-color: var(--color-error);
      }

      &.completed {
        background-color: #f3fff8;
        color: #1bce6c;
      }

      &.cancel {
        background-color: #fffafa;
        color: var(--color-error);
      }
    }
  }
}
</style>
