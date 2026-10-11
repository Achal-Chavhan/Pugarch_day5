import { ApiService } from './api.js';
import { EmployeeStore } from './state.js';

let store;

const elements = {
  tableBody: document.getElementById('employee-table-body'),
  emptyState: document.getElementById('empty-state'),
  metricCount: document.getElementById('metric-count'),
  modal: document.getElementById('employee-modal'),
  modalTitle: document.getElementById('modal-title'),
  form: document.getElementById('employee-form'),
  detailsModal: document.getElementById('details-modal'),
  detailsBody: document.getElementById('details-body')
};

function formatCurrency(val) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
}

function getBadgeClass(status) {
  if (status === 'Active') return 'badge-active';
  if (status === 'On Leave') return 'badge-on-leave';
  return 'badge-terminated';
}

function render() {
  const employees = store.getProcessedEmployees();
  elements.metricCount.textContent = employees.length;

  if (employees.length === 0) {
    elements.tableBody.innerHTML = '';
    elements.emptyState.classList.remove('hidden');
    return;
  }

  elements.emptyState.classList.add('hidden');
  elements.tableBody.innerHTML = employees.map(emp => `
    <tr>
      <td><strong>${emp.firstName} ${emp.lastName}</strong></td>
      <td>${emp.email}</td>
      <td>${emp.department}</td>
      <td>${emp.role}</td>
      <td>${formatCurrency(emp.salary)}</td>
      <td><span class="badge ${getBadgeClass(emp.status)}">${emp.status}</span></td>
      <td>
        <div class="btn-group">
          <button class="btn-action" data-action="view" data-id="${emp.id}">View</button>
          <button class="btn-action" data-action="edit" data-id="${emp.id}">Edit</button>
          <button class="btn-action btn-delete" data-action="delete" data-id="${emp.id}">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
}

async function sync() {
  render();
  await ApiService.saveEmployees(store.employees);
}

async function init() {
  const data = await ApiService.fetchEmployees();
  store = new EmployeeStore(data);
  render();

  // Search & Filters
  let timer;
  document.getElementById('search-input').addEventListener('input', (e) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      store.setFilter('search', e.target.value);
      render();
    }, 200);
  });

  document.getElementById('filter-department').addEventListener('change', (e) => {
    store.setFilter('department', e.target.value);
    render();
  });

  document.getElementById('filter-status').addEventListener('change', (e) => {
    store.setFilter('status', e.target.value);
    render();
  });

  document.getElementById('sort-by').addEventListener('change', (e) => {
    store.setFilter('sortBy', e.target.value);
    render();
  });

  // Modal open / close
  document.getElementById('btn-add-employee').addEventListener('click', () => {
    elements.modalTitle.textContent = 'Add Employee';
    elements.form.reset();
    document.getElementById('employee-id').value = '';
    elements.modal.showModal();
  });

  document.getElementById('modal-close-btn').addEventListener('click', () => elements.modal.close());
  document.getElementById('modal-cancel-btn').addEventListener('click', () => elements.modal.close());
  document.getElementById('details-close-btn').addEventListener('click', () => elements.detailsModal.close());

  // Form Save
  elements.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('employee-id').value;
    const payload = {
      firstName: document.getElementById('first-name').value.trim(),
      lastName: document.getElementById('last-name').value.trim(),
      email: document.getElementById('email').value.trim(),
      department: document.getElementById('department').value,
      role: document.getElementById('role').value.trim(),
      salary: Number(document.getElementById('salary').value),
      status: document.getElementById('status').value
    };

    if (id) {
      store.update(id, payload);
    } else {
      store.add(payload);
    }

    await sync();
    elements.modal.close();
  });

  // Table row actions (View / Edit / Delete)
  elements.tableBody.addEventListener('click', async (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;

    const action = btn.dataset.action;
    const emp = store.getById(btn.dataset.id);
    if (!emp) return;

    if (action === 'view') {
      elements.detailsBody.innerHTML = `
        <p><strong>Full Name:</strong> ${emp.firstName} ${emp.lastName}</p>
        <p><strong>Email:</strong> ${emp.email}</p>
        <p><strong>Department:</strong> ${emp.department}</p>
        <p><strong>Role:</strong> ${emp.role}</p>
        <p><strong>Salary:</strong> ${formatCurrency(emp.salary)}</p>
        <p><strong>Status:</strong> ${emp.status}</p>
        <p><strong>Joined:</strong> ${emp.joinedDate}</p>
      `;
      elements.detailsModal.showModal();
    } else if (action === 'edit') {
      elements.modalTitle.textContent = 'Edit Employee';
      document.getElementById('employee-id').value = emp.id;
      document.getElementById('first-name').value = emp.firstName;
      document.getElementById('last-name').value = emp.lastName;
      document.getElementById('email').value = emp.email;
      document.getElementById('department').value = emp.department;
      document.getElementById('role').value = emp.role;
      document.getElementById('salary').value = emp.salary;
      document.getElementById('status').value = emp.status;
      elements.modal.showModal();
    } else if (action === 'delete') {
      if (confirm(`Delete ${emp.firstName} ${emp.lastName}?`)) {
        store.delete(emp.id);
        await sync();
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', init);