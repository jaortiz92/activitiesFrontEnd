<template>
  <div class="budget-performance">
    <!-- Summary Header (Enhanced) -->
    <div class="summary-strip" v-if="comparisonData.length">
      <div class="summary-item">
        <div class="summary-icon bg-blue">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </div>
        <div class="summary-content">
          <span class="label">Total Budget</span>
          <span class="value font-mono">${{ formatCurrency(totalBudget) }}</span>
        </div>
      </div>
      <div class="summary-item">
        <div class="summary-icon bg-amber">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20M4 19.5V3.5A2.5 2.5 0 0 1 6.5 1H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5z"/></svg>
        </div>
        <div class="summary-content">
          <span class="label">Total Executed</span>
          <span class="value font-mono">${{ formatCurrency(totalExecuted) }}</span>
        </div>
      </div>
      <div class="summary-item">
        <div :class="['summary-icon', totalVariance >= 0 ? 'bg-green' : 'bg-red']">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
        </div>
        <div class="summary-content">
          <span class="label">Total Variance</span>
          <span :class="['value font-mono', totalVariance >= 0 ? 'text-green' : 'text-red']">
            {{ totalVariance >= 0 ? '+' : '' }}${{ formatCurrency(totalVariance) }}
          </span>
        </div>
      </div>
      <div class="summary-item">
        <div :class="['summary-icon', getUsageColorClass()]">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
        </div>
        <div class="summary-content">
          <span class="label">Overall Usage</span>
          <span :class="['value font-mono', getUsageTextColorClass()]">{{ usageRate.toFixed(1) }}%</span>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="comparisonData.length === 0" class="empty-state">
      <div class="empty-icon">📂</div>
      <p>No budget data available for the selected period.</p>
    </div>

    <!-- Performance List -->
    <div v-else class="performance-list">
      <div class="list-header">
        <span class="header-col name">Budget Group</span>
        <span class="header-col progress">Execution Progress</span>
        <span class="header-col values">Spent / Budget</span>
        <span class="header-col variance">Variance</span>
      </div>

      <div v-for="item in comparisonData" :key="item.group_name" class="list-row">
        <div class="col-name">
          <span class="group-title">{{ item.group_name }}</span>
          <span :class="['status-dot', getStatusClass(item)]"></span>
        </div>

        <div class="col-progress">
          <div class="progress-wrapper">
            <div class="progress-bar-container">
              <div 
                :class="['progress-fill', getProgressBarClass(item)]" 
                :style="{ width: `${Math.min(getPercentage(item), 100)}%` }"
              ></div>
            </div>
            <span class="progress-pct">{{ getPercentage(item).toFixed(0) }}%</span>
          </div>
        </div>

        <div class="col-values font-mono">
          <span class="spent">${{ formatCurrency(item.executed_amount) }}</span>
          <span class="divider">/</span>
          <span class="budget">${{ formatCurrency(item.budget_amount) }}</span>
        </div>

        <div :class="['col-variance font-mono', item.variance >= 0 ? 'text-green' : 'text-red']">
          {{ item.variance >= 0 ? '+' : '' }}${{ formatCurrency(item.variance) }}
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

const totalBudget = computed(() => comparisonData.value.reduce((acc, item) => acc + item.budget_amount, 0));
const totalExecuted = computed(() => comparisonData.value.reduce((acc, item) => acc + item.executed_amount, 0));
const totalVariance = computed(() => totalBudget.value - totalExecuted.value);
const usageRate = computed(() => totalBudget.value === 0 ? 0 : (totalExecuted.value / totalBudget.value) * 100);

const formatCurrency = (val) => formatters.formatterGeneralNumber(val);
const getPercentage = (item) => item.budget_amount === 0 ? 0 : (item.executed_amount / item.budget_amount) * 100;

const getStatusClass = (item) => {
  const pct = getPercentage(item);
  if (pct > 100) return 'dot-red';
  if (pct >= 85) return 'dot-amber';
  return 'dot-green';
};

