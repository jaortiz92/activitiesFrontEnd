import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { transactionService } from "@/services/transactionService";

export const useDashboardStore = defineStore("dashboard", () => {
  const currentMonthTransactions = ref([]);
  const previousMonthTransactions = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Base date for calculations (defaults to current date)
  const baseDate = ref(new Date());

  // Robust date formatter (YYYY-MM-DD)
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Helper to get date range for a month relative to baseDate
  const getMonthRange = (monthsAgo = 0) => {
    const date = new Date(
      baseDate.value.getFullYear(),
      baseDate.value.getMonth() - monthsAgo,
      1,
    );
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    return {
      start: formatDate(firstDay),
      end: formatDate(lastDay),
    };
  };

  const setBaseDate = (dateString) => {
    const [year, month] = dateString.split("-").map(Number);
    // Use 12:00 to avoid issues with date shifting when just setting the date
    baseDate.value = new Date(year, month - 1, 1, 12, 0, 0);
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

  const groupByCategory = (transactions, prefixes, nature) => {
    const groups = {};

    transactions.forEach((tx) => {
      // Use a Set to ensure we only count one activity per transaction for the same category
      // This prevents doubling values if a transaction has multiple lines for the same category
      const matchedCategories = new Set();

      tx.activities.forEach((activity) => {
        const accountId = String(activity.account_id);
        const matchPrefix = prefixes.some((p) => accountId.startsWith(p));

        if (matchPrefix && activity.nature === nature) {
          const categoryCode =
            accountId.substring(0, 2) + "-" + tx.category.category;

          if (!matchedCategories.has(categoryCode)) {
            if (!groups[categoryCode]) {
              groups[categoryCode] = 0;
            }
            groups[categoryCode] += parseFloat(tx.value);
            matchedCategories.add(categoryCode);
          }
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

  const calculateDailyEvolution = (transactions, year, month) => {
    const lastDay = new Date(year, month, 0).getDate();
    const dailyValues = Array.from({ length: lastDay }, (_, i) => ({
      day: i + 1,
      netProfit: 0,
      cumulative: 0,
    }));

    transactions.forEach((tx) => {
      // Extract day directly from the string to avoid timezone shifts
      const dateParts = tx.transaction_date.split("-");
      const day = parseInt(dateParts[2], 10);

      if (day >= 1 && day <= lastDay) {
        let dailyNet = 0;
        // Again, be careful not to overcount if multiple activities match
        // For net profit, we check if there's ANY income or ANY expense activity
        let hasIncome = false;
        let hasExpense = false;

        tx.activities.forEach((activity) => {
          const accountId = String(activity.account_id);
          if (accountId.startsWith("4") && activity.nature === "0") {
            hasIncome = true;
          }
          if (
            ["5", "6", "7"].some((p) => accountId.startsWith(p)) &&
            activity.nature === "1"
          ) {
            hasExpense = true;
          }
        });

        if (hasIncome) dailyNet += parseFloat(tx.value);
        if (hasExpense) dailyNet -= parseFloat(tx.value);

        dailyValues[day - 1].netProfit += dailyNet;
      }
    });

    let runningTotal = 0;
    return dailyValues.map((d) => {
      runningTotal += d.netProfit;
      return { ...d, cumulative: runningTotal };
    });
  };

  const calculateCashFlowEvolution = (transactions, year, month) => {
    const lastDay = new Date(year, month, 0).getDate();
    const dailyValues = Array.from({ length: lastDay }, (_, i) => ({
      day: i + 1,
      cashFlow: 0,
      cumulative: 0,
    }));

    transactions.forEach((tx) => {
      const dateParts = tx.transaction_date.split("-");
      const day = parseInt(dateParts[2], 10);

      if (day >= 1 && day <= lastDay) {
        // Filter by origin/destiny names as requested
        const matchesOrigin = [
          "Efectivo",
          "Tarjeta Debito",
          "Tarjeta Credito",
        ].includes(tx.origin?.origin);
        const matchesDestiny = [
          "Efectivo",
          "Tarjeta Debito",
          "Tarjeta Credito",
        ].includes(tx.destiny?.origin);

        if (matchesOrigin || matchesDestiny) {
          let dailyNet = 0;
          const value = parseFloat(tx.value);
          if (matchesDestiny) {
            dailyNet += value;
          }
          if (matchesOrigin) {
            dailyNet -= value;
          }
          dailyValues[day - 1].cashFlow += dailyNet;
        }
      }
    });

    let runningTotal = 0;
    return dailyValues.map((d) => {
      runningTotal += d.cashFlow;
      return { ...d, cumulative: runningTotal };
    });
  };

  // Expenses: prefixes 5, 6, 7 and nature 1 (Debit)
  const currentMonthExpesesGroups = computed(() =>
    groupByCategory(currentMonthTransactions.value, ["5", "6", "7"], "1"),
  );
  const previousMonthExpesesGroups = computed(() =>
    groupByCategory(previousMonthTransactions.value, ["5", "6", "7"], "1"),
  );

  const currentMonthIncomeGroups = computed(() =>
    groupByCategory(currentMonthTransactions.value, ["4"], "0"),
  );
  const previousMonthIncomeGroups = computed(() =>
    groupByCategory(previousMonthTransactions.value, ["4"], "0"),
  );

  const currentMonthDailyEvolution = computed(() => {
    return calculateDailyEvolution(
      currentMonthTransactions.value,
      baseDate.value.getFullYear(),
      baseDate.value.getMonth() + 1,
    );
  });

  const previousMonthDailyEvolution = computed(() => {
    const prevDate = new Date(
      baseDate.value.getFullYear(),
      baseDate.value.getMonth() - 1,
      1,
    );
    return calculateDailyEvolution(
      previousMonthTransactions.value,
      prevDate.getFullYear(),
      prevDate.getMonth() + 1,
    );
  });

  const currentMonthCashFlowEvolution = computed(() => {
    return calculateCashFlowEvolution(
      currentMonthTransactions.value,
      baseDate.value.getFullYear(),
      baseDate.value.getMonth() + 1,
    );
  });

  const previousMonthCashFlowEvolution = computed(() => {
    const prevDate = new Date(
      baseDate.value.getFullYear(),
      baseDate.value.getMonth() - 1,
      1,
    );
    return calculateCashFlowEvolution(
      previousMonthTransactions.value,
      prevDate.getFullYear(),
      prevDate.getMonth() + 1,
    );
  });

  return {
    currentMonthTransactions,
    previousMonthTransactions,
    loading,
    error,
    baseDate,
    currentMonthExpesesGroups,
    previousMonthExpesesGroups,
    currentMonthIncomeGroups,
    previousMonthIncomeGroups,
    currentMonthDailyEvolution,
    previousMonthDailyEvolution,
    currentMonthCashFlowEvolution,
    previousMonthCashFlowEvolution,
    fetchAllDashboardData,
    setBaseDate,
  };
});
