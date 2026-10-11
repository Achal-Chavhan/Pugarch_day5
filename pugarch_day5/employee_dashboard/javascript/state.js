export class EmployeeStore {
  constructor(initialData = []) {
    this.employees = [...initialData];
    this.filters = {
      search: '',
      department: 'ALL',
      status: 'ALL',
      sortBy: 'name-asc'
    };
  }

  setFilter(field, value) {
    this.filters[field] = value;
  }

  getById(id) {
    return this.employees.find(emp => emp.id === Number(id));
  }

  add(employee) {
    const newEmp = {
      ...employee,
      id: Date.now(),
      joinedDate: new Date().toISOString().split('T')[0]
    };
    this.employees.unshift(newEmp);
    return newEmp;
  }

  update(id, updatedFields) {
    const numericId = Number(id);
    this.employees = this.employees.map(emp => 
      emp.id === numericId ? { ...emp, ...updatedFields } : emp
    );
  }

  delete(id) {
    const numericId = Number(id);
    this.employees = this.employees.filter(emp => emp.id !== numericId);
  }

  getProcessedEmployees() {
    const { search, department, status, sortBy } = this.filters;
    const searchLower = search.trim().toLowerCase();

    return this.employees
      .filter(emp => {
        const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
        const matchesSearch = !searchLower || 
          fullName.includes(searchLower) ||
          emp.email.toLowerCase().includes(searchLower) ||
          emp.role.toLowerCase().includes(searchLower);

        const matchesDept = department === 'ALL' || emp.department === department;
        const matchesStatus = status === 'ALL' || emp.status === status;

        return matchesSearch && matchesDept && matchesStatus;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'name-asc': return a.firstName.localeCompare(b.firstName);
          case 'name-desc': return b.firstName.localeCompare(a.firstName);
          case 'salary-desc': return b.salary - a.salary;
          case 'salary-asc': return a.salary - b.salary;
          case 'joined-desc': return new Date(b.joinedDate) - new Date(a.joinedDate);
          case 'joined-asc': return new Date(a.joinedDate) - new Date(b.joinedDate);
          default: return 0;
        }
      });
  }
}