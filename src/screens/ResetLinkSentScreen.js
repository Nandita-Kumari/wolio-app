import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Sparkles, Check } from 'lucide-react-native';
import { COLORS, SHADOWS, GRADIENTS } from '../constants/theme';

const ResetLinkSentScreen = ({ navigation, route }) => {
    const email = route?.params?.email ?? 'your email';
    const role = route?.params?.role ?? 'Parent';

    const handleBackToLogin = () => {
        navigation.navigate('Login');
    };

    const handleResend = () => {
        // In real app: trigger resend API, then show toast
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[COLORS.background, '#F3E8FF', '#FFFFFF']}
                style={StyleSheet.absoluteFill}
            />
            <View style={styles.glowWrap}>
                <LinearGradient
                    colors={['rgba(168, 85, 247, 0.25)', 'rgba(236, 72, 153, 0.2)', 'transparent']}
                    style={styles.glow}
                />
            </View>
            <SafeAreaView style={styles.safeArea}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Top bar */}
                    <View style={styles.topBar}>
                        <TouchableOpacity
                            style={styles.backBtn}
                            onPress={handleBackToLogin}
                            activeOpacity={0.7}
                        >
                            <ArrowLeft size={22} color={COLORS.text} />
                            <Text style={styles.backText}>Back to Login</Text>
                        </TouchableOpacity>
                        <View style={styles.roleTag}>
                            <Text style={styles.roleTagText}>{role}</Text>
                        </View>
                    </View>

                    {/* Success toast */}
                    <View style={styles.toast}>
                        <View style={styles.toastIconWrap}>
                            <Check size={18} color="#fff" strokeWidth={2.5} />
                        </View>
                        <Text style={styles.toastText}>
                            Reset link sent! Check your inbox at {email}
                        </Text>
                    </View>

                    {/* Header: Forgot Password? + subtitle */}
                    <View style={styles.header}>
                        <View style={styles.titleRow}>
                            <Text style={styles.title}>Forgot Password?</Text>
                            <View style={styles.starWrap}>
                                <Sparkles size={20} color={COLORS.primary} />
                            </View>
                        </View>
                        <Text style={styles.subtitle}>Check your email for the reset link</Text>
                    </View>

                    {/* White card: success content */}
                    <View style={styles.card}>
                        <View style={styles.successIconWrap}>
                            <Check size={48} color="#fff" strokeWidth={2.5} />
                        </View>
                        <Text style={styles.cardTitle}>Email Sent!</Text>
                        <Text style={styles.cardMessage}>
                            We've sent a password reset link to{' '}
                            <Text style={styles.emailHighlight}>{email}</Text>
                        </Text>

                        <Text style={styles.nextStepsTitle}>Next steps:</Text>
                        <View style={styles.stepRow}>
                            <Text style={styles.stepNum}>1.</Text>
                            <Text style={styles.stepText}>Check your email inbox (and spam folder)</Text>
                        </View>
                        <View style={styles.stepRow}>
                            <Text style={styles.stepNum}>2.</Text>
                            <Text style={styles.stepText}>Click the reset link in the email</Text>
                        </View>
                        <View style={styles.stepRow}>
                            <Text style={styles.stepNum}>3.</Text>
                            <Text style={styles.stepText}>Create your new password</Text>
                        </View>

                        <Text style={styles.expiryText}>Link expires in 1 hour</Text>

                        <TouchableOpacity
                            style={styles.createPasswordButton}
                            onPress={() =>
                                navigation.navigate('ResetPassword', { email, role })
                            }
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={GRADIENTS.primary}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.createPasswordGradient}
                            >
                                <Text style={styles.createPasswordButtonText}>Create new password</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.backToLoginButton}
                            onPress={handleBackToLogin}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.backToLoginButtonText}>Back to Login</Text>
                        </TouchableOpacity>

                        <View style={styles.resendRow}>
                            <Text style={styles.resendPrompt}>Didn't receive the email? </Text>
                            <TouchableOpacity onPress={handleResend} activeOpacity={0.7}>
                                <Text style={styles.resendLink}>Resend</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.bottomSpacer} />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    glowWrap: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
    },
    glow: {
        position: 'absolute',
        width: 260,
        height: 260,
        borderRadius: 130,
        top: -60,
        alignSelf: 'center',
    },
    safeArea: { flex: 1 },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 8,
        paddingBottom: 40,
    },

    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    backBtn: { flexDirection: 'row', alignItems: 'center' },
    backText: {
        fontSize: 16,
        color: COLORS.text,
        marginLeft: 6,
        fontWeight: '500',
    },
    roleTag: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
        backgroundColor: COLORS.primary,
        borderWidth: 1,
        borderColor: COLORS.secondary,
    },
    roleTagText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#FFFFFF',
    },

    toast: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0FDF4',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 14,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(34, 197, 94, 0.3)',
    },
    toastIconWrap: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: COLORS.success,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    toastText: {
        flex: 1,
        fontSize: 14,
        color: COLORS.text,
        fontWeight: '500',
    },

    header: {
        marginBottom: 24,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        color: COLORS.primary,
    },
    starWrap: { marginLeft: 8 },
    subtitle: {
        fontSize: 15,
        color: COLORS.textSecondary,
    },

    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 28,
        ...SHADOWS.medium,
    },
    successIconWrap: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.success,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 20,
    },
    cardTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: COLORS.text,
        textAlign: 'center',
        marginBottom: 10,
    },
    cardMessage: {
        fontSize: 15,
        color: COLORS.text,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
    },
    emailHighlight: {
        color: COLORS.primary,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
    nextStepsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 12,
    },
    stepRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    stepNum: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.text,
        width: 24,
    },
    stepText: {
        flex: 1,
        fontSize: 15,
        color: COLORS.text,
        lineHeight: 22,
    },
    expiryText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginTop: 8,
        marginBottom: 20,
    },
    createPasswordButton: {
        height: 54,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 12,
        ...SHADOWS.medium,
    },
    createPasswordGradient: {
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    createPasswordButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    backToLoginButton: {
        height: 54,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    backToLoginButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.primary,
    },
    resendRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    resendPrompt: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    resendLink: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.primary,
    },
    bottomSpacer: { height: 24 },
});

export default ResetLinkSentScreen;
