<script setup>

import PageHeader from "../components/common/PageHeader.vue"
import { useI18n } from 'vue-i18n'
import ContactForm from "../components/common/ContactForm.vue"
import GoogleMap from "../components/common/GoogleMap.vue"
const { t } = useI18n({ useScope: 'global' })

</script>


<template>
    <div class="container">
        <page-header :title="t('legal.title')" />
        <p>Roadstars GmbH</p>
        <p>
            <span>Kaiser-Friedrich-Straße 65</span>
            <span>10627 Berlin</span>
        </p>
        <p>
            <span>Tel.-Nr.: +49 173 6945581</span>
            <span>E-Mail: info@roadstars-cars.de</span>
        </p>
        <p>USt-IdNr.: 27/495/50171</p>


        <hr class="h-line" />
        <!-- Contact Form -->
        <div class="row contact-form">

            <div class="col-md-6">
                <ContactForm />
            </div>
            <!-- Google Map -->
            <div class="col-md-6">
                <google-map />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
p {
    font-size: 20px;
    color: #4F4444;

    span {
        display: block;
    }
}

.h-line {
    margin: 3.5rem 0 !important;
}

.contact-form {
    margin-bottom: 48px;
}
</style>