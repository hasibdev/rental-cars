<template>
  <div v-if="cInfo" class="c-preview">
    <div class="c-preview__header">
      <div class="c-preview__header-img d-flex justify-content-center align-items-center">
        <!-- <img :src="imageBaseUrl(`/profile/${cInfo.photo}`)" alt="user" /> -->
        <h2 class="mb-0">{{ cInfo?.first_name[0] }}{{ cInfo?.last_name[0] }}</h2>
      </div>
      <div class="c-preview__header-info">
        <h5 class="name">{{ `${cInfo?.name_title} ${cInfo?.full_name}` }}</h5>
        <p class="title" v-if="cInfo?.customer_type == 'Private'">{{ $t('dashboard-customer.private') }}</p>
        <p class="title" v-else>{{ $t('dashboard-customer.commercial') }}</p>
      </div>

      <ul class="c-preview__info-nav">
        <li @click="changeTab(true)" class="c-preview__info-nav__tab" :class="{ active: isPersonalInfo }">
          {{ $t("dashboard-customer.profile-info") }}
        </li>
        <li @click="changeTab(false)" class="c-preview__info-nav__tab" :class="{ active: !isPersonalInfo }">
          {{ $t("dashboard-customer.rentals-history") }}
        </li>
      </ul>
    </div>
    <!-- customer info -->
    <div class="c-preview__info">
      <!-- personal info -->
      <div class="c-preview__info-body">
        <div v-if="isPersonalInfo" class="personal__info">
          <ul class="c-preview__info-body__list">
            <li class="c-preview__info-item">
              <span class="icon">
                <IconGiftbox />
              </span>
              <span class="text">{{ formatDate(cInfo?.date_of_birth) }}</span>
            </li>
            <li class="c-preview__info-item">
              <span class="icon">
                <IconLocation />
              </span>
              <span class="text">{{ cInfo?.address }}</span>
            </li>
            <li class="c-preview__info-item">
              <span class="icon">
                <IconPhone />
              </span>
              <span class="text">{{ cInfo?.phone }}</span>
            </li>
            <li class="c-preview__info-item">
              <span class="icon">
                <IconEnvelope />
              </span>
              <span class="text">{{ cInfo?.email }}</span>
            </li>
            <li class="c-preview__info-item">
              <span class="icon">
                <IconSidebar />
              </span>
              <span class="text">{{ cInfo?.customer_id }}</span>
            </li>
            <li v-if="cInfo?.drivers_license_no && cInfo?.drivers_license_no != 'null'" class="c-preview__info-item">
              <span class="icon">
                <IconCar />
              </span>
              <span class="text">{{ cInfo?.drivers_license_no }}</span>
            </li>
          </ul>
          <button v-if="cInfo?.status === 1" @click="selectToBlockUser(cInfo.id, cInfo.full_name)"
            class="base-btn c-preview__info-block-btn active">
            {{ $t("form-fields.active") }}
          </button>
          <button @click="changeStatus(cInfo?.id, 1)" v-else class="base-btn c-preview__info-block-btn">
            {{ $t("form-fields.unblock") }}
          </button>
          <app-link class="base-btn c-preview__info-edit-btn" :path="`/kunden/bearbeiten/${cInfo.id}`">
            {{ $t("dashboard-customer.edit-profile") }}
          </app-link>
        </div>
        <!-- rental history -->
        <div v-else class="c-preview__history">
          <template v-for="(history, i) in rentalsHistory" :key="i">
            <RentalHistoryCard :history="history" />
          </template>

          <!-- No Data -->
          <p v-if="!rentalLoading && !rentalsHistory.length">{{$t('FleetView.no-history')}}</p>

          <!-- Loading -->
          <Loading v-if="loading" class="my-3" />
        </div>
      </div>
    </div>
  </div>

  <!-- block user model -->
  <ModalControl v-model="selectToBlock.model">
    <div class="modal-header">
      <div class="h6 modal-title">{{$t('text.block-warning')}}</div>
    </div>

    <div class="modal-body">
      <div class="block-model">
        <p class="block-model__dec">
          {{ $t('text.are-you-sure-you-want-to-block')}} <strong>{{ selectToBlock.name }}</strong> ?
        </p>
        <BTextarea v-model="selectToBlock.message" :height="150" :placeholder="$t('text.add-a-note-here')" />
        <div class="block-model__action float-end">
          <button @click="closeBlockModel" class="block-model__action-btn base-btn base-btn--light">
            {{$t('button.cancel')}}
          </button>
          <button @click="blockUser(selectToBlock.id)" :disabled="blockLoading"
            class="block-model__action-btn base-btn base-btn--error">
            {{ blockLoading ? $t('form-fields.block') : $t('form-fields.block') }}
          </button>
        </div>
      </div>
    </div>
  </ModalControl>
</template>

<script>
import IconCar from "@/icons/IconCar.vue"
import IconEnvelope from "@/icons/IconEnvelope.vue"
import IconGiftbox from "@/icons/IconGiftbox.vue"
import IconLocation from "@/icons/IconLocation.vue"
import IconPhone from "@/icons/IconPhone.vue"
import BTextarea from "../../base/BTextarea.vue"
import IconSidebar from "@/icons/IconSidebar.vue"
import { format } from "date-fns"
import RentalHistoryCard from "../RentalHistoryCard.vue"
import ModalControl from '@/components/common/modals/ModalControl.vue'
import { api } from '@/use/useAxios'

