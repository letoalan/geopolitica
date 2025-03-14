// mapManager.js
export const mapManager = (() => {
    let map;
    let mapLayers = {};

    const initMap = (containerId, initialView, initialZoom, options = {}) => {
        map = L.map(containerId, options).setView(initialView, initialZoom);
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            minZoom: 0,
            maxZoom: 18,
            attribution: '© <a href="https://www.esri.com/">Esri</a>'
        }).addTo(map);
        return map;
    };

    const getMap = () => {
        if (!map) {
            console.error("La carte n'est pas initialisée. Appelez initMap d'abord.");
        }
        return map;
    };

    const addGeoJSONLayer = (data, onEachFeature) => {
        // Supprimer les anciennes couches GeoJSON
        map.eachLayer((layer) => {
            if (layer instanceof L.GeoJSON) {
                map.removeLayer(layer);
            }
        });
        mapLayers = {}; // Réinitialiser les couches stockées

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
        if (mapLayers[countryId]) {
            mapLayers[countryId].setStyle({
                fillColor: color,
                fillOpacity: 0.5 // Ajuster l'opacité si nécessaire
            });
        } else {
            console.error("Aucune couche trouvée pour l'INDEX :", countryId);
        }
    };

    const resetCountryColor = (countryId) => {
        if (mapLayers[countryId]) {
            mapLayers[countryId].setStyle({
                fillColor: '#ffffff', // Couleur par défaut (blanc)
                fillOpacity: 0.3, // Opacité par défaut
                color: '#000000', // Couleur de la bordure par défaut
                weight: 1 // Épaisseur de la bordure par défaut
            });
        } else {
            console.error("Aucune couche trouvée pour l'INDEX :", countryId);
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
            map.setView(center, zoom);
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

    const hideNonSelectedCountries = (selectedData) => {
        const selectedIndices = selectedData.map(country => country.index);

        // Parcourir toutes les couches de la carte
        Object.keys(mapLayers).forEach(countryId => {
            if (!selectedIndices.includes(parseInt(countryId))) {
                // Masquer les pays non sélectionnés
                mapLayers[countryId].setStyle({
                    fillOpacity: 0, // Rendre le pays transparent
                    opacity: 0, // Rendre la bordure transparente
                });
            } else {
                // Afficher les pays sélectionnés
                mapLayers[countryId].setStyle({
                    fillOpacity: 0.5, // Ajuster l'opacité si nécessaire
                    opacity: 1, // Afficher la bordure
                });
            }
        });
    };

    return {
        initMap,
        getMap,
        addGeoJSONLayer,
        updateCountryColor,
        resetCountryColor, // Exposer la nouvelle fonction
        removeCountryLayer,
        setView,
        resetMap,
        hideNonSelectedCountries,
    };
})();