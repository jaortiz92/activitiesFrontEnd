<template>
  <div class="chart-container">
    <div class="chart-header">
      <div class="header-main">
        <h2 class="chart-title">Financial Status (Net Movement)</h2>
        <p class="chart-subtitle">Comparison of Assets vs Liabilities + Equity + Result</p>
      </div>
      <div class="chart-controls">
        <div class="legend-item">
          <span class="color-box assets"></span>
          <span class="period-label">Assets</span>
        </div>
        <div class="legend-item">
          <span class="color-box liabilities"></span>
          <span class="period-label">Liabilities</span>
        </div>
        <div class="legend-item">
          <span class="color-box equity"></span>
          <span class="period-label">Equity</span>
        </div>
        <div class="legend-item">
          <span class="color-box result"></span>
          <span class="period-label">Net Result</span>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading financial data...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>Error: {{ error }}</p>
    </div>

    <div v-else class="chart-body">
      <div class="bars-container">
        <!-- Previous Month Group -->
        <div class="period-group">
          <div class="period-label-bottom">Previous</div>
          <div class="bars-wrapper">
            <!-- Assets Bar -->
            <div class="bar-column">
              <div 
                class="bar assets" 
                :style="{ height: calculateHeight(prev.assets, maxVal) + 'px' }"
                :title="`Assets: ${formatCurrency(prev.assets)}`"
              >
                <span v-if="calculateHeight(prev.assets, maxVal) > 20" class="bar-value">
                  {{ formatCurrency(prev.assets) }}
                </span>
              </div>
            </div>
            <!-- Financing Bar (Stacked) -->
            <div class="bar-column stacked">
              <div class="stack-container">
                <div 
                  class="stack-segment liabilities" 
                  :style="{ height: calculateHeight(prev.liabilities, maxVal) + 'px' }"
                  :title="`Liabilities: ${formatCurrency(prev.liabilities)}`"
                >
                  <span v-if="calculateHeight(prev.liabilities, maxVal) > 20" class="bar-value">
                    {{ formatCurrency(prev.liabilities) }}
                  </span>
                </div>
                <div 
                  class="stack-segment equity" 
                  :style="{ height: calculateHeight(prev.equity, maxVal) + 'px' }"
                  :title="`Equity: ${formatCurrency(prev.equity)}`"
                >
                  <span v-if="calculateHeight(prev.equity, maxVal) > 20" class="bar-value">
                    {{ formatCurrency(prev.equity) }}
                  </span>
                </div>
                <div 
                  class="stack-segment result" 
                  :class="prev.netResult >= 0 ? 'positive' : 'negative'"
                  :style="{ height: calculateHeight(prev.netResult, maxVal) + 'px' }"
                  :title="`Net Result: ${formatCurrency(prev.netResult)}`"
                >
                  <span v-if="calculateHeight(prev.netResult, maxVal) > 20" class="bar-value">
                    {{ formatCurrency(prev.netResult) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Current Month Group -->
        <div class="period-group">
          <div class="period-label-bottom">Current</div>
          <div class="bars-wrapper">
            <!-- Assets Bar -->
            <div class="bar-column">
              <div 
                class="bar assets" 
                :style="{ height: calculateHeight(curr.assets, maxVal) + 'px' }"
                :title="`Assets: ${formatCurrency(curr.assets)}`"
              >
                <span v-if="calculateHeight(curr.assets, maxVal) > 20" class="bar-value">
                  {{ formatCurrency(curr.assets) }}
                </span>
              </div>
            </div>
            <!-- Financing Bar (Stacked) -->
            <div class="bar-column stacked">
              <div class="stack-container">
                <div 
                  class="stack-segment liabilities" 
                  :style="{ height: calculateHeight(curr.liabilities, maxVal) + 'px' }"
                  :title="`Liabilities: ${formatCurrency(curr.liabilities)}`"
                >
                  <span v-if="calculateHeight(curr.liabilities, maxVal) > 20" class="bar-value">
                    {{ formatCurrency(curr.liabilities) }}
                  </span>
                </div>
                <div 
                  class="stack-segment equity" 
                  :style="{ height: calculateHeight(curr.equity, maxVal) + 'px' }"
                  :title="`Equity: ${formatCurrency(curr.equity)}`"
                >
                  <span v-if="calculateHeight(curr.equity, maxVal) > 20" class="bar-value">
                    {{ formatCurrency(curr.equity) }}
                  </span>
                </div>
                <div 
                  class="stack-segment result" 
                  :class="curr.netResult >= 0 ? 'positive' : 'negative'"
                  :style="{ height: calculateHeight(curr.netResult, maxVal) + 'px' }"
                  :title="`Net Result: ${formatCurrency(curr.netResult)}`"
                >
                  <span v-if="calculateHeight(curr.netResult, maxVal) > 20" class="bar-value">
                    {{ formatCurrency(curr.netResult) }}
                  </span>
                </div>
              </div>
            </div>
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

const curr = computed(() => store.currentMonthFinancialStatus);
const prev = computed(() => store.previousMonthFinancialStatus);

const maxVal = computed(() => {
  const vals = [
    Math.abs(curr.value.assets),
    Math.abs(curr.value.liabilities),
    Math.abs(curr.value.equity),
    Math.abs(curr.value.netResult),
    Math.abs(prev.value.assets),
    Math.abs(prev.value.liabilities),
    Math.abs(prev.value.equity),
    Math.abs(prev.value.netResult),
  ];
  return Math.max(...vals, 1);
});

const calculateHeight = (value, max) => {
  const chartMaxHeight = 300;
  return (Math.abs(value) / max) * chartMaxHeight;
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
  height: 500px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 1rem;
}

.header-main {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.chart-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.chart-subtitle {
  font-size: 0.8rem;
  color: #64748b;
  margin: 0;
}

.chart-controls {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
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

.color-box.assets { background-color: #4f46e5; }
.color-box.liabilities { background-color: #f87171; }
.color-box.equity { background-color: #fbbf24; }
.color-box.result { background-color: #10b981; }

.period-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: #64748b;
}

.chart-body {
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 2rem;
}

.bars-container {
  display: flex;
  gap: 4rem;
  align-items: flex-end;
}

.period-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.period-label-bottom {
  font-size: 0.85rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
}

.bars-wrapper {
  display: flex;
  gap: 1.5rem;
  align-items: flex-end;
  height: 300px;
}

.bar-column {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 60px;
  height: 100%;
}

.bar {
  width: 100%;
  border-radius: 4px 4px 0 0;
  transition: height 0.6s ease-out;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.bar.assets {
  background: linear-gradient(to top, #4f46e5, #818cf8);
}

.stacked {
  justify-content: flex-end;
}

.stack-container {
  display: flex;
  flex-direction: column-reverse;
  width: 100%;
  height: 100%;
  justify-content: flex-start;
}

.stack-segment {
  width: 100%;
  transition: height 0.6s ease-out;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid rgba(255,255,255,0.2);
}

.stack-segment.liabilities { background-color: #f87171; }
.stack-segment.equity { background-color: #fbbf24; }
.stack-segment.result.positive { background-color: #10b981; }
.stack-segment.result.negative { background-color: #ef4444; }

.bar-value {
  color: white;
  font-size: 0.6rem;
  font-weight: 700;
  text-align: center;
  white-space: nowrap;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
}

.loading-state,
.error-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
