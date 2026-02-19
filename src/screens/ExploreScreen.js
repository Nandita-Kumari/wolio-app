import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
    RefreshControl,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
    Search,
    Filter,
    Monitor,
    Users,
    Zap,
    TrendingUp,
    BookOpen,
    Palette,
    Music,
    Code,
    MessageCircle,
    ChevronRight,
    Play,
    Heart,
    Star,
    Clock,
} from 'lucide-react-native';
import { COLORS, SHADOWS, GRADIENTS } from '../constants/theme';
import GradientButton from '../components/GradientButton';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import { getExploreData } from '../services/exploreApi';

const { width } = Dimensions.get('window');
const CARD_GAP = 12;
const GRID_PADDING = 24;
const categoryCardWidth = (width - GRID_PADDING * 2 - CARD_GAP) / 2;

const ORANGE_ACCENT = '#F97316';

const CATEGORY_ICONS = {
    'quantum physics': BookOpen,
    'digital art': Palette,
    'music theory': Music,
    programming: Code,
    languages: MessageCircle,
    biology: BookOpen,
};
const defaultCategoryIcon = BookOpen;

const formatStudents = (num) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1).replace(/\.0$/, '')}k`;
    return String(num);
};

const EMPTY_STATS = { totalRegisteredCourses: 0, totalAppUsers: 0, todayNewUsers: 0 };
const levelColors = { Advanced: '#EF4444', Intermediate: '#F59E0B', Beginner: '#22C55E' };

function normalizeExploreData(data) {
    if (!data) return { stats: EMPTY_STATS, trendingList: [], categories: [], featuredCourses: [] };
    const trendingList = (data.trendingNow || []).map((t, i) => ({
        id: i + 1,
        title: t.bookName ?? t.title ?? '',
        category: t.category ?? '',
        change: `+${t.percentage ?? 0}%`,
    }));
    const categories = (data.browseCategories || []).map((c, i) => ({
        id: i + 1,
        title: c.category ?? '',
        count: c.totalBooks ?? 0,
        newBooks: c.newBooks ?? 0,
        icon: CATEGORY_ICONS[(c.category || '').toLowerCase()] || defaultCategoryIcon,
        badge: (c.newBooks ?? 0) > 0,
    }));
    const featuredCourses = (data.featuredCourses || []).map((f) => ({
        id: f.bookId ?? f.id,
        title: f.bookName ?? f.title ?? '',
        instructor: f.writerName ?? f.instructor ?? '',
        tags: [
            { label: f.category ?? 'General', color: '#A855F7' },
            { label: f.level ?? 'General', color: levelColors[f.level] || '#6B7280' },
        ],
        duration: f.duration ?? '',
        lessons: `${f.totalChapters ?? 0} lessons`,
        students: formatStudents(f.totalEnrolledUsers ?? f.enrollmentCount ?? 0),
        rating: '4.8',
        badge: null,
        bookPreviewUrl: f.bookPreviewUrl ?? f.coverImage ?? null,
    }));
    return {
        stats: {
            totalRegisteredCourses: data.totalRegisteredCourses ?? 0,
            totalAppUsers: data.totalAppUsers ?? 0,
            todayNewUsers: data.todayNewUsers ?? 0,
        },
        trendingList,
        categories,
        featuredCourses,
    };
}

const ExploreScreen = () => {
    const { token } = useUser();
    const navigation = useNavigation();

    const requireAuth = (actionName) => {
        if (token) return true;
        Alert.alert('Sign in required', `Please sign in to ${actionName}.`, [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Sign In', onPress: () => navigation.getParent()?.navigate('Login') },
        ]);
        return false;
    };
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState(null);
    const [stats, setStats] = useState(EMPTY_STATS);
    const [trendingList, setTrendingList] = useState([]);
    const [categories, setCategories] = useState([]);
    const [featuredCourses, setFeaturedCourses] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const loadExplore = useCallback(async (isRefresh = false) => {
        if (!isRefresh) setLoading(true);
        setApiError(null);
        const { data, error } = await getExploreData(token);
        const normalized = normalizeExploreData(data);
        setStats(normalized.stats);
        setTrendingList(normalized.trendingList);
        setCategories(normalized.categories);
        setFeaturedCourses(normalized.featuredCourses);
        if (normalized.categories.length && selectedCategoryId === null) {
            setSelectedCategoryId(normalized.categories[0].id);
        }
        if (error) setApiError(error);
        setLoading(false);
        setRefreshing(false);
    }, [token]);

    useEffect(() => {
        loadExplore();
    }, [loadExplore]);

    const statsDisplay = [
        { value: stats.totalRegisteredCourses ? `${stats.totalRegisteredCourses}+` : '0', label: 'COURSES', icon: Monitor },
        { value: stats.totalAppUsers >= 1000 ? `${(stats.totalAppUsers / 1000).toFixed(0)}k+` : `${stats.totalAppUsers}+`, label: 'LEARNERS', icon: Users },
        { value: String(stats.todayNewUsers), label: 'NEW TODAY', icon: Zap },
    ];

    if (loading && !trendingList.length && !categories.length) {
        return (
            <View style={styles.container}>
                <LinearGradient colors={[COLORS.background, '#F8F5FF', '#FFFFFF']} style={StyleSheet.absoluteFill} />
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.loadingWrap}>
                        <ActivityIndicator size="large" color={COLORS.primary} />
                        <Text style={styles.loadingText}>Loading explore...</Text>
                    </View>
                </SafeAreaView>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[COLORS.background, '#F8F5FF', '#FFFFFF']}
                style={StyleSheet.absoluteFill}
            />
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.scrollWrapper}>
                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={() => {
                                    setRefreshing(true);
                                    loadExplore(true);
                                }}
                                colors={[COLORS.primary]}
                                tintColor={COLORS.primary}
                            />
                        }
                    >
                        {/* Header: logo left, title + subtitle right */}
                        <View style={styles.header}>
                            <TouchableOpacity style={styles.logoButton} activeOpacity={0.8}>
                                <LinearGradient
                                    colors={GRADIENTS.primary}
                                    style={styles.logoGradient}
                                >
                                    <Text style={styles.logoText}>W</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                            <View style={styles.headerTextWrap}>
                                <Text style={styles.headerTitle}>Explore</Text>
                                <Text style={styles.headerSubtitle}>Discover your next adventure.</Text>
                            </View>
                        </View>

                        {apiError ? (
                            <TouchableOpacity style={styles.apiErrorBanner} onPress={() => loadExplore()} activeOpacity={0.9}>
                                <Text style={styles.apiErrorText}>{apiError}</Text>
                                <Text style={styles.apiErrorRetry}>Tap to retry</Text>
                            </TouchableOpacity>
                        ) : null}

                        {/* Search bar with filter */}
                        <View style={styles.searchRow}>
                            <View style={styles.searchContainer}>
                                <Search size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
                                <TextInput
                                    placeholder="Search courses, topics, instructors..."
                                    placeholderTextColor={COLORS.textSecondary}
                                    style={styles.searchInput}
                                />
                                <TouchableOpacity style={styles.filterButton} activeOpacity={0.8}>
                                    <LinearGradient
                                        colors={GRADIENTS.primary}
                                        style={styles.filterGradient}
                                    >
                                        <Filter size={18} color="#fff" />
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Stats: icon on top, number, uppercase label */}
                        <View style={styles.statsRow}>
                            {statsDisplay.map((stat, i) => (
                                <View key={i} style={styles.statCard}>
                                    <View style={styles.statIconWrap}>
                                        <LinearGradient
                                            colors={GRADIENTS.primary}
                                            style={styles.statIconGradient}
                                        >
                                            <stat.icon size={20} color="#fff" />
                                        </LinearGradient>
                                    </View>
                                    <Text style={styles.statValue}>{stat.value}</Text>
                                    <Text style={styles.statLabel}>{stat.label}</Text>
                                </View>
                            ))}
                        </View>

                        {/* Trending Now: orange line + chart icon, single white list card */}
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionTitleRow}>
                                <View style={[styles.indicator, { backgroundColor: ORANGE_ACCENT }]} />
                                <Text style={styles.sectionTitle}>Trending Now</Text>
                            </View>
                            <View style={styles.trendingUpIcon}>
                                <TrendingUp size={20} color={ORANGE_ACCENT} />
                            </View>
                        </View>
                        <View style={styles.trendingCard}>
                            {trendingList.map((item, index) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[
                                        styles.trendingRow,
                                        index < trendingList.length - 1 && styles.trendingRowBorder,
                                    ]}
                                    activeOpacity={0.7}
                                    onPress={() => requireAuth('view course details')}
                                >
                                    <View style={styles.trendingNumberWrap}>
                                        <LinearGradient
                                            colors={GRADIENTS.primary}
                                            style={styles.trendingNumberGradient}
                                        >
                                            <Text style={styles.trendingNumber}>{index + 1}</Text>
                                        </LinearGradient>
                                    </View>
                                    <View style={styles.trendingContent}>
                                        <Text style={styles.trendingTitle}>{item.title}</Text>
                                        <Text style={styles.trendingCategory}>{item.category}</Text>
                                    </View>
                                    <Text style={styles.trendingChange}>{item.change}</Text>
                                    <ChevronRight size={18} color={COLORS.textSecondary} />
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Browse Categories: orange line, 2x3 grid, active has outer glow */}
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionTitleRow}>
                                <View style={[styles.indicator, { backgroundColor: ORANGE_ACCENT }]} />
                                <Text style={styles.sectionTitle}>Browse Categories</Text>
                            </View>
                        </View>
                        <View style={styles.categoriesGrid}>
                            {categories.map((cat) => {
                                const isActive = selectedCategoryId === cat.id;
                                const IconComponent = cat.icon;
                                return (
                                    <TouchableOpacity
                                        key={cat.id}
                                        style={styles.categoryCardWrap}
                                        onPress={() => requireAuth('browse courses by category') && setSelectedCategoryId(cat.id)}
                                        activeOpacity={0.8}
                                    >
                                        {isActive && (
                                            <View style={styles.categoryActiveOuter} pointerEvents="none" />
                                        )}
                                        <View style={[styles.categoryCard, isActive && styles.categoryCardActive]}>
                                            {cat.badge && cat.newBooks > 0 && (
                                                <View style={styles.categoryBadge}>
                                                    <Text style={styles.categoryBadgeText}>{cat.newBooks}</Text>
                                                </View>
                                            )}
                                            <View style={styles.categoryIconWrap}>
                                                <LinearGradient
                                                    colors={GRADIENTS.primary}
                                                    style={styles.categoryIconGradient}
                                                >
                                                    <IconComponent size={22} color="#fff" />
                                                </LinearGradient>
                                            </View>
                                            <Text style={styles.categoryTitle} numberOfLines={1}>
                                                {cat.title}
                                            </Text>
                                            <Text style={styles.categoryCount}>{cat.count} course{cat.count !== 1 ? 's' : ''}</Text>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        {/* Featured Courses: image header, badge, instructor, tags, stats, Enroll + heart */}
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionTitleRow}>
                                <View style={[styles.indicator, { backgroundColor: ORANGE_ACCENT }]} />
                                <Text style={styles.sectionTitle}>Featured Courses</Text>
                            </View>
                            <TouchableOpacity style={styles.seeAllRow} onPress={() => requireAuth('view all featured courses')}>
                                <Text style={styles.seeAllText}>See All</Text>
                                <ChevronRight size={18} color={COLORS.primary} />
                            </TouchableOpacity>
                        </View>

                        {featuredCourses.map((course) => (
                            <View key={course.id} style={styles.featuredCard}>
                                <View style={styles.featuredImageWrap}>
                                    <LinearGradient
                                        colors={['#A855F7', '#C084FC', '#EC4899']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={styles.featuredImage}
                                    />
                                    {course.badge && (
                                        <View style={styles.featuredBadge}>
                                            <Text style={styles.featuredBadgeText}>{course.badge}</Text>
                                        </View>
                                    )}
                                    <View style={styles.ratingBadge}>
                                        <Star size={12} color="#FBBF24" fill="#FBBF24" />
                                        <Text style={styles.ratingBadgeText}>{course.rating}</Text>
                                    </View>
                                </View>
                                <View style={styles.featuredBody}>
                                    <Text style={styles.featuredTitle}>{course.title}</Text>
                                    <Text style={styles.featuredInstructor}>{course.instructor}</Text>
                                    <View style={styles.tagsRow}>
                                        {course.tags.map((tag, i) => (
                                            <View
                                                key={i}
                                                style={[styles.tagPill, { backgroundColor: tag.color + '22' }]}
                                            >
                                                <Text style={[styles.tagText, { color: tag.color }]}>
                                                    {tag.label}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                    <View style={styles.featuredMetaRow}>
                                        <View style={styles.metaItem}>
                                            <Clock size={14} color={COLORS.textSecondary} />
                                            <Text style={styles.metaText}>{course.duration}</Text>
                                        </View>
                                        <View style={styles.metaItem}>
                                            <BookOpen size={14} color={COLORS.textSecondary} />
                                            <Text style={styles.metaText}>{course.lessons}</Text>
                                        </View>
                                        <View style={styles.metaItem}>
                                            <Users size={14} color={COLORS.textSecondary} />
                                            <Text style={styles.metaText}>{course.students}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.featuredFooter}>
                                        <TouchableOpacity
                                            style={styles.enrollButtonWrap}
                                            activeOpacity={0.8}
                                            onPress={() => requireAuth('enroll in courses')}
                                        >
                                            <LinearGradient
                                                colors={GRADIENTS.primary}
                                                style={styles.enrollGradient}
                                            >
                                                <Play size={18} color="#fff" fill="#fff" />
                                                <Text style={styles.enrollText}>Enroll Now</Text>
                                            </LinearGradient>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.heartButton} onPress={() => requireAuth('save courses')}>
                                            <Heart size={22} color={COLORS.textSecondary} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        ))}

                        {/* Recommended for You: star icon, bold purple keywords */}
                        <View style={styles.recommendedSection}>
                            <View style={styles.recommendedTitleRow}>
                                <View style={styles.starIconWrap}>
                                    <Star size={20} color={COLORS.primary} fill={COLORS.primary} />
                                </View>
                                <Text style={styles.recommendedLabel}>Recommended for You</Text>
                            </View>
                            <Text style={styles.recommendedText}>
                                Based on your interests in{' '}
                                <Text style={styles.recommendedBold}>Physics</Text> and{' '}
                                <Text style={styles.recommendedBold}>Mathematics</Text>, we've curated
                                these courses just for you.
                            </Text>
                            <View style={styles.recommendedActions}>
                                <TouchableOpacity style={styles.outlineButton} activeOpacity={0.8} onPress={() => requireAuth('view recommended courses')}>
                                    <Text style={styles.outlineButtonText}>View All</Text>
                                </TouchableOpacity>
                                <GradientButton
                                    title="Customize"
                                    onPress={() => requireAuth('customize recommendations')}
                                    style={styles.customizeButton}
                                    textStyle={styles.customizeText}
                                />
                            </View>
                        </View>

                        <View style={{ height: 100 }} />
                    </ScrollView>
                </View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    safeArea: { flex: 1 },
    loadingWrap: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 15,
        color: COLORS.textSecondary,
    },
    errorWrap: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    errorText: {
        fontSize: 16,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: 16,
    },
    retryButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: COLORS.primary,
    },
    retryButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    apiErrorBanner: {
        backgroundColor: 'rgba(239, 68, 68, 0.12)',
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 14,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.danger,
    },
    apiErrorText: {
        fontSize: 14,
        color: COLORS.text,
        marginBottom: 2,
    },
    apiErrorRetry: {
        fontSize: 12,
        color: COLORS.primary,
        fontWeight: '600',
    },
    scrollWrapper: { flex: 1, minHeight: 0 },
    scrollView: { flex: 1 },
    scrollContent: { padding: GRID_PADDING },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    logoButton: { borderRadius: 12, overflow: 'hidden', ...SHADOWS.small },
    logoGradient: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoText: { fontSize: 22, fontWeight: '800', color: '#fff' },
    headerTextWrap: { marginLeft: 14, flex: 1 },
    headerTitle: { fontSize: 26, fontWeight: '700', color: COLORS.text, marginBottom: 2 },
    headerSubtitle: { fontSize: 14, color: COLORS.textSecondary },

    searchRow: { marginBottom: 20 },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingHorizontal: 14,
        height: 52,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    searchIcon: { marginRight: 10 },
    searchInput: { flex: 1, fontSize: 15, color: COLORS.text, paddingVertical: 0 },
    filterButton: { borderRadius: 20, overflow: 'hidden', marginLeft: 8 },
    filterGradient: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },

    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 10,
        marginHorizontal: 4,
        alignItems: 'center',
        ...SHADOWS.small,
    },
    statIconWrap: { marginBottom: 10 },
    statIconGradient: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statValue: { fontSize: 20, fontWeight: '700', color: COLORS.text, marginBottom: 2 },
    statLabel: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '500' },

    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        marginTop: 4,
    },
    sectionTitleRow: { flexDirection: 'row', alignItems: 'center' },
    indicator: { width: 4, height: 18, borderRadius: 2, marginRight: 8 },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text },
    trendingUpIcon: {},

    trendingCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginBottom: 24,
        ...SHADOWS.small,
    },
    trendingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
    },
    trendingRowBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    trendingNumberWrap: { marginRight: 12 },
    trendingNumberGradient: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    trendingNumber: { fontSize: 14, fontWeight: '700', color: '#fff' },
    trendingContent: { flex: 1 },
    trendingTitle: { fontSize: 15, fontWeight: '600', color: COLORS.text },
    trendingCategory: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
    trendingChange: { fontSize: 13, fontWeight: '600', color: '#22C55E', marginRight: 8 },

    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    categoryCardWrap: {
        width: categoryCardWidth,
        marginBottom: CARD_GAP,
        position: 'relative',
    },
    categoryActiveOuter: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 20,
        backgroundColor: 'rgba(232, 213, 255, 0.5)',
        borderWidth: 2,
        borderColor: 'rgba(168, 85, 247, 0.4)',
        margin: -4,
        zIndex: 0,
    },
    categoryCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 16,
        alignItems: 'center',
        minHeight: 120,
        ...SHADOWS.small,
        zIndex: 1,
    },
    categoryCardActive: {
        borderWidth: 1.5,
        borderColor: COLORS.primary,
    },
    categoryBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: COLORS.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
    },
    categoryBadgeText: { fontSize: 11, fontWeight: '700', color: '#fff' },
    categoryIconWrap: { marginBottom: 10 },
    categoryIconGradient: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 2 },
    categoryCount: { fontSize: 12, color: COLORS.textSecondary },

    seeAllRow: { flexDirection: 'row', alignItems: 'center' },
    seeAllText: { fontSize: 14, fontWeight: '600', color: COLORS.primary, marginRight: 2 },

    featuredCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 20,
        ...SHADOWS.medium,
    },
    featuredImageWrap: { position: 'relative', height: 140 },
    featuredImage: { width: '100%', height: '100%' },
    featuredBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: '#FBBF24',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    featuredBadgeText: { fontSize: 11, fontWeight: '700', color: '#78350F' },
    ratingBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(251, 191, 36, 0.95)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    ratingBadgeText: { fontSize: 12, fontWeight: '700', color: '#78350F', marginLeft: 4 },
    featuredBody: { padding: 16 },
    featuredTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
    featuredInstructor: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 10 },
    tagsRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
    tagPill: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        marginRight: 8,
        marginBottom: 4,
    },
    tagText: { fontSize: 11, fontWeight: '600' },
    featuredMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
    },
    metaItem: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
    metaText: { fontSize: 12, color: COLORS.textSecondary, marginLeft: 6 },
    featuredFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    enrollButtonWrap: { flex: 1, borderRadius: 14, overflow: 'hidden', marginRight: 12 },
    enrollGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 48,
        paddingHorizontal: 20,
    },
    enrollText: { fontSize: 15, fontWeight: '600', color: '#fff', marginLeft: 8 },
    heartButton: { padding: 8 },

    recommendedSection: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        ...SHADOWS.small,
    },
    recommendedTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    starIconWrap: { marginRight: 8 },
    recommendedLabel: { fontSize: 16, fontWeight: '700', color: COLORS.text },
    recommendedText: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 22, marginBottom: 16 },
    recommendedBold: { fontWeight: '700', color: COLORS.primary },
    recommendedActions: { flexDirection: 'row' },
    outlineButton: {
        flex: 1,
        marginRight: 12,
        height: 48,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    outlineButtonText: { fontSize: 14, fontWeight: '600', color: COLORS.text },
    customizeButton: { flex: 1, height: 48 },
    customizeText: { fontSize: 14 },
});

export default ExploreScreen;
