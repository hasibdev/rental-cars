<template>
  <div class="vehicle__data-table b-data-table">
    <!-- Loading -->
    <Loading v-if="loading" class="my-3" />

    <data-table v-else :header="false">
      <template v-slot:thead>
        <tr>
          <th>{{ $t("form-fields.id") }}</th>
          <th>{{ $t("form-fields.fleet") }}</th>
          <th>{{ $t("form-fields.base-location") }}</th>
          <th>{{ $t("form-fields.current-location") }}</th>
          <th>{{ $t("form-fields.odometer") }}</th>
          <th>{{ $t("form-fields.checks") }}</th>
          <th>{{ $t("form-fields.damages") }}</th>
          <th>{{ $t("form-fields.fuel") }}</th>
          <th>{{ $t("form-fields.status") }}</th>
          <th></th>
        </tr>
      </template>
      <template v-slot:tbody>
        <tr v-for="(fleet, idx) in fleets" :key="fleet.id">
          <td>
            <span>{{ fleet.id }}</span>
          </td>
          <td>
            <div class="d-table-user">
              <div class="d-table-user__avatar d-table-user__avatar--car">
                <img :src="imageBaseUrl(`/documents/${fleet.art}`)" alt="fleet" />
              </div>
              <div class="d-table-user__info">
                <h5>{{ fleet.manufactures_name }}</h5>
                <p>{{ fleet.classname }}</p>
              </div>
            </div>
          </td>
          <td>
            <span>{{ fleet.location_name }}</span>
          </td>
          <td><span>South Dakota 83475</span></td>
          <td>
            <span>{{ fleet.odometer }}</span>
          </td>
          <td>
            <span>{{ getChecks(fleet.check) }}</span>
          </td>
          <td><span>0</span></td>
          <td>
            <span>{{ fleet.fuel_lable }}%</span>
          </td>
          <td>
            <div>
              <BButtonSwitcher :uniqueId="'status' + idx" @change="chageStatus" :on-change-value="{ id: fleet.status }"
                v-model="fleet.status" active-color="#1BCE6C" width="120px" />
            </div>
          </td>
          <td>
            <ActionDropdown>
              <li class="dropdown-item py-2 pointer">
                <!-- <IconEye />
                <span class="ms-3 text-14">{{ $t("form-fields.view") }}</span> -->
                <app-link :path="`/flotte/ansicht/${fleet.id}`">
                  <IconEye />
                  <span class="ms-3 text-14">{{ $t("form-fields.view") }}</span>
                </app-link>
              </li>
              <li @click="$router.push(`/flotte/aktualisieren/${fleet.id}`)" class="dropdown-item py-2 pointer">
                <IconPen />
                <span class="ms-3 text-14">{{ $t("form-fields.edit") }}</span>
              </li>
              <li @click="openDeleteModal(fleet.id)" class="dropdown-item py-2 pointer">
                <IconBin />
                <span class="ms-3 text-14">{{ $t("form-fields.remove") }}</span>
              </li>
            </ActionDropdown>
          </td>
        </tr>
        <p v-if="!fetchingState && !fleets?.length" class="mt-2">No data found!</p>
      </template>
      <template v-slot:tfooter>
        <BPagination :total-pages="totolPages" @change="changePagination" v-model="currentPage" />
      </template>
    </data-table>
  </div>
  <!-- block user model -->
  <b-model v-model="selectToBlock.model" :title="$t('confirm-modal.title')">
    <div class="block-model">
      <p class="block-model__dec">
        {{ $t("confirm-modal.description") }}
        <strong>{{ selectToBlock.name }}</strong> ?
      </p>
      <BTextarea v-model="selectToBlock.message" :height="150" placeholder="Add a note here..." />
      <div class="block-model__action">
        <button @click="closeBlockModel" class="block-model__action-btn base-btn base-btn--light">
          {{ $t("form-fields.cancel") }}
        </button>
        <button @click="blockUser(2)" class="block-model__action-btn base-btn base-btn--error">
          {{ $t("form-fields.block") }}
        </button>
      </div>
    </div>
  </b-model>
  <!-- Delete Modal -->
  <ConfirmDialog v-model="showDeleteModal" @onOk="onDelete" :okLoading="deleting" title="Delete Fleet"
    message="Are you sure, you want to delete?"></ConfirmDialog>
</template>

<script>
import IconBin from "@/icons/IconBin.vue"
import IconEye from "@/icons/IconEye.vue"
import IconPen from "@/icons/IconPen.vue"
// import IconVerticalDots from "@/icons/IconVerticalDots.vue"
import http from "@/helpers/http"
import BButtonSwitcher from "../../base/BButtonSwitcher.vue"
import BModel from "../../base/BModel.vue"
import BPagination from "../../base/BPagination.vue"
import BTextarea from "../../base/BTextarea.vue"
import DataTable from "@/components/common/DataTable.vue"
import ActionDropdown from '@/components/common/ActionDropdown.vue'
import ConfirmDialog from '@/components/common/modals/ConfirmDialog.vue'
import { api } from '@/use/useAxios'
export default {
  components: {
    DataTable,
    BPagination,
    IconBin,
    IconEye,
    IconPen,
    // IconVerticalDots,
    BModel,
    BTextarea,
    BButtonSwitcher,
    ActionDropdown,
    ConfirmDialog
  },
  data() {
    return {
      status: false,
      currentPage: 1,
      totolPages: 10,
      fleets: [],
      fetchingState: false,
      selectToBlock: {
        model: false,
        id: null,
        name: null,
        message: "",
      },

      showDeleteModal: false,
      deleting: false,
      activeDeleteId: null
    }
  },
  mounted() {
    this.getFleets(1)
  },
  methods: {
    async onDelete() {
      try {
        this.deleting = true
        await api.delete(`admin/vehicle/delete/${this.activeDeleteId}`)

        this.fleets = this.fleets.filter(c => c.id !== this.activeDeleteId)

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
    getChecks(data) {
      if (data)
        return JSON.parse(data).length
      else
        return 0
    },
    changePagination(pageNo) {
      this.getFleets(pageNo)
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
    //  @todo: it will do
    chageStatus() {

    },

    async getFleets(pageNo) {
      try {
        this.fetchingState = true
        const data = await http.get(`/admin/vehicle?page=${pageNo}`)
        this.fleets = data.data
        this.totolPages = data.last_page
      } catch (err) {
        console.error(err)
      } finally {
        this.fetchingState = false
      }
    },
    blockUser() {
      if (this.blockMessage) {
        try {
          http.post("/user/block", this.selectToBlock.message)
        } catch (err) {
          console.error(err)
        }
      }
    },
    closeBlockModel() {
      this.selectToBlock.model = false
      this.selectToBlock.id = null
      this.selectToBlock.name = null
      this.selectToBlock.message = ""
    },
  },
}
</script>

<style>
.vehicle__data-table.b-data-table .d-table__container {
  height: calc(100vh - 150px);
}
</style>

<style lang="scss" scoped>
.d-table-user__avatar--car {
  height: 45px;
  width: 60px;
  border-radius: 5px;
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
</style>
