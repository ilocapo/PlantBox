import AsyncStorage from '@react-native-async-storage/async-storage';

interface TrefleSpecies {
  id: number;
  common_name: string;
  scientific_name: string;
  family_common_name: string;
  image_url: string;
  slug: string;
  description?: string;
  distribution?: string;
}

interface TrefleResponse {
  data: TrefleSpecies[];
  links: {
    last: string;
    next?: string;
  };
  meta: {
    total: number;
  };
}

interface TrefleSpeciesResponse {
  data: TrefleSpecies;
}

export interface Plant {
  id: number;
  name: string;
  scientificName: string;
  family: string;
  type: 'flowering' | 'foliage' | 'succulent' | 'tropical' | 'herbs' | 'trees' | 'aquatic' | 'orchid' | 'fleshy' | 'medicinal';
  description: string;
  care: {
    water: string;
    light: string;
    temperature: string;
    humidity: string;
  };
  image: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  origin: string;
  slug?: string;
  discoveredAt?: string;
}

export interface DailyPlant {
  plant: Plant;
  date: string;
  isAddedToPokedex: boolean;
}

const TREFLE_API_KEY = 'YOUR_API_KEY';
const TREFLE_BASE_URL = 'https://trefle.io/api/v1';

function getPlantType(name: string, family: string): Plant['type'] {
  const lowerName = name.toLowerCase();
  const lowerFamily = family.toLowerCase();
  
  if (lowerName.includes('cactus') || lowerFamily.includes('cactaceae') || lowerName.includes('succulent')) {
    return 'succulent';
  }
  if (lowerName.includes('orchid') || lowerFamily.includes('orchidaceae')) {
    return 'orchid';
  }
  if (lowerName.includes('basil') || lowerName.includes('mint') || lowerName.includes('rosemary') || lowerName.includes('thyme')) {
    return 'herbs';
  }
  if (lowerFamily.includes('araceae') || lowerName.includes('monstera') || lowerName.includes('philodendron')) {
    return 'tropical';
  }
  if (lowerName.includes('tree') || lowerName.includes('oak') || lowerName.includes('maple') || lowerFamily.includes('fagaceae')) {
    return 'trees';
  }
  if (lowerName.includes('lily') || lowerName.includes('rose') || lowerName.includes('tulip') || lowerName.includes('daisy')) {
    return 'flowering';
  }
  if (lowerName.includes('fern') || lowerName.includes('moss') || lowerFamily.includes('pteridaceae')) {
    return 'foliage';
  }
  if (lowerName.includes('aloe') || lowerName.includes('medicinal') || lowerName.includes('lavender')) {
    return 'medicinal';
  }
  if (lowerName.includes('water') || lowerName.includes('aquatic') || lowerName.includes('lotus')) {
    return 'aquatic';
  }
  return 'foliage';
}

function generateCareInfo(type: Plant['type']): Plant['care'] {
  const careGuides = {
    succulent: {
      water: "Toutes les 2-3 semaines",
      light: "Lumière directe vive",
      temperature: "15-27°C",
      humidity: "30-50%"
    },
    tropical: {
      water: "1-2 fois par semaine",
      light: "Lumière indirecte vive",
      temperature: "18-27°C",
      humidity: "60-80%"
    },
    flowering: {
      water: "2-3 fois par semaine",
      light: "Lumière indirecte",
      temperature: "18-25°C",
      humidity: "50-60%"
    },
    herbs: {
      water: "Tous les jours",
      light: "Lumière directe",
      temperature: "18-25°C",
      humidity: "40-60%"
    },
    trees: {
      water: "1 fois par semaine",
      light: "Lumière vive indirecte",
      temperature: "18-24°C",
      humidity: "40-60%"
    },
    medicinal: {
      water: "Toutes les 2-3 semaines",
      light: "Lumière directe",
      temperature: "15-25°C",
      humidity: "30-40%"
    },
    foliage: {
      water: "1-2 fois par semaine",
      light: "Lumière indirecte",
      temperature: "18-24°C",
      humidity: "50-60%"
    },
    orchid: {
      water: "1 fois par semaine",
      light: "Lumière indirecte vive",
      temperature: "20-25°C",
      humidity: "70-80%"
    },
    aquatic: {
      water: "Constamment humide",
      light: "Lumière indirecte",
      temperature: "18-26°C",
      humidity: "80-90%"
    },
    fleshy: {
      water: "Toutes les 2-3 semaines",
      light: "Lumière vive",
      temperature: "15-25°C",
      humidity: "40-50%"
    }
  };
  
  return careGuides[type];
}

