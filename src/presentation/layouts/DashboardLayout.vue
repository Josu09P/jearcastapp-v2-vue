<template>
  <div class="container-fluid px-0 container-all">
    <HeaderTopWidget />
    <div class="row g-0">
      <div class="col-md-3 col-lg-2 d-none d-md-block">
        <HeaderLeftWidget />
      </div>
      <div id="main-content" class="col-12 col-md-9 col-lg-10 p-4">
        <main class="container-fluid">
          <slot />
        </main>
        <FooterDashboardWidget />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import HeaderTopWidget from '@/presentation/widgets/HeaderTopWidget.vue';
import HeaderLeftWidget from '@/presentation/widgets/HeaderLeftWidget.vue';
import FooterDashboardWidget from '@/presentation/widgets/FooterDashboardWidget.vue';
</script>

<style>
.container-all,
.row.g-0 {
  min-height: 100vh;
}

.container-all {
  background-color: var(--main-bg-color);
  background-image: url("@/assets/img/bg-hero.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}
</style>
