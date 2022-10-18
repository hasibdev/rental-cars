<template>
  <div v-if="driver" class="driver-card">
    <div class="driver-card__header">
      <h5 class="driver-card__name">{{ driver.driver_name }}</h5>
      <div class="driver-card__details row mx-0">
        <div class="col-lg-5 col-md-12 col-sm-12 px-0">
          <div class="row mx-0">
            <div class="col-lg-5 col-md-6 col-sm-12 px-0">
              <h6 class="details__item__label">Date of birth:</h6>
            </div>
            <div class="col-lg-7 col-md-6 col-sm-12 px-0">
              <p class="details__item__value">{{ driver.date_of_birth }}</p>
            </div>
          </div>

          <div class="row mx-0">
            <div class="col-lg-5 col-md-6 col-sm-12 px-0">
              <h6 class="details__item__label">Place of Birth:</h6>
            </div>
            <div class="col-lg-7 col-md-6 col-sm-12 px-0">
              <p class="details__item__value">{{ driver.place_of_birth }}</p>
            </div>
          </div>
          <div class="row mx-0">
            <div class="col-md-12 px-0">
              <!-- files -->
              <li class="details__item" v-for="(file, idx) in driver.driver_documents" :key="idx">
                <p class="details__item__value">
                  {{ idx + 1 }}
                  <span>{{ file.name }}</span>
                </p>
              </li>
            </div>
          </div>
        </div>
        <div class="col-lg-6 col-md-11 col-sm-12 px-0">
          <div class="row mx-0">
            <div class="col-lg-7 col-md-6 col-sm-12 px-0">
              <h6 class="details__item__label">Driving license no.:</h6>
            </div>
            <div class="col-lg-5 col-md-6 col-sm-12 px-0">
              <p class="details__item__value">{{ driver.driving_license_no }}</p>
            </div>
          </div>
          <div class="row mx-0">
            <div class="col-lg-7 col-md-6 col-sm-12 px-0">
              <h6 class="details__item__label">Place of issue:</h6>
            </div>
            <div class="col-lg-5 col-md-6 col-sm-12 px-0">
              <p class="details__item__value">{{ driver.place_of_issuance }}</p>
            </div>
          </div>
          <div class="row mx-0">
            <div class="col-lg-7 col-md-6 col-sm-12 px-0">
              <h6 class="details__item__label">Date of issue:</h6>
            </div>
            <div class="col-lg-5 col-md-6 col-sm-12 px-0">
              <p class="details__item__value">{{ driver.date_of_issue }}</p>
            </div>
          </div>
          <div class="row mx-0">
            <div class="col-lg-7 col-md-6 col-sm-12 px-0">
              <h6 class="details__item__label">Due Date:</h6>
            </div>
            <div class="col-lg-5 col-md-6 col-sm-12 px-0">
              <p class="details__item__value">{{ driver.due_date }}</p>
            </div>
          </div>
        </div>
        <div class="col-lg-1 col-md-1 col-sm-12 px-0">
          <div class="driver-card__actions">
            <button class="base-btn driver-card__actions-btn">
              <IconPen />
            </button>
            <button class="base-btn driver-card__actions-btn" @click="openDeleteModal(driver.customer_id)">
              <IconBin />
            </button>
          </div>
        </div>
        <!-- personal details -->
        <!-- <ul class="details">
          <li class="details__item">
            <h6 class="details__item__label">Date of birth:</h6>
            <p class="details__item__value">{{ driver.date_of_birth }}</p>
          </li>
          <li class="details__item">
            <h6 class="details__item__label">Place of Birth:</h6>
            <p class="details__item__value">{{ driver.place_of_birth }}</p>
          </li> -->
        <!-- files -->
        <!-- <li
            class="details__item"
            v-for="(file, idx) in driver.driver_documents"
            :key="idx"
          >
            <p class="details__item__value">
              {{ idx + 1 }}
              <span>{{ file.name }}</span>
            </p>
          </li>
        </ul> -->
        <!-- additional details -->
        <!-- <ul class="details">
          <li class="details__item">
            <h6 class="details__item__label">Driving license no.:</h6>
            <p class="details__item__value">{{ driver.driving_license_no }}</p>
          </li>
          <li class="details__item">
            <h6 class="details__item__label">Place of issuance:</h6>
            <p class="details__item__value">{{ driver.place_of_issuance }}</p>
          </li>
          <li class="details__item">
            <h6 class="details__item__label">Date of issue:</h6>
            <p class="details__item__value">{{ driver.date_of_issue }}</p>
          </li>
          <li class="details__item">
            <h6 class="details__item__label">Due date:</h6>
            <p class="details__item__value">{{ driver.due_date }}</p>
          </li>
        </ul> -->
        <!-- actions -->
        <!-- <div class="driver-card__actions">
          <button class="base-btn driver-card__actions-btn">
            <IconPen />
          </button>
          <button class="base-btn driver-card__actions-btn" @click="openDeleteModal(driver.customer_id)">
            <IconBin />
          </button>
        </div> -->
      </div>
    </div>

    <!-- Delete Modal -->
    <ConfirmDialog v-model="showDeleteModal" @onOk="onDelete" :okLoading="deleting" title="Delete Driver" message="Are you sure, you want to delete?"></ConfirmDialog>
  </div>
</template>

<script>
import { IconBin, IconPen } from "../../../../icons"
import ConfirmDialog from "@/components/common/modals/ConfirmDialog.vue"
import { api } from '@/use/useAxios'
export default {
  components: {
    IconBin,
    IconPen,
    ConfirmDialog
  },
  props: {
    driver: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      status: false,
      showDeleteModal: false,
      deleting: false,
      activeDeleteId: null
    }
  },
  methods: {
    openDeleteModal(id) {
      this.activeDeleteId = id
      this.showDeleteModal = true
    },
    async onDelete() {
      try {
        this.deleting = true
        await api.delete(`admin/driver/delete/${this.activeDeleteId}`)
        this.showDeleteModal = false
      } catch (error) {
        console.error(error)
      } finally {
        this.deleting = false
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.driver-card {
  width: 100%;
  border: 1px solid var(--color-light-grey);
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 1rem;

  &__header {
    background-color: var(--color-light-grey);
    padding: 1rem;
  }

  &__name {
    margin-bottom: 1rem;
    text-transform: capitalize;
  }

  .details {
    // flex: 1;

    &__item {
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      margin-bottom: 0.5rem;
      width: 100%;

      &__label {
        font-size: 1rem;
        font-weight: 500;
        color: var(--color-heading);
        text-transform: capitalize;
        // width: 50%;
        margin-bottom: 0;
      }

      &__value {
        margin-bottom: 0;
        font-size: 1rem;
        font-weight: 400;
        // width: 50%;
        span {
          color: var(--color-secondary);
          text-decoration: underline;
        }
      }
    }
  }

  &__actions {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    &-btn {
      &:not(:last-child) {
        margin-right: 0;
      }
    }
  }
}
</style>
