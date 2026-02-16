import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Alert,
    Share,
    Platform,
    Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
    MessageCircle,
    Heart,
    Share2,
    LogOut,
    Copy,
    ArrowLeft,
    MoreVertical,
    Shield,
    BookOpen,
} from 'lucide-react-native';
import { COLORS, SHADOWS, GRADIENTS } from '../constants/theme';
import { useUser } from '../context/UserContext';
import { getProfile } from '../services/profileApi';

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

    const loadProfile = useCallback(async () => {
        if (!token) return;
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

    const displayName = profile?.userName || user?.name || 'Student';
    const handleStr = '@' + (displayName.toLowerCase().replace(/\s+/g, '') || 'user');
    const wolioId = profile?.wolioId || user?.wolioId || '—';
    const userCourses = profile?.userCourses ?? 0;
    const joinedYear = profile?.joinedYear ? `Joined January ${profile.joinedYear}` : '';

    if (loading && !profile) {
        return (
            <View style={styles.loadingContainer}>
                <LinearGradient colors={[COLORS.background, '#F8F5FF']} style={StyleSheet.absoluteFill} />
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Loading profile...</Text>
            </View>
        );
    }

    const activityItems = [
        ...(profile?.activity || []).map((a, i) => ({
            id: `act-${a.bookTitle}-${a.lastChapterNumber}`,
            type: 'chapter',
            icon: Trophy,
            iconBg: COLORS.primary,
            title: `Completed ${a.bookTitle} Chapter ${a.lastChapterNumber}`,
            description: `${a.lastChapterRead || 'Chapter'} mastered! 65% course progress.`,
            progressPercent: 65,
            timeAgo: getTimeAgo(a.lastDateRead),
            reads: 24,
            comments: 5,
            likes: 24,
        })),
        { id: 'streak', type: 'streak', icon: Flame, iconBg: '#F97316', title: '15 Day Streak! 🔥', description: 'Studied consistently for 15 days straight. Keep it up!', timeAgo: '1 day ago', likes: 48, comments: 12 },
        { id: 'course', type: 'course', icon: BookOpen, iconBg: COLORS.primary, title: 'Started a new course', description: 'Beginning Calculus Fundamentals - Chapter 1: Limits', timeAgo: '3 days ago', likes: 15, comments: 3 },
        { id: 'quiz', type: 'quiz', icon: Star, iconBg: '#22C55E', title: 'Perfect Quiz Score!', description: 'Scored 100% on Quantum Physics Quiz #8', timeAgo: '5 days ago', likes: 62, comments: 18 },
    ].slice(0, 6);

    const achievementItems = profile?.achievements || [];

    return (
        <View style={styles.container}>
            <LinearGradient colors={[COLORS.background, '#F8F5FF', '#FFFFFF']} style={StyleSheet.absoluteFill} />
            <SafeAreaView style={styles.safeArea}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.8}
                >
                    <ArrowLeft size={24} color={COLORS.text} />
                </TouchableOpacity>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Cover */}
                    <View style={styles.coverWrap}>
                        <LinearGradient
                            colors={['#A855F7', '#C084FC', '#EC4899', '#F97316']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.cover}
                        />
                        <TouchableOpacity style={styles.editCoverBtn} activeOpacity={0.8}>
                            <Camera size={16} color={COLORS.text} />
                            <Text style={styles.editCoverText}>Edit Cover</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Avatar */}
                    <View style={styles.avatarSection}>
                        <View style={styles.avatarWrap}>
                            {profile?.profilePhoto ? (
                                <Image source={{ uri: profile.profilePhoto }} style={styles.avatar} />
                            ) : (
                                <LinearGradient colors={GRADIENTS.primary} style={styles.avatarPlaceholder}>
                                    <Text style={styles.avatarInitial}>{displayName.charAt(0)}</Text>
                                </LinearGradient>
                            )}
                            <TouchableOpacity style={styles.avatarEditBtn} activeOpacity={0.8}>
                                <LinearGradient colors={GRADIENTS.primary} style={styles.avatarEditGradient}>
                                    <Camera size={14} color="#fff" />
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.nameRow}>
                            <Text style={styles.userName}>{displayName} <Text style={styles.onlineDot}>●</Text></Text>
                            <TouchableOpacity style={styles.moreOptionsBtn} hitSlop={12}>
                                <MoreVertical size={22} color={COLORS.text} />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.handle}>{handleStr}</Text>

                        {/* Wolio ID - single line tag */}
                        <TouchableOpacity style={styles.wolioIdCard} onPress={handleCopyWolioId} activeOpacity={0.8}>
                            <Shield size={18} color={COLORS.primary} style={styles.wolioIdShield} />
                            <Text style={styles.wolioIdValueInline}>WOLIO ID {wolioId}</Text>
                            <Copy size={18} color={COLORS.primary} />
                        </TouchableOpacity>

                        {profile?.userBio ? (
                            <Text style={styles.bio}>{profile.userBio}</Text>
                        ) : null}

                        {/* Meta row */}
                        <View style={styles.metaRow}>
                            {profile?.location ? (
                                <View style={styles.metaItem}>
                                    <MapPin size={14} color={COLORS.textSecondary} />
                                    <Text style={styles.metaText}>{profile.location}</Text>
                                </View>
                            ) : null}
                            <TouchableOpacity
                                style={styles.metaItem}
                                onPress={() => {
                                    const url = profile?.website || 'emmastudies.com';
                                    Linking.openURL(url.startsWith('http') ? url : `https://${url}`);
                                }}
                                activeOpacity={0.7}
                            >
                                <LinkIcon size={14} color={COLORS.textSecondary} />
                                <Text style={[styles.metaText, styles.metaLink]}>
                                    {profile?.website || 'emmastudies.com'}
                                </Text>
                            </TouchableOpacity>
                            {joinedYear ? (
                                <View style={styles.metaItem}>
                                    <Calendar size={14} color={COLORS.textSecondary} />
                                    <Text style={styles.metaText}>{joinedYear}</Text>
                                </View>
                            ) : null}
                        </View>
                        <Text style={styles.coursesCount}>{userCourses} Course{userCourses !== 1 ? 's' : ''}</Text>

                        {/* Edit Profile + Settings */}
                        <View style={styles.actionRow}>
                            <TouchableOpacity style={styles.editProfileBtn} activeOpacity={0.85}>
                                <LinearGradient colors={GRADIENTS.primary} style={styles.editProfileGradient}>
                                    <Pencil size={18} color="#fff" />
                                    <Text style={styles.editProfileText}>Edit Profile</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.settingsBtn} activeOpacity={0.8}>
                                <Settings size={24} color={COLORS.textSecondary} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Tabs */}
                    <View style={styles.tabsRow}>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'activity' && styles.tabActive]}
                            onPress={() => setActiveTab('activity')}
                            activeOpacity={0.8}
                        >
                            {activeTab === 'activity' ? (
                                <LinearGradient colors={GRADIENTS.primary} style={styles.tabActiveGradient}>
                                    <Text style={styles.tabTextActive}>Activity</Text>
                                </LinearGradient>
                            ) : (
                                <Text style={styles.tabText}>Activity</Text>
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'achievements' && styles.tabActive]}
                            onPress={() => setActiveTab('achievements')}
                            activeOpacity={0.8}
                        >
                            <Text style={[styles.tabText, activeTab === 'achievements' && styles.tabTextActivePlain]}>Achievements</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Content */}
                    {activeTab === 'activity' && (
                        <View style={styles.cardsSection}>
                            {activityItems.map((item) => {
                                const IconComponent = item.icon;
                                const isChapter = item.type === 'chapter';
                                return (
                                    <View key={item.id} style={styles.activityCard}>
                                        <View style={[styles.activityIconWrap, { backgroundColor: item.iconBg + '22' }]}>
                                            <IconComponent size={22} color={item.iconBg} />
                                        </View>
                                        <View style={styles.activityBody}>
                                            <Text style={styles.activityTitle}>{item.title}</Text>
                                            <Text style={styles.activityDesc}>{item.description}</Text>
                                            {isChapter && item.progressPercent != null && (
                                                <View style={styles.progressBarWrap}>
                                                    <LinearGradient
                                                        colors={GRADIENTS.primary}
                                                        start={{ x: 0, y: 0 }}
                                                        end={{ x: 1, y: 0 }}
                                                        style={[styles.progressBarFill, { width: `${item.progressPercent}%` }]}
                                                    />
                                                </View>
                                            )}
                                            <Text style={styles.activityTime}>{item.timeAgo}</Text>
                                            <View style={styles.activityActions}>
                                                {isChapter ? (
                                                    <>
                                                        <View style={styles.activityAction}>
                                                            <BookOpen size={16} color={COLORS.textSecondary} />
                                                            <Text style={styles.activityActionText}>{item.reads ?? 24}</Text>
                                                        </View>
                                                        <View style={styles.activityAction}>
                                                            <MessageCircle size={16} color={COLORS.textSecondary} />
                                                            <Text style={styles.activityActionText}>{item.comments ?? 0}</Text>
                                                        </View>
                                                        <TouchableOpacity onPress={() => handleShare(item)}>
                                                            <Share2 size={16} color={COLORS.textSecondary} />
                                                        </TouchableOpacity>
                                                    </>
                                                ) : (
                                                    <>
                                                        <View style={styles.activityAction}>
                                                            <Heart size={16} color={COLORS.textSecondary} />
                                                            <Text style={styles.activityActionText}>{item.likes ?? 0}</Text>
                                                        </View>
                                                        <View style={styles.activityAction}>
                                                            <MessageCircle size={16} color={COLORS.textSecondary} />
                                                            <Text style={styles.activityActionText}>{item.comments ?? 0}</Text>
                                                        </View>
                                                        <TouchableOpacity onPress={() => handleShare(item)}>
                                                            <Share2 size={16} color={COLORS.textSecondary} />
                                                        </TouchableOpacity>
                                                    </>
                                                )}
                                            </View>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    )}

                    {activeTab === 'achievements' && (
                        <View style={styles.cardsSection}>
                            {achievementItems.length === 0 ? (
                                <Text style={styles.emptyText}>No achievements yet. Keep learning!</Text>
                            ) : (
                                achievementItems.map((a, i) => (
                                    <View key={a.achievementTitle + i} style={styles.activityCard}>
                                        <View style={[styles.activityIconWrap, { backgroundColor: COLORS.primary + '22' }]}>
                                            <Trophy size={22} color={COLORS.primary} />
                                        </View>
                                        <View style={styles.activityBody}>
                                            <Text style={styles.activityTitle}>{a.achievementTitle}</Text>
                                            <Text style={styles.activityDesc}>{a.achievement}</Text>
                                            <Text style={styles.activityTime}>{a.achievementDate}</Text>
                                        </View>
                                    </View>
                                ))
                            )}
                        </View>
                    )}

                    {/* Sign Out - white bg, red border */}
                    <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut} activeOpacity={0.8}>
                        <LogOut size={20} color={COLORS.danger} />
                        <Text style={styles.signOutText}>Sign Out</Text>
                    </TouchableOpacity>

                    <View style={{ height: 100 }} />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    safeArea: { flex: 1 },
    scrollView: { flex: 1 },
    scrollContent: { paddingBottom: 24 },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: { marginTop: 12, fontSize: 15, color: COLORS.textSecondary },

    backButton: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 56 : 44,
        left: 16,
        zIndex: 10,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.small,
    },

    coverWrap: { position: 'relative', height: 140 },
    cover: { width: '100%', height: '100%' },
    editCoverBtn: {
        position: 'absolute',
        top: 12,
        right: 16,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.9)',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        ...SHADOWS.small,
    },
    editCoverText: { fontSize: 13, fontWeight: '600', color: COLORS.text, marginLeft: 6 },

    avatarSection: { alignItems: 'center', paddingHorizontal: 24, marginTop: -50, marginBottom: 20 },
    avatarWrap: { position: 'relative', marginBottom: 12 },
    avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 4, borderColor: '#fff', backgroundColor: '#f0f0f0' },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarInitial: { fontSize: 36, fontWeight: '700', color: '#fff' },
    avatarEditBtn: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        borderRadius: 18,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#fff',
    },
    avatarEditGradient: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
        width: '100%',
        position: 'relative',
    },
    userName: { fontSize: 24, fontWeight: '700', color: COLORS.text },
    onlineDot: { fontSize: 12, color: '#3B82F6' },
    moreOptionsBtn: { position: 'absolute', right: 0, padding: 8, zIndex: 1 },
    handle: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 14 },
    wolioIdCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(168, 85, 247, 0.12)',
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 14,
        marginBottom: 12,
        width: '100%',
        maxWidth: 300,
    },
    wolioIdShield: { marginRight: 8 },
    wolioIdValueInline: { flex: 1, fontSize: 14, fontWeight: '700', color: COLORS.text },
    bio: {
        fontSize: 14,
        color: COLORS.text,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 12,
    },
    metaRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 6 },
    metaItem: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 8, marginBottom: 6 },
    metaText: { fontSize: 13, color: COLORS.textSecondary, marginLeft: 6 },
    metaLink: { color: '#3B82F6', fontWeight: '500' },
    coursesCount: { fontSize: 17, fontWeight: '700', color: COLORS.text, marginBottom: 16 },
    actionRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, width: '100%' },
    editProfileBtn: { flex: 1, borderRadius: 14, overflow: 'hidden', marginRight: 12 },
    editProfileGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 48,
        paddingHorizontal: 20,
    },
    editProfileText: { fontSize: 15, fontWeight: '600', color: '#fff', marginLeft: 8 },
    settingsBtn: { padding: 8 },

    tabsRow: { flexDirection: 'row', paddingHorizontal: 24, marginBottom: 16 },
    tab: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 14,
        marginHorizontal: 4,
        alignItems: 'center',
        backgroundColor: '#fff',
        ...SHADOWS.small,
    },
    tabActive: { overflow: 'hidden' },
    tabActiveGradient: {
        ...StyleSheet.absoluteFillObject,
        paddingVertical: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabText: { fontSize: 15, fontWeight: '600', color: COLORS.textSecondary },
    tabTextActive: { fontSize: 15, fontWeight: '700', color: '#fff' },
    tabTextActivePlain: { color: COLORS.primary },

    cardsSection: { paddingHorizontal: 24 },
    activityCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: 16,
        marginBottom: 14,
        ...SHADOWS.small,
    },
    activityIconWrap: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    activityBody: { flex: 1 },
    activityTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
    activityDesc: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 6 },
    progressBarWrap: {
        height: 6,
        borderRadius: 3,
        backgroundColor: '#E5E7EB',
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 3,
    },
    activityTime: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 10 },
    activityActions: { flexDirection: 'row', alignItems: 'center' },
    activityAction: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
    activityActionText: { fontSize: 13, color: COLORS.textSecondary, marginLeft: 6 },
    emptyText: { fontSize: 15, color: COLORS.textSecondary, textAlign: 'center', paddingVertical: 24 },

    signOutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 24,
        marginHorizontal: 24,
        height: 52,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: COLORS.danger,
        backgroundColor: '#FFFFFF',
    },
    signOutText: { fontSize: 16, fontWeight: '600', color: COLORS.danger, marginLeft: 10 },
});

export default ProfileScreen;
