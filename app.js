
let map;
let currentDay = "Sunday";
let adminMode = false;
let polygons = [];

const zones = window.routes;

document.getElementById("daySelect").onchange = (e) => {
  currentDay = e.target.value;
  renderZones();
};

document.getElementById("themeToggle").onclick = () => {
  document.body.classList.toggle("dark");
};

document.getElementById("adminLogin").onclick = () => {
  const pwd = prompt("Enter admin password");
  if (pwd === "routeadmin2025") {
    adminMode = true;
    document.getElementById("adminPanel").classList.remove("hidden");
  }
};

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 34.0522, lng: -118.2437 },
    zoom: 10
  });
  renderZones();
}

function renderZones() {
  polygons.forEach(p => p.setMap(null));
  polygons = [];

  zones.filter(z => z.day === currentDay).forEach(zone => {
    const poly = new google.maps.Polygon({
      paths: zone.path,
      map,
      fillColor: zone.restricted ? "#888" : (zone.capacity > 0.9 ? "#d33" : "#33d"),
      strokeColor: "#000",
      fillOpacity: 0.4,
      strokeWeight: 1
    });

    const infowindow = new google.maps.InfoWindow({
      content: `<strong>${zone.name}</strong><br>Driver: ${zone.driver}<br>Deliveries: ${zone.deliveries}<br>Capacity: ${Math.round(zone.capacity * 100)}%` +
               (zone.restricted ? `<br><span style='color:red;'>Restricted</span>` : ``)
    });

    poly.addListener('click', (e) => {
      infowindow.setPosition(e.latLng);
      infowindow.open(map);
    });

    polygons.push(poly);
  });
}
