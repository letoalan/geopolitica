import { mapManager } from './carto/mapManager.js';
import { dataManager } from './carto/dataManager.js';
import { uiManager } from './carto/uiManager.js';
import { templateManager } from './carto/templateManager.js';
import { initEventHandlers } from './carto/eventHandlers.js';

// Exposer mapManager et dataManager à l'interface utilisateur
window.mapManager = mapManager;
window.dataManager = dataManager;

// Exposer la fonction removeSelectedCountry
window.removeSelectedCountry = (countryName) => {
    // Récupérer les données du pays sélectionné
    const selectedData = dataManager.getSelectedData();

    // Vérifier si des pays sont sélectionnés
    if (selectedData.length === 0) {
        console.warn("Aucun pays sélectionné. Impossible de réinitialiser un pays.");
        return; // Sortir de la fonction si aucun pays n'est sélectionné
    }

    // Trouver le pays à réinitialiser
    const country = selectedData.find((c) => c.name === countryName);

    // Si le pays est trouvé, réinitialiser sa couleur
    if (country) {
        mapManager.resetCountryColor(country.index); // Réinitialiser la couleur du layer
    } else {
        console.warn(`Le pays "${countryName}" n'a pas été trouvé dans la liste des pays sélectionnés.`);
        return; // Sortir de la fonction si le pays n'est pas trouvé
    }

    // Supprimer le pays de la liste des pays sélectionnés
    dataManager.removeSelectedCountry(countryName);

    // Mettre à jour l'interface utilisateur
    uiManager.updateSelectedCountriesList(dataManager.getSelectedData());
};

document.addEventListener('DOMContentLoaded', async () => {
    // Initialiser la carte avec le moteur de rendu Canvas
    const map = mapManager.initMap('map', [0, 0], 2, {
        renderer: L.canvas()
    });

    // Définir les fournisseurs de tuiles
    const tileLayers = {
        "OpenStreetMap": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }),
        "CartoDB Light": L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://carto.com/attributions">CARTO</a>'
        }),
        "CartoDB Dark": L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://carto.com/attributions">CARTO</a>'
        }),
        "Stamen Terrain": L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.png', {
            attribution: '© <a href="https://stamen.com">Stamen Design</a>, © <a href="https://stadiamaps.com/">Stadia Maps</a>, © <a href="https://openmaptiles.org/">OpenMapTiles</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 18
        }),
        "IGN satellite": L.tileLayer('https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&STYLE=normal&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image%2Fjpeg', {
            attribution: '© <a href="https://www.ign.fr/">IGN</a>',
            maxZoom: 19
        }),
        "Esri2": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
            attribution: '© <a href="https://www.esri.com/">Esri</a>'
        }),
        "Google1": L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
            attribution: '© <a href="https://www.google.com/">Google</a>'
        }),
        "Google2": L.tileLayer('https://mt1.google.com/vt/lyrs=t&x={x}&y={y}&z={z}', {
            attribution: '© <a href="https://www.google.com/">Google</a>'
        }),
        "Google3": L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
            attribution: '© <a href="https://www.google.com/">Google</a>'
        }),
        "NASA Blue Marble": L.tileLayer('http://s3.amazonaws.com/com.modestmaps.bluemarble/{z}-r{y}-c{x}.jpg', {
            attribution: '© <a href="https://earthdata.nasa.gov">NASA</a>',
            time: '2016-01-01'
        }),
        "NASA Black Marble": L.tileLayer('https://cdn.statically.io/gh/freetiler/nasa-blackmarble/main/tiles/{z}/{x}/{y}.jpeg', {
            attribution: '© <a href="https://earthdata.nasa.gov">NASA</a>',
            time: '2016-01-01', // Date par défaut, ajustable selon les disponibilités
        }),
        "Satellite": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: '© <a href="https://www.esri.com/">Esri</a>'
        }),
    };

    // Ajouter la couche par défaut (Satellite)
    tileLayers["Satellite"].addTo(map);

    // Ajouter le contrôle de tuiles
    L.control.layers(tileLayers, null, {
        position: 'topright'
    }).addTo(map);

    // Charger et peupler dynamiquement le menu des fichiers
    const fileDropdown = document.getElementById('fileDropdown');
    const fileList = await dataManager.loadFileList('static/data/files.json');
    fileList.forEach(file => {
        const option = document.createElement('option');
        option.value = file.value;
        option.textContent = file.name;
        fileDropdown.appendChild(option);
    });

    // Initialiser les gestionnaires d'événements en passant la carte
    initEventHandlers(map);
});