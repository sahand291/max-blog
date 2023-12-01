<template>
  <div>
    <TheHeader @sidenavToggle="displaySideNav = !displaySideNav"></TheHeader>
    <TheSideNav
      :show="displaySideNav"
      @close="displaySideNav = false"
    ></TheSideNav>

    <Nuxt />
  </div>
</template>

<script>
import TheHeader from "../components/navigation/TheHeader.vue";
import TheSideNav from "../components/navigation/TheSideNav.vue";

export default {
  components: { TheHeader, TheSideNav },
  middleware: "logs",

  data() {
    return {
      displaySideNav: false,
    };
  },
};
</script>
