// Store items in localStorage
let items = JSON.parse(localStorage.getItem('items')) || [];
let billItems = [];

// DOM Elements
const itemList = document.getElementById('itemList');
const searchInput = document.getElementById('searchInput');
const togglePageBtn = document.getElementById('togglePage');
const itemsPage = document.getElementById('itemsPage');
const billPage = document.getElementById('billPage');
const billItemsContainer = document.getElementById('billItems');
const billTotalElement = document.getElementById('billTotal');
const saveBillBtn = document.getElementById('saveBillBtn');
const itemInfoModal = document.getElementById('itemInfoModal');
const itemNameElement = document.getElementById('itemName');
const itemDetailsElement = document.getElementById('itemDetails');
const sellForm = document.getElementById('sellForm');
const closeItemInfoModal = document.getElementById('closeItemInfoModal');
const saveBillModal = document.getElementById('saveBillModal');
const saveBillForm = document.getElementById('saveBillForm');
const closeSaveBillModal = document.getElementById('closeSaveBillModal');
const billPreviewModal = document.getElementById('billPreviewModal');
const billPreviewContent = document.getElementById('billPreviewContent');
const downloadPdfBtn = document.getElementById('downloadPdfBtn');
const closeBillPreviewModal = document.getElementById('closeBillPreviewModal');

// Event Listeners
togglePageBtn.addEventListener('click', togglePage);
searchInput.addEventListener('input', searchItems);
saveBillBtn.addEventListener('click', () => saveBillModal.classList.replace('hidden', 'flex'));
closeItemInfoModal.addEventListener('click', () => itemInfoModal.classList.replace('flex', 'hidden'));
closeSaveBillModal.addEventListener('click', () => saveBillModal.classList.replace('flex', 'hidden'));
closeBillPreviewModal.addEventListener('click', () => billPreviewModal.classList.replace('flex', 'hidden'));
sellForm.addEventListener('submit', addToBill);
saveBillForm.addEventListener('submit', saveAndGenerateBill);
downloadPdfBtn.addEventListener('click', downloadBillPdf);

// Functions
function renderItems(itemsToRender = items) {
    itemList.innerHTML = '';
    itemsToRender.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'bg-gray-800 p-6 rounded-2xl shadow-lg transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer';
        itemElement.innerHTML = `
            <h3 class="font-bold text-xl mb-2 text-purple-400">${item.name}</h3>
            <p class="mb-1"><span class="font-semibold text-pink-400">MRP:</span> ₹${item.mrp.toFixed(2)}</p>
            <p class="mb-1"><span class="font-semibold text-pink-400">Quantity:</span> ${item.quantity}</p>
        `;
        itemElement.addEventListener('click', () => openItemInfoModal(item));
        itemList.appendChild(itemElement);
    });
}

function searchItems() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredItems = items.filter(item => 
        item.name.toLowerCase().includes(searchTerm)
    );
    renderItems(filteredItems);
}

function togglePage() {
    itemsPage.classList.toggle('active');
    billPage.classList.toggle('active');
    togglePageBtn.textContent = itemsPage.classList.contains('active') ? 'View Bill' : 'View Items';
}

function openItemInfoModal(item) {
    itemNameElement.textContent = item.name;
    itemDetailsElement.innerHTML = `
        <p><strong>MRP:</strong> ₹${item.mrp.toFixed(2)}</p>
        <p><strong>Manufacturing Date:</strong> ${formatDate(item.manufacturingDate)}</p>
        <p><strong>Expiry Date:</strong> ${formatDate(item.expiryDate)}</p>
        <p><strong>Cost Price:</strong> ₹${item.costPrice.toFixed(2)}</p>
        <p><strong>Available Quantity:</strong> ${item.quantity}</p>
    `;
    sellForm.dataset.itemId = item.id;
    itemInfoModal.classList.replace('hidden', 'flex');
}

function addToBill(e) {
    e.preventDefault();
    const itemId = parseInt(sellForm.dataset.itemId);
    const item = items.find(i => i.id === itemId);
    const quantity = parseInt(sellForm.sellQuantity.value);
    const discountPercent = parseFloat(sellForm.discountPercent.value) || 0;
    const additionalFee = parseFloat(sellForm.additionalFee.value) || 0;

    if (item && quantity > 0 && quantity <= item.quantity) {
        const totalPrice = (item.mrp * quantity * (1 - discountPercent / 100)) + additionalFee;
        const billItem = {
            id: itemId,
            name: item.name,
            quantity: quantity,
            price: item.mrp,
            discountPercent: discountPercent,
            additionalFee: additionalFee,
            totalPrice: totalPrice
        };
        billItems.push(billItem);
        item.quantity -= quantity;
        updateBillSummary();
        itemInfoModal.classList.replace('flex', 'hidden');
        sellForm.reset();
    } else {
        alert('Invalid quantity or not enough stock!');
    }
}

