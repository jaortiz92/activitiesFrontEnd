<template>
  <div class="chart-container">
    <div class="chart-header">
      <div class="header-main">
        <h2 class="chart-title">Expenses Comparison by Category</h2>
      </div>

      <div class="chart-controls">
        <div class="legend-item">
          <span class="color-box current"></span>
          <span class="period-label">Current</span>
        </div>
        <div class="legend-item">
          <span class="color-box previous"></span>
          <span class="period-label">Previous</span>
        </div>
        <div class="header-totals">
          <div class="header-total-item current">
            <span class="total-label">Total Current</span>
            <span class="total-amount">{{
              formatCurrency(grandTotalCurrent)
            }}</span>
          </div>
          <div class="header-total-item previous">
            <span class="total-label">Total Previous</span>
            <span class="total-amount">{{
              formatCurrency(grandTotalPrevious)
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading chart data...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>Error: {{ error }}</p>
    </div>

    <div v-else class="scrollable-content">
      <div class="bars-wrapper">
        <div
          v-for="item in processedData"
          :key="item.code"
          class="category-row"
        >
          <div class="category-info">
            <span class="category-code">{{ item.code }}</span>
            <span class="category-change" :class="getChangeClass(item.change)">
              {{ item.change > 0 ? "↑" : item.change < 0 ? "↓" : "" }}
              {{ Math.abs(item.change).toFixed(1) }}%
            </span>
          </div>

          <div class="bar-group">
            <!-- Current Month Bar -->
            <div class="bar-container">
              <div
                class="bar current"
                :style="{ width: item.currentWidth + '%' }"
                :title="`Current: ${formatCurrency(item.currentValue)}`"
              >
                <span v-if="item.currentWidth > 3" class="bar-value">
                  {{ formatCurrency(item.currentValue) }}
                </span>
              </div>
            </div>

            <!-- Previous Month Bar -->
            <div class="bar-container">
              <div
                class="bar previous"
                :style="{ width: item.previousWidth + '%' }"
                :title="`Previous: ${formatCurrency(item.previousValue)}`"
              >
                <span v-if="item.previousWidth > 3" class="bar-value">
                  {{ formatCurrency(item.previousValue) }}
                </span>
              </div>
            </div>
          </div>
          <div class="category-totals">
            <span class="total-label">Current:</span>
            <span class="total-amount">{{
              formatCurrency(item.currentValue)
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useDashboardStore } from "@/stores/dashboardStore";
import { formatters } from "@/plugins/formatters";

const store = useDashboardStore();
const loading = computed(() => store.loading);
const error = computed(() => store.error);

const formatCurrency = (value) => formatters.formatterGeneralNumber(value);

const grandTotalCurrent = computed(() =>
  store.currentMonthGroups.reduce((acc, g) => acc + g.value, 0),
);

const grandTotalPrevious = computed(() =>
  store.previousMonthGroups.reduce((acc, g) => acc + g.value, 0),
);

const processedData = computed(() => {
  const currentGroups = store.currentMonthGroups;
  const previousGroups = store.previousMonthGroups;

  const allCodes = Array.from(
    new Set([
      ...currentGroups.map((g) => g.code),
      ...previousGroups.map((g) => g.code),
    ]),
  ).sort();

  const maxValue = Math.max(
    ...currentGroups.map((g) => g.value),
    ...previousGroups.map((g) => g.value),
    1,
  );

  return allCodes
    .map((code) => {
      const current = currentGroups.find((g) => g.code === code)?.value || 0;
      const previous = previousGroups.find((g) => g.code === code)?.value || 0;

      let change = 0;
      if (previous > 0) {
        change = ((current - previous) / previous) * 100;
      } else if (current > 0) {
        change = 100;
      }

      return {
        code,
        currentValue: current,
        previousValue: previous,
        currentWidth: (current / maxValue) * 100,
        previousWidth: (previous / maxValue) * 100,
        change,
      };
    })
    .sort((a, b) => b.currentValue - a.currentValue);
});

const getChangeClass = (change) => {
  if (change > 0) return "text-danger";
  if (change < 0) return "text-success";
  return "text-neutral";
};
</script>

<style scoped>
.chart-container {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  max-height: 600px; /* Limits overall height of the component */
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 1rem;
  flex-shrink: 0; /* Header won't shrink */
}

.header-main {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.chart-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.header-totals {
  display: flex;
  gap: 1.5rem;
}

.header-total-item {
  display: flex;
  flex-direction: column;
}

.header-total-item .total-label {
  font-size: 0.65rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.header-total-item .total-amount {
  font-size: 1.1rem;
  font-weight: 800;
}

.header-total-item.current .total-amount {
  color: #4f46e5;
}
.header-total-item.previous .total-amount {
  color: #64748b;
}

.chart-controls {
  display: flex;
  gap: 1rem;
  padding-top: 0.25rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.color-box {
  width: 10px;
  height: 10px;
  border-radius: 2px;
}

.color-box.current {
  background-color: #4f46e5;
}
.color-box.previous {
  background-color: #cbd5e1;
}

.period-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: #64748b;
}

/* Scrollable Area */
.scrollable-content {
  overflow-y: auto;
  padding-right: 0.5rem;
  /* Styling scrollbar for better aesthetics */
}

.scrollable-content::-webkit-scrollbar {
  width: 6px;
}

.scrollable-content::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

.scrollable-content::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.scrollable-content::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.bars-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 0.5rem 0;
}

.category-row {
  display: grid;
  grid-template-columns: 90px 1fr 130px;
  align-items: center;
  gap: 1rem;
}

.category-info {
  display: flex;
  flex-direction: column;
}

.category-code {
  font-weight: 700;
  color: #334155;
  font-size: 0.9rem;
}

.category-change {
  font-size: 0.7rem;
  font-weight: 700;
}

.bar-group {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.bar-container {
  width: 100%;
  height: 18px;
  background-color: #f8fafc;
  border-radius: 4px;
  overflow: hidden;
}

.bar {
  height: 100%;
  transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: flex;
  align-items: center;
  padding: 0 8px;
  min-width: 2px;
}

.bar.current {
  background: linear-gradient(90deg, #4f46e5, #6366f1);
}

.bar.previous {
  background-color: #cbd5e1;
}

.bar-value {
  color: white;
  font-size: 0.65rem;
  font-weight: 600;
  white-space: nowrap;
}

.bar.previous .bar-value {
  color: #475569;
}

.category-totals {
  display: flex;
  flex-direction: column;
  text-align: right;
}

.total-label {
  font-size: 0.65rem;
  color: #94a3b8;
  text-transform: uppercase;
}

.total-amount {
  font-weight: 700;
  color: #1e293b;
  font-size: 0.85rem;
}

.text-danger {
  color: #ef4444;
}
.text-success {
  color: #10b981;
}
.text-neutral {
  color: #94a3b8;
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  color: #64748b;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #4f46e5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .category-row {
    grid-template-columns: 50px 1fr;
    gap: 0.75rem;
  }
  .category-totals {
    display: none;
  }
  .chart-header {
    flex-direction: column;
    gap: 1rem;
  }
  .header-totals {
    flex-wrap: wrap;
    gap: 1rem;
  }
}
</style>
