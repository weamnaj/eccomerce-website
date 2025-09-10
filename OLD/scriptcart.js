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

function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function renderCart() {
  const cartItemsDiv = document.getElementById('cartItems');
  const cart = getCart();
  cartItemsDiv.innerHTML = '';

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = '<p>Your cart is empty.</p>';
    document.getElementById('totalPrice').textContent = '0.00';
    return;
  }

  let total = 0;

  cart.forEach((item, idx) => {
    const price = PRODUCT_PRICES[item.title.trim().toLowerCase()] || 100;
    total += price;

    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';

    itemDiv.innerHTML = `
      <img src="${item.img}" alt="${item.title}">
      <div class="cart-item-info">
        <h3>${item.title}</h3>
        <p>${item.desc}</p>
        <p><strong>Price:</strong> $${price.toFixed(2)}</p>
      </div>
      <div class="cart-item-controls">
        <button class="remove-btn" data-idx="${idx}">Remove</button>
      </div>
    `;

    cartItemsDiv.appendChild(itemDiv);
  });

  document.getElementById('totalPrice').textContent = total.toFixed(2);
}

document.addEventListener('click', function(e) {
  if (e.target.classList.contains('remove-btn')) {
    const idx = parseInt(e.target.getAttribute('data-idx'));
    let cart = getCart();
    cart.splice(idx, 1);
    saveCart(cart);
    renderCart();
  }
});

document.addEventListener('DOMContentLoaded', renderCart);

document.querySelector('.checkoutbtn').addEventListener('click', function() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    // Save receipt data to sessionStorage
    sessionStorage.setItem('receipt', JSON.stringify(cart));
    sessionStorage.setItem('receiptTotal', document.getElementById('totalPrice').textContent);
    // Empty the cart
    localStorage.setItem('cart', JSON.stringify([]));
    // Redirect to receipt page
    window.location.href = "receipt.html";
});