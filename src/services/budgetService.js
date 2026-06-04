import axios from '@/plugins/axios';

const API_URL = '/budget';

export const budgetService = {
  async getGroups() {
    const response = await axios.get(`${API_URL}/groups`);
    return response.data;
  },

  async createGroup(groupData) {
    const response = await axios.post(`${API_URL}/groups`, groupData);
    return response.data;
  },

  async createValue(valueData) {
    const response = await axios.post(`${API_URL}/values`, valueData);
    return response.data;
  },

  async getComparison(month, year, mode = "monthly") {
    const response = await axios.get(`${API_URL}/comparison`, {
      params: { month, year, mode }
    });
    return response.data;
  }
};
