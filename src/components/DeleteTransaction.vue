<template>
  <div class="delete-transaction-card">
    <div class="card-header">
      <h3 class="card-title">Delete Transaction</h3>
      <p class="card-subtitle">
        Enter the unique ID of the transaction you wish to remove.
      </p>
    </div>

    <form class="delete-form" @submit.prevent="handleDelete">
      <div class="input-action-group">
        <div class="form-group">
          <label class="form-label">Transaction ID</label>
          <input
            class="form-input"
            v-model="transaction_id"
            type="number"
            min="1"
            placeholder="e.g. 1234"
            required
          />
        </div>
        <button class="btn-delete" type="submit" :disabled="!transaction_id">
          <span class="btn-text">Delete Permanently</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, defineEmits } from "vue";
import Swal from "sweetalert2";
import { transactionService } from "../services/transactionService";

const emit = defineEmits(["updatePag"]);
const transaction_id = ref(null);

const handleDelete = async () => {
  if (!transaction_id.value) return;

  const result = await Swal.fire({
    title: "Are you sure?",
    text: `Transaction ID ${transaction_id.value} will be permanently removed. This action cannot be undone.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444", // Red for destructive action
    cancelButtonColor: "#64748b",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  });

  if (result.isConfirmed) {
    try {
      await transactionService.deleteTransaction(transaction_id.value);

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: `Transaction ${transaction_id.value} has been removed.`,
        confirmButtonColor: "var(--dark-color-opposite-one)",
      });

      transaction_id.value = null;
      emit("updatePag");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Deletion Failed",
        text:
          error.message ||
          "An error occurred while trying to delete the transaction.",
        confirmButtonColor: "var(--dark-color-opposite-one)",
      });
    }
  }
};
</script>

<style scoped>
.delete-transaction-card {
  background-color: white;
  border-radius: 16px;
  border: 1px solid var(--light-border);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 100%;
}

.card-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--light-border);
  background-color: #fff1f2; /* Subtle red tint to indicate destructive area */
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #991b1b;
  margin-bottom: 0.25rem;
}

.card-subtitle {
  color: #7f1d1d;
  font-size: 0.875rem;
  opacity: 0.8;
}

.delete-form {
  padding: 2rem;
}

.input-action-group {
  display: flex;
  align-items: flex-end;
  gap: 1.5rem;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
}

.form-input {
  padding: 0.75rem 1rem;
  border: 1px solid var(--light-border);
  border-radius: 10px;
  font-size: 0.9375rem;
  transition: all 0.2s ease;
  width: 80%;
  background-color: #fff;
}

.form-input:focus {
  outline: none;
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.btn-delete {
  background-color: #ef4444;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  height: 46px; /* Match input height */
  margin: 5px;
}

.btn-delete:hover:not(:disabled) {
  background-color: #dc2626;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
}

.btn-delete:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .input-action-group {
    flex-direction: column;
    align-items: stretch;
  }

  .btn-delete {
    width: 100%;
  }
}
</style>
