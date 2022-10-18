<template>
  <div class="invoice__data-table b-data-table">
    <data-table :header="false">
      <template v-slot:thead>
        <tr>
          <th>{{ $t("form-fields.date") }}</th>
          <th>{{ $t("form-fields.customer-name") }}</th>
          <th>{{ $t("form-fields.invoice-number") }}</th>
          <th>{{ $t("form-fields.created-by") }}</th>

          <th></th>
        </tr>
      </template>
      <template v-slot:tbody>
        <tr v-for="(customer, idx) in 5" :key="idx">
          <td><span>20 April 2022</span></td>
          <td><span>John Doe</span></td>
          <td><span>WSY-00007</span></td>
          <td>
            <p><strong>Arlene McCoy</strong></p>
            <p class="invoice__data-table__created">01:30pm, 02 Feb, 22</p>
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
import IconEye from "@/icons/IconEye.vue"
import IconVerticalDots from "@/icons/IconVerticalDots.vue"
import BPagination from "../../base/BPagination.vue"
import DataTable from "@/components/common/DataTable.vue"
export default {
  components: {
    DataTable,
    BPagination,
    IconBin,
    IconEye,
    IconVerticalDots,
  },
  data() {
    return {
      status: false,
      currentPage: 1,
      totolPages: 10,
    }
  },
  methods: {
    changePagination() {
    },
    showActionList(e) {
      e.target.nextSibling.classList.toggle("active")
    },
  },
};
</script>

<style>
.invoice__data-table.b-data-table .d-table__container {
  height: calc(100vh - 150px);
}
</style>

<style lang="scss" scoped>
.invoice__data-table {
  &__created {
    font-size: 0.875rem;
    color: var(--color-grey);
  }
}
</style>