const getProgressBarClass = (item) => {
  const pct = getPercentage(item);
  if (pct > 100) return 'bar-red';
  if (pct >= 85) return 'bar-amber';
  return 'bar-green';
};

const getUsageColorClass = () => {
  if (usageRate.value > 100) return 'bg-red';
  if (usageRate.value >= 85) return 'bg-amber';
  return 'bg-blue';
};

const getUsageTextColorClass = () => {
  if (usageRate.value > 100) return 'text-red';
  if (usageRate.value >= 85) return 'text-amber';
  return 'text-blue';
};
</script>

<style scoped>
.budget-performance {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.summary-strip {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  background-color: white;
  padding: 1rem;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 10px;
  background-color: #f8fafc;
  transition: background-color 0.2s ease;
}

.summary-item:hover {
  background-color: #f1f5f9;
}

.summary-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.summary-icon svg {
  width: 16px;
  height: 16px;
}

.summary-content {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.summary-item .label {
  font-size: 0.65rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.summary-item .value {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
}

.text-green { color: #10b981; }
.text-red { color: #ef4444; }
.text-blue { color: #2563eb; }
.text-amber { color: #d97706; }

.bg-blue { background-color: rgba(59, 130, 246, 0.1); color: #2563eb; }
.bg-amber { background-color: rgba(245, 158, 11, 0.1); color: #d97706; }
.bg-green { background-color: rgba(16, 185, 129, 0.1); color: #059669; }
.bg-red { background-color: rgba(239, 68, 68, 0.1); color: #dc2626; }

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #64748b;
  background-color: white;
  border-radius: 12px;
  border: 1px dashed #cbd5e1;
}

.empty-icon { font-size: 2.5rem; margin-bottom: 1rem; }

.performance-list {
  background-color: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.list-header {
  display: grid;
  grid-template-columns: 2fr 3fr 1.5fr 1fr;
  padding: 0.75rem 1.25rem;
  background-color: #f1f5f9;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.list-row {
  display: grid;
  grid-template-columns: 2fr 3fr 1.5fr 1fr;
  padding: 0.875rem 1.25rem;
  border-bottom: 1px solid #f1f5f9;
  align-items: center;
  transition: background-color 0.2s ease;
}

.list-row:hover {
  background-color: #f8fafc;
}

.list-row:last-child {
  border-bottom: none;
}

.col-name {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.group-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.dot-green { background-color: #10b981; }
.dot-amber { background-color: #f59e0b; }
.dot-red { background-color: #ef4444; }

.col-progress {
  padding: 0 1.5rem;
}

.progress-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.progress-bar-container {
  flex: 1;
  height: 6px;
  background-color: #f1f5f9;
  border-radius: 9999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 9999px;
  transition: width 0.5s ease;
}

.bar-green { background-color: #10b981; }
.bar-amber { background-color: #f59e0b; }
.bar-red { background-color: #ef4444; }

.progress-pct {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  width: 35px;
  text-align: right;
}

.col-values {
  font-size: 0.875rem;
  color: #334155;
  display: flex;
  justify-content: center;
  gap: 0.25rem;
}

.col-values .spent { font-weight: 700; }
.col-values .budget { color: #94a3b8; }
.col-values .divider { color: #cbd5e1; }

.col-variance {
  text-align: right;
  font-size: 0.875rem;
  font-weight: 700;
}

.font-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

@media (max-width: 1024px) {
  .list-header, .list-row {
    grid-template-columns: 1.5fr 2fr 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .list-header { display: none; }
  .list-row {
    grid-template-columns: 1fr;
    gap: 0.75rem;
    padding: 1.25rem;
  }
  .col-progress, .col-values, .col-variance {
    padding: 0;
    justify-content: flex-start;
    text-align: left;
  }
  .col-variance { text-align: left; }
}
</style>

