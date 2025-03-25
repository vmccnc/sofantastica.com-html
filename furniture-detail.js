function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

const furnitureId = getQueryParam('id');
let selectedFabricId = null;
let selectedFabricName = "";
let selectedTextureUrl = "";
let finalPrice = null;
let fabricPrice = 0;

document.addEventListener('DOMContentLoaded', () => {
  // Fetch furniture details from the server
  fetch(`https://flato.q11.jvmhost.net/api/sofantastic/furniture/${furnitureId}`)
    .then(response => response.json())
    .then(furniture => {
      document.getElementById('furnitureName').textContent = furniture.name;
      document.getElementById('furnitureImage').src = furniture.imageUrl;
      document.getElementById('furnitureDescription').textContent = furniture.description;
      document.getElementById('basePrice').textContent = furniture.basePrice;
      document.getElementById('totalPrice').textContent = furniture.basePrice;
    })
    .catch(error => console.error('Error fetching furniture details:', error));

  // "Go to 3D" button
  const go3dBtn = document.getElementById('go3dBtn');
  go3dBtn.addEventListener('click', () => {
    window.location.href = '3d.html';
  });
  
  // Fetch popular fabrics from the server
  fetch('https://flato.q11.jvmhost.net/api/sofantastic/fabric/popular')
    .then(response => response.json())
    .then(popularFabrics => {
      const popularList = document.getElementById('popularFabricList');
      popularFabrics.forEach(fabric => {
        const li = createFabricListItem(fabric);
        popularList.appendChild(li);
      });
      // Fetch all fabrics for "Other Fabrics"
      fetch('https://flato.q11.jvmhost.net/api/sofantastic/fabric')
        .then(response => response.json())
        .then(allFabrics => {
          const popularIds = popularFabrics.map(f => f.id);
          const otherFabrics = allFabrics.filter(f => !popularIds.includes(f.id));
          const otherList = document.getElementById('otherFabricList');
          otherFabrics.forEach(fabric => {
            const li = createFabricListItem(fabric);
            otherList.appendChild(li);
          });
        })
        .catch(error => console.error('Error fetching all fabrics:', error));
    })
    .catch(error => console.error('Error fetching popular fabrics:', error));

  // Show fabric panel
  document.getElementById('openFabricBtn').addEventListener('click', () => {
    document.getElementById('fabricPanel').classList.add('active');
  });
  // Close fabric panel
  document.getElementById('closeFabricBtn').addEventListener('click', () => {
    document.getElementById('fabricPanel').classList.remove('active');
  });

  // Add to Cart button event
  document.getElementById('addToCartBtn').addEventListener('click', () => {
    if (!selectedFabricId || !finalPrice) {
      alert('Please select a fabric first.');
      return;
    }
    const userId = "1"; // Demo user (as string)
    // Now include all required fields
    const cartItem = {
      userId: userId,
      furnitureId: parseInt(furnitureId),
      furnitureName: document.getElementById('furnitureName').textContent,
      furnitureUrl: document.getElementById('furnitureImage').src,
      fabricId: selectedFabricId,
      fabricName: selectedFabricName,
      fabricUrl: selectedTextureUrl,
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

  // Modal logic for fabric preview
  const fabricModal = document.getElementById('fabricModal');
  const modalImage = document.getElementById('modalImage');
  const closeModalBtn = document.getElementById('closeModalBtn');

  function openModal(imageUrl) {
    modalImage.src = imageUrl;
    fabricModal.style.display = 'block';
  }

  closeModalBtn.addEventListener('click', () => {
    fabricModal.style.display = 'none';
  });
  window.addEventListener('click', (event) => {
    if (event.target === fabricModal) {
      fabricModal.style.display = 'none';
    }
  });
});

// Helper function to create a fabric list item
function createFabricListItem(fabric) {
  const li = document.createElement('li');

  // Create fabric image element (50x50)
  const img = document.createElement('img');
  img.src = fabric.textureUrl;
  img.alt = fabric.name;
  // Clicking the image opens a modal with a larger preview
  img.addEventListener('click', (e) => {
    e.stopPropagation();
    openModal(fabric.textureUrl);
  });

  const span = document.createElement('span');
  span.textContent = `${fabric.name} ( +${fabric.priceModifier} zł )`;

  li.appendChild(img);
  li.appendChild(span);
  li.setAttribute('data-id', fabric.id);
  li.addEventListener('click', () => {
    selectedFabricId = fabric.id;
    fabricPrice = fabric.priceModifier;
    // Set the additional fabric fields
    selectedFabricName = fabric.name;
    selectedTextureUrl = fabric.textureUrl;
    // Update Fabric Price display with both price and fabric name
    document.getElementById('fabricPrice').textContent = fabric.priceModifier + " zł, " + fabric.name;
    // Fetch final price from server
    fetch(`https://flato.q11.jvmhost.net/api/sofantastic/price?furnitureId=${furnitureId}&fabricId=${fabric.id}`)
      .then(response => response.json())
      .then(priceData => {
        finalPrice = priceData;
        document.getElementById('totalPrice').textContent = finalPrice;
      })
      .catch(error => console.error('Error calculating price:', error));
    // Update fabric overlay on furniture image (bottom-left corner)
    const fabricOverlay = document.getElementById('fabricOverlay');
    const fabricOverlayImg = document.getElementById('fabricOverlayImg');
    fabricOverlayImg.src = fabric.textureUrl;
    fabricOverlay.style.display = 'block';
    // Close the fabric panel
    document.getElementById('fabricPanel').classList.remove('active');
  });
  return li;
}
