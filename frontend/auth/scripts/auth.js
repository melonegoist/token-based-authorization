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
        
        fetch('http://melon-egoist.ru:8081/api/auth/signin', {
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
                localStorage.setItem('login', data.login);
                
                let roleSet = data.roles;

                if (roleSet.includes("ADMIN")) {
                    fetch(`http://melon-egoist.ru:8081/api/admin/confirm-status?login=${data.login}`, {
                        method: "GET",
                        headers: {
                            'Authorization': `Bearer ${data.token}`
                        }
                    }).then(response => {
                        if (!response.ok) {
                            console.log("error occured")
                        }

                        return response.text()

                    }).then(data => {
                        console.log(data)

                        if (data == "Admin status confirmed") {
                            localStorage.setItem("isAdmin", "true")
                        }
                    })
                }

                if (roleSet.includes("PREMIUM_USER")) {
                    fetch(`http://melon-egoist.ru:8081/api/premium/confirm-status?login=${data.login}`, {
                        method: "GET",
                        headers: {
                            'Authorization': `Bearer ${data.token}`
                        }
                    }).then(response => {
                        if (!response.ok) {
                            console.log("error occured")
                        }

                        return response.text()

                    }).then(data => {
                        console.log(data)

                        if (data == "Premium status confirmed") {
                            localStorage.setItem("isPremium", "true")
                        }
                    })
                }
            }
            
            setTimeout(() => {
                window.location.href = 'http://melon-egoist.ru/t1ht4/main_page';
            }, 2000);
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Неверный login или пароль. Пожалуйста, попробуйте снова.');
        });
    }
});
