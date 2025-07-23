document.getElementById('registrationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    document.querySelectorAll('.error').forEach(el => el.style.display = 'none');
    
    const login = document.getElementById('login').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    const isAdmin = document.getElementById('admin-sub').checked;
    const isPremium = document.getElementById('premium-sub').checked;
    
    let isValid = true;
    
    if (login === '') {
        document.getElementById('loginError').style.display = 'block';
        isValid = false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        document.getElementById('emailError').style.display = 'block';
        isValid = false;
    }
    
    if (password.length < 6) {
        document.getElementById('passwordError').style.display = 'block';
        isValid = false;
    }
    
    if (password !== confirmPassword) {
        document.getElementById('confirmPasswordError').style.display = 'block';
        isValid = false;
    }

    const roles = ["GUEST"];

    if (isAdmin) roles.push("ADMIN");
    if (isPremium) roles.push("PREMIUM_USER");

    
    if (isValid) {
        const formData = {
            login: login,
            email: email,
            password: password,
            roles: roles
        };
        
        fetch('http://melon-egoist.ru:8081/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка сети');
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('registrationForm').style.display = 'none';
            document.getElementById('successMessage').style.display = 'block';
            document.getElementById('loginMessage').innerHTML = 'Теперь вы можете <a href="auth">войти</a>!'
            
            console.log('Успех:', data);
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при регистрации. Пожалуйста, попробуйте снова.');
        });
    }
});
