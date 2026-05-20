const API = 'http://127.0.0.1:5000';
let menuItems = [];
let cart = [];
let selectedPayment = null;

const user = JSON.parse(localStorage.getItem('user'));
if (!user) window.location.href = 'index.html';

document.getElementById('cashierInfo').innerHTML = '<p>👤 ' + user.name + '</p><p style="color:#aaa; font-size:13px">' + user.role + '</p>';

function loadMenu() {
    fetch(API + '/api/menu')
    .then(function(res) { return res.json(); })
    .then(function(data) { menuItems = data; renderMenu(data); });
}

function renderMenu(items) {
    const grid = document.getElementById('menuGrid');
    grid.innerHTML = '';
    items.forEach(function(item) {
        if (!item.available) return;
        const card = document.createElement('div');
        card.className = 'menu-card';
        card.innerHTML = '<div class="menu-item-name">' + item.name + '</div><div class="menu-item-price">GHS ' + item.price.toFixed(2) + '</div><div class="menu-item-category">' + item.category + '</div>';
        card.onclick = function() { addToCart(item.id); };
        grid.appendChild(card);
    });
}

function filterMenu(category) {
    document.querySelectorAll('.filter-btn').forEach(function(btn) { btn.classList.remove('active'); });
    event.target.classList.add('active');
    if (category === 'All') { renderMenu(menuItems); }
    else { renderMenu(menuItems.filter(function(item) { return item.category === category; })); }
}

function addToCart(itemId) {
    const item = menuItems.find(function(i) { return i.id === itemId; });
    const existing = cart.find(function(i) { return i.id === itemId; });
    if (existing) { existing.quantity += 1; }
    else { cart.push({ id: item.id, name: item.name, price: item.price, category: item.category, quantity: 1 }); }
    renderCart();
}

function removeFromCart(itemId) {
    cart = cart.filter(function(i) { return i.id !== itemId; });
    renderCart();
}

function changeQty(itemId, change) {
    const item = cart.find(function(i) { return i.id === itemId; });
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) removeFromCart(itemId);
        else renderCart();
    }
}

function renderCart() {
    const orderItems = document.getElementById('orderItems');
    if (cart.length === 0) {
        orderItems.innerHTML = '<p class="empty-msg">No items added yet</p>';
        document.getElementById('subtotal').textContent = 'GHS 0.00';
        document.getElementById('total').textContent = 'GHS 0.00';
        return;
    }
    orderItems.innerHTML = '';
    let total = 0;
    cart.forEach(function(item) {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = '<div class="cart-item-info"><span class="cart-item-name">' + item.name + '</span><span class="cart-item-price">GHS ' + itemTotal.toFixed(2) + '</span></div><div class="cart-item-controls"><button onclick="changeQty(' + item.id + ', -1)">-</button><span>' + item.quantity + '</span><button onclick="changeQty(' + item.id + ', 1)">+</button><button class="remove-btn" onclick="removeFromCart(' + item.id + ')">X</button></div>';
        orderItems.appendChild(div);
    });
    document.getElementById('subtotal').textContent = 'GHS ' + total.toFixed(2);
    document.getElementById('total').textContent = 'GHS ' + total.toFixed(2);
}

function setPayment(method) {
    selectedPayment = method;
    document.querySelectorAll('.pay-btn').forEach(function(btn) { btn.classList.remove('active'); });
    event.target.classList.add('active');
    const labels = { cash: 'Cash', card: 'Card', momo: 'Mobile Money' };
    document.getElementById('selectedPayment').textContent = 'Payment: ' + labels[method];
}

function placeOrder() {
    if (cart.length === 0) return alert('Please add items to the order!');
    if (!selectedPayment) return alert('Please select a payment method!');
    const total = cart.reduce(function(sum, item) { return sum + item.price * item.quantity; }, 0);
    const order = { items: cart, total: total, payment_method: selectedPayment, cashier: user.name, branch: 'Main Branch' };
    fetch(API + '/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
        if (data.success) { alert('Order #' + data.order.id + ' placed successfully!'); clearOrder(); }
    });
}

function clearOrder() {
    cart = [];
    selectedPayment = null;
    document.querySelectorAll('.pay-btn').forEach(function(btn) { btn.classList.remove('active'); });
    document.getElementById('selectedPayment').textContent = 'No payment method selected';
    renderCart();
}

function logout() {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

loadMenu();