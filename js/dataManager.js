// dataManager.js
export const dataManager = (() => {
    let countriesData = [];
    let selectedCountries = [];
    let selectedColors = [];
    let selectedIdx = []; // Stocke les INDEX des pays sélectionnés
    let countryGeometries = [];

    const loadSelectedFile = async (filePath) => {
        try {
            const response = await fetch(filePath);
            if (!response.ok) throw new Error('Le fichier est introuvable');
            countriesData = await response.json();
            return countriesData;
        } catch (error) {
            console.error('Erreur lors du chargement du fichier :', error);
            return null;
        }
    };

    const getCountryGeometry = (countryName) => {
        return countriesData.features.find(
            (feature) => feature.properties.NAME === countryName
        )?.geometry;
    };

    const addSelectedCountry = (countryName, color, geometry, index) => {
        selectedCountries.push(countryName);
        selectedColors.push(color);
        selectedIdx.push(index); // Ajouter l'INDEX du pays
        countryGeometries.push(geometry); // Ajouter la géométrie directement
    };

    const removeSelectedCountry = (countryName) => {
        const index = selectedCountries.indexOf(countryName);
        if (index !== -1) {
            selectedCountries.splice(index, 1);
            selectedColors.splice(index, 1);
            selectedIdx.splice(index, 1);
            countryGeometries.splice(index, 1);
        }
    };

    const getSelectedData = () => {
        return selectedCountries.map((country, index) => ({
            name: country,
            color: selectedColors[index],
            geometry: countryGeometries[index], // Retourner la géométrie directement
            index: selectedIdx[index], // Retourner l'INDEX du pays
        }));
    };

    const clearSelectedData = () => {
        selectedCountries = [];
        selectedColors = [];
        selectedIdx = [];
        countryGeometries = [];
    };

    return {
        loadSelectedFile,
        getCountryGeometry,
        addSelectedCountry,
        removeSelectedCountry,
        getSelectedData,
        clearSelectedData,
    };
})();
