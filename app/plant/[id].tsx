import { Loading } from "@/components/Loading";
import { PlantIcon } from "@/components/PlantIcon";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Plant, plantApi } from "@/services/plantApi";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PlantDetail() {
  const { id } = useLocalSearchParams();
  const [plant, setPlant] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);
  const colors = useThemeColors();

  useEffect(() => {
    loadPlant();
  }, [id]);

  const loadPlant = async () => {
    try {
      setLoading(true);
      const plantId = parseInt(id as string);
      const data = await plantApi.getPlantById(plantId);
      setPlant(data || null);
    } catch (error) {
      console.error('Erreur lors du chargement de la plante:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Chargement des détails..." />;
  }

  if (!plant) {
    return (
      <SafeAreaView style={styles.container}>
        <ThemedText variant="title" color="text">Plante non trouvée</ThemedText>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ThemedText variant="body1" color="primary">Retour</ThemedText>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const plantTypeColor = Colors.types[plant.type as keyof typeof Colors.types];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ThemedText variant="body1" color="primary">← Retour</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.mainImageContainer}>
          <PlantIcon 
            size={200}
            color={plantTypeColor.primary}
          />
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={[styles.typeIndicator, { backgroundColor: plantTypeColor.primary }]} />
          
          <View style={styles.cardContent}>
            <ThemedText variant="headline" color="text" style={styles.plantName}>
              {plant.name}
            </ThemedText>
            <ThemedText variant="body1" color="textSecondary" style={styles.scientificName}>
              {plant.scientificName}
            </ThemedText>
            
            <View style={styles.badges}>
              <View style={[styles.badge, { backgroundColor: plantTypeColor.light }]}>
                <ThemedText style={[styles.badgeText, { color: plantTypeColor.dark }]}>
                  {plant.type}
                </ThemedText>
              </View>
              <View style={[styles.badge, { 
                backgroundColor: plant.difficulty === 'Easy' ? '#E8F5E8' : 
                               plant.difficulty === 'Medium' ? '#FFF3E0' : '#FFEBEE' 
              }]}>
                <ThemedText style={[styles.badgeText, { 
                  color: plant.difficulty === 'Easy' ? '#2E7D32' : 
                         plant.difficulty === 'Medium' ? '#F57C00' : '#C62828' 
                }]}>
                  {plant.difficulty}
                </ThemedText>
              </View>
            </View>

            <ThemedText variant="body1" color="text" style={styles.description}>
              {plant.description}
            </ThemedText>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <ThemedText variant="title" color="text" style={styles.sectionTitle}>
            Soins nécessaires
          </ThemedText>
          
          <View style={styles.careGrid}>
            <View style={styles.careItem}>
              <ThemedText variant="body2" color="primary" style={styles.careLabel}>Arrosage</ThemedText>
              <ThemedText variant="body1" color="text">{plant.care.water}</ThemedText>
            </View>
            
            <View style={styles.careItem}>
              <ThemedText variant="body2" color="primary" style={styles.careLabel}>Lumière</ThemedText>
              <ThemedText variant="body1" color="text">{plant.care.light}</ThemedText>
            </View>
            
            <View style={styles.careItem}>
              <ThemedText variant="body2" color="primary" style={styles.careLabel}>Température</ThemedText>
              <ThemedText variant="body1" color="text">{plant.care.temperature}</ThemedText>
            </View>
            
            <View style={styles.careItem}>
              <ThemedText variant="body2" color="primary" style={styles.careLabel}>Humidité</ThemedText>
              <ThemedText variant="body1" color="text">{plant.care.humidity}</ThemedText>
            </View>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <ThemedText variant="title" color="text" style={styles.sectionTitle}>
            Informations
          </ThemedText>
          
          <View style={styles.infoRow}>
            <ThemedText variant="body2" color="primary">Famille:</ThemedText>
            <ThemedText variant="body1" color="text">{plant.family}</ThemedText>
          </View>
          
          <View style={styles.infoRow}>
            <ThemedText variant="body2" color="primary">Origine:</ThemedText>
            <ThemedText variant="body1" color="text">{plant.origin}</ThemedText>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  mainImageContainer: {
    width: '100%',
    height: 250,
    marginBottom: 16,
    borderRadius: 16,
    marginHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  card: {
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  typeIndicator: {
    height: 4,
    width: '100%',
  },
  cardContent: {
    padding: 20,
  },
  plantName: {
    textAlign: 'center',
    marginBottom: 8,
  },
  scientificName: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  badges: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  description: {
    textAlign: 'center',
    lineHeight: 22,
  },
  sectionTitle: {
    padding: 20,
    paddingBottom: 16,
  },
  careGrid: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  careItem: {
    marginBottom: 12,
  },
  careLabel: {
    fontWeight: '600',
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
});