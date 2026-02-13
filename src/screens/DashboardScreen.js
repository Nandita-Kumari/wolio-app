import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, SafeAreaView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, Trophy, ArrowRight, Play, CheckCircle, Home, Book, Compass, Plus, Clock, Flame, CheckSquare } from 'lucide-react-native';
import { COLORS, SHADOWS, GRADIENTS } from '../constants/theme';
import GlassCard from '../components/GlassCard';

const DashboardScreen = () => {
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[COLORS.background, '#F3E8FF', '#FFFFFF']}
                style={StyleSheet.absoluteFill}
            />
            <SafeAreaView style={styles.safeArea}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.userInfo}>
                            <View style={styles.avatarContainer}>
                                {/* Placeholder for Avatar */}
                                <View style={styles.avatar} />
                                <View style={styles.onlineIndicator} />
                            </View>
                            <View>
                                <Text style={styles.greeting}>Jordan Lee</Text>
                                <Text style={styles.date}>Friday, Feb 13</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.notificationBtn}>
                            <LinearGradient colors={['#A855F7', '#EC4899']} style={styles.notificationGradient}>
                                <Bell size={20} color="#fff" strokeWidth={2.5} />
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    {/* Stats Row */}
                    <GlassCard style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}><Clock size={14} color={COLORS.primary} /> 2.7h</Text>
                            <Text style={styles.statSub}>Study Time</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}><Flame size={14} color={COLORS.warning} /> 15</Text>
                            <Text style={styles.statSub}>Day Streak</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}><CheckSquare size={14} color={COLORS.success} /> 0/3</Text>
                            <Text style={styles.statSub}>Tasks</Text>
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

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                        <GlassCard style={styles.courseCard}>
                            <View style={[styles.courseImage, { backgroundColor: '#E9D5FF' }]}>
                                <View style={styles.badge}><Text style={styles.badgeText}>5</Text></View>
                            </View>
                            <View style={styles.courseInfo}>
                                <Text style={styles.courseTitle}>Quantum Mechanics</Text>
                                <Text style={styles.courseSub}>Chapter 12: Wave Functions</Text>
                                <View style={styles.courseProgressRow}>
                                    <View style={styles.courseProgressBarBg}>
                                        <LinearGradient colors={GRADIENTS.primary} style={[styles.courseProgressBarFill, { width: '60%' }]} />
                                    </View>
                                </View>
                                <View style={styles.courseMeta}>
                                    <Text style={styles.metaText}>12/18 lessons</Text>
                                    <Text style={styles.metaText}>28 min left</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.playButton}>
                                <LinearGradient colors={GRADIENTS.primary} style={styles.playGradient}>
                                    <Play size={20} color="#fff" fill="#fff" />
                                </LinearGradient>
                            </TouchableOpacity>
                        </GlassCard>
                    </ScrollView>

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
                        {/* Task 1 */}
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
                    </GlassCard>

                    <View style={{ height: 100 }} />
                </ScrollView>
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
    notificationBtn: {
        // Shadow handled by gradient wrapper or surrounding view usually
    },
    notificationGradient: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        marginBottom: 24,
        backgroundColor: '#fff',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 4,
    },
    statSub: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    divider: {
        width: 1,
        height: '100%',
        backgroundColor: '#E5E7EB',
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
    horizontalScroll: {
        marginBottom: 24,
        overflow: 'visible',
    },
    courseCard: {
        width: 300,
        padding: 16,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    courseImage: {
        width: 60,
        height: 60,
        borderRadius: 12,
        marginRight: 16,
    },
    badge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: COLORS.warning,
        width: 16,
        height: 16,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '700',
    },
    courseInfo: {
        flex: 1,
    },
    courseTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.text,
    },
    courseSub: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginBottom: 8,
    },
    courseProgressRow: {
        marginBottom: 8,
    },
    courseProgressBarBg: {
        height: 4,
        backgroundColor: '#F3E8FF',
        borderRadius: 2,
        width: '100%',
    },
    courseProgressBarFill: {
        height: 4,
        borderRadius: 2,
    },
    courseMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    metaText: {
        fontSize: 10,
        color: COLORS.textSecondary,
    },
    playButton: {
        marginLeft: 12,
    },
    playGradient: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
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
