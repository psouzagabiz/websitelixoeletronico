// Centro da cidade de Posse - GO
const centroPosse = [-14.0955, -46.3704];

const mapa = L.map('map').setView(centroPosse, 14);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; colaboradores do OpenStreetMap'
}).addTo(mapa);

const iconeColeta = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

const listaPontosEl = document.getElementById('lista-pontos');

pontosDeColeta.forEach(function (ponto) {
  const marcador = L.marker([ponto.lat, ponto.lng], { icon: iconeColeta }).addTo(mapa);

  marcador.bindPopup(
    '<strong>' + ponto.nome + '</strong><br>' +
    ponto.endereco + '<br>' +
    'Recebe: ' + ponto.recebe
  );

  const card = document.createElement('div');
  card.className = 'card-ponto';
  card.innerHTML =
    '<h3>' + ponto.nome + '</h3>' +
    '<p class="tipo">' + ponto.tipo + '</p>' +
    '<p>' + ponto.endereco + '</p>' +
    '<p class="recebe">Recebe: ' + ponto.recebe + '</p>';

  card.addEventListener('click', function () {
    mapa.setView([ponto.lat, ponto.lng], 17);
    marcador.openPopup();
    document.getElementById('mapa').scrollIntoView({ behavior: 'smooth' });
  });

  listaPontosEl.appendChild(card);
});
