import React from 'react';
import { StyleSheet, View } from 'react-native';

interface PlantIconProps {
  size?: number;
  color?: string;
}

export function PlantIcon({ size = 100, color = '#4CAF50' }: PlantIconProps) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={[styles.pot, { 
        backgroundColor: '#8D6E63',
        width: size * 0.6,
        height: size * 0.3,
        borderRadius: size * 0.1,
      }]} />
      
      <View style={[styles.stem, {
        backgroundColor: color,
        width: size * 0.08,
        height: size * 0.4,
        borderRadius: size * 0.04,
      }]} />
      
      <View style={[styles.leafLeft, {
        backgroundColor: color,
        width: size * 0.25,
        height: size * 0.35,
        borderRadius: size * 0.125,
      }]} />
      
      <View style={[styles.leafRight, {
        backgroundColor: color,
        width: size * 0.25,
        height: size * 0.35,
        borderRadius: size * 0.125,
      }]} />
      
      <View style={[styles.leafTop, {
        backgroundColor: color,
        width: size * 0.2,
        height: size * 0.3,
        borderRadius: size * 0.1,
      }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  pot: {
    position: 'absolute',
    bottom: 0,
    zIndex: 1,
  },
  stem: {
    position: 'absolute',
    bottom: '25%',
    zIndex: 2,
  },
  leafLeft: {
    position: 'absolute',
    bottom: '35%',
    left: '20%',
    transform: [{ rotate: '-25deg' }],
    zIndex: 3,
  },
  leafRight: {
    position: 'absolute',
    bottom: '35%',
    right: '20%',
    transform: [{ rotate: '25deg' }],
    zIndex: 3,
  },
  leafTop: {
    position: 'absolute',
    bottom: '60%',
    zIndex: 4,
    transform: [{ rotate: '5deg' }],
  },
});
