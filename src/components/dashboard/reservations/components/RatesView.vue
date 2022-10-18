<template>
  <div v-if="cardData" class="details-card">
    <div class="details-card__body">
      <ul class="details">
        <li class="details__item">
          <h6 class="details__item__label">{{$t('form-fields.rental-price-per-hour')}}</h6>
          <p class="details__item__value">
            {{ cardData.per_hour_rate + " " + currency }}
          </p>
        </li>
        <li class="details__item">
          <h6 class="details__item__label">{{$t('form-fields.rental-period')}}</h6>
          <p class="details__item__value">{{ cardData.rental_hours }}</p>
        </li>
        <li class="details__item">
          <h6 class="details__item__label">{{$t('form-fields.pick-up-fee')}}</h6>
          <p class="details__item__value">
            {{ cardData.pick_up_fee + " " + currency }}
          </p>
        </li>
        <li class="details__item">
          <h6 class="details__item__label">{{$t('form-fields.out-of-hours-fee')}}</h6>
          <p class="details__item__value">
            {{ cardData.out_of_hours_fee + " " + currency }}
          </p>
        </li>
        <li class="details__item">
          <h6 class="details__item__label">{{$t('form-fields.other-costs')}}</h6>
          <p class="details__item__value">
            {{ cardData.others_costs + " " + currency }}
          </p>
        </li>
        <li class="details__item">
          <h6 class="details__item__label">{{$t('form-fields.charges-for-extras')}}</h6>
          <p class="details__item__value">
            {{ cardData.charges_for_extras + " " + currency }}
          </p>
        </li>
        <li class="details__item">
          <h6 class="details__item__label">{{$t('form-fields.discount')}}</h6>
          <p class="details__item__value">
            {{ cardData.discount + " " + currency }}
          </p>
        </li>
        <li class="details__item">
          <h6 class="details__item__label">{{$t('form-fields.vat')}}</h6>
          <p class="details__item__value">
            {{ cardData.vat_amount + " " + currency }}
          </p>
        </li>
        <li class="details__item">
          <h6 class="details__item__label">{{$t('form-fields.total-without-vat')}}</h6>
          <p class="details__item__value">{{ cardData.total_without_vat }}</p>
        </li>
        <li class="details__item">
          <h6 class="details__item__label">{{$t('form-fields.total-amount-paid')}}</h6>
          <p class="details__item__value">
            {{ cardData.total_amount_paid + " " + currency }}
          </p>
        </li>
        <li class="details__item">
          <h6 class="details__item__label">{{$t('form-fields.to-pay')}}</h6>
          <p class="details__item__value">
            {{ cardData.to_pay + " " + currency }}
          </p>
        </li>
        <li class="details__item">
          <h6 class="details__item__label">{{$t('form-fields.payment-method')}}</h6>
          <p class="details__item__value">{{ cardData.payment_method }}</p>
        </li>
      </ul>
      <!-- col 2 -->
      <ul class="details">
        <li class="details__item">
          <h6 class="details__item__label">{{$t('form-fields.deposit')}}</h6>
          <p class="details__item__value">
            {{ cardData.deposit + " " + currency }}
          </p>
        </li>
        <li class="details__item">
          <h6 class="details__item__label">{{$t('form-fields.payment-method')}}</h6>
          <p class="details__item__value">
            {{ cardData.payment_method_for_deposit }}
          </p>
        </li>
        <li class="details__item">
          <h6 class="details__item__label">{{$t('form-fields.preauthorization-code')}}</h6>
          <p class="details__item__value">
            {{ cardData.preauthorization_code }}
          </p>
        </li>

        <li class="details__item">
          <h6 class="details__item__label">{{$t('form-fields.deductible-fire/theft')}}</h6>
          <p class="details__item__value">
            {{ cardData.deductible_fire_theft }}
          </p>
        </li>
        <li class="details__item">
          <h6 class="details__item__label">{{$t('form-fields.deductible-damage')}}</h6>
          <p class="details__item__value">{{ cardData.deductible_damage }}</p>
        </li>
        <li class="details__item">
          <h6 class="details__item__label">{{$t('form-fields.deductible-liability')}}</h6>
          <p class="details__item__value">
            {{ cardData.deductible_liability }}
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    cardData: {
      type: Object,
      default: () => ({}),
    },
    currency: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang="scss" scoped>
.details-card {
  width: 100%;
  border: 1px solid var(--color-light-grey-2);
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 1rem;
  padding-top: 1rem;

  .details {
    flex-basis: 50%;

    &__item {
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      margin-bottom: 0.75rem;

      &__label {
        font-size: 1rem;
        font-weight: 500;
        color: var(--color-heading);
        text-transform: capitalize;
        width: 50%;
        margin-bottom: 0;
      }

      &__value {
        margin-bottom: 0;
        font-size: 1rem;
        font-weight: 400;
        width: 50%;
      }
    }
  }

  &__body {
    padding: 1rem;
    display: flex;
  }
}
</style>
