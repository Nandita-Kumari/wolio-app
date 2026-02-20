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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Text as SvgText } from 'react-native-svg';
import {
    ArrowLeft,
    Flame,
    CircleDollarSign,
    BookOpen,
    Star,
    TrendingUp,
    Trophy,
    Sparkles,
    Award,
    Check,
    X,
} from 'lucide-react-native';
import { COLORS, GRADIENTS } from '../constants/theme';

const NOTIFICATIONS = [
    { id: '1', title: 'Amazing Streak!', emoji: '🔥', description: "You've completed your 15-day learning streak! Keep the momentum going - you're unstoppable!", timeAgo: '2 hours ago', unread: true, icon: Flame, iconColor: '#F97316' },
    { id: '2', title: 'Coins Earned!', emoji: '💰', description: "You've earned 150 coins for completing the Quantum Physics module. Great work!", timeAgo: '1 day ago', unread: true, icon: CircleDollarSign, iconColor: '#EAB308' },
    { id: '3', title: 'Book Completed!', emoji: '📖', description: "You've finished 'Introduction to Calculus'. Congratulations on another milestone!", timeAgo: '1 day ago', unread: true, icon: BookOpen, iconColor: '#A855F7' },
    { id: '4', title: 'Perfect Score!', emoji: '⭐', description: "You aced the Chemistry Quiz! 100% - that's perfection.", timeAgo: '2 days ago', unread: false, icon: Star, iconColor: '#EC4899' },
    { id: '5', title: 'Level Up!', emoji: '⬆️', description: "You've reached Level 12! Your dedication is paying off.", timeAgo: '3 days ago', unread: false, icon: TrendingUp, iconColor: '#10B981' },
    { id: '6', title: 'Achievement Unlocked!', emoji: '🏆', description: "You've unlocked the 'Early Bird' badge for studying before 8 AM.", timeAgo: '4 days ago', unread: false, icon: Trophy, iconColor: '#F97316' },
    { id: '7', title: 'Daily Bonus!', emoji: '✨', description: "Your daily login bonus: 50 coins. Come back tomorrow for more!", timeAgo: '5 days ago', unread: false, icon: Sparkles, iconColor: '#A855F7' },
    { id: '8', title: 'Milestone Reached!', emoji: '🥳', description: "You've completed 50 lessons. Halfway to your next big goal!", timeAgo: '6 days ago', unread: false, icon: Award, iconColor: '#3B82F6' },
];

