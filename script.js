// Description: This script fetches product data from an API, displays it on a webpage, allows users to search for products, and manage a shopping cart using cookies.
const apiUrl = 'https://fakestoreapi.com/products';
const productList = document.getElementById('product-list');
let searchedproduct = []; // Store fetched products
let cart = getCart();
let count = cart.length;

// Initialize cart count display
updateCartCount();

function fetchProducts() {
  const mainproductpage = new XMLHttpRequest();
  mainproductpage.open('GET', 'https://fakestoreapi.com/products');
  mainproductpage.onload = function() {
    if (mainproductpage.status >= 200 && mainproductpage.status < 300) {
      const products = JSON.parse(mainproductpage.responseText);
      searchedproduct = products; // Store the fetched products
      displayProducts(products);
    } else {
      console.error('Error fetching products: HTTP status->', mainproductpage.status);
    }
  };
  mainproductpage.send();
}

function displayProducts(productsToDisplay) {
  productList.innerHTML = '';

  for (const product of productsToDisplay) {
    const productHtml = `
      <li class="product-item">
        <div class="product">
          <img src="${product.image}" alt="${product.title}">
          <h3>${product.title}</h3>
          <p>Price: $${product.price}</p>
          <p>free-shipping</p>
          <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
          <br>
          <i class="fa-solid fa-star" style="color: #FFD43B;"></i><i class="fa-solid fa-star" style="color: #FFD43B;"></i><i class="fa-solid fa-star" style="color: #FFD43B;"></i><i class="fa-solid fa-star" style="color: #FFD43B;"></i><i class="fa-solid fa-star" style="color: #FFD43B;"></i>
          <br>
          <a href="productdetail.html?id=${product.id}">View Details</a>
        </div>
      </li>
    `;
    productList.innerHTML += productHtml;
  }
  setupAddToCartButtons();
}

const searchButton = document.querySelector('.searchButton');
const searchInput = document.getElementById('search');

searchButton.addEventListener('click', () => {
  const searchTerm = searchInput.value.toLowerCase();
  const filteredProducts = searchedproduct.filter(product => 
    product.title.toLowerCase().includes(searchTerm)
  );
  displayProducts(filteredProducts);
});

function setupAddToCartButtons() {
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  for (const button of addToCartButtons) {
    button.addEventListener('click', () => {
      const productId = button.getAttribute('data-id');
      addToCart(productId);
    });
  }
}

function addToCart(productId) {
  cart.push(productId);
  count++;
  // Set cookie with expiration (7 days) and path
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 7);
  document.cookie = `cart=${JSON.stringify(cart)}; expires=${expirationDate.toUTCString()}; path=/`;
  updateCartCount();
  alert(`Product added to cart! Total items in cart: ${count}`);
}

function getCart() {
  const cartCookie = document.cookie.split('; ').find(row => row.startsWith('cart='));
  if (cartCookie) {
    try {
      return JSON.parse(cartCookie.split('=')[1]);
    } catch (e) {
      console.error('Error parsing cart cookie:', e);
      return [];
    }
  }
  return [];
}

function updateCartCount() {
  document.getElementById("styling").innerText = `${count}`;
}

fetchProducts();