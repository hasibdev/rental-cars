<script setup>

import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from "vue-toastification"
import { api } from '@/use/useAxios'
import BackButton from '../../../components/buttons/BackButton.vue'
import PrimaryButton from '../../../components/buttons/PrimaryButton.vue'
import Editor from '../../../components/dashboard/form/Editor.vue'

const title = ref('')
const description = ref('')
const { t } = useI18n({ useScope: 'global' })
const toast = useToast()
const route = useRoute()
const router = useRouter()

const onTitleInput = (e) => {
  title.value = e.target.innerHTML
}
const onDescriptionInput = (e) => {
  description.value = e.target.innerHTML
}

const savingState = ref(false)
const onUpdate = async () => {
  const formData = new FormData()
  formData.append('title', title.value ?? '')
  formData.append('description', description.value ?? '')
  try {
    savingState.value = true
    await api.post(`/admin/node/update/${route.params.id}`, formData)
    toast.success(`${t('toast.updateText')}`)
    router.push({ path: '/notizen' })
  } catch (error) {
    console.log(error)
    savingState.value = false
    toast.error(`${t('toast.failureUpdateText')}`)
  }
  finally {
    savingState.value = false
  }
}

const titleText = ref('')
const descriptionText = ref('')

const fetchData = async () => {
  const res = await api.get(`admin/node/edit/${route.params.id}`)
  titleText.value = res.data.datainfo.title
  title.value = res.data.datainfo.title
  descriptionText.value = res.data.datainfo.description
  description.value = res.data.datainfo.description
}
fetchData()

</script>

<template>
  <div class="mb-4">
    <BackButton :label="t('dashboard-notes.notes')" />
  </div>

  <Editor />

  <div class="text-inputs mt-4">
    <div id="text-title" placeholder="title" contenteditable="true" @input="onTitleInput" v-html="titleText"></div>
    <div id="text-description" placeholder="Type here" class="mt-3" contenteditable="true" @input="onDescriptionInput" v-html="descriptionText"></div>
  </div>

  <div class="mt-4 text-right">
    <app-link path="/notizen">
      <button class="btn btn-cancel me-3">{{ t("button.cancel") }}</button>
    </app-link>
    <PrimaryButton variant="dark" @click="onUpdate" :loading="savingState" style="min-width: 180px;">{{t("button.save")
    }}</PrimaryButton>
  </div>

</template>

<style lang="scss">
.text-inputs {
  border: 1px solid #dddddd;
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
    content: "Title";
    color: rgba(0, 0, 0, 0.24);
  }

  #text-description[placeholder]:empty::before {
    content: "Type here";
    color: rgba(0, 0, 0, 0.24);
  }

  div[placeholder]:empty:focus::before {
    content: "";
  }
}
</style>
