// templateManager.js
export const templateManager = (() => {
    const generateTemplate = (selectedData) => {
        const features = selectedData.map(({ name, color, geometry }) => {
            let coords = [];
            if (geometry.type === 'Polygon') {
                coords = geometry.coordinates.map(ring => ring.map(coord => [coord[0], coord[1]]));
            } else if (geometry.type === 'MultiPolygon') {
                coords = geometry.coordinates.flatMap(polygon => polygon.map(coord => coord.map(c => [c[0], c[1]])));
            }

            return {
                type: 'Feature',
                properties: {
                    _umap_options: { color, fillOpacity: 0.3 },
                    name,
                },
                geometry: {
                    type: 'Polygon',
                    coordinates: coords,
                },
            };
        });

        return JSON.stringify({
            type: 'umap',
            uri: 'https://wxs.ign.fr/pratique/wmts/?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&STYLE=normal&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image%2Fjpeg',
            properties: {
                easing: true,
                embedControl: true,
                fullscreenControl: true,
                searchControl: true,
                datalayersControl: true,
                zoomControl: true,
                slideshow: {},
                captionBar: false,
                limitBounds: {},
                tilelayer: {},
                licence: '',
                description: '',
                name: 'Carte sans nom',
                displayPopupFooter: false,
                miniMap: false,
                moreControl: true,
                scaleControl: true,
                scrollWheelZoom: true,
                zoom: 6,
            },
            geometry: {
                type: 'Point',
                coordinates: [2, 51],
            },
            layers: [
                {
                    type: 'FeatureCollection',
                    features,
                    _umap_options: {
                        displayOnLoad: true,
                        browsable: true,
                        name: 'Calque 1',
                    },
                },
            ],
        });
    };

    const downloadTemplate = (content, fileName) => {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.umap`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    return {
        generateTemplate,
        downloadTemplate,
    };
})();
