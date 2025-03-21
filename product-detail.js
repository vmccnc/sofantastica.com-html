// This file’s content can be nearly identical to furniture-detail.js.
// For demonstration, we duplicate the logic and refer to productId.
function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

const productId = getQueryParam('id');
let selectedFabricId = null;
let finalPrice = null;

document.addEventListener('DOMContentLoaded', () => {
  fetch(`https://flato.q11.jvmhost.net/api/sofantastic/furniture/${productId}`)
    .then(response => response.json())
    .then(product => {
      document.getElementById('productName').textContent = product.name;
      document.getElementById('productImage').src = product.imageUrl;
      document.getElementById('productDescription').textContent = product.description;
      document.getElementById('basePrice').textContent = product.basePrice;
      document.getElementById('totalPrice').textContent = product.basePrice;
    })
    .catch(error => console.error('Error fetching product details:', error));

  fetch('https://flato.q11.jvmhost.net/api/sofantastic/fabric')
    .then(response => response.json())
    .then(fabrics => {
      const fabricList = document.getElementById('fabricList');
      fabrics.forEach(fabric => {
        const li = document.createElement('li');
        li.textContent = `${fabric.name} ( +${fabric.priceModifier} zł )`;
        li.setAttribute('data-id', fabric.id);
        li.addEventListener('click', () => {
          selectedFabricId = fabric.id;
          fetch(`/api/sofantastic/price?furnitureId=${productId}&fabricId=${fabric.id}`)
            .then(response => response.json())
            .then(price => {
              finalPrice = price;
              document.getElementById('totalPrice').textContent = finalPrice;
            })
            .catch(error => console.error('Error calculating price:', error));
          document.getElementById('fabricPanel').classList.remove('active');
        });
        fabricList.appendChild(li);
      });
    })
    .catch(error => console.error('Error fetching fabric list:', error));

  document.getElementById('openFabricBtn').addEventListener('click', () => {
    document.getElementById('fabricPanel').classList.add('active');
  });
  document.getElementById('closeFabricBtn').addEventListener('click', () => {
    document.getElementById('fabricPanel').classList.remove('active');
  });

  document.getElementById('addToCartBtn').addEventListener('click', () => {
    if (!selectedFabricId || !finalPrice) {
      alert('Please select a fabric first.');
      return;
    }
    const userId = 1;
    const cartItem = {
      userId: userId,
      furnitureId: parseInt(productId),
      fabricId: selectedFabricId,
      finalPrice: finalPrice
    };

    fetch('https://flato.q11.jvmhost.net/api/sofantastic/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cartItem)
    })
    .then(response => {
      if (response.ok) {
        alert('Added to cart successfully.');
      } else {
        alert('Error adding to cart.');
      }
    })
    .catch(error => {
      console.error('Error adding to cart:', error);
      alert('Error adding to cart.');
    });
  });
});
