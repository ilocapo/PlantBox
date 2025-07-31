import { DailyPlantModal } from "@/components/DailyPlantModal";
import { Loading } from "@/components/Loading";
import { PlantCard } from "@/components/PlantCard";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColors } from "@/hooks/useThemeColors";
import { DailyPlant, Plant, plantApi } from "@/services/plantApi";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dailyPlant, setDailyPlant] = useState<DailyPlant | null>(null);
  const [showDailyPlant, setShowDailyPlant] = useState(false);
  const colors = useThemeColors();

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      setLoading(true);
      
      // Charger les plantes du Pokédex
      await loadPokedexPlants();
      
      // Vérifier s'il y a une nouvelle plante du jour
      const hasNewDailyPlant = await plantApi.isNewDailyPlantAvailable();
      if (hasNewDailyPlant) {
        const daily = await plantApi.getDailyPlant();
        setDailyPlant(daily);
        setShowDailyPlant(true);
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPokedexPlants = async () => {
    try {
      const data = await plantApi.getPokedexPlants();
      setPlants(data);
    } catch (error) {
      console.error('Erreur lors du chargement du Pokédex:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPokedexPlants();
    setRefreshing(false);
  };

  const handleAddToPokedex = async () => {
    if (dailyPlant) {
      await plantApi.addToPokedex(dailyPlant.plant);
      await plantApi.markDailyPlantAsSeen();
      await loadPokedexPlants();
      setShowDailyPlant(false);
    }
  };

  const handleSkipDailyPlant = async () => {
    await plantApi.markDailyPlantAsSeen();
    setShowDailyPlant(false);
  };

  const handlePlantPress = (plantId: number) => {
    router.push(`/plant/${plantId}`);
  };

  const checkForNewDailyPlant = async () => {
    const hasNewDailyPlant = await plantApi.isNewDailyPlantAvailable();
    if (hasNewDailyPlant) {
      const daily = await plantApi.getDailyPlant();
      setDailyPlant(daily);
      setShowDailyPlant(true);
    }
  };

  if (loading) {
    return <Loading message="Chargement de votre Pokédex..." />;
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <ThemedText variant="headline" color="primary">PlantBox</ThemedText>
          <ThemedText variant="body1" color="textSecondary" style={styles.subtitle}>
            Mon Pokédex Personnel
          </ThemedText>
          <ThemedText variant="body2" color="textTertiary" style={styles.count}>
            {plants.length} plante{plants.length !== 1 ? 's' : ''} découverte{plants.length !== 1 ? 's' : ''}
          </ThemedText>
        </View>

        {plants.length === 0 ? (
          <View style={styles.emptyState}>
            <ThemedText variant="title" color="textSecondary" style={styles.emptyTitle}>
              🌱 Votre Pokédex est vide
            </ThemedText>
            <ThemedText variant="body1" color="textTertiary" style={styles.emptyMessage}>
              Découvrez une nouvelle plante chaque jour !
            </ThemedText>
            <TouchableOpacity 
              style={[styles.dailyButton, { backgroundColor: colors.primary }]}
              onPress={checkForNewDailyPlant}
            >
              <ThemedText style={styles.dailyButtonText}>
                ✨ Voir la plante du jour
              </ThemedText>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.actions}>
              <TouchableOpacity 
                style={[styles.dailyButton, { backgroundColor: colors.primary }]}
                onPress={checkForNewDailyPlant}
              >
                <ThemedText style={styles.dailyButtonText}>
                  ✨ Plante du jour
                </ThemedText>
              </TouchableOpacity>
            </View>

            <FlatList
              data={plants}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <PlantCard 
                  plant={item} 
                  onPress={() => handlePlantPress(item.id)}
                />
              )}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor={colors.primary}
                />
              }
            />
          </>
        )}
      </SafeAreaView>

      {dailyPlant && (
        <DailyPlantModal
          plant={dailyPlant.plant}
          visible={showDailyPlant}
          onAddToPokedex={handleAddToPokedex}
          onSkip={handleSkipDailyPlant}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  subtitle: {
    marginTop: 8,
    textAlign: 'center',
  },
  count: {
    marginTop: 4,
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    textAlign: 'center',
    marginBottom: 12,
  },
  emptyMessage: {
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  actions: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  dailyButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  dailyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 20,
  },
});