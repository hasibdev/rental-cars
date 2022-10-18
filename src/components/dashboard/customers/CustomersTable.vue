<template>
  <div class="b-data-table customer-data__table">
    <!-- Loading -->
    <Loading v-if="fetchingState" class="my-3" />

    <data-table v-else :title="$t('dashboard-customer.table-title')" :header="true">
      <template v-slot:tHeader>
        <!-- header -->
        <div class="d-table__header mb-3">
          <h3 class="d-table__header-title">{{$t('form-fields.customer')}}</h3>
          <div class="d-table__header-filter">
            <b-select required ref="location" v-model="filter" :options="filterOptions" display-property="label" value-property="id" :placeholder="$t('form-fields.all-user')" outline class="search-box__select">
            </b-select>
          </div>
        </div>
      </template>

      <template v-slot:thead>
        <tr>
          <th class="font-13">{{ $t("form-fields.user") }}</th>
          <th class="font-13">{{ $t("form-fields.phone") }}</th>
          <th class="font-13">{{ $t("form-fields.location") }}</th>
          <th class="font-13">{{ $t("form-fields.created-on") }}</th>
          <th class="font-13">{{ $t("form-fields.status") }}</th>
          <th></th>
        </tr>
      </template>
      <template v-slot:tbody>
        <tr v-for="customer in customers" :key="customer" @click="viewCustomer(customer)">
          <td>
            <div class="d-table-user">
              <div class="d-table-user__avatar">
                <!-- <img v-if="customer.photo" :src="imageBaseUrl(`/profile/${customer.photo}`)" alt="user" /> -->
                <div class="w-100 h-100 d-flex justify-content-center align-items-center bg-primary text-white">
                  <h6 class="mb-0">{{ customer.first_name[0] }}{{ customer.last_name[0] }}</h6>
                </div>
              </div>
              <div class="d-table-user__info">
                <div class="font-14">
                  <span v-if="customer.name_title == 'Mrs.' || customer.name_title == 'Frau' ">{{$t('home-booking-request-form.mrs')}}</span>
                  <span v-if="customer.name_title == 'Mr.' || customer.name_title == 'Herr' ">{{$t('home-booking-request-form.mr')}}</span>
                  {{ customer.full_name }}
                </div>
                <p class="font-12">{{ customer.email }}</p>
              </div>
            </div>
          </td>
          <td>
            <span class="font-14">{{ customer.phone }}</span>
          </td>
          <td>
            <span class="font-14">{{ customer.address }}</span>
          </td>
          <td>
            <span class="font-14">{{ formatDate(customer.created_at) }}</span>
          </td>
          <td class="status">
            <button v-if="customer.status === 1" @click="selectToBlockUser(customer.id, customer.full_name)" class="base-btn d-table__status-btn active">
              <span class="font-12"> {{ $t("form-fields.active") }}</span>
            </button>
            <button v-else @click="changeStatus(customer.id, 1)" class="base-btn d-table__status-btn inactive">
              <span class="me-2 block-icon">
                <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_3471_1040)">
                    <path d="M7.50002 12.8334C10.7217 12.8334 13.3334 10.2217 13.3334 7.00008C13.3334 3.77842 10.7217 1.16675 7.50002 1.16675C4.27836 1.16675 1.66669 3.77842 1.66669 7.00008C1.66669 10.2217 4.27836 12.8334 7.50002 12.8334Z" stroke="#F25037" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M7.5 9.33333V7" stroke="#F25037" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M7.5 4.66675H7.50708" stroke="#F25037" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </g>
                  <defs>
                    <clipPath id="clip0_3471_1040">
                      <rect width="14" height="14" fill="white" transform="translate(0.5)" />
                    </clipPath>
                  </defs>
                </svg>
              </span>
              <span class="font-12">{{$t("form-fields.blocked") }}</span>
            </button>
            <div class="block-reason text-12 fw-500 text-white py-1 px-2">
              {{ customer.message || 'No Message!' }}
            </div>
          </td>
          <td>
            <ActionDropdown>
              <li>
                <app-link :path="`/kunden/bearbeiten/${customer.id}`" class="dropdown-item py-2 pointer">
                  <IconPen />
                  <span class="ms-3 text-14">{{ $t("form-fields.edit") }}</span>
                </app-link>
              </li>
              <li @click="openDeleteModal(customer.id)" class="dropdown-item py-2 pointer">
                <IconBin />
                <span class="ms-3 text-14">{{ $t("form-fields.remove") }}</span>
              </li>
            </ActionDropdown>

          </td>
        </tr>
      </template>
      <!-- <p v-if="!fetchingState && !customers?.length" class="mt-2">No data found!</p> -->
      <template v-if="!fetchingState && !customers?.length" v-slot:no-content>
        <div class="mt-4 d-flex flex-column align-items-center justify-content-center w-100 h-100">
          <div class="icon mb-4">
            <svg width="132" height="128" viewBox="0 0 132 128" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_4322_1348)">
                <path d="M116.535 14.9965C95.915 -4.99851 62.3639 -4.99851 41.7441 14.9965C21.7356 34.3989 21.1425 65.6077 39.9648 85.7103L32.8352 92.6238L28.989 88.8941C28.5055 88.4253 27.8495 88.1617 27.1656 88.1617C26.4818 88.1617 25.8258 88.4253 25.3423 88.8941L3.10387 110.459C1.10236 112.4 0 114.98 0 117.725C0 120.47 1.10236 123.05 3.10361 124.991C5.10513 126.931 7.76625 128 10.5965 128C13.4271 128 16.0879 126.931 18.0895 124.991L40.3282 103.426C40.8116 102.957 41.0834 102.321 41.0834 101.658C41.0834 100.995 40.8116 100.359 40.3282 99.8899L36.4819 96.1602L43.6115 89.2467C53.6601 98.0938 66.3999 102.517 79.1396 102.517C92.6824 102.517 106.225 97.5187 116.535 87.5211C137.155 67.5258 137.155 34.9915 116.535 14.9965ZM14.4428 121.454C13.4155 122.45 12.0496 122.999 10.5965 122.999C9.14375 122.999 7.7776 122.451 6.75028 121.454C5.72296 120.458 5.15722 119.134 5.15722 117.725C5.15722 116.316 5.72296 114.991 6.75054 113.995L27.1656 94.1983L34.8582 101.658L14.4428 121.454ZM112.888 83.9847C94.2794 102.03 64 102.03 45.391 83.9849C26.7817 65.9395 26.7817 36.5778 45.3907 18.5327C54.6954 9.50996 66.9177 4.99862 79.1396 4.99862C91.3616 4.99862 103.584 9.50996 112.888 18.5327C131.497 36.5778 131.497 65.9395 112.888 83.9847Z" fill="black" />
                <path d="M120.609 50.7703C120.39 49.7248 119.496 48.9137 118.403 48.7784C117.33 48.6456 116.245 49.2082 115.771 50.1526C115.305 51.0806 115.473 52.2138 116.203 52.9689C116.94 53.7311 118.118 53.9659 119.106 53.552C120.205 53.0919 120.848 51.9095 120.609 50.7703Z" fill="black" />
                <path d="M117.047 60.2998C115.688 59.8842 114.24 60.6151 113.812 61.9321C112.046 67.3589 109.036 72.161 104.866 76.2053C97.9941 82.8685 88.8579 86.5385 79.1396 86.5385C69.4216 86.5385 60.2851 82.8688 53.4134 76.2053C39.2282 62.4497 39.2282 40.068 53.4134 26.3124C60.2851 19.6489 69.4216 15.9792 79.1396 15.9792C88.8579 15.9792 97.9941 19.6489 104.866 26.3124C108.989 30.3112 112.088 35.2626 113.827 40.6311C114.253 41.9489 115.701 42.6812 117.059 42.2674C118.418 41.8538 119.174 40.4501 118.747 39.1326C116.76 32.9984 113.221 27.3424 108.512 22.776C100.667 15.1678 90.2351 10.9781 79.1396 10.9781C68.0441 10.9781 57.6126 15.1678 49.7667 22.776C33.5704 38.4815 33.5704 64.036 49.7667 79.7415C57.6126 87.3494 68.0439 91.5394 79.1396 91.5394C90.2354 91.5394 100.667 87.3496 108.512 79.7415C113.208 75.1886 116.741 69.5505 118.73 63.4369C119.158 62.1196 118.405 60.7151 117.047 60.2998Z" fill="black" />
                <path d="M63.3147 66.6042C66.6483 69.8368 72.0726 69.8368 75.4063 66.6042L79.1398 62.9838L82.8731 66.6042C84.54 68.2205 86.7295 69.0287 88.919 69.0287C91.1084 69.0287 93.2979 68.2205 94.9648 66.6042C98.2984 63.3716 98.2984 58.1116 94.9648 54.879L91.2312 51.2586L94.9648 47.6382C98.2984 44.4056 98.2984 39.1458 94.9648 35.913C91.6311 32.6804 86.2068 32.6804 82.8731 35.913L79.1396 39.5337L75.406 35.913C72.0721 32.6804 66.6483 32.6804 63.3144 35.913C59.9808 39.1456 59.9808 44.4056 63.3147 47.6382L67.0482 51.2586L63.3144 54.879C59.981 58.1114 59.9808 63.3714 63.3147 66.6042ZM66.9613 58.4152L72.5182 53.0267C73.0017 52.5578 73.2735 51.9217 73.2735 51.2586C73.2735 50.5955 73.0017 49.9594 72.5182 49.4905L66.9613 44.102C65.6385 42.8193 65.6385 40.7321 66.9613 39.4494C68.2839 38.1669 70.4368 38.1666 71.7593 39.4494L77.3162 44.8379C77.8 45.307 78.4557 45.5703 79.1396 45.5703C79.8234 45.5703 80.4794 45.3067 80.9629 44.8379L86.5198 39.4494C87.8426 38.1666 89.9953 38.1666 91.3178 39.4494C92.6407 40.7321 92.6407 42.8193 91.3178 44.102L85.7609 49.4905C85.2774 49.9594 85.0057 50.5955 85.0057 51.2586C85.0057 51.9217 85.2774 52.5578 85.7609 53.0267L91.3178 58.4152C92.6407 59.6979 92.6407 61.7851 91.3178 63.0678C89.9955 64.3506 87.8429 64.3508 86.5198 63.0678L80.9629 57.6793C80.4794 57.2102 79.8234 56.9469 79.1396 56.9469C78.4557 56.9469 77.7997 57.2105 77.3162 57.6793L71.7593 63.0678C70.4368 64.3506 68.2841 64.3506 66.9613 63.0678C65.6385 61.7851 65.6382 59.6979 66.9613 58.4152Z" fill="black" />
              </g>
              <defs>
                <clipPath id="clip0_4322_1348">
                  <rect width="132" height="128" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <div class="fw-400 pb-3" style="font-size: 25px; color: #020918;">{{
          $t('text.there-is-no-data-in-the-table')}}</div>
          <div class="text-25 fw-400 pointer" style="font-size: 25px; color: #276EF1;">
            <app-link path="/customer/create">{{ $t('button.click-here-to-create-a-new-record')}}</app-link>
          </div>
        </div>
      </template>
      <template v-slot:tfooter>
        <BPagination v-model="currentPage" :total-pages="totolPages" @change="changePagination" />
      </template>

    </data-table>

  </div>
  <!-- block user model -->
  <ModalControl v-model="selectToBlock.model">
    <div class="modal-header">
      <div class="h6 modal-title">{{ $t('text.block-warning')}}</div>
    </div>

    <div class="modal-body">
      <div class="block-model">
        <p class="block-model__dec">
          {{ $t('text.are-you-sure-you-want-to-block') }} <strong>{{ selectToBlock.name }}</strong> ?
        </p>
        <BTextarea v-model="selectToBlock.message" :height="150" :placeholder="$t('text.add-a-note-here')" />
        <div class="block-model__action">
          <button @click="closeBlockModel" class="block-model__action-btn base-btn base-btn--light">
            {{$t('button.cancel')}}
          </button>
          <button @click="blockUser(selectToBlock.id)" :disabled="blockLoading" class="block-model__action-btn base-btn base-btn--error">
            {{ blockLoading ? $t('form-fields.block') : $t('form-fields.block') }}
          </button>
        </div>
      </div>
    </div>
  </ModalControl>

  <!-- Delete Modal -->
  <ConfirmDialog v-model="showDeleteModal" @onOk="onDelete" :okLoading="deleting" :title="$t('dashboard-customer.remove-user')" :message="$t('dashboard-customer.delete-customer-message')">
  </ConfirmDialog>
