const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d');

const colorBtns = document.querySelectorAll('.color-btn');
const clearBtn = document.getElementById('clearBtn');
const saveBtn = document.getElementById('saveBtn');
const loginBtns = document.querySelectorAll('.login-btn');

const usernameSpan = document.getElementById('username');
const userRoleSpan = document.getElementById('userRole');

const premiumColors = document.querySelectorAll('.premium-color');

const logoutBttn = document.getElementById('logout-bttn')


let currentColor = '#000000';
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let currentUser = {
    name: localStorage.getItem("login"),
    role: "guest"
};

function initCanvas() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = currentColor;
}

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

function draw(e) {
    if (!isDrawing) return;
    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.strokeStyle = currentColor;
    ctx.stroke();
    
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

function stopDrawing() {
    isDrawing = false;
}

colorBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        if (this.classList.contains('premium-color') && currentUser.role === 'guest') {
            alert("Эти цвета только для премиум-пользователей")
            return;
        }

        colorBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentColor = this.dataset.color;
    });
});

clearBtn.addEventListener('click', function() {
    if (confirm('Вы уверены, что хотите очистить холст?')) {
        initCanvas();
    }
    
});

saveBtn.addEventListener('click', function() {
    if (currentUser.role === 'admin') {
        const link = document.createElement('a');
        link.download = 'рисунок.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }
});

const isAdminRole = localStorage.getItem("isAdmin") === "true";
const isPremiumRole = localStorage.getItem("isPremium") === "true";

if (isAdminRole) {
    currentUser = {name: localStorage.getItem("login"), role: 'admin'};
} 

if (isPremiumRole) {
    currentUser = {name: localStorage.getItem("login"), role: "premium"};
}

updateUI();

function updateUI() {
    usernameSpan.textContent = currentUser.name;
    
    userRoleSpan.className = 'user-role';
    switch(currentUser.role) {
        case 'guest':
            userRoleSpan.classList.add('role-guest');
            userRoleSpan.textContent = 'Гость';
            break;
        case 'premium':
            userRoleSpan.classList.add('role-premium');
            userRoleSpan.textContent = 'Премиум';
            break;
        case 'admin':
            userRoleSpan.classList.add('role-admin');
            userRoleSpan.textContent = 'Админ';
            break;
    }
    
    document.querySelectorAll('.premium-color').forEach(color => {
        color.style.opacity = currentUser.role === 'guest' ? 0.1 : 1;
    });
    
    saveBtn.disabled = currentUser.role !== 'admin';
}

logoutBttn.addEventListener('click', function() {
    localStorage.clear();
    location.href="http://melon-egoist.ru/t1ht4"  
})

window.addEventListener('load', function() {
    initCanvas();
    updateUI();
    document.querySelector('.color-btn').click();
});
