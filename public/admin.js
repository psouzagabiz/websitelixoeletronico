const centroPosse = [-14.0955, -46.3704];

const mapaAdmin = L.map('map-admin').setView(centroPosse, 14);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; colaboradores do OpenStreetMap'
}).addTo(mapaAdmin);

let marcadorNovoPonto = null;

mapaAdmin.on('click', function (evento) {
  const { lat, lng } = evento.latlng;

  document.getElementById('lat').value = lat.toFixed(6);
  document.getElementById('lng').value = lng.toFixed(6);

  if (marcadorNovoPonto) {
    marcadorNovoPonto.setLatLng(evento.latlng);
  } else {
    marcadorNovoPonto = L.marker(evento.latlng).addTo(mapaAdmin);
  }
});
