document.addEventListener('DOMContentLoaded', () => {
    const cartSummaryDiv = document.getElementById('cartSummary');
    const cartItemsDiv = document.getElementById('cartItems');
    const proceedToOrderBtn = document.getElementById('proceedToOrderBtn');
    const userId = 1; // Replace with actual user id
  
    function loadCart() {
      fetch(`https://flato.q11.jvmhost.net/api/sofantastic/cart/${userId}`)
        .then(response => response.json())
        .then(summary => {
          // summary contains { items: [...], total: ... }
          cartSummaryDiv.innerHTML = `Total: ${summary.total} zł`;
          cartItemsDiv.innerHTML = "";
          summary.items.forEach(item => {
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
              <p>Sofa: ${item.furnitureName}</p>
              <p>Fabric: ${item.fabricName}</p>
              <p>Price: ${item.finalPrice} zł</p>
            `;
            cartItemsDiv.appendChild(div);
          });
        })
        .catch(error => console.error('Error loading cart:', error));
    }
  
    loadCart();
  
    proceedToOrderBtn.addEventListener('click', () => {
      // Navigate to the order placement page
      window.location.href = "order-placement.html";
    });
  });
  