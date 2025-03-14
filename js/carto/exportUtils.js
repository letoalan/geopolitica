import { mapManager } from './mapManager.js';
import { dataManager } from './dataManager.js';
import { uiManager } from './uiManager.js';
import { templateManager } from './templateManager.js';

export const loadAndDisplayGeoJSON = async (filePath) => {
    const data = await dataManager.loadSelectedFile(filePath);
    if (data) {
        mapManager.addGeoJSONLayer(data, (feature, layer) => {
            layer.bindTooltip(feature.properties.NAME, { permanent: false, direction: 'auto' });
            layer.on('click', (e) => {
                uiManager.showColorPicker(
                    e.originalEvent,
                    (color) => {
                        mapManager.updateCountryColor(feature.properties.INDEX, color);
                    },
                    (color) => {
                        dataManager.addSelectedCountry(
                            feature.properties.NAME,
                            color,
                            feature.geometry,
                            feature.properties.INDEX
                        );
                        uiManager.updateSelectedCountriesList(dataManager.getSelectedData());
                    }
                );
            });
        });
    }
};

export const exportMapToJpeg = async (fileName) => {
    const mapContainer = document.getElementById('map');
    const map = mapManager.getMap();

    if (!mapContainer || !map) {
        console.error("Erreur : mapContainer ou map non défini.");
        alert("Erreur : la carte n'est pas correctement initialisée.");
        return;
    }

    const controls = document.querySelectorAll('.leaflet-control-container');
    controls.forEach(control => control.style.display = 'none');

    map.invalidateSize();

    try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const finalCanvas = await html2canvas(mapContainer, {
            useCORS: true,
            logging: true,
            scale: 2,
            backgroundColor: '#FFFFFF'
        });

        const image = finalCanvas.toDataURL('image/jpeg', 1.0);
        const link = document.createElement('a');
        link.href = image;
        link.download = `${fileName}.jpeg`;
        link.click();
    } catch (error) {
        console.error("Erreur lors de l'export de l'image JPEG :", error);
        alert(`Erreur lors de l'export : ${error.message}`);
    } finally {
        controls.forEach(control => control.style.display = 'block');
    }
};

export const resetInterface = () => {
    dataManager.clearSelectedData();
    uiManager.updateSelectedCountriesList(dataManager.getSelectedData());
    document.getElementById('fileNameInput').value = '';
    document.getElementById('downloadButton').disabled = true;
    mapManager.resetMap();
    const filePath = `data/${document.getElementById('fileDropdown').value}`;
    loadAndDisplayGeoJSON(filePath);
};