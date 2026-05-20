<template>
  <div class="add-transaction-card">
    <div class="card-header">
      <div class="header-content">
        <div class="title-section">
          <h2 class="card-title">{{ namePag }}</h2>
          <p class="card-subtitle">Enter movement details with double-entry validation.</p>
        </div>
        <div class="quick-fill-section">
          <label class="form-label compact-label">Quick Fill Template</label>
          <select
            class="form-select compact-select"
            @change="generateRecurringTransactions"
            v-model="selectedRecurringTransactions"
          >
            <option :value="null">Select template...</option>
            <option
              v-for="rTransaction in filteredRecurringTransactions"
              :key="rTransaction.name"
              :value="rTransaction"
            >
              {{ rTransaction.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <form class="transaction-form" @submit.prevent="saveTransaction">
      <!-- Main Information Grid -->
      <div class="main-form-grid">
        <!-- Consistent height headers -->
        <div class="form-group">
          <label class="form-label aligned-label">Transaction Date</label>
          <input
            class="form-input"
            v-model="transaction.transaction_date"
            type="date"
            required
          />
        </div>
        <div class="form-group">
          <label class="form-label aligned-label">Amount Value</label>
          <div class="value-input-wrapper">
            <span class="currency-symbol">$</span>
            <input
              class="form-input value-input"
              v-model="transaction.value"
              type="number"
              min="100"
              max="100000000"
              required
              placeholder="0.00"
            />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label aligned-label">Transaction Category</label>
          <select class="form-select" v-model="transaction.category_id" required>
            <option :value="null" disabled>Select category...</option>
            <option
              v-for="category in categories"
              :key="category.category_id"
              :value="category.category_id"
            >
              {{ category.category }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label aligned-label">Description Type</label>
          <select class="form-select" v-model="transaction.description_id" required>
            <option :value="null" disabled>Select description...</option>
            <option
              v-for="description in descriptions"
              :key="description.description_id"
              :value="description.description_id"
            >
              {{ description.description }}
            </option>
          </select>
        </div>
      </div>

      <!-- Accounting Section (Seamless integration for alignment) -->
      <div class="accounts-wrapper">
        <div class="accounts-header">
          <h3 class="section-title-inline">Accounting Entries</h3>
        </div>
        <div class="accounts-grid-layout">
          <!-- Entry One -->
          <div class="entry-card">
            <div class="entry-header">
              <span class="entry-badge">1st Account</span>
            </div>
            <div class="entry-row-inputs">
              <select class="form-select flex-grow" v-model="transaction.activity_one.account_id" required>
                <option :value="null" disabled>Select account...</option>
                <option
                  v-for="account in accounts"
                  :key="account.account_id"
                  :value="account.account_id"
                >
                  {{ account.account_id }} - {{ account.account }}
                </option>
              </select>
              <select class="form-select nature-width" @change="validateNature(1)" v-model="transaction.activity_one.nature" required>
                <option :value="null" disabled>Nature</option>
                <option :value="1">DB (Debit)</option>
                <option :value="0">CR (Credit)</option>
              </select>
            </div>
          </div>

          <!-- Entry Two -->
          <div class="entry-card">
            <div class="entry-header">
              <span class="entry-badge">2nd Account</span>
            </div>
            <div class="entry-row-inputs">
              <select class="form-select flex-grow" v-model="transaction.activity_two.account_id" required>
                <option :value="null" disabled>Select account...</option>
                <option
                  v-for="account in accounts"
                  :key="account.account_id"
                  :value="account.account_id"
                >
                  {{ account.account_id }} - {{ account.account }}
                </option>
              </select>
              <select class="form-select nature-width" @change="validateNature(2)" v-model="transaction.activity_two.nature" required>
                <option :value="null" disabled>Nature</option>
                <option :value="1">DB (Debit)</option>
                <option :value="0">CR (Credit)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Conditional Fields & Notes -->
      <div class="secondary-form-grid">
        <div class="form-group" v-if="forShow.kind">
          <label class="form-label">Kind</label>
          <select class="form-select" v-model="transaction.kind_id" required>
            <option :value="null" disabled>Select kind...</option>
            <option v-for="kind in kinds" :key="kind.kind_id" :value="kind.kind_id">
              {{ kind.kind }}
            </option>
          </select>
        </div>
        <div class="form-group" v-if="forShow.origin">
          <label class="form-label">Origin</label>
          <select class="form-select" v-model="transaction.origin_id" required>
            <option :value="null" disabled>Select origin...</option>
            <option v-for="origin in origins" :key="origin.origin_id" :value="origin.origin_id">
              {{ origin.origin }}
            </option>
          </select>
        </div>
        <div class="form-group" v-if="forShow.destiny">
          <label class="form-label">Destiny</label>
          <select class="form-select" v-model="transaction.destiny_id" required>
            <option :value="null" disabled>Select destiny...</option>
            <option v-for="origin in origins" :key="origin.origin_id" :value="origin.origin_id">
              {{ origin.origin }}
            </option>
          </select>
        </div>

        <!-- Notes - Spanning remaining space -->
        <div class="form-group notes-area">
          <label class="form-label">Additional Details / Notes</label>
          <textarea
            class="form-textarea-aligned"
            v-model="transaction.detail"
            rows="2"
            placeholder="Add specific details about this movement..."
          />
        </div>
      </div>

      <div class="form-footer">
        <button class="btn-submit-modern" type="submit">
          Record {{ namePag }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, defineProps, defineEmits } from "vue";
import Swal from "sweetalert2";
import { recurringTransactions } from "../data/recurringTransactions.js";
import { transactionService } from "../services/transactionService.js";

const props = defineProps({
  group: Number,
  namePag: String,
});

const emit = defineEmits(["updatePag"]);

const accounts = ref([]);
const categories = ref([]);
const descriptions = ref([]);
const kinds = ref([]);
const origins = ref([]);
const selectedRecurringTransactions = ref(null);

const transaction = ref({
  transaction_date: new Date().toISOString().substr(0, 10),
  value: null,
  detail: null,
  category_id: null,
  description_id: null,
  kind_id: null,
  origin_id: null,
  destiny_id: null,
  activity_one: {
    nature: null,
    transaction_id: null,
    account_id: null,
  },
  activity_two: {
    nature: null,
    transaction_id: null,
    account_id: null,
  },
});

const forShow = ref({
  origin: true,
  destiny: true,
  kind: true,
});

const filteredRecurringTransactions = computed(() => {
  return recurringTransactions.filter(
    (rTransaction) => rTransaction.namePag === props.namePag
  );
});

const errorAlert = (option, introduction = "Error loading") => {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: `${introduction} ${option}`,
    confirmButtonColor: "var(--dark-color-opposite-one)",
  });
};

const validateNature = (entryNumber) => {
  if (entryNumber === 1) {
    transaction.value.activity_two.nature = transaction.value.activity_one.nature === 1 ? 0 : 1;
  } else {
    transaction.value.activity_one.nature = transaction.value.activity_two.nature === 1 ? 0 : 1;
  }
};

const generateRecurringTransactions = () => {
  if (selectedRecurringTransactions.value) {
    const selected = selectedRecurringTransactions.value;
    transaction.value.activity_one.nature = selected.activity_one.nature;
    transaction.value.activity_one.account_id = selected.activity_one.account_id;
    transaction.value.activity_two.nature = selected.activity_two.nature;
    transaction.value.activity_two.account_id = selected.activity_two.account_id;
    transaction.value.category_id = selected.category_id;
    
    if (selected.description_id) transaction.value.description_id = selected.description_id;
    if (selected.origin_id) transaction.value.origin_id = selected.origin_id;
    if (selected.destiny_id) transaction.value.destiny_id = selected.destiny_id;
    if (selected.kind_id) transaction.value.kind_id = selected.kind_id;
  }
};

const getAccounts = async () => {
  try {
    const response = await transactionService.getAccounts();
    accounts.value = response.data;
  } catch (error) {
    errorAlert("accounts");
  }
};

const getCategories = async () => {
  try {
    const response = await transactionService.getCategories(props.group);
    categories.value = response.data;
  } catch (error) {
    errorAlert("categories");
  }
};

const getDescriptions = async () => {
  try {
    const response = await transactionService.getDescriptions(props.group);
    descriptions.value = response.data;
  } catch (error) {
    errorAlert("descriptions");
  }
};

const getKinds = async () => {
  try {
    const response = await transactionService.getKinds(props.group);
    kinds.value = response.data;
  } catch (error) {
    errorAlert("kinds");
  }
};

const getOrigins = async () => {
  try {
    const response = await transactionService.getOrigins(props.group);
    origins.value = response.data;
  } catch (error) {
    errorAlert("origins");
  }
};

const saveTransaction = async () => {
  if (transaction.value.origin_id === transaction.value.destiny_id && forShow.value.origin && forShow.value.destiny) {
    Swal.fire({
      icon: "error",
      title: "Validation Error",
      text: "Origin and Destiny accounts cannot be the same.",
      confirmButtonColor: "var(--dark-color-opposite-one)",
    });
    return;
  }

  try {
    const response = await transactionService.postTransaction(transaction.value);
    Swal.fire({
      icon: "success",
      title: "Transaction saved",
      text: `Transaction ID: ${response.data.transaction_id}`,
      confirmButtonColor: "var(--dark-color-opposite-one)",
    });
    emit("updatePag");
  } catch (error) {
    errorAlert(error.message || error, "Error saving transaction");
  }
};

const autofill = () => {
  const shopping = ["Expenditure", "Cost", "Buy Assets"];
  if (props.namePag === "Income") {
    forShow.value.origin = false;
    transaction.value.origin_id = 11;
  } else if (shopping.includes(props.namePag)) {
    forShow.value.destiny = false;
    forShow.value.kind = false;
    transaction.value.destiny_id = 11;
    if (props.namePag === shopping[0]) {
      transaction.value.kind_id = 3;
    } else if (props.namePag === shopping[1]) {
      transaction.value.kind_id = 4;
    } else {
      transaction.value.kind_id = 5;
    }
  }
};

onMounted(() => {
  getAccounts();
  getCategories();
  getDescriptions();
  getKinds();
  getOrigins();
  autofill();
});
</script>

<style scoped>
.add-transaction-card {
  background-color: white;
  border-radius: 16px;
  border: 1px solid var(--light-border);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 100%;
  margin: 0;
}

.card-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--light-border);
  background-color: #f8fafc;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--dark-color-opposite-one);
  margin-bottom: 0.25rem;
}

