function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  }
  
  const furnitureId = getQueryParam('id');
  let selectedFabricId = null;
  let finalPrice = null;
  
  document.addEventListener('DOMContentLoaded', () => {
    // Fetch furniture details
    fetch(`https://flato.q11.jvmhost.net/api/furniture/${furnitureId}`)
      .then(response => response.json())
      .then(furniture => {
        document.getElementById('furnitureName').textContent = furniture.name;
        document.getElementById('furnitureImage').src = furniture.imageUrl;
        document.getElementById('furnitureDescription').textContent = furniture.description;
        document.getElementById('basePrice').textContent = furniture.basePrice;
        document.getElementById('totalPrice').textContent = furniture.basePrice;
      })
      .catch(error => console.error('Error fetching furniture details:', error));
  
    // Fetch popular fabrics
    fetch('https://flato.q11.jvmhost.net/api/fabric/popular')
      .then(response => response.json())
      .then(popularFabrics => {
        const popularList = document.getElementById('popularFabricList');
        popularFabrics.forEach(fabric => {
          const li = createFabricListItem(fabric);
          popularList.appendChild(li);
        });
        // Now fetch all fabrics for other fabrics
        fetch('https://flato.q11.jvmhost.net/api/fabric')
          .then(response => response.json())
          .then(allFabrics => {
            // Exclude popular fabrics by id
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
  
    // Add to Cart
    document.getElementById('addToCartBtn').addEventListener('click', () => {
      if (!selectedFabricId || !finalPrice) {
        alert('Please select a fabric first.');
        return;
      }
      const userId = 1; // demo user
      const cartItem = {
        userId: userId,
        furnitureId: parseInt(furnitureId),
        fabricId: selectedFabricId,
        finalPrice: finalPrice
      };
      fetch('https://flato.q11.jvmhost.net/api/cart', {
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
  
    // Modal for fabric preview
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
  
  // Helper to create a fabric list item
  function createFabricListItem(fabric) {
    const li = document.createElement('li');
  
    // Fabric image (50x50)
    const img = document.createElement('img');
    img.src = fabric.textureUrl;
    img.alt = fabric.name;
    // Clicking the small image opens the modal preview
    img.addEventListener('click', (e) => {
      e.stopPropagation(); // prevent selecting the fabric on li click
      openModal(fabric.textureUrl);
    });
  
    const span = document.createElement('span');
    span.textContent = `${fabric.name} ( +${fabric.priceModifier} zł )`;
  
    li.appendChild(img);
    li.appendChild(span);
  
    li.setAttribute('data-id', fabric.id);
    li.addEventListener('click', () => {
      selectedFabricId = fabric.id;
      fetch(`https://flato.q11.jvmhost.net/api/price?furnitureId=${furnitureId}&fabricId=${fabric.id}`)
        .then(response => response.json())
        .then(priceData => {
          finalPrice = priceData;
          document.getElementById('totalPrice').textContent = finalPrice;
        })
        .catch(error => console.error('Error calculating price:', error));
      document.getElementById('fabricPanel').classList.remove('active');
    });
    return li;
  }
  