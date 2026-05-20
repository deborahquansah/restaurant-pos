const API = 'http://127.0.0.1:5000';
let allInventory = [];

const user = JSON.parse(localStorage.getItem('user'));
if (!user) window.location.href = 'index.html';

document.getElementById('cashierInfo').innerHTML = '<p>👤 ' + user.name + '</p><p style="color:#aaa; font-size:13px">' + user.role + '</p>';

function loadInventory() {
    fetch(API + '/api/inventory')
    .then(function(res) { return res.json(); })
    .then(function(data) {
        allInventory = data;
        renderInventory(data);
        renderSummary(data);
    });
}

function renderSummary(items) {
    const low = items.filter(function(i) { return i.quantity <= i.low_stock && i.quantity > 0; });
    const out = items.filter(function(i) { return i.quantity === 0; });
    document.getElementById('totalItems').textContent = items.length;
    document.getElementById('lowStockCount').textContent = low.length;
    document.getElementById('outOfStock').textContent = out.length;
}

function renderInventory(items) {
    const tbody = document.getElementById('inventoryTableBody');
    if (items.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:#aaa; padding:30px;">No items found</td></tr>';
        return;
    }
    tbody.innerHTML = '';
    items.forEach(function(item) {
        let statusLabel, statusClass;
        if (item.quantity === 0) {
            statusLabel = '❌ Out of Stock';
            statusClass = 'status-pending';
        } else if (item.quantity <= item.low_stock) {
            statusLabel = '⚠️ Low Stock';
            statusClass = 'status-low';
        } else {
            statusLabel = '✅ In Stock';
            statusClass = 'status-complete';
        }

        const row = document.createElement('tr');
        row.innerHTML =
            '<td>' + item.id + '</td>' +
            '<td style="font-weight:600;">' + item.item + '</td>' +
            '<td style="font-size:18px; font-weight:700; color:#E94560;">' + item.quantity + '</td>' +
            '<td style="color:#aaa;">' + item.unit + '</td>' +
            '<td style="color:#F39C12;">' + item.low_stock + ' ' + item.unit + '</td>' +
            '<td><span class="' + statusClass + '">' + statusLabel + '</span></td>';
        tbody.appendChild(row);
    });
}

function filterInventory(type) {
    document.querySelectorAll('.filter-btn').forEach(function(btn) { btn.classList.remove('active'); });
    event.target.classList.add('active');
    if (type === 'all') {
        renderInventory(allInventory);
    } else {
        const low = allInventory.filter(function(i) { return i.quantity <= i.low_stock; });
        renderInventory(low);
    }
}

function logout() {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

loadInventory();