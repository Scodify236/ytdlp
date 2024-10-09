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

// Event Listeners
addItemBtn.addEventListener('click', () => addItemModal.classList.replace('hidden', 'flex'));
closeModal.addEventListener('click', () => addItemModal.classList.replace('flex', 'hidden'));
addItemForm.addEventListener('submit', addItem);
searchInput.addEventListener('input', searchItems);
closeSellModal.addEventListener('click', () => sellItemModal.classList.replace('flex', 'hidden'));
sellItemForm.addEventListener('submit', sellItem);

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
        itemElement.className = 'bg-dark-200 p-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105';
        itemElement.innerHTML = `
            <h3 class="font-bold text-xl mb-2 text-purple-400">${item.name}</h3>
            <p class="mb-1"><span class="font-semibold">MRP:</span> ₹${item.mrp.toFixed(2)}</p>
            <p class="mb-1"><span class="font-semibold">Mfg Date:</span> ${formatDate(item.manufacturingDate)}</p>
            <p class="mb-1"><span class="font-semibold">Exp Date:</span> ${formatDate(item.expiryDate)}</p>
            <p class="mb-1"><span class="font-semibold">Cost:</span> ₹${item.costPrice.toFixed(2)}</p>
            <p class="mb-3"><span class="font-semibold">Quantity:</span> ${item.quantity}</p>
            <button class="sellBtn bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-300 ease-in-out" data-id="${item.id}">Sell</button>
        `;
        itemList.appendChild(itemElement);
    });
    document.querySelectorAll('.sellBtn').forEach(btn => {
        btn.addEventListener('click', () => openSellModal(btn.dataset.id));
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
        saveItems();
        renderItems();
        sellItemForm.reset();
        sellItemModal.classList.replace('flex', 'hidden');
    } else {
        alert('Invalid quantity or not enough stock!');
    }
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
