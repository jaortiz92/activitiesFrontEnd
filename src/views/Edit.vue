<template>
  <div class="edit-view content-container">
    <header class="view-header">
      <h1 class="page-title">Manage Transactions</h1>
      <p class="page-subtitle">Delete or review history of your financial records.</p>
    </header>

    <main class="edit-content">
      <!-- Delete Section -->
      <section class="delete-section">
        <DeleteTransaction
          @updatePag="refreshAllComponents"
          :key="keyDeleteTransaction"
        />
      </section>

      <!-- History Section -->
      <section class="history-section">
        <div class="section-header">
          <h2 class="section-title">History Logs</h2>
        </div>
        <div class="history-card">
          <LastTransactions
            :toShow="10"
            :key="keyLastTransactions"
          />
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
import LastTransactions from "@/components/LastTransactions.vue";
import DeleteTransaction from "@/components/DeleteTransaction.vue";

const keyDeleteTransaction = ref(0);
const keyLastTransactions = ref(0);

const refreshAllComponents = () => {
  keyDeleteTransaction.value += 1;
  keyLastTransactions.value += 1;
};
</script>

<style scoped>
.edit-view {
  padding-top: 2rem;
  padding-bottom: 4rem;
}

.view-header {
  margin-bottom: 2.5rem;
}

.page-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--dark-color-opposite-one);
  margin-bottom: 0.5rem;
}

.page-subtitle {
  color: #64748b;
  font-size: 1rem;
}

.edit-content {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.delete-section {
  max-width: 800px; /* Center and restrict delete form width */
}

.section-header {
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--dark-color);
}

.history-card {
  background-color: white;
  border-radius: 16px;
  border: 1px solid var(--light-border);
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.content-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 1.5rem;
  }
  
  .edit-view {
    padding-top: 1.5rem;
  }
}
</style>
