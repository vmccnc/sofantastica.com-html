document.addEventListener('DOMContentLoaded', () => {
  const ordersContainer = document.getElementById('ordersContainer');
  const addOrderBtn = document.getElementById('addOrderBtn');
  const calculateBtn = document.getElementById('calculateBtn');
  const planResultsDiv = document.getElementById('planResults');
  const breakdownListDiv = document.getElementById('breakdownList');
  const breakdownTotalDiv = document.getElementById('breakdownTotal');
  
  // Array to hold available sofas from server
  let sofas = [];

  // Load available sofas for dropdown
  function loadSofas() {
    fetch('http://localhost:8090/api/sofantastic/sofa')
      .then(response => response.json())
      .then(data => {
        sofas = data;
      })
      .catch(error => console.error('Error loading sofas:', error));
  }
  loadSofas();

  // Add new order row
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

    // Existing Production Plan calculation (per sofa)
    fetch('http://localhost:8090/api/sofantastic/production/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orders)
    })
      .then(response => response.json())
      .then(result => {
        planResultsDiv.innerHTML = "<h2>Production Plan</h2>";
        let overallTotal = 0;
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
        const summaryDiv = document.createElement('div');
        summaryDiv.className = 'summary';
        summaryDiv.innerHTML = `<p>Total Required Elements (Plan): ${overallTotal}</p>`;
        planResultsDiv.appendChild(summaryDiv);
      })
      .catch(error => console.error('Error calculating production plan:', error));

    // New: Production Plan2 - breakdown by production object dimensions
    fetch('http://localhost:8090/api/sofantastic/production/breakdown', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orders)
    })
      .then(response => response.json())
      .then(breakdown => {
        breakdownListDiv.innerHTML = "";
        breakdown.breakdown.forEach(item => {
          const p = document.createElement('p');
          p.className = 'breakdown-item';
          p.textContent = `${item.dimensions} - ${item.totalItems} items`;
          breakdownListDiv.appendChild(p);
        });
        breakdownTotalDiv.innerHTML = `<p>Total Required Elements (Breakdown): ${breakdown.overallTotal}</p>`;
      })
      .catch(error => console.error('Error calculating production breakdown:', error));
  });
});
