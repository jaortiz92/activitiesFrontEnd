<template>
  <div class="transaction-view content-container">
    <div class="transaction-layout">
      <!-- Sidebar Navigation -->
      <aside class="transaction-sidebar">
        <div class="sidebar-header">
          <h2>Transaction Type</h2>
        </div>
        <nav class="sidebar-nav">
          <button 
            v-for="type in transactionTypes" 
            :key="type.name"
            class="nav-item"
            :class="{ active: selected && namePag === type.name }"
            @click="selectTransactionType(type.group, type.name)"
          >
            <span class="nav-item-text">{{ type.name }}</span>
            <span class="nav-item-icon">→</span>
          </button>
        </nav>
        
        <button 
          v-if="selected" 
          class="return-button" 
          @click="resetSelection"
        >
          ← Back to Types
        </button>
      </aside>

      <!-- Form Area -->
      <main class="transaction-main">
        <div v-if="!selected" class="empty-state">
          <div class="empty-icon">💸</div>
          <h3>Select a transaction type</h3>
          <p>Choose from the sidebar to start recording a new movement.</p>
        </div>
        
        <AddTransaction
          v-else
          :group="group"
          :namePag="namePag"
          :key="keyAddTransaction"
          @updatePag="refreshPag"
        />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import AddTransaction from "@/components/AddTransaction.vue";

const keyAddTransaction = ref(0);
const group = ref(null);
const namePag = ref(null);
const selected = ref(false);

const transactionTypes = [
  { group: 1, name: "Income" },
  { group: 2, name: "Expenditure" },
  { group: 2, name: "Cost" },
  { group: 2, name: "Buy Assets" },
  { group: 3, name: "Savings" },
  { group: 1, name: "Transfer" },
];

const selectTransactionType = (newGroup, newNamePag) => {
  group.value = newGroup;
  namePag.value = newNamePag;
  selected.value = true;
  refreshPag();
};

const resetSelection = () => {
  selected.value = false;
  group.value = null;
  namePag.value = null;
};

const refreshPag = () => {
  keyAddTransaction.value += 1;
};
</script>

<style scoped>
.transaction-view {
  padding-top: 2rem;
  padding-bottom: 3rem;
}

.transaction-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
  align-items: start;
}

.transaction-sidebar {
  background-color: white;
  border-radius: 16px;
  border: 1px solid var(--light-border);
  padding: 1.5rem;
  position: sticky;
  top: 92px; /* Navbar height + 20px */
}

.sidebar-header {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--light-border);
}

.sidebar-header h2 {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--dark-color-opposite-one);
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.875rem 1rem;
  background: none;
  border: 1px solid transparent;
  border-radius: 12px;
  color: var(--dark-color);
  font-weight: 500;
  text-align: left;
  transition: all 0.2s ease;
  cursor: pointer;
  width: 100%;
}

.nav-item:hover {
  background-color: #f8fafc;
  color: var(--dark-color-opposite-one);
}

.nav-item.active {
  background-color: var(--light-color-opposite-two);
  color: var(--dark-color-opposite-one);
  border-color: var(--normal-color-opposite-two);
}

.nav-item-icon {
  opacity: 0;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.nav-item:hover .nav-item-icon,
.nav-item.active .nav-item-icon {
  opacity: 1;
  transform: translateX(4px);
}

.return-button {
  margin-top: 1.5rem;
  width: 100%;
  background-color: #f1f5f9;
  color: #475569;
  border: none;
  padding: 0.75rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.return-button:hover {
  background-color: #e2e8f0;
}

.transaction-main {
  min-height: 400px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: white;
  border-radius: 16px;
  border: 1px dashed var(--light-border);
  padding: 4rem 2rem;
  text-align: center;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
}

.empty-state h3 {
  font-size: 1.25rem;
  color: var(--dark-color-opposite-one);
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #64748b;
  max-width: 300px;
}

.content-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

@media (max-width: 768px) {
  .transaction-layout {
    grid-template-columns: 1fr;
  }
  
  .transaction-sidebar {
    position: static;
  }
}
</style>
