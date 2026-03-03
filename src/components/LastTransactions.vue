<template>
  <div class="LastTransactions">
    <table v-if="transactions" class="table-transactions">
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
          <th>Value</th>
          <th>Detail</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="transaction in transactions"
          :key="transaction.transaction_id"
        >
          <td class="item-number-value">{{ transaction.transaction_id }}</td>
          <td class="item-special-size">{{ transaction.transaction_date }}</td>
          <td>{{ transaction.category.category }}</td>
          <td>{{ transaction.description.description }}</td>
          <td>{{ transaction.kind.kind }}</td>
          <td>{{ transaction.origin.origin }}</td>
          <td>{{ transaction.destiny.origin }}</td>
          <td class="item-special-size">
            {{ showAccountOfActivity(transaction.activities[0]) }}|{{
              showAccountOfActivity(transaction.activities[1])
            }}
          </td>
          <td class="item-number-value">
            {{ formatterNumber(transaction.value) }}
          </td>
          <td class="item-detail-value">{{ transaction.detail }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import { transactionService } from "@/services/transactionService";
import { formatters } from "@/plugins/formatters.js";

export default {
  name: "LastTransactions",
  props: {
    params: String,
  },
  data: function () {
    return {
      transactions: null,
    };
  },
  mounted() {
    this.getLastTransactions(this.params);
  },
  methods: {
    async getLastTransactions(params) {
      try {
        const response = await transactionService.getLastTransactions(params);
        this.transactions = response.data;
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `ERROR: ${error}`,
          confirmButtonColor: "#141e28",
        });
      }
    },
    formatterNumber: function (value) {
      return formatters.formatterGeneralNumber(value);
    },
    showAccountOfActivity(value) {
      if (value !== undefined) {
        let stringValue = "DB";
        if (value.nature === "0") {
          stringValue = "CR";
        }
        return `${stringValue}-${value.account_id}`;
      } else {
        return `Error`;
      }
    },
  },
};
</script>
<style scoped>
.table-transactions {
  width: 95%;
  margin-right: auto;
  margin-left: auto;
  display: table;
  min-width: 1200px;
}

table {
  border: 1px solid var(--gray-border);
  border-spacing: 0px;
  width: 100%;
}
thead {
  background-color: var(--dark-color);
  width: 100%;
}
th {
  height: 30px;
  text-align: center;
  padding: 12px 15px;
  font-size: 110%;
  color: var(--light-color-opposite-two);
}

td {
  width: fit-content;
  text-align: left;
  padding: 2px 4px 2px 4px;
  font-size: 90%;
}

tbody tr:nth-child(even) {
  background-color: var(--normal-color);
}
tbody tr:nth-child(odd) {
  background-color: var(--light-color);
}
.item-detail-value {
  font-size: 75%;
}
.item-number-value {
  text-align: right;
}
.item-special-size {
  min-width: 85px;
}
</style>
