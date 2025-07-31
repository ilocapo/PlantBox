# 🌱 PlantBox - Pokédex des Plantes

Une application d'apprentissage pour découvrir une nouvelle plante chaque jour et construire votre Pokédex personnel !

## ✨ Fonctionnalités

### 🗓️ Plante du Jour
- **Découverte quotidienne** : Une nouvelle plante vous est proposée chaque jour
- **Contenu éducatif** : Descriptions détaillées avec conseils de soins
- **Choix personnel** : Ajoutez ou passez selon vos préférences

### 📚 Pokédex Personnel
- **Collection personnalisée** : Toutes vos plantes découvertes
- **Informations complètes** : Soins, origine, difficulté
- **Photos réelles** : Images haute qualité
- **Date de découverte** : Historique de vos apprentissages

### 🎨 Design Moderne
- **Interface épurée** : Design minimaliste et intuitive
- **Couleurs thématiques** : Chaque type de plante a sa couleur
- **Photos optimisées** : Chargement fluide avec transitions
- **Bords arrondis** : Elements avec des formes douces

## 📱 Comment utiliser

### Premier lancement
1. Ouvrez l'application
2. Une "Plante du Jour" s'affiche automatiquement
3. Lisez les informations éducatives
4. Choisissez d'ajouter au Pokédex ou passer

### Utilisation quotidienne
- Une nouvelle plante apparaît chaque jour (24h après la dernière)
- Votre Pokédex grandit avec vos découvertes
- Consultez les détails de vos plantes collectées

### Navigation
- **Page d'accueil** : Votre Pokédex personnel
- **Bouton "Plante du jour"** : Vérifier s'il y a une nouvelle plante
- **Cartes cliquables** : Détails complets de chaque plante

## 🔧 Configuration API (Optionnel)

Pour accéder à plus de 400,000 espèces :

1. Créez un compte sur [trefle.io](https://trefle.io/)
2. Obtenez votre clé API gratuite
3. Modifiez `services/plantApi.ts` :
```typescript
const TREFLE_API_KEY = 'votre_clé_api_ici';
```

## 🎯 Types de Plantes

L'application reconnaît 10 types de plantes avec leurs couleurs :

- 🌸 **Flowering** (Fleuries) - Rose
- 🌿 **Foliage** (Feuillage) - Vert
- 🌵 **Succulent** (Succulentes) - Orange
- 🏝️ **Tropical** (Tropicales) - Turquoise
- 🌱 **Herbs** (Herbes) - Vert lime
- 🌳 **Trees** (Arbres) - Brun
- 💧 **Aquatic** (Aquatiques) - Bleu
- 🎭 **Orchid** (Orchidées) - Violet
- 🌾 **Fleshy** (Charnues) - Vert-jaune
- ⚕️ **Medicinal** (Médicinales) - Gris-bleu

## 📱 Stockage Local

- **AsyncStorage** : Sauvegarde automatique de votre Pokédex
- **Persistance** : Vos données restent même après fermeture
- **Synchronisation** : Suivi automatique des dates

## 🚀 Technologies

- **React Native + Expo**
- **TypeScript** pour la sécurité des types
- **expo-image** pour l'optimisation des images
- **AsyncStorage** pour la persistance
- **API Trefle.io** (optionnel) pour les données

## 🎨 Palette de Couleurs

- **Fond principal** : `#d7fcfa86` (Turquoise doux)
- **Surfaces** : Blanc avec ombres subtiles
- **Texte** : Noir doux avec variations de gris
- **Accents** : Couleurs thématiques par type de plante

---

**PlantBox** - Apprenez quelque chose de nouveau chaque jour ! 🌱✨
# PlantBox
