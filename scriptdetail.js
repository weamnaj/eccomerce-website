   
function fetchProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
  
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `https://fakestoreapi.com/products/${id}`);
  
    xhr.onload = function () {
      if (xhr.status === 200) {
        const product = JSON.parse(xhr.responseText);
  
        const productDetails = document.getElementById('productDetails');
        productDetails.innerHTML = `
          <div class="product-details">
            <img src="${product.image}" alt="${product.title}">
            <span>
              <h2>${product.title}</h2>
              <h4>Price: $${product.price}</h4>
              <h3>description:</h3>
              <p>${product.description}</p>
              <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
              <button class="add-to-cart">Buy Now</button>  </span>
          </div>
        `;
      } else {
        console.error('Error fetching product details:', xhr.statusText);
      }
    };
  
    xhr.send();
  }
fetchProductDetails();