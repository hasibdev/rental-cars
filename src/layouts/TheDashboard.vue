<script setup>
import DashboardNavbar from "@/components/dashboard/DashboardNavbar.vue"
import Toaster from "@/components/base/toster"
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()


async function setAuth() {
  try {
    await auth.authCheckout()
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      router.replace(`/anmeldung`)
    }
  }
}

setAuth()
</script>

<template>
  <div class="layout__default">
    <div class="nav__sidebar">
      <DashboardNavbar />
    </div>
    <div class="main__container">
      <div class="page__container">
        <div class="scrollbar error_scrollbar">
          <div class="page">
            <div class="page-contents">
              <slot />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Toaster />
</template>

<style lang="scss" scoped>
.layout__default {
  width: 100%;
  max-width: 100%;
  background-color: var(--color-dark);
  height: 100vh;
  overflow: hidden;
  display: flex;
}

.main__container {
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.page__container {
  height: calc(100vh - 2rem);
  width: calc(100% - 1rem);
  background-color: var(--color-white);
  border-radius: 0.5rem;
  padding: 0.5rem 0;
  overflow: hidden;
}

.page__inner {
  overflow: hidden;
  padding: 0;
}

// nav sidebar
.nav__sidebar {
  width: 4.75rem;
}

.main__container {
  width: calc(100% - 4.75rem);
}
</style>
