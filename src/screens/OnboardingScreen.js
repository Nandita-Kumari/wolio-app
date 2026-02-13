import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions, TouchableOpacity, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GraduationCap, Users, Sparkles, Lock } from 'lucide-react-native';
import { COLORS, SHADOWS, GRADIENTS } from '../constants/theme';

const { width } = Dimensions.get('window');

const RoleCard = ({ title, description, icon: Icon, selected, onPress, color }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.9}
            style={[
                styles.roleCard,
                selected && styles.roleCardSelected,
                selected && { borderColor: color }
            ]}
        >
            <View style={[styles.iconContainer, { backgroundColor: color }]}>
                <Icon color="#fff" size={24} />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.roleTitle}>{title}</Text>
                <Text style={styles.roleDescription}>{description}</Text>
            </View>
        </TouchableOpacity>
    );
};

const OnboardingScreen = ({ navigation }) => {
    const [role, setRole] = useState(null);
    const rotateAnim = new Animated.Value(0);

    useEffect(() => {
        Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 4000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const handleContinue = () => {
        if (role) {
            navigation.replace('Login');
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#F3E8FF', '#FCE7F3', '#FFFFFF']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            <SafeAreaView style={styles.safeArea}>

                {/* Header Section */}
                <View style={styles.header}>
                    <Animated.View style={[styles.logoContainer, { transform: [{ rotate: spin }] }]}>
                        <LinearGradient
                            colors={['#C084FC', '#A855F7', '#7E22CE']}
                            style={styles.logoGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <Sparkles color="#fff" size={40} style={{ transform: [{ rotate: '-15deg' }] }} />
                        </LinearGradient>
                    </Animated.View>

                    <Text style={styles.appName}>WOLIO</Text>
                    <Text style={styles.tagline}>New era. New learning.</Text>
                    <Text style={styles.subTagline}>Gateway to what's next.</Text>
                    <Text style={styles.microTagline}>Strong AI • Real-time • Future-proof</Text>
                </View>

                {/* Content Card */}
                <View style={styles.cardContainer}>
                    <View style={styles.card}>
                        <RoleCard
                            title="I am a Student"
                            description="Access your library, read books, and chat with AI"
                            icon={GraduationCap}
                            selected={role === 'student'}
                            onPress={() => setRole('student')}
                            color="#A855F7" // Purple
                        />

                        <RoleCard
                            title="I am a Parent"
                            description="Monitor your child's reading and set controls"
                            icon={Users}
                            selected={role === 'parent'}
                            onPress={() => setRole('parent')}
                            color="#6366F1" // Indigo/Blue
                        />

                        <View style={styles.spacer} />

                        <TouchableOpacity
                            onPress={handleContinue}
                            disabled={!role}
                            activeOpacity={0.8}
                            style={[
                                styles.button,
                                !role && styles.buttonDisabled
                            ]}
                        >
                            <LinearGradient
                                colors={role ? ['#D8B4FE', '#C084FC', '#E879F9'] : ['#E9D5FF', '#E9D5FF']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.buttonGradient}
                            >
                                <Text style={styles.buttonText}>
                                    {role ? `Continue as ${role === 'student' ? 'Student' : 'Parent'}` : 'Select a role to continue'}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Lock size={12} color="#6B7280" style={{ marginRight: 6 }} />
                    <Text style={styles.footerText}>Safe, secure, and designed for learning</Text>
                </View>

            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        alignItems: 'center',
        marginTop: 60,
        marginBottom: 40,
    },
    logoContainer: {
        marginBottom: 20,
        shadowColor: "#A855F7",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
    },
    logoGradient: {
        width: 80,
        height: 80,
        borderRadius: 28, // Squircle-ish
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{ rotate: '45deg' }],
    },
    appName: {
        fontSize: 32,
        fontWeight: '800',
        color: '#A855F7',
        marginBottom: 12,
        letterSpacing: 0.5,
    },
    tagline: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937', // Gray-800
        marginBottom: 4,
    },
    subTagline: {
        fontSize: 16,
        color: '#4B5563', // Gray-600
        marginBottom: 8,
    },
    microTagline: {
        fontSize: 12,
        color: '#6B7280', // Gray-500
        letterSpacing: 0.5,
    },
    cardContainer: {
        paddingHorizontal: 24,
        flex: 1,
        justifyContent: 'center', // Center vertically if space allows, or use scrollview for small screens
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 32,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    roleCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 2,
    },
    roleCardSelected: {
        backgroundColor: '#FAF5FF', // Very light purple
        borderWidth: 2,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    roleTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111',
        marginBottom: 4,
    },
    roleDescription: {
        fontSize: 12,
        color: '#6B7280',
        lineHeight: 16,
    },
    spacer: {
        height: 24,
    },
    button: {
        height: 56,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: "#A855F7",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonDisabled: {
        shadowOpacity: 0,
        elevation: 0,
    },
    buttonGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
        marginTop: 20,
    },
    footerText: {
        fontSize: 12,
        color: '#6B7280',
    }
});

export default OnboardingScreen;
