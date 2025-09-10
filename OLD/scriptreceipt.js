const PRODUCT_PRICES = {
  "phone": 999,
  "laptop": 799,
  "ipad": 499,
  "charger": 29,
  "samsung galaxxy s20": 699,
  "instant camera": 120,
  "earphone": 39,
  "portable charger": 59,
  "digital camera": 199
};

function renderReceipt() {
    const receiptItemsDiv = document.getElementById('receiptItems');
    const receipt = JSON.parse(sessionStorage.getItem('receipt')) || [];
    let total = 0;
    receiptItemsDiv.innerHTML = '';

    if (receipt.length === 0) {
        receiptItemsDiv.innerHTML = '<p>No items found in your receipt.</p>';
        document.getElementById('receiptTotal').textContent = '0.00';
        return;
    }

    receipt.forEach(item => {
        const price = PRODUCT_PRICES[item.title.trim().toLowerCase()] || 100;
        total += price;
        const div = document.createElement('div');
        div.className = 'receipt-item';
        div.innerHTML = `
            <span>${item.title} (${item.desc})</span>
            <span>$${price.toFixed(2)}</span>
        `;
        receiptItemsDiv.appendChild(div);
    });

    document.getElementById('receiptTotal').textContent = total.toFixed(2);
}

document.addEventListener('DOMContentLoaded', renderReceipt);