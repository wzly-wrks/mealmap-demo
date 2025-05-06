
document.getElementById("themeToggle").onclick = () => {
  const root = document.documentElement;
  const current = root.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
};

const savedTheme = localStorage.getItem("theme");
if (savedTheme) document.documentElement.setAttribute("data-theme", savedTheme);

function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 34.0522, lng: -118.2437 },
    zoom: 10
  });

  window.routes.forEach(route => {
    const zone = new google.maps.Polygon({
      paths: route.path,
      map,
      fillColor: route.restricted ? "#888" : (route.capacity > 0.9 ? "#d33" : "#33d"),
      strokeColor: "#000",
      fillOpacity: 0.4,
      strokeWeight: 1
    });

    const infowindow = new google.maps.InfoWindow({
      content: `<strong>${route.name}</strong><br>
                Driver: ${route.driver}<br>
                Deliveries: ${route.deliveries}<br>
                Capacity: ${Math.round(route.capacity * 100)}%` +
                (route.restricted ? `<br><span style='color:red;'>Restricted</span>` : ``)
    });

    zone.addListener('click', (e) => {
      infowindow.setPosition(e.latLng);
      infowindow.open(map);
    });
  });
}
