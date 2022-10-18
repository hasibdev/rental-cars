<template>
  <section id="fahrzeuge" class="cars">
    <div class="container">
      <!-- header -->
      <SectionHeader :subtitle="t('home-cars.sub-title')" :title="t('home-cars.title')"
        :description="t('home-cars.description')" />

      <!-- filter navs -->
      <div class="filter-nav">
        <button v-for="category in categories" :key="category.id"
          :class="{ active: currentFilter === category.categoryName }" class="filter-nav__btn"
          @click="setFilter(category.categoryName)">
          {{ locale === 'de' ? category.labelDe : category.label }}
        </button>
      </div>

      <!-- car first row -->
      <div class="filters row">
        <transition-group name="filters">
          <template v-for="(car, idx) in filtersCars(currentFilter)" :key="car.id">
            <div class="filters__car-item" :class="idx < 3 ? 'col-sm-4' : 'col-sm-3'">
              <div class="filters__car-content">
                <!-- <img :src="require(`@/assets/images/cars/${car.image}`)" alt="car img" /> -->
                <div class="car-content-img"
                  :style="{ 'backgroundImage': `url(${require(`../../assets/images/cars/${car.image}`)})` }"></div>
                <div class="overlay">
                  <div class="overlay__contents">
                    <h6 class="overlay__title">{{ car.name }}</h6>
                    <p class="overlay__desc">{{ car.brand }}</p>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </transition-group>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import SectionHeader from "@/components/common/SectionHeader.vue"
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const currentFilter = ref('small-cars')
const categories = ref([
  {
    id: 1,
    label: "Small cars",
    labelDe: "Kleinwagen",
    categoryName: "small-cars",
  },
  {
    id: 22,
    label: "Compact cars",
    labelDe: "Kompaktklasse",
    categoryName: "compact-cars",
  },
  {
    id: 34,
    label: "SUV",
    labelDe: "SUV",
    categoryName: "suv",
  },
  {
    id: 84,
    label: "Middle class",
    labelDe: "Mittelklasse",
    categoryName: "middle-class",
  },
  {
    id: 54,
    label: "Upper class",
    labelDe: "Oberklasse",
    categoryName: "upper-class",
  },
])

// const cars = ref([
//   {
//     id: 2,
//     image: "upper-1.png",
//     name: "A7",
//     brand: "Audi",
//     category: "upper-class",
//   },
//   {
//     id: 3,
//     image: "small-2.png",
//     name: "Polo",
//     brand: "Volkswagen",
//     category: "small-cars",
//   },
//   {
//     id: 4,
//     image: "middle-1.png",
//     name: "A4",
//     brand: "Audi",
//     category: "middle-class",
//   },
//   {
//     id: 7,
//     image: "middle-4.png",
//     name: "A5",
//     brand: "Audi",
//     category: "middle-class",
//   },
//   {
//     id: 9,
//     image: "middle-6.png",
//     name: "A6",
//     brand: "Audi",
//     category: "middle-class",
//   },
//   {
//     id: 11,
//     image: "compact-2.png",
//     name: "A Klasse",
//     brand: "Mercedes",
//     category: "compact-cars",
//   },
//   {
//     id: 12,
//     image: "compact-3.png",
//     name: "Golf 8",
//     brand: "Volkswagen",
//     category: "compact-cars",
//   },
//   {
//     id: 13,
//     image: "compact-4.png",
//     name: "A3",
//     brand: "Audi",
//     category: "compact-cars",
//   },
//   {
//     id: 16,
//     image: "suv-1.png",
//     name: "Q5",
//     brand: "audi",
//     category: "suv",
//   },
// ])

const cars = ref([
  {
    id: 2,
    image: "upper-1.webp",
    name: "A7",
    brand: "Audi",
    category: "upper-class",
  },
  {
    id: 3,
    image: "small-2.png",
    name: "Polo",
    brand: "Volkswagen",
    category: "small-cars",
  },
  {
    id: 4,
    image: "middle-1.webp",
    name: "A4",
    brand: "Audi",
    category: "middle-class",
  },
  {
    id: 7,
    image: "middle-4.webp",
    name: "A5",
    brand: "Audi",
    category: "middle-class",
  },
  {
    id: 9,
    image: "middle-6.webp",
    name: "A6",
    brand: "Audi",
    category: "middle-class",
  },
  {
    id: 11,
    image: "compact-2.webp",
    name: "A Klasse",
    brand: "Mercedes",
    category: "compact-cars",
  },
  {
    id: 12,
    image: "compact-3.webp",
    name: "Golf 8",
    brand: "Volkswagen",
    category: "compact-cars",
  },
  {
    id: 13,
    image: "compact-4.webp",
    name: "A3",
    brand: "Audi",
    category: "compact-cars",
  },
  {
    id: 16,
    image: "suv-1.webp",
    name: "Q5",
    brand: "audi",
    category: "suv",
  },
])


function setFilter(filter) {
  currentFilter.value = filter
}

function filtersCars(category) {
  return category !== "all"
    ? cars.value.filter((_) => _.category === category)
    : cars.value
}
</script>

<style lang="scss" scoped>
.cars {
  text-align: center;
  padding-top: 2.6rem;
  margin-bottom: 2.75rem;
}

.filter-nav {
  margin-bottom: 2rem;

  &__btn {
    border: none;
    outline: none;
    background-color: var(--color-light-grey);
    padding: 0.3rem 0.75rem;
    font-size: 0.875rem;
    font-weight: 500;
    border-radius: 4px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    transition: background-color 0.3s ease-out;
    margin: 0.5rem;

    &:hover,
    &.active {
      background-color: var(--color-dark);
      color: var(--color-white);
    }
  }
}

/* filter css */
.filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  &-enter {
    transform: scale(0.5);
    opacity: 0;
  }

  &-leave-to {
    transform: translatey(3px);
    opacity: 0;
  }

  &-leave-active {
    position: absolute;
    z-index: -1;
  }

  &__car-item {
    transition: all 0.5s ease;
    overflow: hidden;

  }

  &__car-content {
    position: relative;
    cursor: pointer;
    width: 100%;
    height: 250px;
    overflow: hidden;
    margin-bottom: 1.5rem;
    border-radius: 10px;

    .car-content-img {
      width: 100%;
      height: 100%;
      background-repeat: no-repeat;
      background-size: cover;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .overlay {
      position: absolute;
      bottom: 0;
      background: linear-gradient(180deg,
          rgba(232, 232, 232, 0.2) 5%,
          rgba(0, 0, 0, 0.6) 76%);
      width: 100%;
      height: 100%;
      transition: opacity 0.5s ease;
      opacity: 0;
      display: flex;
      align-items: flex-end;

      &__contents {
        color: var(--color-white);
        text-align: left;
        padding: 0.75rem;
      }

      &__title {
        font-size: 1.2rem;
        font-weight: 500;
        line-height: 1.2;
        margin-bottom: 0.2rem;
        text-transform: capitalize;
      }

      &__desc {
        font-size: 1rem;
        font-weight: 400;
        margin-bottom: 0;
        text-transform: capitalize;
      }
    }

    &:hover {
      .overlay {
        opacity: 1;
      }
    }
  }
}
</style>