const NotificationScreen = ({ navigation }) => {
    const [filter, setFilter] = useState('all');
    const [notifications, setNotifications] = useState(NOTIFICATIONS);

    const unreadCount = notifications.filter(n => n.unread).length;
    const totalCount = notifications.length;
    const filtered = filter === 'unread'
        ? notifications.filter(n => n.unread)
        : notifications;

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    };

    const markAsRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
    };

    const dismissNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

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
                        <View style={styles.headerTitleWrap}>
                            <Svg width={180} height={28}>
                                <Defs>
                                    <SvgLinearGradient id="notifTitleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <Stop offset="0%" stopColor="#8B5CF6" />
                                        <Stop offset="50%" stopColor="#D946EF" />
                                        <Stop offset="100%" stopColor="#EC4899" />
                                    </SvgLinearGradient>
                                </Defs>
                                <SvgText
                                    x={0}
                                    y={22}
                                    fill="url(#notifTitleGrad)"
                                    fontSize={22}
                                    fontWeight="bold"
                                >
                                    Notifications
                                </SvgText>
                            </Svg>
                        </View>
                        <Text style={styles.headerSubtitle}>{unreadCount} unread notifications</Text>
                    </View>
                </View>

                {/* Filters */}
                <View style={styles.filters}>
                    <Pressable
                        style={[styles.filterBtn, filter === 'all' && styles.filterBtnActive]}
                        onPress={() => setFilter('all')}
                    >
                        {filter === 'all' ? (
                            <LinearGradient colors={GRADIENTS.primary} style={styles.filterBtnGradient}>
                                <Text style={styles.filterTextActive}>All ({totalCount})</Text>
                            </LinearGradient>
                        ) : (
                            <Text style={styles.filterText}>All ({totalCount})</Text>
                        )}
                    </Pressable>
                    <Pressable
                        style={[styles.filterBtn, filter === 'unread' && styles.filterBtnActive]}
                        onPress={() => setFilter('unread')}
                    >
                        {filter === 'unread' ? (
                            <LinearGradient colors={GRADIENTS.primary} style={styles.filterBtnGradient}>
                                <Text style={styles.filterTextActive}>Unread ({unreadCount})</Text>
                            </LinearGradient>
                        ) : (
                            <Text style={styles.filterText}>Unread ({unreadCount})</Text>
                        )}
                    </Pressable>
                </View>

                {/* Mark all as read */}
                <TouchableOpacity style={styles.markAllBtn} onPress={markAllRead} activeOpacity={0.8}>
                    <LinearGradient colors={GRADIENTS.primary} style={styles.markAllIconWrap}>
                        <Check size={14} color="#fff" strokeWidth={3} />
                    </LinearGradient>
                    <Text style={styles.markAllText}>Mark all as read</Text>
                </TouchableOpacity>

                {/* Notification list */}
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {filtered.map((item) => {
                        const IconComponent = item.icon;
                        return (
                            <View key={item.id} style={styles.card}>
                                {item.unread && <View style={styles.unreadDot} />}
                                <TouchableOpacity
                                    style={styles.dismissBtn}
                                    onPress={() => dismissNotification(item.id)}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                    <X size={18} color={COLORS.danger} />
                                </TouchableOpacity>
                                <View style={styles.cardIconWrap}>
                                    <View style={[styles.cardIconBg, { backgroundColor: item.iconColor }]}>
                                        <IconComponent size={22} color="#fff" strokeWidth={2} />
                                    </View>
                                </View>
                                <View style={styles.cardBody}>
                                    <Text style={styles.cardTitle}>{item.title} {item.emoji}</Text>
                                    <Text style={styles.cardDesc}>{item.description}</Text>
                                    <View style={styles.cardFooter}>
                                        <Text style={styles.cardTime}>{item.timeAgo}</Text>
                                        {item.unread && (
                                            <TouchableOpacity onPress={() => markAsRead(item.id)}>
                                                <Text style={styles.markReadText}>Mark as read</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            </View>
                        );
                    })}
                    <View style={{ height: 120 }} />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    safeArea: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 8 : 16,
        paddingBottom: 16,
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
    headerTitleWrap: { marginBottom: 2 },
    headerSubtitle: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    filters: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingTop: 16,
        gap: 12,
    },
    filterBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 14,
        overflow: 'hidden',
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    filterBtnActive: { borderWidth: 0, overflow: 'hidden' },
    filterBtnGradient: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterText: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.textSecondary,
    },
    filterTextActive: {
        fontSize: 15,
        fontWeight: '700',
        color: '#fff',
    },
    markAllBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 16,
        marginTop: 14,
        paddingVertical: 12,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        backgroundColor: '#fff',
    },
    markAllIconWrap: {
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    markAllText: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.primary,
    },
    scroll: { flex: 1 },
    scrollContent: { padding: 16, paddingTop: 20 },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 14,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 4,
        position: 'relative',
    },
    unreadDot: {
        position: 'absolute',
        top: 14,
        right: 40,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.primary,
    },
    dismissBtn: {
        position: 'absolute',
        top: 12,
        right: 12,
        zIndex: 1,
    },
    cardIconWrap: { marginRight: 14 },
    cardIconBg: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardBody: { flex: 1, minWidth: 0 },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 4,
    },
    cardDesc: {
        fontSize: 14,
        color: COLORS.textSecondary,
        lineHeight: 20,
        marginBottom: 8,
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    cardTime: {
        fontSize: 13,
        color: COLORS.textSecondary,
    },
    markReadText: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.primary,
    },
});

export default NotificationScreen;
