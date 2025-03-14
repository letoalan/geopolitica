// uiManager.js
export const uiManager = (() => {
    const showColorPicker = (event, onColorSelected, onValidate) => {
        const colorPickerContainer = document.getElementById('colorPickerContainer');
        if (!colorPickerContainer) {
            console.error("Conteneur 'colorPickerContainer' non trouvé dans le DOM.");
            return;
        }

        colorPickerContainer.style.display = 'flex';
        colorPickerContainer.style.position = 'fixed';
        colorPickerContainer.style.top = '50%';
        colorPickerContainer.style.left = '50%';
        colorPickerContainer.style.transform = 'translate(-50%, -50%)';
        colorPickerContainer.style.backgroundColor = '#333333';
        colorPickerContainer.style.padding = '20px';
        colorPickerContainer.style.borderRadius = '8px';
        colorPickerContainer.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        colorPickerContainer.style.zIndex = '1000';
        colorPickerContainer.style.flexDirection = 'column';
        colorPickerContainer.style.alignItems = 'center';
        colorPickerContainer.style.gap = '10px';
        colorPickerContainer.style.transition = 'opacity 0.3s ease';
        colorPickerContainer.style.opacity = '1';

        const colorInput = document.createElement('input');
        colorInput.type = 'text';
        colorInput.id = 'tempColorInput';
        colorInput.value = '#000000';
        colorInput.style.backgroundColor = '#000000';
        colorInput.style.border = 'none';
        colorInput.style.width = '100px';
        colorInput.style.height = '20px';
        colorInput.style.cursor = 'pointer';
        colorPickerContainer.innerHTML = '';
        colorPickerContainer.appendChild(colorInput);

        if (typeof Coloris === 'undefined') {
            console.error("Coloris n'est pas chargé. Vérifiez le script dans index.html.");
            return;
        }

        Coloris({
            el: '#tempColorInput',
            themeMode: 'dark',
            swatches: [
                '#FF0000', '#00FF00', '#0000FF',
                '#FFFF00', '#FF00FF', '#00FFFF',
                '#000000', '#FFFFFF', '#808080',
            ],
            format: 'hex',
            alpha: false,
            onChange: (color) => {
                console.log('Couleur prévisualisée :', color);
                onColorSelected(color);
                colorInput.style.backgroundColor = color;
            },
        });

        const validateButton = document.createElement('button');
        validateButton.textContent = 'Valider';
        validateButton.style.padding = '10px 20px';
        validateButton.style.fontSize = '16px';
        validateButton.style.backgroundColor = '#4CAF50';
        validateButton.style.color = 'white';
        validateButton.style.border = 'none';
        validateButton.style.borderRadius = '4px';
        validateButton.style.cursor = 'pointer';
        validateButton.addEventListener('click', () => {
            const selectedColor = colorInput.value;
            console.log('Couleur validée :', selectedColor);
            onValidate(selectedColor);
            colorPickerContainer.style.opacity = '0';
            setTimeout(() => {
                colorPickerContainer.style.display = 'none';
                colorPickerContainer.style.opacity = '1';
                console.log('Color picker masqué');
            }, 300);
        });
        colorPickerContainer.appendChild(validateButton);

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Annuler';
        cancelButton.style.padding = '10px 20px';
        cancelButton.style.fontSize = '16px';
        cancelButton.style.backgroundColor = '#f0f0f0';
        cancelButton.style.border = 'none';
        cancelButton.style.borderRadius = '4px';
        cancelButton.style.cursor = 'pointer';
        cancelButton.addEventListener('click', () => {
            console.log('Annuler cliqué');
            colorPickerContainer.style.opacity = '0';
            setTimeout(() => {
                colorPickerContainer.style.display = 'none';
                colorPickerContainer.style.opacity = '1';
                console.log('Color picker masqué après annulation');
            }, 300);
        });
        colorPickerContainer.appendChild(cancelButton);

        if (window.matchMedia('(max-width: 768px)').matches) {
            colorPickerContainer.style.width = '80%';
            colorPickerContainer.style.maxWidth = '300px';
        }
    };

    const updateSelectedCountriesList = (selectedCountries) => {
        console.log("Données reçues pour mise à jour de la liste :", selectedCountries);
        const container = document.getElementById('selectedCountriesContainer');
        if (!container) {
            console.error("Conteneur 'selectedCountriesContainer' non trouvé dans le DOM.");
            return;
        }

        container.innerHTML = '';
        container.innerHTML = selectedCountries
            .map((country, idx) => {
                const color = country.color && country.color.startsWith('#') ? country.color : '#000000';
                // Utiliser un input texte stylisé au lieu de type="color"
                return `
                    <tr>
                        <td>${country.name}</td>
                        <td>
                            <input type="text" 
                                   id="colorInput-${country.index}" 
                                   value="${color}" 
                                   class="coloris-table-input"
                                   style="background-color: ${color}; border: none; width: 50px; height: 30px; cursor: pointer;"
                                   data-index="${country.index}">
                        </td>
                        <td><button onclick="removeSelectedCountry('${country.name}')" class="cancel-button">Annuler</button></td>
                    </tr>
                `;
            })
            .join('');

        // Initialiser Coloris pour tous les inputs du tableau
        Coloris({
            el: '.coloris-table-input',
            themeMode: 'dark',
            swatches: [
                '#FF0000', '#00FF00', '#0000FF',
                '#FFFF00', '#FF00FF', '#00FFFF',
                '#000000', '#FFFFFF', '#808080',
            ],
            format: 'hex',
            alpha: false,
            onChange: (color, input) => {
                console.log('Couleur prévisualisée dans le tableau :', color);
                const countryIndex = input.getAttribute('data-index');
                window.mapManager.updateCountryColor(countryIndex, color);
                input.style.backgroundColor = color; // Mettre à jour la barre visuellement
                const selectedData = window.dataManager.getSelectedData();
                const country = selectedData.find((c) => c.index == countryIndex);
                if (country) {
                    country.color = color;
                }
            },
        });
    };

    return {
        showColorPicker,
        updateSelectedCountriesList,
    };
})();