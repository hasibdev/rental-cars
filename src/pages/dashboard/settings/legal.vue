<script setup>

import BackButton from "@/components/buttons/BackButton.vue"
import PrimaryButton from "@/components/buttons/PrimaryButton.vue"
import { api } from "@/use/useAxios"
import { ref } from "vue"
import { useI18n } from "vue-i18n"
import { useToast } from "vue-toastification"
import { VueEditor } from "vue3-editor"

const toast = useToast()
const { t } = useI18n({ useScope: 'global' })
const richText = ref("")

// const { data } = useAxios("/admin/general/legal-get")

// watch(data, (updatedValue) => {
//   richText.value = updatedValue.legal_name_of_the_company
// })

const savingState = ref(false)
const saveForm = async () => {
  try {
    savingState.value = true

    await api.post("/admin/general-information/legal-update", {
      legal_name_of_the_company: richText.value,
    })

    toast.success(`${t('toast.updateText')}`)
  } catch (error) {
    toast.error(`${t('toast.failureUpdateText')}`)
  } finally {
    savingState.value = false
  }
}
</script>

<template>

  <BackButton :label="t('title.settings')" />

  <h5 class="mt-4 mb-3">{{t('footer.legal')}}</h5>

  <div class="borderd-content legal-contaner">
    <div class="row">
      <div class="col-lg-6">
        <p class="fw-bold mb-4">{{t('dashboard-reservation.details')}}</p>
        <p>
          Ihre Kunden sehen diese Informationen im Menüpunkt <br />
          "Datenschutz".
        </p>
      </div>

      <div class="col-lg-6">
        <div class="text-editor">
          <VueEditor v-model="richText" />
          <div class="mt-4 d-flex justify-content-end align-items-center">
            <app-link path="/einstellungen" class="btn btn-cancel mx-3">{{t('button.cancel')}}</app-link>
            <PrimaryButton @click="saveForm()" :loading="savingState">{{t('button.update')}}</PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>


<style lang="scss" scoped>
.settings-box {
  padding: 33px;
  min-height: 230px;
}

.text-editor {
  margin-top: 2rem;
}

.legal-contaner {
  min-height: 80vh;
  padding: 1.5rem;
}

.btn-cancel {
  background: #eeeeee;
  border-radius: 4px;
  color: $light-gray;
  font-size: 1rem;
}
</style>
