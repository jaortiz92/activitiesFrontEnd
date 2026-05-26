<template>
  <div class="dashboard-view">
    <div class="view-header">
      <div class="header-content">
        <div>
          <h1 class="view-title">Financial Dashboard</h1>
          <p class="view-subtitle">Comprehensive overview of your income and expenses.</p>
        </div>
        
        <div class="month-selector">
          <label for="base-month" class="selector-label">Base Period:</label>
          <input 
            type="month" 
            id="base-month" 
            v-model="selectedMonth" 
            @change="handleMonthChange"
            class="month-input"
          />
        </div>
      </div>
    </div>

    <div class="dashboard-content">
      <!-- High-level evolution chart -->
      <NetProfitEvolutionChart />

      <div class="charts-grid">
        <CategoryIncomeChart />
        <CategoryExpensesChart />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useDashboardStore } from '@/stores/dashboardStore';
import CategoryExpensesChart from '@/components/CategoryExpensesChart.vue';
import CategoryIncomeChart from '@/components/CategoryIncomeChart.vue';
import NetProfitEvolutionChart from '@/components/NetProfitEvolutionChart.vue';

const store = useDashboardStore();

// Initialize selectedMonth with current month in YYYY-MM format
const now = new Date();
const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
const selectedMonth = ref(currentMonthStr);

const handleMonthChange = () => {
  store.setBaseDate(selectedMonth.value);
  store.fetchAllDashboardData();
};

onMounted(() => {
  // Use the default or already set baseDate in the store
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

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 2rem;
  flex-wrap: wrap;
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

.month-selector {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.selector-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.month-input {
  padding: 0.625rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1e293b;
  background-color: white;
  outline: none;
  transition: all 0.2s ease;
  cursor: pointer;
}

.month-input:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
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

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
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
