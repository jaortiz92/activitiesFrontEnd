<template>
  <div class="budget-tracker">
    <!-- Top Summary Cards -->
    <div class="summary-cards" v-if="comparisonData.length">
      <div class="summary-card">
        <div class="card-icon bg-blue">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </div>
        <div class="card-info">
          <span class="card-label">Total Budget</span>
          <span class="card-value">{{ formatCurrency(totalBudget) }}</span>
        </div>
      </div>

      <div class="summary-card">
        <div class="card-icon bg-amber">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20M4 19.5V3.5A2.5 2.5 0 0 1 6.5 1H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5z"/></svg>
        </div>
        <div class="card-info">
          <span class="card-label">Total Executed</span>
          <span class="card-value">{{ formatCurrency(totalExecuted) }}</span>
        </div>
      </div>

      <div class="summary-card">
        <div :class="['card-icon', totalVariance >= 0 ? 'bg-green' : 'bg-red']">
          <svg v-if="totalVariance >= 0" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </div>
        <div class="card-info">
          <span class="card-label">{{ totalVariance >= 0 ? 'Total Saved' : 'Total Exceeded' }}</span>
          <span :class="['card-value', totalVariance >= 0 ? 'text-green' : 'text-red']">
            {{ formatCurrency(Math.abs(totalVariance)) }}
          </span>
        </div>
      </div>

      <div class="summary-card">
        <div class="card-icon bg-indigo">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
        </div>
        <div class="card-info">
          <span class="card-label">Usage Rate</span>
          <span class="card-value">{{ usageRate.toFixed(1) }}%</span>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="comparisonData.length === 0" class="empty-state-card">
      <div class="empty-icon">📂</div>
      <h3>No budget metrics available</h3>
      <p>There are no budget goals configured for this period or year. Please check your system configuration.</p>
    </div>

    <!-- Budget Goal Cards List -->
    <div v-else class="budget-items-grid">
      <div v-for="item in comparisonData" :key="item.group_name" class="budget-item-card">
        <div class="item-header">
          <h3 class="item-title">{{ item.group_name }}</h3>
          <span :class="['badge', getStatusClass(item)]">
            {{ getStatusText(item) }}
          </span>
        </div>

        <div class="item-metrics">
          <div class="metric">
            <span class="metric-label">Spent</span>
            <span class="metric-value font-mono">{{ formatCurrency(item.executed_amount) }}</span>
          </div>
          <div class="metric text-right">
            <span class="metric-label">Budget</span>
            <span class="metric-value font-mono">{{ formatCurrency(item.budget_amount) }}</span>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="progress-bar-container">
          <div 
            :class="['progress-bar-fill', getProgressBarClass(item)]" 
            :style="{ width: `${Math.min(getPercentage(item), 100)}%` }"
          ></div>
        </div>

        <div class="item-footer">
          <span class="percentage-label">{{ getPercentage(item).toFixed(0) }}% Consumed</span>
          <span :class="['variance-label', item.variance >= 0 ? 'text-green' : 'text-red']">
            {{ item.variance >= 0 ? 'Remaining:' : 'Over budget:' }} 
            <strong class="font-mono">{{ formatCurrency(Math.abs(item.variance)) }}</strong>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useBudgetStore } from '@/stores/budgetStore';
import { formatters } from '@/plugins/formatters.js';

const store = useBudgetStore();

const comparisonData = computed(() => store.comparisonData);

const totalBudget = computed(() => {
  return comparisonData.value.reduce((acc, item) => acc + item.budget_amount, 0);
});

const totalExecuted = computed(() => {
  return comparisonData.value.reduce((acc, item) => acc + item.executed_amount, 0);
});

const totalVariance = computed(() => {
  return totalBudget.value - totalExecuted.value;
});

const usageRate = computed(() => {
  if (totalBudget.value === 0) return 0;
  return (totalExecuted.value / totalBudget.value) * 100;
});

const formatCurrency = (val) => {
  return '$' + formatters.formatterGeneralNumber(val);
};

const getPercentage = (item) => {
  if (item.budget_amount === 0) return 0;
  return (item.executed_amount / item.budget_amount) * 100;
};

const getStatusText = (item) => {
  const pct = getPercentage(item);
  if (pct > 100) return 'Exceeded';
  if (pct >= 85) return 'Warning';
  return 'On Track';
};

const getStatusClass = (item) => {
  const pct = getPercentage(item);
  if (pct > 100) return 'badge-red';
  if (pct >= 85) return 'badge-amber';
  return 'badge-green';
};

const getProgressBarClass = (item) => {
  const pct = getPercentage(item);
  if (pct > 100) return 'bar-red';
  if (pct >= 85) return 'bar-amber';
  return 'bar-green';
};
</script>

<style scoped>
.budget-tracker {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Summary Cards styles */
.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.summary-card {
  background-color: white;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  border: 1px solid var(--light-border, #e2e8f0);
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 12px -4px rgba(0, 0, 0, 0.08);
}

.card-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-icon svg {
  width: 20px;
  height: 20px;
}

.bg-blue { background-color: rgba(59, 130, 246, 0.1); color: #2563eb; }
.bg-amber { background-color: rgba(245, 158, 11, 0.1); color: #d97706; }
.bg-green { background-color: rgba(16, 185, 129, 0.1); color: #059669; }
.bg-red { background-color: rgba(239, 68, 68, 0.1); color: #dc2626; }
.bg-indigo { background-color: rgba(99, 102, 241, 0.1); color: #4f46e5; }

.card-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.card-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.card-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
}

/* Colors for summary card values */
.text-green { color: #10b981; }
.text-red { color: #ef4444; }

/* Empty state styling */
.empty-state-card {
  background-color: white;
  border-radius: 14px;
  border: 1px dashed #cbd5e1;
  padding: 3rem 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.empty-icon {
  font-size: 3rem;
}

.empty-state-card h3 {
  font-size: 1.25rem;
  color: #1e293b;
  margin: 0;
  font-weight: 700;
}

.empty-state-card p {
  font-size: 0.9375rem;
  color: #64748b;
  margin: 0;
  max-width: 400px;
}

/* Budget Cards Grid styles */
.budget-items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.budget-item-card {
  background-color: white;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid var(--light-border, #e2e8f0);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.budget-item-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.08);
  border-color: #cbd5e1;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.item-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Badges */
.badge {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  flex-shrink: 0;
}

.badge-green { background-color: #ecfdf5; color: #065f46; }
.badge-amber { background-color: #fffbeb; color: #92400e; }
.badge-red { background-color: #fef2f2; color: #991b1b; }

/* Item Metrics */
.item-metrics {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  align-items: baseline;
}

.metric {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.metric-label {
  font-size: 0.65rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
}

.metric-value {
  font-size: 1rem;
  font-weight: 700;
  color: #334155;
}

.font-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.text-right {
  text-align: right;
}

/* Progress bar styles */
.progress-bar-container {
  height: 6px;
  background-color: #f1f5f9;
  border-radius: 9999px;
  overflow: hidden;
  width: 100%;
}

.progress-bar-fill {
  height: 100%;
  border-radius: 9999px;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.bar-green { background-color: #10b981; }
.bar-amber { background-color: #f59e0b; }
.bar-red { background-color: #ef4444; }

/* Item Footer */
.item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: #64748b;
  border-top: 1px solid #f1f5f9;
  padding-top: 0.5rem;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.percentage-label {
  font-weight: 600;
}

.variance-label {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
</style>
