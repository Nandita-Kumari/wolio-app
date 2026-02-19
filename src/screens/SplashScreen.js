import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, Easing, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Sparkles, BookOpen, Star, Trophy } from 'lucide-react-native';
import { COLORS } from '../constants/theme';

const { width } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
                easing: Easing.out(Easing.ease),
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
                easing: Easing.out(Easing.back(1.2)),
            }),
        ]).start();

        Animated.timing(progressAnim, {
            toValue: 1,
            duration: 2500,
            useNativeDriver: false,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }).start();

        const timer = setTimeout(() => {
            navigation.replace('Onboarding');
        }, 3200);
        return () => clearTimeout(timer);
    }, []);

    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, width * 0.78],
    });

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#F3E8FF', '#F5F0FA', '#FAF5F8', '#FDF2F8']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            {/* Decorative: top-left book */}
            <Animated.View style={[styles.decorTopLeft, { opacity: fadeAnim }]}>
                <View style={styles.decorIconBox}>
                    <BookOpen size={28} color="rgba(0,0,0,0.15)" strokeWidth={1.5} />
                </View>
            </Animated.View>

            {/* Decorative: top-right star */}
            <Animated.View style={[styles.decorTopRight, { opacity: fadeAnim }]}>
                <View style={styles.decorIconCircle}>
                    <Star size={24} color="rgba(100,100,100,0.2)" strokeWidth={1.5} />
                </View>
            </Animated.View>

            {/* Decorative: bottom-left trophy */}
            <Animated.View style={[styles.decorBottomLeft, { opacity: fadeAnim }]}>
                <View style={styles.decorIconCircle}>
                    <Trophy size={28} color="rgba(236,72,153,0.25)" strokeWidth={1.5} />
                </View>
            </Animated.View>

            {/* Main content */}
            <Animated.View style={[styles.centerContent, { opacity: fadeAnim }]}>
                {/* Logo: frosted glass rounded square with gradient + star + spark */}
                <Animated.View style={[styles.logoWrapper, { transform: [{ scale: scaleAnim }] }]}>
                    <View style={styles.logoOuter}>
                        <BlurView intensity={40} tint="light" style={styles.logoBlur} />
                        <LinearGradient
                            colors={['#C084FC', '#A855F7', '#EC4899']}
                            style={styles.logoGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <Sparkles size={44} color="#fff" fill="#fff" strokeWidth={1.5} />
                        </LinearGradient>
                    </View>
                </Animated.View>

                {/* App name: Learn (purple) + Flow (magenta) */}
                <View style={styles.appNameRow}>
                    <Text style={styles.appNameLearn}>Learn</Text>
                    <Text style={styles.appNameFlow}>Flow</Text>
                </View>

                <Text style={styles.tagline}>Your journey to mastery begins here</Text>

                {/* Feature tags: AI-Powered | Interactive | Personalized */}
                <View style={styles.tagRow}>
                    <View style={styles.tag}>
                        <Text style={styles.tagText}>AI-Powered</Text>
                    </View>
                    <View style={styles.tag}>
                        <Text style={styles.tagText}>Interactive</Text>
                    </View>
                    <View style={styles.tag}>
                        <Text style={styles.tagText}>Personalized</Text>
                    </View>
                </View>

                {/* Loading section */}
                <View style={styles.loadingSection}>
                    <View style={styles.loadingHeader}>
                        <Star size={18} color={COLORS.primary} fill={COLORS.primary} />
                        <Text style={styles.loadingLabel}>Loading your experience ...</Text>
                    </View>
                    <View style={styles.progressBarTrack}>
                        <Animated.View style={[styles.progressBarWrap, { width: progressWidth }]}>
                            <LinearGradient
                                colors={['#A855F7', '#EC4899']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={StyleSheet.absoluteFill}
                            />
                        </Animated.View>
                    </View>
                    <Text style={styles.progressPercent}>100%</Text>
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
    decorTopLeft: {
        position: 'absolute',
        top: '12%',
        left: '8%',
    },
    decorTopRight: {
        position: 'absolute',
        top: '14%',
        right: '10%',
    },
    decorBottomLeft: {
        position: 'absolute',
        bottom: '18%',
        left: '10%',
    },
    decorIconBox: {
        width: 56,
        height: 56,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
            },
            android: { elevation: 3 },
        }),
    },
    decorIconCircle: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: 'rgba(255,255,255,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
            },
            android: { elevation: 3 },
        }),
    },
    centerContent: {
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    logoWrapper: {
        marginBottom: 28,
    },
    logoOuter: {
        width: 120,
        height: 120,
        borderRadius: 28,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#A855F7',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.25,
                shadowRadius: 16,
            },
            android: { elevation: 12 },
        }),
    },
    logoBlur: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 28,
    },
    logoGradient: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    appNameRow: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        marginBottom: 8,
    },
    appNameLearn: {
        fontSize: 40,
        fontWeight: '800',
        color: '#7C3AED',
    },
    appNameFlow: {
        fontSize: 40,
        fontWeight: '800',
        color: '#EC4899',
    },
    tagline: {
        fontSize: 15,
        color: '#9CA3AF',
        marginBottom: 28,
    },
    tagRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 40,
    },
    tag: {
        backgroundColor: 'rgba(255,255,255,0.85)',
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 24,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 6,
            },
            android: { elevation: 2 },
        }),
    },
    tagText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#E11D48',
    },
    loadingSection: {
        width: width * 0.78,
        alignItems: 'center',
    },
    loadingHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        gap: 8,
    },
    loadingLabel: {
        fontSize: 14,
        color: '#9CA3AF',
    },
    progressBarTrack: {
        width: '100%',
        height: 8,
        borderRadius: 4,
        backgroundColor: '#E5E7EB',
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressBarWrap: {
        height: '100%',
        borderRadius: 4,
        overflow: 'hidden',
        minWidth: 0,
    },
    progressPercent: {
        fontSize: 16,
        fontWeight: '700',
        color: '#7C3AED',
    },
});

export default SplashScreen;
