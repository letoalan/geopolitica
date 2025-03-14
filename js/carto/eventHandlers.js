import { mapManager } from './mapManager.js';
import { dataManager } from './dataManager.js';
import { uiManager } from './uiManager.js';
import { templateManager } from './templateManager.js';
import { loadAndDisplayGeoJSON, exportMapToJpeg, resetInterface } from './exportUtils.js';

export const initEventHandlers = (map) => {
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

    // Gérer le changement de fichier GeoJSON
    const fileDropdown = document.getElementById('fileDropdown');
    fileDropdown.addEventListener('change', async () => {
        const filePath = `data/${fileDropdown.value}`;
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

    // Gérer le téléchargement
    downloadButton.addEventListener('click', () => {
        const fileName = fileNameInput.value.trim();
        if (fileName) {
            const selectedFileType = fileTypeSelector.value;
            if (selectedFileType === 'umap') {
                const selectedData = dataManager.getSelectedData();
                const template = templateManager.generateTemplate(selectedData);
                templateManager.downloadTemplate(template, fileName);
                alert("Le fichier .umap a été téléchargé avec succès !");
            } else if (selectedFileType === 'jpeg') {
                exportMapToJpeg(fileName);
            }
        } else {
            alert("Veuillez entrer un nom de fichier valide.");
        }
    });

    // Gérer la réinitialisation
    resetButton.addEventListener('click', () => {
        resetInterface();
    });
};