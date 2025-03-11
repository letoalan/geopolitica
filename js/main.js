import { mapManager } from './mapManager.js';
import { dataManager } from './dataManager.js';
import { uiManager } from './uiManager.js';
import { templateManager } from './templateManager.js';

// Exposer mapManager et dataManager à l'interface utilisateur
window.mapManager = mapManager;
window.dataManager = dataManager;

// Exposer la fonction removeSelectedCountry à l'interface utilisateur
window.removeSelectedCountry = (countryName) => {
    dataManager.removeSelectedCountry(countryName);
    uiManager.updateSelectedCountriesList(dataManager.getSelectedData());
};

document.addEventListener('DOMContentLoaded', () => {
    // Initialiser la carte avec le moteur de rendu Canvas
    const map = mapManager.initMap('map', [0, 0], 2, {
        renderer: L.canvas() // Utiliser Canvas pour le rendu des couches vectorielles
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

    // Définir les coordonnées centrales et le zoom pour chaque continent
    const continentViews = {
        "Monde": { center: [0, 0], zoom: 2 },
        "Oceania": { center: [-22.7359, 140.0188], zoom: 4 },
        "Europe": { center: [54.5260, 15.2551], zoom: 4 },
        "North America": { center: [47.6506, -100.4370], zoom: 3 },
        "South America": { center: [-14.2350, -51.9253], zoom: 3 },
        "Africa": { center: [8.7832, 34.5085], zoom: 3 },
        "Asia": { center: [34.0479, 100.6197], zoom: 3 }
    };

    // Gérer le changement de continent
    const continentDropdown = document.getElementById('continentDropdown');
    continentDropdown.addEventListener('change', () => {
        const selectedContinent = continentDropdown.value;
        const view = continentViews[selectedContinent];
        if (view) {
            mapManager.setView(view.center, view.zoom);
        }
    });

    // Fonction pour charger et afficher les données GeoJSON
    const loadAndDisplayGeoJSON = async (filePath) => {
        const data = await dataManager.loadSelectedFile(filePath);
        if (data) {
            mapManager.addGeoJSONLayer(data, (feature, layer) => {
                layer.bindTooltip(feature.properties.NAME, { permanent: false, direction: 'auto' });
                layer.on('click', (e) => {
                    uiManager.showColorPicker(
                        e.originalEvent,
                        (color) => {
                            // Mettre à jour la couleur du pays sur la carte
                            mapManager.updateCountryColor(feature.properties.INDEX, color);
                        },
                        (color) => {
                            // Ajouter le pays sélectionné avec la couleur choisie
                            dataManager.addSelectedCountry(
                                feature.properties.NAME, // Nom du pays
                                color, // Couleur choisie
                                feature.geometry, // Géométrie du pays
                                feature.properties.INDEX // INDEX du pays
                            );

                            // Mettre à jour la liste des pays sélectionnés dans l'UI
                            uiManager.updateSelectedCountriesList(dataManager.getSelectedData());
                        }
                    );
                });
            });
        }
    };

    // Gérer le changement de fichier GeoJSON
    document.getElementById('fileDropdown').addEventListener('change', async () => {
        const filePath = `data/${document.getElementById('fileDropdown').value}`;
        await loadAndDisplayGeoJSON(filePath);
    });

    // Gérer la validation de la liste
    const validateListButton = document.getElementById('validateListButton');
    const downloadButton = document.getElementById('downloadButton');
    const resetButton = document.getElementById('resetButton');
    const fileNameInput = document.getElementById('fileNameInput');
    const fileTypeSelector = document.getElementById('fileTypeSelector');

    validateListButton.addEventListener('click', () => {
        const selectedData = dataManager.getSelectedData();
        if (selectedData.length > 0) {
            downloadButton.disabled = false;
            fileNameInput.required = true;
            mapManager.hideNonSelectedCountries(selectedData);
            alert("La liste a été validée. Les pays non sélectionnés ont été masqués.");
        } else {
            alert("Aucun pays sélectionné. Veuillez choisir des pays avant de valider.");
        }
    });

    // Fonction pour exporter la carte en JPEG
    const exportMapToJpeg = async (fileName) => {
        console.log("Début de l'exportation JPEG pour le fichier :", fileName);
        const mapContainer = document.getElementById('map');
        const map = mapManager.getMap();

        if (!mapContainer || !map) {
            console.error("Erreur : mapContainer ou map non défini.");
            alert("Erreur : la carte n'est pas correctement initialisée.");
            return;
        }

        console.log("MapContainer trouvé :", mapContainer);

        // Masquer temporairement les contrôles de carte
        const controls = document.querySelectorAll('.leaflet-control-container');
        controls.forEach(control => control.style.display = 'none');

        // Forcer un redimensionnement de la carte
        console.log("Redimensionnement de la carte...");
        map.invalidateSize();

        try {
            console.log("Attente d'un court délai pour le rendu...");
            await new Promise((resolve) => {
                setTimeout(() => {
                    console.log("Délai écoulé, prêt pour la capture.");
                    resolve();
                }, 500); // Délai de 500ms pour laisser le temps au rendu
            });

            console.log("Capture de la carte avec html2canvas...");
            const finalCanvas = await html2canvas(mapContainer, {
                useCORS: true,
                logging: true,
                scale: 2,
                backgroundColor: '#FFFFFF'
            });

            console.log("Canvas généré :", finalCanvas);

            // Télécharger l'image
            const image = finalCanvas.toDataURL('image/jpeg', 1.0);
            console.log("Image convertie en DataURL :", image.substring(0, 50) + "...");
            const link = document.createElement('a');
            link.href = image;
            link.download = `${fileName}.jpeg`;
            link.click();

            console.log("Image JPEG téléchargée avec succès !");
        } catch (error) {
            console.error("Erreur lors de l'export de l'image JPEG :", error);
            alert(`Erreur lors de l'export de l'image : ${error.message}`);
        } finally {
            // Réafficher les contrôles de carte
            controls.forEach(control => control.style.display = 'block');
            console.log("Contrôles de la carte réaffichés.");
        }
    };

    // Gérer le téléchargement du fichier
    downloadButton.addEventListener('click', () => {
        const fileName = fileNameInput.value.trim();
        if (fileName) {
            const selectedFileType = fileTypeSelector.value;
            console.log("Type de fichier sélectionné :", selectedFileType);
            if (selectedFileType === 'umap') {
                console.log("Exportation du fichier .umap...");
                const selectedData = dataManager.getSelectedData();
                const template = templateManager.generateTemplate(selectedData);
                templateManager.downloadTemplate(template, fileName);
                alert("Le fichier .umap a été téléchargé avec succès !");
            } else if (selectedFileType === 'jpeg') {
                console.log("Lancement de l'exportation JPEG...");
                exportMapToJpeg(fileName);
            }
        } else {
            alert("Veuillez entrer un nom de fichier valide.");
        }
    });

    // Gérer la réinitialisation avec le nouveau bouton
    resetButton.addEventListener('click', () => {
        console.log("Réinitialisation de l'interface...");
        resetInterface();
    });

    // Fonction pour réinitialiser l'interface utilisateur
    const resetInterface = () => {
        dataManager.clearSelectedData();
        uiManager.updateSelectedCountriesList(dataManager.getSelectedData());
        fileNameInput.value = '';
        downloadButton.disabled = true;
        mapManager.resetMap();
        const filePath = `data/${document.getElementById('fileDropdown').value}`;
        loadAndDisplayGeoJSON(filePath);
    };
});