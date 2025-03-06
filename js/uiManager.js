// uiManager.js
export const uiManager = (() => {
    const showColorPicker = (event, onColorSelected, onValidate) => {
        const colorPickerContainer = document.getElementById('colorPickerContainer');
        if (colorPickerContainer) {
            colorPickerContainer.style.display = 'block';
            colorPickerContainer.style.left = `${event.clientX}px`;
            colorPickerContainer.style.top = `${event.clientY}px`;

            const colorPicker = document.createElement('input');
            colorPicker.type = 'color';

            // Mettre à jour la couleur sélectionnée
            colorPicker.oninput = () => onColorSelected(colorPicker.value);

            const validateButton = document.createElement('button');
            validateButton.textContent = 'Valider';

            // Passer la couleur sélectionnée à onValidate
            validateButton.addEventListener('click', () => {
                onValidate(colorPicker.value); // Passer la couleur ici
                colorPickerContainer.style.display = 'none';
            });

            colorPickerContainer.innerHTML = '';
            colorPickerContainer.appendChild(colorPicker);
            colorPickerContainer.appendChild(validateButton);
        }
    };

    const updateSelectedCountriesList = (selectedCountries) => {
        console.log("Données reçues pour mise à jour de la liste :", selectedCountries); // Log des données reçues

        const container = document.getElementById('selectedCountriesContainer');
        if (container) {
            container.innerHTML = selectedCountries
                .map(
                    (country, index) => {
                        // Vérifier que la couleur est valide
                        const color = country.color && country.color.startsWith('#') ? country.color : '#000000';
                        return `
                            <tr>
                                <td>${country.name}</td>
                                <td><input type="color" value="${color}" data-index="${country.index}" onchange="updateCountryColorFromTable(this)"></td>
                                <td><button onclick="removeSelectedCountry('${country.name}')">Annuler</button></td>
                            </tr>
                        `;
                    }
                )
                .join('');
        }
    };

    return {
        showColorPicker,
        updateSelectedCountriesList,
    };
})();

// Exposer la fonction updateCountryColorFromTable à l'interface utilisateur
window.updateCountryColorFromTable = (inputElement) => {
    const newColor = inputElement.value;
    const countryIndex = inputElement.getAttribute('data-index');

    // Mettre à jour la couleur sur la carte
    window.mapManager.updateCountryColor(countryIndex, newColor);

    // Mettre à jour la couleur dans dataManager
    const selectedData = window.dataManager.getSelectedData();
    const country = selectedData.find((c) => c.index == countryIndex);
    if (country) {
        country.color = newColor;
    }
};
