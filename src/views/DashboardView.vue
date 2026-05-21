<template>
  <div class="dashboard-view">
    <div class="view-header">
      <h1 class="view-title">Financial Dashboard</h1>
      <p class="view-subtitle">Overview of your expenses and cost categories.</p>
    </div>

    <div class="dashboard-content">
      <CategoryExpensesChart />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useDashboardStore } from '@/stores/dashboardStore';
import CategoryExpensesChart from '@/components/CategoryExpensesChart.vue';

const store = useDashboardStore();

onMounted(() => {
  store.fetchAllDashboardData();
});
</script>

<style scoped>
.dashboard-view {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.view-header {
  margin-bottom: 2.5rem;
}

.view-title {
  font-size: 2rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

.view-subtitle {
  font-size: 1rem;
  color: #64748b;
  margin: 0;
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

@media (max-width: 640px) {
  .dashboard-view {
    padding: 1rem;
  }
  
  .view-title {
    font-size: 1.5rem;
  }
}
</style>
