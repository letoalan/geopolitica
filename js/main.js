// main.js
import { mapManager } from './mapManager.js';
import { dataManager } from './dataManager.js';
import { uiManager } from './uiManager.js';
import { templateManager } from './templateManager.js';

// Exposer mapManager et dataManager à l'interface utilisateur
window.mapManager = mapManager;
window.dataManager = dataManager;

// Exposer la fonction removeSelectedCountry à l'interface utilisateur
window.removeSelectedCountry = (countryName) => {
    dataManager.removeSelectedCountry(countryName); // Supprimer le pays
    uiManager.updateSelectedCountriesList(dataManager.getSelectedData()); // Mettre à jour l'interface utilisateur
};

document.addEventListener('DOMContentLoaded', () => {
    const map = mapManager.initMap('map', [0, 0], 2);

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
            mapManager.setView(view.center, view.zoom); // Utiliser mapManager.setView pour centrer et zoomer
        }
    });

    // Gérer le changement de fichier GeoJSON
    document.getElementById('fileDropdown').addEventListener('change', async () => {
        const filePath = `data/${document.getElementById('fileDropdown').value}`;
        const data = await dataManager.loadSelectedFile(filePath);
        if (data) {
            mapManager.addGeoJSONLayer(data, (feature, layer) => {
                // Ajouter un tooltip avec le nom du pays
                layer.bindTooltip(feature.properties.NAME, { permanent: false, direction: 'auto' });

                // Gérer le clic sur un pays
                layer.on('click', (e) => {
                    console.log("Pays cliqué :", feature.properties.NAME); // Log du pays cliqué
                    console.log("INDEX du pays :", feature.properties.INDEX); // Log de l'INDEX

                    uiManager.showColorPicker(
                        e.originalEvent,
                        (color) => {
                            console.log("Couleur choisie (mise à jour de la carte) :", color); // Log de la couleur choisie
                            // Mettre à jour la couleur du pays sur la carte en utilisant l'INDEX
                            mapManager.updateCountryColor(feature.properties.INDEX, color);
                        },
                        (color) => {
                            console.log("Couleur choisie (ajout au tableau) :", color); // Log de la couleur choisie
                            // Ajouter le pays sélectionné avec la couleur choisie
                            dataManager.addSelectedCountry(
                                feature.properties.NAME, // Nom du pays
                                color, // Couleur choisie
                                feature.geometry, // Géométrie du pays
                                feature.properties.INDEX // INDEX du pays
                            );

                            // Log des coordonnées pour vérifier si elles sont vides
                            console.log("Coordonnées du pays sélectionné :", feature.geometry.coordinates);

                            // Log du tableau des pays sélectionnés
                            console.log("Tableau des pays sélectionnés :", dataManager.getSelectedData());

                            // Mettre à jour la liste des pays sélectionnés dans l'UI
                            uiManager.updateSelectedCountriesList(dataManager.getSelectedData());
                        }
                    );
                });
            });
        }
    });

    // Gérer la validation de la liste
    const validateListButton = document.getElementById('validateListButton');
    const downloadButton = document.getElementById('downloadButton');
    const fileNameInput = document.getElementById('fileNameInput');

    validateListButton.addEventListener('click', () => {
        const selectedData = dataManager.getSelectedData();
        if (selectedData.length > 0) {
            console.log("Liste validée :", selectedData); // Log des données sélectionnées
            downloadButton.disabled = false; // Activer le bouton de téléchargement
            fileNameInput.required = true; // Rendre le champ de saisie obligatoire
        } else {
            alert("Aucun pays sélectionné. Veuillez choisir des pays avant de valider.");
        }
    });

// Gérer le téléchargement du fichier
    downloadButton.addEventListener('click', () => {
        const fileName = fileNameInput.value.trim();
        if (fileName) {
            const selectedData = dataManager.getSelectedData();
            const template = templateManager.generateTemplate(selectedData);
            templateManager.downloadTemplate(template, fileName); // Télécharger avec le nom spécifié

            // Afficher un message de confirmation
            alert("Le fichier a été téléchargé avec succès !");

            // Réinitialiser l'interface utilisateur
            dataManager.clearSelectedData(); // Vider la liste des pays sélectionnés
            uiManager.updateSelectedCountriesList(dataManager.getSelectedData()); // Mettre à jour l'interface utilisateur
            fileNameInput.value = ''; // Réinitialiser le champ de saisie
            downloadButton.disabled = true; // Désactiver le bouton de téléchargement

            // Réinitialiser la carte
            mapManager.resetMap();

            // Recharger le fichier GeoJSON actuel pour réattacher les gestionnaires d'événements
            const filePath = `data/${document.getElementById('fileDropdown').value}`;
            loadAndDisplayGeoJSON(filePath); // Réattacher les gestionnaires d'événements
        } else {
            alert("Veuillez entrer un nom de fichier valide.");
        }
    });


});
