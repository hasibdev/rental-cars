<script setup>

import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from "vue-toastification"
import { useAxios } from '@/use/useAxios'

import ConfirmDialog from '../../../components/common/modals/ConfirmDialog.vue'
// import PageHeader from "../../../components/dashboard/PageHeader.vue"

const { t, locale } = useI18n({ useScope: 'global' })
const toast = useToast()

const {
  data: noteData,
  loading,
  onApiDelete,
  deleting,
  reFetch,
} = useAxios('/admin/node')

// console.log(noteData)

// Deleting
const activeDeleteId = ref()
const showDeleteModal = ref(false)
const openDeleteModal = (id) => {
  activeDeleteId.value = id
  showDeleteModal.value = true
}
const onDelete = async () => {
  try {
    await onApiDelete(`/admin/node/delete/${activeDeleteId.value}`)
    reFetch()

    showDeleteModal.value = false
    toast.success(`${t('toast.deleteText')}`)
  } catch (error) {
    toast.error(`${t('toast.failureDeleteText')}`)
  }
}

</script>

<template>
  <div class="d-flex justify-content-end align-items-center">
    <!-- <BackButton :label="t('title.settings')" /> -->
    <app-link path="/notizen/erstellen">
      <button class="btn btn-dark" style="min-width: 225px; ">
        <span class="me-1 text-17">+</span> {{t('dashboard-notes.add-note')}}
      </button>
    </app-link>
  </div>
  <Loading v-if="loading" class="my-3" />
  <div v-else class="row mt-5 noteList">
    <div class="col-md-4 col-sm-12 mb-4" v-for="note in noteData?.nodes || []" :key="note.id">
      <div class="card scrollbar">
        <div class="card-header p-0 d-flex justify-content-between align-items-start">
          <div>
            <div class="title text-16 fw-700" v-html="note.title"></div>
            <div class="date text-12 fw-400 pt-2" v-if="locale === 'de'">{{moment(note.input_date).format('DD.MM.YYYY')}}
            </div>
            <div class="date text-12 fw-400 pt-2" v-else>{{moment(note.input_date).format('DD/MM/YYYY')}}</div>
          </div>
          <div class="icon-div d-flex align-items-center justify-content-end">
            <div class="icon me-3">
              <app-link :path="`/notizen/aktualisieren/${note.id}`">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_5117_1041)">
                    <path
                      d="M15.3334 6.00001C15.5085 5.82491 15.7163 5.68602 15.9451 5.59126C16.1739 5.4965 16.4191 5.44772 16.6667 5.44772C16.9143 5.44772 17.1595 5.4965 17.3883 5.59126C17.6171 5.68602 17.8249 5.82491 18 6.00001C18.1751 6.1751 18.314 6.38297 18.4088 6.61175C18.5036 6.84052 18.5523 7.08572 18.5523 7.33334C18.5523 7.58096 18.5036 7.82616 18.4088 8.05494C18.314 8.28371 18.1751 8.49158 18 8.66667L9.00004 17.6667L5.33337 18.6667L6.33337 15L15.3334 6.00001Z"
                      stroke="#B2B2B2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </g>
                  <defs>
                    <clipPath id="clip0_5117_1041">
                      <rect width="16" height="16" fill="white" transform="translate(4 4)" />
                    </clipPath>
                  </defs>
                </svg>
              </app-link>
            </div>
            <div class="icon pointer" @click="openDeleteModal(note.id)">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 8H7.33333H18" stroke="#F25037" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" />
                <path
                  d="M9.33337 8.00001V6.66668C9.33337 6.31305 9.47385 5.97392 9.7239 5.72387C9.97395 5.47382 10.3131 5.33334 10.6667 5.33334H13.3334C13.687 5.33334 14.0261 5.47382 14.2762 5.72387C14.5262 5.97392 14.6667 6.31305 14.6667 6.66668V8.00001M16.6667 8.00001V17.3333C16.6667 17.687 16.5262 18.0261 16.2762 18.2762C16.0261 18.5262 15.687 18.6667 15.3334 18.6667H8.66671C8.31309 18.6667 7.97395 18.5262 7.7239 18.2762C7.47385 18.0261 7.33337 17.687 7.33337 17.3333V8.00001H16.6667Z"
                  stroke="#F25037" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
          </div>
        </div>
        <div class="card-body p-0">
          <div class="description text-14 fw-400" v-html="note.description"></div>
        </div>
      </div>
    </div>
    <div v-if="noteData?.nodes?.length == 0 " class="text-center mt-5">
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
      <div class="fw-400 pb-3" style="font-size: 25px; color: #020918;">{{t('text.there-is-no-data-in-the-table')}}</div>
      <div class="text-25 fw-400 pointer" style="font-size: 25px; color: #276EF1;">
        <app-link path="/notizen/erstellen">{{t('button.click-here-to-create-a-new-record')}}</app-link>
      </div>
    </div>
  </div>

  <!-- Delete Modal -->
  <ConfirmDialog v-model="showDeleteModal" @onOk="onDelete" :okLoading="deleting"
    :title="t('dashboard-notes.remove-note')" :message="t('dashboard-notes.delete-modal-text')"></ConfirmDialog>

</template>

<style lang="scss">
.noteList {
  .card {
    background: #FFFFFF;
    border: 1px solid #DDDDDD;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12);
    border-radius: 4px;
    padding: 1rem;
    height: 319px;
    overflow: hidden auto;

    .card-header {
      background: transparent;
      border: none;
      margin-bottom: 1.5rem;

      .title {
        color: #353A40;
      }

      .date {
        color: #808080;
      }
    }

    .card-body {
      .description {
        color: #353A40;
        line-height: 28px;
      }
    }

  }
}
</style>