.card-subtitle {
  color: #64748b;
  font-size: 0.875rem;
}

.quick-fill-section {
  width: 280px;
}

.compact-label {
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
  color: #64748b;
  display: block;
}

.compact-select {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
}

.transaction-form {
  padding: 2rem;
}

/* Main Grid with alignment fix */
.main-form-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* Fix vertical misalignment by giving labels a consistent height */
.aligned-label {
  min-height: 2.5rem; /* Space for 2 lines */
  display: flex;
  align-items: flex-end; /* Align text to bottom so inputs line up horizontally */
  padding-bottom: 4px;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
}

.form-input, .form-select, .form-textarea-aligned {
  padding: 0.75rem 1rem;
  border: 1px solid var(--light-border);
  border-radius: 10px;
  font-size: 0.9375rem;
  transition: all 0.2s ease;
  width: 100%;
  background-color: #fff;
  box-sizing: border-box; /* Crucial for alignment */
}

.form-input:focus, .form-select:focus, .form-textarea-aligned:focus {
  outline: none;
  border-color: var(--dark-color-opposite-two);
  box-shadow: 0 0 0 3px rgba(138, 98, 86, 0.1);
}

.value-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.currency-symbol {
  position: absolute;
  left: 1rem;
  color: #94a3b8;
  font-weight: 600;
}

