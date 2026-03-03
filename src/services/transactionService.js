import axiosInstance from "@/plugins/axios";

export const transactionService = {
  getLastTransactions: function (params) {
    return axiosInstance.get(
      `/transaction/?${params}`
    );
  },
  postTransaction: function (transaction) {
    console.log(transaction);
    return axiosInstance.post(`/transaction/complete_post`, transaction);
  },
  deleteTransaction: function (transaction_id) {
    return axiosInstance.delete(`/transaction/${transaction_id}/delete`);
  },
  getAccounts: function () {
    return axiosInstance.get(`/account/`);
  },
  getCategories: function (group) {
    return axiosInstance.get(`/category/group/${group}`);
  },
  getDescriptions: function (group) {
    return axiosInstance.get(`/description/group/${group}`);
  },
  getKinds: function (group) {
    return axiosInstance.get(`/kind/group/${group}`);
  },
  getAllCategories: function () {
    return axiosInstance.get(`/category/`);
  },
  getAllDescriptions: function () {
    return axiosInstance.get(`/description/`);
  },
  getAllKinds: function () {
    return axiosInstance.get(`/kind/`);
  },
  getOrigins: function () {
    return axiosInstance.get(`/origin/`);
  },
};