function updateBillSummary() {
    billItemsContainer.innerHTML = '';
    let total = 0;
    billItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'flex justify-between items-center mb-2';
        itemElement.innerHTML = `
            <span>${item.name} (x${item.quantity})</span>
            <span>₹${item.totalPrice.toFixed(2)}</span>
        `;
        billItemsContainer.appendChild(itemElement);
        total += item.totalPrice;
    });
    billTotalElement.textContent = total.toFixed(2);
}

function saveAndGenerateBill(e) {
    e.preventDefault();
    if (billItems.length === 0) {
        alert('Please add items to the bill before saving.');
        return;
    }
    const gstPercent = parseFloat(saveBillForm.gstPercent.value) || 0;
    const subtotal = parseFloat(billTotalElement.textContent);
    const gstAmount = subtotal * (gstPercent / 100);
    const grandTotal = subtotal + gstAmount;

    const billContent = `
        <h3 class="text-xl font-bold mb-4">Bill Details</h3>
        ${billItems.map(item => `
            <div class="flex justify-between mb-2">
                <span>${item.name} (x${item.quantity})</span>
                <span>₹${item.totalPrice.toFixed(2)}</span>
            </div>
        `).join('')}
        <hr class="my-4">
        <div class="flex justify-between font-bold">
            <span>Subtotal:</span>
            <span>₹${subtotal.toFixed(2)}</span>
        </div>
        <div class="flex justify-between">
            <span>GST (${gstPercent}%):</span>
            <span>₹${gstAmount.toFixed(2)}</span>
        </div>
        <div class="flex justify-between font-bold text-lg mt-2">
            <span>Grand Total:</span>
            <span>₹${grandTotal.toFixed(2)}</span>
        </div>
    `;

    billPreviewContent.innerHTML = billContent;
    saveBillModal.classList.replace('flex', 'hidden');
    billPreviewModal.classList.replace('hidden', 'flex');

    // Update localStorage
    localStorage.setItem('items', JSON.stringify(items));
}

function downloadBillPdf() {
    if (billItems.length === 0) {
        alert('Please add items to the bill before downloading.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Set up fonts and colors
    doc.setFont("helvetica");
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 255);  // Blue color for the title

    // Add title
    doc.text("S-CODE Billing System", 105, 15, null, null, "center");

    // Reset text color to black
    doc.setTextColor(0, 0, 0);

    // Add bill details
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 25);
    doc.text(`Bill No: ${Date.now()}`, 20, 30);

    // Create table headers
    const headers = [["Item", "MRP", "Qty", "Discount", "Add. Fee", "Total"]];
    const data = billItems.map(item => [
        item.name,
        item.price.toFixed(2),
        item.quantity.toString(),
        item.discountPercent.toFixed(2),
        item.additionalFee.toFixed(2),
        item.totalPrice.toFixed(2)
    ]);

    // Auto table plugin with adjusted column widths and alignment
    doc.autoTable({
        head: headers,
        body: data,
        startY: 40,
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 2, overflow: 'linebreak' },
        columnStyles: {
            0: { cellWidth: 50, halign: 'left' },
            1: { cellWidth: 25, halign: 'left' },
            2: { cellWidth: 15, halign: 'left' },
            3: { cellWidth: 20, halign: 'left' },
            4: { cellWidth: 25, halign: 'left' },
            5: { cellWidth: 30, halign: 'left' }
        },
        headStyles: { fillColor: [100, 100, 255], textColor: 255, halign: 'center' },
        didParseCell: function(data) {
            if (data.section === 'body' && data.column.index > 0) {
                data.cell.text = '₹' + data.cell.text;
            }
            if (data.section === 'body' && data.column.index === 3) {
                data.cell.text = data.cell.text + '%';
            }
        }
    });

    // Calculate totals
    const subtotal = billItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const gstPercent = parseFloat(saveBillForm.gstPercent.value) || 0;
    const gstAmount = subtotal * (gstPercent / 100);
    const grandTotal = subtotal + gstAmount;

    // Add summary section
    const summaryY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(10);
    doc.text("Summary:", 20, summaryY);
    doc.line(20, summaryY + 2, 190, summaryY + 2);

    const summaryData = [
        ["Subtotal:", `₹${subtotal.toFixed(2)}`],
        [`GST (${gstPercent}%):`, `₹${gstAmount.toFixed(2)}`],
        ["Grand Total:", `₹${grandTotal.toFixed(2)}`]
    ];

    doc.autoTable({
        body: summaryData,
        startY: summaryY + 5,
        theme: 'plain',
        styles: { fontSize: 10, cellPadding: 1.5 },
        columnStyles: {
            0: { cellWidth: 150, fontStyle: 'bold' },
            1: { cellWidth: 30, halign: 'right', fontStyle: 'bold' }
        }
    });

    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(8);
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text('Page ' + String(i) + ' of ' + String(pageCount), doc.internal.pageSize.width / 2, 287, {
            align: 'center'
        });
    }

    // Save the PDF
    doc.save("detailed_bill.pdf");
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
}

// Initial render
renderItems();