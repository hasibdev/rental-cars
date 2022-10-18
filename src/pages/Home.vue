<template>

  <HomeHero />
  <HomeAbout />
  <HomeCars />
  <HomeSponsor />
  <HomeFeatures />
  <HomeContact />

</template>

<script>
import HomeHero from "../components/home/HomeHero.vue"
import HomeAbout from "../components/home/HomeAbout.vue"
import HomeCars from "../components/home/HomeCars.vue"
import HomeFeatures from "../components/home/HomeFeatures.vue"
import HomeContact from "../components/home/HomeContact.vue"
import HomeSponsor from "../components/home/HomeSponsor.vue"

export default {
  components: {
    HomeHero,
    HomeAbout,
    HomeCars,
    HomeFeatures,
    HomeContact,
    HomeSponsor,
  },
  name: "Home",
}
</script>
