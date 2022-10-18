<template>
  <div class="accident__data-table b-data-table">
    <data-table :header="false">
      <template v-slot:thead>
        <tr>
          <th>{{ $t("form-fields.id") }}</th>
          <th>{{ $t("form-fields.accident-image") }}</th>
          <th>{{ $t("form-fields.documnets") }}</th>
          <th>{{ $t("form-fields.issue_date") }}</th>
          <th>{{ $t("form-fields.location") }}</th>
          <th>{{ $t("form-fields.speed") }}</th>
          <th>{{ $t("form-fields.vehicle") }}</th>
          <th>{{ $t("form-fields.fines") }}</th>

          <th></th>
        </tr>
      </template>
      <template v-slot:tbody>
        <tr v-for="(item, idx) in 1" :key="idx">
          <td><span>854035</span></td>
          <td>
            <div @click="openPreviewImage(item)" class="accident-img">
              <img src="@/assets/images/cars/accident-img-sm.png" alt="" />
            </div>
          </td>
          <td>
            <div>
              <app-link to="/">1.
                <span class="accident-archive__doc">ID Card Front side...</span>
              </app-link>
            </div>
            <div>
              <app-link to="/">2.
                <span class="accident-archive__doc">ID Card Back side...</span>
              </app-link>
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
                <li class="d-table__action-list-item" @click="editModalStatus = true">
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

  <!-- Image Preview -->
  <div v-if="previewImage.status" @click.self="previewImage.status = false" class="img-preview">
    <div class="img-preview__img">
      <img :src="previewImage.url" alt="" />
    </div>
  </div>
</template>

<script>
import IconBin from "@/icons/IconBin.vue"
import IconEye from "@/icons/IconEye.vue"
import IconPen from "@/icons/IconPen.vue"
import IconVerticalDots from "@/icons/IconVerticalDots.vue"
import BPagination from "../../base/BPagination.vue"
import DataTable from "@/components/common/DataTable.vue"

export default {
  components: {
    DataTable,
    BPagination,
    IconVerticalDots,
    IconBin,
    IconEye,
    IconPen,
  },
  data() {
    return {
      status: false,
      currentPage: 1,
      totolPages: 10,
      editModalStatus: false,
      form: {
        issue_date: "",
        reservation_id: "",
        manufacturers: "",
        location: "",
        fines_amount: "",
        status: "",
      },
      previewImage: {
        status: false,
        url: "",
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
    closeBlockModel() {
      this.selectToBlock.model = false
      this.selectToBlock.id = null
      this.selectToBlock.name = null
      this.selectToBlock.message = ""
    },
    getStatus(status) {
      if (status == "Pending") return "warning"
      if (status == "Solved") return "primary"
    },
    openPreviewImage() {
      this.previewImage.status = true
      this.previewImage.url =
        "https://areacarapi.workspacify.com/thumbnail/1652117567.jpg"
    },
  },
};
</script>

<style>
.accident__data-table.b-data-table .d-table__container {
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

.img-preview {
  position: fixed;
  width: 100%;
  height: 100vh;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  &__img {
    width: 700px;
    height: auto;
    overflow: hidden;
    z-index: 999;

    img {
      width: 100%;
      height: auto;
      border-radius: 4px;
    }
  }
}

.accident-archive {
  &__doc {
    color: var(--color-secondary);
    text-decoration: underline;
  }
}

.accident-img {
  cursor: pointer;
}
</style>
