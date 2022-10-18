


<script setup>

import PageHeader from "../components/common/PageHeader.vue"
import { useI18n } from 'vue-i18n'
import ContactForm from "../components/common/ContactForm.vue"
import GoogleMap from "../components/common/GoogleMap.vue"
const { t } = useI18n({ useScope: 'global' })

</script>

<template>
    <div class="container">
        <page-header :title="t('privacy.title')" />
        <p>{{t('privacy.paragraph-1')}}</p>
        <p>{{t('privacy.paragraph-2')}}</p>
        <p>{{t('privacy.paragraph-3')}}</p>
        <p>
            <span>{{t('privacy.paragraph-4.name')}}</span>
            <span>{{t('privacy.paragraph-4.road')}}</span>
            <span>{{t('privacy.paragraph-4.city')}}</span>
            <span>{{t('privacy.paragraph-4.state')}}</span>
        </p>
        <p>{{t('privacy.paragraph-5')}}</p>
        <p>{{t('privacy.paragraph-6')}}</p>
        <p>{{t('privacy.paragraph-7')}}</p>
        <p>{{t('privacy.paragraph-8')}}</p>
        <p>{{t('privacy.paragraph-9.text')}} <a class="text-primary" :href="t('privacy.paragraph-9.link')" target="_blank"
                rel="noopener noreferrer">{{t('privacy.paragraph-9.link-text')}}</a></p>
        <p>{{t('privacy.paragraph-10')}}</p>
        <p>{{t('privacy.paragraph-11')}}</p>
        <p>{{t('privacy.paragraph-12')}}</p>
        <p>{{t('privacy.paragraph-13')}}</p>
        <p>{{t('privacy.paragraph-14')}}</p>
        <p>{{t('privacy.paragraph-15')}}</p>


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