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
        Loading budget data...
      </div>
      
      <div v-else-if="store.error" class="error-state">
        {{ store.error }}
      </div>

      <div v-else class="table-container">
        <table class="budget-table">
          <thead>
            <tr>
              <th>Budget Group</th>
              <th>Planned Budget (Year)</th>
              <th>Actual Execution (Month)</th>
              <th>Variance</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in store.comparisonData" :key="item.group_name">
              <td class="group-name">{{ item.group_name }}</td>
              <td class="amount">${{ formatNumber(item.budget_amount) }}</td>
              <td class="amount">${{ formatNumber(item.executed_amount) }}</td>
              <td :class="['variance', item.variance >= 0 ? 'positive' : 'negative']">
                ${{ formatNumber(item.variance) }}
              </td>
            </tr>
            <tr v-if="store.comparisonData.length === 0">
              <td colspan="4" class="empty-state">No budget data available for this period.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useBudgetStore } from '@/stores/budgetStore';

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

const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US').format(num);
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

.budget-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.table-container {
  background-color: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.budget-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.budget-table th {
  background-color: #f8fafc;
  padding: 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  border-bottom: 1px solid #e2e8f0;
}

.budget-table td {
  padding: 1rem;
  font-size: 0.9375rem;
  color: #1e293b;
  border-bottom: 1px solid #f1f5f9;
}

.group-name {
  font-weight: 600;
}

.amount {
  font-family: 'Courier New', Courier, monospace;
}

.variance {
  font-weight: 700;
}

.variance.positive {
  color: #10b981;
}

.variance.negative {
  color: #ef4444;
}

.empty-state {
  text-align: center;
  color: #94a3b8;
  padding: 3rem !important;
}

.loading-state, .error-state {
  text-align: center;
  padding: 3rem;
  font-size: 1.125rem;
  color: #64748b;
}

.error-state {
  color: #ef4444;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }
  
  .budget-table {
    display: block;
    overflow-x: auto;
  }
}
</style>
