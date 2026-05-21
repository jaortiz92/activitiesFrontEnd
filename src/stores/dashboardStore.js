import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { transactionService } from "@/services/transactionService";

export const useDashboardStore = defineStore("dashboard", () => {
  const currentMonthTransactions = ref([]);
  const previousMonthTransactions = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Helper to get date range for a month
  const getMonthRange = (monthsAgo = 0) => {
    const now = new Date();
    const date = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    return {
      start: firstDay.toISOString().split("T")[0],
      end: lastDay.toISOString().split("T")[0],
    };
  };

  const fetchCurrentMonthData = async () => {
    const { start, end } = getMonthRange(0);
    try {
      const response = await transactionService.getLastTransactions(
        `start_date=${start}&end_date=${end}&limit=1000`,
      );
      currentMonthTransactions.value = response.data;
    } catch (err) {
      error.value = err.message;
    }
  };

  const fetchPreviousMonthData = async () => {
    const { start, end } = getMonthRange(1);
    try {
      const response = await transactionService.getLastTransactions(
        `start_date=${start}&end_date=${end}&limit=1000`,
      );
      previousMonthTransactions.value = response.data;
    } catch (err) {
      error.value = err.message;
    }
  };

  const fetchAllDashboardData = async () => {
    loading.value = true;
    error.value = null;
    await Promise.all([fetchCurrentMonthData(), fetchPreviousMonthData()]);
    loading.value = false;
  };

  // Grouping logic
  const groupByCategory = (transactions) => {
    const groups = {};

    transactions.forEach((tx) => {
      // Find the activity that represents the expense/cost (usually DB in 5xx or 6xx)
      // or simply iterate through activities and find account_id starting with 5 or 6.
      tx.activities.forEach((activity) => {
        const accountId = String(activity.account_id);
        if (
          (accountId.startsWith("5") ||
            accountId.startsWith("6") ||
            accountId.startsWith("7")) &&
          activity.nature === "1"
        ) {
          const categoryCode =
            accountId.substring(0, 2) + "-" + tx.category.category;
          if (!groups[categoryCode]) {
            groups[categoryCode] = 0;
          }
          // In double entry, expenses/costs increase on Debit (nature 1)
          // We sum the value.
          groups[categoryCode] += parseFloat(tx.value);
        }
      });
    });

    return Object.keys(groups)
      .map((code) => ({
        code,
        value: groups[code],
      }))
      .sort((a, b) => b.value - a.value);
  };

  const currentMonthGroups = computed(() =>
    groupByCategory(currentMonthTransactions.value),
  );
  const previousMonthGroups = computed(() =>
    groupByCategory(previousMonthTransactions.value),
  );

  return {
    currentMonthTransactions,
    previousMonthTransactions,
    loading,
    error,
    currentMonthGroups,
    previousMonthGroups,
    fetchAllDashboardData,
  };
});
