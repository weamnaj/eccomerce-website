document.addEventListener('DOMContentLoaded', function() {
  let cart = getCart();
  let totalPrice = 0;
  displayCartItems();

  function getCart() {
    const cookie = document.cookie.split('; ').find(row => row.startsWith('cart='));
    return cookie ? JSON.parse(cookie.split('=')[1]) : {};
  }

  function saveCart() {
    document.cookie = `cart=${JSON.stringify(cart)}; path=/; max-age=${60 * 60 * 24 * 7}`;
  }

  function displayCartItems() {
    const cartContainer = document.getElementById('cartItems');
    cartContainer.innerHTML = '';
    totalPrice = 0;

    const ids = Object.keys(cart);
    if (ids.length === 0) {
      cartContainer.innerHTML = '<p>Your cart is empty</p>';
      document.getElementById('totalPrice').textContent = '0.00';
      return;
    }

    const promises = ids.map(id =>
      fetch(`https://fakestoreapi.com/products/${id}`)
        .then(res => res.json())
        .then(product => {
          const quantity = cart[id];
          totalPrice += product.price * quantity;
          renderItem(product, quantity);
        })
    );

    Promise.all(promises).then(() => {
      document.getElementById('totalPrice').textContent = totalPrice.toFixed(2);
    });
  }

  function renderItem(product, quantity) {
    const cartContainer = document.getElementById('cartItems');
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${product.image}" alt="${product.title}">
      <div class="cart-item-info">
        <h3>${product.title}</h3>
        <p>Price: $${product.price.toFixed(2)}</p>
        <p>Free shipping</p>
      </div>
      <div class="cart-item-controls">
        <input type="number" value="${quantity}" min="1" onchange="updateQuantity('${product.id}', this.value)">
        <button onclick="removeItem('${product.id}')">Remove</button>
      </div>
    `;
    cartContainer.appendChild(div);
  }

  window.removeItem = function(productId) {
    delete cart[productId];
    saveCart();
    displayCartItems();
  };

  window.updateQuantity = function(productId, newQty) {
    const quantity = parseInt(newQty);
    if (quantity < 1 || isNaN(quantity)) return;
    cart[productId] = quantity;
    saveCart();
    displayCartItems();
  };
});
