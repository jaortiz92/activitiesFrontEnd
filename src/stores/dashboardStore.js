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

  /**
   * General grouping logic
   * @param {Array} transactions
   * @param {Array} prefixes Account prefixes to match (e.g. ['5', '6'] for expenses)
   * @param {String} nature Nature to filter ('1' for Debit, '0' for Credit)
   */
  const groupByCategory = (transactions, prefixes, nature) => {
    const groups = {};

    transactions.forEach((tx) => {
      tx.activities.forEach((activity) => {
        const accountId = String(activity.account_id);
        const matchPrefix = prefixes.some((p) => accountId.startsWith(p));

        if (matchPrefix && activity.nature === nature) {
          const categoryCode =
            accountId.substring(0, 2) + "-" + tx.category.category;
          if (!groups[categoryCode]) {
            groups[categoryCode] = 0;
          }
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

  // Expenses: prefixes 5, 6, 7 and nature 1 (Debit)
  const currentMonthExpesesGroups = computed(() =>
    groupByCategory(currentMonthTransactions.value, ["5", "6", "7"], "1"),
  );
  const previousMonthExpesesGroups = computed(() =>
    groupByCategory(previousMonthTransactions.value, ["5", "6", "7"], "1"),
  );

  // Income: prefix 4 and nature 0 (Credit)
  const currentMonthIncomeGroups = computed(() =>
    groupByCategory(currentMonthTransactions.value, ["4"], "0"),
  );
  const previousMonthIncomeGroups = computed(() =>
    groupByCategory(previousMonthTransactions.value, ["4"], "0"),
  );

  return {
    currentMonthTransactions,
    previousMonthTransactions,
    loading,
    error,
    currentMonthExpesesGroups,
    previousMonthExpesesGroups,
    currentMonthIncomeGroups,
    previousMonthIncomeGroups,
    fetchAllDashboardData,
  };
});
