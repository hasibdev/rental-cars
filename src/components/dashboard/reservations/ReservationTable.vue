<template>
  <div class="vehicle__data-table b-data-table">
    <data-table :header="false">
      <template v-slot:thead>
        <tr>
          <th>#{{ $t("form-fields.id&customer") }}</th>
          <th>{{ $t("form-fields.price") }}</th>
          <th>{{ $t("form-fields.vehicle") }}</th>
          <th>{{ $t("form-fields.pickup") }}</th>
          <th>{{ $t("form-fields.return") }}</th>
          <th>{{ $t("form-fields.created") }}</th>
          <th>{{ $t("form-fields.status") }} isThis</th>
          <th></th>
        </tr>
      </template>
      <template v-slot:tbody>
        <tr v-for="(customer, idx) in 10" :key="customer">
          <td>
            <div class="d-table-user">
              <div class="d-table-user__avatar">
                <img src="https://cdn.vuetifyjs.com/images/lists/2.jpg" alt="user" />
              </div>
              <div class="d-table-user__info">
                <h5>Mr Savannah Nguyen</h5>
                <p>#854035</p>
              </div>
            </div>
          </td>
          <td>
            <p>Total $320</p>
            <p>Due $120</p>
          </td>
          <td>
            <div class="d-table-user">
              <div class="d-table-user__avatar d-table-user__avatar--car">
                <img :src="imageBaseUrl('/img/small-2.3b7c5551.png')" alt="user" />
              </div>
              <div class="d-table-user__info">
                <h5>BMW GH2890</h5>
                <p>Middle class</p>
              </div>
            </div>
          </td>
          <td>
            <p><strong>10:30am</strong> , 03 Mar, 2022</p>
            <p>South Dakota 83475</p>
          </td>
          <td>
            <p><strong>10:30am</strong> , 03 Mar, 2022</p>
            <p>South Dakota 83475</p>
          </td>
          <td>
            <p><strong>Mr Arlene McCoy</strong></p>
            <p>01:30pm, 02 Feb, 22, Manual</p>
          </td>
          <td>
            <button :class="{
              maintenance: idx === 1,
              rented: idx === 2,
              reserved: idx === 3,
              opended: idx === 4,
            }" class="base-btn status-btn">
              {{
              idx === 1
              ? $t("form-fields.maintenance")
              : idx === 2
              ? $t("form-fields.rented")
              : idx === 3
              ? $t("form-fields.reserved")
              : idx === 4
              ? $t("form-fields.opened")
              : $t("form-fields.booked")
              }}
            </button>
          </td>
          <td>
            <div class="d-table__action">
              <button @click="showActionList" class="base-btn d-table__action-btn">
                <IconVerticalDots />
              </button>
              <ul class="d-table__action-list">
                <li class="d-table__action-list-item">
                  <span class="icon">
                    <IconEye />
                  </span>
                  {{ $t("form-fields.view") }}
                </li>
                <li class="d-table__action-list-item">
                  <span class="icon">
                    <IconPen />
                  </span>
                  {{ $t("form-fields.edit") }}
                </li>
                <li class="d-table__action-list-item">
                  <span class="icon">
                    <IconBin />
                  </span>
                  {{ $t("form-fields.remove") }}
                </li>
              </ul>
            </div>
          </td>
        </tr>
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
      <BTextarea v-model="selectToBlock.message" :height="150" :placeholder="$t('text.add-a-note-here')" />
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
</template>

<script>
import IconBin from "@/icons/IconBin.vue"
import IconEye from "@/icons/IconEye.vue"
import IconPen from "@/icons/IconPen.vue"
import IconVerticalDots from "@/icons/IconVerticalDots.vue"
import axios from "axios"
import BModel from "../../base/BModel.vue"
import BPagination from "../../base/BPagination.vue"
import BTextarea from "../../base/BTextarea.vue"
import DataTable from "@/components/common/DataTable.vue"
export default {
  components: {
    DataTable,
    BPagination,
    IconBin,
    IconEye,
    IconPen,
    IconVerticalDots,
    BModel,
    BTextarea,
  },
  data() {
    return {
      status: false,
      currentPage: 1,
      totolPages: 10,
      selectToBlock: {
        model: false,
        id: null,
        name: null,
        message: "",
      },
    }
  },
  methods: {
    changePagination() {
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
    blockUser() {
      if (this.blockMessage) {
        try {
          axios.post("/user/block", this.selectToBlock.message)
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
  height: calc(100vh - 235px);
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

.status-btn {
  background-color: #e3edff;
  // color: #276ef1;
  color: red;
  font-size: 1.9375rem;
  font-weight: 400;
  width: 100px;
  padding: 7px 5px;

  &.reserved {
    background-color: #f5e1ff;
    color: #b04cdf;
  }

  &.rented {
    background-color: #fff2e1;
    color: #ffa42f;
  }

  &.maintenance {
    background-color: #ffe1e1;
    color: #f56c6b;
  }

  &.opended {
    background-color: #d0ffe5;
    color: #1bce6c;
  }
}
</style>
