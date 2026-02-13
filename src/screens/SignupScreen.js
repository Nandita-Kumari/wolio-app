import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
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
import GlassCard from '../components/GlassCard';
import GradientButton from '../components/GradientButton';

const SignupScreen = ({ navigation, route }) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const role = route?.params?.role ?? 'Student';

    const handleCreateAccount = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            navigation.replace('Main');
        }, 1500);
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
                        showsVerticalScrollIndicator={true}
                        keyboardShouldPersistTaps="handled"
                        keyboardDismissMode="on-drag"
                    >
                        {/* Top bar: Change Role | Student */}
                        <View style={styles.topBar}>
                            <TouchableOpacity
                                style={styles.changeRoleBtn}
                                onPress={() => navigation.replace('Onboarding')}
                            >
                                <ArrowLeft size={20} color={COLORS.text} />
                                <Text style={styles.changeRoleText}>Change Role</Text>
                            </TouchableOpacity>
                            <View style={styles.rolePill}>
                                <LinearGradient
                                    colors={GRADIENTS.primary}
                                    style={styles.rolePillGradient}
                                >
                                    <Text style={styles.rolePillText}>{role}</Text>
                                </LinearGradient>
                            </View>
                        </View>

                        {/* Header: icon + title + subtitle */}
                        <View style={styles.header}>
                            <View style={styles.logoWrapper}>
                                <LinearGradient
                                    colors={GRADIENTS.primary}
                                    style={styles.logoContainer}
                                >
                                    <Sparkles color="#fff" size={32} />
                                </LinearGradient>
                            </View>
                            <Text style={styles.title}>Join the Future</Text>
                            <Text style={styles.subtitle}>
                                Start your learning journey today
                            </Text>
                        </View>

                        {/* Form card */}
                        <GlassCard style={styles.formCard} intensity={40}>
                            <Text style={styles.label}>Full Name</Text>
                            <View style={styles.inputContainer}>
                                <User
                                    color={COLORS.textSecondary}
                                    size={20}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Jordan Smith"
                                    placeholderTextColor={COLORS.textSecondary}
                                    value={fullName}
                                    onChangeText={setFullName}
                                    autoCapitalize="words"
                                />
                            </View>

                            <Text style={styles.label}>Email Address</Text>
                            <View style={styles.inputContainer}>
                                <Mail
                                    color={COLORS.textSecondary}
                                    size={20}
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

                            <Text style={styles.label}>Password</Text>
                            <View style={styles.inputContainer}>
                                <Lock
                                    color={COLORS.textSecondary}
                                    size={20}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="••••••••••"
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
                                        <EyeOff
                                            size={20}
                                            color={COLORS.textSecondary}
                                        />
                                    ) : (
                                        <Eye
                                            size={20}
                                            color={COLORS.textSecondary}
                                        />
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
                                    placeholder="••••••••••"
                                    placeholderTextColor={COLORS.textSecondary}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={!showConfirmPassword}
                                />
                                <TouchableOpacity
                                    onPress={() =>
                                        setShowConfirmPassword((p) => !p)
                                    }
                                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff
                                            size={20}
                                            color={COLORS.textSecondary}
                                        />
                                    ) : (
                                        <Eye
                                            size={20}
                                            color={COLORS.textSecondary}
                                        />
                                    )}
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                style={styles.termsRow}
                                onPress={() => setAgreeTerms((a) => !a)}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.termsText}>
                                    I agree to the{' '}
                                    <Text
                                        style={styles.termsLink}
                                        onPress={(e) => e.stopPropagation()}
                                    >
                                        Terms of Service
                                    </Text>
                                    {' and '}
                                    <Text
                                        style={styles.termsLink}
                                        onPress={(e) => e.stopPropagation()}
                                    >
                                        Privacy Policy
                                    </Text>
                                </Text>
                            </TouchableOpacity>

                            <GradientButton
                                title="Create Account"
                                onPress={handleCreateAccount}
                                loading={loading}
                                icon={<ArrowRight size={20} color="#fff" />}
                                style={styles.createButton}
                            />
                        </GlassCard>

                        {/* OR CONTINUE WITH */}
                        <View style={styles.dividerRow}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>
                                OR CONTINUE WITH
                            </Text>
                            <View style={styles.dividerLine} />
                        </View>

                        <View style={styles.socialRow}>
                            <TouchableOpacity
                                style={styles.socialButton}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.socialButtonText}>Google</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.socialButton}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.socialButtonText}>GitHub</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Footer: Sign in */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>
                                Already have an account?{' '}
                            </Text>
                            <TouchableOpacity
                                onPress={() => navigation.replace('Login')}
                            >
                                <Text style={styles.signinLink}>Sign in</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.bottomSpacer} />
                    </ScrollView>
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
    scrollWrapper: {
        flex: 1,
        minHeight: 0,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 8,
        paddingBottom: 120,
    },
    bottomSpacer: {
        height: 40,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    changeRoleBtn: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    changeRoleText: {
        fontSize: 16,
        color: COLORS.text,
        marginLeft: 8,
        fontWeight: '500',
    },
    rolePill: {
        borderRadius: 20,
        overflow: 'hidden',
        ...SHADOWS.small,
    },
    rolePillGradient: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    rolePillText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    header: {
        alignItems: 'center',
        marginBottom: 28,
    },
    logoWrapper: {
        width: 64,
        height: 64,
        transform: [{ rotate: '-15deg' }],
        marginBottom: 20,
    },
    logoContainer: {
        width: 64,
        height: 64,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.medium,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: COLORS.primary,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textSecondary,
        textAlign: 'center',
    },
    formCard: {
        padding: 24,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.9)',
        marginBottom: 20,
        ...SHADOWS.medium,
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
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        marginBottom: 20,
        paddingHorizontal: 16,
        height: 56,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        height: '100%',
        color: COLORS.text,
        fontSize: 16,
        paddingVertical: 0,
    },
    termsRow: {
        marginBottom: 24,
    },
    termsText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        lineHeight: 20,
    },
    termsLink: {
        color: COLORS.primary,
        fontWeight: '600',
    },
    createButton: {
        marginBottom: 0,
    },
    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E7EB',
    },
    dividerText: {
        fontSize: 12,
        color: COLORS.textSecondary,
        fontWeight: '600',
        letterSpacing: 0.5,
        marginHorizontal: 12,
    },
    socialRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    socialButton: {
        width: '48%',
        height: 52,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.small,
    },
    socialButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 28,
    },
    footerText: {
        color: COLORS.textSecondary,
        fontSize: 14,
    },
    signinLink: {
        color: COLORS.primary,
        fontWeight: '700',
        fontSize: 14,
    },
});

export default SignupScreen;
