let countriesData;
let mapLayers = {};
let selectedData = []
let countryGeometries = [];
let templates = []

// Créer la carte Leaflet dans le conteneur 'map'
var map = L.map('map').setView([0, 0], 2);

// Ajouter un fond de carte
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services'+'/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    minZoom: 0,
    maxZoom: 18,
}).addTo(map);
let selectedCountries = [];
let selectedColors = []
let selectedIdx = []
console.log(selectedCountries,selectedColors, selectedIdx)
// Sélection de la zone de texte du nom de fichier




map.on('click', function(event) {
    // Afficher le color picker à côté du clic de la souris
    const colorPickerContainer = document.getElementById('colorPickerContainer');
    console.log(colorPickerContainer)
    if (colorPickerContainer) {
        colorPickerContainer.style.display = 'block';
        colorPickerContainer.style.left = event.originalEvent.clientX + 'px';
        colorPickerContainer.style.top = event.originalEvent.clientY + 'px';
    }

    // Mettre à jour la couleur du pays sélectionné avec le color picker
    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.oninput = function() {
        const selectedIdex = selectedIdx[selectedIdx.length -1]
        const selectedCountry = selectedCountries[selectedCountries.length - 1];
        const selectedColor = this.value; // Récupérer la couleur sélectionnée
        console.log(selectedCountry, selectedColor + " Trop bien !!!")
        updateCountryColor(selectedIdex,selectedCountry, selectedColor,0);

        // Mettre à jour selectedColors avec la nouvelle couleur
        selectedColors[selectedIdx.length - 1] = selectedColor;

        //updateSelectedCountries(selectedCountry, selectedColor);
    };

    // Créer le bouton Valider
    const validateButton = document.createElement('button');
    validateButton.type = 'button';
    validateButton.textContent = 'Valider';
    validateButton.style.position = 'absolute';
    // Ajout d'un gestionnaire d'événements au clic sur le bouton Valider
    validateButton.addEventListener('click', function() {
        const selectedIdex = selectedIdx[selectedIdx.length -1]
        const selectedCountry = selectedCountries[selectedCountries.length - 1];
        const selectedColor = selectedColors[selectedColors.length - 1];
        console.log(selectedCountry,selectedColor)
        // Mettre ici le code pour valider la sélection de couleur
        updateSelectedCountries(selectedIdex,selectedCountry, selectedColor);
        console.log('Validation de la sélection de couleur');
        colorPickerContainer.innerHTML = '';
    });

    colorPickerContainer.innerHTML = '';
    colorPickerContainer.appendChild(colorPicker);
    colorPickerContainer.appendChild(validateButton);
    console.log("Bouton de validation créé " + validateButton);
});


