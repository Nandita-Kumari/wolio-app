import React, { useState, useEffect, useCallback } from 'react';
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
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import { Search, BookOpen, Star, Trophy, ChevronRight, Bookmark, Check } from 'lucide-react-native';
import { COLORS, GRADIENTS } from '../constants/theme';
import { useUser } from '../context/UserContext';
import { getLibraryData } from '../services/libraryApi';

const { width } = Dimensions.get('window');
const HORIZONTAL_PAD = 24;
const BOOKSHELF_GAP = 8;
const BOOKSHELF_CARD_WIDTH = (width - HORIZONTAL_PAD * 2 - BOOKSHELF_GAP * 2) / 3;
const CARD_WIDTH = (width - 48 - 12) / 2;
const COMPLETED_CARD_SIZE = 80;
const BOOK_COLORS = ['#64748B', '#A855F7', '#EC4899', '#EA580C', '#10B981', '#6366F1', '#475569', '#57534E'];
const DAILY_GOAL_MINS = 10;
const ANNUAL_GOAL = 20;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

const formatCompletedDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[d.getMonth()]} ${d.getDate()}`;
};

const isRecentlyAdded = (dateStr) => {
    if (!dateStr) return false;
    const added = new Date(dateStr).getTime();
    return Date.now() - added < 7 * MS_PER_DAY;
};

function normalizeLibraryData(data) {
    if (!data) {
        return {
            todayMins: 0,
            myBooks: [],
            exploreBooks: [],
            completedBooks: [],
            booksCompleted: 0,
            annualProgress: 0,
            booksRemaining: ANNUAL_GOAL,
        };
    }
    const todayReadingTime = data.todayReadingTime ?? 0;
    const bookshelf = data.bookshelf ?? [];
    const recommendedBooks = data.recommendedBooks ?? [];
    const booksCompletedList = data.booksCompleted ?? [];
    const numberOfBooksCompleted = data.numberOfBooksCompleted ?? booksCompletedList.length;

    const myBooks = bookshelf.map((b, i) => ({
        id: b.bookId,
        title: b.title,
        current: b.currentChapterNumber ?? 0,
        total: b.totalChapters ?? 1,
        progress: ((b.progressPercentage ?? 0) / 100) || 0,
        color: BOOK_COLORS[i % BOOK_COLORS.length],
        isNew: isRecentlyAdded(b.addedAt),
        coverImage: b.coverImage,
    }));

    const exploreBooks = recommendedBooks.map((b) => ({
        id: b.bookId,
        title: b.title,
        author: b.writerName ?? '',
        rating: 4.5,
        category: b.category ?? 'General',
        coverImage: b.coverImage,
    }));

    const completedBooks = booksCompletedList.slice(0, 10).map((b, i) => ({
        id: b.bookId,
        title: b.title,
        date: formatCompletedDate(b.completedAt),
        color: BOOK_COLORS[i % BOOK_COLORS.length],
        coverImage: b.coverImage,
    }));

    const annualProgress = Math.min(1, numberOfBooksCompleted / ANNUAL_GOAL);
    const booksRemaining = Math.max(0, ANNUAL_GOAL - numberOfBooksCompleted);

    return {
        todayMins: todayReadingTime,
        myBooks,
        exploreBooks,
        completedBooks,
        booksCompleted: numberOfBooksCompleted,
        annualProgress,
        booksRemaining,
    };
}

const LibraryScreen = () => {
    const { token } = useUser();
    const navigation = useNavigation();

    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [libraryData, setLibraryData] = useState(null);

    const requireAuth = (actionName) => {
        if (token) return true;
        Alert.alert('Sign in required', `Please sign in to ${actionName}.`, [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Sign In', onPress: () => navigation.getParent()?.navigate('Login') },
        ]);
        return false;
    };

    const loadLibrary = useCallback(async (isRefresh = false) => {
        if (!isRefresh) setLoading(true);
        setApiError(null);
        const { data, error } = await getLibraryData(token);
        if (data) {
            setLibraryData(normalizeLibraryData(data));
        }
        if (error) setApiError(error);
        setLoading(false);
        setRefreshing(false);
    }, [token]);

    useEffect(() => {
        loadLibrary();
    }, [loadLibrary]);

    const {
        todayMins = 0,
        myBooks = [],
        exploreBooks = [],
        completedBooks = [],
        booksCompleted = 0,
        annualProgress = 0,
        booksRemaining = ANNUAL_GOAL,
    } = libraryData || {};

    if (loading && !libraryData) {
        return (
            <View style={styles.container}>
                <View style={styles.bgGradient} />
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.loadingWrap}>
                        <ActivityIndicator size="large" color={COLORS.primary} />
                        <Text style={styles.loadingText}>Loading library...</Text>
                    </View>
                </SafeAreaView>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.bgGradient} />
            <SafeAreaView style={styles.safeArea}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={true}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => { setRefreshing(true); loadLibrary(true); }}
                            colors={[COLORS.primary]}
                            tintColor={COLORS.primary}
                        />
                    }
                >
                    {apiError ? (
                        <TouchableOpacity style={styles.apiErrorBanner} onPress={() => loadLibrary()} activeOpacity={0.9}>
                            <Text style={styles.apiErrorText}>{apiError}</Text>
                            <Text style={styles.apiErrorRetry}>Tap to retry</Text>
                        </TouchableOpacity>
                    ) : null}

                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <View style={styles.headerIconBox}>
                                <BookOpen size={24} color="#fff" />
                            </View>
                            <View>
                                <Text style={styles.headerTitle}>My Library</Text>
                                    <Text style={styles.headerSub}>{myBooks.length} book{myBooks.length !== 1 ? 's' : ''}</Text>
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
                                    <Text style={styles.todayTime}>{Math.floor(todayMins)}:{String(Math.round(((todayMins % 1) || 0) * 60)).padStart(2, '0')}</Text>
                                    <Text style={styles.todayGoal}>of your {DAILY_GOAL_MINS}-min goal →</Text>
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
                            <TouchableOpacity key={book.id} style={[styles.bookCard, { width: BOOKSHELF_CARD_WIDTH, marginRight: index % 3 === 2 ? 0 : BOOKSHELF_GAP, marginBottom: BOOKSHELF_GAP }]} onPress={() => requireAuth('open books') && navigation.navigate('BookReader', { bookId: book.id })} activeOpacity={0.9}>
                                {book.isNew && (
                                    <View style={styles.newBadge}>
                                        <Text style={styles.newBadgeText}>NEW</Text>
                                    </View>
                                )}
                                <View style={[styles.bookCardImage, { backgroundColor: book.color }]}>
                                    {book.coverImage ? (
                                        <Image source={{ uri: book.coverImage }} style={StyleSheet.absoluteFill} resizeMode="cover" />
                                    ) : null}
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
                                    {book.coverImage ? (
                                        <Image source={{ uri: book.coverImage }} style={StyleSheet.absoluteFill} resizeMode="cover" />
                                    ) : null}
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
                                    <Text style={styles.annualPercent}>{Math.round(annualProgress * 100)}%</Text>
                                </View>
                                <View style={styles.annualBarBg}>
                                    <LinearGradient
                                        colors={GRADIENTS.primary}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={[styles.annualBarFill, { width: `${Math.round(annualProgress * 100)}%` }]}
                                    />
                                </View>
                                <Text style={styles.annualHint}>{booksRemaining} more book{booksRemaining !== 1 ? 's' : ''} to reach your goal of <Text style={styles.annualHintBold}>{ANNUAL_GOAL} books</Text> this year! 🚀</Text>
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
                                        {book.coverImage ? (
                                            <Image source={{ uri: book.coverImage }} style={StyleSheet.absoluteFill} resizeMode="cover" />
                                        ) : null}
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
        overflow: 'hidden',
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
