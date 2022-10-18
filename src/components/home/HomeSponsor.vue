<template>
  <div id="sponsor" class="sponsor-section">
    <div class="container">
      <SectionHeader :subtitle="$t('home-sponsor.sub-title')" />
      <div class="row">
        <div class="col-md-5"></div>
        <div class="col-md-2">
          <div class="sponsor-item">
            <img src="@/assets/images/sponsors/sponsor.png" alt="" />
          </div>
        </div>
        <div class="col-md-5"></div>
      </div>
    </div>
  </div>
</template>

<script>
import SectionHeader from "../common/SectionHeader.vue"
export default {
  name: "HomeSponsor",
  components: {
    SectionHeader,
  },
}
</script>

<style lang="scss" scoped>
.sponsor-section {
  margin-bottom: 3.5rem;
  background-color: var(--color-light-grey);
  padding: 2.6rem 0;
}

.sponsor-item {
  display: flex;
  align-items: center;
  justify-content: center;
  grid-gap: 1rem;
  margin-bottom: 0.75rem;

  img {
    width: 196px;
    height: 98px;

    @include responsive-max("sm") {
      width: 90%;
      margin: 0 auto;
    }
  }
}
</style>
