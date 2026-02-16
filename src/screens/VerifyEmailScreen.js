import React, { useState, useRef } from 'react';
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
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Mail, Lock, Lightbulb } from 'lucide-react-native';
import { COLORS, GRADIENTS, SHADOWS } from '../constants/theme';
import GradientButton from '../components/GradientButton';
import { useUser } from '../context/UserContext';

const OTP_LENGTH = 6;
const DEMO_CODE = '123456';

const VerifyEmailScreen = ({ navigation, route }) => {
    const email = route?.params?.email ?? '';
    const { verify } = useUser();
    const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
    const [loading, setLoading] = useState(false);
    const inputRefs = useRef([]);

    const handleOtpChange = (value, index) => {
        if (value.length > 1) {
            const digits = value.replace(/\D/g, '').slice(0, OTP_LENGTH).split('');
            const newOtp = [...otp];
            digits.forEach((d, i) => {
                if (index + i < OTP_LENGTH) newOtp[index + i] = d;
            });
            setOtp(newOtp);
            const next = Math.min(index + digits.length, OTP_LENGTH - 1);
            inputRefs.current[next]?.focus();
            return;
        }
        const newOtp = [...otp];
        newOtp[index] = value.replace(/\D/g, '').slice(-1);
        setOtp(newOtp);
        if (value && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
    };

    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const otpString = otp.join('');
    const canVerify = otpString.length === OTP_LENGTH;

    const handleVerify = async () => {
        if (!canVerify || loading) return;
        if (!email) {
            Alert.alert('Error', 'Email is missing. Please go back and sign up again.');
            return;
        }
        setLoading(true);
        try {
            const data = await verify(email, otpString);
            setLoading(false);
            navigation.replace('CompleteProfile', { token: data.token, user: data.user });
        } catch (err) {
            setLoading(false);
            Alert.alert('Error', err.message || 'Invalid or expired OTP');
        }
    };

    const handleResend = () => {
        // In real app: trigger resend API
    };

    const handlePasteDemo = () => {
        const digits = DEMO_CODE.split('');
        const newOtp = [...otp];
        digits.forEach((d, i) => { newOtp[i] = d; });
        setOtp(newOtp);
        inputRefs.current[OTP_LENGTH - 1]?.focus();
    };

    return (
        <View style={styles.container}>
            <View style={styles.glowWrap}>
                <LinearGradient
                    colors={['rgba(168, 85, 247, 0.25)', 'rgba(236, 72, 153, 0.2)', 'transparent']}
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
                        <TouchableOpacity
                            style={styles.backBtn}
                            onPress={() => navigation.goBack()}
                            activeOpacity={0.7}
                        >
                            <ArrowLeft size={22} color={COLORS.text} />
                            <Text style={styles.backText}>Back</Text>
                        </TouchableOpacity>

                        <View style={styles.header}>
                            <View style={styles.iconWrap}>
                                <View style={styles.iconBg}>
                                    <Mail size={32} color={COLORS.primary} strokeWidth={1.5} />
                                </View>
                            </View>
                            <Text style={styles.gradientTitle}>Verify Your Email</Text>
                            <Text style={styles.sentTo}>Code sent to</Text>
                            <Text style={styles.emailText}>{email}</Text>
                        </View>

                        <View style={styles.card}>
                            <Text style={styles.cardLabel}>Enter Verification Code</Text>
                            <View style={styles.otpRow}>
                                {otp.map((digit, index) => (
                                    <TextInput
                                        key={index}
                                        ref={(r) => (inputRefs.current[index] = r)}
                                        style={[
                                            styles.otpBox,
                                            digit ? styles.otpBoxFilled : null,
                                        ]}
                                        value={digit}
                                        onChangeText={(v) => handleOtpChange(v, index)}
                                        onKeyPress={(e) => handleKeyPress(e, index)}
                                        keyboardType="number-pad"
                                        maxLength={index === 0 ? OTP_LENGTH : 1}
                                        selectTextOnFocus
                                    />
                                ))}
                            </View>
                            <View style={styles.pasteHint}>
                                <Lightbulb size={14} color={COLORS.textSecondary} />
                                <Text style={styles.pasteHintText}>Paste code at once</Text>
                            </View>

                            <GradientButton
                                title="Verify Email"
                                onPress={handleVerify}
                                loading={loading}
                                style={[styles.verifyBtn, !canVerify && styles.verifyBtnDisabled]}
                                textStyle={styles.verifyBtnText}
                            />

                            <Text style={styles.resendPrompt}>Didn't receive the code?</Text>
                            <TouchableOpacity onPress={handleResend} activeOpacity={0.7}>
                                <Text style={styles.resendLink}>Resend code</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.demoRow}
                                onPress={handlePasteDemo}
                                activeOpacity={0.7}
                            >
                                <Lock size={14} color={COLORS.textSecondary} />
                                <Text style={styles.demoText}>Demo code: {DEMO_CODE}</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
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
        opacity: 0.9,
    },
    safeArea: { flex: 1 },
    keyboardView: { flex: 1 },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 12,
        paddingBottom: 40,
    },
    backBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        marginBottom: 24,
    },
    backText: {
        fontSize: 16,
        color: COLORS.text,
        marginLeft: 6,
        fontWeight: '500',
    },
    header: {
        alignItems: 'center',
        marginBottom: 28,
    },
    iconWrap: { marginBottom: 16 },
    iconBg: {
        width: 72,
        height: 72,
        borderRadius: 18,
        backgroundColor: 'rgba(168, 85, 247, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(168, 85, 247, 0.25)',
    },
    gradientTitle: {
        fontSize: 26,
        fontWeight: '700',
        color: COLORS.primary,
        marginBottom: 8,
    },
    sentTo: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: 2,
    },
    emailText: {
        fontSize: 15,
        color: COLORS.text,
        fontWeight: '600',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        ...SHADOWS.medium,
    },
    cardLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 16,
    },
    otpRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    otpBox: {
        width: 48,
        height: 52,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        backgroundColor: '#FFFFFF',
        fontSize: 22,
        fontWeight: '700',
        color: COLORS.text,
        textAlign: 'center',
    },
    otpBoxFilled: {
        borderColor: COLORS.primary,
        backgroundColor: 'rgba(168, 85, 247, 0.06)',
    },
    pasteHint: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    pasteHintText: {
        fontSize: 13,
        color: COLORS.textSecondary,
        marginLeft: 6,
    },
    verifyBtn: {
        height: 54,
        marginBottom: 20,
    },
    verifyBtnDisabled: {
        opacity: 0.6,
    },
    verifyBtnText: {
        fontSize: 16,
        fontWeight: '600',
    },
    resendPrompt: {
        fontSize: 14,
        color: COLORS.text,
        marginBottom: 4,
        textAlign: 'center',
    },
    resendLink: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.primary,
        textAlign: 'center',
        marginBottom: 24,
    },
    demoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    demoText: {
        fontSize: 13,
        color: COLORS.textSecondary,
        marginLeft: 6,
    },
});

export default VerifyEmailScreen;
