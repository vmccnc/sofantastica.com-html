// ----- Global Variables -----
let selectedFilterColor = null; // for filter swatches in the sidebar
let globalMaterialColor = null; // chosen via the “Выбрать цвет” button on main page
let currentView = "grid";

// Utility: Convert HEX to RGBA string with given alpha
function hexToRGBA(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Sample product data with updated image URLs by category
const products = [
  // Sofas (divan)
  {
    id: 1,
    name: "Диван Comfort",
    type: "divan",
    shape: "straight",
    size: "medium",
    function: "sleep",
    material: "fabric",
    price: 2500,
    popularity: 8,
    newest: true,
    image: "https://sofantastic.pl/726-large_default/kanapa-santia-rozkladana.jpg",
    colors: ["#a0522d", "#708090", "#2f4f4f"],
    description: "Комфортный диван для уютного отдыха.",
    dimensions: "200x90x80 см"
  },
  {
    id: 2,
    name: "Диван Luxe",
    type: "divan",
    shape: "corner",
    size: "large",
    function: "storage",
    material: "leather",
    price: 3200,
    popularity: 10,
    newest: false,
    image: "https://sofantastic.pl/855-large_default/kanapa-santia-rozkladana.jpg",
    colors: ["#8b0000", "#556b2f", "#708090"],
    description: "Элегантный диван для стильного интерьера.",
    dimensions: "220x95x85 см"
  },
  {
    id: 7,
    name: "Диван Classic",
    type: "divan",
    shape: "straight",
    size: "medium",
    function: "sleep",
    material: "fabric",
    price: 2700,
    popularity: 8,
    newest: false,
    image: "https://sofantastic.pl/851-large_default/wersalka-suno.jpg",
    colors: ["#708090", "#2f4f4f"],
    description: "Классический диван, проверенный временем.",
    dimensions: "210x100x85 см"
  },
  // Armchairs (кресла)
  {
    id: 3,
    name: "Кресло Relax",
    type: "armchair",
    shape: "modular",
    size: "small",
    function: "basic",
    material: "velvet",
    price: 1200,
    popularity: 6,
    newest: true,
    image: "https://sofantastic.pl/836-large_default/fotel-uszak-moon-styl-skandynawski.jpg",
    colors: ["#a0522d", "#2f4f4f", "#556b2f"],
    description: "Удобное кресло для отдыха и чтения.",
    dimensions: "90x90x100 см"
  },
  {
    id: 6,
    name: "Кресло Elegance",
    type: "armchair",
    shape: "straight",
    size: "small",
    function: "basic",
    material: "velvet",
    price: 1400,
    popularity: 7,
    newest: false,
    image: "https://sofantastic.pl/833-large_default/fotel-uszak-moon-styl-skandynawski.jpg",
    colors: ["#a0522d", "#556b2f"],
    description: "Изысканное кресло для вашего кабинета.",
    dimensions: "95x95x100 см"
  },
  // Poufs
  {
    id: 4,
    name: "Пуф Modern",
    type: "pouf",
    shape: "modular",
    size: "small",
    function: "basic",
    material: "fabric",
    price: 800,
    popularity: 5,
    newest: false,
    image: "https://sofantastic.pl/248-large_default/puf-krasnal-ze-schowkiem-kolor-melanz.jpg",
    colors: ["#556b2f", "#708090"],
    description: "Современный пуф, который добавит изюминку в интерьер.",
    dimensions: "50x50x40 см"
  },
  {
    id: 8,
    name: "Пуф Cozy",
    type: "pouf",
    shape: "modular",
    size: "small",
    function: "basic",
    material: "fabric",
    price: 900,
    popularity: 6,
    newest: true,
    image: "https://sofantastic.pl/200-large_default/puf-kwadrat-40x40.jpg",
    colors: ["#556b2f", "#a0522d"],
    description: "Мягкий пуф для дополнительного комфорта.",
    dimensions: "55x55x45 см"
  },
  // Corner Sofas
  {
    id: 5,
    name: "Угловой диван Supreme",
    type: "corner",
    shape: "corner",
    size: "large",
    function: "storage",
    material: "leather",
    price: 4500,
    popularity: 9,
    newest: true,
    image: "https://sofantastic.pl/868-large_default/naroznik-stelo-z-funkcja-spania.jpg",
    colors: ["#8b0000", "#2f4f4f"],
    description: "Просторный угловой диван для больших семей.",
    dimensions: "300x120x85 см"
  }
];

// ----- Render Product Cards -----
function renderProducts() {
  const container = document.getElementById('productsContainer');
  container.innerHTML = "";
  
  const searchKeyword = document.getElementById('searchInput').value.toLowerCase();
  const filterTypes = Array.from(document.querySelectorAll('input[name="type"]:checked')).map(el => el.value);
  const filterShapes = Array.from(document.querySelectorAll('input[name="shape"]:checked')).map(el => el.value);
  const filterSizes = Array.from(document.querySelectorAll('input[name="size"]:checked')).map(el => el.value);
  const filterFunctions = Array.from(document.querySelectorAll('input[name="function"]:checked')).map(el => el.value);
  const filterMaterials = Array.from(document.querySelectorAll('input[name="material"]:checked')).map(el => el.value);
  const filterPrices = Array.from(document.querySelectorAll('input[name="price"]:checked')).map(el => el.value);
  
  let filtered = products.filter(product => {
    if (searchKeyword && !product.name.toLowerCase().includes(searchKeyword)) return false;
    if (filterTypes.length && !filterTypes.includes(product.type)) return false;
    if (filterShapes.length && !filterShapes.includes(product.shape)) return false;
    if (filterSizes.length && !filterSizes.includes(product.size)) return false;
    if (filterFunctions.length && !filterFunctions.includes(product.function)) return false;
    if (filterMaterials.length && !filterMaterials.includes(product.material)) return false;
    
    if (filterPrices.length) {
      let priceMatch = false;
      filterPrices.forEach(range => {
        if (range === "low" && product.price <= 1000) priceMatch = true;
        if (range === "mid" && product.price > 1000 && product.price <= 3000) priceMatch = true;
        if (range === "high" && product.price > 3000) priceMatch = true;
      });
      if (!priceMatch) return false;
    }
    if (selectedFilterColor && !product.colors.includes(selectedFilterColor)) return false;
    return true;
  });
  
  // Sorting
  const sortBy = document.getElementById('sortSelect').value;
  if (sortBy === "price") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === "popularity") {
    filtered.sort((a, b) => b.popularity - a.popularity);
  } else if (sortBy === "newest") {
    filtered.sort((a, b) => (b.newest === a.newest) ? 0 : b.newest ? 1 : -1);
  }
  
  filtered.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
        <div class="color-overlay"></div>
      </div>
      <div class="product-info">
        <h4>${product.name}</h4>
        <p>Цена: ${product.price} zł</p>
        <p>Материал: ${product.material}</p>
      </div>
    `;
    const overlay = card.querySelector('.color-overlay');
    // Apply global material color overlay if chosen, otherwise use filter color on hover
    if (globalMaterialColor) {
      overlay.style.backgroundColor = hexToRGBA(globalMaterialColor, 0.5);
    } else {
      overlay.style.backgroundColor = "transparent";
    }
    
    // Mouse events: if no global material color, show filter color on hover
    card.addEventListener('mouseenter', () => {
      if (!globalMaterialColor && selectedFilterColor) {
        overlay.style.backgroundColor = hexToRGBA(selectedFilterColor, 0.5);
      }
    });
    card.addEventListener('mouseleave', () => {
      if (!globalMaterialColor) {
        overlay.style.backgroundColor = "transparent";
      }
    });
    
    // On click, go to product-detail page
    card.addEventListener('click', () => {
      window.location.href = "product-detail.html?id=" + product.id;
    });
    
    container.appendChild(card);
  });
}

// ----- Event Listeners for Filters and Controls -----
document.querySelectorAll('.filters input, #searchInput, #sortSelect').forEach(el => {
  el.addEventListener('input', renderProducts);
  el.addEventListener('change', renderProducts);
});
document.querySelectorAll('.color-swatch').forEach(swatch => {
  swatch.addEventListener('click', function() {
    if (this.classList.contains('selected')) {
      this.classList.remove('selected');
      selectedFilterColor = null;
    } else {
      document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
      this.classList.add('selected');
      selectedFilterColor = this.getAttribute('data-color');
    }
    renderProducts();
  });
});
document.getElementById('gridViewBtn').addEventListener('click', () => {
  currentView = "grid";
  document.querySelector('.catalog').classList.remove('list-view');
});
document.getElementById('listViewBtn').addEventListener('click', () => {
  currentView = "list";
  document.querySelector('.catalog').classList.add('list-view');
});
document.getElementById('clearFiltersBtn').addEventListener('click', () => {
  document.getElementById('searchInput').value = "";
  document.getElementById('sortSelect').selectedIndex = 0;
  selectedFilterColor = null;
  document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
  document.querySelectorAll('.filters input[type="checkbox"]').forEach(checkbox => {
    checkbox.checked = false;
  });
  renderProducts();
});

// ----- Global Material Color (Main Page) Side Panel -----
const chooseColorMainBtn = document.getElementById("chooseColorMainBtn");
const sidePanelMain = document.getElementById("sidePanelMain");
const closePanelMainBtn = document.getElementById("closePanelMainBtn");
const selectedColorMainDisplay = document.getElementById("selectedColorMainDisplay");

chooseColorMainBtn.addEventListener("click", () => {
  sidePanelMain.classList.add("open");
});
closePanelMainBtn.addEventListener("click", () => {
  sidePanelMain.classList.remove("open");
});

// When a color option in the main side panel is clicked:
document.querySelectorAll("#colorOptionsMain .color-option").forEach(option => {
  option.addEventListener("click", function() {
    globalMaterialColor = this.getAttribute("data-color");
    selectedColorMainDisplay.textContent = globalMaterialColor;
    selectedColorMainDisplay.style.color = globalMaterialColor;
    sidePanelMain.classList.remove("open");
    renderProducts(); // update overlays on product cards
  });
});

// Initial render
renderProducts();
