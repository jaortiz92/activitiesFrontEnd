<template>
  <div class="chart-container">
    <div class="chart-header">
      <div class="header-main">
        <h2 class="chart-title">Cash Flow Evolution (Daily)</h2>
        <div class="header-totals">
          <div class="header-total-item current">
            <span class="total-label">Current Cash</span>
            <span class="total-amount" :class="getNetClass(currentFinalCash)">
              {{ formatCurrency(currentFinalCash) }}
            </span>
          </div>
          <div class="header-total-item previous">
            <span class="total-label">Previous Cash</span>
            <span class="total-amount">
              {{ formatCurrency(previousFinalCash) }}
            </span>
          </div>
        </div>
      </div>
      
      <div class="chart-controls">
        <div class="legend-item">
          <span class="line-sample current"></span>
          <span class="period-label">Current Period</span>
        </div>
        <div class="legend-item">
          <span class="line-sample previous"></span>
          <span class="period-label">Previous Period</span>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading cash flow data...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>Error: {{ error }}</p>
    </div>

    <div v-else class="chart-wrapper">
      <svg viewBox="0 0 1000 400" preserveAspectRatio="none" class="evolution-svg">
        <!-- Grid Lines (Y-Axis) -->
        <line v-for="i in 4" :key="'grid-y-'+i" 
          x1="0" :y1="i * 100" x2="1000" :y2="i * 100" 
          stroke="#f1f5f9" stroke-width="1" />
        
        <!-- Day Grid Lines (X-Axis) -->
        <line v-for="labelDay in axisLabelDays" :key="'grid-x-'+labelDay"
          :x1="getX(labelDay)" y1="0" :x2="getX(labelDay)" y2="400"
          stroke="#f8fafc" stroke-width="1" />

        <!-- Zero Line -->
        <line :x1="0" :y1="zeroY" x2="1000" :y2="zeroY" 
          stroke="#cbd5e1" stroke-width="2" stroke-dasharray="4" />

        <!-- Previous Month Line -->
        <path :d="previousPath" 
          fill="none" stroke="#cbd5e1" stroke-width="2.5" 
          stroke-linecap="round" stroke-linejoin="round" />

        <!-- Current Month Line -->
        <path :d="currentPath" 
          fill="none" stroke="#10b981" stroke-width="4" 
          stroke-linecap="round" stroke-linejoin="round" />
        
        <!-- Hover Marker -->
        <g v-if="hoverDay">
          <line :x1="getX(hoverDay)" y1="0" :x2="getX(hoverDay)" y2="400" 
            stroke="#10b981" stroke-width="1.5" stroke-dasharray="3,3" />
          <circle :cx="getX(hoverDay)" :cy="currentY" r="6" fill="#10b981" stroke="white" stroke-width="2" />
          <circle :cx="getX(hoverDay)" :cy="previousY" r="5" fill="#cbd5e1" stroke="white" stroke-width="2" />
        </g>

        <!-- Overlay for mouse tracking -->
        <rect x="0" y="0" width="1000" height="400" 
          fill="transparent" 
          @mousemove="handleMouseMove" 
          @mouseleave="hoverDay = null" />
      </svg>

      <!-- Tooltip -->
      <div v-if="hoverDay" class="chart-tooltip" :style="tooltipStyle">
        <div class="tooltip-day">Day {{ hoverDay }}</div>
        <div class="tooltip-row">
          <span class="dot current"></span>
          <span class="row-label">Current:</span>
          <span class="row-value">{{ formatCurrency(hoverData.current) }}</span>
        </div>
        <div class="tooltip-row">
          <span class="dot previous"></span>
          <span class="row-label">Previous:</span>
          <span class="row-value">{{ formatCurrency(hoverData.previous) }}</span>
        </div>
      </div>

      <!-- X-Axis Labels -->
      <div class="x-axis-container">
        <div v-for="labelDay in axisLabelDays" :key="'label-'+labelDay" 
             class="x-label" :style="{ left: (getX(labelDay)/10) + '%' }">
          {{ labelDay }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useDashboardStore } from '@/stores/dashboardStore';
import { formatters } from '@/plugins/formatters';

const store = useDashboardStore();
const loading = computed(() => store.loading);
const error = computed(() => store.error);

const formatCurrency = (value) => formatters.formatterGeneralNumber(value);

const hoverDay = ref(null);
const mouseX = ref(0);
const containerWidth = ref(1000);

const currentEvolution = computed(() => store.currentMonthCashFlowEvolution);
const previousEvolution = computed(() => store.previousMonthCashFlowEvolution);

// Max days shown on axis is based on the current month's length
const daysInMonth = computed(() => currentEvolution.value.length || 31);

const currentFinalCash = computed(() => {
  if (!currentEvolution.value.length) return 0;
  return currentEvolution.value[currentEvolution.value.length - 1].cumulative;
});

const previousFinalCash = computed(() => {
  if (!previousEvolution.value.length) return 0;
  return previousEvolution.value[previousEvolution.value.length - 1].cumulative;
});

