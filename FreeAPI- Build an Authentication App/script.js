// --- Configuration & State ---
const API_BASE = 'https://api.freeapi.app/api/v1/users';

// --- DOM Elements ---
const screens = {
    login: document.getElementById('loginScreen'),
    register: document.getElementById('registerScreen'),
    dashboard: document.getElementById('dashboardScreen')
};
const forms = {
    login: document.getElementById('loginForm'),
    register: document.getElementById('registerForm')
};
const buttons = {
    showRegister: document.getElementById('showRegisterBtn'),
    showLogin: document.getElementById('showLoginBtn'),
    logout: document.getElementById('logoutBtn')
};
const ui = {
    loader: document.getElementById('loadingOverlay'),
    toast: document.getElementById('toast'),
    subtitle: document.getElementById('headerSubtitle'),
    profileName: document.getElementById('profileName'),
    profileEmail: document.getElementById('profileEmail'),
    profileRole: document.getElementById('profileRole'),
    avatarLetter: document.getElementById('avatarLetter')
};

// --- Utility Functions ---
const showLoader = () => ui.loader.classList.remove('hidden');
const hideLoader = () => ui.loader.classList.add('hidden');

const showToast = (message, type = 'success') => {
    ui.toast.textContent = message;
    ui.toast.className = `fixed top-5 right-5 px-6 py-3 rounded-lg shadow-lg text-white font-medium transition-opacity duration-300 z-50 opacity-100 ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`;
    setTimeout(() => { ui.toast.classList.replace('opacity-100', 'opacity-0'); }, 3000);
};

const navigateTo = (screenName) => {
    Object.values(screens).forEach(screen => screen.classList.add('hidden'));
    screens[screenName].classList.remove('hidden');
    
    if (screenName === 'dashboard') {
        ui.subtitle.textContent = 'Welcome back!';
    } else {
        ui.subtitle.textContent = 'Please log in or register';
    }
};

// --- API Client ---
async function apiCall(endpoint, method = 'GET', body = null) {
    const token = localStorage.getItem('accessToken');
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };
    
    // Attach token to protected requests
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const config = { method, headers };
    if (body) config.body = JSON.stringify(body);

    try {
        const response = await fetch(`${API_BASE}${endpoint}`, config);
        const data = await response.json();
        
        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Something went wrong');
        }
        return data;
    } catch (error) {
        showToast(error.message, 'error');
        throw error;
    }
}

// --- Authentication Actions ---
async function handleLogin(e) {
    e.preventDefault();
    showLoader();
    const payload = {
        username: document.getElementById('loginUsername').value,
        password: document.getElementById('loginPassword').value
    };

    try {
        const res = await apiCall('/login', 'POST', payload);
        // Save token & user data
        localStorage.setItem('accessToken', res.data.accessToken);
        updateProfileUI(res.data.user);
        navigateTo('dashboard');
        showToast('Login successful!');
        forms.login.reset();
    } catch (error) {
        showToast('Login failed. Please check your credentials.', 'error');
    } finally {
        hideLoader();
    }
}

async function handleRegister(e) {
    e.preventDefault();
    showLoader();
    const payload = {
        username: document.getElementById('regUsername').value,
        email: document.getElementById('regEmail').value,
        password: document.getElementById('regPassword').value,
        role: "ADMIN" // Required by project specs
    };

    try {
        await apiCall('/register', 'POST', payload);
        showToast('Registration successful! Please log in.');
        forms.register.reset();
        navigateTo('login');
    } catch (error) {
        showToast(error.message || 'Registration failed. Please try again.', 'error');
    } finally {
        hideLoader();
    }
}

async function handleLogout() {
    showLoader();
    try {
        await apiCall('/logout', 'POST');
        localStorage.removeItem('accessToken');
        navigateTo('login');
        showToast('Logged out successfully');
    } catch (error) {
        // Even if API fails, clear local state
        localStorage.removeItem('accessToken');
        navigateTo('login');
    } finally {
        hideLoader();
    }
}

async function fetchCurrentUser() {
    if (!localStorage.getItem('accessToken')) return;
    
    showLoader();
    try {
        const res = await apiCall('/current-user');
        updateProfileUI(res.data);
        navigateTo('dashboard');
    } catch (error) {
        // Token invalid or expired
        localStorage.removeItem('accessToken');
        navigateTo('login');
    } finally {
        hideLoader();
    }
}

function updateProfileUI(user) {
    ui.profileName.textContent = user.username;
    ui.profileEmail.textContent = user.email;
    ui.profileRole.textContent = user.role || 'USER';
    ui.avatarLetter.textContent = user.username.charAt(0).toUpperCase();
}

// --- Event Listeners ---
forms.login.addEventListener('submit', handleLogin);
forms.register.addEventListener('submit', handleRegister);
buttons.logout.addEventListener('click', handleLogout);

buttons.showRegister.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('register');
});

buttons.showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('login');
});

// --- URL Hash Navigation ---
function handleHashChange() {
    const hash = window.location.hash;
    if (hash === '#register') {
        navigateTo('register');
    } else {
        // Default to login screen if hash is #login or anything else
        navigateTo('login');
    }
}

// --- Initialization ---
// Listen for hash changes to switch between login/register from landing page
window.addEventListener('hashchange', handleHashChange);

// Check initial state
if (localStorage.getItem('accessToken')) {
    fetchCurrentUser();
} else {
    handleHashChange(); // Show login or register based on URL hash
}