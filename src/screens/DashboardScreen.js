import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Zap, LogOut, Clock, Flame, CheckCircle, Play, ArrowRight, Video, FileText, Plus } from 'lucide-react-native';
import { Trophy } from 'lucide-react-native/icons';
import { COLORS, SHADOWS, GRADIENTS } from '../constants/theme';
import GlassCard from '../components/GlassCard';
import { useUser } from '../context/UserContext';
import { getDashboardData } from '../services/dashboardApi';

const DAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const CHART_MAX_HEIGHT = 70;
const PRIORITY_STYLES = {
    high: { bg: '#FECACA', text: '#EF4444', label: 'HIGH' },
    medium: { bg: '#FFEDD5', text: '#EA580C', label: 'MEDIUM' },
    low: { bg: '#D1FAE5', text: '#059669', label: 'LOW' },
};

const DashboardScreen = ({ navigation }) => {
    const { user, token, logout } = useUser();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const loadDashboard = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getDashboardData(token);
            setData(res);
        } catch (e) {
            setError(e.message || 'Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        loadDashboard();
    }, [loadDashboard]);

    const displayName = data?.userName ? data.userName.split(' ')[0] : (user?.name?.split(' ')[0] || user?.name || 'Student');
    const dateStr = data?.currentDate || new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    const stats = data?.userStats || {};
    const studyHours = stats.todayTimeSpentHours != null ? `${Number(stats.todayTimeSpentHours).toFixed(1)}h` : '0h';
    const streak = stats.userStreak ?? 0;
    const taskDone = stats.userTaskDone?.taskDone ?? 0;
    const totalTask = stats.userTaskDone?.totalTask ?? 3;
    const weekAnalysis = data?.weekAnalysis || [];
    const weekHours = DAY_LETTERS.map((_, i) => weekAnalysis[i]?.hours ?? 0);
    const maxWeekHours = Math.max(...weekHours, 1);
    const totalWeekHours = data?.totalTimeThisWeek ?? 0;
    const avgPerDay = data?.averageTimePerDay ?? 0;
    const continueLearning = data?.continueLearning || [];
    const todayTasks = data?.todayTasks || [];

    if (loading && !data) {
        return (
            <View style={styles.container}>
                <LinearGradient colors={[COLORS.background, '#F3E8FF', '#FFFFFF']} style={StyleSheet.absoluteFill} />
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.loadingWrap}>
                        <ActivityIndicator size="large" color={COLORS.primary} />
                        <Text style={styles.loadingText}>Loading dashboard...</Text>
                    </View>
                </SafeAreaView>
            </View>
        );
    }

    if (error && !data) {
        return (
            <View style={styles.container}>
                <LinearGradient colors={[COLORS.background, '#F3E8FF', '#FFFFFF']} style={StyleSheet.absoluteFill} />
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.errorWrap}>
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity style={styles.retryBtn} onPress={loadDashboard}>
                            <Text style={styles.retryBtnText}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </View>
        );
    }

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
                        <TouchableOpacity
                            style={styles.userInfo}
                            onPress={() => navigation.getParent()?.navigate('Profile')}
                            activeOpacity={0.8}
                        >
                            <View style={styles.avatarContainer}>
                                {data?.userProfilePhoto ? (
                                    <Image source={{ uri: data.userProfilePhoto }} style={styles.avatar} />
                                ) : (
                                    <View style={styles.avatar} />
                                )}
                                <View style={styles.onlineIndicator} />
                            </View>
                            <View>
                                <Text style={styles.greeting}>{displayName}</Text>
                                <Text style={styles.date}>{dateStr}</Text>
                            </View>
                        </TouchableOpacity>
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
                                    <Text style={[styles.statValue, { color: COLORS.primary }]}>{studyHours}</Text>
                                </View>
                                <Text style={styles.statSub}>Study Time</Text>
                            </View>
                            <View style={styles.statItem}>
                                <View style={styles.statRow}>
                                    <View style={[styles.statIconCircle, { backgroundColor: COLORS.warning }]}>
                                        <Flame size={18} color="#fff" strokeWidth={2.5} />
                                    </View>
                                    <Text style={[styles.statValue, { color: COLORS.warning }]}>{streak}</Text>
                                </View>
                                <Text style={styles.statSub}>Day Streak</Text>
                            </View>
                            <View style={styles.statItem}>
                                <View style={styles.statRow}>
                                    <View style={[styles.statIconCircle, { backgroundColor: COLORS.success }]}>
                                        <CheckCircle size={18} color="#fff" strokeWidth={2.5} />
                                    </View>
                                    <Text style={[styles.statValue, { color: COLORS.success }]}>{taskDone}/{totalTask}</Text>
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
                                <Text style={styles.chartValue}>{Number(totalWeekHours).toFixed(1)}h</Text>
                                <Text style={styles.chartSub}>Avg: {Number(avgPerDay).toFixed(1)}h</Text>
                            </View>
                        </View>
                        <View style={styles.chartBars}>
                            {DAY_LETTERS.map((day, index) => {
                                const hours = weekHours[index] ?? 0;
                                const height = (hours / maxWeekHours) * CHART_MAX_HEIGHT || 0;
                                return (
                                    <View key={index} style={styles.barContainer}>
                                        <LinearGradient
                                            colors={height > 0 && index === (new Date().getDay() + 6) % 7 ? GRADIENTS.primary : ['#E9D5FF', '#E9D5FF']}
                                            style={[styles.bar, { height: Math.max(height, 4), opacity: height === 0 ? 0.2 : 1 }]}
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
                        {continueLearning.map((course, idx) => (
                            <GlassCard key={course.bookName + idx} style={styles.courseCard}>
                                <View style={styles.courseCardRow}>
                                    <View style={styles.courseImageWrap}>
                                        <LinearGradient
                                            colors={['#E9D5FF', '#F5D0FE', '#FFFFFF']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                            style={styles.courseImage}
                                        />
                                        {course.chapterNumber != null && (
                                            <View style={styles.courseBadge}>
                                                <Text style={styles.courseBadgeText}>{course.chapterNumber}</Text>
                                            </View>
                                        )}
                                    </View>
                                    <View style={styles.courseInfo}>
                                        <Text style={[styles.courseTitle, { fontSize: 12 }]}>{course.bookName}</Text>
                                        <Text style={[styles.courseSub, { fontSize: 10 }]}>Chapter {course.chapterNumber}: {course.chapterName}</Text>
                                        <View style={styles.courseProgressRow}>
                                            <View style={styles.courseProgressBarBg}>
                                                <LinearGradient colors={GRADIENTS.primary} style={[styles.courseProgressBarFill, { width: `${course.progressPercentage ?? 0}%` }]} />
                                            </View>
                                        </View>
                                        <View style={styles.courseMeta}>
                                            <Text style={styles.metaText}>{course.chapterNumber}/{course.totalChapters} lessons</Text>
                                            <Text style={styles.metaText}>{course.timeLeftHours ? `${course.timeLeftHours}h left` : '—'}</Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity style={styles.coursePlayWrap} activeOpacity={0.8}>
                                        <LinearGradient colors={GRADIENTS.primary} style={styles.coursePlayBtn}>
                                            <Play size={15} color="#fff" fill="#fff" />
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                            </GlassCard>
                        ))}
                    </View>

                    {/* Today's Tasks */}
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionTitleRow}>
                            <View style={styles.indicator} />
                            <Text style={styles.sectionTitle}>Today's Tasks</Text>
                            <View style={styles.countBadge}><Text style={styles.countText}>{taskDone}/{totalTask}</Text></View>
                        </View>
                        <TouchableOpacity>
                            <View style={styles.addButton}>
                                <Plus size={20} color="#fff" />
                            </View>
                        </TouchableOpacity>
                    </View>

                    <GlassCard style={styles.taskCard}>
                        {todayTasks.length === 0 ? (
                            <View style={styles.taskRow}>
                                <Text style={styles.taskEmpty}>No tasks for today</Text>
                            </View>
                        ) : (
                            todayTasks.map((task, idx) => {
                                const pri = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.medium;
                                return (
                                    <View key={task.taskTitle + idx} style={[styles.taskRow, idx > 0 && styles.taskRowBorder]}>
                                        <TouchableOpacity style={styles.checkbox} />
                                        <View style={[styles.taskIcon, { backgroundColor: '#F3E8FF' }]}>
                                            <FileText size={18} color={COLORS.primary} />
                                        </View>
                                        <View style={styles.taskContent}>
                                            <Text style={styles.taskTitle}>{task.taskTitle}</Text>
                                            <View style={styles.taskMeta}>
                                                <Clock size={12} color={COLORS.textSecondary} />
                                                <Text style={styles.taskTime}>{task.taskDueTime}</Text>
                                                <Text style={[styles.taskTag, { color: COLORS.primary }]}>• {task.taskCourse}</Text>
                                            </View>
                                        </View>
                                        <View style={[styles.priorityBadge, { backgroundColor: pri.bg }]}>
                                            <Text style={[styles.priorityText, { color: pri.text }]}>{pri.label}</Text>
                                        </View>
                                    </View>
                                );
                            })
                        )}
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
        backgroundColor: '#ddd',
    },
    loadingWrap: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: { marginTop: 12, fontSize: 15, color: COLORS.textSecondary },
    errorWrap: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    errorText: { fontSize: 16, color: COLORS.textSecondary, textAlign: 'center', marginBottom: 16 },
    retryBtn: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: COLORS.primary,
    },
    retryBtnText: { fontSize: 16, fontWeight: '600', color: '#fff' },
    taskEmpty: { fontSize: 14, color: COLORS.textSecondary, paddingVertical: 12 },
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
