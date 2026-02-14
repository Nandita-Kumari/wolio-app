import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Mail, Sparkles } from 'lucide-react-native';
import { COLORS, SHADOWS, GRADIENTS } from '../constants/theme';

const ForgotPasswordScreen = ({ navigation, route }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const role = route?.params?.role ?? 'Parent';

    const handleSendReset = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            navigation.replace('ResetLinkSent', {
                email: email.trim() || 'your email',
                role,
            });
        }, 1200);
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[COLORS.background, '#F3E8FF', '#FFFFFF']}
                style={StyleSheet.absoluteFill}
            />
            <View style={styles.glowWrap}>
                <LinearGradient
                    colors={['rgba(168, 85, 247, 0.2)', 'rgba(236, 72, 153, 0.15)', 'transparent']}
                    style={styles.glow}
                />
            </View>
            <SafeAreaView style={styles.safeArea}>
                <KeyboardAvoidingView
                    style={styles.keyboardView}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Top bar: Back to Login | Role tag */}
                        <View style={styles.topBar}>
                            <TouchableOpacity
                                style={styles.backBtn}
                                onPress={() => navigation.goBack()}
                                activeOpacity={0.7}
                            >
                                <ArrowLeft size={22} color={COLORS.text} />
                                <Text style={styles.backText}>Back to Login</Text>
                            </TouchableOpacity>
                            <View style={styles.roleTag}>
                                <Text style={styles.roleTagText}>{role}</Text>
                            </View>
                        </View>

                        {/* Icon + title + subtitle */}
                        <View style={styles.header}>
                            <View style={styles.iconWrap}>
                                <LinearGradient
                                    colors={GRADIENTS.primary}
                                    style={styles.iconGradient}
                                >
                                    <Sparkles color="#fff" size={32} />
                                </LinearGradient>
                            </View>
                            <Text style={styles.title}>Forgot Password?</Text>
                            <Text style={styles.subtitle}>
                                No worries, we'll send you reset instructions
                            </Text>
                        </View>

                        {/* White card: email input */}
                        <View style={styles.card}>
                            <Text style={styles.label}>Email Address</Text>
                            <View style={styles.inputContainer}>
                                <Mail
                                    size={20}
                                    color={COLORS.textSecondary}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="jordan@example.com"
                                    placeholderTextColor={COLORS.textSecondary}
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                />
                            </View>
                            <Text style={styles.hint}>
                                We'll send a password reset link to this email
                            </Text>

                            <TouchableOpacity
                                style={[styles.sendButton, SHADOWS.medium]}
                                onPress={handleSendReset}
                                disabled={loading}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={GRADIENTS.primary}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.sendButtonGradient}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <>
                                            <Mail size={20} color="#fff" />
                                            <Text style={styles.sendButtonText}>Send Reset Link</Text>
                                        </>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>

                        {/* Footer */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Remember your password? </Text>
                            <TouchableOpacity
                                onPress={() => navigation.goBack()}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.loginLink}>Login</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
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
        width: 220,
        height: 220,
        borderRadius: 110,
        top: -40,
        left: -60,
    },
    safeArea: { flex: 1 },
    keyboardView: { flex: 1 },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 8,
        paddingBottom: 40,
    },

    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
    },
    backBtn: {
        flexDirection: 'row',
        alignItems: 'center',
    },
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

    header: {
        alignItems: 'center',
        marginBottom: 28,
    },
    iconWrap: {
        borderRadius: 18,
        overflow: 'hidden',
        marginBottom: 20,
        ...SHADOWS.medium,
    },
    iconGradient: {
        width: 72,
        height: 72,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        color: COLORS.primary,
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 15,
        color: COLORS.textSecondary,
        textAlign: 'center',
    },

    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        ...SHADOWS.medium,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        paddingHorizontal: 14,
        height: 52,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginBottom: 10,
    },
    inputIcon: { marginRight: 12 },
    input: {
        flex: 1,
        fontSize: 16,
        color: COLORS.text,
        paddingVertical: 0,
    },
    hint: {
        fontSize: 13,
        color: COLORS.textSecondary,
        marginBottom: 24,
    },
    sendButton: {
        height: 54,
        borderRadius: 16,
        overflow: 'hidden',
    },
    sendButtonGradient: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    sendButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        marginLeft: 10,
    },

    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 28,
    },
    footerText: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    loginLink: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.primary,
    },
});

export default ForgotPasswordScreen;
