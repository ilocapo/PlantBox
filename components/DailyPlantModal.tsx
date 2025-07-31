import { Colors } from '@/constants/Colors';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Plant } from '@/services/plantApi';
import { useState } from 'react';
import { Alert, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { PlantIcon } from './PlantIcon';
import { ThemedText } from './ThemedText';

interface DailyPlantModalProps {
  plant: Plant;
  visible: boolean;
  onAddToPokedex: () => void;
  onSkip: () => void;
}

export function DailyPlantModal({ plant, visible, onAddToPokedex, onSkip }: DailyPlantModalProps) {
  const colors = useThemeColors();
  const plantTypeColor = Colors.types[plant.type as keyof typeof Colors.types];
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToPokedex = async () => {
    setIsLoading(true);
    try {
      await onAddToPokedex();
      Alert.alert(
        "🎉 Félicitations !",
        `${plant.name} a été ajouté à votre Pokédex !`,
        [{ text: "Super !", style: "default" }]
      );
    } catch (error) {
      Alert.alert(
        "Erreur",
        "Impossible d'ajouter la plante au Pokédex",
        [{ text: "OK", style: "default" }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    Alert.alert(
      "Passer cette plante ?",
      "Vous pourrez découvrir une nouvelle plante demain !",
      [
        { text: "Annuler", style: "cancel" },
        { text: "Passer", style: "destructive", onPress: onSkip }
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <View style={[styles.badge, { backgroundColor: plantTypeColor.light }]}>
            <ThemedText style={[styles.badgeText, { color: plantTypeColor.dark }]}>
              Plante du Jour
            </ThemedText>
          </View>
          
          <ThemedText variant="headline" color="primary" style={styles.title}>
            Nouvelle Découverte !
          </ThemedText>
          
          <ThemedText variant="body1" color="textSecondary" style={styles.subtitle}>
            {new Date().toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </ThemedText>
        </View>

        <View style={[styles.plantCard, { backgroundColor: colors.surface }]}>
          <View style={[styles.typeIndicator, { backgroundColor: plantTypeColor.primary }]} />
          
          <View style={styles.plantImageContainer}>
            <PlantIcon 
              size={120}
              color={plantTypeColor.primary}
            />
          </View>
          
          <View style={styles.plantInfo}>
            <ThemedText variant="title" color="text" style={styles.plantName}>
              {plant.name}
            </ThemedText>
            
            <ThemedText variant="body2" color="textSecondary" style={styles.scientificName}>
              {plant.scientificName}
            </ThemedText>
            
            <View style={styles.plantMeta}>
              <View style={[styles.metaBadge, { backgroundColor: plantTypeColor.light }]}>
                <ThemedText style={[styles.metaText, { color: plantTypeColor.dark }]}>
                  {plant.type}
                </ThemedText>
              </View>
              
              <View style={[styles.metaBadge, { 
                backgroundColor: plant.difficulty === 'Easy' ? '#E8F5E8' : 
                               plant.difficulty === 'Medium' ? '#FFF3E0' : '#FFEBEE' 
              }]}>
                <ThemedText style={[styles.metaText, { 
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
            
            <View style={styles.careSection}>
              <ThemedText variant="body2" color="primary" style={styles.careTitle}>
                💡 Conseil du jour
              </ThemedText>
              <ThemedText variant="body2" color="textSecondary">
                Arrosage : {plant.care.water}
              </ThemedText>
              <ThemedText variant="body2" color="textSecondary">
                Lumière : {plant.care.light}
              </ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.skipButton, { borderColor: colors.border }]}
            onPress={handleSkip}
            disabled={isLoading}
          >
            <ThemedText variant="body1" color="textSecondary">
              Passer
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={handleAddToPokedex}
            disabled={isLoading}
          >
            <ThemedText style={styles.addButtonText}>
              {isLoading ? "Ajout..." : "🌱 Ajouter au Pokédex"}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  plantCard: {
    borderRadius: 20,
    overflow: 'hidden',
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  typeIndicator: {
    height: 6,
    width: '100%',
  },
  plantImageContainer: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  plantInfo: {
    padding: 20,
    flex: 1,
  },
  plantName: {
    textAlign: 'center',
    marginBottom: 4,
  },
  scientificName: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  plantMeta: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  metaBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  description: {
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  careSection: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginTop: 'auto',
  },
  careTitle: {
    fontWeight: '600',
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    paddingBottom: 20,
  },
  skipButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
  },
  addButton: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
