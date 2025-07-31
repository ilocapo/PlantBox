import { Colors } from "@/constants/Colors";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Plant } from "@/services/plantApi";
import { StyleSheet, TouchableOpacity, TouchableOpacityProps, View } from "react-native";
import { PlantIcon } from "./PlantIcon";
import { ThemedText } from "./ThemedText";

type Props = TouchableOpacityProps & {
  plant: Plant;
  onPress?: () => void;
}

export function PlantCard({ plant, onPress, style, ...rest }: Props) {
  const colors = useThemeColors();
  const plantTypeColor = Colors.types[plant.type as keyof typeof Colors.types];

  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: colors.surface }, style]} 
      onPress={onPress}
      activeOpacity={0.7}
      {...rest}
    >
      <View style={[styles.typeIndicator, { backgroundColor: plantTypeColor.primary }]} />
      
      <View style={styles.imageContainer}>
        <PlantIcon 
          size={80}
          color={plantTypeColor.primary}
        />
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <ThemedText variant="title" color="text">{plant.name}</ThemedText>
          <ThemedText variant="body2" color="textSecondary">{plant.scientificName}</ThemedText>
        </View>
        
        <View style={styles.footer}>
          <View style={[styles.difficultyBadge, { 
            backgroundColor: plant.difficulty === 'Easy' ? '#4CAF50' : 
                           plant.difficulty === 'Medium' ? '#FF9800' : '#F44336' 
          }]}>
            <ThemedText style={styles.difficultyText}>{plant.difficulty}</ThemedText>
          </View>
          
          <ThemedText variant="body2" color="textTertiary">{plant.type}</ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginVertical: 8,
    marginHorizontal: 16,
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
  imageContainer: {
    width: '100%',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});