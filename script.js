// Initialize expenses array from localStorage
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// Set today's date as default
const dateInput = document.getElementById('date');
const today = new Date().toISOString().split('T')[0];
dateInput.value = today;

// Event listeners
document.getElementById('expenseForm').addEventListener('submit', addExpense);
document.getElementById('clearAll').addEventListener('click', clearAllExpenses);
document.getElementById('filterCategory').addEventListener('input', filterExpenses);

// Add expense function
function addExpense(e) {
    e.preventDefault();

    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;

    if (!description || !amount || !category || !date) {
        alert('Please fill in all fields');
        return;
    }

    const expense = {
        id: Date.now(),
        description,
        amount,
        category,
        date
    };

    expenses.push(expense);
    saveToLocalStorage();
    renderExpenses();
    resetForm();
    updateSummary();
}

// Delete expense function
function deleteExpense(id) {
    if (confirm('Are you sure you want to delete this expense?')) {
        expenses = expenses.filter(expense => expense.id !== id);
        saveToLocalStorage();
        renderExpenses();
        updateSummary();
    }
}

// Clear all expenses
function clearAllExpenses() {
    if (confirm('Are you sure you want to delete all expenses? This cannot be undone.')) {
        expenses = [];
        saveToLocalStorage();
        renderExpenses();
        updateSummary();
    }
}

// Render expenses to table
function renderExpenses() {
    const tbody = document.getElementById('expensesTableBody');
    const noExpenses = document.getElementById('noExpenses');
    const filterValue = document.getElementById('filterCategory').value.toLowerCase();

    tbody.innerHTML = '';

    let filteredExpenses = expenses;
    if (filterValue) {
        filteredExpenses = expenses.filter(expense =>
            expense.category.toLowerCase().includes(filterValue)
        );
    }

    if (filteredExpenses.length === 0) {
        noExpenses.classList.add('show');
    } else {
        noExpenses.classList.remove('show');
        filteredExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));
        filteredExpenses.forEach(expense => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${formatDate(expense.date)}</td>
                <td>${expense.description}</td>
                <td><span class="category-badge">${expense.category}</span></td>
                <td>$${expense.amount.toFixed(2)}</td>
                <td><button class="btn-delete" onclick="deleteExpense(${expense.id})">Delete</button></td>
            `;
            tbody.appendChild(row);
        });
    }
}

// Update summary statistics
function updateSummary() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const currentWeek = getWeekNumber(now);

    let totalExpenses = 0;
    let monthExpenses = 0;
    let weekExpenses = 0;

    expenses.forEach(expense => {
        const expenseDate = new Date(expense.date);
        totalExpenses += expense.amount;

        if (expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear) {
            monthExpenses += expense.amount;
        }

        if (getWeekNumber(expenseDate) === currentWeek && expenseDate.getFullYear() === currentYear) {
            weekExpenses += expense.amount;
        }
    });

    document.getElementById('totalExpenses').textContent = `$${totalExpenses.toFixed(2)}`;
    document.getElementById('monthExpenses').textContent = `$${monthExpenses.toFixed(2)}`;
    document.getElementById('weekExpenses').textContent = `$${weekExpenses.toFixed(2)}`;
}

// Get week number
function getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

// Filter expenses by category
function filterExpenses() {
    renderExpenses();
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Reset form
function resetForm() {
    document.getElementById('expenseForm').reset();
    document.getElementById('date').value = today;
}

// Save to localStorage
function saveToLocalStorage() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Initial render
renderExpenses();
updateSummary();