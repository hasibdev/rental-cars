<template>
  <div class="">
    <iframe class="g_map"
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27472.445908199952!2d13.269396930885497!3d52.51092139717725!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a850df21e41ac5%3A0xf8416a13144f1fb4!2sKaiser-Friedrich-Stra%C3%9Fe%2065%2C%2010627%20Berlin%2C%20Germany!5e0!3m2!1sen!2sbd!4v1644246620999!5m2!1sen!2sbd"
      style="border: 0" allowfullscreen="" loading="lazy"></iframe>

    <!-- <GMapMap
      :center="center"
      :zoom="7"
      map-type-id="terrain"
      style="width: 100%; height: 425px"
      :options="{
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true,
        disableDefaultUi: false
      }"
    >
      <GMapMarker
        :key="marker.id"
        v-for="marker in markers"
        :position="marker.position"
      />
    </GMapMap> -->
  </div>
</template>

<script>
export default {
  name: 'GoogleMap',
  data() {
    return {
      // center: { lat: 52.508987374773895, lng: 13.302335957527733 },
      // markers: [
      //   {
      //     id: 'Kaiser-Friedrich-Straße',
      //     position: {
      //       lat: 51.093048, lng: 13.302335957527733
      //     },
      //   },
      //   {
      //     id: 'Schloßstraße 69',
      //     position: {
      //       lat: 52.45358795282684, lng: 13.317940253583973
      //     },
      //   }
      // ]
    }
  }
}
</script>

<style scoped>
.g_map {
  width: 100%;
  height: 26.375rem;
  border-radius: 0.25rem;
}

@media (max-width: 768px) {
  .g_map {
    width: 100%;
    height: 26.375rem;
    border-radius: 0.25rem;
  }
}

@media (max-width: 767px) {
  .g_map {
    margin-top: 2rem;
  }
}

@media (max-width: 576px) {
  .g_map {
    width: 100%;
    margin: 0 auto;
    height: 20.625rem;
    padding-top: 2rem;
  }
}
</style>
