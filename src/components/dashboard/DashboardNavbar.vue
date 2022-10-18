<template>
  <div>
    <div class="nav-sidebar">
      <!-- logo -->
      <div class="nav-sidebar__logo">

        <svg width="35" height="35" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M33.8958 0H14.1042L0 14.1042V33.8958L14.1042 48H33.8958L48 34.1232V14.1042L33.8958 0ZM38.2181 29.8009L29.8009 38.2181H17.9715L9.55452 29.8009V17.9715L17.9715 9.55451H29.8009L38.2181 17.9715V29.8009Z"
            fill="white" />
        </svg>

      </div>

      <!-- navigations -->
      <div class="nav-sidebar__content">
        <ul class="nav-sidebar__links ps-0">
          <!-- sin -->
          <li v-for="menu in meneus" :key="menu.id" class="nav-sidebar__link-item">
            <app-link :path="menu.route" class="nav-sidebar__link">
              <span class="icon">
                <component :is="menu.icon" />
              </span>
              <h6 class="nav-label">{{ menu.text }}</h6>
            </app-link>
          </li>
        </ul>

        <!-- support links -->
        <!-- <ul
          class="nav-sidebar__user-settings"
          :style="h> 800 ? 'position: absolute; bottom: 3rem; left: 0; width: 100%; ' : 'width: 100%' "
        >.....</ul -->
        <ul class="nav-sidebar__user-settings"
          style="position: absolute; bottom: 3rem; left: 0; width: 100%; padding: 0 0.65rem; ">
          <li class="mb-3">
            <app-link path="/demnächst" class="nav-sidebar__link">
              <span class="icon">
                <IconBell />
              </span>
              <h6 class="nav-label">{{$t('sidebar.notifications')}}</h6>
            </app-link>
          </li>
          <li>
            <a class="nav-sidebar__user nav-sidebar__link">
              <span class="icon">
                <div class="user-avater">
                  <img v-if="loggedIn" :src="imageBaseUrl(`/profile/${user.photo}`)" alt="User" width="50" height="50">
                  <img v-else :src="userImage" alt="User" width="50" height="50">
                </div>
              </span>
              <!-- sub menus -->
              <ul class="nav-sidebar__link__sub">
                <li class="nav-sidebar__link__sub-item">
                  <app-link path="/profil" class="text-dark">
                    {{$t('sidebar.admin-center')}}
                  </app-link>
                </li>
                <li class="nav-sidebar__link__sub-item ">
                  <app-link path="/demnächst" class="text-dark">
                    {{$t('sidebar.plan-and-billing')}}
                  </app-link>
                </li>
                <li class="nav-sidebar__link__sub-item ">
                  <app-link path="/demnächst" class="text-dark">
                    {{$t('sidebar.user-management')}}
                  </app-link>
                </li>
                <li class="nav-sidebar__link__sub-item ">
                  <app-link path="/demnächst" class="text-dark">
                    {{$t('sidebar.group-management')}}
                  </app-link>
                </li>
                <li class="divider"></li>
                <li class="nav-sidebar__link__sub-item ">
                  <app-link path="/demnächst" class="text-dark">
                    {{$t('sidebar.apps-and-integration')}}
                  </app-link>
                </li>
                <li class="nav-sidebar__link__sub-item ">
                  <app-link path="/demnächst" class="text-dark">
                    {{$t('sidebar.developer-tools')}}
                  </app-link>
                </li>
                <li class="nav-sidebar__link__sub-item ">
                  <app-link path="/demnächst" class="text-dark">
                    {{$t('sidebar.personal-colors-and-logo')}}
                  </app-link>
                </li>
                <li class="nav-sidebar__link__sub-item ">
                  <app-link path="/demnächst" class="text-dark">
                    {{$t('sidebar.my-smartsheet-contacts')}}
                  </app-link>
                </li>
                <li class="divider"></li>
                <li @click="onLogout" class="nav-sidebar__link__sub-item pointer">{{$t('sidebar.signout')}}</li>
              </ul>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import IconBell from "../../icons/IconBell.vue"
import IconBox from "../../icons/IconBox.vue"
import IconCalendarAlt from "../../icons/IconCalendarAlt.vue"
import IconCar from "../../icons/IconCar.vue"
import IconCheckCalendar from "../../icons/IconCheckCalendar.vue"
import IconHomeAlt from "../../icons/IconHomeAlt.vue"
import IconlistAlt from "../../icons/IconlistAlt.vue"
import IconTicket from "../../icons/IconTicket.vue"
import IconUser from "../../icons/IconUser.vue"
import IconUsers from "../../icons/IconUsers.vue"
import IconSettings from "../../icons/IconSettings.vue"
import IconRequest from "../../icons/IconRequest.vue"
import IconNote from "../../icons/IconNote.vue"
import userImage from "@/assets/images/user.png"
import { mapActions, mapState } from 'pinia'
import { useAuthStore } from '../../stores/auth'

import InputControl from '@/components/dashboard/form/InputControl.vue'
import ModalControl from '@/components/common/modals/ModalControl.vue'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'

