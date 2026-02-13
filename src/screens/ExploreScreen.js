import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, Sparkles, Flame, Clock, Star } from 'lucide-react-native';
import { COLORS, SHADOWS, GRADIENTS } from '../constants/theme';
import GlassCard from '../components/GlassCard';
import GradientButton from '../components/GradientButton';

const { width } = Dimensions.get('window');

const trendingCourses = [
    { id: 1, title: 'Astrophysics Basics', language: 'Physics', change: '+120%' },
    { id: 2, title: 'Creative Writing', language: 'English', change: '+100%' },
    { id: 3, title: 'Machine Learning', language: 'Technology', change: '+80%' },
];

const categories = [
    { id: 1, title: 'Quantum Physics', count: 12, color: '#A855F7' },
    { id: 2, title: 'Digital Art', count: 8, color: '#EC4899' },
    { id: 3, title: 'Music Theory', count: 9, color: '#38BDF8' },
    { id: 4, title: 'Programming', count: 16, color: '#22C55E' },
];

const featuredCourses = [
    {
        id: 1,
        title: 'Quantum Computing',
        tag: 'Physics',
        level: 'Advanced',
        duration: '6 weeks',
        lessons: '42 lessons',
        students: '2.4k',
        badge: 'TRENDING',
    },
    {
        id: 2,
        title: 'Digital Painting',
        tag: 'Design',
        level: 'Intermediate',
        duration: '4 weeks',
        lessons: '28 lessons',
        students: '1.8k',
        badge: 'NEW',
    },
    {
        id: 3,
        title: 'Music Production',
        tag: 'Music',
        level: 'Beginner',
        duration: '5 weeks',
        lessons: '35 lessons',
        students: '3.2k',
        badge: 'BESTSELLER',
    },
];

const ExploreScreen = () => {
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
                    >
                    {/* Header */}
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.headerLabel}>Explore</Text>
                            <Text style={styles.headerTitle}>Discover your next adventure</Text>
                        </View>
                        <TouchableOpacity style={styles.sparklesButton}>
                            <LinearGradient
                                colors={GRADIENTS.primary}
                                style={styles.sparklesGradient}
                            >
                                <Sparkles size={20} color="#fff" />
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    {/* Search */}
                    <View style={styles.searchRow}>
                        <View style={styles.searchContainer}>
                            <Search size={18} color={COLORS.textSecondary} style={styles.searchIcon} />
                            <TextInput
                                placeholder="Search courses, topics, instructors..."
                                placeholderTextColor={COLORS.textSecondary}
                                style={styles.searchInput}
                            />
                        </View>
                    </View>

                    {/* Quick Stats */}
                    <View style={styles.statsRow}>
                        <GlassCard style={styles.statCard}>
                            <Text style={styles.statValue}>120+</Text>
                            <Text style={styles.statLabel}>Courses</Text>
                        </GlassCard>
                        <GlassCard style={styles.statCard}>
                            <Text style={styles.statValue}>10k+</Text>
                            <Text style={styles.statLabel}>Learners</Text>
                        </GlassCard>
                        <GlassCard style={styles.statCard}>
                            <Text style={styles.statValue}>8</Text>
                            <Text style={styles.statLabel}>New today</Text>
                        </GlassCard>
                    </View>

                    {/* Trending Now */}
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionTitleRow}>
                            <View style={styles.indicator} />
                            <Text style={styles.sectionTitle}>Trending Now</Text>
                        </View>
                        <Text style={styles.sectionAction}>View All →</Text>
                    </View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.trendingScroll}
                    >
                        {trendingCourses.map((course) => (
                            <LinearGradient
                                key={course.id}
                                colors={['#F97316', '#EC4899', '#8B5CF6']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.trendingCard}
                            >
                                <View style={styles.trendingHeader}>
                                    <View style={styles.trendingPill}>
                                        <Flame size={14} color="#F97316" />
                                        <Text style={styles.trendingPillText}>Hot</Text>
                                    </View>
                                    <View style={styles.trendingChangePill}>
                                        <Text style={styles.trendingChangeText}>{course.change}</Text>
                                    </View>
                                </View>
                                <Text style={styles.trendingTitle}>{course.title}</Text>
                                <Text style={styles.trendingSubtitle}>{course.language}</Text>
                            </LinearGradient>
                        ))}
                    </ScrollView>

                    {/* Browse Categories */}
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionTitleRow}>
                            <View style={styles.indicator} />
                            <Text style={styles.sectionTitle}>Browse Categories</Text>
                        </View>
                        <Text style={styles.sectionAction}>See All →</Text>
                    </View>
                    <View style={styles.categoriesGrid}>
                        {categories.map((category) => (
                            <GlassCard key={category.id} style={styles.categoryCard}>
                                <View
                                    style={[
                                        styles.categoryIcon,
                                        { backgroundColor: category.color },
                                    ]}
                                >
                                    <BookOpenIcon />
                                </View>
                                <Text style={styles.categoryTitle}>{category.title}</Text>
                                <Text style={styles.categoryCount}>{category.count} courses</Text>
                            </GlassCard>
                        ))}
                    </View>

                    {/* Featured Courses */}
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionTitleRow}>
                            <View style={styles.indicator} />
                            <Text style={styles.sectionTitle}>Featured Courses</Text>
                        </View>
                        <Text style={styles.sectionAction}>See All →</Text>
                    </View>

                    {featuredCourses.map((course) => (
                        <GlassCard key={course.id} style={styles.featuredCard}>
                            <View style={styles.featuredTopRow}>
                                <View style={styles.featuredTagRow}>
                                    <View style={styles.tagPill}>
                                        <Text style={styles.tagText}>{course.tag}</Text>
                                    </View>
                                    <View style={styles.levelPill}>
                                        <Text style={styles.levelText}>{course.level}</Text>
                                    </View>
                                </View>
                                <View style={styles.ratingRow}>
                                    <Star size={14} color="#FBBF24" fill="#FBBF24" />
                                    <Text style={styles.ratingText}>4.8</Text>
                                </View>
                            </View>

                            <Text style={styles.featuredTitle}>{course.title}</Text>

                            <View style={styles.featuredMetaRow}>
                                <View style={styles.metaItem}>
                                    <Clock size={14} color={COLORS.textSecondary} />
                                    <Text style={styles.metaText}>{course.duration}</Text>
                                </View>
                                <Text style={styles.metaText}>{course.lessons}</Text>
                                <Text style={styles.metaText}>{course.students} learners</Text>
                            </View>

                            <View style={styles.featuredFooter}>
                                <View style={styles.badgePill}>
                                    <Text style={styles.badgeText}>{course.badge}</Text>
                                </View>
                                <GradientButton
                                    title="Enroll Now"
                                    onPress={() => {}}
                                    style={styles.enrollButton}
                                    textStyle={styles.enrollText}
                                />
                            </View>
                        </GlassCard>
                    ))}

                    {/* Recommended */}
                    <GlassCard style={styles.recommendedCard}>
                        <Text style={styles.recommendedLabel}>Recommended for You</Text>
                        <Text style={styles.recommendedText}>
                            Based on your interests in Physics and Mathematics, we've curated these
                            courses just for you.
                        </Text>
                        <View style={styles.recommendedActions}>
                            <TouchableOpacity style={styles.outlineButton}>
                                <Text style={styles.outlineButtonText}>View All</Text>
                            </TouchableOpacity>
                            <GradientButton
                                title="Customize"
                                onPress={() => {}}
                                style={styles.customizeButton}
                                textStyle={styles.customizeText}
                            />
                        </View>
                    </GlassCard>

                    <View style={{ height: 100 }} />
                    </ScrollView>
                </View>
            </SafeAreaView>
        </View>
    );
};

