<script setup>
import { reactive, ref, watch } from "vue"
import { useToast } from "vue-toastification"
import { useI18n } from 'vue-i18n'

import PrimaryButton from "@/components/buttons/PrimaryButton.vue"
// import ImageUpload from "@/components/base/ImageUpload.vue"
import InputControl from "@/components/dashboard/form/InputControl.vue"
import ProfileUploader from "@/components/base/ProfileUploader.vue"
import { api } from "@/use/useAxios"
import { useAuthStore } from '@/stores/auth.js'

const auth = useAuthStore()
const toast = useToast()
const { t } = useI18n({ useScope: 'global' })



const profileForm = reactive(
  auth.user || {
    photo: null,
    first_name: "",
    last_name: "",
    email: "",
  }
)

watch(auth, () => {
  Object.assign(profileForm, auth.user)
}, { immediate: true })
auth.authCheckout()

const profileLoading = ref(false)
const updateProfile = async () => {
  profileLoading.value = true
  const formData = new FormData()

  Object.keys(profileForm).forEach((key) =>
    formData.append(key, profileForm[key] ?? '')
  )
  try {

    await api.post("/admin/users/profile-update", formData)

    auth.authCheckout()
    toast.success(`${t('toast.profileInfoUpdateText')}`)
  } catch (error) {
    toast.error(`${t('toast.profileInfoUpdateFailureText')}`)
  } finally {
    profileLoading.value = false
  }
}

const changeForm = reactive({
  current_password: "",
  new_password: "",
  new_password_confirmation: "",
})

const changeLoading = ref(false)
const changePassword = async () => {
  try {
    changeLoading.value = true
    await api.post('/admin/users/change-password', changeForm)
    // changeForm.reset();
    toast.success(`${t('toast.passwordUpdateText')}`)
  }
  catch (error) {
    if (error.response?.status == 422) {
      if (error.response.data.new_password) {
        //
      }
      else {
        toast.error(`${t('toast.passwordUpdateFailureText')}`)
      }
    }
  } finally {
    changeLoading.value = false
  }
}

</script>

<template>

  <div class="card card-body">
    <div class="profile__img">
      <!-- <ImageUpload :image="profileForm.photo" v-model="profileForm.photo" /> -->
      <ProfileUploader v-model="profileForm.photo" :image="imageBaseUrl(`/profile/${profileForm.photo}`)"
        errorField="photo" data-field="photo" />
    </div>

    <div class="row">
      <div class="col-lg-3 col-md-2 col-sm-12"></div>
      <div class="col-lg-6 col-md-8 col-sm-12">
        <div class="form mb-3">
          <h3 class="title">{{t('profile.profile-information')}}</h3>
          <InputControl v-model="profileForm.first_name" :label="t('profile.first-name')" class="mt-3"
            errorField="first_name" :placeholder="t('profile.first-name')" />
          <InputControl v-model="profileForm.last_name" :label="t('profile.last-name')" class="mt-3"
            errorField="last_name" :placeholder="t('profile.last-name')" />
          <InputControl v-model="profileForm.phone" type="tel" :label="t('profile.phone')" class="mt-3"
            errorField="phone" :placeholder="t('profile.phone')" />
          <InputControl v-model="profileForm.email" disabled label="E-Mail" class="mt-3" errorField="email"
            placeholder="Email" />

          <div class="d-flex justify-content-end align-items-center mt-4">
            <PrimaryButton @click="updateProfile" :loading="profileLoading">{{t('profile.update-profile')}}
            </PrimaryButton>
          </div>
        </div>
        <div class="form">
          <h3 class="title">{{t('profile.password-update')}}</h3>
          <InputControl v-model="changeForm.current_password" type="password" :label="t('profile.current-password')"
            errorField="current_password" :placeholder="t('profile.current-password')" />
          <InputControl v-model="changeForm.new_password" type="password" :label="t('profile.new-password')"
            errorField="new_password" class="my-3" :placeholder="t('profile.new-password')" />
          <InputControl v-model="changeForm.new_password_confirmation" type="password"
            :label="t('profile.confirm-password')" errorField="new_password_confirmation" class="my-3"
            :placeholder="t('profile.confirm-password')" />

          <div class="d-flex justify-content-end align-items-center mt-4">
            <PrimaryButton @click="changePassword" :loading="changeLoading">{{t('profile.update-password')}}
            </PrimaryButton>
          </div>
        </div>
        <div class="col-md-3"></div>
      </div>
    </div>
  </div>

</template>

<style lang="scss" scoped>
.card {
  padding-bottom: 2rem;
}

.profile__img {
  width: 300px;
  margin: 0 auto;
}

.form {
  border: 1px solid #ddd;
  padding: 1.5rem;
  border-radius: 5px;

  .title {
    font-size: 1.3rem;
    font-weight: 500;
    margin-bottom: 1rem;
  }
}
</style>
