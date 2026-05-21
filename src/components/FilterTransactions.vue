<template>
  <div class="filter-card">
    <div class="filter-header">
      <h3 class="filter-title">Filters</h3>
    </div>
    <form @submit.prevent="submitFilters" class="filter-form">
      <div class="filter-grid">
        <div class="filter-item">
          <label>Transaction ID</label>
          <input
            type="number"
            min="0"
            v-model="filters.transaction_id"
            placeholder="Ex: 123"
          />
        </div>
        <div class="filter-item">
          <label>Start Date</label>
          <input type="date" v-model="filters.start_date" />
        </div>
        <div class="filter-item">
          <label>End Date</label>
          <input type="date" v-model="filters.end_date" />
        </div>
        <div class="filter-item">
          <label>Category</label>
          <select v-model="filters.category_id">
            <option :value="null">All Categories</option>
            <option
              v-for="option in categories"
              :key="option.category_id"
              :value="option.category_id"
            >
              {{ option.category }} => {{ option.group.group }}
            </option>
          </select>
        </div>
        <div class="filter-item">
          <label>Description</label>
          <select v-model="filters.description_id">
            <option :value="null">All Descriptions</option>
            <option
              v-for="option in descriptions"
              :key="option.description_id"
              :value="option.description_id"
            >
              {{ option.description }} => {{ option.group.group }}
            </option>
          </select>
        </div>
        <div class="filter-item">
          <label>Kind</label>
          <select v-model="filters.kind_id">
            <option :value="null">All Kinds</option>
            <option
              v-for="option in kinds"
              :key="option.kind_id"
              :value="option.kind_id"
            >
              {{ option.kind }} => {{ option.group.group }}
            </option>
          </select>
        </div>
        <div class="filter-item">
          <label>Origin</label>
          <select v-model="filters.origin_id">
            <option :value="null">All Origins</option>
            <option
              v-for="option in origins"
              :key="option.origin_id"
              :value="option.origin_id"
            >
              {{ option.origin }}
            </option>
          </select>
        </div>
        <div class="filter-item">
          <label>Destiny</label>
          <select v-model="filters.destiny_id">
            <option :value="null">All Destinies</option>
            <option
              v-for="option in origins"
              :key="option.origin_id"
              :value="option.origin_id"
            >
              {{ option.origin }}
            </option>
          </select>
        </div>

        <div class="filter-item">
          <label>Min Value</label>
          <input
            type="number"
            step="0.01"
            v-model="filters.min_value"
            placeholder="0.00"
          />
        </div>
        <div class="filter-item">
          <label>Max Value</label>
          <input
            type="number"
            step="0.01"
            v-model="filters.max_value"
            placeholder="0.00"
          />
        </div>

        <div class="filter-item">
          <label>Rows (Limit)</label>
          <input type="number" max="1000" v-model="filters.limit" />
        </div>
        <div class="filter-item full-width">
          <label>Search Detail</label>
          <input
            type="text"
            v-model="filters.detail"
            placeholder="Search keywords..."
          />
        </div>
      </div>

      <div class="filter-actions">
        <button type="button" @click="clearFilters" class="btn-clear">
          Reset Filters
        </button>
        <button type="submit" class="btn-apply">Apply Filters</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import { transactionService } from "../services/transactionService";

const emit = defineEmits(["apply-filters"]);

const initialState = {
  transaction_id: null,
  start_date: "",
  end_date: "",
  category_id: null,
  description_id: null,
  kind_id: null,
  origin_id: null,
  destiny_id: null,
  min_value: null,
  max_value: null,
  detail: "",
  skip: 0,
  limit: 50,
};

const filters = reactive({ ...initialState });
const categories = ref([]);
const descriptions = ref([]);
const kinds = ref([]);
const origins = ref([]);

onMounted(async () => {
  categories.value = (await transactionService.getAllCategories()).data;
  descriptions.value = (await transactionService.getAllDescriptions()).data;
  kinds.value = (await transactionService.getAllKinds()).data;
  origins.value = (await transactionService.getOrigins()).data;
});

const submitFilters = () => {
  emit("apply-filters", { ...filters });
};

const clearFilters = () => {
  Object.assign(filters, initialState);
  submitFilters();
};
</script>

<style scoped>
/* Reset box-sizing for this component to prevent padding/border overflow issues */
* {
  box-sizing: border-box;
}

.filter-card {
  background: white;
  border-radius: 12px;
  border: 1px solid var(--light-border);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 100%;
  margin: 0;
  display: block;
  overflow: hidden; /* Keep header and form contained */
}

.filter-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--light-border);
  background: #fcfcfc;
}

.filter-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--dark-color);
}

/* 
  Reset and override global form styles from App.vue.
  Using a very high specificity to ensure we win against global 'form' selector.
*/
.filter-card .filter-form {
  padding: 1.5rem !important;
  width: 100% !important;
  max-width: 100% !important;
  margin: 0 !important;
  border: none !important;
  background: transparent !important;
  display: flex !important;
  flex-direction: column !important;
  box-sizing: border-box !important;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
  align-items: end;
  width: 100%;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  min-width: 0; /* Prevents grid items from forcing overflow */
}

.filter-item.full-width {
  grid-column: 1 / -1;
}

.filter-item label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  width: 100% !important;
  margin: 0 0 0.25rem 0 !important;
  display: block !important;
  text-align: left !important;
}

.filter-item input,
.filter-item select {
  width: 100% !important;
  padding: 0.625rem 0.75rem !important;
  border: 1px solid #e2e8f0 !important;
  border-radius: 6px !important;
  font-size: 0.875rem !important;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  margin: 0 !important;
  box-sizing: border-box !important;
  height: 40px; /* Force consistent height */
}

.filter-item input:focus,
.filter-item select:focus {
  outline: none !important;
  border-color: var(--dark-color) !important;
  box-shadow: 0 0 0 3px rgba(102, 125, 78, 0.1) !important;
}

.filter-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--light-border);
  width: 100%;
}

.btn-clear {
  background: transparent !important;
  color: #64748b !important;
  border: 1px solid #e2e8f0 !important;
  padding: 0.625rem 1.25rem !important;
  font-size: 0.875rem !important;
  border-radius: 6px !important;
  font-weight: 600 !important;
  cursor: pointer;
}

.btn-clear:hover {
  background: #f8fafc !important;
  border-color: #cbd5e1 !important;
}

.btn-apply {
  background: var(--dark-color) !important;
  color: white !important;
  padding: 0.625rem 1.5rem !important;
  font-size: 0.875rem !important;
  border-radius: 6px !important;
  font-weight: 600 !important;
  cursor: pointer;
}

.btn-apply:hover {
  background: var(--dark-color-opposite-one) !important;
}

@media (max-width: 600px) {
  .filter-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .filter-actions {
    flex-direction: column-reverse;
  }

  .btn-clear,
  .btn-apply {
    width: 100% !important;
  }
}
</style>
