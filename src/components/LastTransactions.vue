<template>
  <div class="last-transactions-container">
    <div v-if="transactions && transactions.length" class="table-wrapper">
      <table class="modern-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Category</th>
            <th>Description</th>
            <th>Kind</th>
            <th>Origin</th>
            <th>Destiny</th>
            <th>Accounts</th>
            <th class="text-right">Value</th>
            <th>Detail</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="transaction in transactions"
            :key="transaction.transaction_id"
          >
            <td class="id-col">{{ transaction.transaction_id }}</td>
            <td class="date-col">{{ transaction.transaction_date }}</td>
            <td>
              <span class="badge category">{{
                transaction.category.category
              }}</span>
            </td>
            <td>{{ transaction.description.description }}</td>
            <td>{{ transaction.kind.kind }}</td>
            <td>{{ transaction.origin.origin }}</td>
            <td>{{ transaction.destiny.origin }}</td>
            <td class="accounts-col">
              <span class="account-tag db">{{
                formatActivity(transaction.activities_db)
              }}</span>
              <span class="account-tag cr">{{
                formatActivity(transaction.activities_cr)
              }}</span>
            </td>
            <td class="value-col">{{ formatCurrency(transaction.value) }}</td>
            <td class="detail-col">{{ transaction.detail }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else-if="transactions" class="no-data">
      No transactions found for the selected filters.
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import Swal from "sweetalert2";
import { transactionService } from "@/services/transactionService";
import { formatters } from "@/plugins/formatters.js";

const props = defineProps({
  params: {
    type: String,
    default: "limit=20",
  },
});

const transactions = ref(null);

const formatCurrency = (value) => {
  return formatters.formatterGeneralNumber(value);
};

const formatActivity = (activity) => {
  if (!activity) return "N/A";
  const type = activity.nature === "0" ? "CR" : "DB";
  return `${type}-${activity.account_id}`;
};

const fetchTransactions = async (params) => {
  try {
    const response = await transactionService.getLastTransactions(params);
    transactions.value = response.data;
    for (let i = 0; i < transactions.value.length; i++) {
      if (transactions.value[i].activities[0].nature === "0") {
        transactions.value[i].activities_cr =
          transactions.value[i].activities[0];
        transactions.value[i].activities_db =
          transactions.value[i].activities[1];
      } else {
        transactions.value[i].activities_cr =
          transactions.value[i].activities[1];
        transactions.value[i].activities_db =
          transactions.value[i].activities[0];
      }
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error loading transactions",
      text: error.message || "Could not fetch recent transactions",
      confirmButtonColor: "var(--dark-color-opposite-one)",
    });
  }
};

watch(
  () => props.params,
  (newParams) => {
    fetchTransactions(newParams);
  },
);

onMounted(() => {
  fetchTransactions(props.params);
});
</script>

<style scoped>
.last-transactions-container {
  width: 100%;
  padding: 0;
  margin-top: 1rem;
}

.table-wrapper {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--light-border);
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.modern-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.875rem;
  min-width: 1000px;
}

.modern-table thead {
  background-color: var(--dark-color);
  color: white;
}

.modern-table th {
  padding: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.75rem;
}

.modern-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--light-border);
  color: var(--text-black);
}

.modern-table tbody tr:hover {
  background-color: var(--normal-color);
}

.id-col {
  font-weight: 600;
  color: var(--dark-color-opposite-one);
}
.date-col {
  white-space: nowrap;
  color: #666;
}

.badge {
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.category {
  background-color: var(--light-color-opposite-two);
  color: var(--dark-color-opposite-one);
}

.accounts-col {
  display: flex;
  gap: 0.5rem;
}

.account-tag {
  font-family: monospace;
  font-size: 0.75rem;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
}

.account-tag.db {
  background-color: #dcfce7;
  color: #166534;
}
.account-tag.cr {
  background-color: #fee2e2;
  color: #991b1b;
}

.value-col {
  text-align: right;
  font-weight: 700;
  font-size: 1rem;
}

.detail-col {
  max-width: 300px; /* Increased slightly for better balance */
  font-size: 0.75rem;
  color: #64748b;
  line-height: 1.4;
  word-break: break-word; /* Ensure long words don't break layout */
  white-space: normal; /* Allow text to wrap to multiple lines */
}

.text-right {
  text-align: right;
}

.no-data {
  text-align: center;
  padding: 3rem;
  color: #666;
  background: white;
  border-radius: 12px;
  border: 1px dashed var(--light-border);
}
</style>
