import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GraduationCap, Users, Sparkles, Check } from 'lucide-react-native';
import { COLORS, SHADOWS, GRADIENTS } from '../constants/theme';
import GlassCard from '../components/GlassCard';
import GradientButton from '../components/GradientButton';

const { width } = Dimensions.get('window');

const RoleCard = ({ title, description, icon: Icon, selected, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={{ marginBottom: 16 }}>
            <GlassCard
                style={[
                    styles.roleCard,
                    selected && { borderColor: COLORS.primary, borderWidth: 2 }
                ]}
                intensity={selected ? 60 : 40}
            >
                <View style={styles.roleCardContent}>
                    <View style={[styles.iconContainer, { backgroundColor: selected ? COLORS.primary : '#8B5CF6' }]}>
                        <Icon color="#fff" size={24} />
                    </View>
                    <View style={styles.roleTextContainer}>
                        <Text style={styles.roleTitle}>{title}</Text>
                        <Text style={styles.roleDescription}>{description}</Text>
                    </View>
                    {selected && (
                        <View style={styles.checkCircle}>
                            <Check size={16} color="#fff" />
                        </View>
                    )}
                </View>
            </GlassCard>
        </TouchableOpacity>
    );
};

const OnboardingScreen = ({ navigation }) => {
    const [role, setRole] = useState('student'); // 'student' or 'parent'

    const handleContinue = () => {
        // Navigate to Dashboard or Main App
        // For now, let's assume we have a 'Main' stack
        navigation.replace('Main');
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[COLORS.background, '#FBCFE8', '#F3E8FF']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <LinearGradient
                        colors={GRADIENTS.primary}
                        style={styles.logoContainer}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Sparkles color="#fff" size={32} />
                    </LinearGradient>

                    <Text style={styles.appName}>WOLIO</Text>
                    <Text style={styles.tagline}>New era. New learning.</Text>
                    <Text style={styles.subTagline}>Gateway to what's next.</Text>
                    <Text style={styles.microTagline}>Strong AI • Real-time • Future-proof</Text>
                </View>

                <View style={styles.content}>
                    <GlassCard style={styles.cardContainer} intensity={30}>
                        <RoleCard
                            title="I am a Student"
                            description="Access your library, read books, and chat with AI"
                            icon={GraduationCap}
                            selected={role === 'student'}
                            onPress={() => setRole('student')}
                        />
                        <RoleCard
                            title="I am a Parent"
                            description="Monitor your child's reading and set controls"
                            icon={Users}
                            selected={role === 'parent'}
                            onPress={() => setRole('parent')}
                        />

                        <View style={styles.spacer} />

                        <GradientButton
                            title={`Continue as ${role === 'student' ? 'Student' : 'Parent'}`}
                            onPress={handleContinue}
                            icon={<View style={{ transform: [{ rotate: '-45deg' }] }}><Text style={{ color: '#fff' }}>→</Text></View>} // Simple arrow for now or import ArrowRight
                        />
                    </GlassCard>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>🔒 Safe, secure, and designed for learning</Text>
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
        marginHorizontal: 24,
    },
    header: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 40,
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        ...SHADOWS.medium,
    },
    appName: {
        fontSize: 32,
        fontWeight: '800',
        color: '#9333EA', // Darker purple
        marginBottom: 8,
    },
    tagline: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 4,
    },
    subTagline: {
        fontSize: 16,
        color: '#4B5563',
        marginBottom: 8,
    },
    microTagline: {
        fontSize: 12,
        color: '#6B7280',
        letterSpacing: 0.5,
    },
    content: {
        flex: 1,
    },
    cardContainer: {
        padding: 24,
        borderRadius: 32,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    roleCard: {
        borderRadius: 24,
        backgroundColor: '#fff',
    },
    roleCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    roleTextContainer: {
        flex: 1,
    },
    roleTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },
    roleDescription: {
        fontSize: 12,
        color: '#6B7280',
        lineHeight: 16,
    },
    checkCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    spacer: {
        height: 24,
    },
    footer: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
        color: '#6B7280',
    }
});

export default OnboardingScreen;