const allValues = computed(() => [
  ...currentEvolution.value.map(d => d.cumulative),
  ...previousEvolution.value.map(d => d.cumulative),
  0
]);

const minY = computed(() => Math.min(...allValues.value));
const maxY = computed(() => Math.max(...allValues.value));
const rangeY = computed(() => Math.max(maxY.value - minY.value, 1));

const getX = (day) => {
  if (daysInMonth.value <= 1) return 0;
  return ((day - 1) / (daysInMonth.value - 1)) * 1000;
};

const getY = (value) => 400 - ((value - minY.value) / rangeY.value) * 400;

const zeroY = computed(() => getY(0));

const currentPath = computed(() => {
  if (!currentEvolution.value.length) return '';
  return currentEvolution.value.reduce((acc, point, i) => {
    const x = getX(point.day);
    const y = getY(point.cumulative);
    return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');
});

const previousPath = computed(() => {
  if (!previousEvolution.value.length) return '';
  return previousEvolution.value.reduce((acc, point, i) => {
    const x = getX(point.day);
    const y = getY(point.cumulative);
    return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');
});

const axisLabelDays = computed(() => {
  const labels = [1, 5, 10, 15, 20, 25];
  if (daysInMonth.value > 25) labels.push(daysInMonth.value);
  return labels;
});

const handleMouseMove = (event) => {
  const rect = event.currentTarget.getBoundingClientRect();
  containerWidth.value = rect.width;
  const x = event.clientX - rect.left;
  mouseX.value = x;
  
  const day = Math.round((x / rect.width) * (daysInMonth.value - 1)) + 1;
  hoverDay.value = Math.max(1, Math.min(day, daysInMonth.value));
};

const currentY = computed(() => {
  if (!hoverDay.value) return 0;
  const data = currentEvolution.value.find(d => d.day === hoverDay.value);
  return data ? getY(data.cumulative) : getY(0);
});

const previousY = computed(() => {
  if (!hoverDay.value) return 0;
  const data = previousEvolution.value.find(d => d.day === hoverDay.value);
  return data ? getY(data.cumulative) : getY(0);
});

const hoverData = computed(() => {
  if (!hoverDay.value) return { current: 0, previous: 0 };
  const cur = currentEvolution.value.find(d => d.day === hoverDay.value)?.cumulative || 0;
  const prev = previousEvolution.value.find(d => d.day === hoverDay.value)?.cumulative || 0;
  return { current: cur, previous: prev };
});

const tooltipStyle = computed(() => {
  const isRightSide = mouseX.value > containerWidth.value / 2;
  return {
    left: isRightSide ? 'auto' : `${mouseX.value + 20}px`,
    right: isRightSide ? `${containerWidth.value - mouseX.value + 20}px` : 'auto',
    top: '50%',
    transform: 'translateY(-50%)'
  };
});

const getNetClass = (value) => {
  if (value > 0) return 'text-success';
  if (value < 0) return 'text-danger';
  return '';
};
</script>

<style scoped>
.chart-container {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
  width: 100%;
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
  gap: 0.75rem;
}

.chart-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.header-totals {
  display: flex;
  gap: 2rem;
}

.header-total-item {
  display: flex;
  flex-direction: column;
}

.total-label {
  font-size: 0.7rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.total-amount {
  font-size: 1.25rem;
  font-weight: 800;
}

.chart-controls {
  display: flex;
  gap: 1.5rem;
  padding-top: 0.5rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.line-sample {
  width: 24px;
  height: 4px;
  border-radius: 2px;
}

.line-sample.current { background-color: #10b981; }
.line-sample.previous { background-color: #cbd5e1; }

.period-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #64748b;
}

.chart-wrapper {
  position: relative;
  width: 100%;
  height: 400px;
  padding-bottom: 40px;
}

.evolution-svg {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.x-axis-container {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30px;
}

.x-label {
  position: absolute;
  transform: translateX(-50%);
  font-size: 0.75rem;
  font-weight: 700;
  color: #94a3b8;
  padding: 4px 8px;
  background: #f8fafc;
  border-radius: 4px;
  border: 1px solid #f1f5f9;
}

.chart-tooltip {
  position: absolute;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  pointer-events: none;
  z-index: 10;
  min-width: 180px;
}

.tooltip-day {
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 0.75rem;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 0.5rem;
  font-size: 0.9rem;
}

.tooltip-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #475569;
  margin-bottom: 0.4rem;
}

.row-label {
  flex: 1;
  font-weight: 600;
}

.row-value {
  font-family: monospace;
  font-weight: 700;
  color: #1e293b;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.dot.current { background-color: #10b981; }
.dot.previous { background-color: #cbd5e1; }

.text-danger { color: #ef4444; }
.text-success { color: #10b981; }

.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  color: #64748b;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #10b981;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .chart-header {
    flex-direction: column;
    gap: 1.5rem;
  }
  .header-totals {
    gap: 1rem;
  }
  .chart-wrapper {
    height: 300px;
  }
}
</style>