export default {
  emits: ['onStatusChanged'],
  components: {
    IconGiftbox,
    IconLocation,
    IconPhone,
    IconEnvelope,
    IconSidebar,
    IconCar,
    RentalHistoryCard,
    BTextarea,
    ModalControl
  },
  props: {
    cInfo: {
      type: Object,
      // default: () => ({}),
    },
  },
  data() {
    return {
      isPersonalInfo: true,
      medel: true,
      selectToBlock: {
        model: false,
        id: null,
        name: null,
        message: "",
      },
      rentalsHistory: [],
      rentalLoading: false,
      blockLoading: false
    }
  },
  methods: {
    async changeStatus(customerId, status) {
      try {
        await api.post(`/admin/customer/status/${customerId}`, {
          status: status,
        })

        this.$emit('onStatusChanged')
      } catch (err) {
        console.error(err)
      }
    },
    selectToBlockUser(id, name) {
      if (id && name) {
        this.selectToBlock.model = true
        this.selectToBlock.id = id
        this.selectToBlock.name = name
      }
    },
    async blockUser(id) {
      try {
        this.blockLoading = true
        await api.post(`/admin/customer/status/${id}`, {
          message: this.selectToBlock.message,
          status: 2
        })
        this.closeBlockModel()
        this.$emit('onStatusChanged')
      } catch (err) {
        console.error(err)
      } finally {
        this.blockLoading = false
      }
    },
    closeBlockModel() {
      this.selectToBlock.model = false
      this.selectToBlock.id = null
      this.selectToBlock.name = null
      this.selectToBlock.message = ""
    },
    async changeTab(val) {
      this.isPersonalInfo = val

      if (!val) {
        try {
          this.rentalLoading = true
          const res = await api.get(`admin/customer/reservation/${this.cInfo.id}`)
          this.rentalsHistory = res.data
        } catch (error) {
          console.error(error)
        } finally {
          this.rentalLoading = false
        }
      }
    },
    formatDate(dateUTC) {
      if (this.$i18n.locale === "en") {
        return format(new Date(dateUTC), "dd/LL/yyyy")
      }
      else {
        return format(new Date(dateUTC), "dd.LL.yyyy")
      }
    },
  },
}
</script>

<style>
.c-preview__info-item svg path {
  stroke: var(--color-grey);
}
</style>

<style lang="scss" scoped>
.c-preview {
  padding: 0;
  border-radius: 5px;
  border: 1px solid var(--color-light-grey);
  height: calc(100vh - 150px);
  overflow: hidden;
  display: flex;
  flex-direction: column;

  &__header {
    text-align: center;

    &-img {
      --size: 120px;
      width: var(--size);
      height: var(--size);
      margin: 1.5rem auto 1.75rem auto;
      overflow: hidden;
      border-radius: 50%;
      box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.16);

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    &-info {
      .name {
        font-weight: 500;
        font-size: 20px;
        text-transform: capitalize;
        margin-bottom: 0.25rem;
        color: var(--color-heading);
      }

      .title {
        font-size: 14px;
        font-weight: 400;
        text-transform: capitalize;
        color: var(--color-text);
      }
    }
  }

  &__info {
    overflow-y: auto;
    overflow-x: hidden;
    flex: 1 1 auto;
    scrollbar-width: thin;

    &::-webkit-scrollbar {
      width: 0.25rem;
    }

    &::-webkit-scrollbar-track {
      background-color: #fff;
      -webkit-border-radius: 0.625rem;
      border-radius: 0.625rem;
    }

    &::-webkit-scrollbar-thumb {
      -webkit-border-radius: 0.625rem;
      border-radius: 0.625rem;
      background: #dadce0;
    }

    &-nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
      background-color: var(--color-white);

      &__tab {
        padding: 10px;
        text-align: center;
        width: 50%;
        color: var(--color-grey);
        text-transform: capitalize;
        font-size: 14px;
        border-bottom: 3px solid transparent;
        cursor: pointer;
        transition: border-color 0.2s ease-in-out;

        &.active,
        &:hover {
          border-color: var(--color-dark);
          color: var(--color-dark);
          font-weight: 500;
        }
      }
    }

    &-body {
      padding: 0 1.2rem;

      &__list {
        margin-bottom: 0.25rem;
      }
    }

    &-item {
      padding: 16px 0;
      font-size: 14px;
      display: flex;

      &:not(:last-child) {
        border-bottom: 1px solid var(--color-light-grey);
      }

      .icon {
        margin-right: 1rem;
        width: 24px;
        height: 24px;

        svg {
          width: 24px;
          height: 24px;
        }
      }
    }

    &-block-btn {
      width: 100%;
      color: var(--color-error);
      padding: 10px;
      margin-bottom: 0.5rem;
      font-size: 16px;

      &.active {
        color: var(--color-success);
        font-size: 16px;
      }
    }

    &-edit-btn {
      border: 1px solid var(--color-dark);
      width: 100%;
      display: block;
      text-align: center;
      color: var(--color-dark);
      margin-bottom: 1.5rem;
      font-size: 18px;

      &:hover {
        background-color: var(--color-dark);
        color: var(--color-white);
      }
    }
  }
}
</style>
