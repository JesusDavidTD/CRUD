// Datos en memoria
let posts = [];
let resources = [];
let users = [
    { id: 1, name: "Juan Pérez", email: "juan@mentesanas.com", role: "user", password: "123" },
    { id: 2, name: "Ana Gómez", email: "ana@mentesanas.com", role: "admin", password: "admin123" },
    { id: 3, name: "Luis Martínez", email: "luis@mentesanas.com", role: "superadmin", password: "super123" },
    { id: 4, name: "María López", email: "maria@mentesanas.com", role: "admin", password: "admin456" },
    { id: 5, name:"Montenegro1", email: "Montenegro1@mentesanas.com", role: "user", password: "Montenegro123" }, // Nuevo administrador para probar
    { id: 6, name:"Montenegro2", email: "Montenegro2@mentesanas.com", role: "superadmin", password: "Montenegro1234"}
];

// Estado de la sesión
let currentUser = null;

// Elementos del DOM
const loginScreen = document.getElementById('loginScreen');
const adminPanel = document.getElementById('adminPanel');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const currentUserSpan = document.getElementById('currentUser');
const resourcesMenu = document.getElementById('resourcesMenu');
const usersMenu = document.getElementById('usersMenu');
const superadminMenu = document.getElementById('superadminMenu');
const resourceSection = document.getElementById('resourceSection');
const userSection = document.getElementById('userSection');
const superadminSection = document.getElementById('superadminSection');

// Formularios y tablas
const resourceForm = document.getElementById('resourceForm');
const resourceList = document.getElementById('resourceList');
const userForm = document.getElementById('userForm');
const userList = document.getElementById('userList');
const adminListForAdmin = document.getElementById('adminListForAdmin');
const apprenticeList = document.getElementById('apprenticeList');
const adminList = document.getElementById('adminList');
const superadminList = document.getElementById('superadminList');

// Manejo del inicio de sesión
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const user = users.find(u => u.name === username && u.password === password && (u.role === 'admin' || u.role === 'superadmin'));
    if (user) {
        currentUser = user;
        loginScreen.style.display = 'none';
        adminPanel.style.display = 'flex';
        loginError.style.display = 'none';
        currentUserSpan.textContent = user.name;

        // Configurar visibilidad según el rol
        if (user.role === 'admin') {
            superadminMenu.style.display = 'none';
            showSection('resourceSection');
        } else if (user.role === 'superadmin') {
            superadminMenu.style.display = 'block';
            showSection('superadminSection');
        }
        displayAll();
    } else {
        loginError.style.display = 'block';
    }
});

// Cerrar sesión
function logout() {
    currentUser = null;
    loginScreen.style.display = 'flex';
    adminPanel.style.display = 'none';
    loginForm.reset();
    loginError.style.display = 'none';
}

// Mostrar secciones
function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.style.display = 'none');
    document.getElementById(sectionId).style.display = 'block';
    displayAll();
}

// Mostrar datos en tablas
function displayResources() {
    resourceList.innerHTML = '';
    resources.forEach((resource, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${resource.title}</td>
            <td>${resource.description}</td>
            <td>
                <button class="view-btn" onclick="viewResource(${index})"><i class="fas fa-eye"></i></button>
                <button class="edit-btn" onclick="editResource(${index})"><i class="fas fa-edit"></i></button>
                <button class="delete-btn" onclick="deleteResource(${index})"><i class="fas fa-trash"></i></button>
            </td>
        `;
        resourceList.appendChild(row);
    });
}

function displayUsers() {
    // Tabla de aprendices (editable por administradores)
    userList.innerHTML = '';
    users.filter(u => u.role === 'user').forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>
                <button class="view-btn" onclick="viewUser(${user.id})"><i class="fas fa-eye"></i></button>
                <button class="edit-btn" onclick="editUser(${user.id})"><i class="fas fa-edit"></i></button>
                <button class="delete-btn" onclick="deleteUser(${user.id})"><i class="fas fa-trash"></i></button>
            </td>
        `;
        userList.appendChild(row);
    });

    // Tabla de administradores (solo lectura para administradores)
    adminListForAdmin.innerHTML = '';
    users.filter(u => u.role === 'admin').forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>
                <button class="view-btn" onclick="viewUser(${user.id})"><i class="fas fa-eye"></i></button>
            </td>
        `;
        adminListForAdmin.appendChild(row);
    });
}

function displayAllUsers() {
    apprenticeList.innerHTML = '';
    adminList.innerHTML = '';
    superadminList.innerHTML = '';

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>
                <select onchange="changeRoleUser(${user.id}, this.value)">
                    <option value="user" ${user.role === 'user' ? 'selected' : ''}>Usuario</option>
                    <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Administrador</option>
                    <option value="superadmin" ${user.role === 'superadmin' ? 'selected' : ''}>Superadministrador</option>
                </select>
                <button class="view-btn" onclick="viewUser(${user.id})"><i class="fas fa-eye"></i></button>
                <button class="delete-btn" onclick="deleteUser(${user.id})"><i class="fas fa-trash"></i></button>
            </td>
        `;
        if (user.role === 'user') apprenticeList.appendChild(row.cloneNode(true));
        else if (user.role === 'admin') adminList.appendChild(row.cloneNode(true));
        else if (user.role === 'superadmin') superadminList.appendChild(row.cloneNode(true));
    });
}

