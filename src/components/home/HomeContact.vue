<template>
  <section id="kontakt" class="contact-section">
    <div class="container">
      <SectionHeader :title="$t('home-contact.title')" :description="$t('home-contact.description')" :description-width="60" />
      <div class="hours">
        <p class="time">{{ $t("home-contact.hours-1") }}</p>
        <p class="time">{{ $t("home-contact.hours-2") }}</p>
      </div>

      <div class="row">
        <div class="col-md-12">
          <div class="row">
            <div class="col-md-6">
              <div class="contact-info__card">
                <div class="row">
                  <div class="col-md-6">
                    <div class="contact-info__card-contents w-100 d-flex flex-column align-items-center">
                      <div class="contact-info__card-icon">
                        <span class="icon"><svg width="24" height="32" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 0.166626C5.87251 0.166626 0.916672 5.12246 0.916672 11.25C0.916672 19.5625 12 31.8333 12 31.8333C12 31.8333 23.0833 19.5625 23.0833 11.25C23.0833 5.12246 18.1275 0.166626 12 0.166626ZM12 15.2083C9.81501 15.2083 8.04167 13.435 8.04167 11.25C8.04167 9.06496 9.81501 7.29163 12 7.29163C14.185 7.29163 15.9583 9.06496 15.9583 11.25C15.9583 13.435 14.185 15.2083 12 15.2083Z" />
                          </svg>
                        </span>
                      </div>
                      <p class="contact-info__card-desc">
                        Kaiser-Friedrich Str. 65 10627 Berlin
                      </p>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="contact-info__card-contents w-100 d-flex flex-column align-items-center">
                      <div class="contact-info__card-icon card-sp__icon">
                        <span class="icon"><svg width="24" height="32" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 0.166626C5.87251 0.166626 0.916672 5.12246 0.916672 11.25C0.916672 19.5625 12 31.8333 12 31.8333C12 31.8333 23.0833 19.5625 23.0833 11.25C23.0833 5.12246 18.1275 0.166626 12 0.166626ZM12 15.2083C9.81501 15.2083 8.04167 13.435 8.04167 11.25C8.04167 9.06496 9.81501 7.29163 12 7.29163C14.185 7.29163 15.9583 9.06496 15.9583 11.25C15.9583 13.435 14.185 15.2083 12 15.2083Z" />
                          </svg>
                        </span>
                      </div>
                      <p class="contact-info__card-desc">
                        Schlossstraße 69, 12165 Berlin
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="contact-info__card">
                <div class="row w-100">
                  <div class="col-md-6">
                    <div class="contact-info__card-contents w-100 d-flex flex-column align-items-center">
                      <div class="contact-info__card-icon">
                        <span class="icon"><svg width="24" height="36" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18.3333 0.583374H5.66667C3.03834 0.583374 0.916672 2.70504 0.916672 5.33337V30.6667C0.916672 33.295 3.03834 35.4167 5.66667 35.4167H18.3333C20.9617 35.4167 23.0833 33.295 23.0833 30.6667V5.33337C23.0833 2.70504 20.9617 0.583374 18.3333 0.583374ZM15.1667 32.25H8.83334V30.6667H15.1667V32.25ZM20.3125 27.5H3.68751V5.33337H20.3125V27.5Z" />
                          </svg>
                        </span>
                      </div>
                      <a :href="'tel:030/91439989'" class="contact-info__card-desc">030/91439989</a>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="contact-info__card-contents w-100 d-flex flex-column align-items-center">
                      <div class="contact-info__card-icon card-sp__icon">
                        <span class="icon"><svg width="32" height="26" viewBox="0 0 32 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M28.6667 0.333374H3.33332C1.59166 0.333374 0.18249 1.75837 0.18249 3.50004L0.166656 22.5C0.166656 24.2417 1.59166 25.6667 3.33332 25.6667H28.6667C30.4083 25.6667 31.8333 24.2417 31.8333 22.5V3.50004C31.8333 1.75837 30.4083 0.333374 28.6667 0.333374ZM28.6667 6.66671L16 14.5834L3.33332 6.66671V3.50004L16 11.4167L28.6667 3.50004V6.66671Z" />
                          </svg>
                        </span>
                      </div>
                      <a :href="'mailto:' + 'info@roadstars-cars.de'" class="contact-info__card-desc">info@roadstars-cars.de</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Contact Form -->
      <div class="row contact-form">
        <div class="col-md-6 mb-3">
          <ContactForm />
        </div>
        <!-- Google Map -->
        <div class="col-md-6 mb-3">
          <GoogleMap />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import ContactForm from "@/components/common/ContactForm"
import SectionHeader from "@/components/common/SectionHeader.vue"
import GoogleMap from "@/components/common/GoogleMap"
export default {
  name: "Contact",
  components: { GoogleMap, ContactForm, SectionHeader },
}
</script>

<style lang="scss" scoped>
.contact-section {
  margin-top: 2.5rem;
  margin-bottom: 2.5rem;
}

.contact-form {
  margin-top: 3rem;
}

.hours {
  text-align: center;
  margin-bottom: 2rem;

  p {
    margin-bottom: 0.25rem;
    font-weight: 500;
  }
}

@media only screen and (max-width: 576px) {
  .card-sp__icon{
    padding-top: 1.5rem;
  }
}
.contact-info__card {
  padding: 1rem;
  border-radius: 5px;
  background-color: var(--color-light-grey);
  text-align: center;
  min-height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: initial;

  @include responsive-max("sm") {
    margin-bottom: 1rem;
  }

  &-icon {
    margin-bottom: 1.5rem;

    svg {
      fill: var(--color-text);
    }
  }

  &-desc {
    font-weight: 500;
    color: var(--color-text);
    margin-bottom: 0;
    font-size: 1rem;
  }
}
</style>
