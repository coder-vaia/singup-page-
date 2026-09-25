const form = document.getElementById('signupForm');
const modal = document.getElementById('successModal');
const modalClose = document.getElementById('modalClose');

function showError(input, message) {
  const errorEl = document.getElementById(input.id + 'Error');
  errorEl.textContent = message;
  input.classList.add('error-input');
}

function clearError(input) {
  const errorEl = document.getElementById(input.id + 'Error');
  errorEl.textContent = '';
  input.classList.remove('error-input');
}

function validateName(name) {
  return name.trim().length >= 3;
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
  return password.length >= 8;
}

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const fullNameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');

  let valid = true;

  // Frontend Validation Checks
  if (!validateName(fullNameInput.value)) {
    showError(fullNameInput, 'Name must be at least 3 characters.');
    valid = false;
  } else {
    clearError(fullNameInput);
  }

  if (!validateEmail(emailInput.value)) {
    showError(emailInput, 'Please enter a valid email address.');
    valid = false;
  } else {
    clearError(emailInput);
  }

  if (!validatePassword(passwordInput.value)) {
    showError(passwordInput, 'Password must be at least 8 characters.');
    valid = false;
  } else {
    clearError(passwordInput);
  }

  if (confirmPasswordInput.value !== passwordInput.value || passwordInput.value === '') {
    showError(confirmPasswordInput, 'Passwords do not match.');
    valid = false;
  } else {
    clearError(confirmPasswordInput);
  }

  // If validation passes, send data to MySQL backend
  if (valid) {
    const fullName = fullNameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    try {
      const response = await fetch('http://localhost:3000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fullName, email, password })
      });

      const data = await response.json();

      if (response.ok) {
        const firstName = fullName.split(' ')[0];
        document.getElementById('successMessage').textContent = 'Welcome, ' + firstName + '! ' + data.message;
        modal.classList.add('show');
        form.reset();
      } else {
        showError(emailInput, data.message || 'Signup failed.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Could not connect to backend server.');
    }
  }
});

modalClose.addEventListener('click', function () {
  modal.classList.remove('show');
});

modal.addEventListener('click', function (e) {
  if (e.target === modal) {
    modal.classList.remove('show');
  }
});

form.addEventListener('input', function (e) {
  if (e.target.value !== '') {
    clearError(e.target);
  }
});