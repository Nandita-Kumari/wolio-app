import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    Dimensions,
    TouchableOpacity,
    Alert,
    Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import { Search, BookOpen, Star, Trophy, ChevronRight, Bookmark, Check } from 'lucide-react-native';
import { COLORS, GRADIENTS } from '../constants/theme';
import { useUser } from '../context/UserContext';

const { width } = Dimensions.get('window');
const HORIZONTAL_PAD = 24;
const BOOKSHELF_GAP = 8;
const BOOKSHELF_CARD_WIDTH = (width - HORIZONTAL_PAD * 2 - BOOKSHELF_GAP * 2) / 3;
const CARD_WIDTH = (width - 48 - 12) / 2;
const COMPLETED_CARD_SIZE = 80;

const LibraryScreen = () => {
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

    const myBooks = [
        { id: 1, title: 'Industrial Revolution', current: 5, total: 18, progress: 0.25, color: '#64748B', isNew: false },
        { id: 2, title: 'Quantum Mechanics', current: 14, total: 18, progress: 0.78, color: '#A855F7', isNew: true },
        { id: 3, title: 'Organic Chemistry', current: 9, total: 15, progress: 0.55, color: '#EC4899', isNew: false },
        { id: 4, title: 'World Literature', current: 6, total: 22, progress: 0.28, color: '#EA580C', isNew: false },
        { id: 5, title: 'Cell Biology', current: 11, total: 18, progress: 0.61, color: '#10B981', isNew: false },
        { id: 6, title: 'Economics Today', current: 3, total: 12, progress: 0.15, color: '#6366F1', isNew: false },
    ];

    const exploreBooks = [
        { id: 1, title: 'Advanced Calculus', author: 'Dr. Thomas Wri', rating: 4.8, category: 'MATHEMATICS' },
        { id: 2, title: 'Ancient Civilizations', author: 'Prof. Jane Doe', rating: 4.9, category: 'HISTORY' },
        { id: 3, title: 'Philosophy Basics', author: 'Dr. Mark Lee', rating: 4.6, category: 'PHILOSOPHY' },
        { id: 4, title: 'Space Science', author: 'Dr. Sarah Kim', rating: 4.7, category: 'SCIENCE' },
        { id: 5, title: 'Digital Art Mastery', author: 'Alex Rivera', rating: 4.5, category: 'ART' },
        { id: 6, title: 'Climate & Environment', author: 'Dr. Emma Green', rating: 4.9, category: 'ENVIRONMENT' },
    ];

    const completedBooks = [
        { id: 1, title: 'Intro to Physics', date: 'Feb 15', color: '#64748B' },
        { id: 2, title: 'Basic Chemistry', date: 'Feb 10', color: '#475569' },
        { id: 3, title: 'World History', date: 'Feb 5', color: '#57534E' },
        { id: 4, title: 'Algebra Fundamentals', date: 'Feb 1', color: '#4B5563' },
    ];

    const todayMins = 5 + 41 / 60; // 5:41 as fractional minutes
    const dailyGoalMins = 10;
    const booksCompleted = 12;
    const annualGoal = 20;
    const annualProgress = 0.6;

    return (
        <View style={styles.container}>
            <View style={styles.bgGradient} />
            <SafeAreaView style={styles.safeArea}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={true}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <View style={styles.headerIconBox}>
                                <BookOpen size={24} color="#fff" />
                            </View>
                            <View>
                                <Text style={styles.headerTitle}>My Library</Text>
                                <Text style={styles.headerSub}>{myBooks.length} books</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.searchBtn} onPress={() => requireAuth('search your library')}>
                            <Search size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    {/* Reading Goals */}
                    <View style={styles.readingGoalsCard}>
                        <Text style={styles.readingGoalsTitle}>Reading Goals</Text>
                        <Text style={styles.readingGoalsDesc}>Read every day, see your stats soar, and finish more books.</Text>
                        <View style={styles.readingGoalsProgressWrap}>
                            <View style={styles.circularProgressWrap}>
                                <Svg width={160} height={160} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
                                    <Circle cx={80} cy={80} r={64} stroke="#E8E8E8" strokeWidth={8} fill="transparent" />
                                    <Circle
                                        cx={80}
                                        cy={80}
                                        r={64}
                                        stroke={COLORS.primary}
                                        strokeWidth={8}
                                        fill="transparent"
                                        strokeDasharray="34 30 96 91 96 31"
                                        strokeLinecap="round"
                                    />
                                </Svg>
                                <View style={styles.circularProgressInner}>
                                    <Text style={styles.todayLabel}>Today's Reading</Text>
                                    <Text style={styles.todayTime}>{Math.floor(todayMins)}:{String(Math.round((todayMins % 1) * 60)).padStart(2, '0')}</Text>
                                    <Text style={styles.todayGoal}>of your {dailyGoalMins}-min goal →</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* My Bookshelf */}
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionTitleRow}>
                            <View style={styles.purpleBar} />
                            <Text style={styles.sectionTitle}>My Bookshelf</Text>
                        </View>
                        <TouchableOpacity onPress={() => requireAuth('view all books')}>
                            <Text style={styles.viewMore}>View More →</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.bookshelfGrid}>
                        {myBooks.map((book, index) => (
                            <TouchableOpacity key={book.id} style={[styles.bookCard, { width: BOOKSHELF_CARD_WIDTH, marginRight: index % 3 === 2 ? 0 : BOOKSHELF_GAP, marginBottom: BOOKSHELF_GAP }]} onPress={() => requireAuth('open books')} activeOpacity={0.9}>
                                {book.isNew && (
                                    <View style={styles.newBadge}>
                                        <Text style={styles.newBadgeText}>NEW</Text>
                                    </View>
                                )}
                                <View style={[styles.bookCardImage, { backgroundColor: book.color }]}>
                                    <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={StyleSheet.absoluteFill} />
                                    <Text style={styles.bookCardTitle}>{book.title}</Text>
                                    <View style={styles.bookCardProgressBar}>
                                        <View style={[styles.bookCardProgressFill, { width: `${book.progress * 100}%` }]} />
                                    </View>
                                    <View style={styles.bookCardMeta}>
                                        <Text style={styles.bookCardMetaText}>{book.current}/{book.total}</Text>
                                        <Text style={styles.bookCardMetaText}>{Math.round(book.progress * 100)}%</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Explore More Books */}
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionTitleRow}>
                            <View style={styles.purpleBar} />
                            <Text style={styles.sectionTitle}>Explore More Books</Text>
                        </View>
                        <TouchableOpacity onPress={() => requireAuth('explore more')}>
                            <Text style={styles.viewMore}>View More →</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.exploreDesc}>Recommended based on your reading interests</Text>
                    <View style={styles.exploreGrid}>
                        {exploreBooks.map((book, index) => (
                            <TouchableOpacity key={book.id} style={[styles.exploreCard, { width: BOOKSHELF_CARD_WIDTH, marginRight: index % 3 === 2 ? 0 : BOOKSHELF_GAP, marginBottom: BOOKSHELF_GAP }]} onPress={() => requireAuth('enroll')} activeOpacity={0.9}>
                                <View style={[styles.exploreCardImage, { backgroundColor: book.id % 2 === 0 ? '#94A3B8' : '#64748B' }]}>
                                    <Text style={styles.exploreCardTitle}>{book.title}</Text>
                                </View>
                                <Text style={styles.exploreCardAuthor}>{book.author}</Text>
                                <View style={styles.exploreCardRating}>
                                    <Star size={14} color="#EAB308" fill="#EAB308" />
                                    <Text style={styles.exploreCardRatingText}>{book.rating}</Text>
                                </View>
                                <View style={styles.categoryTag}>
                                    <Text style={styles.categoryTagText}>{book.category}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Books Completed */}
                    <View style={styles.completedCard}>
                        <View style={styles.completedHeader}>
                            <View style={styles.sectionTitleRow}>
                                <View style={styles.greenBar} />
                                <Text style={styles.completedSectionTitle}>Books Completed</Text>
                            </View>
                            <View style={styles.completedBadge}>
                                <View style={styles.completedBadgeIcon}>
                                    <Bookmark size={18} color="#fff" />
                                </View>
                                <Text style={styles.completedCount}>{booksCompleted}</Text>
                            </View>
                        </View>
                        <View style={styles.progressInnerCard}>
                            <View style={styles.progressLeft}>
                                <Text style={styles.yourProgressTitle}>Your Progress</Text>
                                <View style={styles.annualProgressRow}>
                                    <Text style={styles.annualLabel}>Annual Goal</Text>
                                    <Text style={styles.annualPercent}>60%</Text>
                                </View>
                                <View style={styles.annualBarBg}>
                                    <LinearGradient
                                        colors={GRADIENTS.primary}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={[styles.annualBarFill, { width: '60%' }]}
                                    />
                                </View>
                                <Text style={styles.annualHint}>8 more books to reach your goal of <Text style={styles.annualHintBold}>20 books</Text> this year! 🚀</Text>
                            </View>
                            <View style={styles.greatJob}>
                                <Trophy size={36} color="#F59E0B" />
                                <Text style={styles.greatJobTitle}>Great Job!</Text>
                                <Text style={styles.greatJobSub}>You're doing amazing!</Text>
                            </View>
                        </View>
                        <View style={styles.recentlyHeader}>
                            <Text style={styles.recentlyTitle}>Recently Completed</Text>
                            <TouchableOpacity onPress={() => requireAuth('view more')}>
                                <Text style={styles.viewMoreGreen}>View More →</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recentlyScroll}>
                            {completedBooks.map((book) => (
                                <TouchableOpacity key={book.id} style={styles.completedBookCard} onPress={() => requireAuth('view')} activeOpacity={0.9}>
                                    <View style={[styles.completedBookImage, { backgroundColor: book.color || '#64748B' }]}>
                                        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.7)']} style={StyleSheet.absoluteFill} />
                                        <View style={styles.completedCheck}>
                                            <Check size={14} color="#fff" strokeWidth={3} />
                                        </View>
                                        <View style={styles.completedBookDateOverlay}>
                                            <Text style={styles.completedBookDate}>{book.date}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    <View style={{ height: 120 }} />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    bgGradient: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#F9FAFB',
    },
    safeArea: { flex: 1 },
    scrollView: { flex: 1 },
    scrollContent: { padding: 24 },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    headerLeft: { flexDirection: 'row', alignItems: 'center' },
    headerIconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.text,
    },
    headerSub: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    searchBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#C084FC',
        justifyContent: 'center',
        alignItems: 'center',
    },

    readingGoalsCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 28,
        marginBottom: 24,
        shadowColor: '#A78BFA',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 20,
        elevation: 8,
    },
    readingGoalsTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#333333',
        marginBottom: 12,
        textAlign: 'center',
    },
    readingGoalsDesc: {
        fontSize: 15,
        color: '#666666',
        marginBottom: 28,
        lineHeight: 22,
        textAlign: 'center',
    },
    readingGoalsProgressWrap: { alignItems: 'center' },
    circularProgressWrap: {
        width: 160,
        height: 160,
        alignItems: 'center',
        justifyContent: 'center',
    },
    circularProgressInner: {
        width: 100,
        maxWidth: 100,
        paddingHorizontal: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    todayLabel: {
        fontSize: 9,
        color: '#666666',
        // marginBottom: 4,
        textAlign: 'center',
        fontWeight: 700
    },
    todayTime: {
        fontSize: 36,
        fontWeight: '700',
        color: '#333333',
        textAlign: 'center',
    },
    todayGoal: {
        fontSize: 8,
        color: '#999999',
        marginTop: 4,
        textAlign: 'center',
    },

    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitleRow: { flexDirection: 'row', alignItems: 'center' },
    purpleBar: {
        width: 4,
        height: 20,
        backgroundColor: COLORS.primary,
        borderRadius: 2,
        marginRight: 10,
    },
    greenBar: {
        width: 4,
        height: 20,
        backgroundColor: COLORS.success,
        borderRadius: 2,
        marginRight: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.text,
    },
    viewMore: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.primary,
    },
    viewMoreGreen: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.success,
    },

    bookshelfGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 28,
    },
    bookCard: {},
    newBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: COLORS.secondary,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        zIndex: 1,
    },
    newBadgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#fff',
    },
    bookCardImage: {
        height: 120,
        borderRadius: 16,
        overflow: 'hidden',
        justifyContent: 'flex-end',
        padding: 12,
        borderWidth: 1,
        borderColor: 'rgba(168, 85, 247, 0.2)',
    },
    bookCardTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 8,
    },
    bookCardProgressBar: {
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    bookCardProgressFill: {
        height: '100%',
        backgroundColor: COLORS.success,
        borderRadius: 2,
    },
    bookCardMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    bookCardMetaText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#fff',
    },

    exploreDesc: {
        fontSize: 13,
        color: COLORS.textSecondary,
        marginBottom: 16,
    },
    exploreGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 28,
    },
    exploreCard: {},
    exploreCardImage: {
        height: 100,
        borderRadius: 12,
        justifyContent: 'flex-end',
        padding: 10,
    },
    exploreCardTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#fff',
    },
    exploreCardAuthor: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 8,
    },
    exploreCardRating: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 4,
    },
    exploreCardRatingText: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.text,
    },
    categoryTag: {
        alignSelf: 'flex-start',
        backgroundColor: '#F3E8FF',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        marginTop: 8,
    },
    categoryTagText: {
        fontSize: 10,
        fontWeight: '700',
        color: COLORS.primary,
    },

    completedCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 24,
        shadowColor: COLORS.success,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 6,
    },
    completedHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    completedSectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.text,
    },
    completedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    completedBadgeIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.success,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: COLORS.success,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.35,
        shadowRadius: 6,
        elevation: 4,
    },
    completedCount: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.text,
    },
    progressInnerCard: {
        flexDirection: 'row',
        backgroundColor: '#D1FAE5',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    progressLeft: {
        flex: 1,
        marginRight: 16,
    },
    yourProgressTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 8,
    },
    annualProgressRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    annualLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
    },
    annualPercent: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.primary,
    },
    annualBarBg: {
        height: 10,
        backgroundColor: '#E5E7EB',
        borderRadius: 5,
        overflow: 'hidden',
    },
    annualBarFill: {
        height: '100%',
        borderRadius: 5,
    },
    annualHint: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 10,
        lineHeight: 20,
    },
    annualHintBold: {
        fontWeight: '700',
        color: COLORS.text,
    },
    greatJob: {
        alignItems: 'center',
    },
    greatJobTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.text,
        marginTop: 8,
    },
    greatJobSub: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginTop: 4,
    },
    recentlyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    recentlyTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
    },
    recentlyScroll: { paddingRight: 0 },
    completedBookCard: {
        marginRight: 16,
    },
    completedBookImage: {
        width: COMPLETED_CARD_SIZE,
        height: COMPLETED_CARD_SIZE,
        borderRadius: 12,
        overflow: 'hidden',
        justifyContent: 'flex-end',
    },
    completedBookDateOverlay: {
        paddingVertical: 6,
        alignItems: 'center',
    },
    completedCheck: {
        position: 'absolute',
        top: 6,
        right: 6,
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: COLORS.success,
        justifyContent: 'center',
        alignItems: 'center',
    },
    completedBookDate: {
        fontSize: 12,
        color: '#fff',
        fontWeight: '600',
    },
});

export default LibraryScreen;
