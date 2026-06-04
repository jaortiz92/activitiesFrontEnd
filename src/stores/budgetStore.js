import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { budgetService } from '@/services/budgetService';

export const useBudgetStore = defineStore('budget', () => {
  const currentMonth = ref(new Date().getMonth() + 1);
  const currentYear = ref(new Date().getFullYear());
  const comparisonData = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchComparison = async () => {
    loading.value = true;
    error.value = null;
    try {
      comparisonData.value = await budgetService.getComparison(
        currentMonth.value,
        currentYear.value
      );
    } catch (err) {
      error.value = err.message || 'Failed to fetch budget comparison';
    } finally {
      loading.value = false;
    }
  };

  const setPeriod = (month, year) => {
    currentMonth.value = month;
    currentYear.value = year;
  };

  return {
    currentMonth,
    currentYear,
    comparisonData,
    loading,
    error,
    fetchComparison,
    setPeriod
  };
});