function generateEducationalDescription(plant: TrefleSpecies, type: Plant['type']): string {
  const typeDescriptions = {
    tropical: "Les plantes tropicales sont originaires des régions chaudes et humides. Elles apprécient la chaleur constante et une humidité élevée.",
    succulent: "Les plantes succulentes stockent l'eau dans leurs feuilles épaisses. Elles sont parfaites pour débuter car très résistantes à la sécheresse.",
    flowering: "Les plantes à fleurs produisent des blooms colorés qui attirent les pollinisateurs. Elles ajoutent de la couleur à votre collection.",
    medicinal: "Cette plante possède des propriétés thérapeutiques utilisées depuis l'antiquité. Attention : consultez un professionnel avant usage.",
    herbs: "Les herbes aromatiques parfument vos plats et votre jardin. Elles sont faciles à cultiver et très utiles en cuisine.",
    trees: "Les arbres d'intérieur apportent structure et élégance. Ils purifient l'air et créent une ambiance apaisante.",
    orchid: "Les orchidées sont des fleurs exotiques sophistiquées. Elles demandent des soins spécifiques mais sont très gratifiantes.",
    foliage: "Les plantes à feuillage décoratif embellissent l'espace par leurs formes et couleurs variées. Parfaites pour purifier l'air.",
    aquatic: "Les plantes aquatiques vivent dans ou près de l'eau. Elles créent des écosystèmes uniques et apaisants.",
    fleshy: "Les plantes charnues conservent l'eau dans leurs tissus épais. Elles sont idéales pour les jardiniers occupés."
  };

  const baseDescription = plant.description || typeDescriptions[type];
  return `${baseDescription} Découvrez cette espèce fascinante de la famille des ${plant.family_common_name || 'plantes'}!`;
}

