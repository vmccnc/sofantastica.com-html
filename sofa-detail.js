document.addEventListener('DOMContentLoaded', () => {
  // Use "sofaId" as the query parameter name
  const urlParams = new URLSearchParams(window.location.search);
  const sofaId = urlParams.get('sofaId');
  
  // Elements for sofa details
  const sofaNameElem = document.getElementById('sofaName');
  const sofaImageElem = document.getElementById('sofaImage');
  const sofaDescriptionElem = document.getElementById('sofaDescription');
  const sofaPriceElem = document.getElementById('sofaPrice');
  
  const productionObjectsDiv = document.getElementById('productionObjects');
  const prodObjectForm = document.getElementById('prodObjectForm');
  
  // Variables for selected fabric info
  let selectedFabricId = null;
  let selectedFabricName = "";
  let selectedTextureUrl = "";
  let finalPrice = null;
  
  // Fetch sofa details from the server
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
  
  // Load production objects for this sofa
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
  
  // Handle Add to Cart button click:
  document.getElementById('addToCartBtn').addEventListener('click', () => {
    // Check if a fabric has been selected by your app logic.
    // (Assume that fabric selection is done elsewhere on the page, setting these variables.)
    if (!selectedFabricId || !finalPrice) {
      alert('Please select a fabric first!');
      return;
    }
    
    // Create the cart item object using sofa details and selected fabric details.
    const cartItem = {
      userId: 1, // update with actual user id
      furnitureId: parseInt(sofaId),
      furnitureName: sofaNameElem.textContent,
      furnitureUrl: sofaImageElem.src,
      fabricId: selectedFabricId,
      fabricName: selectedFabricName,
      textureUrl: selectedTextureUrl,
      finalPrice: finalPrice
    };
    
    fetch('https://flato.q11.jvmhost.net/api/sofantastic/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cartItem)
    })
    .then(response => response.json())
    .then(data => {
      alert('Added to cart successfully!');
    })
    .catch(error => console.error('Error adding to cart:', error));
  });
  
  // Fabric selection function – this should be called when a fabric is selected.
  // Replace this simulation with your actual fabric selection logic.
  function selectFabric(fabric) {
    // fabric is an object with fields: id, name, textureUrl, priceModifier
    selectedFabricId = fabric.id;
    selectedFabricName = fabric.name;
    selectedTextureUrl = fabric.textureUrl;
    // Call price endpoint to calculate final price:
    fetch(`https://flato.q11.jvmhost.net/api/sofantastic/price?furnitureId=${sofaId}&fabricId=${fabric.id}`)
      .then(response => response.json())
      .then(price => {
        finalPrice = price;
      })
      .catch(error => console.error('Error calculating price:', error));
  }
  
  // For testing, you can simulate a fabric selection:
  // Uncomment to simulate after 3 seconds:
  // setTimeout(() => selectFabric({id: 1, name: "Red Fabric", textureUrl: "https://example.com/red.jpg", priceModifier: 350}), 3000);
});
