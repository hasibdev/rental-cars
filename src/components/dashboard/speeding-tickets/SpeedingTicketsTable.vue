<template>
  <div class="speeding-tickets__data-table b-data-table">
    <data-table :header="false">
      <template v-slot:thead>
        <tr>
          <th>{{ $t("form-fields.id") }}</th>
          <th>{{ $t("form-fields.ticket-image") }}</th>
          <th>{{ $t("form-fields.issue-date") }}</th>
          <th>{{ $t("form-fields.location") }}</th>
          <th>{{ $t("form-fields.speed") }}</th>
          <th>{{ $t("form-fields.vehicle") }}</th>
          <th>{{ $t("form-fields.fines") }}</th>
          <th>{{ $t("form-fields.status") }}</th>

          <th></th>
        </tr>
      </template>
      <template v-slot:tbody>
        <tr v-for="(customer, idx) in 10" :key="idx">
          <td><span>854035</span></td>
          <td>
            <div class="ticket-img">
              <img src="@/assets/images/ticket-img.png" alt="" />
            </div>
          </td>
          <td><span>10 Jan 2022</span></td>
          <td><span>South Dakota 83475</span></td>
          <td><span>150 KM/H</span></td>
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
          <td><span>$100</span></td>
          <td>
            <status-button :type="getStatus('Solved')">Solved</status-button>
          </td>

          <td>
            <div class="d-table__action">
              <button @click="showActionList" class="base-btn d-table__action-btn">
                <IconVerticalDots />
              </button>
              <ul class="d-table__action-list">
                <li class="d-table__action-list-item" @click="editModalStatus = true">
                  <span class="icon">
                    <IconPen />
                  </span>
                  {{ $t("form-fields.edit") }}
                </li>
                <li @click="deleteModalStatus = true" class="d-table__action-list-item">
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
</template>

<script>
import IconBin from "@/icons/IconBin.vue"
import IconPen from "@/icons/IconPen.vue"
import IconVerticalDots from "@/icons/IconVerticalDots.vue"
import StatusButton from "../shared/StatusButton.vue"
import BPagination from "../../base/BPagination.vue"
import DataTable from "@/components/common/DataTable.vue"

export default {
  components: {
    DataTable,
    BPagination,
    IconBin,
    IconPen,
    IconVerticalDots,
    StatusButton,
  },
  data() {
    return {
      status: false,
      currentPage: 1,
      totolPages: 10,
      editModalStatus: false,
      deleteModalStatus: false,
      form: {
        issue_date: "",
        reservation_id: "",
        manufacturers: "",
        location: "",
        fines_amount: "",
        status: "",
      },
      manufacturers: [
        {
          id: 1,
          title: "TOYOTA",
        },
        {
          id: 2,
          title: "TATA",
        },
        {
          id: 3,
          title: "Rangs",
        },
      ],
    }
  },
  methods: {
    changePagination() {
    },
    showActionList(e) {
      e.target.nextSibling.classList.toggle("active")
    },
    getStatus(status) {
      if (status == "Pending") return "warning"
      if (status == "Solved") return "primary"
    },
  },
};
</script>

<style>
.speeding-tickets__data-table.b-data-table .d-table__container {
  height: calc(100vh - 240px);
}
</style>

<style lang="scss" scoped>
.ticket-img {
  width: 45%;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.d-table-user__avatar--car {
  height: 45px;
  width: 60px;
  border-radius: 5px;
}
</style>
