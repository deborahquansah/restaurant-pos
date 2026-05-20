const API = 'http://127.0.0.1:5000';
const isLoginPage = window.location.href.includes('login.html');

// LOGIN FUNCTION
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('errorMsg');

    fetch(API + '/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username, password: password })
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
        if (data.success && data.user.role === 'manager') {
            localStorage.setItem('user', JSON.stringify(data.user));
            window.location.href = 'index.html';
        } else {
            errorMsg.style.display = 'block';
        }
    })
    .catch(function() {
        errorMsg.style.display = 'block';
    });
}

document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && document.getElementById('username')) login();
});

// STOP HERE IF ON LOGIN PAGE
if (!isLoginPage) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) window.location.href = 'login.html';

    document.getElementById('managerInfo').innerHTML = '<p>👤 ' + user.name + '</p><p style="color:#aaa; font-size:13px">' + user.role + '</p>';

    const now = new Date();
    document.getElementById('dateDisplay').textContent = now.toDateString();

    function loadDashboard() {
        fetch(API + '/api/orders')
        .then(function(res) { return res.json(); })
        .then(function(orders) {
            renderSummary(orders);
            renderRecentOrders(orders);
        });

        fetch(API + '/api/inventory')
        .then(function(res) { return res.json(); })
        .then(function(inventory) {
            renderLowStock(inventory);
        });
    }

    function renderSummary(orders) {
        const total = orders.reduce(function(sum, o) { return sum + o.total; }, 0);
        const completed = orders.filter(function(o) { return o.status === 'complete'; });
        const pending = orders.filter(function(o) { return o.status !== 'complete'; });
        const cash = orders.filter(function(o) { return o.payment_method === 'cash'; }).reduce(function(sum, o) { return sum + o.total; }, 0);
        const momo = orders.filter(function(o) { return o.payment_method === 'momo'; }).reduce(function(sum, o) { return sum + o.total; }, 0);
        const card = orders.filter(function(o) { return o.payment_method === 'card'; }).reduce(function(sum, o) { return sum + o.total; }, 0);

        document.getElementById('totalOrders').textContent = orders.length;
        document.getElementById('totalSales').textContent = 'GHS ' + total.toFixed(2);
        document.getElementById('completedOrders').textContent = completed.length;
        document.getElementById('pendingOrders').textContent = pending.length;
        document.getElementById('cashTotal').textContent = 'GHS ' + cash.toFixed(2);
        document.getElementById('momoTotal').textContent = 'GHS ' + momo.toFixed(2);
        document.getElementById('cardTotal').textContent = 'GHS ' + card.toFixed(2);
    }

    function renderRecentOrders(orders) {
        const tbody = document.getElementById('recentOrdersBody');
        if (orders.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; color:#aaa; padding:30px;">No orders yet</td></tr>';
            return;
        }
        tbody.innerHTML = '';
        const recent = orders.slice().reverse().slice(0, 10);
        recent.forEach(function(order) {
            const itemNames = order.items.map(function(i) { return i.name + ' x' + i.quantity; }).join(', ');
            const statusClass = order.status === 'complete' ? 'status-complete' : 'status-pending';
            const statusLabel = order.status === 'complete' ? '✅ Complete' : '⏳ Pending';
            const paymentIcons = { cash: '💵 Cash', card: '💳 Card', momo: '📱 MoMo' };

            const row = document.createElement('tr');
            row.innerHTML =
                '<td>#' + order.id + '</td>' +
                '<td class="items-cell">' + itemNames + '</td>' +
                '<td style="color:#E94560; font-weight:700;">GHS ' + order.total.toFixed(2) + '</td>' +
                '<td>' + (paymentIcons[order.payment_method] || order.payment_method) + '</td>' +
                '<td>' + order.cashier + '</td>' +
                '<td>' + order.branch + '</td>' +
                '<td>' + order.created_at + '</td>' +
                '<td><span class="' + statusClass + '">' + statusLabel + '</span></td>';
            tbody.appendChild(row);
        });
    }

    function renderLowStock(inventory) {
        const tbody = document.getElementById('lowStockBody');
        const lowItems = inventory.filter(function(i) { return i.quantity <= i.low_stock; });

        if (lowItems.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:#2ECC71; padding:30px;">✅ All items are well stocked!</td></tr>';
            return;
        }

        tbody.innerHTML = '';
        lowItems.forEach(function(item) {
            const statusLabel = item.quantity === 0 ? '❌ Out of Stock' : '⚠️ Low Stock';
            const statusClass = item.quantity === 0 ? 'status-pending' : 'status-low';

            const row = document.createElement('tr');
            row.innerHTML =
                '<td style="font-weight:600;">' + item.item + '</td>' +
                '<td style="font-size:18px; font-weight:700; color:#E94560;">' + item.quantity + '</td>' +
                '<td style="color:#aaa;">' + item.unit + '</td>' +
                '<td style="color:#F39C12;">' + item.low_stock + ' ' + item.unit + '</td>' +
                '<td><span class="' + statusClass + '">' + statusLabel + '</span></td>';
            tbody.appendChild(row);
        });
    }

    function logout() {
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    }

    loadDashboard();
    setInterval(loadDashboard, 30000);
}
// MANAGE PAGE FUNCTIONS
function loadEmployees() {
    fetch(API + '/api/users')
    .then(function(res) { return res.json(); })
    .then(function(data) { renderEmployees(data); });
}

