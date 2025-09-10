
// let totalPrice=0;

// let cart=getCart() ;

// function getCart() {
//   const cartCookie = document.cookie.split('; ').find(row => row.startsWith('cart='));
//   return cartCookie ? JSON.parse(cartCookie.split('=')[1]) : [];

// }

// function removeFromCart(productId) {
  
//     let index = cart.findIndex(id => id === productId);
//     const itemDiv = document.querySelector(`[data-product-id="${productId}"]`);
//     if (itemDiv){
//          itemDiv.remove();
//         cart.splice(index, 1);
//         document.cookie = `cart=${JSON.stringify(cart)}; path=/`;
        
//     }
//     document.cookie = `cart=${JSON.stringify(cart)}; path=/`;

//     const xhr = new XMLHttpRequest();
//     xhr.open('GET', `https://fakestoreapi.com/products/${productId}`);
  
//     xhr.onload = function() {
//       if (xhr.status >= 200 && xhr.status < 300) {
//         const product = JSON.parse(xhr.responseText);
//         const productPrice = product.price;
  
//         // Update total price
//         totalPrice -= productPrice;
//         document.getElementById('totalPrice').innerText = `Total Price: $${totalPrice.toFixed(2)}`;
//       } else {
//         console.error('Error fetching product details:', xhr.statusText);
//       }
//     };
  
//     xhr.send();
//   }


// function initializeCart() {
//     const cart = getCart();
//     const cartItemsContainer = document.getElementById('cartItems');
//     let initialTotalPrice = 0;
  
//     for (const id of cart) {
//       const productUrl = `https://fakestoreapi.com/products/${id}`;
//       const xhr = new XMLHttpRequest();
//       xhr.open('GET', productUrl);

//       xhr.onload = function () {
//         if (xhr.status >= 200 && xhr.status < 300) {
//           const product = JSON.parse(xhr.responseText);
//               initialTotalPrice += product.price;
//           const itemDiv = document.createElement('div');
//           itemDiv.classList.add('cart-item');
//           // itemDiv.dataset.productId = id;
//           itemDiv.setAttribute('data-product-id', id);

//           itemDiv.innerHTML = `
//             <h3>${product.title}</h3>
//             <img src="${product.image}" alt="${product.title}">
//             <p>Price: $${product.price}</p>
//                         <p>"free shipping"</p>

//             <button onclick="removeFromCart(${id})">Remove</button>
//             <input type="number" value="1" min="1" onchange="updateQuantity(${id}, this.value)">
//           `;
//           cartItemsContainer.appendChild(itemDiv);
//           totalPrice = initialTotalPrice;

//         } else {
//           console.error('Error fetching product:', xhr.statusText);
//         }
//       };
  
//       xhr.send();
//     }
  
//     totalPrice = initialTotalPrice;
//     document.getElementById('totalPrice').innerText = `Total Price: $${totalPrice.toFixed(2)}`;
//   }


// // function updateQuantity(productId, newQuantity) {
 
// //     const productIndex = cart.findIndex(item => item.id === productId);
  
// //     if (productIndex !== -1) {
// //       cart[productIndex].quantity = newQuantity;
// //       cart[productIndex].price *= newQuantity; 
  
// //       document.cookie = `cart=${JSON.stringify(cart)}; path=/`;
  
// //   }
// initializeCart();
document.addEventListener('DOMContentLoaded', function () {
    let cart = getCart(); // { "1": 2, "3": 1 }
    let totalPrice = 0;

    displayCartItems();

    function getCart() {
        const cookie = document.cookie.split('; ').find(row => row.startsWith('cart='));
        return cookie ? JSON.parse(cookie.split('=')[1]) : {};
    }

    function setCart(cartObj) {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 7);
        document.cookie = `cart=${JSON.stringify(cartObj)}; expires=${expirationDate.toUTCString()}; path=/`;
    }

    function displayCartItems() {
        const cartItemsContainer = document.getElementById('cartItems');
        cartItemsContainer.innerHTML = '';
        totalPrice = 0;

        const productIds = Object.keys(cart);
        if (productIds.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
            document.getElementById('totalPrice').textContent = '0.00';
            return;
        }

        Promise.all(productIds.map(id => fetchProduct(id, cart[id])))
            .then(() => {
                document.getElementById('totalPrice').textContent = totalPrice.toFixed(2);
            })
            .catch(() => {
                cartItemsContainer.innerHTML = '<p>Error loading cart items.</p>';
            });
    }

    function fetchProduct(id, quantity) {
        return fetch(`https://fakestoreapi.com/products/${id}`)
            .then(res => res.json())
            .then(product => {
                totalPrice += product.price * quantity;
                renderCartItem(product, quantity);
            });
    }

    function renderCartItem(product, quantity) {
        const cartItemsContainer = document.getElementById('cartItems');
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <div class="cart-item-info">
                <h3>${product.title}</h3>
                <p>Price: $${product.price.toFixed(2)}</p>
                <p>Free shipping</p>
            </div>
            <div class="cart-item-controls">
                <input type="number" min="1" value="${quantity}" onchange="updateQuantity(${product.id}, this.value)">
                <button onclick="removeFromCart(${product.id})">Remove</button>
            </div>
        `;
        cartItemsContainer.appendChild(itemDiv);
    }

    window.removeFromCart = function (productId) {
        delete cart[productId];
        setCart(cart);
        displayCartItems();
    };

    window.updateQuantity = function (productId, newQuantity) {
        newQuantity = parseInt(newQuantity);
        if (isNaN(newQuantity) || newQuantity < 1) return;

        cart[productId] = newQuantity;
        setCart(cart);
        displayCartItems();
    };
});
// Initialize cart count display
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    const cart = getCart();
    const count = Object.keys(cart).length;
    cartCount.textContent = count > 0 ? count : '';
}
// Call updateCartCount on page load
document.addEventListener('DOMContentLoaded', updateCartCount);
// Fetch products on page load
document.addEventListener('DOMContentLoaded', fetchProducts);
// Function to fetch products from the API
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