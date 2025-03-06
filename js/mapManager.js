// mapManager.js
export const mapManager = (() => {
    let map;
    let mapLayers = {};

    const initMap = (containerId, initialView, initialZoom) => {
        map = L.map(containerId).setView(initialView, initialZoom);
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            minZoom: 0,
            maxZoom: 18,
        }).addTo(map);
        return map;
    };

    const addGeoJSONLayer = (data, onEachFeature) => {
        // Supprimer les anciennes couches GeoJSON
        map.eachLayer((layer) => {
            if (layer instanceof L.GeoJSON) {
                map.removeLayer(layer);
            }
        });

        // Ajouter la nouvelle couche GeoJSON
        const geoJSONLayer = L.geoJSON(data, {
            onEachFeature: (feature, layer) => {
                // Stocker la couche dans mapLayers en utilisant l'INDEX comme clé
                if (feature.properties && feature.properties.INDEX) {
                    mapLayers[feature.properties.INDEX] = layer;
                }

                // Appeler la fonction onEachFeature fournie
                onEachFeature(feature, layer);
            },
            style: {
                fillColor: '#ffffff', // Couleur par défaut
                fillOpacity: 0.3,
                color: '#000000', // Couleur de la bordure
                weight: 1
            }
        }).addTo(map);

        return geoJSONLayer;
    };

    const updateCountryColor = (countryId, color) => {
        console.log("Tentative de mise à jour de la couleur pour l'INDEX :", countryId); // Log de l'INDEX
        if (mapLayers[countryId]) {
            console.log("Couleur appliquée :", color); // Log de la couleur
            mapLayers[countryId].setStyle({
                fillColor: color,
                fillOpacity: 0.5 // Ajuster l'opacité si nécessaire
            });
        } else {
            console.error("Aucune couche trouvée pour l'INDEX :", countryId); // Log d'erreur
        }
    };

    const removeCountryLayer = (countryId) => {
        if (mapLayers[countryId]) {
            map.removeLayer(mapLayers[countryId]);
            delete mapLayers[countryId];
        }
    };

    const setView = (center, zoom) => {
        if (map) {
            map.setView(center, zoom); // Centrer et zoomer la carte
        } else {
            console.error("La carte n'est pas initialisée.");
        }
    };

    const resetMap = () => {
        // Supprimer toutes les couches GeoJSON
        map.eachLayer((layer) => {
            if (layer instanceof L.GeoJSON) {
                map.removeLayer(layer);
            }
        });
        mapLayers = {}; // Réinitialiser les couches stockées
    };


    return {
        initMap,
        addGeoJSONLayer,
        updateCountryColor,
        removeCountryLayer,
        setView, // Exposer la méthode setView
        resetMap,
    };
})();
