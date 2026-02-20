import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Pressable,
    Platform,
    Modal,
    TextInput,
    KeyboardAvoidingView,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
    ArrowLeft,
    User,
    Lock,
    Palette,
    Languages,
    Clock,
    Sun,
    Bell,
    Mail,
    Volume2,
    HelpCircle,
    Shield,
    Sparkles,
    ChevronRight,
    Eye,
    EyeOff,
    X,
    Info,
    Send,
} from 'lucide-react-native';
import { COLORS, GRADIENTS } from '../constants/theme';

const GradientSwitch = ({ value, onValueChange }) => (
    <Pressable
        style={[
            styles.switchTrack,
            value ? styles.switchTrackOn : styles.switchTrackOff,
        ]}
        onPress={() => onValueChange(!value)}
    >
        {value ? (
            <LinearGradient
                colors={GRADIENTS.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
            />
        ) : null}
        <View style={[styles.switchThumb, value && styles.switchThumbOn]} />
    </Pressable>
);

const SettingsScreen = ({ navigation }) => {
    const [themeOn, setThemeOn] = useState(false);
    const [pushOn, setPushOn] = useState(true);
    const [emailOn, setEmailOn] = useState(true);
    const [soundOn, setSoundOn] = useState(true);
    const [changePwdVisible, setChangePwdVisible] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPwd, setShowCurrentPwd] = useState(false);
    const [showNewPwd, setShowNewPwd] = useState(false);
    const [showConfirmPwd, setShowConfirmPwd] = useState(false);
    const [contactSupportVisible, setContactSupportVisible] = useState(false);
    const [supportMessage, setSupportMessage] = useState('');
    const [termsVisible, setTermsVisible] = useState(false);

    const openTerms = () => setTermsVisible(true);
    const closeTerms = () => setTermsVisible(false);

    const openContactSupport = () => {
        setSupportMessage('');
        setContactSupportVisible(true);
    };

    const closeContactSupport = () => {
        setContactSupportVisible(false);
    };

    const handleSendMessage = () => {
        if (!supportMessage.trim()) {
            Alert.alert('Required', 'Please describe your issue or question.');
            return;
        }
        Alert.alert('Sent', 'Your message has been sent. We typically respond within 24 hours.');
        closeContactSupport();
    };

    const openChangePassword = () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setChangePwdVisible(true);
    };

    const closeChangePassword = () => {
        setChangePwdVisible(false);
    };

    const handleChangePassword = () => {
        if (newPassword.length < 8) {
            Alert.alert('Invalid', 'Password must be at least 8 characters long.');
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert('Mismatch', 'New password and confirmation do not match.');
            return;
        }
        Alert.alert('Success', 'Password changed successfully.');
        closeChangePassword();
    };

    const SettingRow = ({ icon: Icon, label, value, onPress, showArrow = true }) => (
        <TouchableOpacity
            style={styles.settingRow}
            onPress={onPress}
            disabled={!onPress}
            activeOpacity={onPress ? 0.7 : 1}
        >
            <View style={styles.settingIconWrap}>
                <Icon size={20} color={COLORS.primary} strokeWidth={2} />
            </View>
            <Text style={styles.settingLabel}>{label}</Text>
            {value && <Text style={styles.settingValue}>{value}</Text>}
            {showArrow && onPress && <ChevronRight size={20} color={COLORS.textSecondary} />}
        </TouchableOpacity>
    );

    const SettingRowSwitch = ({ icon: Icon, label, value, onValueChange }) => (
        <View style={styles.settingRow}>
            <View style={styles.settingIconWrap}>
                <Icon size={20} color={COLORS.primary} strokeWidth={2} />
            </View>
            <Text style={styles.settingLabel}>{label}</Text>
            <GradientSwitch value={value} onValueChange={onValueChange} />
        </View>
    );

    const SectionHeader = ({ icon: Icon, title }) => (
        <View style={styles.sectionHeader}>
            <Icon size={14} color={COLORS.primary} strokeWidth={2} />
            <Text style={styles.sectionTitle}>{title}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backBtn}
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.8}
                    >
                        <ArrowLeft size={22} color={COLORS.text} />
                    </TouchableOpacity>
                    <View style={styles.headerText}>
                        <Text style={styles.headerTitle}>Settings</Text>
                        <Text style={styles.headerSubtitle}>Manage your account and preferences</Text>
                    </View>
                </View>

                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* ACCOUNT */}
                    <SectionHeader icon={User} title="ACCOUNT" />
                    <View style={styles.card}>
                        <SettingRow
                            icon={User}
                            label="Edit Profile"
                            onPress={() => { navigation.goBack(); }}
                        />
                        <View style={styles.divider} />
                        <SettingRow
                            icon={Lock}
                            label="Change Password"
                            onPress={openChangePassword}
                        />
                    </View>

                    {/* PREFERENCES */}
                    <SectionHeader icon={Palette} title="PREFERENCES" />
                    <View style={styles.card}>
                        <SettingRow
                            icon={Languages}
                            label="Language"
                            value="English"
                            onPress={() => {}}
                        />
                        <View style={styles.divider} />
                        <SettingRow
                            icon={Clock}
                            label="Time Zone"
                            value="PST (UTC-8)"
                            onPress={() => {}}
                        />
                        <View style={styles.divider} />
                        <SettingRowSwitch
                            icon={Sun}
                            label="Theme"
                            value={themeOn}
                            onValueChange={setThemeOn}
                        />
                    </View>

                    {/* NOTIFICATIONS */}
                    <SectionHeader icon={Bell} title="NOTIFICATIONS" />
                    <View style={styles.card}>
                        <SettingRowSwitch
                            icon={Bell}
                            label="Push Notifications"
                            value={pushOn}
                            onValueChange={setPushOn}
                        />
                        <View style={styles.divider} />
                        <SettingRowSwitch
                            icon={Mail}
                            label="Email Notifications"
                            value={emailOn}
                            onValueChange={setEmailOn}
                        />
                        <View style={styles.divider} />
                        <SettingRowSwitch
                            icon={Volume2}
                            label="Sound Effects"
                            value={soundOn}
                            onValueChange={setSoundOn}
                        />
                    </View>

                    {/* SUPPORT */}
                    <SectionHeader icon={HelpCircle} title="SUPPORT" />
                    <View style={styles.card}>
                        <SettingRow
                            icon={HelpCircle}
                            label="Help Center"
                            onPress={() => {}}
                        />
                        <View style={styles.divider} />
                        <SettingRow
                            icon={Mail}
                            label="Contact Support"
                            onPress={openContactSupport}
                        />
                        <View style={styles.divider} />
                        <SettingRow
                            icon={Shield}
                            label="Terms of Service"
                            onPress={openTerms}
                        />
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerVersion}>Wolio v1.0.0</Text>
                        <Text style={styles.footerCopyright}>© 2024 Wolio. All rights reserved.</Text>
                    </View>
                    <View style={{ height: 100 }} />
                </ScrollView>

            {/* Change Password Modal */}
            <Modal visible={changePwdVisible} animationType="fade" transparent>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={styles.changePwdOverlay}
                >
                    <TouchableOpacity
                        style={StyleSheet.absoluteFill}
                        activeOpacity={1}
                        onPress={closeChangePassword}
                    />
                    <View style={styles.changePwdModal}>
                        <View style={styles.changePwdHeader}>
                            <View style={styles.changePwdTitleRow}>
                                <LinearGradient
                                    colors={GRADIENTS.primary}
                                    style={styles.changePwdIconWrap}
                                >
                                    <Lock size={20} color="#fff" strokeWidth={2} />
                                </LinearGradient>
                                <Text style={styles.changePwdTitle}>Change Password</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.changePwdCloseBtn}
                                onPress={closeChangePassword}
                                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                            >
                                <X size={22} color={COLORS.text} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.changePwdField}>
                            <Text style={styles.changePwdLabel}>Current Password</Text>
                            <View style={styles.changePwdInputWrap}>
                                <TextInput
                                    style={styles.changePwdInput}
                                    placeholder="Enter current password"
                                    placeholderTextColor={COLORS.textSecondary}
                                    value={currentPassword}
                                    onChangeText={setCurrentPassword}
                                    secureTextEntry={!showCurrentPwd}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                                <TouchableOpacity onPress={() => setShowCurrentPwd(!showCurrentPwd)} style={styles.changePwdEye}>
                                    {showCurrentPwd ? <EyeOff size={20} color={COLORS.textSecondary} /> : <Eye size={20} color={COLORS.textSecondary} />}
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.changePwdField}>
                            <Text style={styles.changePwdLabel}>New Password</Text>
                            <View style={styles.changePwdInputWrap}>
                                <TextInput
                                    style={styles.changePwdInput}
                                    placeholder="Enter new password"
                                    placeholderTextColor={COLORS.textSecondary}
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                    secureTextEntry={!showNewPwd}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                                <TouchableOpacity onPress={() => setShowNewPwd(!showNewPwd)} style={styles.changePwdEye}>
                                    {showNewPwd ? <EyeOff size={20} color={COLORS.textSecondary} /> : <Eye size={20} color={COLORS.textSecondary} />}
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.changePwdField}>
                            <Text style={styles.changePwdLabel}>Confirm New Password</Text>
                            <View style={styles.changePwdInputWrap}>
                                <TextInput
                                    style={styles.changePwdInput}
                                    placeholder="Confirm new password"
                                    placeholderTextColor={COLORS.textSecondary}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={!showConfirmPwd}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                                <TouchableOpacity onPress={() => setShowConfirmPwd(!showConfirmPwd)} style={styles.changePwdEye}>
                                    {showConfirmPwd ? <EyeOff size={20} color={COLORS.textSecondary} /> : <Eye size={20} color={COLORS.textSecondary} />}
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.changePwdHint}>
                            <Info size={18} color="#3366CC" strokeWidth={2} />
                            <Text style={styles.changePwdHintText}>Password must be at least 8 characters long</Text>
                        </View>
                        <View style={styles.changePwdActions}>
                            <TouchableOpacity style={styles.changePwdCancelBtn} onPress={closeChangePassword}>
                                <Text style={styles.changePwdCancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.changePwdSubmitBtn} onPress={handleChangePassword} activeOpacity={0.8}>
                                <LinearGradient
                                    colors={GRADIENTS.primary}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.changePwdSubmitGradient}
                                >
                                    <Text style={styles.changePwdSubmitText}>Change Password</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {/* Contact Support Modal */}
            <Modal visible={contactSupportVisible} animationType="fade" transparent>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={styles.contactSupportOverlay}
                >
                    <TouchableOpacity
                        style={StyleSheet.absoluteFill}
                        activeOpacity={1}
                        onPress={closeContactSupport}
                    />
                    <View style={styles.contactSupportModal}>
                        <View style={styles.contactSupportHeader}>
                            <View style={styles.contactSupportTitleRow}>
                                <LinearGradient
                                    colors={GRADIENTS.primary}
                                    style={styles.contactSupportIconWrap}
                                >
                                    <Mail size={20} color="#fff" strokeWidth={2} />
                                </LinearGradient>
                                <Text style={styles.contactSupportTitle}>Contact Support</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.contactSupportCloseBtn}
                                onPress={closeContactSupport}
                                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                            >
                                <X size={22} color={COLORS.text} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.contactSupportField}>
                            <Text style={styles.contactSupportLabel}>Your Message</Text>
                            <TextInput
                                style={styles.contactSupportInput}
                                placeholder="Describe your issue or question..."
                                placeholderTextColor={COLORS.textSecondary}
                                value={supportMessage}
                                onChangeText={setSupportMessage}
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                            />
                        </View>
                        <View style={styles.contactSupportHint}>
                            <Info size={18} color="#3366CC" strokeWidth={2} />
                            <Text style={styles.contactSupportHintText}>We typically respond within 24 hours</Text>
                        </View>
                        <View style={styles.contactSupportActions}>
                            <TouchableOpacity style={styles.contactSupportCancelBtn} onPress={closeContactSupport}>
                                <Text style={styles.contactSupportCancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.contactSupportSubmitBtn} onPress={handleSendMessage} activeOpacity={0.8}>
                                <LinearGradient
                                    colors={GRADIENTS.primary}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.contactSupportSubmitGradient}
                                >
                                    <Send size={18} color="#fff" strokeWidth={2} />
                                    <Text style={styles.contactSupportSubmitText}>Send Message</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {/* Terms of Service Modal */}
            <Modal visible={termsVisible} animationType="fade" transparent>
                <View style={styles.termsOverlay}>
                    <TouchableOpacity
                        style={StyleSheet.absoluteFill}
                        activeOpacity={1}
                        onPress={closeTerms}
                    />
                    <View style={styles.termsModal}>
                        <View style={styles.termsHeader}>
                            <View style={styles.termsTitleRow}>
                                <LinearGradient
                                    colors={GRADIENTS.primary}
                                    style={styles.termsIconWrap}
                                >
                                    <Shield size={20} color="#fff" strokeWidth={2} />
                                </LinearGradient>
                                <Text style={styles.termsTitle}>Terms of Service</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.termsCloseBtn}
                                onPress={closeTerms}
                                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                            >
                                <X size={22} color={COLORS.text} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView
                            style={styles.termsScroll}
                            contentContainerStyle={styles.termsScrollContent}
                            showsVerticalScrollIndicator={true}
                        >
                            <View style={styles.termsSection}>
                                <Text style={styles.termsSectionTitle}>1. Acceptance of Terms</Text>
                                <Text style={styles.termsSectionText}>By accessing and using Wolio, you accept and agree to be bound by the terms and provision of this agreement.</Text>
                            </View>
                            <View style={styles.termsSection}>
                                <Text style={styles.termsSectionTitle}>2. Use License</Text>
                                <Text style={styles.termsSectionText}>Permission is granted to temporarily access the materials on Wolio for personal, non-commercial viewing only.</Text>
                            </View>
                            <View style={styles.termsSection}>
                                <Text style={styles.termsSectionTitle}>3. User Account</Text>
                                <Text style={styles.termsSectionText}>You are responsible for maintaining the confidentiality of your account and password and for all activities that occur under your account.</Text>
                            </View>
                            <View style={styles.termsSection}>
                                <Text style={styles.termsSectionTitle}>4. Content</Text>
                                <Text style={styles.termsSectionText}>All content on Wolio is for informational and educational purposes only. We make no warranties about the accuracy or completeness of any content.</Text>
                            </View>
                            <View style={styles.termsSection}>
                                <Text style={styles.termsSectionTitle}>5. Privacy</Text>
                                <Text style={styles.termsSectionText}>Your use of Wolio is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices.</Text>
                            </View>
                            <View style={styles.termsSection}>
                                <Text style={styles.termsSectionTitle}>6. Modifications</Text>
                                <Text style={styles.termsSectionText}>Wolio may revise these terms of service at any time without notice. By using this app you agree to be bound by the current version of these terms.</Text>
                            </View>
                        </ScrollView>
                        <TouchableOpacity
                            style={styles.termsUnderstandBtn}
                            onPress={closeTerms}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={GRADIENTS.primary}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.termsUnderstandGradient}
                            >
                                <Text style={styles.termsUnderstandText}>I Understand</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

                {/* FAB */}
                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => {}}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={['#C084FC', '#A855F7', '#EC4899']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.fabGradient}
                    >
                        <Sparkles size={24} color="#fff" strokeWidth={2} />
                    </LinearGradient>
                </TouchableOpacity>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    safeArea: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 8 : 16,
        paddingBottom: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    headerText: { flex: 1 },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: COLORS.text,
    },
    headerSubtitle: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    scroll: { flex: 1 },
    scrollContent: { padding: 16, paddingTop: 20 },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        marginLeft: 4,
        gap: 8,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.primary,
        letterSpacing: 0.5,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 24,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginLeft: 52,
    },
    settingIconWrap: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#F3E8FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    settingLabel: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        color: COLORS.text,
    },
    settingValue: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginRight: 8,
    },
    switchTrack: {
        width: 51,
        height: 31,
        borderRadius: 16,
        padding: 2,
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
    },
    switchTrackOn: {
        justifyContent: 'flex-end',
    },
    switchTrackOff: {
        backgroundColor: '#E5E7EB',
        justifyContent: 'flex-start',
    },
    switchThumb: {
        width: 27,
        height: 27,
        borderRadius: 14,
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#E5E7EB',
        shadowColor: '#EC4899',
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    switchThumbOn: {
        borderColor: '#EC4899',
    },
    footer: {
        alignItems: 'center',
        paddingVertical: 24,
    },
    footerVersion: {
        fontSize: 13,
        color: COLORS.textSecondary,
    },
    footerCopyright: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 4,
    },
    changePwdOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 24,
    },
    changePwdModal: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
    },
    changePwdHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    changePwdTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    changePwdIconWrap: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    changePwdTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.text,
    },
    changePwdCloseBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    changePwdField: {
        marginBottom: 18,
    },
    changePwdLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 8,
    },
    changePwdInputWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    changePwdInput: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: COLORS.text,
    },
    changePwdEye: {
        padding: 12,
    },
    changePwdHint: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 24,
        backgroundColor: '#EDF3FF',
        borderRadius: 20,
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#D6E4FF',
    },
    changePwdHintText: {
        flex: 1,
        fontSize: 14,
        color: '#3366CC',
    },
    changePwdActions: {
        flexDirection: 'row',
        gap: 12,
    },
    changePwdCancelBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 14,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    changePwdCancelText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
    },
    changePwdSubmitBtn: {
        flex: 1,
        borderRadius: 14,
        overflow: 'hidden',
    },
    changePwdSubmitGradient: {
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    changePwdSubmitText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    contactSupportOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 24,
    },
    contactSupportModal: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
    },
    contactSupportHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    contactSupportTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    contactSupportIconWrap: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contactSupportTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.text,
    },
    contactSupportCloseBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    contactSupportField: {
        marginBottom: 18,
    },
    contactSupportLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 8,
    },
    contactSupportInput: {
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: COLORS.text,
        minHeight: 100,
        textAlignVertical: 'top',
    },
    contactSupportHint: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 24,
        backgroundColor: '#EDF3FF',
        borderRadius: 20,
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#D6E4FF',
    },
    contactSupportHintText: {
        flex: 1,
        fontSize: 14,
        color: '#3366CC',
    },
    contactSupportActions: {
        flexDirection: 'row',
        gap: 12,
    },
    contactSupportCancelBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 14,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    contactSupportCancelText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
    },
    contactSupportSubmitBtn: {
        flex: 1,
        borderRadius: 14,
        overflow: 'hidden',
    },
    contactSupportSubmitGradient: {
        flexDirection: 'row',
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    contactSupportSubmitText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    termsOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 24,
    },
    termsModal: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 24,
        maxHeight: '85%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
    },
    termsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    termsTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    termsIconWrap: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    termsTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.text,
    },
    termsCloseBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    termsScroll: {
        maxHeight: 320,
    },
    termsScrollContent: {
        paddingBottom: 16,
    },
    termsSection: {
        marginBottom: 18,
    },
    termsSectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 6,
    },
    termsSectionText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        lineHeight: 22,
    },
    termsUnderstandBtn: {
        marginTop: 16,
        borderRadius: 14,
        overflow: 'hidden',
    },
    termsUnderstandGradient: {
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    termsUnderstandText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
    fab: {
        position: 'absolute',
        bottom: 100,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        overflow: 'hidden',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    fabGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default SettingsScreen;
