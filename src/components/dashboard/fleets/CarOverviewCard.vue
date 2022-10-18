<template>
  <div class="car-overview">
    <div class="row">
      <div class="col-md-4">
        <div class="car-overview__img">
          <img
            src="http://localhost:8080/img/small-2.3b7c5551.png"
            alt=""
            srcset=""
          />
        </div>
      </div>
      <div class="col-md-6">
        <div class="car-overview__info">
          <h3 class="car-overview__info-title">MITSUBISHI GRANDS</h3>
          <ul class="car-overview__info-list">
            <li class="car-overview__info-list-item">
              <span class="label">Class</span>
              <h5 class="value">Middle class</h5>
            </li>
            <li class="car-overview__info-list-item">
              <span class="label">Plate number</span>
              <h5 class="value">HHUD8411</h5>
            </li>
            <li class="car-overview__info-list-item">
              <span class="label">ID</span>
              <h5 class="value">854035</h5>
            </li>
            <li class="car-overview__info-list-item">
              <span class="label">Base Location</span>
              <h5 class="value">Berlin, Germany</h5>
            </li>
          </ul>
        </div>
      </div>
      <div class="col-md-2">
        <div class="car-overview__right">
          <div class="car-overview__right-item">
            <span class="label">Gear</span>
            <h5 class="value">Automatic</h5>
          </div>
          <div class="car-overview__right-actions">
            <button class="base-btn car-overview__right-actions-btn">
              Edit
            </button>
            <BButtonSwitcher
              @change="chageValue"
              :on-change-value="{ name: 'rs' }"
              v-model="status"
              active-color="#1BCE6C"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BButtonSwitcher from "@/components/base/BButtonSwitcher.vue";
export default {
    components: {
        BButtonSwitcher,
    },
    data() {
      return {
        status: true
      }
    },
};
</script>

<style lang="scss" scoped>
.car-overview {
  padding: 1rem;
  border: 1px solid var(--color-light-grey-2);
  border-radius: 5px;
  margin-bottom: 1.5rem;

  &__img {
    width: 100%;
    border-radius: 5px;
    overflow: hidden;
    aspect-ratio: 16/10;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__info {
    &-title {
      font-size: 1.2rem;
      font-weight: 500;
      color: var(--color-heading);
      text-transform: uppercase;
      margin-bottom: 1.2rem;
    }

    &-list {
      &-item {
        display: flex;
        align-items: center;
        justify-content: flex-start;

        &:not(:last-child) {
          margin-bottom: 0.875rem;
        }

        .label {
          color: var(--color-text);
          width: 25%;
        }

        .value {
          font-size: 1rem;
          font-weight: 500;
          text-transform: caplitalize;
          color: var(--color-heading);
          flex: 1 1 auto;
          margin-bottom: 0;
        }
      }
    }
  }

  &__right {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;

    &-item {
      .label,
      .value {
        font-size: 1rem;
        color: var(--color-text);
        text-transform: caplitalize;
        margin-bottom: 0.25rem;
        display: block;
      }

      .value {
        font-weight: 500;
        color: var(--color-heading);
        margin-bottom: 0;
      }
    }

    &-actions {
      display: flex;
      flex-direction: column;

      &-btn {
        display: block;
        border: 1px solid var(--color-secondary);
        width: 100%;
        color: var(--color-secondary);

        &:not(:last-child) {
          margin-bottom: 1rem;
        }
      }
    }
  }
}
</style>