function renderEmployees(employees) {
    const list = document.getElementById('employeeList');
    if (!list) return;
    list.innerHTML = '';
    employees.forEach(function(emp) {
        const roleColor = emp.role === 'manager' ? '#E94560' : emp.role === 'cashier' ? '#2ECC71' : '#F39C12';
        const div = document.createElement('div');
        div.className = 'list-item';
        div.innerHTML =
            '<div class="list-item-info">' +
                '<span class="list-item-name">' + emp.name + '</span>' +
                '<span class="list-item-sub">@' + emp.username + '</span>' +
            '</div>' +
            '<span class="role-badge" style="background-color:' + roleColor + '">' + emp.role + '</span>';
        list.appendChild(div);
    });
}

function addEmployee() {
    const name = document.getElementById('empName').value.trim();
    const username = document.getElementById('empUsername').value.trim();
    const password = document.getElementById('empPassword').value.trim();
    const role = document.getElementById('empRole').value;
    const success = document.getElementById('empSuccess');
    const error = document.getElementById('empError');

    success.style.display = 'none';
    error.style.display = 'none';

    if (!name || !username || !password) {
        error.style.display = 'block';
        return;
    }

    fetch(API + '/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, username: username, password: password, role: role })
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
        if (data.success) {
            success.style.display = 'block';
            document.getElementById('empName').value = '';
            document.getElementById('empUsername').value = '';
            document.getElementById('empPassword').value = '';
            loadEmployees();
        } else {
            error.textContent = '❌ ' + data.message;
            error.style.display = 'block';
        }
    });
}

function loadMenuItems() {
    fetch(API + '/api/menu')
    .then(function(res) { return res.json(); })
    .then(function(data) { renderMenuItems(data); });
}

function renderMenuItems(items) {
    const list = document.getElementById('menuList');
    if (!list) return;
    list.innerHTML = '';
    items.forEach(function(item) {
        const div = document.createElement('div');
        div.className = 'list-item';
        div.innerHTML =
            '<div class="list-item-info">' +
                '<span class="list-item-name">' + item.name + '</span>' +
                '<span class="list-item-sub">' + item.category + '</span>' +
            '</div>' +
            '<span class="price-badge">GHS ' + item.price.toFixed(2) + '</span>';
        list.appendChild(div);
    });
}

function addMenuItem() {
    const name = document.getElementById('menuName').value.trim();
    const price = parseFloat(document.getElementById('menuPrice').value);
    const category = document.getElementById('menuCategory').value;
    const available = document.getElementById('menuAvailable').value === 'true';
    const success = document.getElementById('menuSuccess');
    const error = document.getElementById('menuError');

    success.style.display = 'none';
    error.style.display = 'none';

    if (!name || isNaN(price)) {
        error.style.display = 'block';
        return;
    }

    fetch(API + '/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, price: price, category: category, available: available })
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
        if (data.success) {
            success.style.display = 'block';
            document.getElementById('menuName').value = '';
            document.getElementById('menuPrice').value = '';
            loadMenuItems();
        } else {
            error.style.display = 'block';
        }
    });
}

// Load manage page data if on manage page
if (window.location.href.includes('manage.html')) {
    loadEmployees();
    loadMenuItems();
}