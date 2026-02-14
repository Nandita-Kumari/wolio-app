import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Image, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Lock, Sparkles } from 'lucide-react-native';
import { COLORS, SHADOWS, GRADIENTS } from '../constants/theme';
import GlassCard from '../components/GlassCard';
import GradientButton from '../components/GradientButton';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = () => {
        setLoading(true);
        // Simulate login
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
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <View style={styles.header}>
                    <View style={styles.logoWrapper}>
                        <LinearGradient
                            colors={GRADIENTS.primary}
                            style={styles.logoContainer}
                        >
                            <Sparkles color="#fff" size={32} />
                        </LinearGradient>
                    </View>
                    <Text style={styles.title}>Welcome Back</Text>
                    <Text style={styles.subtitle}>Sign in to continue your learning journey</Text>
                </View>

                <GlassCard style={styles.formContainer} intensity={40}>
                    <View style={styles.inputContainer}>
                        <Mail color={COLORS.textSecondary} size={20} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Email Address"
                            placeholderTextColor={COLORS.textSecondary}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Lock color={COLORS.textSecondary} size={20} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor={COLORS.textSecondary}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.forgotBtn}
                        onPress={() => navigation.navigate('ForgotPassword')}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.forgotText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <GradientButton
                        title="Sign In"
                        onPress={handleLogin}
                        loading={loading}
                    />
                </GlassCard>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Don't have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                        <Text style={styles.signupText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>

            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoWrapper: {
        width: 64,
        height: 64,
        transform: [{ rotate: '-15deg' }],
        marginBottom: 24,
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
        color: COLORS.text,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textSecondary,
        textAlign: 'center',
    },
    formContainer: {
        padding: 24,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.6)',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 16,
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
    },
    forgotBtn: {
        alignSelf: 'flex-end',
        marginBottom: 24,
    },
    forgotText: {
        color: COLORS.primary,
        fontWeight: '600',
        fontSize: 14,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    footerText: {
        color: COLORS.textSecondary,
        fontSize: 14,
    },
    signupText: {
        color: COLORS.primary,
        fontWeight: '700',
        fontSize: 14,
    }
});

export default LoginScreen;
