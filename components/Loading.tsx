import { useThemeColors } from '@/hooks/useThemeColors';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';

interface LoadingProps {
  message?: string;
}

export function Loading({ message = "Chargement..." }: LoadingProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <ThemedText variant="body1" color="textSecondary" style={styles.text}>
        {message}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    marginTop: 16,
    textAlign: 'center',
  },
});
