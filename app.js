// Store items in localStorage
let items = JSON.parse(localStorage.getItem('items')) || [];

// DOM Elements
const itemList = document.getElementById('itemList');
const addItemBtn = document.getElementById('addItemBtn');
const addItemModal = document.getElementById('addItemModal');
const closeModal = document.getElementById('closeModal');
const addItemForm = document.getElementById('addItemForm');
const searchInput = document.getElementById('searchInput');
const sellItemModal = document.getElementById('sellItemModal');
const closeSellModal = document.getElementById('closeSellModal');
const sellItemForm = document.getElementById('sellItemForm');
const sellItemName = document.getElementById('sellItemName');
const editItemModal = document.getElementById('editItemModal');
const closeEditModal = document.getElementById('closeEditModal');
const editItemForm = document.getElementById('editItemForm');
const deleteItemBtn = document.getElementById('deleteItemBtn');

// Event Listeners
addItemBtn.addEventListener('click', () => addItemModal.classList.replace('hidden', 'flex'));
closeModal.addEventListener('click', () => addItemModal.classList.replace('flex', 'hidden'));
addItemForm.addEventListener('submit', addItem);
searchInput.addEventListener('input', searchItems);
closeSellModal.addEventListener('click', () => sellItemModal.classList.replace('flex', 'hidden'));
sellItemForm.addEventListener('submit', sellItem);
closeEditModal.addEventListener('click', () => editItemModal.classList.replace('flex', 'hidden'));
editItemForm.addEventListener('submit', editItem);
deleteItemBtn.addEventListener('click', () => deleteItem(editItemForm.dataset.itemId));

// Functions
function addItem(e) {
    e.preventDefault();
    const newItem = {
        id: Date.now(),
        name: addItemForm.name.value,
        mrp: parseFloat(addItemForm.mrp.value),
        manufacturingDate: addItemForm.manufacturingDate.value,
        expiryDate: addItemForm.expiryDate.value,
        costPrice: parseFloat(addItemForm.costPrice.value),
        quantity: parseInt(addItemForm.quantity.value)
    };
    items.push(newItem);
    saveItems();
    renderItems();
    addItemForm.reset();
    addItemModal.classList.replace('flex', 'hidden');
}

function renderItems(itemsToRender = items) {
    itemList.innerHTML = '';
    itemsToRender.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'bg-gray-800 p-6 rounded-2xl shadow-lg transition duration-300 ease-in-out transform hover:scale-105';
        itemElement.innerHTML = `
            <h3 class="font-bold text-xl mb-2 text-purple-400">${item.name}</h3>
            <p class="mb-1"><span class="font-semibold text-pink-400">MRP:</span> ₹${item.mrp.toFixed(2)}</p>
            <p class="mb-1"><span class="font-semibold text-pink-400">Mfg Date:</span> ${formatDate(item.manufacturingDate)}</p>
            <p class="mb-1"><span class="font-semibold text-pink-400">Exp Date:</span> ${formatDate(item.expiryDate)}</p>
            <p class="mb-1"><span class="font-semibold text-pink-400">Cost:</span> ₹${item.costPrice.toFixed(2)}</p>
            <p class="mb-3"><span class="font-semibold text-pink-400">Quantity:</span> ${item.quantity}</p>
            <div class="flex space-x-2">
                <button class="sellBtn bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full transition duration-300 ease-in-out hover:shadow-lg" data-id="${item.id}">Sell</button>
                <button class="editBtn bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full transition duration-300 ease-in-out hover:shadow-lg" data-id="${item.id}">Edit</button>
            </div>
        `;
        itemList.appendChild(itemElement);
    });
    document.querySelectorAll('.sellBtn').forEach(btn => {
        btn.addEventListener('click', () => openSellModal(btn.dataset.id));
    });
    document.querySelectorAll('.editBtn').forEach(btn => {
        btn.addEventListener('click', () => openEditModal(btn.dataset.id));
    });
}

function searchItems() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredItems = items.filter(item => 
        item.name.toLowerCase().includes(searchTerm)
    );
    renderItems(filteredItems);
}

function openSellModal(itemId) {
    const item = items.find(i => i.id === parseInt(itemId));
    if (item) {
        sellItemName.textContent = `Selling: ${item.name}`;
        sellItemForm.dataset.itemId = itemId;
        sellItemModal.classList.replace('hidden', 'flex');
    }
}

function sellItem(e) {
    e.preventDefault();
    const itemId = parseInt(sellItemForm.dataset.itemId);
    const quantityToSell = parseInt(sellItemForm.sellQuantity.value);
    const item = items.find(i => i.id === itemId);
    
    if (item && quantityToSell <= item.quantity) {
        item.quantity -= quantityToSell;
        if (item.quantity === 0) {
            items = items.filter(i => i.id !== itemId);
        }
        saveItems();
        renderItems();
        sellItemForm.reset();
        sellItemModal.classList.replace('flex', 'hidden');
    } else {
        alert('Invalid quantity or not enough stock!');
    }
}

function openEditModal(itemId) {
    const item = items.find(i => i.id === parseInt(itemId));
    if (item) {
        editItemForm.dataset.itemId = itemId;
        editItemForm.name.value = item.name;
        editItemForm.mrp.value = item.mrp;
        editItemForm.manufacturingDate.value = item.manufacturingDate;
        editItemForm.expiryDate.value = item.expiryDate;
        editItemForm.costPrice.value = item.costPrice;
        editItemForm.quantity.value = item.quantity;
        editItemModal.classList.replace('hidden', 'flex');
    }
}

function editItem(e) {
    e.preventDefault();
    const itemId = parseInt(editItemForm.dataset.itemId);
    const item = items.find(i => i.id === itemId);
    
    if (item) {
        item.name = editItemForm.name.value;
        item.mrp = parseFloat(editItemForm.mrp.value);
        item.manufacturingDate = editItemForm.manufacturingDate.value;
        item.expiryDate = editItemForm.expiryDate.value;
        item.costPrice = parseFloat(editItemForm.costPrice.value);
        item.quantity = parseInt(editItemForm.quantity.value);
        
        saveItems();
        renderItems();
        editItemModal.classList.replace('flex', 'hidden');
    }
}

function deleteItem(itemId) {
    items = items.filter(i => i.id !== parseInt(itemId));
    saveItems();
    renderItems();
    editItemModal.classList.replace('flex', 'hidden');
}

function saveItems() {
    localStorage.setItem('items', JSON.stringify(items));
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
}

// Initial render
renderItems();