</template>

<script>
import IconBin from "@/icons/IconBin.vue"
// import IconEye from "@/icons/IconEye.vue"
import IconPen from "@/icons/IconPen.vue"
// import IconVerticalDots from "@/icons/IconVerticalDots.vue"
import { format } from "date-fns"
import BPagination from "../../base/BPagination.vue"
import BTextarea from "../../base/BTextarea.vue"
import DataTable from "@/components/base/DataTable.vue"
import ActionDropdown from '@/components/common/ActionDropdown.vue'
import ConfirmDialog from '@/components/common/modals/ConfirmDialog.vue'
import ModalControl from '@/components/common/modals/ModalControl.vue'
import { api } from '@/use/useAxios'
import BSelect from "../../base/BSelect.vue"
import _ from 'lodash'

export default {
  emits: ['c-view'],
  props: {
    statusChanged: {
      type: Number,
    },
    cInfo: {
      type: [Object, null],
      default: () => null,
    },
    searchText: {
      type: String,
      default: ''
    },
  },
  components: {
    DataTable,
    BPagination,
    IconBin,
    // IconEye,
    IconPen,
    // IconVerticalDots,
    BTextarea,
    ActionDropdown,
    ConfirmDialog,
    ModalControl,
    BSelect
  },
  data() {
    return {
      format,
      customers: null,
      currentPage: 1,
      totolPages: 10,
      fetchingState: false,
      blockLoading: false,
      selectToBlock: {
        model: false,
        id: null,
        name: null,
        message: "",
      },

      showDeleteModal: false,
      deleting: false,
      activeDeleteId: null,
      filter: '',
      filterOptions: [
        { label: this.$t('form-fields.all'), id: '' },
        { label: this.$t('form-fields.active'), id: 'Active' },
        { label: this.$t('form-fields.blocked'), id: 'Inactive' },
      ]
    }
  },
  mounted() {
    this.getCustomers(1)
  },
  methods: {
    async onDelete() {
      try {
        this.deleting = true
        await api.delete(`admin/customer/delete/${this.activeDeleteId}`)

        this.customers = this.customers.filter(c => c.id !== this.activeDeleteId)

        this.showDeleteModal = false
      } catch (error) {
        console.error(error)
      } finally {
        this.deleting = false
      }
    },
    openDeleteModal(id) {
      this.activeDeleteId = id
      this.showDeleteModal = true
    },
    async getCustomers(pageNo, cInfo) {
      try {
        this.fetchingState = true
        const res = await api.get(`/admin/customer?page=${pageNo}&name=${this.searchText}&status=${this.filter}`)
        // const { data, current_page, last_page } = res.customers
        this.customers = res.data.data
        this.totolPages = res.data.last_page
        this.currentPage = res.data.current_page
        this.viewCustomer(cInfo ? this.customers.find(c => c.id == cInfo.id) : this.customers[0])
      } catch (err) {
        console.error(err)
      } finally {
        this.fetchingState = false
      }
    },
    async changeStatus(customerId, status) {
      try {
        await api.post(`/admin/customer/status/${customerId}`, {
          status: status,
        })
        this.getCustomers(this.currentPage, this.cInfo)
      } catch (err) {
        console.error(err)
      }
    },
    viewCustomer(customer) {
      this.$emit("c-view", customer)
    },
    formatDate(dateUTC) {
      if (this.$i18n.locale === "en") {
        return format(new Date(dateUTC), "dd/LL/yyyy")
      }
      else {
        return format(new Date(dateUTC), "dd.LL.yyyy")
      }
    },
    changePagination(pageNo) {
      this.getCustomers(pageNo)
    },
    showActionList(e) {
      e.target.nextSibling.classList.toggle("active")
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
        this.getCustomers(this.currentPage, this.cInfo)
        this.closeBlockModel()
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
  },
  watch: {
    statusChanged() {
      this.getCustomers(this.currentPage, this.cInfo)
    },
    searchText: _.debounce(function () {
      this.getCustomers(this.currentPage)
    }, 500),
    filter() {
      this.currentPage = 1
      this.getCustomers(this.currentPage)
    }
  },
}
</script>

<style lang="scss" scoped>
.customer-data__table {
  overflow-x: scroll;
  // overflow-y: scroll;
}
.block-model {
  &__action {
    text-align: left;
    display: flex;
    justify-content: flex-end;

    &-btn {
      padding: 8px 25px;
    }
  }
}

.status {
  position: relative;

  .block-reason {
    background: rgba(0, 0, 0, 0.5);
    border-radius: 4px;
    width: 116px;
    bottom: 68px;
    left: 0;
    display: none;
    position: absolute;
    bottom: 60px;
    left: 0;
    right: 0;
    margin: 10px 10px;
  }

  .inactive:hover + .block-reason {
    display: block;
    z-index: 999;
  }
}

.font-14 {
  font-size: 14px;
}

.font-13 {
  font-size: 13px;
}

.font-12 {
  font-size: 12px;
}
</style>
