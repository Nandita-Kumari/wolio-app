import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Zap, LogOut, Clock, Flame, CheckCircle, Play, ArrowRight, Video, FileText, Plus } from 'lucide-react-native';
import { Trophy } from 'lucide-react-native/icons';
import { COLORS, SHADOWS, GRADIENTS } from '../constants/theme';
import GlassCard from '../components/GlassCard';
import { useUser } from '../context/UserContext';

const DashboardScreen = () => {
    const { user, logout } = useUser();
    const displayName = user?.name?.split(' ')[0] || user?.name || 'Student';
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

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
                        <View style={styles.userInfo}>
                            <View style={styles.avatarContainer}>
                                <View style={styles.avatar} />
                                <View style={styles.onlineIndicator} />
                            </View>
                            <View>
                                <Text style={styles.greeting}>{displayName}</Text>
                                <Text style={styles.date}>{dateStr}</Text>
                            </View>
                        </View>
                        <View style={styles.headerButtons}>
                            <TouchableOpacity style={styles.logoutBtn} onPress={() => logout()} activeOpacity={0.7}>
                                <LogOut size={20} color={COLORS.textSecondary} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.notificationBtn}>
                                <LinearGradient colors={GRADIENTS.primary} style={styles.notificationGradient}>
                                    <Zap size={20} color="#fff" strokeWidth={2.5} />
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Stats Row - three equal columns in a row: icon + value on top, label below */}
                    <GlassCard style={styles.statsContainer}>
                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <View style={styles.statRow}>
                                    <View style={[styles.statIconCircle, { backgroundColor: COLORS.primary }]}>
                                        <Clock size={18} color="#fff" strokeWidth={2.5} />
                                    </View>
                                    <Text style={[styles.statValue, { color: COLORS.primary }]}>2.7h</Text>
                                </View>
                                <Text style={styles.statSub}>Study Time</Text>
                            </View>
                            <View style={styles.statItem}>
                                <View style={styles.statRow}>
                                    <View style={[styles.statIconCircle, { backgroundColor: COLORS.warning }]}>
                                        <Flame size={18} color="#fff" strokeWidth={2.5} />
                                    </View>
                                    <Text style={[styles.statValue, { color: COLORS.warning }]}>15</Text>
                                </View>
                                <Text style={styles.statSub}>Day Streak</Text>
                            </View>
                            <View style={styles.statItem}>
                                <View style={styles.statRow}>
                                    <View style={[styles.statIconCircle, { backgroundColor: COLORS.success }]}>
                                        <CheckCircle size={18} color="#fff" strokeWidth={2.5} />
                                    </View>
                                    <Text style={[styles.statValue, { color: COLORS.success }]}>0/3</Text>
                                </View>
                                <Text style={styles.statSub}>Tasks</Text>
                            </View>
                        </View>
                    </GlassCard>

                    {/* Weekly Chart */}
                    <GlassCard style={styles.chartCard}>
                        <View style={styles.chartHeader}>
                            <View style={styles.sectionTitleRow}>
                                <View style={styles.indicator} />
                                <Text style={styles.sectionTitle}>This Week</Text>
                            </View>
                            <View>
                                <Text style={styles.chartValue}>12.3h</Text>
                                <Text style={styles.chartSub}>Avg: 1.8h</Text>
                            </View>
                        </View>
                        <View style={styles.chartBars}>
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => {
                                const height = [40, 60, 30, 45, 70, 0, 0][index];
                                // Mock chart
                                return (
                                    <View key={index} style={styles.barContainer}>
                                        <LinearGradient
                                            colors={index === 4 ? GRADIENTS.primary : ['#E9D5FF', '#E9D5FF']}
                                            style={[styles.bar, { height: height, opacity: height === 0 ? 0.2 : 1 }]}
                                        />
                                        <Text style={styles.dayLabel}>{day}</Text>
                                    </View>
                                );
                            })}
                        </View>
                    </GlassCard>

                    {/* Achievement */}
                    <GlassCard style={styles.achievementCard}>
                        <View style={styles.achievementContent}>
                            <View style={styles.trophyContainer}>
                                <Trophy size={24} color="#fff" />
                            </View>
                            <View style={styles.achievementText}>
                                <Text style={styles.achievementTitle}>Next Achievement</Text>
                                <Text style={styles.achievementSub}>Complete 5 more tasks</Text>
                            </View>
                            <View style={styles.achievementProgress}>
                                <Text style={styles.percentText}>75%</Text>
                                <ArrowRight size={16} color={COLORS.textSecondary} />
                            </View>
                        </View>
                        <View style={styles.progressBarBg}>
                            <LinearGradient colors={['#F59E0B', '#F59E0B']} style={[styles.progressBarFill, { width: '75%' }]} />
                        </View>
                    </GlassCard>

                    {/* Continue Learning */}
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionTitleRow}>
                            <View style={styles.indicator} />
                            <Text style={styles.sectionTitle}>Continue Learning</Text>
                        </View>
                        <TouchableOpacity>
                            <Text style={styles.seeAll}>See All →</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.courseCardsColumn}>
                        <GlassCard style={styles.courseCard}>
                            <View style={styles.courseCardRow}>
                                <View style={styles.courseImageWrap}>
                                    <LinearGradient
                                        colors={['#E9D5FF', '#F5D0FE', '#FFFFFF']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={styles.courseImage}
                                    />
                                    <View style={styles.courseBadge}>
                                        <Text style={styles.courseBadgeText}>5</Text>
                                    </View>
                                </View>
                                <View style={styles.courseInfo}>
                                    <Text style={[styles.courseTitle, { fontSize: 12 }]}>Quantum Mechanics</Text>
                                    <Text style={[styles.courseSub, { fontSize: 10 }]}>Chapter 12: Wave Functions</Text>
                                    <View style={styles.courseProgressRow}>
                                        <View style={styles.courseProgressBarBg}>
                                            <LinearGradient colors={GRADIENTS.primary} style={[styles.courseProgressBarFill, { width: '67%' }]} />
                                        </View>
                                    </View>
                                    <View style={styles.courseMeta}>
                                        <Text style={styles.metaText}>12/18 lessons</Text>
                                        <Text style={styles.metaText}>28 min left</Text>
                                    </View>
                                </View>
                                <TouchableOpacity style={styles.coursePlayWrap} activeOpacity={0.8}>
                                    <LinearGradient colors={GRADIENTS.primary} style={styles.coursePlayBtn}>
                                        <Play size={15} color="#fff" fill="#fff" />
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        </GlassCard>
                        <GlassCard style={styles.courseCard}>
                            <View style={styles.courseCardRow}>
                                <View style={styles.courseImageWrap}>
                                    <LinearGradient
                                        colors={['#E9D5FF', '#F5D0FE', '#FFFFFF']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={styles.courseImage}
                                    />
                                    <View style={styles.courseBadge}>
                                        <Text style={styles.courseBadgeText}>5</Text>
                                    </View>
                                </View>
                                <View style={styles.courseInfo}>
                                    <Text style={[styles.courseTitle, { fontSize: 12 }]}>Quantum Mechanics</Text>
                                    <Text style={[styles.courseSub, { fontSize: 10 }]}>Chapter 12: Wave Functions</Text>
                                    <View style={styles.courseProgressRow}>
                                        <View style={styles.courseProgressBarBg}>
                                            <LinearGradient colors={GRADIENTS.primary} style={[styles.courseProgressBarFill, { width: '67%' }]} />
                                        </View>
                                    </View>
                                    <View style={styles.courseMeta}>
                                        <Text style={styles.metaText}>12/18 lessons</Text>
                                        <Text style={styles.metaText}>28 min left</Text>
                                    </View>
                                </View>
                                <TouchableOpacity style={styles.coursePlayWrap} activeOpacity={0.8}>
                                    <LinearGradient colors={GRADIENTS.primary} style={styles.coursePlayBtn}>
                                        <Play size={15} color="#fff" fill="#fff" />
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        </GlassCard>
                    </View>

                    {/* Today's Tasks */}
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionTitleRow}>
                            <View style={styles.indicator} />
                            <Text style={styles.sectionTitle}>Today's Tasks</Text>
                            <View style={styles.countBadge}><Text style={styles.countText}>0/3</Text></View>
                        </View>
                        <TouchableOpacity>
                            <View style={styles.addButton}>
                                <Plus size={20} color="#fff" />
                            </View>
                        </TouchableOpacity>
                    </View>

                    <GlassCard style={styles.taskCard}>
                        <View style={styles.taskRow}>
                            <TouchableOpacity style={styles.checkbox} />
                            <View style={[styles.taskIcon, { backgroundColor: '#F3E8FF' }]}>
                                <View style={{ width: 16, height: 16, borderRadius: 4, borderWidth: 1, borderColor: COLORS.primary }} />
                            </View>
                            <View style={styles.taskContent}>
                                <Text style={styles.taskTitle}>Complete Physics Quiz</Text>
                                <View style={styles.taskMeta}>
                                    <Clock size={12} color={COLORS.textSecondary} />
                                    <Text style={styles.taskTime}>in 2 hours</Text>
                                    <Text style={[styles.taskTag, { color: COLORS.primary }]}>• Physics</Text>
                                </View>
                            </View>
                            <View style={[styles.priorityBadge, { backgroundColor: '#FECACA' }]}>
                                <Text style={[styles.priorityText, { color: '#EF4444' }]}>HIGH</Text>
                            </View>
                        </View>
                        <View style={[styles.taskRow, styles.taskRowBorder]}>
                            <TouchableOpacity style={styles.checkbox} />
                            <View style={[styles.taskIcon, { backgroundColor: '#F3E8FF' }]}>
                                <Video size={18} color={COLORS.primary} />
                            </View>
                            <View style={styles.taskContent}>
                                <Text style={styles.taskTitle}>Watch Calculus Lecture</Text>
                                <View style={styles.taskMeta}>
                                    <Clock size={12} color={COLORS.textSecondary} />
                                    <Text style={styles.taskTime}>in 4 hours</Text>
                                    <Text style={[styles.taskTag, { color: COLORS.primary }]}>• Calculus</Text>
                                </View>
                            </View>
                            <View style={[styles.priorityBadge, { backgroundColor: '#FFEDD5' }]}>
                                <Text style={[styles.priorityText, { color: '#EA580C' }]}>MEDIUM</Text>
                            </View>
                        </View>
                        <View style={[styles.taskRow, styles.taskRowBorder]}>
                            <TouchableOpacity style={styles.checkbox} />
                            <View style={[styles.taskIcon, { backgroundColor: '#F3E8FF' }]}>
                                <FileText size={18} color={COLORS.primary} />
                            </View>
                            <View style={styles.taskContent}>
                                <Text style={styles.taskTitle}>Submit Lab Report</Text>
                                <View style={styles.taskMeta}>
                                    <Clock size={12} color={COLORS.textSecondary} />
                                    <Text style={styles.taskTime}>tomorrow</Text>
                                    <Text style={[styles.taskTag, { color: COLORS.primary }]}>• Chemistry</Text>
                                </View>
                            </View>
                            <View style={[styles.priorityBadge, { backgroundColor: '#D1FAE5' }]}>
                                <Text style={[styles.priorityText, { color: '#059669' }]}>LOW</Text>
                            </View>
                        </View>
                    </GlassCard>

                    <View style={{ height: 120 }} />
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
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        marginRight: 12,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#ddd', // Placeholder
    },
    onlineIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: COLORS.success,
        position: 'absolute',
        bottom: 0,
        right: 0,
        borderWidth: 2,
        borderColor: '#fff',
    },
    greeting: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.text,
    },
    date: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    headerButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoutBtn: {
        padding: 8,
        marginRight: 4,
    },
    notificationBtn: {},
    notificationGradient: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statsContainer: {
        marginBottom: 24,
        backgroundColor: '#fff',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 6,
    },
    statIconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 6,
    },
    statValue: {
        fontSize: 17,
        fontWeight: '700',
    },
    statSub: {
        fontSize: 12,
        color: COLORS.textSecondary,
        textAlign: 'center',
    },
    chartCard: {
        padding: 20,
        marginBottom: 24,
        backgroundColor: '#fff',
    },
    chartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
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
    chartValue: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.primary,
        textAlign: 'right',
    },
    chartSub: {
        fontSize: 12,
        color: COLORS.textSecondary,
        textAlign: 'right',
    },
    chartBars: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 80,
    },
    barContainer: {
        alignItems: 'center',
    },
    bar: {
        width: 24,
        borderRadius: 12,
        marginBottom: 8,
    },
    dayLabel: {
        fontSize: 12,
        color: COLORS.textSecondary,
        fontWeight: '600',
    },
    achievementCard: {
        padding: 16,
        marginBottom: 24,
        backgroundColor: '#fff',
    },
    achievementContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    trophyContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: COLORS.warning,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    achievementText: {
        flex: 1,
    },
    achievementTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.text,
    },
    achievementSub: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    achievementProgress: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    percentText: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.warning,
        marginRight: 4,
    },
    progressBarBg: {
        height: 6,
        backgroundColor: '#FEF3C7',
        borderRadius: 3,
    },
    progressBarFill: {
        height: 6,
        borderRadius: 3,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    seeAll: {
        color: COLORS.primary,
        fontWeight: '600',
    },
    countBadge: {
        backgroundColor: '#F3E8FF',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
        marginLeft: 8,
    },
    countText: {
        color: COLORS.primary,
        fontSize: 12,
        fontWeight: '700',
    },
    addButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.secondary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    courseCardsColumn: {
        marginBottom: 24,
    },
    courseCard: {
        width: '100%',
        marginBottom: 12,
        backgroundColor: '#fff',
        ...SHADOWS.medium,
    },
    courseCardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
    },
    courseImageWrap: {
        position: 'relative',
        marginRight: 14,
    },
    courseImage: {
        width: 72,
        height: 72,
        borderRadius: 14,
    },
    courseBadge: {
        position: 'absolute',
        top: -6,
        right: -6,
        backgroundColor: COLORS.warning,
        minWidth: 22,
        height: 22,
        borderRadius: 11,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
    },
    courseBadgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
    },
    courseInfo: {
        flex: 1,
        minWidth: 0,
    },
    courseTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 2,
    },
    courseSub: {
        fontSize: 8,
        color: COLORS.textSecondary,
        marginBottom: 8,
    },
    courseProgressRow: {
        marginBottom: 6,
    },
    courseProgressBarBg: {
        height: 5,
        backgroundColor: '#F3E8FF',
        borderRadius: 3,
        width: '100%',
    },
    courseProgressBarFill: {
        height: 5,
        borderRadius: 3,
    },
    courseMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    metaText: {
        fontSize: 10,
        color: COLORS.textSecondary,
    },
    coursePlayWrap: {
        marginLeft: 10,
    },
    coursePlayBtn: {
        width: 34,
        height: 34,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
        elevation: 6,
    },
    taskCard: {
        padding: 16,
        backgroundColor: '#fff',
        marginBottom: 12,
    },
    taskRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    taskRowBorder: {
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        marginTop: 12,
        paddingTop: 12,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.textSecondary,
        marginRight: 12,
    },
    taskIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    taskContent: {
        flex: 1,
    },
    taskTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
    },
    taskMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    taskTime: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginLeft: 4,
        marginRight: 8,
    },
    taskTag: {
        fontSize: 12,
        fontWeight: '600',
    },
    priorityBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    priorityText: {
        fontSize: 10,
        fontWeight: '700',
    },
});

export default DashboardScreen;
