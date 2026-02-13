import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/theme';
import GlassCard from '../components/GlassCard';

const ExploreScreen = () => {
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[COLORS.background, '#F3E8FF', '#FFFFFF']}
                style={StyleSheet.absoluteFill}
            />
            <View style={styles.content}>
                <GlassCard style={styles.card}>
                    <Text style={styles.text}>Explore Screen</Text>
                    <Text style={styles.subText}>Coming Soon</Text>
                </GlassCard>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        width: '80%',
    },
    card: {
        padding: 40,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 8,
    },
    subText: {
        fontSize: 16,
        color: COLORS.textSecondary,
    }
});

export default ExploreScreen;
