import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
    ArrowLeft,
    GraduationCap,
    BookOpen,
    Heart,
    Check,
} from 'lucide-react-native';
import { COLORS, SHADOWS, GRADIENTS } from '../constants/theme';
import GradientButton from '../components/GradientButton';
import { useUser } from '../context/UserContext';

const BOARDS = ['CBSE', 'ICSE', 'State Board', 'IB', 'Cambridge', 'Individual'];
const CLASSES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'Individual'];
const INTERESTS = [
    'Mathematics', 'Science', 'Physics', 'Chemistry', 'Biology',
    'English', 'History', 'Geography', 'Computer Science', 'Arts & Crafts',
    'Music', 'Sports', 'Literature', 'Languages', 'Economics', 'Politics', 'Other',
];

const CompleteProfileScreen = ({ navigation, route }) => {
    const { setAuthAfterVerify } = useUser();
    const token = route?.params?.token;
    const user = route?.params?.user;
    const [board, setBoard] = useState('Individual');
    const [grade, setGrade] = useState('6');
    const [interests, setInterests] = useState([]);

    const toggleInterest = (item) => {
        setInterests((prev) =>
            prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
        );
    };

    const finishProfile = () => {
        if (token && user) setAuthAfterVerify(token, user);
        else navigation.replace('Main');
    };

    const handleComplete = () => {
        finishProfile();
    };

    const handleLater = () => {
        finishProfile();
    };

    return (
        <View style={[styles.container, Platform.OS === 'web' && styles.containerWeb]}>
            <LinearGradient
                colors={[COLORS.background, '#F3E8FF', '#FFFFFF']}
                style={StyleSheet.absoluteFill}
            />
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.scrollWrapper}>
                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={[
                            styles.scrollContent,
                            Platform.OS === 'web' && styles.scrollContentWeb,
                        ]}
                        showsVerticalScrollIndicator={true}
                    >
                        {/* Back */}
                        <TouchableOpacity
                            style={styles.backBtn}
                            onPress={() => navigation.goBack()}
                            activeOpacity={0.7}
                        >
                            <ArrowLeft size={22} color={COLORS.text} />
                            <Text style={styles.backText}>Back</Text>
                        </TouchableOpacity>

                        {/* Progress: Account ✓, Verify ✓, Profile 3 */}
                        <View style={styles.progressWrap}>
                            <View style={styles.stepColumn}>
                                <View style={[styles.stepCircle, styles.stepCircleDone]}>
                                    <Check size={20} color="#fff" strokeWidth={2.5} />
                                </View>
                                <Text style={styles.stepLabelActive}>Account</Text>
                            </View>
                            <View style={styles.stepConnector} />
                            <View style={styles.stepColumn}>
                                <View style={[styles.stepCircle, styles.stepCircleDone]}>
                                    <Check size={20} color="#fff" strokeWidth={2.5} />
                                </View>
                                <Text style={styles.stepLabelActive}>Verify</Text>
                            </View>
                            <View style={styles.stepConnector} />
                            <View style={styles.stepColumn}>
                                <View style={[styles.stepCircle, styles.stepCircleActive]}>
                                    <Text style={styles.stepNumber}>3</Text>
                                </View>
                                <Text style={styles.stepLabelActive}>Profile</Text>
                            </View>
                        </View>

                        {/* Header: graduation cap + title + subtitle */}
                        <View style={styles.header}>
                            <View style={styles.headerIconWrap}>
                                <GraduationCap size={48} color={COLORS.primary} strokeWidth={1.5} />
                            </View>
                            <Text style={styles.title}>Complete Your Profile</Text>
                            <Text style={styles.subtitle}>
                                Help us personalize your learning experience
                            </Text>
                        </View>

                        {/* White card */}
                        <View style={styles.card}>
                            {/* Select Your Board */}
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <BookOpen size={20} color={COLORS.primary} />
                                    <Text style={styles.sectionTitle}>Select Your Board</Text>
                                </View>
                                <View style={styles.chipRow}>
                                    {BOARDS.map((item) => {
                                        const selected = board === item;
                                        return (
                                            <TouchableOpacity
                                                key={item}
                                                style={[styles.chip, selected && styles.chipSelected]}
                                                onPress={() => setBoard(item)}
                                                activeOpacity={0.8}
                                            >
                                                <View style={[styles.chipInner, selected && styles.chipInnerSelected]}>
                                                    {selected ? (
                                                        <LinearGradient
                                                            colors={GRADIENTS.primary}
                                                            style={styles.chipGradient}
                                                        >
                                                            <Text style={styles.chipTextSelected}>{item}</Text>
                                                        </LinearGradient>
                                                    ) : (
                                                        <Text style={styles.chipText}>{item}</Text>
                                                    )}
                                                </View>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </View>

                            {/* Select Your Class */}
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <GraduationCap size={20} color={COLORS.primary} />
                                    <Text style={styles.sectionTitle}>Select Your Class</Text>
                                </View>
                                <View style={styles.chipRow}>
                                    {CLASSES.map((item) => {
                                        const selected = grade === item;
                                        return (
                                            <TouchableOpacity
                                                key={item}
                                                style={[styles.chip, selected && styles.chipSelected]}
                                                onPress={() => setGrade(item)}
                                                activeOpacity={0.8}
                                            >
                                                <View style={[styles.chipInner, selected && styles.chipInnerSelected]}>
                                                    {selected ? (
                                                        <LinearGradient
                                                            colors={GRADIENTS.primary}
                                                            style={styles.chipGradient}
                                                        >
                                                            <Text style={styles.chipTextSelected}>{item}</Text>
                                                        </LinearGradient>
                                                    ) : (
                                                        <Text style={styles.chipText}>{item}</Text>
                                                    )}
                                                </View>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </View>

                            {/* What are you interested in? */}
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Heart size={20} color={COLORS.primary} />
                                    <Text style={styles.sectionTitle}>
                                        What are you interested in? (Select multiple)
                                    </Text>
                                </View>
                                <View style={styles.chipRow}>
                                    {INTERESTS.map((item) => {
                                        const selected = interests.includes(item);
                                        return (
                                            <TouchableOpacity
                                                key={item}
                                                style={[styles.chip, selected && styles.chipSelected]}
                                                onPress={() => toggleInterest(item)}
                                                activeOpacity={0.8}
                                            >
                                                <View style={[styles.chipInner, selected && styles.chipInnerSelected]}>
                                                    {selected ? (
                                                        <LinearGradient
                                                            colors={GRADIENTS.primary}
                                                            style={styles.chipGradient}
                                                        >
                                                            <Text style={styles.chipTextSelected}>{item}</Text>
                                                        </LinearGradient>
                                                    ) : (
                                                        <Text style={styles.chipText}>{item}</Text>
                                                    )}
                                                </View>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                                <Text style={styles.selectedCount}>
                                    Selected: {interests.length} interest{interests.length !== 1 ? 's' : ''}
                                </Text>
                            </View>

                            <GradientButton
                                title="Complete Profile"
                                onPress={handleComplete}
                                icon={<GraduationCap size={20} color="#fff" />}
                                style={styles.completeButton}
                                textStyle={styles.completeButtonText}
                            />

                            <TouchableOpacity
                                style={styles.laterBtn}
                                onPress={handleLater}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.laterText}>Do it later</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.bottomSpacer} />
                    </ScrollView>
                </View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    containerWeb: {
        minHeight: '100vh',
        height: '100%',
    },
    safeArea: { flex: 1, minHeight: 0 },
    scrollWrapper: {
        flex: 1,
        minHeight: 0,
        overflow: 'hidden',
    },
    scrollView: { flex: 1 },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 8,
        paddingBottom: 120,
    },
    scrollContentWeb: {
        flexGrow: 1,
    },
    bottomSpacer: { height: 40 },

    backBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    backText: {
        fontSize: 16,
        color: COLORS.text,
        marginLeft: 8,
        fontWeight: '500',
    },

    progressWrap: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginBottom: 24,
    },
    stepColumn: { alignItems: 'center' },
    stepCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepCircleDone: {
        backgroundColor: COLORS.primary,
    },
    stepCircleActive: {
        backgroundColor: COLORS.primary,
    },
    stepNumber: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    stepLabelActive: {
        fontSize: 12,
        color: COLORS.primary,
        marginTop: 6,
        fontWeight: '600',
    },
    stepConnector: {
        width: 28,
        height: 2,
        backgroundColor: COLORS.primary,
        alignSelf: 'flex-start',
        marginTop: 19,
        marginHorizontal: 2,
    },

    header: {
        alignItems: 'center',
        marginBottom: 24,
    },
    headerIconWrap: {
        marginBottom: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.primary,
        marginBottom: 6,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 15,
        color: COLORS.textSecondary,
        textAlign: 'center',
    },

    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        ...SHADOWS.medium,
    },
    section: { marginBottom: 24 },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
        marginLeft: 10,
        flex: 1,
    },
    chipRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -4,
    },
    chip: {
        margin: 4,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
    },
    chipSelected: {
        borderColor: 'transparent',
    },
    chipInner: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        overflow: 'hidden',
    },
    chipInnerSelected: {
        backgroundColor: 'transparent',
        padding: 0,
    },
    chipGradient: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chipText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
    },
    chipTextSelected: {
        color: '#FFFFFF',
    },
    selectedCount: {
        fontSize: 13,
        color: COLORS.textSecondary,
        marginTop: 10,
    },
    completeButton: {
        marginTop: 8,
        marginBottom: 16,
    },
    completeButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    laterBtn: {
        alignItems: 'center',
    },
    laterText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        fontWeight: '500',
    },
});

export default CompleteProfileScreen;
