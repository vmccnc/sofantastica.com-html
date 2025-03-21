document.addEventListener('DOMContentLoaded', () => {
  const ordersContainer = document.getElementById('ordersContainer');
  const addOrderBtn = document.getElementById('addOrderBtn');
  const calculateBtn = document.getElementById('calculateBtn');
  const planResultsDiv = document.getElementById('planResults');
  
  // Array to hold available sofas loaded from server
  let sofas = [];

  // Load available sofas for the dropdown
  function loadSofas() {
    fetch('https://flato.q11.jvmhost.net/api/sofantastic/sofa')
      .then(response => response.json())
      .then(data => {
        sofas = data;
      })
      .catch(error => console.error('Error loading sofas:', error));
  }
  loadSofas();

  // Add a new order row
  function addOrderRow() {
    const div = document.createElement('div');
    div.className = 'order';
    
    const select = document.createElement('select');
    sofas.forEach(sofa => {
      const option = document.createElement('option');
      option.value = sofa.id;
      option.textContent = sofa.name;
      select.appendChild(option);
    });
    
    const qtyInput = document.createElement('input');
    qtyInput.type = 'number';
    qtyInput.min = 1;
    qtyInput.value = 1;
    
    div.appendChild(select);
    div.appendChild(qtyInput);
    ordersContainer.appendChild(div);
  }

  addOrderBtn.addEventListener('click', addOrderRow);

  calculateBtn.addEventListener('click', () => {
    const orderElements = document.querySelectorAll('.order');
    const orders = [];
    orderElements.forEach(orderEl => {
      const sofaId = parseInt(orderEl.querySelector('select').value);
      const quantity = parseInt(orderEl.querySelector('input').value);
      orders.push({ sofaId, quantity });
    });

    fetch('https://flato.q11.jvmhost.net/api/sofantastic/production/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orders)
    })
      .then(response => response.json())
      .then(result => {
        planResultsDiv.innerHTML = "<h2>Production Plan</h2>";
        let overallTotal = 0;
        // List each production plan item with sofa name, dimensions and required DSP elements
        result.forEach(item => {
          const div = document.createElement('div');
          div.className = 'plan-item';
          div.innerHTML = `
            <p>Sofa: ${item.sofaName}</p>
            <p>Dimensions: ${item.dimensions}</p>
            <p>Required DSP Elements: ${item.totalDSPElements}</p>
          `;
          planResultsDiv.appendChild(div);
          overallTotal += item.totalDSPElements;
        });
        // Below, show a summary list (each distinct production element: dimensions and amount)
        // For simplicity, we assume each production plan item represents a unique production element.
        const summaryDiv = document.createElement('div');
        summaryDiv.className = 'summary';
        summaryDiv.innerHTML = `<p>Total Required Elements: ${overallTotal}</p>`;
        planResultsDiv.appendChild(summaryDiv);
      })
      .catch(error => console.error('Error calculating production plan:', error));
  });
});
