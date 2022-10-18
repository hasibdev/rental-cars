<script setup>
import { reactive, ref, defineProps, defineEmits } from 'vue'
import IconBin from "@/icons/IconBin.vue"
import IconPen from "@/icons/IconPen.vue"
import ConfirmDialog from '@/components/common/modals/ConfirmDialog.vue'
import ModalControl from '@/components/common/modals/ModalControl.vue'
import { useI18n } from 'vue-i18n'
import { useToast } from "vue-toastification"
import InputControl from "@/components/dashboard/form/InputControl.vue"
import CalenderControl from "@/components/dashboard/form/CalenderControl.vue"
import DocumentsUploader from '@/components/dashboard/form/DocumentsUploaderSmall.vue'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
// import ModalControl from '@/components/common/modals/ModalControl.vue'
// import { useReservationStore } from '@/stores/reservation'
import { api } from '@/use/useAxios'
import { imageBaseUrl } from '@/main'
const toast = useToast()
const { t, locale } = useI18n({ useScope: 'global' })
// import moment from 'moment'

// eslint-disable-next-line no-unused-vars
const emits = defineEmits(['update:driver', 'onDelete'])

const props = defineProps({
  driver: {
    type: Object,
    required: true,
    default: null
  }
})

const files = ref([])
const previousDocuments = ref(null)
// Editing
const editForm = reactive({
  data: {
    // updated_at: new Date().toISOString(),
  }
})

const editModalStatus = ref(false)
const editingState = ref(false)

const openEditModal = (data) => {
  Object.assign(editForm.data, data)
  editModalStatus.value = true
  if(data.documents){
    previousDocuments.value = data.documents.map(doc => ({
      img: doc.file_name,
      id: doc.id,
      url: imageBaseUrl(`/${doc.folder}/${doc.file_name}`)
    }))
  }
}

const onEditDriver = async () => {
  const formData = new FormData()
  for (let i = 0; i < files.value.length; i++) {
    formData.append(`documents[${i}]`, files.value[i])
  }
  for (let key in editForm.data) {
    formData.append(key, editForm.data[key] ?? '')
  }
  try {
    editingState.value = true
    await api.post(`/admin/driver/update/${editForm.data.id}`, formData)


    toast.success(`${t('toast.updateText')}`)
    editModalStatus.value = false
  } catch (error) {
    console.error(error)
    toast.error(`${t('toast.failureUpdateText')}`)
  } finally {
    editingState.value = false
  }
}

const removePrevDoc = id => {
  previousDocuments.value = previousDocuments.value.filter(doc => doc.id != id)
}