export default {
  name: "DashboardNavbar",
  components: {
    IconBell,
    IconHomeAlt,
    IconUsers,
    IconCar,
    IconCheckCalendar,
    IconCalendarAlt,
    IconlistAlt,
    IconTicket,
    IconBox,
    IconUser,
    IconSettings,
    IconRequest,
    IconNote,
    InputControl,
    ModalControl,
    PrimaryButton
  },
  data() {
    return {
      userImage: userImage,
      h: window.innerHeight,
      meneus: [
        {
          id: 1,
          text: `${this.$t('sidebar.overview')}`,
          route: "/dashboard",
          icon: "IconHomeAlt",
          children: null
        },
        {
          id: 2,
          text: `${this.$t('sidebar.calendar')}`,
          route: "/buchungskalender",
          icon: "IconCalendarAlt",
          children: null
        },
        {
          id: 3,
          text: `${this.$t('sidebar.requests')}`,
          route: "/anfragen",
          icon: "IconRequest",
        },
        {
          id: 4,
          text: `${this.$t('sidebar.customers')}`,
          route: "/kunden",
          icon: "IconUsers",
        },
        {
          id: 5,
          text: `${this.$t('sidebar.fleets')}`,
          route: "/fuhrparks",
          icon: "IconCar",
        },
        {
          id: 6,
          text: `${this.$t('sidebar.reservation')}`,
          route: "/reservierungen",
          icon: "IconCheckCalendar",
        },
        {
          id: 7,
          text: `${this.$t('sidebar.invoice')}`,
          route: "/rechnung",
          icon: "IconlistAlt",
        },
        {
          id: 8,
          text: `${this.$t('sidebar.speeding-tickets')}`,
          route: "/strafzettel",
          icon: "IconTicket",
        },
        {
          id: 9,
          text: `${this.$t('sidebar.accident-archive')}`,
          route: "/unfall-archiv",
          icon: "IconBox",
        },
        {
          id: 10,
          text: `${this.$t('sidebar.notes')}`,
          route: "/notizen",
          icon: "IconNote",
        },
        {
          id: 11,
          text: `${this.$t('sidebar.settings')}`,
          route: "/einstellungen",
          icon: "IconSettings",
        },
      ],
    }
  },
  computed: {
    ...mapState(useAuthStore, ['loggedIn', 'user'])
  },
  methods: {
    ...mapActions(useAuthStore, ['logout']),
    async onLogout() {
      try {
        await this.logout()
        this.$router.push(`/anmeldung`)
      } catch (error) {
        console.error(error)
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.nav-sidebar {
  height: 100vh;
  position: relative;
}

.nav-sidebar {
  &__logo {
    margin: 1.5rem auto;
    text-align: center;
    width: 73%;

    .logo {
      max-width: 100%;
      height: auto;
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    // // height: calc(100% - 2rem);
    padding: 0 10px 0 10px;
  }

  &__link {
    height: 2.35rem !important;
    width: 100%;
    color: var(--color-white);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    padding: 6px 11px;
    border-radius: 4px;
    transition: background-color 0.2s ease;
    margin-bottom: 1px;
    margin-top: 5px;
    position: relative;

    .svg {
      opacity: 0.6;
    }

    .nav-label {
      position: absolute;
      left: 4.75rem;
      color: var(--color-text);
      background-color: var(--color-white);
      top: 0;
      border: 1px solid var(--color-light-grey);
      overflow: hidden;
      box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.2);
      visibility: hidden;
      transition: all 0.2s ease;
      z-index: 99;
      margin-left: 0.5rem;
      padding: 0.5rem 0 0.5rem 1.5rem;
      min-width: 12.5rem;
    }

    &.active,
    &.exact-active {
      background: rgba(255, 255, 255, 0.4);
      border-radius: 4px;

      .svg {
        opacity: 1;
      }
    }

    &.nav-sidebar__user {
      border-radius: 4px;
      width: 100%;
      height: 3rem;
      margin: 0 auto;
      margin-top: 0.75rem;

      .user-avater {
        border-radius: 50%;
        overflow: hidden;
        font-size: 0.875rem;
        color: var(--color-text);
        user-select: none;
      }

      .nav-sidebar__link__sub {
        bottom: 0 !important;
        top: auto;
      }

      &:hover {
        background: transparent !important;
      }
    }

    &__sub {
      position: absolute;
      margin-left: 0.5rem;
      min-width: 14rem;
      max-width: 17rem;
      left: 4.75rem;
      color: var(--color-text);
      background-color: var(--color-white);
      // top: 0;
      border: 1px solid var(--color-light-grey);
      border-radius: 4px;
      overflow: hidden;
      box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.2);
      visibility: hidden;
      transition: all 0.2s ease-in-out;
      z-index: 99;
      bottom: 0;

      &-item {
        font-size: 1rem;
        font-weight: 500;
        padding: 0.5rem 0 0.5rem 1.5rem;
        // padding: 6px 11px;

        &:hover {
          background-color: var(--color-light-grey);
        }
      }

      .divider {
        margin: 0.25rem auto;
        height: 1px;
        width: 85%;
        background-color: #ccced1;
      }
    }

    &:hover {
      // background-color: var(--color-grey);
      background: rgba(255, 255, 255, 0.4);
      border-radius: 4px;

      .svg {
        opacity: 1 !important;
      }

      .nav-label {
        left: 3.65rem;
        visibility: visible;
        z-index: 9999;
      }

      .nav-sidebar__link__sub {
        left: 3.65rem;
        visibility: visible !important;
        z-index: 9999;
      }
    }
  }

  &__user-settings {
    &:hover {
      background: transparent;
    }
  }

  // &__user-settings {
  //   position: absolute;
  //   bottom: 3rem;
  //   left: 0;
  //   width: 100%;
  //   padding: 0 10px;
  // }
}

.nav-sidebar__link-item .active.exact-active.nav-sidebar__link g {
  opacity: 1 !important;
}

.nav-sidebar__link-item .nav-sidebar__link:hover {
  opacity: 1;
}

.scroll-navbar {
  overflow-y: auto;
}
</style>
