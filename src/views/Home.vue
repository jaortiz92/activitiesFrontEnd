<template>
  <div class="home-view">
    <header class="dashboard-header">
      <div class="content-container">
        <h1 class="page-title">Financial Overview</h1>
        <StatusAccounts :key="keyStatusAccounts" />
      </div>
    </header>

    <main class="dashboard-content content-container">
      <section class="filters-section">
        <FilterTransactions @apply-filters="handleFilterUpdate" />
      </section>

      <section class="transactions-section">
        <div class="section-header">
          <h2>Recent Transactions</h2>
        </div>
        <LastTransactions
          :params="paramsToSearch"
          :key="keyLastTransactions"
        />
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
import LastTransactions from "@/components/LastTransactions.vue";
import StatusAccounts from "@/components/StatusAccounts.vue";
import FilterTransactions from "../components/FilterTransactions.vue";

const keyLastTransactions = ref(0);
const keyStatusAccounts = ref(0);
const paramsToSearch = ref("limit=20");

const handleFilterUpdate = (newFilters) => {
  const temp_params = new URLSearchParams();

  for (const key in newFilters) {
    const value = newFilters[key];
    if (value !== null && value !== "" && value !== undefined) {
      temp_params.append(key, value);
    }
  }

  paramsToSearch.value = temp_params.toString() || "limit=20";
  keyLastTransactions.value += 1;
};
</script>

<style scoped>
.home-view {
  min-height: 100vh;
  background-color: #f8fafc;
}

.dashboard-header {
  background-color: white;
  padding: 2rem 0;
  border-bottom: 1px solid var(--light-border);
  margin-bottom: 2rem;
}

.content-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.page-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--dark-color-opposite-one);
  margin-bottom: 1.5rem;
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding-bottom: 3rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--dark-color);
}

.filters-section {
  width: 100%;
}

.transactions-section {
  width: 100%;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 1.5rem;
  }
}
</style>
