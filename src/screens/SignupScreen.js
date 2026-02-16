import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
    ArrowLeft,
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Sparkles,
    ArrowRight,
} from 'lucide-react-native';
import { COLORS, SHADOWS, GRADIENTS } from '../constants/theme';
import GradientButton from '../components/GradientButton';
import { useUser } from '../context/UserContext';

const STEPS = [
    { key: 'account', label: 'Account', active: true },
    { key: 'verify', label: 'Verify', active: false },
    { key: 'profile', label: 'Profile', active: false },
];

const SignupScreen = ({ navigation, route }) => {
    const { signup: signupApi } = useUser();
    const role = (route?.params?.role ?? 'Student').toLowerCase() === 'parent' ? 'parent' : 'student';
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleCreateAccount = async () => {
        const name = fullName.trim();
        const emailVal = email.trim();
        if (!name || !emailVal || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }
        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }
        setLoading(true);
        try {
            await signupApi({ name, email: emailVal, password, confirmPassword, role });
            setLoading(false);
            navigation.replace('VerifyEmail', { email: emailVal });
        } catch (err) {
            setLoading(false);
            Alert.alert('Error', err.message || 'Signup failed');
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[COLORS.background, '#F3E8FF', '#FFFFFF']}
                style={StyleSheet.absoluteFill}
            />
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.scrollWrapper}>
                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        keyboardDismissMode="on-drag"
                    >
                        {/* Back */}
                        <TouchableOpacity
                            style={styles.backBtn}
                            onPress={() => navigation.goBack()}
                            activeOpacity={0.7}
                        >
                            <ArrowLeft size={22} color={COLORS.text} />
                            <Text style={styles.backText}>Back</Text>
                        </TouchableOpacity>

                        {/* Progress: 1 Account, 2 Verify, 3 Profile */}
                        <View style={styles.progressWrap}>
                            {STEPS.map((step, index) => (
                                <React.Fragment key={step.key}>
                                    <View style={styles.stepColumn}>
                                        <View
                                            style={[
                                                styles.stepCircle,
                                                step.active && styles.stepCircleActive,
                                            ]}
                                        >
                                            {step.active && (
                                                <View style={styles.stepCircleRing} />
                                            )}
                                            <Text
                                                style={[
                                                    styles.stepNumber,
                                                    step.active && styles.stepNumberActive,
                                                ]}
                                            >
                                                {index + 1}
                                            </Text>
                                        </View>
                                        <Text
                                            style={[
                                                styles.stepLabel,
                                                step.active && styles.stepLabelActive,
                                            ]}
                                        >
                                            {step.label}
                                        </Text>
                                    </View>
                                    {index < STEPS.length - 1 && (
                                        <View style={styles.stepConnector} />
                                    )}
                                </React.Fragment>
                            ))}
                        </View>

                        {/* Branding: WOLIO logo + subtitle */}
                        <View style={styles.branding}>
                            <View style={styles.logoRow}>
                                <View style={styles.logoIconWrap}>
                                    <LinearGradient
                                        colors={GRADIENTS.primary}
                                        style={styles.logoIcon}
                                    >
                                        <Sparkles color="#fff" size={28} />
                                    </LinearGradient>
                                </View>
                                <Text style={styles.logoText}>WOLIO</Text>
                            </View>
                            <Text style={styles.brandingSubtitle}>
                                Create your learning account
                            </Text>
                        </View>

                        {/* Form card */}
                        <View style={styles.formCard}>
                            <TouchableOpacity
                                style={styles.googleButton}
                                activeOpacity={0.8}
                            >
                                <View style={styles.googleIcon}>
                                    <Text style={styles.googleG}>G</Text>
                                </View>
                                <Text style={styles.googleButtonText}>Continue with Google</Text>
                            </TouchableOpacity>

                            <View style={styles.orRow}>
                                <View style={styles.orLine} />
                                <Text style={styles.orText}>OR</Text>
                                <View style={styles.orLine} />
                            </View>

                            <Text style={styles.label}>Full Name</Text>
                            <View style={styles.inputContainer}>
                                <User
                                    color={COLORS.textSecondary}
                                    size={20}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your full name"
                                    placeholderTextColor={COLORS.textSecondary}
                                    value={fullName}
                                    onChangeText={setFullName}
                                    autoCapitalize="words"
                                />
                            </View>

                            <Text style={styles.label}>Email</Text>
                            <View style={styles.inputContainer}>
                                <Mail
                                    color={COLORS.textSecondary}
                                    size={20}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your email"
                                    placeholderTextColor={COLORS.textSecondary}
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                />
                            </View>

                            <Text style={styles.label}>Password</Text>
                            <View style={styles.inputContainer}>
                                <Lock
                                    color={COLORS.textSecondary}
                                    size={20}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your password"
                                    placeholderTextColor={COLORS.textSecondary}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword((p) => !p)}
                                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                                >
                                    {showPassword ? (
                                        <EyeOff size={20} color={COLORS.textSecondary} />
                                    ) : (
                                        <Eye size={20} color={COLORS.textSecondary} />
                                    )}
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.label}>Confirm Password</Text>
                            <View style={styles.inputContainer}>
                                <Lock
                                    color={COLORS.textSecondary}
                                    size={20}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Confirm your password"
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

                            <GradientButton
                                title="Create Account"
                                onPress={handleCreateAccount}
                                loading={loading}
                                icon={<ArrowRight size={20} color="#fff" />}
                                style={styles.createButton}
                            />

                            <View style={styles.signinRow}>
                                <Text style={styles.signinPrompt}>Already have an account? </Text>
                                <TouchableOpacity
                                    onPress={() => navigation.replace('Login')}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.signinLink}>Sign in</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.bottomSpacer} />
                    </ScrollView>
                </View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    safeArea: { flex: 1 },
    scrollWrapper: { flex: 1, minHeight: 0 },
    scrollView: { flex: 1 },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 8,
        paddingBottom: 120,
    },
    bottomSpacer: { height: 40 },

    backBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    backText: {
        fontSize: 16,
        color: COLORS.text,
        marginLeft: 8,
        fontWeight: '500',
    },

    progressWrap: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginBottom: 28,
    },
    stepColumn: {
        alignItems: 'center',
    },
    stepCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    stepCircleActive: {
        backgroundColor: COLORS.primary,
    },
    stepCircleRing: {
        position: 'absolute',
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: 'rgba(168, 85, 247, 0.35)',
        top: -4,
        left: -4,
    },
    stepNumber: {
        fontSize: 16,
        fontWeight: '700',
        color: '#9CA3AF',
    },
    stepNumberActive: {
        color: '#FFFFFF',
    },
    stepLabel: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 6,
        fontWeight: '500',
    },
    stepLabelActive: {
        color: COLORS.primary,
        fontWeight: '600',
    },
    stepConnector: {
        width: 32,
        height: 2,
        backgroundColor: '#E5E7EB',
        alignSelf: 'flex-start',
        marginTop: 19,
        marginHorizontal: 4,
    },

    branding: {
        alignItems: 'center',
        marginBottom: 24,
    },
    logoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    logoIconWrap: {
        borderRadius: 12,
        overflow: 'hidden',
        marginRight: 10,
        ...SHADOWS.small,
    },
    logoIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoText: {
        fontSize: 28,
        fontWeight: '700',
        color: COLORS.primary,
    },
    brandingSubtitle: {
        fontSize: 15,
        color: COLORS.textSecondary,
        textAlign: 'center',
    },

    formCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        ...SHADOWS.medium,
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 52,
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginBottom: 20,
    },
    googleIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    googleG: {
        fontSize: 16,
        fontWeight: '700',
        color: '#4285F4',
    },
    googleButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
    },
    orRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    orLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E7EB',
    },
    orText: {
        fontSize: 13,
        color: COLORS.textSecondary,
        marginHorizontal: 14,
        fontWeight: '500',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginBottom: 18,
        paddingHorizontal: 14,
        height: 52,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    inputIcon: { marginRight: 12 },
    input: {
        flex: 1,
        height: '100%',
        color: COLORS.text,
        fontSize: 16,
        paddingVertical: 0,
    },
    createButton: {
        marginTop: 4,
        marginBottom: 20,
    },
    signinRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    signinPrompt: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    signinLink: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.primary,
    },
});

export default SignupScreen;
