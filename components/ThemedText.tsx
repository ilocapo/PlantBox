import { useThemeColors } from '@/hooks/useThemeColors';
import { StyleSheet, Text, TextProps } from 'react-native';

type ThemeColors = ReturnType<typeof useThemeColors>;
type ColorKeys = keyof ThemeColors;

type Props = TextProps & {
    variant?: keyof typeof styles,
    color?: ColorKeys
}

export function ThemedText({variant, color, ...rest} : Props) {
    const colors = useThemeColors();
    return (
        <Text
            style={[
                styles[variant ?? 'body3'],
                { color: colors[color ?? 'text'] }
            ]}
            {...rest}
        />
    );
}

const styles = StyleSheet.create({
  headline: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2E7D32',
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
  body1: {
    fontSize: 16,
    color: '#333',
  },
  body2: {
    fontSize: 14,
    color: '#666',
  },
  body3: {
    fontSize: 12,
    color: '#999',
  },
})