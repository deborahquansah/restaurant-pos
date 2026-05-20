const API = 'http://127.0.0.1:5000';
let allOrders = [];

const user = JSON.parse(localStorage.getItem('user'));
if (!user) window.location.href = 'index.html';

document.getElementById('cashierInfo').innerHTML = '<p>👤 ' + user.name + '</p><p style="color:#aaa; font-size:13px">' + user.role + '</p>';

function loadOrders() {
    fetch(API + '/api/orders')
    .then(function(res) { return res.json(); })
    .then(function(data) {
        allOrders = data;
        renderOrders(data);
        renderSummary(data);
    });
}

function renderSummary(orders) {
    const total = orders.reduce(function(sum, o) { return sum + o.total; }, 0);
    const cash = orders.filter(function(o) { return o.payment_method === 'cash'; }).reduce(function(sum, o) { return sum + o.total; }, 0);
    const momo = orders.filter(function(o) { return o.payment_method === 'momo'; }).reduce(function(sum, o) { return sum + o.total; }, 0);
    const card = orders.filter(function(o) { return o.payment_method === 'card'; }).reduce(function(sum, o) { return sum + o.total; }, 0);

    document.getElementById('totalOrders').textContent = orders.length;
    document.getElementById('totalSales').textContent = 'GHS ' + total.toFixed(2);
    document.getElementById('totalCash').textContent = 'GHS ' + cash.toFixed(2);
    document.getElementById('totalMomo').textContent = 'GHS ' + momo.toFixed(2);
    document.getElementById('totalCard').textContent = 'GHS ' + card.toFixed(2);
}

function renderOrders(orders) {
    const tbody = document.getElementById('ordersTableBody');
    if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:#aaa; padding:30px;">No orders found</td></tr>';
        return;
    }
    tbody.innerHTML = '';
    orders.forEach(function(order) {
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
            '<td>' + order.created_at + '</td>' +
            '<td><span class="' + statusClass + '">' + statusLabel + '</span></td>';
        tbody.appendChild(row);
    });
}

function filterOrders(status) {
    document.querySelectorAll('.filter-btn').forEach(function(btn) { btn.classList.remove('active'); });
    event.target.classList.add('active');
    if (status === 'all') {
        renderOrders(allOrders);
        renderSummary(allOrders);
    } else {
        const filtered = allOrders.filter(function(o) { return o.status === status; });
        renderOrders(filtered);
        renderSummary(filtered);
    }
}

function logout() {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

loadOrders();