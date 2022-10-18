<template>
  <footer class="footer">
    <div class="footer__widgets">
      <div class="container">
        <div class="row">
          <div class="footer__widget-col col-lg-4 col-md-12">
            <app-link path="/">
              <div class="footer__widget footer__logo">
                <img src="@/assets/images/logo.svg" alt="footer logo" />
              </div>
            </app-link>
          </div>
          <!-- <div class="footer__widget-col col-lg-2 col-md-3">
            <h3 class="footer__widget-title">
              {{ $t("footer.widget-title-1") }}
            </h3>
            <ul class="footer__links">
              <li class="footer__link">
               <app-link path="/#about"> {{ $t("footer.about") }} </app-link>
              </li>
              <li class="footer__link">
                <app-link path="/"> {{ $t("footer.car") }} </app-link>
              </li>
              <li class="footer__link">
                <app-link path="/"> {{ $t("footer.features") }} </app-link>
              </li>
            </ul>
          </div> -->
          <div class="footer__widget-col col-lg-3 col-md-6">
            <h3 class="footer__widget-title">
              {{ $t("footer.widget-title-2") }}
            </h3>
            <ul class="footer__c-info">
              <li class="footer__c-info-item">
                <span class="icon">
                  <IconLocation />
                </span>
                <p class="label">Kaiser-Friedrich Str. 65 10627 Berlin</p>
              </li>
              <li class="footer__c-info-item">
                <span class="icon pe-3">

                </span>
                <p class="label ps-1">Schlossstraße 69, 12165 Berlin</p>
              </li>
              <li class="footer__c-info-item">
                <span class="icon">
                  <IconEnvelope />
                </span>
                <p class="label">info@roadstars-cars.de</p>
              </li>
              <li class="footer__c-info-item">
                <span class="icon">
                  <IconPhone />
                </span>
                <p class="label">030/91439989</p>
              </li>
            </ul>
          </div>
          <div class="footer__widget-col col-lg-3 col-md-3">
            <div class="footer__widget">
              <ul class="footer__social-links">
                <!-- <li class="footer__social-link">
                  <a href="http://facebook.com" target="_blank" rel="noopener noreferrer">
                    <span class="icon">
                      <IconFacebook />
                    </span>
                  </a>
                </li>
                <li class="footer__social-link">
                  <a href="http://facebook.com" target="_blank" rel="noopener noreferrer">
                    <span class="icon">
                      <IconTwitter />
                    </span>
                  </a>
                </li> -->
                <li class="footer__social-link">
                  <a href="https://www.instagram.com/roadstars.autovermietung/?igshid=YmMyMTA2M2Y" target="_blank"
                    rel="noopener noreferrer">
                    <span class="icon">
                      <IconInstagram />
                    </span>
                  </a>
                </li>
              </ul>
              <ul class="footer__links footer__widget-4">
                <li class="footer__link">
                  <app-link path="/impressum">
                    {{ $t("footer.legal") }}
                  </app-link>
                </li>
                <li class="footer__link">
                  <app-link path="/datenschutz">
                    {{ $t("footer.privecy") }}
                  </app-link>
                </li>
                <li class="footer__link">
                  <app-link path="/Terms">
                    {{ $t("footer.terms") }}
                  </app-link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-copyright">
      <p class="text">
        © Copyright reserved <span class="app-name">{{ appName }}</span>
      </p>
    </div>
  </footer>
</template>

<script>
import IconEnvelope from "../icons/IconEnvelope.vue"
import IconLocation from "../icons/IconLocation.vue"
import IconPhone from "../icons/IconPhone.vue"
// import IconFacebook from "../icons/IconFacebook.vue"
// import IconTwitter from "../icons/IconTwitter.vue"
import IconInstagram from "../icons/IconInstagram.vue"
export default {
  name: "Footer",
  components: {
    IconEnvelope,
    IconLocation,
    IconPhone,
    // IconFacebook,
    // IconTwitter,
    IconInstagram,
  },
  computed: {
    appName() {
      return process.env.VUE_APP_NAME
    },
  },
}
</script>

<style lang="scss" scoped>
.footer {
  background-color: var(--color-light-grey);

  &__widget-col {
    @include responsive-max("sm") {
      padding: 2rem 0;
      margin: 0 auto;
      width: 90%;

      &:not(:last-child) {
        border-bottom: 1px solid var(--color-light-grey);
      }
    }
  }

  &__widgets {
    padding: 4rem 0;

    @include responsive-max("md") {
      padding: 2.5rem 0;
    }

    @include responsive-max("sm") {
      padding: 1rem 0;
    }
  }

  &__widget {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 100%;
    width: 100%;

    @include responsive-max("sm") {
      align-items: flex-start;
    }
  }

  &__logo {
    width: 60%;
    margin: 0 auto;

    @include responsive-max("md") {
      width: 37%;
      margin: auto;
      padding-bottom: 3rem;
    }

    @include responsive-max("sm") {
      width: 70%;
      margin: auto;
      padding-bottom: 0;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  &__widget-title {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    font-weight: 500;
    text-transform: uppercase;
    color: var(--color-text);
  }

  &__link {
    &:not(:last-child) {
      margin-bottom: 1rem;
    }

    a {
      color: var(--color-text);
      text-decoration: underline;
      font-size: 1rem;
      text-transform: capitalize;
      transition: all 0.1s ease;
      font-weight: 400;

      &:hover {
        color: var(--color-dark);
      }
    }
  }

  &__c-info-item {
    display: flex;
    align-items: center;
    justify-content: flex-start;

    &:not(:last-child) {
      margin-bottom: 1rem;
    }

    .icon {
      margin-right: 1rem;
    }

    .label {
      margin-bottom: 0;
      font-size: 1rem;
      color: var(--color-text);
      font-weight: 400;
    }
  }

  &__social-links {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.5rem;

    .footer__social-link {
      margin-right: 1.2rem;

      svg {
        width: 18px;
        height: 18px;
      }
    }
  }

  &__widget-4 {
    display: flex;
    align-items: center;
    justify-content: center;

    .footer__link {
      margin-bottom: 0;

      &:not(:last-child) {
        margin-right: 1rem;
      }
    }
  }
}

.footer-copyright {
  padding: 1rem 0;
  text-align: center;
  background-color: var(--color-dark);
  color: var(--color-white);
  font-size: 0.875rem;
  font-weight: 400;

  .text {
    margin-bottom: 0;
  }

  .app-name {
    color: var(--color-primary);
    font-weight: 500;
  }
}
</style>
