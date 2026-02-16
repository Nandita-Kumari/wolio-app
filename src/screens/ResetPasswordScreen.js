import React, { useState, useEffect, useRef } from 'react';
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
    Alert,
    Animated as RNAnimated,
    Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { Lock, Eye, EyeOff, Sparkles, ArrowRight, GraduationCap } from 'lucide-react-native';
import { COLORS, SHADOWS, GRADIENTS } from '../constants/theme';
import { useUser } from '../context/UserContext';

const ResetPasswordScreen = ({ navigation, route }) => {
    const { resetPassword: resetPasswordApi } = useUser();
    const role = route?.params?.role ?? 'Student';
    const resetToken = route?.params?.resetToken ?? route?.params?.token;
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const spinValue = useRef(new RNAnimated.Value(0)).current;
    useEffect(() => {
        const rotation = RNAnimated.loop(
            RNAnimated.timing(spinValue, {
                toValue: 1,
                duration: 4000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        );
        rotation.start();
        return () => rotation.stop();
    }, [spinValue]);

    const rotate = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const canSubmit =
        newPassword.length >= 6 &&
        confirmPassword.length >= 6 &&
        newPassword === confirmPassword;

    const handleReset = async () => {
        if (!canSubmit || loading) return;
        if (!resetToken) {
            Alert.alert(
                'Reset link required',
                'Use the link sent to your email to set a new password. If you didn\'t receive it, request a new one from Forgot Password.'
            );
            return;
        }
        setLoading(true);
        try {
            await resetPasswordApi(resetToken, newPassword, confirmPassword);
            setLoading(false);
            navigation.navigate('Login');
        } catch (err) {
            setLoading(false);
            Alert.alert('Error', err.message || 'Failed to reset password');
        }
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
                        {/* Top right: Student badge with graduation cap */}
                        <View style={styles.topBar}>
                            <View style={{ flex: 1 }} />
                            <View style={styles.roleBadge}>
                                <LinearGradient
                                    colors={GRADIENTS.primary}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.roleBadgeGradient}
                                >
                                    <GraduationCap size={18} color="#fff" />
                                    <Text style={styles.roleBadgeText}>{role}</Text>
                                </LinearGradient>
                            </View>
                        </View>

                        {/* Centered logo - rotating 360 */}
                        <View style={styles.header}>
                            <RNAnimated.View style={[styles.logoOuter, { transform: [{ rotate }] }]}>
                                <LinearGradient
                                    colors={GRADIENTS.primary}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.logoGradient}
                                >
                                    <Sparkles color="#fff" size={36} strokeWidth={2} />
                                </LinearGradient>
                            </RNAnimated.View>
                            <MaskedView
                                maskElement={
                                    <Text style={styles.titleMask}>Reset Password</Text>
                                }
                                style={styles.titleMaskWrap}
                            >
                                <LinearGradient
                                    colors={[COLORS.primary, COLORS.secondary]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.titleGradient}
                                >
                                    <Text style={[styles.titleMask, styles.titleMaskInner]}>
                                        Reset Password
                                    </Text>
                                </LinearGradient>
                            </MaskedView>
                            <Text style={styles.subtitle}>Create a strong new password</Text>
                        </View>

                        {/* White card: inputs + button */}
                        <View style={styles.card}>
                            <Text style={styles.label}>New Password</Text>
                            <View style={styles.inputContainer}>
                                <Lock size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter new password"
                                    placeholderTextColor={COLORS.textSecondary}
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                    secureTextEntry={!showNewPassword}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowNewPassword((p) => !p)}
                                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                                >
                                    {showNewPassword ? (
                                        <EyeOff size={20} color={COLORS.textSecondary} />
                                    ) : (
                                        <Eye size={20} color={COLORS.textSecondary} />
                                    )}
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.label}>Confirm New Password</Text>
                            <View style={styles.inputContainer}>
                                <Lock size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Confirm new password"
                                    placeholderTextColor={COLORS.textSecondary}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={!showConfirmPassword}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowConfirmPassword((p) => !p)}
                                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff size={20} color={COLORS.textSecondary} />
                                    ) : (
                                        <Eye size={20} color={COLORS.textSecondary} />
                                    )}
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                style={[styles.resetButton, !canSubmit && styles.resetButtonDisabled]}
                                onPress={handleReset}
                                disabled={!canSubmit || loading}
                                activeOpacity={0.85}
                            >
                                <LinearGradient
                                    colors={['#B789E0', '#C084FC', '#E567A5']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.resetButtonGradient}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <>
                                            <Text style={styles.resetButtonText}>Reset Password</Text>
                                            <ArrowRight size={20} color="#fff" strokeWidth={2.5} />
                                        </>
                                    )}
                                </LinearGradient>
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
        width: 280,
        height: 280,
        borderRadius: 140,
        top: -80,
        alignSelf: 'center',
    },
    safeArea: { flex: 1 },
    keyboardView: { flex: 1 },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 12,
        paddingBottom: 40,
    },

    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    roleBadge: {
        borderRadius: 20,
        overflow: 'hidden',
        ...SHADOWS.small,
    },
    roleBadgeGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 14,
    },
    roleBadgeText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
        marginLeft: 8,
    },

    header: {
        alignItems: 'center',
        marginBottom: 28,
    },
    logoOuter: {
        marginBottom: 20,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 6,
    },
    logoGradient: {
        width: 76,
        height: 76,
        borderRadius: 38,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    titleMaskWrap: {
        marginBottom: 8,
        alignSelf: 'center',
    },
    titleGradient: {
        paddingVertical: 0,
    },
    titleMask: {
        fontSize: 28,
        fontWeight: '700',
        backgroundColor: 'transparent',
    },
    titleMaskInner: {
        opacity: 0,
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
        borderWidth: 1,
        borderColor: 'rgba(168, 85, 247, 0.12)',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 4,
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
        marginBottom: 18,
    },
    inputIcon: { marginRight: 12 },
    input: {
        flex: 1,
        fontSize: 16,
        color: COLORS.text,
        paddingVertical: 0,
    },
    resetButton: {
        height: 56,
        borderRadius: 28,
        overflow: 'hidden',
        marginTop: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.35)',
        shadowColor: 'rgba(167, 139, 250, 0.5)',
        shadowOffset: { width: 3, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 6,
    },
    resetButtonDisabled: {
        opacity: 0.6,
    },
    resetButtonGradient: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 28,
    },
    resetButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        marginRight: 10,
    },
});

export default ResetPasswordScreen;
