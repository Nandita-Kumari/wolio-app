import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    Pressable,
    Image,
    ActivityIndicator,
    Alert,
    Share,
    Platform,
    Linking,
    Modal,
    TextInput,
    KeyboardAvoidingView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Text as SvgText } from 'react-native-svg';
import {
    Camera,
    Pencil,
    Settings,
    MapPin,
    Link as LinkIcon,
    Calendar,
    Trophy,
    Flame,
    Star,
    Zap,
    Award,
    Users,
    MessageCircle,
    Heart,
    Share2,
    LogOut,
    Copy,
    ArrowLeft,
    BookOpen,
    Sparkles,
    Check,
    Shield,
    User,
    X,
    Save,
} from 'lucide-react-native';
import { COLORS, SHADOWS, GRADIENTS } from '../constants/theme';
import { useUser } from '../context/UserContext';
import { getProfile, updateProfile } from '../services/profileApi';

const getTimeAgo = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    return d.toLocaleDateString();
};

const ProfileScreen = ({ navigation }) => {
    const { user, token, logout } = useUser();
    const [activeTab, setActiveTab] = useState('activity');
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editVisible, setEditVisible] = useState(false);
    const [editSaving, setEditSaving] = useState(false);
    const [editUserName, setEditUserName] = useState('');
    const [editHandle, setEditHandle] = useState('');
    const [editUserBio, setEditUserBio] = useState('');
    const [editLocation, setEditLocation] = useState('');
    const [editWebsite, setEditWebsite] = useState('');

    const loadProfile = useCallback(async () => {
        if (!token) {
            setLoading(false);
            setError(null);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const data = await getProfile(token);
            setProfile(data);
        } catch (e) {
            setError(e.message || 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    }, [token]);

    const openEditModal = () => {
        const dn = profile?.userName ?? user?.name ?? '';
        const h = profile?.handle ?? (dn ? '@' + dn.toLowerCase().replace(/\s+/g, '') : '') ?? '@user';
        const w = profile?.website ?? 'learnflow.com';
        setEditUserName(dn);
        setEditHandle(h);
        setEditUserBio(profile?.userBio ?? '');
        setEditLocation(profile?.location ?? '');
        setEditWebsite(w);
        setEditVisible(true);
    };

    const handleSaveProfile = async () => {
        if (!token) return;
        setEditSaving(true);
        try {
            const updated = await updateProfile(token, {
                userName: editUserName.trim() || undefined,
                userBio: editUserBio.trim() || undefined,
                location: editLocation.trim() || undefined,
                website: editWebsite.trim() || undefined,
                handle: editHandle.trim() || undefined,
            });
            setProfile(updated);
            setEditVisible(false);
        } catch (e) {
            Alert.alert('Error', e.message || 'Failed to update profile');
        } finally {
            setEditSaving(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    const handleCopyWolioId = () => {
        const id = profile?.wolioId || user?.wolioId || '';
        if (id) {
            // Clipboard would go here; for now show alert
            Alert.alert('Copied', `Wolio ID: ${id}`);
        }
    };

    const handleSignOut = () => {
        Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Sign Out', style: 'destructive', onPress: () => logout() },
        ]);
    };

    const handleShare = (item) => {
        const text = item.title ? `${item.title}\n${item.description || ''}` : item.achievementTitle;
        Share.share({ message: text, title: 'Wolio' });
    };

    const displayName = profile?.userName || user?.name || (token ? 'Student' : 'Guest Learner');
    const handleStr = profile?.handle || (token ? '@' + (displayName.toLowerCase().replace(/\s+/g, '') || 'user') : '@guest');
    const wolioId = profile?.wolioId || user?.wolioId || (token ? '—' : 'WL-2024-ET-3456');
    const userCourses = profile?.userCourses ?? 12;
    const joinedStr = profile?.joinedDate || (profile?.joinedYear ? `Joined January ${profile.joinedYear}` : '') || 'Joined February 2026';

    if (loading && token && !profile) {
        return (
            <View style={styles.loadingContainer}>
                <LinearGradient colors={[COLORS.background, '#F8F5FF']} style={StyleSheet.absoluteFill} />
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Loading profile...</Text>
            </View>
        );
    }

    const activityItems = [
        { id: 'chapter', icon: Trophy, iconGradient: ['#C084FC', '#EC4899'], title: 'Completed Quantum Mechanics Chapter 12', description: 'Wave Functions mastered! 65% course progress', timeAgo: '2 hours ago', comments: 5, likes: 24, hasSparkle: true },
        { id: 'streak', icon: Flame, iconGradient: ['#EF4444', '#F97316'], title: '15 Day Streak! 🔥', description: 'Studied consistently for 15 days straight. Keep it up!', timeAgo: '1 day ago', likes: 48, comments: 12, hasSparkle: false },
        { id: 'course', icon: BookOpen, iconGradient: ['#C084FC', '#EC4899'], title: 'Started a new course', description: 'Beginning Calculus Fundamentals - Chapter 1: Limits', timeAgo: '3 days ago', likes: 15, comments: 3, hasSparkle: false },
        { id: 'quiz', icon: Star, iconGradient: ['#10B981', '#14B8A6'], title: 'Perfect Quiz Score!', description: 'Scored 100% on Quantum Physics Quiz #8', timeAgo: '5 days ago', likes: 62, comments: 18, hasSparkle: false },
    ];

    const defaultAchievements = [
        { id: 'quick', title: 'Quick Learner', description: 'Complete 5 lessons in one day', icon: Zap, iconGradient: ['#FBBF24', '#F59E0B'], completed: true, date: 'Feb 1, 2024' },
        { id: 'streak', title: 'Streak Master', description: 'Maintain 15 day streak', icon: Flame, iconGradient: ['#EF4444', '#F97316'], completed: true, date: 'Feb 10, 2024' },
        { id: 'perfect', title: 'Perfect Score', description: 'Get 100% on a quiz', icon: Star, iconGradient: ['#C084FC', '#EC4899'], completed: true, date: 'Feb 7, 2024' },
        { id: 'finisher', title: 'Course Finisher', description: 'Complete your first course', icon: Trophy, iconGradient: ['#FBBF24', '#F59E0B'], completed: false, date: null },
        { id: 'nightowl', title: 'Night Owl', description: 'Study after midnight', icon: Award, iconGradient: ['#C084FC', '#E9D5FF'], completed: false, date: null },
        { id: 'social', title: 'Social Learner', description: 'Help 10 other students', icon: Users, iconGradient: ['#EC4899', '#F472B6'], completed: true, date: 'Feb 15, 2024' },
    ];
    const achievementItems = defaultAchievements;

    const location = profile?.location || 'San Francisco, CA';
    const website = profile?.website || 'emmastudies.com';

    return (
        <View style={styles.container}>
            <LinearGradient colors={[COLORS.background, '#F8F5FF', '#FFFFFF']} style={StyleSheet.absoluteFill} />
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.scrollWrapper}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={true}
                    bounces={true}
                    overScrollMode="always"
                >
                    {/* Top Nav: Back + Back to Dashboard */}
                    <View style={styles.topNav}>
                        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.8}>
                            <ArrowLeft size={22} color={COLORS.text} />
                        </TouchableOpacity>
                        <Text style={styles.backToDashboard}>Back to Dashboard</Text>
                    </View>
                    {/* Banner with avatar overlay and settings */}
                    <View style={styles.bannerWrap}>
                        <LinearGradient
                            colors={['#F97316', '#EC4899', '#A855F7', '#6366F1']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.banner}
                        />
                        <TouchableOpacity style={styles.settingsBannerBtn} activeOpacity={0.8}>
                            <LinearGradient colors={GRADIENTS.primary} style={styles.settingsBannerGradient}>
                                <Settings size={18} color="#fff" />
                            </LinearGradient>
                        </TouchableOpacity>
                        <View style={styles.avatarOverlay}>
                            <View style={styles.avatarWrap}>
                                {profile?.profilePhoto ? (
                                    <Image source={{ uri: profile.profilePhoto }} style={styles.avatar} />
                                ) : (
                                    <View style={styles.avatarPlaceholder} />
                                )}
                                <TouchableOpacity style={styles.avatarEditBtn} activeOpacity={0.8}>
                                    <LinearGradient colors={GRADIENTS.primary} style={styles.avatarEditGradient}>
                                        <Camera size={14} color="#fff" />
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* Profile info - left aligned */}
                    <View style={styles.profileSection}>
                        <Text style={styles.userName}>{displayName} <Text style={styles.onlineDot}>●</Text></Text>
                        <Text style={styles.handle}>{handleStr}</Text>

                        <TouchableOpacity style={styles.wolioIdCard} onPress={handleCopyWolioId} activeOpacity={0.8}>
                            <LinearGradient
                                colors={['#6366F1', '#C084FC']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.wolioIdShieldWrap}
                            >
                                <Shield size={20} color="#fff" strokeWidth={2} />
                            </LinearGradient>
                            <View style={styles.wolioIdCenter}>
                                <Text style={styles.wolioIdLabel}>WOLIO ID</Text>
                                <Text style={styles.wolioIdValue}>{wolioId}</Text>
                            </View>
                            <Copy size={20} color="#8247E5" strokeWidth={2} />
                        </TouchableOpacity>

                        {!token && <Text style={styles.browsingStatus}>Browsing as guest</Text>}

                        <View style={styles.metaRow}>
                            <View style={styles.metaItem}>
                                <MapPin size={14} color={COLORS.textSecondary} />
                                <Text style={styles.metaText}>{location}</Text>
                            </View>
                            <TouchableOpacity style={styles.metaItem} onPress={() => Linking.openURL(website.startsWith('http') ? website : `https://${website}`)} activeOpacity={0.7}>
                                <LinkIcon size={14} color={COLORS.textSecondary} />
                                <Text style={[styles.metaText, styles.metaLink]}>{website}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.metaRow}>
                            <View style={styles.metaItem}>
                                <Calendar size={14} color={COLORS.textSecondary} />
                                <Text style={styles.metaText}>{joinedStr}</Text>
                            </View>
                        </View>
                        <Text style={styles.coursesCount}>{userCourses} Courses</Text>

                        <TouchableOpacity style={styles.editProfileBtn} onPress={token ? openEditModal : undefined} activeOpacity={0.85}>
                            <Pencil size={18} color={COLORS.text} />
                            <Text style={styles.editProfileText}>Edit Profile</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Tabs */}
                    <View style={styles.tabsRow}>
                        <Pressable
                            style={[styles.tab, activeTab === 'activity' && styles.tabActive]}
                            onPress={() => setActiveTab('activity')}
                        >
                            {activeTab === 'activity' ? (
                                <LinearGradient colors={GRADIENTS.primary} style={styles.tabActiveGradient}>
                                    <Text style={styles.tabTextActive}>Activity</Text>
                                </LinearGradient>
                            ) : (
                                <Text style={styles.tabText}>Activity</Text>
                            )}
                        </Pressable>
                        <Pressable
                            style={[styles.tab, activeTab === 'achievements' && styles.tabActive]}
                            onPress={() => setActiveTab('achievements')}
                        >
                            {activeTab === 'achievements' ? (
                                <LinearGradient colors={GRADIENTS.primary} style={styles.tabActiveGradient}>
                                    <Text style={styles.tabTextActive}>Achievements</Text>
                                </LinearGradient>
                            ) : (
                                <Text style={styles.tabText}>Achievements</Text>
                            )}
                        </Pressable>
                    </View>

                    {/* Tab content */}
                    <View style={styles.tabContent}>
                    {activeTab === 'activity' && (
                        <View style={styles.cardsSection}>
                            {activityItems.map((item) => {
                                const IconComponent = item.icon;
                                return (
                                    <View key={item.id} style={styles.activityCard}>
                                        <LinearGradient colors={item.iconGradient} style={styles.activityIconWrap}>
                                            <IconComponent size={24} color="#fff" strokeWidth={2} />
                                        </LinearGradient>
                                        <View style={styles.activityBody}>
                                            <Text style={styles.activityTitle}>{item.title}</Text>
                                            <Text style={styles.activityDesc}>{item.description}</Text>
                                            <Text style={styles.activityTime}>{item.timeAgo}</Text>
                                            <View style={styles.activityActions}>
                                                <View style={styles.activityAction}>
                                                    <Heart size={16} color={COLORS.textSecondary} />
                                                    <Text style={styles.activityActionText}>{item.likes}</Text>
                                                </View>
                                                <View style={styles.activityAction}>
                                                    <MessageCircle size={16} color={COLORS.textSecondary} />
                                                    <Text style={styles.activityActionText}>{item.comments}</Text>
                                                </View>
                                                <TouchableOpacity onPress={() => handleShare(item)}>
                                                    <Share2 size={16} color={COLORS.textSecondary} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        {item.hasSparkle && (
                                            <TouchableOpacity style={styles.sparkleBtn} activeOpacity={0.8}>
                                                <LinearGradient colors={GRADIENTS.primary} style={styles.sparkleGradient}>
                                                    <Sparkles size={18} color="#fff" />
                                                </LinearGradient>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                );
                            })}
                        </View>
                    )}

                    {activeTab === 'achievements' && (
                        <View style={styles.achievementsGrid}>
                            {achievementItems.map((item) => {
                                const IconComponent = item.icon;
                                return (
                                    <View key={item.id} style={styles.achievementCard}>
                                        <LinearGradient
                                            colors={['#FFFFFF', '#FFF7ED', '#FFF1F2']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                            style={styles.achievementCardGradient}
                                        >
                                            {item.completed && (
                                                <View style={styles.achievementCheck}>
                                                    <Check size={12} color="#fff" strokeWidth={3} />
                                                </View>
                                            )}
                                            <View style={styles.achievementBadgeWrap}>
                                                <LinearGradient colors={item.iconGradient} style={styles.achievementBadge}>
                                                    <IconComponent size={24} color="#fff" strokeWidth={2} />
                                                </LinearGradient>
                                            </View>
                                            <Text style={styles.achievementCardTitle}>{item.title}</Text>
                                            <Text style={styles.achievementCardDesc}>{item.description}</Text>
                                            {item.completed && item.date && (
                                                <View style={styles.achievementDateBadge}>
                                                    <Text style={styles.achievementDateText}>{item.date}</Text>
                                                </View>
                                            )}
                                        </LinearGradient>
                                    </View>
                                );
                            })}
                        </View>
                    )}
                    </View>

                    <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut} activeOpacity={0.8}>
                        <LogOut size={20} color={COLORS.danger} />
                        <Text style={styles.signOutText}>Sign Out</Text>
                    </TouchableOpacity>

                    <View style={{ height: 100 }} />
                </ScrollView>
                </View>
            </SafeAreaView>

            {/* Edit Profile Modal - Popup */}
            <Modal visible={editVisible} animationType="fade" transparent>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalOverlay}>
                    <TouchableOpacity
                        style={styles.modalBackdrop}
                        activeOpacity={1}
                        onPress={() => !editSaving && setEditVisible(false)}
                    />
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <View style={styles.modalTitleWrap}>
                                <Svg width={160} height={28}>
                                    <Defs>
                                        <SvgLinearGradient id="editProfileGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <Stop offset="0%" stopColor="#8B5CF6" />
                                            <Stop offset="50%" stopColor="#D946EF" />
                                            <Stop offset="100%" stopColor="#EC4899" />
                                        </SvgLinearGradient>
                                    </Defs>
                                    <SvgText
                                        x={0}
                                        y={22}
                                        fill="url(#editProfileGrad)"
                                        fontSize={22}
                                        fontWeight="bold"
                                    >
                                        Edit Profile
                                    </SvgText>
                                </Svg>
                            </View>
                            <TouchableOpacity
                                style={styles.modalCloseBtn}
                                onPress={() => !editSaving && setEditVisible(false)}
                                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                            >
                                <X size={22} color={COLORS.text} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView
                            style={styles.modalScroll}
                            contentContainerStyle={styles.modalScrollContent}
                            showsVerticalScrollIndicator={true}
                            keyboardShouldPersistTaps="handled"
                            bounces={true}
                        >
                            <View style={styles.modalField}>
                                <User size={18} color={COLORS.textSecondary} style={styles.modalFieldIcon} />
                                <View style={styles.modalFieldBody}>
                                    <Text style={styles.modalFieldLabel}>Full Name</Text>
                                    <TextInput
                                        style={styles.modalInput}
                                        placeholder="Full name"
                                        placeholderTextColor={COLORS.textSecondary}
                                        value={editUserName}
                                        onChangeText={setEditUserName}
                                        autoCapitalize="words"
                                    />
                                </View>
                            </View>
                            <View style={styles.modalField}>
                                <User size={18} color={COLORS.textSecondary} style={styles.modalFieldIcon} />
                                <View style={styles.modalFieldBody}>
                                    <Text style={styles.modalFieldLabel}>Username</Text>
                                    <TextInput
                                        style={styles.modalInput}
                                        placeholder="@username"
                                        placeholderTextColor={COLORS.textSecondary}
                                        value={editHandle}
                                        onChangeText={setEditHandle}
                                        autoCapitalize="none"
                                    />
                                </View>
                            </View>
                            <View style={styles.modalField}>
                                <Pencil size={18} color={COLORS.textSecondary} style={styles.modalFieldIcon} />
                                <View style={styles.modalFieldBody}>
                                    <Text style={styles.modalFieldLabel}>Bio</Text>
                                    <TextInput
                                        style={[styles.modalInput, styles.modalInputMultiline]}
                                        placeholder="Tell us about yourself..."
                                        placeholderTextColor={COLORS.textSecondary}
                                        value={editUserBio}
                                        onChangeText={setEditUserBio}
                                        multiline
                                        numberOfLines={3}
                                    />
                                </View>
                            </View>
                            <View style={styles.modalField}>
                                <MapPin size={18} color={COLORS.textSecondary} style={styles.modalFieldIcon} />
                                <View style={styles.modalFieldBody}>
                                    <Text style={styles.modalFieldLabel}>Location</Text>
                                    <TextInput
                                        style={styles.modalInput}
                                        placeholder="San Francisco, CA"
                                        placeholderTextColor={COLORS.textSecondary}
                                        value={editLocation}
                                        onChangeText={setEditLocation}
                                    />
                                </View>
                            </View>
                            <View style={styles.modalField}>
                                <LinkIcon size={18} color={COLORS.textSecondary} style={styles.modalFieldIcon} />
                                <View style={styles.modalFieldBody}>
                                    <Text style={styles.modalFieldLabel}>Website</Text>
                                    <TextInput
                                        style={styles.modalInput}
                                        placeholder="learnflow.com"
                                        placeholderTextColor={COLORS.textSecondary}
                                        value={editWebsite}
                                        onChangeText={setEditWebsite}
                                        autoCapitalize="none"
                                        keyboardType="url"
                                    />
                                </View>
                            </View>
                        </ScrollView>
                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={styles.modalCancelBtn}
                                onPress={() => setEditVisible(false)}
                                disabled={editSaving}
                            >
                                <Text style={styles.modalCancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalSaveBtn}
                                onPress={handleSaveProfile}
                                disabled={editSaving}
                                activeOpacity={0.8}
                            >
                                <LinearGradient colors={GRADIENTS.primary} style={styles.modalSaveGradient}>
                                    {editSaving ? (
                                        <ActivityIndicator size="small" color="#fff" />
                                    ) : (
                                        <>
                                            <Save size={18} color="#fff" style={{ marginRight: 8 }} />
                                            <Text style={styles.modalSaveText}>Save Changes</Text>
                                        </>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    safeArea: { flex: 1 },
    scrollWrapper: { flex: 1, minHeight: 0 },
    scrollView: { flex: 1 },
    scrollContent: { paddingBottom: 120 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 12, fontSize: 15, color: COLORS.textSecondary },

    topNav: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        paddingTop: Platform.OS === 'ios' ? 8 : 12,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        ...SHADOWS.small,
    },
    backToDashboard: { fontSize: 15, fontWeight: '600', color: COLORS.text },

    bannerWrap: { position: 'relative', height: 160 },
    banner: { width: '100%', height: '100%', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
    settingsBannerBtn: {
        position: 'absolute',
        bottom: -45,
        right: 24,
        borderRadius: 20,
        overflow: 'hidden',
    },
    settingsBannerGradient: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarOverlay: {
        position: 'absolute',
        bottom: -44,
        left: 24,
    },
    avatarWrap: { position: 'relative' },
    avatar: { width: 88, height: 88, borderRadius: 44, borderWidth: 3, borderColor: '#fff', backgroundColor: '#E9D5FF' },
    avatarPlaceholder: { width: 88, height: 88, borderRadius: 44, borderWidth: 3, borderColor: '#fff', backgroundColor: '#E9D5FF' },
    avatarEditBtn: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#fff',
    },
    avatarEditGradient: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },

    profileSection: { paddingHorizontal: 24, paddingTop: 56, marginBottom: 20 },
    userName: { fontSize: 22, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
    onlineDot: { fontSize: 14, color: '#3B82F6' },
    handle: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 12 },
    wolioIdCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F7F2FF',
        borderRadius: 999,
        paddingVertical: 12,
        paddingLeft: 12,
        paddingRight: 20,
        marginBottom: 14,
        shadowColor: '#8247E5',
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 6,
    },
    wolioIdShieldWrap: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    wolioIdCenter: { flex: 1 },
    wolioIdLabel: {
        fontSize: 11,
        fontWeight: '600',
        letterSpacing: 0.5,
        color: '#8247E5',
        marginBottom: 2,
    },
    wolioIdValue: {
        fontSize: 17,
        fontWeight: '700',
        color: '#2A2A2A',
    },
    browsingStatus: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 12 },
    metaRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
    metaItem: { flexDirection: 'row', alignItems: 'center', marginRight: 16, marginBottom: 6 },
    metaText: { fontSize: 13, color: COLORS.textSecondary, marginLeft: 6 },
    metaLink: { color: '#9810FA', fontWeight: '500' },
    coursesCount: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 20 },
    editProfileBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 14,
        backgroundColor: '#fff',
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        marginBottom: 24,
    },
    editProfileText: { fontSize: 15, fontWeight: '600', color: COLORS.text, marginLeft: 8 },

    tabsRow: { flexDirection: 'row', paddingHorizontal: 24, marginBottom: 16, gap: 12 },
    tab: { flex: 1, paddingVertical: 14, borderRadius: 14, alignItems: 'center', overflow: 'hidden', position: 'relative' },
    tabActive: { overflow: 'hidden' },
    tabInactive: { backgroundColor: '#F3F4F6' },
    tabActiveGradient: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabText: { fontSize: 15, fontWeight: '600', color: COLORS.textSecondary },
    tabTextActive: { fontSize: 15, fontWeight: '700', color: '#fff' },

    cardsSection: { paddingHorizontal: 24 },
    activityCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: 16,
        marginBottom: 14,
        ...SHADOWS.small,
        position: 'relative',
    },
    activityIconWrap: {
        width: 52,
        height: 52,
        borderRadius: 26,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    activityBody: { flex: 1 },
    activityTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
    activityDesc: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 8 },
    activityTime: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 10 },
    activityActions: { flexDirection: 'row', alignItems: 'center' },
    activityAction: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
    activityActionText: { fontSize: 13, color: COLORS.textSecondary, marginLeft: 6 },
    sparkleBtn: {
        position: 'absolute',
        top: 16,
        right: 16,
        borderRadius: 20,
        overflow: 'hidden',
    },
    sparkleGradient: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: { fontSize: 15, color: COLORS.textSecondary, textAlign: 'center', paddingVertical: 24 },

    tabContent: { width: '100%' },
    achievementsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 24,
        paddingTop: 4,
        justifyContent: 'space-between',
    },
    achievementCard: {
        width: (Dimensions.get('window').width - 48 - 12) / 2,
        marginBottom: 14,
        borderRadius: 18,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },
    achievementCardGradient: {
        borderRadius: 18,
        padding: 16,
        position: 'relative',
    },
    achievementCheck: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#10B981',
        borderWidth: 2,
        borderColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    achievementBadgeWrap: {
        alignSelf: 'center',
        marginBottom: 12,
    },
    achievementBadge: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    achievementCardTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 4,
        textAlign: 'center',
    },
    achievementCardDesc: {
        fontSize: 12,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: 10,
    },
    achievementDateBadge: {
        alignSelf: 'center',
        backgroundColor: '#D1FAE5',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    achievementDateText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#059669',
    },

    signOutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 24,
        marginHorizontal: 24,
        height: 52,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        backgroundColor: '#fff',
    },
    signOutText: { fontSize: 16, fontWeight: '600', color: COLORS.danger, marginLeft: 10 },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 24,
    },
    modalBackdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 24,
        maxHeight: '90%',
        shadowColor: '#dddddd',
        shadowOffset: { width: 6, height: 4 },
        shadowOpacity: 0.6,
        shadowRadius: 16,
        elevation: 17,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    modalTitleWrap: { flex: 1, alignSelf: 'flex-start', justifyContent: 'center' },
    modalCloseBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalScroll: {
        maxHeight: Math.min(Dimensions.get('window').height * 0.55, 520),
    },
    modalScrollContent: { paddingBottom: 16 },
    modalField: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 18,
    },
    modalFieldIcon: { marginTop: 24, marginRight: 12 },
    modalFieldBody: { flex: 1 },
    modalFieldLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.textSecondary,
        marginBottom: 6,
    },
    modalInput: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: COLORS.text,
        backgroundColor: '#fff',
    },
    modalInputMultiline: { minHeight: 80, textAlignVertical: 'top' },
    modalActions: {
        flexDirection: 'row',
        marginTop: 20,
        gap: 12,
    },
    modalCancelBtn: {
        flex: 1,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        backgroundColor: '#fff',
    },
    modalCancelText: { fontSize: 16, fontWeight: '600', color: COLORS.text },
    modalSaveBtn: { flex: 1, borderRadius: 14, overflow: 'hidden' },
    modalSaveGradient: {
        flexDirection: 'row',
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalSaveText: { fontSize: 16, fontWeight: '600', color: '#fff' },
});

export default ProfileScreen;