const plantPool: Plant[] = [
  {
    id: 1,
    name: "Monstera Deliciosa",
    scientificName: "Monstera deliciosa",
    family: "Araceae",
    type: "tropical",
    description: "Une plante tropicale populaire avec de grandes feuilles perforées caractéristiques. Parfaite pour l'intérieur.",
    care: generateCareInfo('tropical'),
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    difficulty: "Easy",
    origin: "Amérique Centrale"
  },
  {
    id: 2,
    name: "Snake Plant",
    scientificName: "Sansevieria trifasciata",
    family: "Asparagaceae",
    type: "succulent",
    description: "Une plante résistante aux feuilles dressées et striées, parfaite pour les débutants.",
    care: generateCareInfo('succulent'),
    image: "https://images.unsplash.com/photo-1517067669446-c134c09c58e5?w=400&h=300&fit=crop",
    difficulty: "Easy",
    origin: "Afrique tropicale"
  },
  {
    id: 3,
    name: "Peace Lily",
    scientificName: "Spathiphyllum",
    family: "Araceae",
    type: "flowering",
    description: "Une plante élégante aux fleurs blanches en forme de spathe et aux feuilles vert foncé brillantes.",
    care: generateCareInfo('flowering'),
    image: "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=400&h=300&fit=crop",
    difficulty: "Easy",
    origin: "Amérique tropicale"
  },
  {
    id: 4,
    name: "Aloe Vera",
    scientificName: "Aloe barbadensis",
    family: "Asphodelaceae",
    type: "medicinal",
    description: "Une plante succulente médicinale aux propriétés apaisantes et cicatrisantes.",
    care: generateCareInfo('medicinal'),
    image: "https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?w=400&h=300&fit=crop",
    difficulty: "Easy",
    origin: "Péninsule Arabique"
  },
  {
    id: 5,
    name: "Basil",
    scientificName: "Ocimum basilicum",
    family: "Lamiaceae",
    type: "herbs",
    description: "Une herbe aromatique essentielle en cuisine, facile à cultiver et très parfumée.",
    care: generateCareInfo('herbs'),
    image: "https://images.unsplash.com/photo-1618164435735-413d3b066c9a?w=400&h=300&fit=crop",
    difficulty: "Easy",
    origin: "Asie tropicale"
  },
  {
    id: 6,
    name: "Fiddle Leaf Fig",
    scientificName: "Ficus lyrata",
    family: "Moraceae",
    type: "trees",
    description: "Un figuier aux grandes feuilles en forme de violon, très apprécié en décoration d'intérieur.",
    care: generateCareInfo('trees'),
    image: "https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=400&h=300&fit=crop",
    difficulty: "Medium",
    origin: "Afrique de l'Ouest"
  },
  {
    id: 7,
    name: "Boston Fern",
    scientificName: "Nephrolepis exaltata",
    family: "Nephrolepidaceae",
    type: "foliage",
    description: "Une fougère élégante aux frondes arquées, parfaite pour purifier l'air intérieur.",
    care: generateCareInfo('foliage'),
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop",
    difficulty: "Medium",
    origin: "Régions tropicales"
  },
  {
    id: 8,
    name: "Jade Plant",
    scientificName: "Crassula ovata",
    family: "Crassulaceae",
    type: "succulent",
    description: "Une plante succulente aux feuilles charnues, symbole de prospérité et très facile d'entretien.",
    care: generateCareInfo('succulent'),
    image: "https://images.unsplash.com/photo-1509423350716-97f2360af0e4?w=400&h=300&fit=crop",
    difficulty: "Easy",
    origin: "Afrique du Sud"
  }
];

