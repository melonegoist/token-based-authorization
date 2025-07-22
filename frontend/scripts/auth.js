document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    document.querySelectorAll('.error').forEach(el => el.style.display = 'none');
    
    const login = document.getElementById('login').value.trim();
    const password = document.getElementById('password').value;
    
    let isValid = true;

    if (login === '') {
        document.getElementById('loginError').style.display = 'block';
        isValid = false;
    }
    
    if (password === '') {
        document.getElementById('passwordError').style.display = 'block';
        isValid = false;
    }
    
    if (isValid) {
        const formData = {
            login: login,
            password: password
        };
        
        fetch('http://localhost:8081/api/auth/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка авторизации');
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('successMessage').style.display = 'block';
            
            if (data.token) {
                localStorage.setItem('token', data.token);
            }
            
            setTimeout(() => {
                window.location.href = 'profile.html';
            }, 2000);
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Неверный login или пароль. Пожалуйста, попробуйте снова.');
        });
    }
});
