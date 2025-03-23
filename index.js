document.addEventListener('DOMContentLoaded', () => {
  const productsContainer = document.getElementById('productsContainer');
  const categorySelect = document.getElementById('categorySelect');
  const minPriceSlider = document.getElementById('minPriceSlider');
  const maxPriceSlider = document.getElementById('maxPriceSlider');
  const minPriceDisplay = document.getElementById('minPriceDisplay');
  const maxPriceDisplay = document.getElementById('maxPriceDisplay');
  const applyFiltersBtn = document.getElementById('applyFiltersBtn');
  let maxPriceFromServer = 0;

  // Populate categories dropdown from server endpoint
  fetch('http://localhost:8090/api/sofantastic/furniture/categories')
    .then(response => response.json())
    .then(categories => {
      categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        categorySelect.appendChild(option);
      });
    })
    .catch(error => console.error('Error fetching categories:', error));

  // Fetch max price from server for slider limit
  fetch('http://localhost:8090/api/sofantastic/furniture/maxPrice')
    .then(response => response.json())
    .then(maxPrice => {
      maxPriceFromServer = maxPrice;
      minPriceSlider.max = maxPrice;
      maxPriceSlider.max = maxPrice;
      minPriceSlider.value = 0;
      maxPriceSlider.value = maxPrice;
      minPriceDisplay.textContent = "0";
      maxPriceDisplay.textContent = maxPrice;
    })
    .catch(error => console.error('Error fetching max price:', error));

  // Update slider displays on input
  minPriceSlider.addEventListener('input', () => {
    minPriceDisplay.textContent = minPriceSlider.value;
  });
  maxPriceSlider.addEventListener('input', () => {
    maxPriceDisplay.textContent = maxPriceSlider.value;
  });

  function loadProducts() {
    const category = categorySelect.value;
    const minPrice = minPriceSlider.value;
    const maxPrice = maxPriceSlider.value;
    let url = 'http://localhost:8090/api/sofantastic/furniture?';
    if (category) {
      url += `category=${encodeURIComponent(category)}&`;
    }
    if (minPrice) {
      url += `minPrice=${minPrice}&`;
    }
    if (maxPrice) {
      url += `maxPrice=${maxPrice}&`;
    }
    url = url.slice(0, -1); // Remove trailing '&'

    fetch(url)
      .then(response => response.json())
      .then(data => {
        productsContainer.innerHTML = "";
        data.forEach(product => {
          const card = document.createElement('div');
          card.className = 'product-card';
          card.innerHTML = `
            <img src="${product.imageUrl}" alt="${product.name}">
            <h4>${product.name}</h4>
            <p>Base Price: ${product.basePrice} zł</p>
          `;
          card.addEventListener('click', () => {
            window.location.href = `furniture-detail.html?id=${product.id}`;
          });
          productsContainer.appendChild(card);
        });
      })
      .catch(error => console.error('Error fetching furniture:', error));
  }

  // Initial load and apply filter on button click
  loadProducts();
  applyFiltersBtn.addEventListener('click', loadProducts);
});