// Fonction pour charger le contenu du fichier sélectionné
function loadSelectedFile() {
    const dropdown = document.getElementById('fileDropdown');
    const selectedFile = dropdown.options[dropdown.selectedIndex].value;

    // Réinitialiser le zoom à 0 lors du changement de fichier
    map.setView([0, 0], 2);

    if (selectedFile) {
        fetch(`data/${selectedFile}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Le fichier est introuvable');
                }
                return response.json();
            })
            .then(data => {
                countriesData = data;
                console.log(data)
                updateMap(data);
                clearSelectedCountries(); // Réinitialiser la sélection de pays lors du chargement d'un nouveau fichier
            })
            .catch(error => console.error('Une erreur s\'est produite : ', error));
    }
}
function clearSelectedCountries() {
    // Réinitialiser les tableaux de pays sélectionnés, couleurs et index
    selectedCountries = [];
    selectedColors = [];
    selectedIdx = [];

    // Supprimer toutes les couches de carte associées aux pays sélectionnés
    for (let countryName in mapLayers) {
        if (mapLayers.hasOwnProperty(countryName)) {
            let countryLayer = mapLayers[countryName];
            map.removeLayer(countryLayer);
        }
    }

    mapLayers = {}


    // Réinitialiser l'interface utilisateur des pays sélectionnés
    const selectedCountriesContainer = document.getElementById('selectedCountriesContainer');
    if (selectedCountriesContainer) {
        selectedCountriesContainer.innerHTML = ''; // Vider le contenu HTML de la liste des pays sélectionnés
    } else {
        console.error("L'élément 'selectedCountriesContainer' n'a pas été trouvé dans le document.");
    }
}

// Fonction pour gérer le changement de continent
function handleContinentChange() {
    const dropdown = document.getElementById('continentDropdown');
    const selectedContinent = dropdown.options[dropdown.selectedIndex].value;

    // Vérifier si le continent sélectionné est différent de 'Europe'
    if (selectedContinent) {
        // Mettre ici le code pour mettre à jour le zoom ou effectuer d'autres actions en fonction de la sélection
        zoomToContinent();
    }
}


function zoomToContinent() {
    const dropdown = document.getElementById('continentDropdown');
    const selectedContinent = dropdown.options[dropdown.selectedIndex]?.value;

    if (selectedContinent) {
        let zoomLevel = 2;
        let centerCoordinates = [0, 0];

        switch (selectedContinent) {
            case 'Monde':
                zoomLevel = 2;
                centerCoordinates = [0,0];
                break;
            case 'Europe':
                zoomLevel = 4;
                centerCoordinates = [50, 10];
                break;
            case 'North America':
                zoomLevel = 3;
                centerCoordinates = [37.0902, -95.7129];
                break;
            case 'South America':
                zoomLevel = 3;
                centerCoordinates = [-14.235, -51.9253];
                break;
            case 'Africa':
                zoomLevel = 3;
                centerCoordinates = [8, 20];
                break;
            case 'Asia':
                zoomLevel = 3;
                centerCoordinates = [30, 100];
                break;
            case 'Oceania':
                zoomLevel = 3;
                centerCoordinates = [-20, 140];
                break;
            default:
                return;
        }

        // Mettez à jour à la fois les coordonnées du centre et le niveau de zoom de la carte
        map.setView(centerCoordinates, zoomLevel);
    }
}


function updateMap(data) {
    map.eachLayer(function (layer) {
        if (layer instanceof L.GeoJSON) {
            map.removeLayer(layer);
        }
    });

    // Parcourir les entités du GeoJSON
    for (let i = 0; i < data.features.length; i++) {
        let feature = data.features[i];
        let properties = feature.properties;
        let geometry = feature.geometry;
        let countryName = properties.NAME;
        let countryGeometry = geometry;
        let countryIndex = (i+1);
        // Créer une couche GeoJSON pour chaque entité
        let geojsonLayer = L.geoJSON(feature, {
            onEachFeature: function (feature, layer) {
                layer.bindTooltip(countryName, { permanent: false, direction: 'auto' });

                // Gestion de l'événement de clic pour chaque entité
                layer.on('click', function () {
                    console.log("Entité à l'index " + countryIndex + " : ", feature);

                    console.log('Nom du pays:', countryName);
                    console.log('Géométrie du pays:', countryGeometry);

                    // Ajouter le nom du pays à votre tableau selectedCountries
                    selectedIdx.push(countryIndex);
                    selectedCountries.push(countryName);
                    countryGeometries.push({geometry: countryGeometry});
                });
            }
        });

        // Ajouter la couche GeoJSON à la carte
        geojsonLayer.addTo(map);
    }
}


function updateSelectedCountries(selectedIdex,selectedCountryName, selectedColor) {
    const selectedCountriesContainer = document.getElementById('selectedCountriesContainer');

    // Vérifier si les éléments existent avant de les manipuler
    if (selectedCountryName && selectedColor) {
        // Créer une ligne pour le nouveau pays sélectionné
        const countryRow = document.createElement('tr');

        // Créer des cellules pour les données
        const countryNameCell = document.createElement('td');
        const colorCell = document.createElement('td');
        const actionCell = document.createElement('td');

        // Ajouter le nom du pays à la cellule correspondante
        countryNameCell.textContent = selectedCountryName;

        // Créer un sélecteur de couleur
        const colorPicker = document.createElement('input');
        colorPicker.type = 'color';
        colorPicker.value = selectedColor; // Utiliser la couleur sélectionnée sur la carte comme couleur par défaut
        colorPicker.disabled = true; // Désactiver l'interaction utilisateur pour éviter les changements accidentels

        // Créer un bouton d'annulation pour supprimer la ligne correspondante
        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Annuler';
        cancelButton.addEventListener('click', function() {
            // Supprimer la ligne lorsque le bouton d'annulation est cliqué
            selectedCountriesContainer.removeChild(countryRow);
            updateCountryColor(selectedIdex,selectedCountryName, null, 1);
            // Mettre à jour selectedCountries et selectedColors
        });

        // Ajouter les éléments aux cellules correspondantes
        colorCell.appendChild(colorPicker);
        actionCell.appendChild(cancelButton);

        // Ajouter les cellules à la ligne du pays
        countryRow.appendChild(countryNameCell);
        countryRow.appendChild(colorCell);
        countryRow.appendChild(actionCell);

        // Ajouter la ligne au tableau de pays sélectionnés
        selectedCountriesContainer.appendChild(countryRow);
    } else {
        console.error("L'élément 'selectedCountriesContainer' n'a pas été trouvé dans le document.");
    }
}


function updateCountryColor(selectedIdex,countryName, color, number) {
    if (countryName) {
        console.log(selectedIdex,countryName, number)


        if (number === 0) {
            const countryGeoJSON = countriesData.features.find(
                feature => feature.properties.INDEX === selectedIdex
            );

            // Mettre à jour la couleur du pays avec le nouveau style
            const countryLayer = L.geoJSON(countryGeoJSON, {
                style: function (feature) {
                    return {
                        fillColor: color,
                        fillOpacity: 0.4,
                        color: 'black',
                        weight: 1
                    };
                }
            }).addTo(map);
            // Ajouter la couche GeoJSON à mapLayers
            mapLayers[selectedIdex] = countryLayer;
            console.log(mapLayers)
            // Supprimer les couches GeoJSON existantes du pays de la carte
            map.eachLayer(function (layer) {
                if (layer instanceof L.GeoJSON && layer.feature && layer.feature.properties && layer.feature.properties.INDEX === selectedIdex) {
                    map.removeLayer(layer);
                }
            });
        } else {
            console.log('Test pour effacer la couleur');
            console.log(countryName,selectedIdex, "A l'attaque !!!")
            console.log(mapLayers)
            const countryLayer = mapLayers[selectedIdex];
            console.log(selectedIdex,countryName, countryLayer)
            if (countryLayer) {
                // Supprimer la couche GeoJSON du pays de la carte
                map.removeLayer(countryLayer);
                // Supprimer la référence de la couche de la carte
                delete mapLayers[selectedIdex];
            } else {
                console.error('La couche du pays n\'a pas été trouvée.');
            }
            const indexToRemove = selectedCountries.indexOf(selectedIdex);
            if (indexToRemove !== -1) {
                selectedCountries.splice(indexToRemove, 1);
                selectedColors.splice(indexToRemove, 1);
                selectedIdx.splice(indexToRemove,1)
            }
        }
    } else {
        console.log("Erreur sur countryName")
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const validateListButton = document.getElementById('validateListButton');
    validateListButton.addEventListener('click', function () {
        console.log("Clic !!!");

        function disableOtherControls() {
            // Désactiver le dropdown de fichier
            document.getElementById('fileDropdown').disabled = true;
            // Désactiver le dropdown de continent
            document.getElementById('continentDropdown').disabled = true;
            // Désactiver la carte
            map.dragging.disable();
            map.scrollWheelZoom.disable();
            map.doubleClickZoom.disable();
            map.boxZoom.disable();
            map.keyboard.disable();

            // Désactiver le color picker
            const colorPicker = document.querySelector('#colorPickerContainer input[type="color"]');
            if (colorPicker) {
                colorPicker.disabled = true;
            }

            // Désactiver le bouton Valider
            const validateButton = document.querySelector('#colorPickerContainer button');
            if (validateButton) {
                validateButton.disabled = true;
            }

        }

        console.log("Here we go to the end of the act !!!")
        disableOtherControls();
        console.log(selectedCountries, selectedColors, 'Liste test')
        console.log(countryGeometries)
        selectedData = retrieveSelectedData();
        console.log(selectedData);
        insertTemplate(selectedData)

        function retrieveSelectedData() {
            const selectedData = [];
            for (let i = 0; i < selectedCountries.length && i < selectedColors.length && i < countryGeometries.length; i++) {
                selectedData.push([selectedCountries[i], selectedColors[i], countryGeometries[i]]);
            }
            return selectedData;
        }

        });
    });




function insertTemplate(selectedData) {
    let inserts = [];
    for (let x = 0; x < selectedData.length; x++) {
        let name = selectedData[x][0];
        let color = selectedData[x][1];
        let geometry = selectedData[x][2];

        let coords = [];
        if (geometry.geometry.type === 'Polygon') {
            // Garder les crochets extérieurs pour les polygones simples
            coords = geometry.geometry.coordinates.map(ring => ring.map(coord => [coord[0], coord[1]]));
        } else if (geometry.geometry.type === 'MultiPolygon') {
            coords = geometry.geometry.coordinates.flatMap(polygon => polygon.map(coord => coord.map(c => [c[0], c[1]])));
        }
        console.log(coords)
        let feature = {
            "type": "Feature",
            "properties": {
                "_umap_options": {
                    "color": color,
                    "fillOpacity": 0.3,
                    "name": name,
                }
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": coords
            }
        };
        inserts.push(feature);
    }

    let template = `{
        "type": "umap",
        "uri": "https://wxs.ign.fr/pratique/wmts/?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&STYLE=normal&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image%2Fjpeg",
        "properties": {
            "easing": true,
            "embedControl": true,
            "fullscreenControl": true,
            "searchControl": true,
            "datalayersControl": true,
            "zoomControl": true,
            "slideshow": {},
            "captionBar": false,
            "limitBounds": {},
            "tilelayer": {},
            "licence": "",
            "description": "",
            "name": "Carte sans nom",
            "displayPopupFooter": false,
            "miniMap": false,
            "moreControl": true,
            "scaleControl": true,
            "scrollWheelZoom": true,
            "zoom": 6
        },
        "geometry": {
            "type": "Point",
            "coordinates": [
                2,
                51
            ]
        },
        "layers": [
            {
                "type": "FeatureCollection",
                "features": ${JSON.stringify(inserts)},
                "_umap_options": {
                    "displayOnLoad": true,
                    "browsable": true,
                    "name": "Calque 1"
                }
            }
        ]
    }`;
    // Stocker le template dans la variable globale templates
    templates.push(template);


}

document.addEventListener('DOMContentLoaded', function() {
    const fileNameInput = document.getElementById('fileNameInput');
    const downloadButton = document.getElementById('downloadButton');

    if (fileNameInput && downloadButton) {
        fileNameInput.addEventListener('input', function () {
            // Vérification si la valeur de la zone de texte n'est pas vide
            if (fileNameInput.value.trim() !== '') {
                console.log(fileNameInput.value)
                // Activation du bouton de téléchargement
                downloadButton.disabled = false;
            } else {
                console.log("Bouton inactif")
                // Désactivation du bouton de téléchargement si la zone de texte est vide
                downloadButton.disabled = true;
            }
        });

        // Écouteur d'événement pour le clic sur le bouton de téléchargement
        downloadButton.addEventListener('click', function() {
            // Récupération du contenu du fichier .umap à télécharger (templates)
            const templatess = templates; // Remplacez cette fonction par la fonction qui génère le contenu du fichier .umap

            // Vérification si le contenu du fichier .umap est disponible
            if (templatess) {
                // Téléchargement du fichier .umap avec le nom spécifié dans la zone de texte
                downloadUMAPFile(templatess, fileNameInput.value);
                clearSelectedCountries();
            } else {
                console.error('Le contenu du fichier .umap est vide ou non disponible.');
            }
        });
    } else {
        console.error('Impossible de trouver les éléments nécessaires dans le DOM.');
    }
});

// Fonction pour télécharger le fichier .umap
function downloadUMAPFile(content, fileName) {
    // Création d'un objet Blob à partir du contenu
    const blob = new Blob([content], { type: 'text/plain' });

    // Création d'un objet URL pour le Blob
    const url = window.URL.createObjectURL(blob);

    // Création d'un élément <a> pour le téléchargement
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName + '.umap'; // Ajout de l'extension .umap
    document.body.appendChild(a);

    // Clic sur l'élément <a> pour déclencher le téléchargement
    a.click();
    console.log("ok")

    // Suppression de l'élément <a> et du Blob après le téléchargement
    window.URL.revokeObjectURL(url);
    a.remove();
}
