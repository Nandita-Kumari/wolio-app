import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, Search, BookOpen, Bookmark, Award } from 'lucide-react-native';
import { COLORS, SHADOWS, GRADIENTS } from '../constants/theme';
import GlassCard from '../components/GlassCard';
import { useUser } from '../context/UserContext';

const { width } = Dimensions.get('window');

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
    const books = [
        { id: 1, title: 'Industrial Revolution', progress: 0.25, total: 200, current: 50, color: '#64748B' },
        { id: 2, title: 'Quantum Mechanics', progress: 0.8, total: 300, current: 240, color: '#A855F7' }, // Featured/Active
        { id: 3, title: 'Organic Chemistry', progress: 0.55, total: 150, current: 82, color: '#EC4899' },
        { id: 4, title: 'World Literature', progress: 0.35, total: 400, current: 140, color: '#EA580C' },
        { id: 5, title: 'Cell Biology', progress: 0.6, total: 250, current: 150, color: '#EF4444' },
        { id: 6, title: 'Economics Today', progress: 0.15, total: 180, current: 27, color: '#10B981' },
    ];

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
                        <View style={styles.headerTitleContainer}>
                            <View style={styles.iconBox}>
                                <BookOpen size={24} color="#fff" />
                            </View>
                            <View>
                                <Text style={styles.headerTitle}>My Library</Text>
                                <Text style={styles.headerSub}>6 books</Text>
                            </View>
                        </View>
                        <View style={styles.headerActions}>
                            <TouchableOpacity style={styles.iconBtn} onPress={() => requireAuth('add books')}>
                                <Plus size={20} color={COLORS.primary} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconBtn} onPress={() => requireAuth('search your library')}>
                                <Search size={20} color={COLORS.primary} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Reading Goal */}
                    <GlassCard style={styles.goalCard}>
                        <View style={styles.goalHeader}>
                            <Text style={styles.goalTitle}>2024 Reading Goal</Text>
                            <Text style={styles.goalPercent}>60%</Text>
                        </View>
                        <Text style={styles.goalSub}>12 of 20 books completed</Text>
                        <View style={styles.progressBarBg}>
                            <LinearGradient colors={GRADIENTS.primary} style={[styles.progressBarFill, { width: '60%' }]} />
                        </View>
                    </GlassCard>

                    {/* Stats */}
                    <View style={styles.statsRow}>
                        <View style={styles.statCard}>
                            <View style={[styles.statIcon, { backgroundColor: '#C084FC' }]}>
                                <BookOpen size={16} color="#fff" />
                            </View>
                            <Text style={styles.statValue}>0</Text>
                            <Text style={styles.statLabel}>READING</Text>
                        </View>
                        <View style={styles.statCard}>
                            <View style={[styles.statIcon, { backgroundColor: '#F472B6' }]}>
                                <Bookmark size={16} color="#fff" />
                            </View>
                            <Text style={styles.statValue}>6</Text>
                            <Text style={styles.statLabel}>ON SHELF</Text>
                        </View>
                        <View style={styles.statCard}>
                            <View style={[styles.statIcon, { backgroundColor: '#FB7185' }]}>
                                <Award size={16} color="#fff" />
                            </View>
                            <Text style={styles.statValue}>12</Text>
                            <Text style={styles.statLabel}>FINISHED</Text>
                        </View>
                    </View>

                    {/* Bookshelf */}
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionTitleRow}>
                            <View style={styles.indicator} />
                            <Text style={styles.sectionTitle}>My Bookshelf</Text>
                        </View>
                        <TouchableOpacity onPress={() => requireAuth('view all books')}>
                            <Text style={styles.seeAll}>View All →</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.booksGrid}>
                        {books.map((book) => (
                            <TouchableOpacity key={book.id} style={styles.bookItem} onPress={() => requireAuth('open books')} activeOpacity={0.9}>
                                <View style={[styles.bookCover, { backgroundColor: book.color }]}>
                                    <Text style={styles.bookTitleOnCover}>{book.title}</Text>
                                    {/* Overlay gradient */}
                                    <LinearGradient
                                        colors={['transparent', 'rgba(0,0,0,0.8)']}
                                        style={StyleSheet.absoluteFill}
                                    />
                                    <View style={styles.bookMeta}>
                                        <View style={styles.bookProgressBg}>
                                            <View style={[styles.bookProgressFill, { width: `${book.progress * 100}%` }]} />
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                                            <Text style={styles.bookProgressText}>{book.current}/{book.total}</Text>
                                            <Text style={styles.bookProgressText}>{Math.round(book.progress * 100)}%</Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={{ height: 100 }} />
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
        padding: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: '#A855F7',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.text,
    },
    headerSub: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    headerActions: {
        flexDirection: 'row',
    },
    iconBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3E8FF', // Light purple bg
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    goalCard: {
        padding: 20,
        marginBottom: 24,
        backgroundColor: '#fff',
    },
    goalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    goalTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.text,
    },
    goalPercent: {
        fontSize: 20,
        fontWeight: '700',
        color: '#D946EF', // Fuchsia
    },
    goalSub: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: 12,
    },
    progressBarBg: {
        height: 12,
        backgroundColor: '#F3E8FF',
        borderRadius: 6,
    },
    progressBarFill: {
        height: 12,
        borderRadius: 6,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    statCard: {
        width: (width - 48 - 24) / 3, // simplified width calc
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 12,
        alignItems: 'center',
        ...SHADOWS.small,
    },
    statIcon: {
        width: 32,
        height: 32,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    statValue: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 2,
    },
    statLabel: {
        fontSize: 10,
        fontWeight: '600',
        color: COLORS.textSecondary,
        letterSpacing: 0.5,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    indicator: {
        width: 4,
        height: 16,
        backgroundColor: '#D946EF',
        borderRadius: 2,
        marginRight: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.text,
    },
    seeAll: {
        color: '#D946EF',
        fontWeight: '600',
    },
    booksGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    bookItem: {
        width: (width - 48 - 16) / 2, // 2 cols
        marginBottom: 16,
    },
    bookCover: {
        height: 220,
        borderRadius: 16,
        overflow: 'hidden',
        justifyContent: 'flex-end',
        padding: 12,
    },
    bookTitleOnCover: {
        position: 'absolute',
        top: 16,
        left: 12,
        right: 12,
        color: 'rgba(255,255,255,0.9)',
        fontSize: 16,
        fontWeight: '700',
    },
    bookMeta: {
        width: '100%',
    },
    bookProgressBg: {
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 2,
    },
    bookProgressFill: {
        height: 4,
        backgroundColor: '#fff',
        borderRadius: 2,
    },
    bookProgressText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '600',
    },
});

export default LibraryScreen;
