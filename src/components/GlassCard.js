import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { SHADOWS, COLORS } from '../constants/theme';

const GlassCard = ({ children, style, intensity = 50, tint = 'light' }) => {
    return (
        <View style={[styles.container, SHADOWS.medium, style]}>
            <BlurView intensity={intensity} tint={tint} style={StyleSheet.absoluteFill} />
            <LinearGradient
                colors={['rgba(255, 255, 255, 0.6)', 'rgba(255, 255, 255, 0.2)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.border}
            />
            <View style={styles.content}>{children}</View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: 'rgba(255, 255, 255, 0.4)', // Fallback/Base
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    border: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 20,
        opacity: 0.5,
    },
    content: {
        padding: 16,
        zIndex: 1,
    },
});

export default GlassCard;
