<script setup>
import { ref } from "vue";
import LastTransactions from "@/components/LastTransactions.vue";
import StatusAccounts from "@/components/StatusAccounts.vue";
import FilterTransactions from "../components/FilterTransactions.vue";

const keyLastTransactions = ref(0);
const keyStatusAccounts = ref(0);
const toShowForm = ref(null);
const paramsToSearch = ref("limit=20");
const currentFilters = ref({});

const refreshLastTransactions = () => {};

const handleFilterUpdate = (newFilters) => {
  currentFilters.value = newFilters;
  fetchTransactions();
};

const fetchTransactions = async () => {
  const temp_params = new URLSearchParams();

  for (const key in currentFilters.value) {
    const value = currentFilters.value[key];
    if (value !== null && value !== "") {
      temp_params.append(key, value);
    }
  }

  paramsToSearch.value = `${temp_params.toString()}`;
  keyLastTransactions.value += 1;
};
</script>

<template>
  <div class="home">
    <div class="header-home">
      <StatusAccounts :key="keyStatusAccounts" />
    </div>

    <FilterTransactions
      @apply-filters="handleFilterUpdate"
    ></FilterTransactions>

    <LastTransactions
      class="transaction-home"
      :params="paramsToSearch"
      :key="keyLastTransactions"
    />
  </div>
</template>

<style scoped>
.transaction-home {
  justify-content: center;
  align-items: center;
}
.header-home {
  display: flex;
  justify-content: center;
  margin-bottom: 2%;
  margin-top: 2%;
}
.rows-to-show {
  margin: auto;
  margin-bottom: 5%;
  margin-top: 5%;
  width: 40%;
  min-width: 250px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.rows-to-show-label {
  width: 100%;
  font-size: 100%;
  font-weight: bold;
  margin-bottom: 5%;
}
.rows-to-show div {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 600px;
}
.rows-to-show-input,
.rows-to-show-button {
  flex: 1;
  margin: 0 10px;
}
</style>
