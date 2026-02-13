import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles, Brain, Activity, Zap } from 'lucide-react-native';
import { COLORS } from '../constants/theme';

const { width } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
    // Animation Values
    const fadeAnim = new Animated.Value(0);
    const scaleAnim = new Animated.Value(0.8);
    const rotateAnim = new Animated.Value(0);

    useEffect(() => {
        // Entrance Animation
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
                easing: Easing.out(Easing.ease),
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
                easing: Easing.out(Easing.back(1.5)),
            }),
        ]).start();

        // Continuous Rotation
        Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 4000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();

        // Navigate after delay
        const timer = setTimeout(() => {
            navigation.replace('Onboarding');
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#F3E8FF', '#FCE7F3', '#FFFFFF']} // Lighter background to match image
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            <View style={styles.centerContent}>
                {/* Rotating Logo */}
                <Animated.View
                    style={[
                        styles.logoWrapper,
                        {
                            opacity: fadeAnim,
                            transform: [{ scale: scaleAnim }, { rotate: spin }]
                        }
                    ]}
                >
                    <LinearGradient
                        colors={['#A855F7', '#EC4899']}
                        style={styles.logoGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Sparkles color="#fff" size={40} fill="#fff" />
                    </LinearGradient>

                    {/* Floating decorative icons */}
                    <View style={styles.floatingIconTop}>
                        <Brain size={20} color="#000" />
                    </View>
                    <View style={styles.floatingIconBottom}>
                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>B</Text>
                    </View>
                </Animated.View>

                <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
                    <Text style={styles.appName}>LearnFlow</Text>
                    <Text style={styles.tagline}>Your journey to mastery begins here</Text>

                    {/* Loading Pill */}
                    <View style={styles.loadingPill}>
                        <View style={styles.loadingBar} />
                        <Text style={styles.loadingText}>Loading amazing content...</Text>
                    </View>
                </Animated.View>
            </View>

            {/* Bottom Tags */}
            <Animated.View style={[styles.footer, { opacity: fadeAnim, transform: [{ translateY: Animated.multiply(fadeAnim, new Animated.Value(0)) }] }]}>
                <View style={styles.tagContainer}>
                    <View style={styles.tag}>
                        <Zap size={12} color="#000" style={{ marginRight: 4 }} />
                        <Text style={styles.tagText}>AI-Powered</Text>
                    </View>
                    <View style={styles.tag}>
                        <Activity size={12} color="#000" style={{ marginRight: 4 }} />
                        <Text style={styles.tagText}>Progress Tracking</Text>
                    </View>
                </View>
                <View style={[styles.tag, { marginTop: 10 }]}>
                    <Brain size={12} color="#000" style={{ marginRight: 4 }} />
                    <Text style={styles.tagText}>Interactive Learning</Text>
                </View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centerContent: {
        alignItems: 'center',
        marginBottom: 80,
    },
    logoWrapper: {
        width: 140,
        height: 140,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
    },
    logoGradient: {
        width: 100,
        height: 100,
        borderRadius: 30, // Squircle
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{ rotate: '15deg' }],
        shadowColor: "#A855F7",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    floatingIconTop: {
        position: 'absolute',
        top: 0,
        right: 10,
        backgroundColor: '#fff',
        padding: 8,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        elevation: 5,
    },
    floatingIconBottom: {
        position: 'absolute',
        bottom: 0,
        left: 20,
        backgroundColor: '#fff',
        padding: 8,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        elevation: 5,
    },
    appName: {
        fontSize: 42,
        fontWeight: '800',
        color: '#A855F7', // Purple
        marginBottom: 8,
    },
    tagline: {
        fontSize: 16,
        color: '#4B5563', // Gray-600
        marginBottom: 32,
    },
    loadingPill: {
        backgroundColor: 'rgba(255,255,255,0.6)',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 20,
        width: width * 0.8,
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 14,
        color: '#6B7280',
    },
    loadingBar: {
        height: 4,
        width: '100%',
        backgroundColor: '#E5E7EB',
        borderRadius: 2,
        marginBottom: 8,
        opacity: 0.5,
    },
    footer: {
        position: 'absolute',
        bottom: 60,
        width: '100%',
        alignItems: 'center',
    },
    tagContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    tagText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#1F2937',
    }
});

export default SplashScreen;