// Deleting
const activeDeleteId = ref()
const showDeleteModal = ref(false)
const deletingDriver = ref(false)
const openDeleteModal = (id) => {
  activeDeleteId.value = id
  showDeleteModal.value = true
}
const onDelete = async () => {
  try {
    deletingDriver.value = true
    await api.delete(`/admin/driver/delete/${activeDeleteId.value}`)
    // reFetch()

    toast.success(`${t('toast.deleteText')}`)
    showDeleteModal.value = false

    emits('onDelete', activeDeleteId.value)

  } catch (error) {
    toast.error(`${t('toast.failureDeleteText')}`)
  } finally {
    deletingDriver.value = false
  }
}
</script>
<template>
  <div v-if="driver" class="driver-card">
    <div class="driver-card__header">
      <h5 class="driver-card__name">{{ props.driver.driver_name }}</h5>
      <div class="driver-card__details row mx-0">
        <div class="col-lg-5 col-md-12 col-sm-12 px-0">
          <div class="row mx-0">
            <div class="col-lg-5 col-md-6 col-sm-12 px-0">
              <h6 class="details__item__label">{{ t('form-fields.date-of-birth') }}</h6>
            </div>
            <div class="col-lg-7 col-md-6 col-sm-12 px-0">
              <p class="details__item__value" v-if="locale === 'en'">{{ moment(props.driver.date_of_birth).format('DD/MM/YYYY') }}</p>
              <p class="details__item__value" v-else>{{ moment(props.driver.date_of_birth).format('DD.MM.YYYY') }}</p>
            </div>
          </div>
          <div class="row mx-0">
            <div class="col-lg-5 col-md-6 col-sm-12 px-0">
              <h6 class="details__item__label">{{ t('form-fields.place-of-birth') }}</h6>
            </div>
            <div class="col-lg-7 col-md-6 col-sm-12 px-0">
              <p class="details__item__value">{{ props.driver.place_of_birth }}</p>
            </div>
          </div>
          <div class="row mx-0">
            <div class="col-md-12 px-0">
              <!-- files -->
              <li class="details__item" v-for="(file, idx) in props.driver.driver_documents" :key="idx">
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
              <h6 class="details__item__label">{{ t('dashboard-reservation.driving-license-no') }}</h6>
            </div>
            <div class="col-lg-5 col-md-6 col-sm-12 px-0">
              <p class="details__item__value">{{ props.driver.driving_license_no }}</p>
            </div>
          </div>
          <div class="row mx-0">
            <div class="col-lg-7 col-md-6 col-sm-12 px-0">
              <h6 class="details__item__label">{{ t('form-fields.place-of-issue') }}</h6>
            </div>
            <div class="col-lg-5 col-md-6 col-sm-12 px-0">
              <p class="details__item__value">{{ props.driver.place_of_issuance }}</p>
            </div>
          </div>
          <div class="row mx-0">
            <div class="col-lg-7 col-md-6 col-sm-12 px-0">
              <h6 class="details__item__label">{{ t('form-fields.date-of-issue') }}</h6>
            </div>
            <div class="col-lg-5 col-md-6 col-sm-12 px-0">
              <p class="details__item__value" v-if="locale === 'en'">{{ moment(props.driver.date_of_issue).format('DD/MM/YYYY') }}</p>
              <p class="details__item__value" v-else>{{ moment(props.driver.date_of_issue).format('DD.MM.YYYY') }}</p>
            </div>
          </div>
          <div class="row mx-0">
            <div class="col-lg-7 col-md-6 col-sm-12 px-0">
              <h6 class="details__item__label">{{ t('form-fields.due-date') }}</h6>
            </div>
            <div class="col-lg-5 col-md-6 col-sm-12 px-0">
              <p class="details__item__value" v-if="locale === 'en'">{{ moment(props.driver.due_date).format('DD/MM/YYYY') }}</p>
              <p class="details__item__value" v-else>{{ moment(props.driver.due_date).format('DD.MM.YYYY') }}</p>
            </div>
          </div>
        </div>
        <div class="col-lg-1 col-md-1 col-sm-12 px-0">
          <div class="driver-card__actions">
            <button class="base-btn driver-card__actions-btn" @click="openEditModal(props.driver)">
              <IconPen />
            </button>
            <button class="base-btn driver-card__actions-btn" @click="openDeleteModal(props.driver.id)">
              <IconBin />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Modal -->
    <ConfirmDialog v-model="showDeleteModal" @onOk="onDelete" :okLoading="deletingDriver" :title="t('dashboard-reservation.delete-driver')" :message="t('dashboard-reservation.delete-driver-text')"></ConfirmDialog>

    <!-- Edit Modal -->
    <ModalControl v-model="editModalStatus" dialogClass="modal-md">
      <div class="modal-header">
        <p class="mb-1">Update Driver</p>
      </div>
      <div v-if="editForm.data" class="modal-body">
        <InputControl v-model="editForm.data.driver_name" :placeholder="t('dashboard-reservation.driver-name')" class="mb-3" errorField="driver_name" />
        <CalenderControl v-model="editForm.data.date_of_birth" :placeholder="t('dashboard-reservation.date-of-birth')" class="mb-3" errorField="date_of_birth" />

        <!-- <SelectControl v-model="addForm.reservation_id" track="id" optionLabel="reservation_no" :options="reservationData?.reversions.data || [] " :placeholder="t('Accident.reservation-id')" errorField="reservation_id" class="mt-3" /> -->
        <InputControl v-model="editForm.data.place_of_birth" :placeholder="t('dashboard-reservation.place-of-birth')" errorField="place_of_birth" class="mt-3" />
        <InputControl v-model="editForm.data.driving_license_no" :placeholder="t('dashboard-reservation.driving-license-no')" errorField="driving_license_no" class="mt-3" />
        <InputControl v-model="editForm.data.place_of_issuance" :placeholder="t('dashboard-reservation.place-of-issuance')" errorField="place_of_issuance" class="mt-3" />
        <CalenderControl v-model="editForm.data.date_of_issue" :placeholder="t('dashboard-reservation.date-of-issue')" class="my-3" errorField="date_of_issue" />
        <CalenderControl v-model="editForm.data.due_date" :placeholder="t('dashboard-reservation.due-date')" class="my-3" errorField="due_date" />

        <DocumentsUploader :previousDocuments="previousDocuments" v-model="files" @removePrev="removePrevDoc"></DocumentsUploader>

      </div>
      <div class="modal-footer border-0 mt-2">
        <button @click="editModalStatus = false" type="button" class="btn btn-cancel px-5 py-2 btn-sm ">{{t('button.cancel')}}</button>
        <PrimaryButton variant="dark" @click="onEditDriver" :loading="editingState">{{t('button.save')}}</PrimaryButton>
      </div>
    </ModalControl>
  </div>
</template>


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
        padding-bottom: 0.5rem;
      }

      &__value {
        margin-bottom: 0;
        font-size: 1rem;
        font-weight: 400;
        padding-bottom: 0.5rem;
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
