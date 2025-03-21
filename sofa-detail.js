document.addEventListener('DOMContentLoaded', () => {
  // Use "sofaId" as the query parameter name
  const urlParams = new URLSearchParams(window.location.search);
  const sofaId = urlParams.get('sofaId');
  
  const sofaNameElem = document.getElementById('sofaName');
  const sofaImageElem = document.getElementById('sofaImage');
  const sofaDescriptionElem = document.getElementById('sofaDescription');
  const sofaPriceElem = document.getElementById('sofaPrice');
  const productionObjectsDiv = document.getElementById('productionObjects');
  const prodObjectForm = document.getElementById('prodObjectForm');

  // Fetch sofa details using sofaId
  fetch(`https://flato.q11.jvmhost.net/api/sofantastic/sofa/${sofaId}`)
    .then(response => response.json())
    .then(sofa => {
      sofaNameElem.textContent = sofa.name;
      sofaImageElem.src = sofa.imageUrl;
      sofaDescriptionElem.textContent = sofa.description;
      sofaPriceElem.textContent = sofa.basePrice;
      loadProductionObjects();
    })
    .catch(error => console.error('Error fetching sofa details:', error));

  // Function to load production objects for this sofa
  function loadProductionObjects() {
    fetch(`https://flato.q11.jvmhost.net/api/sofantastic/production-object/sofa/${sofaId}`)
      .then(response => response.json())
      .then(objects => {
        productionObjectsDiv.innerHTML = "";
        objects.forEach(obj => {
          const div = document.createElement('div');
          div.className = 'production-object';
          div.textContent = `Element Name: ${obj.nameOfElement}, DSP Count: ${obj.dspCount}, Dimensions: ${obj.dimensions}`;
          productionObjectsDiv.appendChild(div);
        });
      })
      .catch(error => console.error('Error loading production objects:', error));
  }

  // Handle form submission to add a production object for this sofa
  prodObjectForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newProdObject = {
      nameOfElement: document.getElementById('nameOfElement').value,
      dspCount: parseInt(document.getElementById('dspCount').value),
      dimensions: document.getElementById('dimensions').value,
      sofa: { id: parseInt(sofaId) }
    };

    fetch('https://flato.q11.jvmhost.net/api/sofantastic/production-object', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProdObject)
    })
    .then(response => response.json())
    .then(data => {
      alert('Production object added!');
      prodObjectForm.reset();
      loadProductionObjects();
    })
    .catch(error => console.error('Error adding production object:', error));
  });
});