// Fonction pour obtenir un nombre aléatoire basé sur la date (même résultat pour la même journée)
function getDailyRandomSeed(): number {
  const today = new Date().toDateString();
  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    const char = today.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

export const plantApi = {
  // Obtenir la plante du jour
  getDailyPlant: async (): Promise<DailyPlant> => {
    const today = new Date().toISOString().split('T')[0];
    
    try {
      // Si pas de clé API, utiliser le pool de plantes
      if (TREFLE_API_KEY === 'YOUR_API_KEY') {
        const seed = getDailyRandomSeed();
        const randomIndex = seed % plantPool.length;
        const plant = plantPool[randomIndex];
        
        return {
          plant,
          date: today,
          isAddedToPokedex: false
        };
      }

      // Avec l'API Trefle, obtenir une plante aléatoire
      const seed = getDailyRandomSeed();
      const randomPage = Math.floor(seed % 100) + 1; // Pages 1-100
      
      const response = await fetch(
        `${TREFLE_BASE_URL}/species?token=${TREFLE_API_KEY}&page=${randomPage}&page_size=20`
      );
      
      if (!response.ok) {
        throw new Error('Erreur API Trefle');
      }
      
      const data: TrefleResponse = await response.json();
      
      if (data.data.length === 0) {
        // Fallback vers le pool local
        const randomIndex = seed % plantPool.length;
        return {
          plant: plantPool[randomIndex],
          date: today,
          isAddedToPokedex: false
        };
      }
      
      const randomSpeciesIndex = seed % data.data.length;
      const species = data.data[randomSpeciesIndex];
      const type = getPlantType(species.common_name || species.scientific_name, species.family_common_name || '');
      
      const plant: Plant = {
        id: species.id,
        name: species.common_name || species.scientific_name.split(' ')[0],
        scientificName: species.scientific_name,
        family: species.family_common_name || 'Non spécifiée',
        type,
        description: generateEducationalDescription(species, type),
        care: generateCareInfo(type),
        image: species.image_url || `https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=${encodeURIComponent(species.common_name || 'Plant')}`,
        difficulty: ['Easy', 'Medium', 'Hard'][seed % 3] as Plant['difficulty'],
        origin: species.distribution || 'Données depuis Trefle.io',
        slug: species.slug
      };
      
      return {
        plant,
        date: today,
        isAddedToPokedex: false
      };
      
    } catch (error) {
      console.error('Erreur lors de la récupération de la plante du jour:', error);
      // Fallback vers le pool local
      const seed = getDailyRandomSeed();
      const randomIndex = seed % plantPool.length;
      return {
        plant: plantPool[randomIndex],
        date: today,
        isAddedToPokedex: false
      };
    }
  },

  // Récupérer toutes les plantes du Pokédex de l'utilisateur
  getPokedexPlants: async (): Promise<Plant[]> => {
    try {
      // Récupérer depuis AsyncStorage
      const storedPlants = await AsyncStorage.getItem('pokedex_plants');
      return storedPlants ? JSON.parse(storedPlants) : [];
    } catch (error) {
      console.error('Erreur lors de la récupération du Pokédex:', error);
      return [];
    }
  },

  // Ajouter une plante au Pokédex
  addToPokedex: async (plant: Plant): Promise<void> => {
    try {
      const existingPlants = await plantApi.getPokedexPlants();
      const plantWithDiscoveryDate = {
        ...plant,
        discoveredAt: new Date().toISOString()
      };
      
      // Vérifier si la plante n'est pas déjà dans le Pokédex
      const isAlreadyAdded = existingPlants.some(p => p.id === plant.id);
      if (!isAlreadyAdded) {
        const updatedPlants = [...existingPlants, plantWithDiscoveryDate];
        await AsyncStorage.setItem('pokedex_plants', JSON.stringify(updatedPlants));
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout au Pokédex:', error);
    }
  },

  // Vérifier si une nouvelle plante du jour est disponible
  isNewDailyPlantAvailable: async (): Promise<boolean> => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const lastDailyPlantDate = await AsyncStorage.getItem('last_daily_plant_date');
      return lastDailyPlantDate !== today;
    } catch (error) {
      return true;
    }
  },

  // Marquer la plante du jour comme vue
  markDailyPlantAsSeen: async (): Promise<void> => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await AsyncStorage.setItem('last_daily_plant_date', today);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la date:', error);
    }
  },

  // Obtenir une plante par ID (pour les détails)
  getPlantById: async (id: number): Promise<Plant | undefined> => {
    try {
      // D'abord chercher dans le Pokédex
      const pokedexPlants = await plantApi.getPokedexPlants();
      const pokedexPlant = pokedexPlants.find(plant => plant.id === id);
      if (pokedexPlant) {
        return pokedexPlant;
      }

      // Puis dans le pool local
      const poolPlant = plantPool.find(plant => plant.id === id);
      if (poolPlant) {
        return poolPlant;
      }

      // Enfin essayer l'API Trefle si disponible
      if (TREFLE_API_KEY !== 'YOUR_API_KEY') {
        const response = await fetch(`${TREFLE_BASE_URL}/species/${id}?token=${TREFLE_API_KEY}`);
        
        if (response.ok) {
          const result: TrefleSpeciesResponse = await response.json();
          const species = result.data;
          
          if (species) {
            const type = getPlantType(species.common_name || species.scientific_name, species.family_common_name || '');
            
            return {
              id: species.id,
              name: species.common_name || species.scientific_name.split(' ')[0],
              scientificName: species.scientific_name,
              family: species.family_common_name || 'Non spécifiée',
              type,
              description: generateEducationalDescription(species, type),
              care: generateCareInfo(type),
              image: species.image_url || `https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=${encodeURIComponent(species.common_name || 'Plant')}`,
              difficulty: 'Medium',
              origin: species.distribution || 'Données depuis Trefle.io',
              slug: species.slug
            };
          }
        }
      }

      return undefined;
    } catch (error) {
      console.error('Erreur lors de la récupération de la plante:', error);
      return undefined;
    }
  }
};
