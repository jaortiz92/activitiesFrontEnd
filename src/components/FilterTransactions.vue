<template>
  <div class="filter-card">
    <form @submit.prevent="submitFilters" class="filter-grid">
      <div class="filter-items">
        <div class="filter-item">
          <label>Transaction ID</label>
          <input type="number" min="0" v-model="filters.transaction_id" />
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
          <input type="number" step="0.01" v-model="filters.min_value" />
        </div>
        <div class="filter-item">
          <label>Max Value</label>
          <input type="number" step="0.01" v-model="filters.max_value" />
        </div>

        <div class="filter-item">
          <label>Rows (Limit)</label>
          <input type="number" max="1000" v-model="filters.limit" />
        </div>
        <div class="filter-item full-width">
          <label>Detail</label>
          <input
            type="text"
            v-model="filters.detail"
            placeholder="Search by detail..."
          />
        </div>
      </div>

      <div class="filter-actions">
        <button type="button" @click="clearFilters" class="btn-secondary">
          Clear
        </button>
        <button type="submit" class="btn-primary">Apply Filters</button>
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
form {
  display: block;
  width: 70%;
  background: var(--background);
  padding: 4%;
  margin-bottom: 20px;
}

.filter-items {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.filter-item label {
  width: 100%;
  text-align: left;
  margin: 1%;
}

.filter-item {
  flex: 1 1 calc(40% - 200px);
  display: flex;
  flex-direction: column;
  padding: 2px;
  min-width: 300px;
}

.filter-actions {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}
</style>
