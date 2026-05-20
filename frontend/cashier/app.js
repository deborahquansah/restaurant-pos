const API = 'http://127.0.0.1:5000';

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('errorMsg');

    fetch(`${API}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            // Save user info
            localStorage.setItem('user', JSON.stringify(data.user));

            // Redirect based on role
            if (data.user.role === 'cashier') {
                window.location.href = 'home.html';
            } else if (data.user.role === 'manager') {
                window.location.href = '../manager/index.html';
            } else if (data.user.role === 'kitchen') {
                window.location.href = '../kitchen/index.html';
            }
        } else {
            errorMsg.style.display = 'block';
        }
    })
    .catch(err => {
        errorMsg.style.display = 'block';
        console.error(err);
    });
}

// Allow pressing Enter to login
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') login();
});