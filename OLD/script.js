// Utility: Get cart from localStorage
function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

// Utility: Save cart to localStorage
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Utility: Update cart count in nav
function updateCartCount() {
  let cart = getCart();
  let cartLink = document.querySelector('a[href="cart.html"]');
  if (cartLink) {
    let countSpan = cartLink.querySelector('.cart-count');
    if (!countSpan) {
      countSpan = document.createElement('span');
      countSpan.className = 'cart-count';
      cartLink.appendChild(countSpan);
    }
    countSpan.textContent = cart.length;
  }
}

// Add to Cart button handler
function handleAddToCart(e) {
  if (e.target.tagName === 'BUTTON' && e.target.textContent === 'Add to Cart') {
    const article = e.target.closest('article');
    const title = article.querySelector('h3').textContent;
    const desc = article.querySelector('p').textContent;
    const img = article.querySelector('img').src;
    let cart = getCart();
    cart.push({ title, desc, img });
    saveCart(cart);
    updateCartCount();
    e.target.textContent = 'Added!';
    setTimeout(() => { e.target.textContent = 'Add to Cart'; }, 1000);
  }
}

// Attach event listeners after DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  // Delegate add-to-cart clicks
  document.querySelector('#products ul').addEventListener('click', handleAddToCart);

  // Show cart count on page load
  updateCartCount();
});

// Optional: Style cart count badge
const style = document.createElement('style');
style.textContent = `
.cart-count {
  background: #ff4757;
  color: #fff;
  border-radius: 50%;
  padding: 2px 7px;
  font-size: 0.9em;
  margin-left: 6px;
  vertical-align: middle;
}
`;
document.head.appendChild(style);
document.querySelector('form').addEventListener('submit', function(e) {
  e.preventDefault();
  const query = document.getElementById('search').value.trim().toLowerCase();
  const items = document.querySelectorAll('#products ul > li');

  items.forEach(li => {
    const title = li.querySelector('h3').textContent.toLowerCase();
    const desc = li.querySelector('p').textContent.toLowerCase();
    if (title.includes(query) || desc.includes(query)) {
      li.style.display = '';
    } else {
      li.style.display = 'none';
    }
  });
});

// Optional: Reset search filter when input is cleared
document.getElementById('search').addEventListener('input', function() {
  if (this.value.trim() === '') {
    document.querySelectorAll('#products ul > li').forEach(li => {
      li.style.display = '';
    });
  }
});