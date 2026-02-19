import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Dimensions,
    TouchableOpacity,
    Platform,
    ScrollView,
    Animated,
    Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BookOpen, Users, Sparkles, Lock, ChevronRight } from 'lucide-react-native';
import { useUser } from '../context/UserContext';

const { width } = Dimensions.get('window');

const RoleCard = ({ title, description, icon: Icon, gradientColors, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={styles.roleCardWrap}>
            <View style={styles.roleCard}>
                <View style={styles.roleCardInner}>
                    <LinearGradient
                    colors={gradientColors}
                    style={styles.roleIconGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <Icon color="#fff" size={24} strokeWidth={2} />
                </LinearGradient>
                <View style={styles.roleTextWrap}>
                    <Text style={styles.roleTitle}>{title}</Text>
                    <Text style={styles.roleDescription}>{description}</Text>
                </View>
                    <ChevronRight size={22} color="#A855F7" strokeWidth={2.5} />
                </View>
            </View>
        </TouchableOpacity>
    );
};

const OnboardingScreen = ({ navigation }) => {
    const { completeOnboarding } = useUser();
    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(rotateAnim, {
                    toValue: 1,
                    duration: 4000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.timing(rotateAnim, {
                    toValue: 0,
                    duration: 0,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const handleRoleSelect = async (role) => {
        await completeOnboarding(role);
        navigation.replace('Main');
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#F8F7FA', '#F5F3FF', '#FAF5FF', '#FFFFFF']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            <SafeAreaView style={styles.safeArea}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header - directly on gradient background */}
                    <View style={styles.header}>
                            <Animated.View style={[styles.logoWrap, { transform: [{ rotate: spin }] }]}>
                                <LinearGradient
                                    colors={['#C084FC', '#A855F7', '#EC4899']}
                                    style={styles.logoGradient}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                >
                                    <Sparkles color="#fff" size={36} fill="#fff" strokeWidth={1.5} />
                                </LinearGradient>
                            </Animated.View>
                            <Text style={styles.appName}>WOLIO</Text>
                            <Text style={styles.tagline}>New era. New learning.</Text>
                            <Text style={styles.subTagline}>Gateway to what's next.</Text>
                            <Text style={styles.microTagline}>Strong AI • Real-time • Future-proof</Text>
                        </View>

                    {/* Role cards - only these have card styling with gradient glow */}
                    <View style={styles.roleSection}>
                        <RoleCard
                                title="I am a Learner"
                                description="Access your library, read books, and chat with AI"
                                icon={BookOpen}
                                gradientColors={['#A855F7', '#C084FC', '#EC4899']}
                                onPress={() => handleRoleSelect('student')}
                            />
                            <RoleCard
                                title="I am a Parent"
                                description="Monitor your children's progress and activity"
                                icon={Users}
                                gradientColors={['#EC4899', '#F97316', '#FB923C']}
                                onPress={() => handleRoleSelect('parent')}
                            />
                    </View>

                    {/* Footer - security */}
                    <View style={styles.footer}>
                        <Lock size={14} color="#9CA3AF" style={{ marginRight: 6 }} />
                        <Text style={styles.footerText}>Safe, secure, and designed for learning</Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F7FA',
    },
    safeArea: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 40,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 36,
    },
    logoWrap: {
        marginBottom: 20,
    },
    logoGradient: {
        width: 72,
        height: 72,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    appName: {
        fontSize: 28,
        fontWeight: '800',
        color: '#7C3AED',
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    tagline: {
        fontSize: 16,
        fontWeight: '700',
        color: '#374151',
        marginBottom: 4,
    },
    subTagline: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 6,
    },
    microTagline: {
        fontSize: 12,
        color: '#9CA3AF',
        letterSpacing: 0.3,
    },
    roleSection: {
        marginBottom: 32,
    },
    roleCardWrap: {
        marginBottom: 14,
    },
    roleCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        ...Platform.select({
            ios: {
                shadowColor: '#A855F7',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 12,
            },
            android: { elevation: 4 },
        }),
    },
    roleCardInner: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    roleIconGradient: {
        width: 48,
        height: 48,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    roleTextWrap: {
        flex: 1,
    },
    roleTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 4,
    },
    roleDescription: {
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 18,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
        color: '#9CA3AF',
    },
});

export default OnboardingScreen;
