<script setup>

import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useToast } from "vue-toastification"
import { api } from '@/use/useAxios'
import BackButton from '../../../components/buttons/BackButton.vue'
import PrimaryButton from '../../../components/buttons/PrimaryButton.vue'
import Editor from '../../../components/dashboard/form/Editor.vue'

const { t } = useI18n({ useScope: 'global' })
const toast = useToast()
const router = useRouter()
const title = ref('')
const description = ref('')

const onTitleInput = (e) => {
  title.value = e.target.innerHTML
}
const onDescriptionInput = (e) => {
  description.value = e.target.innerHTML
}

const savingState = ref(false)
const onAdd = async () => {
  const formData = new FormData()
  formData.append('title', title.value ?? '')
  formData.append('description', description.value ?? '')
  try {
    savingState.value = true
    await api.post("/admin/node/store", formData)
    toast.success(`${t('toast.addText')}`)
    router.push({ path: '/notizen' })
  } catch {
    savingState.value = false
  }
  finally {
    savingState.value = false
  }
}

</script>

<template>
  <div class="mb-4">
    <BackButton :label="t('dashboard-notes.notes')" />
  </div>

  <Editor />

  <div class="text-inputs mt-4">
    <div id="text-title" :placeholder="t('dashboard-notes.title')" contenteditable="true" @input="onTitleInput"></div>
    <div id="text-description" :placeholder="t('dashboard-notes.type-here')" class="mt-3" contenteditable="true"
      @input="onDescriptionInput"></div>
  </div>

  <div class="mt-4 text-right">
    <app-link path="/notizen">
      <button class="btn btn-cancel me-3">{{ t("button.cancel") }}</button>
    </app-link>
    <PrimaryButton variant="dark" @click="onAdd" :loading="savingState" style="min-width: 180px;">{{t("button.save") }}
    </PrimaryButton>
  </div>

</template>

<style lang="scss">
.text-inputs {
  border: 1px solid #DDDDDD;
  border-radius: 4px;
  padding: 24px;

  #text-title,
  #text-description {
    width: 100%;
    // border: 1px solid #eee; 
    padding: 4px 8px;

    &:focus {
      outline: none;
    }
  }

  #text-title {
    height: 40px;
    margin-bottom: 0.75rem;
    overflow-y: auto;
  }

  #text-description {
    height: 210px;
    margin-bottom: 1rem;
    overflow-y: auto;
  }

  #text-title[placeholder]:empty::before {
    content: attr(placeholder);
    color: rgba(0, 0, 0, 0.24);
  }

  #text-description[placeholder]:empty::before {
    // content: 'Type here';
    content: attr(placeholder);
    color: rgba(0, 0, 0, 0.24);
  }

  [placeholder]:empty:focus::before {
    content: "";
  }
}
</style>
