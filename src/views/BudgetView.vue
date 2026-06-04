<template>
  <div class="budget-view">
    <div class="view-header">
      <div class="header-content">
        <div>
          <h1 class="view-title">Budget vs Execution</h1>
          <p class="view-subtitle">Compare your planned budget against actual monthly spending.</p>
        </div>
        
        <div class="month-selector">
          <label for="base-month" class="selector-label">Analysis Period:</label>
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

    <div class="budget-content">
      <div v-if="store.loading" class="loading-state">
        <div class="spinner"></div>
        <span>Loading budget data...</span>
      </div>
      
      <div v-else-if="store.error" class="error-state">
        {{ store.error }}
      </div>

      <BudgetExecutionTracker v-else />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useBudgetStore } from '@/stores/budgetStore';
import BudgetExecutionTracker from '@/components/BudgetExecutionTracker.vue';

const store = useBudgetStore();

// Initialize selectedMonth with current month in YYYY-MM format
const now = new Date();
const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
const selectedMonth = ref(currentMonthStr);

const handleMonthChange = () => {
  const [year, month] = selectedMonth.value.split('-').map(Number);
  store.setPeriod(month, year);
  store.fetchComparison();
};

onMounted(() => {
  const [year, month] = selectedMonth.value.split('-').map(Number);
  store.setPeriod(month, year);
  store.fetchComparison();
});
</script>

<style scoped>
.budget-view {
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
  font-size: 2.25rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.025em;
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

.budget-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.loading-state, .error-state {
  text-align: center;
  padding: 5rem 2rem;
  font-size: 1.125rem;
  color: #64748b;
  background-color: white;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.error-state {
  color: #ef4444;
  border-color: #fca5a5;
  background-color: #fef2f2;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4f46e5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }
}

@media (max-width: 640px) {
  .budget-view {
    padding: 1.25rem;
  }
  
  .view-title {
    font-size: 1.75rem;
  }
}
</style>
