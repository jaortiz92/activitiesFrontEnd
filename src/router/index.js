import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home.vue";
import Transaction from "../views/Transaction.vue";
import Edit from "../views/Edit.vue";
import DashboardView from "../views/DashboardView.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: DashboardView,
  },
  {
    path: "/transaction",
    name: "Transaction",
    component: Transaction,
  },
  {
    path: "/edit",
    name: "Edit",
    component: Edit,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
