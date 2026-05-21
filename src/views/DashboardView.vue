<template>
  <div class="dashboard-view">
    <div class="view-header">
      <h1 class="view-title">Financial Dashboard</h1>
      <p class="view-subtitle">Comprehensive overview of your income and expenses.</p>
    </div>

    <div class="dashboard-content">
      <div class="charts-grid">
        <CategoryIncomeChart />
        <CategoryExpensesChart />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useDashboardStore } from '@/stores/dashboardStore';
import CategoryExpensesChart from '@/components/CategoryExpensesChart.vue';
import CategoryIncomeChart from '@/components/CategoryIncomeChart.vue';

const store = useDashboardStore();

onMounted(() => {
  store.fetchAllDashboardData();
});
</script>

<style scoped>
.dashboard-view {
  padding: 2rem;
  max-width: 1400px;
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

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 2rem;
  align-items: start;
}

@media (max-width: 1100px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
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
