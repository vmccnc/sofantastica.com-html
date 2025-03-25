document.addEventListener('DOMContentLoaded', () => {
    const ordersListDiv = document.getElementById('ordersList');
    const userId = "exampleUser"; // Replace with actual user identification
  
    function loadOrders() {
      fetch(`https://flato.q11.jvmhost.net/api/sofantastic/order/${userId}`)
        .then(response => response.json())
        .then(orders => {
          ordersListDiv.innerHTML = "";
          orders.forEach(order => {
            const div = document.createElement('div');
            div.className = 'order';
            let itemsHtml = "";
            order.items.forEach(item => {
              itemsHtml += `<p>${item.furnitureName} with ${item.fabricName} (Fabric URL: ${item.fabricUrl}) - Price: ${item.finalPrice} zł</p>`;
            });
            div.innerHTML = `
              <h3>Order ID: ${order.id}</h3>
              <p>Status: ${order.status}</p>
              ${itemsHtml}
              <p><strong>Total Price:</strong> ${order.totalPrice} zł</p>
            `;
            ordersListDiv.appendChild(div);
          });
        })
        .catch(error => console.error('Error loading orders:', error));
    }
  
    loadOrders();
  });
  