function displayAll() {
    displayResources();
    displayUsers();
    if (currentUser && currentUser.role === 'superadmin') {
        displayAllUsers();
    }
}

// CRUD para Recursos (Admin y Superadmin)
resourceForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('resourceTitle').value;
    const description = document.getElementById('resourceDescription').value;
    const id = document.getElementById('resourceId').value;
    if (id === '') {
        resources.push({ title, description });
    } else {
        resources[id] = { title, description };
        resetForm(resourceForm, 'cancelResourceEdit');
    }
    displayResources();
    resourceForm.style.display = 'none';
    resourceForm.reset();
});

function showResourceForm() {
    resourceForm.style.display = 'block';
    resourceForm.reset();
    document.getElementById('resourceId').value = '';
    document.getElementById('cancelResourceEdit').style.display = 'inline';
}

function viewResource(index) {
    alert(`Título: ${resources[index].title}\nDescripción: ${resources[index].description}`);
}

function editResource(index) {
    document.getElementById('resourceId').value = index;
    document.getElementById('resourceTitle').value = resources[index].title;
    document.getElementById('resourceDescription').value = resources[index].description;
    resourceForm.style.display = 'block';
    document.getElementById('cancelResourceEdit').style.display = 'inline';
}

function deleteResource(index) {
    resources.splice(index, 1);
    displayResources();
}

// CRUD para Usuarios (Admin y Superadmin)
userForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    const id = document.getElementById('userId').value;
    if (id === '') {
        const newId = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
        users.push({ id: newId, name, email, role: 'user', password: null });
    } else {
        const user = users.find(u => u.id == id);
        user.name = name;
        user.email = email;
        resetForm(userForm, 'cancelUserEdit');
    }
    displayAll();
    userForm.style.display = 'none';
    userForm.reset();
});

function showUserForm() {
    userForm.style.display = 'block';
    userForm.reset();
    document.getElementById('userId').value = '';
    document.getElementById('cancelUserEdit').style.display = 'inline';
}

function viewUser(id) {
    const user = users.find(u => u.id == id);
    alert(`Nombre: ${user.name}\nCorreo: ${user.email}\nRol: ${user.role}`);
}

function editUser(id) {
    const user = users.find(u => u.id == id);
    document.getElementById('userId').value = id;
    document.getElementById('userName').value = user.name;
    document.getElementById('userEmail').value = user.email;
    userForm.style.display = 'block';
    document.getElementById('cancelUserEdit').style.display = 'inline';
}

function deleteUser(id) {
    const user = users.find(u => u.id == id);
    if (currentUser.role === 'admin' && user.role !== 'user') {
        alert("No tienes permiso para eliminar a este usuario.");
        return;
    }
    users = users.filter(u => u.id !== id);
    displayAll();
}

function changeRoleUser(id, newRole) {
    const user = users.find(u => u.id == id);
    if (currentUser.role !== 'superadmin') {
        alert("Solo un superadministrador puede cambiar roles.");
        displayAllUsers(); // Revertir cambio visual
        return;
    }
    user.role = newRole;
    displayAll();
}

// Resetear formularios
function resetForm(form, cancelBtnId) {
    form.reset();
    document.getElementById(cancelBtnId).style.display = 'none';
    form.querySelector('input[type="hidden"]').value = '';
}

document.getElementById('cancelResourceEdit').addEventListener('click', () => {
    resetForm(resourceForm, 'cancelResourceEdit');
    resourceForm.style.display = 'none';
});

document.getElementById('cancelUserEdit').addEventListener('click', () => {
    resetForm(userForm, 'cancelUserEdit');
    userForm.style.display = 'none';
});

// Búsqueda en tablas
function searchTable(tableId, query) {
    const table = document.getElementById(tableId);
    const rows = table.getElementsByTagName('tr');
    query = query.toLowerCase();
    for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        let match = false;
        for (let j = 0; j < cells.length - 1; j++) {
            if (cells[j].innerText.toLowerCase().includes(query)) {
                match = true;
                break;
            }
        }
        rows[i].style.display = match ? '' : 'none';
    }
}

// Paginación (simulada)
function prevPage() {
    alert("Función de paginación anterior (simulada).");
}

function nextPage() {
    alert("Función de paginación siguiente (simulada).");
}

// Datos iniciales
resources = [{ title: "Guía de Mindfulness", description: "Técnicas para reducir el estrés." }];
