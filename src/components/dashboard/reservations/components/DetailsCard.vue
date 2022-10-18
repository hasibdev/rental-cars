<template>
  <div v-if="cardData" class="details-card">
    <div class="details-card__body">
      <ul class="details">
        <li class="details__item">
          <h6 class="details__item__label">Origin of Customer</h6>
          <p class="details__item__value">{{ cardData.origin_of_customer }}</p>
        </li>
        <li class="details__item">
          <h6 class="details__item__label">Created by</h6>
          <p class="details__item__value">{{ cardData.create_name }}</p>
        </li>
        <li class="details__item">
          <h6 class="details__item__label">Vehicle</h6>
          <p class="details__item__value">{{ cardData.vehicle_name }}</p>
        </li>
        <li class="details__item">
          <h6 class="details__item__label">Cloesed by</h6>
          <p class="details__item__value">{{ cardData.cloesed_by }}</p>
        </li>
        <li class="details__item">
          <h6 class="details__item__label">Pick- Up Location</h6>
          <p class="details__item__value">{{ cardData.pick_locationname }}</p>
        </li>
        <li class="details__item">
          <h6 class="details__item__label">Return Location</h6>
          <p class="details__item__value">{{ cardData.return_locationname }}</p>
        </li>
        <li class="details__item">
          <h6 class="details__item__label">Start Date</h6>
          <p class="details__item__value">{{ cardData.start_date }}</p>
        </li>
        <li class="details__item">
          <h6 class="details__item__label">Start Time</h6>
          <p class="details__item__value">{{ cardData.start_time }}</p>
        </li>
        <li class="details__item">
          <h6 class="details__item__label">End Date</h6>
          <p class="details__item__value">{{ cardData.end_date }}</p>
        </li>
        <li class="details__item">
          <h6 class="details__item__label">End Time</h6>
          <p class="details__item__value">{{ cardData.end_time }}</p>
        </li>
      </ul>
      <!-- col 2 -->
      <ul class="details">
        <li class="details__item">
          <h6 class="details__item__label">Fuel Level at Pick-Up</h6>
          <p class="details__item__value">
            {{ cardData.label_name }}
          </p>
        </li>
        <li class="details__item">
          <h6 class="details__item__label">Fuel Level at Return</h6>
          <p class="details__item__value">
            {{ cardData.fuel_level_at_return }}
          </p>
        </li>
        <li class="details__item">
          <h6 class="details__item__label">
            KM Included
            <p>(0 for Unlimited)</p>
          </h6>
          <p class="details__item__value">
            {{ cardData.km_included }}
          </p>
        </li>
        <li class="details__item">
          <h6 class="details__item__label">Cost per extra KM</h6>
          <p class="details__item__value">
            {{ cardData.cost_per_extra_km + " " + currency }}
          </p>
        </li>
        <li class="details__item">
          <h6 class="details__item__label">KM at Pick-Up</h6>
          <p class="details__item__value">{{ cardData.km_at_pick_up }}</p>
        </li>

        <li class="details__item">
          <h6 class="details__item__label">KM at Return</h6>
          <p class="details__item__value">{{ cardData.km_at_return }}</p>
        </li>
        <li class="details__item">
          <h6 class="details__item__label">Contract language</h6>
          <p class="details__item__value">
            {{ cardData.contact_language }}
          </p>
        </li>
        <li class="details__item">
          <h6 class="details__item__label">Note</h6>
          <p class="details__item__value">
            {{ cardData.note }}
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
      default: null,
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