.value-input {
  padding-left: 2rem;
}

/* Accounting Section - seamless alignment */
.accounts-wrapper {
  margin-bottom: 2rem;
  background-color: #f1f5f9;
  border-radius: 12px;
  padding: 1.5rem;
}

.accounts-header {
  margin-bottom: 1rem;
}

.section-title-inline {
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--dark-color-opposite-one);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.accounts-grid-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.entry-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.entry-badge {
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
}

.entry-row-inputs {
  display: flex;
  gap: 0.75rem;
}

.flex-grow {
  flex: 1;
}

.nature-width {
  width: 130px;
  flex-shrink: 0;
}

/* Secondary grid for dynamic fields and notes */
.secondary-form-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.notes-area {
  grid-column: span 4; /* Always span full width */
  margin-top: 0.5rem;
}

.form-textarea-aligned {
  resize: vertical;
  min-height: 80px;
  width: 100%;
  margin: 0; /* Remove any default margins */
}

.form-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--light-border);
}

.btn-submit-modern {
  background-color: var(--dark-color-opposite-one);
  color: white;
  border: none;
  padding: 1rem 3rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-submit-modern:hover {
  background-color: var(--dark-color-opposite-two);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(86, 57, 91, 0.2);
}

@media (max-width: 1200px) {
  .main-form-grid, .secondary-form-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .notes-area {
    grid-column: span 2;
  }
}

@media (max-width: 768px) {
  .main-form-grid, .secondary-form-grid, .accounts-grid-layout {
    grid-template-columns: 1fr;
  }
  .notes-area {
    grid-column: span 1;
  }
}
</style>
