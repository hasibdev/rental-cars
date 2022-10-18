<script setup>
import { useI18n } from 'vue-i18n'
import ContactForm from "../components/common/ContactForm.vue"
import GoogleMap from "../components/common/GoogleMap.vue"
const { t } = useI18n({ useScope: 'global' })
</script>

<template>
  <div class="container my-5">
    <h3 class="terms-title">{{t('terms.title')}}</h3>
    <p class="mb-3">{{$t('terms.text-p1')}}</p>
    <p>{{t('terms.text-p2')}}</p>
    <p>{{t('terms.text-p3')}}</p>
    <p>{{t('terms.text-p4')}}</p>
    <p>{{t('terms.text-p5')}}</p>
    <p>{{t('terms.text-p6')}}</p>
    <p>{{t('terms.text-p7')}}</p>
    <p>{{t('terms.text-p8')}}</p>
    <p>{{t('terms.text-p9')}}</p>
    <p>{{t('terms.text-p10')}}</p>
    <p class="mt-3">{{t('terms.text-p11')}}</p>
    <p>{{t('terms.text-p12')}}</p>
    <p class="mt-3">{{t('terms.text-p13')}}</p>
    <p>{{t('terms.text-p14')}}</p>
    <p class="mt-3">{{t('terms.text-p15')}}</p>
    <p>{{t('terms.text-p16')}}</p>
    <p>{{t('terms.text-p17')}}</p>
    <p>{{t('terms.text-p18')}}</p>

    <p class="mt-3">{{t('terms.text-p19')}}</p>
    <p>{{t('terms.text-p20')}}</p>
    <p>{{t('terms.text-p21')}}</p>
    <p>{{t('terms.text-p22')}}</p>

    <p class="mt-3">{{t('terms.text-p23')}}</p>
    <div class="sub-content">
      <p class=""><span class="icon-box"><span class="custom-dot__icon"></span></span>{{t('terms.text-p24.p1')}}</p>
      <p class=""><span class="icon-box"><span class="custom-dot__icon"></span></span>{{t('terms.text-p24.p2')}}</p>
      <p class=""><span class="icon-box"><span class="custom-dot__icon"></span></span>{{t('terms.text-p24.p3')}}</p>
      <p class=""><span class="icon-box"><span class="custom-dot__icon"></span></span>{{t('terms.text-p24.p4')}}</p>
      <p class=""><span class="icon-box"><span class="custom-dot__icon"></span></span>{{t('terms.text-p24.p5')}}</p>
      <p class=""><span class="icon-box"><span class="custom-dot__icon"></span></span>{{t('terms.text-p24.p6')}}</p>
      <p class=""><span class="icon-box"><span class="custom-dot__icon"></span></span>{{t('terms.text-p24.p7')}}</p>
      <p class=""><span class="icon-box"><span class="custom-dot__icon"></span></span>{{t('terms.text-p24.p8')}}</p>
    </div>

    <p class="mt-3">{{t('terms.text-p25')}}</p>
    <div class="sub-content">
      <p class=""><span class="icon-box"><span class="custom-dot__icon"></span></span>{{t('terms.text-p26.p1')}}</p>
      <p class=""><span class="icon-box"><span class="custom-dot__icon"></span></span>{{t('terms.text-p26.p2')}}</p>
      <p class=""><span class="icon-box"><span class="custom-dot__icon"></span></span>{{t('terms.text-p26.p3')}}</p>
      <p class=""><span class="icon-box"><span class="custom-dot__icon"></span></span>{{t('terms.text-p26.p4')}}</p>
    </div>
    <p class="mt-3">{{t('terms.text-p27')}}</p>

    <p class="mt-3">{{t('terms.text-p28')}}</p>
    <p>{{t('terms.text-p29')}}</p>

    <p class="mt-3">{{t('terms.text-p30')}}</p>
    <p>{{t('terms.text-p31')}}</p>

    <p class="mt-3">{{t('terms.text-p32')}}</p>
    <p>{{t('terms.text-p33')}}</p>

    <p class="mt-3">{{t('terms.text-p34')}}</p>
    <p>{{t('terms.text-p35')}}</p>
    <p>{{t('terms.text-p36')}}</p>

    <p class="mt-3">{{t('terms.text-p37')}}</p>
    <p>{{t('terms.text-p38')}}</p>
    <p>{{t('terms.text-p39')}}</p>

    <!-- Contact Form & Google Map -->
    <div class="contact-section">
      <div class="row">
        <div class="col-md-6">
          <ContactForm />
        </div>

        <div class="col-md-6">
          <GoogleMap />
        </div>
      </div>
    </div>

  </div>
</template>

<style lang="scss" scoped>
.terms-title {
  font-weight: 700;
  font-size: 40px;
  margin-bottom: 45px;
  @include responsive-max("md") {
    font-size: 30px;
  }
}
p {
  font-size: 20px;
  font-weight: 400;
  color: #4f4444;
  margin: 0;
  padding: 0;
  @include responsive-max("md") {
    font-size: 18px;
  }
}
.sub-content p {
  display: flex;
  // flex-wrap: wrap;
  gap: 1rem;
  margin-left: 1rem;
}
.icon-box {
  display: flex;
  align-items: center;
  height: 30px;
  @include responsive-max("md") {
    height: 25px;
  }
}
.custom-dot__icon {
  width: 5px;
  height: 5px;
  background-color: #4f4444;
  border-radius: 50%;
}
.contact-section{
  border-top: 1px solid #000000;
  padding-top: 40px;
  padding-bottom: 40px;
  margin-top: 60px; 
}
</style>