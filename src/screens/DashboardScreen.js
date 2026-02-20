import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Image, ActivityIndicator, Alert, Modal, Pressable, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Bell, LogOut, Clock, Flame, CheckCircle, Play, ArrowRight, Folder, Brain, Plus, X } from 'lucide-react-native';
import { Trophy } from 'lucide-react-native/icons';
import { COLORS, SHADOWS, GRADIENTS } from '../constants/theme';
import GlassCard from '../components/GlassCard';
import { useUser } from '../context/UserContext';
import { getDashboardData } from '../services/dashboardApi';

const DAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const CHART_MAX_HEIGHT = 70;
const PRIORITY_STYLES = {
    high: { bg: '#FDA4AF', text: '#fff', label: 'HIGH' },
    medium: { bg: '#FFEDD5', text: '#EA580C', label: 'MEDIUM' },
    low: { bg: '#D1FAE5', text: '#059669', label: 'LOW' },
};

const DashboardScreen = ({ navigation }) => {
    const { user, token, logout } = useUser();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [addTaskModalVisible, setAddTaskModalVisible] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDueTime, setNewTaskDueTime] = useState('');
    const [newTaskCourse, setNewTaskCourse] = useState('');
    const [newTaskPriority, setNewTaskPriority] = useState('medium');
    const [localTasks, setLocalTasks] = useState([]);

    const loadDashboard = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getDashboardData(token);
            setData(res);
        } finally {
            setLoading(false);
        }
    }, [token]);

    const requireAuth = (actionName = 'this') => {
        if (!token) {
            Alert.alert(
                'Sign in required',
                `Please sign in to access ${actionName}.`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Sign In', onPress: () => navigation.getParent()?.navigate('Login') },
                ]
            );
            return false;
        }
        return true;
    };

    useEffect(() => {
        loadDashboard();
    }, [loadDashboard]);

    const displayName = token
        ? (data?.userName || user?.name || 'Student')
        : 'Guest Learner';
    const userEmail = user?.email || (token ? 'user@wolio.id' : 'Sign in to see your email');
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
    const allTasks = [...todayTasks, ...localTasks];
    const displayTotalTask = allTasks.length;

    const openAddTaskModal = () => {
        if (!requireAuth('add tasks')) return;
        setNewTaskTitle('');
        setNewTaskDueTime('');
        setNewTaskCourse('');
        setNewTaskPriority('medium');
        setAddTaskModalVisible(true);
    };

    const handleAddTask = () => {
        const title = newTaskTitle.trim();
        if (!title) {
            Alert.alert('Required', 'Please enter a task title.');
            return;
        }
        setLocalTasks((prev) => [
            ...prev,
            { taskTitle: title, taskDueTime: newTaskDueTime.trim() || '—', taskCourse: newTaskCourse.trim() || '—', priority: newTaskPriority },
        ]);
        setAddTaskModalVisible(false);
    };

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
                            onPress={() => setDropdownVisible(true)}
                            activeOpacity={0.8}
                        >
                            <View style={styles.avatarContainer}>
                                <View style={styles.avatarGlow}>
                                    {data?.userProfilePhoto ? (
                                        <Image source={{ uri: data.userProfilePhoto }} style={styles.avatar} />
                                    ) : (
                                        <View style={styles.avatar} />
                                    )}
                                    <View style={styles.onlineIndicator} />
                                </View>
                            </View>
                            <View>
                                <Text style={styles.greeting}>{displayName}</Text>
                                <Text style={styles.date}>{dateStr}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.notificationBtn} onPress={() => { setDropdownVisible(false); if (requireAuth('notifications')) navigation.getParent()?.navigate('Notifications'); }}>
                            <View style={styles.notificationBtnInner}>
                                <Folder size={20} color="#fff" strokeWidth={2.5} />
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Profile Dropdown */}
                    <Modal
                        visible={dropdownVisible}
                        transparent
                        animationType="fade"
                        onRequestClose={() => setDropdownVisible(false)}
                    >
                        <Pressable style={styles.dropdownBackdrop} onPress={() => setDropdownVisible(false)}>
                            <Pressable style={styles.dropdownCard} onPress={(e) => e.stopPropagation()}>
                                <View style={styles.dropdownUser}>
                                    <View style={styles.dropdownAvatarWrap}>
                                        {data?.userProfilePhoto ? (
                                            <Image source={{ uri: data.userProfilePhoto }} style={styles.dropdownAvatar} />
                                        ) : (
                                            <View style={styles.dropdownAvatar} />
                                        )}
                                        <View style={styles.dropdownOnlineDot} />
                                    </View>
                                    <View style={styles.dropdownUserText}>
                                        <Text style={styles.dropdownName}>{displayName}</Text>
                                        <Text style={styles.dropdownEmail}>{userEmail}</Text>
                                    </View>
                                </View>
                                <Pressable
                                    style={({ pressed, hovered }) => [styles.dropdownItem, (pressed || hovered) && styles.dropdownItemHover]}
                                    onPress={() => { setDropdownVisible(false); if (requireAuth('profile')) navigation.getParent()?.navigate('Profile'); }}
                                >
                                    <View style={styles.dropdownItemIconWrap}>
                                        <User size={16} color={COLORS.primary} strokeWidth={2} />
                                    </View>
                                    <Text style={styles.dropdownItemText}>View Profile</Text>
                                </Pressable>
                                <Pressable
                                    style={({ pressed, hovered }) => [styles.dropdownItem, (pressed || hovered) && styles.dropdownItemHover]}
                                    onPress={() => { setDropdownVisible(false); if (requireAuth('notifications')) navigation.getParent()?.navigate('Notifications'); }}
                                >
                                    <View style={styles.dropdownItemIconWrap}>
                                        <Bell size={16} color={COLORS.primary} strokeWidth={2} />
                                    </View>
                                    <Text style={styles.dropdownItemText}>Notifications</Text>
                                </Pressable>
                                {token ? (
                                    <Pressable
                                        style={({ pressed, hovered }) => [styles.dropdownItem, (pressed || hovered) && styles.dropdownItemHoverLogout]}
                                        onPress={() => { setDropdownVisible(false); logout(); }}
                                    >
                                        <View style={styles.dropdownItemIconWrapLogout}>
                                            <LogOut size={16} color={COLORS.danger} strokeWidth={2} />
                                        </View>
                                        <Text style={styles.dropdownItemTextDanger}>Logout</Text>
                                    </Pressable>
                                ) : (
                                    <Pressable
                                        style={({ pressed, hovered }) => [styles.dropdownItem, (pressed || hovered) && styles.dropdownItemHover]}
                                        onPress={() => { setDropdownVisible(false); navigation.getParent()?.navigate('Login'); }}
                                    >
                                        <View style={styles.dropdownItemIconWrap}>
                                            <LogOut size={16} color={COLORS.primary} strokeWidth={2} />
                                        </View>
                                        <Text style={[styles.dropdownItemText, { color: COLORS.primary }]}>Sign In</Text>
                                    </Pressable>
                                )}
                            </Pressable>
                        </Pressable>
                    </Modal>

                    {/* Add Task Modal */}
                    <Modal
                        visible={addTaskModalVisible}
                        transparent
                        animationType="fade"
                        onRequestClose={() => setAddTaskModalVisible(false)}
                    >
                        <Pressable style={styles.addTaskBackdrop} onPress={() => setAddTaskModalVisible(false)}>
                            <Pressable style={styles.addTaskModal} onPress={(e) => e.stopPropagation()}>
                                <View style={styles.addTaskHeader}>
                                    <Text style={styles.addTaskTitle}>Add New Task</Text>
                                    <TouchableOpacity style={styles.addTaskCloseBtn} onPress={() => setAddTaskModalVisible(false)}>
                                        <X size={20} color={COLORS.text} strokeWidth={2} />
                                    </TouchableOpacity>
                                </View>
                                <Text style={[styles.addTaskLabel, { marginTop: 0 }]}>Task Title *</Text>
                                <TextInput
                                    style={styles.addTaskInput}
                                    placeholder="E.g., Complete Physics Homework"
                                    placeholderTextColor="#9CA3AF"
                                    value={newTaskTitle}
                                    onChangeText={setNewTaskTitle}
                                />
                                <Text style={styles.addTaskLabel}>Due Time</Text>
                                <TextInput
                                    style={styles.addTaskInput}
                                    placeholder="E.g., in 2 hours, tomorrow"
                                    placeholderTextColor="#9CA3AF"
                                    value={newTaskDueTime}
                                    onChangeText={setNewTaskDueTime}
                                />
                                <Text style={styles.addTaskLabel}>Course/Subject</Text>
                                <TextInput
                                    style={styles.addTaskInput}
                                    placeholder="E.g., Physics, Mathematics"
                                    placeholderTextColor="#9CA3AF"
                                    value={newTaskCourse}
                                    onChangeText={setNewTaskCourse}
                                />
                                <Text style={styles.addTaskLabel}>Priority</Text>
                                <View style={styles.addTaskPriorityRow}>
                                    {(['high', 'medium', 'low']).map((p) => (
                                        <TouchableOpacity
                                            key={p}
                                            style={[styles.addTaskPriorityBtn, newTaskPriority === p && styles.addTaskPriorityBtnActive]}
                                            onPress={() => setNewTaskPriority(p)}
                                        >
                                            {newTaskPriority === p ? (
                                                <LinearGradient colors={['#F59E0B', '#FBBF24']} style={StyleSheet.absoluteFill} />
                                            ) : null}
                                            <Text style={[styles.addTaskPriorityText, newTaskPriority === p && styles.addTaskPriorityTextActive]}>
                                                {p.charAt(0).toUpperCase() + p.slice(1)}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                                <View style={styles.addTaskActions}>
                                    <TouchableOpacity style={styles.addTaskCancelBtn} onPress={() => setAddTaskModalVisible(false)}>
                                        <Text style={styles.addTaskCancelText}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.addTaskSubmitWrap} onPress={handleAddTask} activeOpacity={0.9}>
                                        <LinearGradient colors={GRADIENTS.primary} style={styles.addTaskSubmitBtn}>
                                            <Text style={styles.addTaskSubmitText}>Add Task</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                            </Pressable>
                        </Pressable>
                    </Modal>

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
                                        {height > 0 ? (
                                            <LinearGradient
                                                colors={GRADIENTS.primary}
                                                style={[styles.bar, { height: Math.max(height, 4) }]}
                                            />
                                        ) : (
                                            <View style={[styles.bar, styles.barEmpty, { height: 4 }]} />
                                        )}
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
                            <LinearGradient colors={['#F97316', '#FBBF24']} style={[styles.progressBarFill, { width: '75%' }]} />
                        </View>
                    </GlassCard>

                    {/* Continue Learning */}
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionTitleRow}>
                            <View style={styles.indicator} />
                            <Text style={styles.sectionTitle}>Continue Learning</Text>
                        </View>
                        <TouchableOpacity onPress={() => requireAuth('continue learning')}>
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
                                            <Text style={styles.metaText}>
                                                {course.timeLeftHours != null
                                                    ? (course.timeLeftHours < 1
                                                        ? `${Math.round((course.timeLeftHours || 0) * 60)} min left`
                                                        : `${Number(course.timeLeftHours).toFixed(1)}h left`)
                                                    : '—'}
                                            </Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity style={styles.coursePlayWrap} onPress={() => requireAuth('continue reading')} activeOpacity={0.8}>
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
                            <View style={styles.countBadge}><Text style={styles.countText}>{taskDone}/{displayTotalTask}</Text></View>
                        </View>
                        <TouchableOpacity onPress={openAddTaskModal}>
                            <View style={styles.addButton}>
                                <Plus size={24} color="#fff" strokeWidth={2.5} />
                            </View>
                        </TouchableOpacity>
                    </View>

                    <GlassCard style={styles.taskCard}>
                        {allTasks.length === 0 ? (
                            <View style={styles.taskRow}>
                                <Text style={styles.taskEmpty}>No tasks for today</Text>
                            </View>
                        ) : (
                            allTasks.map((task, idx) => {
                                const pri = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.medium;
                                return (
                                    <View key={task.taskTitle + idx} style={[styles.taskRow, idx > 0 && styles.taskRowBorder]}>
                                        <TouchableOpacity style={styles.checkbox} onPress={() => requireAuth('complete tasks')} />
                                        <View style={[styles.taskIcon, { backgroundColor: '#F3E8FF' }]}>
                                            <Brain size={18} color={COLORS.primary} />
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
    avatarGlow: {
        position: 'relative',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 6,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#E9D5FF',
        overflow: 'hidden',
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
    signInText: { fontSize: 14, fontWeight: '600', color: COLORS.primary },
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
    dropdownBackdrop: {
        flex: 1,
        backgroundColor: 'transparent',
        paddingTop: 56,
        paddingHorizontal: 16,
        alignItems: 'flex-start',
    },
    dropdownCard: {
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 12,
        minWidth: 200,
        ...SHADOWS.medium,
        shadowColor: '#000',
    },
    dropdownUser: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        paddingBottom: 10,
        paddingHorizontal: 12,
        marginHorizontal: -12,
        marginTop: -12,
        paddingTop: 12,
        backgroundColor: '#FCE7F3',
        borderTopLeftRadius: 14,
        borderTopRightRadius: 14,
    },
    dropdownUserText: {
        flex: 1,
        marginLeft: 12,
    },
    dropdownAvatarWrap: {
        position: 'relative',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.35,
        shadowRadius: 6,
        elevation: 3,
    },
    dropdownAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E9D5FF',
        overflow: 'hidden',
    },
    dropdownOnlineDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: COLORS.success,
        position: 'absolute',
        bottom: 0,
        right: 0,
        borderWidth: 2,
        borderColor: '#fff',
    },
    dropdownName: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 2,
        textAlign: 'left',
    },
    dropdownEmail: {
        fontSize: 11,
        color: COLORS.textSecondary,
        textAlign: 'left',
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 8,
        marginHorizontal: -8,
        marginVertical: 2,
        borderRadius: 10,
        gap: 10,
    },
    dropdownItemHover: {
        backgroundColor: '#F3E8FF',
    },
    dropdownItemHoverLogout: {
        backgroundColor: '#FECACA',
    },
    dropdownItemIconWrap: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F3E8FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dropdownItemIconWrapLogout: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FECACA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dropdownItemText: {
        fontSize: 13,
        fontWeight: '500',
        color: COLORS.text,
    },
    dropdownItemTextDanger: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.danger,
    },
    addTaskBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    addTaskModal: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        width: '100%',
        maxWidth: 400,
        ...SHADOWS.large,
    },
    addTaskHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    addTaskTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.text,
    },
    addTaskCloseBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addTaskLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 8,
        marginTop: 16,
    },
    addTaskInput: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        color: COLORS.text,
    },
    addTaskPriorityRow: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 8,
    },
    addTaskPriorityBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        overflow: 'hidden',
        position: 'relative',
    },
    addTaskPriorityBtnActive: {
        borderColor: 'transparent',
    },
    addTaskPriorityText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textSecondary,
        zIndex: 1,
    },
    addTaskPriorityTextActive: {
        color: '#fff',
    },
    addTaskActions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 24,
    },
    addTaskCancelBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
    },
    addTaskCancelText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textSecondary,
    },
    addTaskSubmitWrap: {
        flex: 1,
        borderRadius: 12,
        overflow: 'hidden',
    },
    addTaskSubmitBtn: {
        paddingVertical: 14,
        alignItems: 'center',
    },
    addTaskSubmitText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    notificationBtn: {},
    notificationBtnInner: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: '#F97316',
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
    barEmpty: {
        backgroundColor: '#E5E7EB',
        opacity: 0.6,
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
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#F97316',
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
        color: '#F97316',
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
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.primary,
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
        top: -4,
        left: -4,
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
