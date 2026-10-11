# Pugarch_day5

Day 05 - JavaScript Employee Dashboard

A responsive, dependency-free Employee Management Dashboard built using modern vanilla JavaScript (ES6+), semantic HTML5, and clean CSS3. It consumes initial seed data from a local JSON dataset and supports full CRUD (Create, Read, Update, Delete) operations with search, multi-field filtering, and sorting capabilities.

📁 Project Structure

day-05/
├── javascript/
│   └── employee-dashboard/
│       ├── data/
│       │   └── employee.json       # Seed mock employee data
│       ├── js/
│       │   ├── api.js              # Fetch abstraction & localStorage persistence
│       │   ├── state.js            # In-memory store, search, filtering, and sorting
│       │   └── app.js              # DOM rendering, event delegation, and modal handlers
│       ├── index.html              # Accessible UI layout & modal templates
│       └── style.css               # Clean styling, badges, and responsive tables
└── README.md                       # Documentation & instructions


🚀 Features

Data Ingestion & Storage: Loads initial records from data/employee.json via native fetch() and persists all updates to the browser's localStorage.

Search (Debounced): Real-time search across employee first names, last names, email addresses, and roles with a 200ms debounce buffer to optimize performance.

Dynamic Filters:

By Department (Engineering, Design, Marketing, Human Resources, or All).

By Status (Active, On Leave, Terminated, or All).

Multi-Field Sorting:

Alphabetical: First Name (A–Z and Z–A).

Compensation: Salary (High to Low / Low to High).

Tenure: Date Joined (Newest first / Oldest first).

CRUD Operations:

Create: Add new team members via a modal form with auto-generated unique IDs and current join date stamps.

Read: Display all staff in a structured data table; view detailed single-profile metrics in an accessible modal dialog.

Update: Edit existing personnel data in-place without page reloads.

Delete: Safely remove records with a confirmation prompt.

Accessible UI: Uses native HTML5 <dialog> elements with built-in modal backdrops and focus management.

🛠️ Technology Stack

HTML5: Semantic tags (<main>, <dialog>, <table>, <section>).

CSS3: Modern design system using CSS Custom Properties (variables), Flexbox, CSS Grid, and responsive tables.

JavaScript (ES6+): Standard ES Modules (import/export), async/await, Array pipeline methods (filter, sort, map), and native Intl.NumberFormat for currency formatting.

External Libraries: Zero (no React, jQuery, Tailwind, or external scripts).

💻 Getting Started

Because the application uses native ES modules (type="module") and the fetch API, it must be hosted on a local web server (avoid double-clicking index.html via the file:/// protocol).

Option 1: Using VS Code Live Server (Recommended)

Install the Live Server extension in VS Code.

Right-click index.html inside the employee-dashboard folder.

Select "Open with Live Server".

The dashboard will launch automatically at http://127.0.0.1:5500.

Option 2: Using Node.js / npx

Open your terminal in the dashboard directory:

cd javascript/employee-dashboard
npx.cmd serve .
# Or on macOS/Linux:
# npx serve .


Option 3: Using Python 3

cd javascript/employee-dashboard
python -m http.server 8000


Then visit http://localhost:8000 in your web browser.

🧪 Form Validation Rules

When adding or editing an employee:

First Name & Last Name: Required, non-empty text strings.

Work Email: Required, validated against standard email format (user@domain.ext).

Department & Role: Required field selections.

Annual Salary: Positive number greater than 0.
