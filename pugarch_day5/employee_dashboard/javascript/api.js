const STORAGE_KEY = 'dashboard_employees_v1';

export const ApiService = {
  async fetchEmployees() {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) return JSON.parse(cached);

    try {
      const response = await fetch('./data/employee.json');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return data;
    } catch (err) {
      console.warn('Fetch fallback to empty list:', err);
      return [];
    }
  },

  async saveEmployees(employees) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
    return employees;
  }
};