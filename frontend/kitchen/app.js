const API = 'http://127.0.0.1:5000';

// Update clock
function updateTime() {
    const now = new Date();
    document.getElementById('currentTime').textContent = now.toLocaleTimeString();
}
setInterval(updateTime, 1000);
updateTime();

// Load orders
function loadOrders() {
    fetch(API + '/api/orders')
    .then(function(res) { return res.json(); })
    .then(function(orders) {
        renderOrders(orders);
    });
}

// Render orders
function renderOrders(orders) {
    const grid = document.getElementById('ordersGrid');

    const activeOrders = orders.filter(function(o) {
        return o.status === 'pending' || o.status === 'in-kitchen';
    });

    if (activeOrders.length === 0) {
        grid.innerHTML = '<p class="no-orders">No pending orders 🎉</p>';
        return;
    }

    grid.innerHTML = '';
    activeOrders.forEach(function(order) {
        const card = document.createElement('div');
        card.className = 'order-card';
        card.id = 'order-' + order.id;

        let itemsList = '';
        order.items.forEach(function(item) {
            itemsList += '<li>' + item.name + ' <span>x' + item.quantity + '</span></li>';
        });

        card.innerHTML = 
            '<div class="order-card-header">' +
                '<span class="order-number">Order #' + order.id + '</span>' +
                '<span class="order-time">' + order.created_at + '</span>' +
            '</div>' +
            '<ul class="order-items-list">' + itemsList + '</ul>' +
            '<div class="cashier-name">Cashier: ' + order.cashier + '</div>' +
            '<button class="done-btn" onclick="markDone(' + order.id + ')">DONE</button>';

        grid.appendChild(card);
    });
}

// Mark order as done
function markDone(orderId) {
    fetch(API + '/api/orders/' + orderId + '/status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'complete' })
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
        if (data.success) {
            const card = document.getElementById('order-' + orderId);
            card.classList.add('done');
            card.querySelector('.done-btn').disabled = true;
            card.querySelector('.done-btn').textContent = 'Completed';
            card.innerHTML += '<div class="completed-badge">✅ Order Complete</div>';

            setTimeout(function() {
                loadOrders();
            }, 2000);
        }
    });
}

// Auto refresh every 10 seconds
setInterval(loadOrders, 10000);

function logout() {
    window.location.href = '../cashier/index.html';
}

loadOrders();