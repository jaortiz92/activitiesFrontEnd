<template>
  <div class="status-accounts container" v-if="depositAccounts.length">
    <div
      v-for="account in depositAccounts"
      :key="account.deposit_account"
      class="stat-card"
    >
      <div class="stat-label">{{ account.deposit_account }}</div>
      <div class="stat-value">{{ formatCurrency(account.value) }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";
import { queriesService } from "../services/queriesService";
import { formatters } from "@/plugins/formatters.js";

const depositAccounts = ref([]);

const formatCurrency = (value) => {
  return formatters.formatterGeneralNumber(value);
};

const fetchDepositAccounts = async () => {
  try {
    const response = await queriesService.getdepositAccounts();
    depositAccounts.value = response.data;
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error fetching accounts",
      text: error.message || "Could not load deposit accounts",
      confirmButtonColor: "var(--dark-color-opposite-one)",
    });
  }
};

onMounted(() => {
  fetchDepositAccounts();
});
</script>

<style scoped>
.container {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
  padding: 1rem;
}

.stat-card {
  flex: 1 1 200px;
  max-width: 300px;
  background-color: white;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid var(--light-border);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.stat-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--dark-color);
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-black);
}
</style>
