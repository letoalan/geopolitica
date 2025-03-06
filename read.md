Géopolitica - Editeur de frontières dans le temps et l'espace

Géopolitica est une application web interactive qui permet de visualiser et de manipuler des données géopolitiques sous forme de cartes interactives. Elle utilise la bibliothèque Leaflet pour afficher des cartes et des données GeoJSON, et permet à l'utilisateur de sélectionner des pays, de leur attribuer des couleurs, et de télécharger les configurations sous forme de fichiers .umap.
Fonctionnalités

    Visualisation de cartes historiques : Chargez des fichiers GeoJSON représentant des cartes du monde à différentes époques historiques.

    Sélection de pays : Cliquez sur un pays pour le sélectionner et lui attribuer une couleur.

    Color picker : Utilisez un color picker pour choisir la couleur des pays sélectionnés.

    Téléchargement de configurations : Exportez les pays sélectionnés et leurs couleurs dans un fichier .umap compatible avec l'application uMap.

    Zoom sur les continents : Changez la vue de la carte pour zoomer sur un continent spécifique.

Comment utiliser l'application

    Choisir un fichier GeoJSON :

        Sélectionnez un fichier GeoJSON dans le menu déroulant "Menu de fichiers". Les fichiers représentent des cartes du monde à différentes époques historiques.

    Zoomer sur un continent :

        Utilisez le menu déroulant "Menu des continents" pour zoomer sur un continent spécifique.

    Sélectionner un pays :

        Cliquez sur un pays pour ouvrir le color picker et choisir une couleur.

        Le pays sélectionné sera ajouté au tableau "Tableau de pays sélectionnés".

    Modifier la couleur d'un pays :

        Dans le tableau, vous pouvez modifier la couleur d'un pays en utilisant le champ de couleur associé.

    Télécharger la configuration :

        Cliquez sur "Valider" pour vérifier la liste des pays sélectionnés.

        Entrez un nom de fichier dans le champ "Nom du fichier".

        Cliquez sur "Télécharger" pour exporter la configuration au format .umap.

Structure du projet

    index.html : Le fichier HTML principal qui structure l'interface utilisateur.

    styles.css : Le fichier CSS pour le style de l'application.

    main.js : Le point d'entrée JavaScript de l'application.

    dataManager.js : Gère le chargement des fichiers GeoJSON et la sélection des pays.

    mapManager.js : Gère l'initialisation de la carte Leaflet et l'affichage des couches GeoJSON.

    uiManager.js : Gère l'interface utilisateur, y compris le color picker et la mise à jour du tableau des pays sélectionnés.

    templateManager.js : Génère et télécharge le fichier .umap à partir des pays sélectionnés.

Prérequis

    Un navigateur web moderne (Chrome, Firefox, Edge, etc.).

    Un serveur web local (comme Live Server pour exécuter l'application, car elle utilise des modules JavaScript, ou Github pages).

Installation

    Clonez ce dépôt :
    bash
    Copy

    git clone https://github.com/letoalan/geopolitica.git

    Ouvrez le dossier du projet :
    bash
    Copy

    cd geopolitica

    Lancez un serveur web local (par exemple, avec Live Server dans VS Code).

    Ouvrez l'application dans votre navigateur à l'adresse http://localhost:5500.

Fichiers GeoJSON

Les fichiers GeoJSON sont stockés dans le dossier data/. Chaque fichier représente une carte du monde à une époque historique spécifique. Par exemple :

    world_bc10000.geojson : Carte du monde en 10 000 av. J.-C.

    world.geojson : Carte du monde en 2024.

Personnalisation

    Ajouter de nouveaux fichiers GeoJSON :

        Placez vos fichiers GeoJSON dans le dossier data/.

        Ajoutez une option correspondante dans le menu déroulant "Menu de fichiers" dans index.html.

    Modifier les vues des continents :

        Les coordonnées centrales et les niveaux de zoom pour chaque continent sont définis dans main.js. Vous pouvez les ajuster selon vos besoins.

Technologies utilisées

    Leaflet : Bibliothèque JavaScript pour les cartes interactives.

    GeoJSON : Format pour encoder des structures de données géographiques.

    JavaScript (ES6) : Pour la logique de l'application.

    HTML/CSS : Pour la structure et le style de l'interface utilisateur.

Auteur

    Votre Nom : Alan Duval.

    Contact : alanoduval@gmail.com

Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.
Remerciements

    Merci à Leaflet pour la bibliothèque de cartes interactive.

    Merci à uMap pour l'inspiration du format .umap.

