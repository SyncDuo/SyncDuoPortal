<template>
  <a-layout class="outer-layout">
    <!-- Header -->
    <a-layout-header class="header">
      <Header />
    </a-layout-header>

    <!-- Main Content Area -->
    <a-layout>
      <a-layout-content class="content">
        <!-- First Content Section -->
        <div class="content-section">
          <Syncflow />
        </div>

        <!-- Divider -->
        <a-divider class="divider" type="vertical" />

        <!-- Second Content Section -->
        <div class="content-section">
          <System />
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import Header from './Header.vue';
import Syncflow from './SyncFlow.vue';
import System from './System.vue';
</script>

<style scoped>

.header {
  background-color: #f6f6f6;
  padding: 0 20px; /* Adjust the padding for proper spacing */
  display: flex;   /* Ensure the header uses flexbox */
  justify-content: space-between; /* Space out items in the header */
  align-items: center; /* Vertically center content */
  height: auto; /* Allow the height to adjust based on content */
  flex-wrap: wrap; /* Allow wrapping for smaller screens */
}

.content {
  display: flex;
  padding: 16px;
  background: white;
}

.content-section {
  flex: 1;
  padding: 16px;
  background: #fefefe;
  border-radius: 4px;
}

.divider {
  width: 0;
  height: auto !important;
  margin: 0 16px;
  color: white;
}
</style>
