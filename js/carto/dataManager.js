// dataManager.js
export const dataManager = (() => {
    let countriesData = [];
    let selectedCountries = [];
    let selectedColors = [];
    let selectedIdx = [];
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

    // Nouvelle fonction pour charger la liste des fichiers GeoJSON
    const loadFileList = async (jsonPath = 'static/data/files.json') => {
        try {
            const response = await fetch(jsonPath);
            if (!response.ok) throw new Error('Fichier JSON de la liste introuvable');
            const fileList = await response.json();
            return fileList;
        } catch (error) {
            console.error('Erreur lors du chargement de la liste des fichiers :', error);
            return [];
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
        selectedIdx.push(index);
        countryGeometries.push(geometry);
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
            geometry: countryGeometries[index],
            index: selectedIdx[index],
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
        loadFileList, // Exposer la nouvelle fonction
        getCountryGeometry,
        addSelectedCountry,
        removeSelectedCountry,
        getSelectedData,
        clearSelectedData,
    };
})();