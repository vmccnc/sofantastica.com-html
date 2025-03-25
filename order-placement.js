document.addEventListener('DOMContentLoaded', () => {
    const orderForm = document.getElementById('orderForm');
    // For demo purposes, using a fixed user id; in real application, get from session/authentication.
    const userId = "exampleUser";
  
    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const buyerPhone = document.getElementById('buyerPhone').value;
      const buyerEmail = document.getElementById('buyerEmail').value;
      
      const orderData = {
        userId: userId,
        buyerPhone: buyerPhone,
        buyerEmail: buyerEmail
      };
      
      fetch('https://flato.q11.jvmhost.net/api/sofantastic/order/place', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })
      .then(response => {
        if (response.ok) return response.json();
        else throw new Error('Order placement failed.');
      })
      .then(data => {
        alert('Order placed successfully!');
        window.location.href = "orders.html";
      })
      .catch(error => {
        console.error('Error placing order:', error);
        alert('Error placing order.');
      });
    });
  });
  