const BookOpenIcon = () => (
    <View>
        {/* Simple placeholder icon using shapes to avoid extra imports */}
        <View style={styles.bookIconPage} />
        <View style={[styles.bookIconPage, { opacity: 0.7 }]} />
    </View>
);

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
        padding: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    headerLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textSecondary,
        marginBottom: 4,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.text,
    },
    sparklesButton: {
        ...SHADOWS.medium,
        borderRadius: 20,
        overflow: 'hidden',
    },
    sparklesGradient: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchRow: {
        marginBottom: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 52,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: COLORS.text,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingVertical: 16,
        paddingHorizontal: 12,
        marginHorizontal: 4,
        alignItems: 'flex-start',
    },
    statValue: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        marginTop: 8,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    indicator: {
        width: 4,
        height: 16,
        backgroundColor: COLORS.secondary,
        borderRadius: 2,
        marginRight: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.text,
    },
    sectionAction: {
        fontSize: 12,
        color: COLORS.primary,
        fontWeight: '600',
    },
    trendingScroll: {
        paddingVertical: 8,
        paddingRight: 24,
    },
    trendingCard: {
        width: width * 0.7,
        borderRadius: 24,
        padding: 16,
        marginRight: 16,
        ...SHADOWS.medium,
    },
    trendingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    trendingPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.9)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
    },
    trendingPillText: {
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 4,
        color: '#EA580C',
    },
    trendingChangePill: {
        backgroundColor: 'rgba(15,118,110,0.12)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
    },
    trendingChangeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#ECFEFF',
    },
    trendingTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    trendingSubtitle: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.8)',
    },
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    categoryCard: {
        width: (width - 48 - 16) / 2,
        marginBottom: 16,
        padding: 16,
        backgroundColor: '#FFFFFF',
    },
    categoryIcon: {
        width: 36,
        height: 36,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    categoryTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 4,
    },
    categoryCount: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    featuredCard: {
        marginBottom: 16,
        padding: 16,
        backgroundColor: '#FFFFFF',
    },
    featuredTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    featuredTagRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    tagPill: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: '#F3E8FF',
        marginRight: 6,
    },
    tagText: {
        fontSize: 11,
        fontWeight: '600',
        color: COLORS.primary,
    },
    levelPill: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: '#EEF2FF',
    },
    levelText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#4F46E5',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        marginLeft: 4,
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.text,
    },
    featuredTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 8,
    },
    featuredMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaText: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginLeft: 4,
    },
    featuredFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    badgePill: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: '#F97316',
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#FFF7ED',
    },
    enrollButton: {
        flex: 0,
        width: 140,
        height: 44,
    },
    enrollText: {
        fontSize: 14,
    },
    recommendedCard: {
        marginTop: 8,
        padding: 16,
        backgroundColor: '#FFFFFF',
    },
    recommendedLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 4,
    },
    recommendedText: {
        fontSize: 13,
        color: COLORS.textSecondary,
        marginBottom: 16,
    },
    recommendedActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    outlineButton: {
        flex: 1,
        height: 44,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        backgroundColor: '#FFFFFF',
    },
    outlineButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
    },
    customizeButton: {
        flex: 1,
        height: 44,
    },
    customizeText: {
        fontSize: 14,
    },
    bookIconPage: {
        width: 18,
        height: 14,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.9)',
        marginBottom: 2,
    },
});

export default ExploreScreen;
