// Utility: Get URL query parameter by name
function getQueryParam(param) {
  const params = new URLSearchParams(window.location.search);
  return params.get(param);
}

const productId = getQueryParam("id");

// Sample product data (same as in index.js)
const products = [
  {
    id: 1,
    name: "Диван Comfort",
    type: "divan",
    material: "fabric",
    price: 2500,
    description: "Комфортный диван для уютного отдыха.",
    dimensions: "200x90x80 см",
    image: "https://sofantastic.pl/726-large_default/kanapa-santia-rozkladana.jpg"
  },
  {
    id: 2,
    name: "Диван Luxe",
    type: "divan",
    material: "leather",
    price: 3200,
    description: "Элегантный диван для стильного интерьера.",
    dimensions: "220x95x85 см",
    image: "https://sofantastic.pl/855-large_default/kanapa-santia-rozkladana.jpg"
  },
  {
    id: 3,
    name: "Кресло Relax",
    type: "armchair",
    material: "velvet",
    price: 1200,
    description: "Удобное кресло для отдыха и чтения.",
    dimensions: "90x90x100 см",
    image: "https://sofantastic.pl/836-large_default/fotel-uszak-moon-styl-skandynawski.jpg"
  },
  {
    id: 4,
    name: "Пуф Modern",
    type: "pouf",
    material: "fabric",
    price: 800,
    description: "Современный пуф, который добавит изюминку в интерьер.",
    dimensions: "50x50x40 см",
    image: "https://sofantastic.pl/248-large_default/puf-krasnal-ze-schowkiem-kolor-melanz.jpg"
  },
  {
    id: 5,
    name: "Угловой диван Supreme",
    type: "corner",
    material: "leather",
    price: 4500,
    description: "Просторный угловой диван для больших семей.",
    dimensions: "300x120x85 см",
    image: "https://sofantastic.pl/868-large_default/naroznik-stelo-z-funkcja-spania.jpg"
  },
  {
    id: 6,
    name: "Кресло Elegance",
    type: "armchair",
    material: "velvet",
    price: 1400,
    description: "Изысканное кресло для вашего кабинета.",
    dimensions: "95x95x100 см",
    image: "https://sofantastic.pl/833-large_default/fotel-uszak-moon-styl-skandynawski.jpg"
  },
  {
    id: 7,
    name: "Диван Classic",
    type: "divan",
    material: "fabric",
    price: 2700,
    description: "Классический диван, проверенный временем.",
    dimensions: "210x100x85 см",
    image: "https://sofantastic.pl/851-large_default/wersalka-suno.jpg"
  },
  {
    id: 8,
    name: "Пуф Cozy",
    type: "pouf",
    material: "fabric",
    price: 900,
    description: "Мягкий пуф для дополнительного комфорта.",
    dimensions: "55x55x45 см",
    image: "https://sofantastic.pl/200-large_default/puf-kwadrat-40x40.jpg"
  }
];

const product = products.find(p => p.id == productId);
if (product) {
  document.getElementById("productImage").src = product.image;
  document.getElementById("productName").textContent = product.name;
  document.getElementById("productDescription").textContent = product.description;
  document.getElementById("productDimensions").textContent = "Размеры: " + product.dimensions;
  document.getElementById("productMaterial").textContent = product.material;
  document.getElementById("productPrice").textContent = product.price;
} else {
  document.body.innerHTML = "Продукт не найден.";
}

// ----- Side Panel for Color Selection (Detail Page) -----
const sidePanel = document.getElementById("sidePanel");
const chooseColorBtn = document.getElementById("chooseColorBtn");
const closePanelBtn = document.getElementById("closePanelBtn");
const selectedColorDisplay = document.getElementById("selectedColorDisplay");
const imageOverlay = document.getElementById("imageOverlay");

// Utility: Convert HEX to RGBA (if needed)
function hexToRGBA(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

chooseColorBtn.addEventListener("click", () => {
  sidePanel.classList.add("open");
});
closePanelBtn.addEventListener("click", () => {
  sidePanel.classList.remove("open");
});

// When a color option is clicked, update the text and overlay on the product image
document.querySelectorAll(".color-option").forEach(option => {
  option.addEventListener("click", function() {
    const selectedColor = this.getAttribute("data-color");
    selectedColorDisplay.textContent = selectedColor;
    selectedColorDisplay.style.color = selectedColor;
    imageOverlay.style.backgroundColor = hexToRGBA(selectedColor, 0.5);
    sidePanel.classList.remove("open");
  });
});
