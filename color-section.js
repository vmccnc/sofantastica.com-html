document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:8090/api/sofantastic/fabric')
      .then(response => response.json())
      .then(fabrics => {
        const fabricOptions = document.getElementById('fabricOptions');
        fabrics.forEach(fabric => {
          const li = document.createElement('li');
          li.textContent = `${fabric.name} ( +${fabric.priceModifier} zł )`;
          li.setAttribute('data-id', fabric.id);
          li.addEventListener('click', () => {
            // Assume the furniture id is passed as query parameter (e.g., ?furnitureId=1)
            const urlParams = new URLSearchParams(window.location.search);
            const furnitureId = urlParams.get('furnitureId') || 1;
            window.location.href = `furniture-detail.html?id=${furnitureId}&selectedFabric=${fabric.id}`;
          });
          fabricOptions.appendChild(li);
        });
      })
      .catch(error => console.error('Error fetching fabrics:', error));
  });
  