import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { View, StyleSheet, Platform, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Home, Book, Compass } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

import { useUser } from '../context/UserContext';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ResetLinkSentScreen from '../screens/ResetLinkSentScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import SignupScreen from '../screens/SignupScreen';
import VerifyEmailScreen from '../screens/VerifyEmailScreen';
import CompleteProfileScreen from '../screens/CompleteProfileScreen';
import DashboardScreen from '../screens/DashboardScreen';
import LibraryScreen from '../screens/LibraryScreen';
import ExploreScreen from '../screens/ExploreScreen';
import ProfileScreen from '../screens/ProfileScreen';
import NotificationScreen from '../screens/NotificationScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SplashScreen from '../screens/SplashScreen';
import BookReaderScreen from '../screens/BookReaderScreen';
import { COLORS, GRADIENTS } from '../constants/theme';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TAB_BAR_MARGIN = 20;
const TAB_BAR_RADIUS = 28;
const INACTIVE_ICON_BG = '#F2F2F2';
const ACTIVE_TAB_BG = 'rgba(232, 213, 255, 0.85)';
const ACTIVE_TAB_LIGHT_LAYER = '#C084FC';
const ACTIVE_TAB_LIGHT_BORDER = '#C084FC';
const ACTIVE_TAB_BORDER = '#A855F7';
const GLOW_COLOR = '#C084FC';

const TabBarBackground = () => (
    <View style={[StyleSheet.absoluteFill, styles.tabBarBackground]}>
        <BlurView tint="light" intensity={90} style={StyleSheet.absoluteFill} />
    </View>
);

const InactiveIconWrap = ({ children }) => (
    <View style={styles.inactiveIconWrap}>{children}</View>
);

const ActiveIconWrap = ({ children }) => (
    <View style={styles.activeIconGlowWrap}>
        <LinearGradient
            colors={['#A855F7', '#C084FC', '#EC4899']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.activeIconGradient}
        >
            {children}
        </LinearGradient>
    </View>
);

const TabBarButton = (props) => {
    const { children, style, onPress, accessibilityState } = props;
    const focused = accessibilityState?.selected;
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.tabBarButton, style]}
            activeOpacity={0.7}
        >
            {focused ? (
                <View style={styles.activeTabLightLayer}>
                    <View style={styles.activeTabPillOuter}>
                        <View style={styles.activeTabPill}>
                            {children}
                        </View>
                    </View>
                </View>
            ) : (
                children
            )}
        </TouchableOpacity>
    );
};

const MainTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    position: 'absolute',
                    bottom: TAB_BAR_MARGIN,
                    left: TAB_BAR_MARGIN,
                    right: TAB_BAR_MARGIN,
                    elevation: 8,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 12,
                    borderTopWidth: 0,
                    height: Platform.OS === 'ios' ? 84 : 82,
                    backgroundColor: 'transparent',
                    borderRadius: TAB_BAR_RADIUS,
                    overflow: 'hidden',
                },
                tabBarBackground: () => <TabBarBackground />,
                tabBarShowLabel: true,
                tabBarActiveTintColor: COLORS.text,
                tabBarInactiveTintColor: COLORS.textSecondary,
                tabBarLabelStyle: {
                    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
                    fontSize: 11,
                    marginTop: 10,
                    marginBottom: 4,
                    fontWeight: '500',
                },
                tabBarActiveLabelStyle: {
                    fontWeight: '900',
                    fontSize: 12,
                    marginBottom: 4,
                },
                tabBarButton: (props) => <TabBarButton {...props} />,
                tabBarIcon: ({ focused, color, size }) => null,
            }}
        >
            <Tab.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{
                    tabBarIcon: ({ focused }) =>
                        focused ? (
                            <ActiveIconWrap><Home color="#fff" size={22} /></ActiveIconWrap>
                        ) : (
                            <InactiveIconWrap><Home color={COLORS.textSecondary} size={22} /></InactiveIconWrap>
                        ),
                    tabBarLabel: 'Dashboard',
                }}
            />
            <Tab.Screen
                name="Library"
                component={LibraryScreen}
                options={{
                    tabBarIcon: ({ focused }) =>
                        focused ? (
                            <ActiveIconWrap><Book color="#fff" size={22} /></ActiveIconWrap>
                        ) : (
                            <InactiveIconWrap><Book color={COLORS.textSecondary} size={22} /></InactiveIconWrap>
                        ),
                    tabBarLabel: 'Library',
                }}
            />
            <Tab.Screen
                name="Explore"
                component={ExploreScreen}
                options={{
                    tabBarIcon: ({ focused }) =>
                        focused ? (
                            <ActiveIconWrap><Compass color="#fff" size={22} /></ActiveIconWrap>
                        ) : (
                            <InactiveIconWrap><Compass color={COLORS.textSecondary} size={22} /></InactiveIconWrap>
                        ),
                    tabBarLabel: 'Explore',
                }}
            />
        </Tab.Navigator>
    );
};

const AuthStack = ({ initialRouteName = 'Splash' }) => (
    <Stack.Navigator
        screenOptions={{ headerShown: false, animationEnabled: true }}
        initialRouteName={initialRouteName}
    >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="ResetLinkSent" component={ResetLinkSentScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
        <Stack.Screen name="CompleteProfile" component={CompleteProfileScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
    </Stack.Navigator>
);

const MainStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ cardStyle: { flex: 1 } }}
        />
        <Stack.Screen
            name="Notifications"
            component={NotificationScreen}
            options={{ cardStyle: { flex: 1 } }}
        />
        <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ cardStyle: { flex: 1 } }}
        />
        <Stack.Screen
            name="BookReader"
            component={BookReaderScreen}
            options={{ cardStyle: { flex: 1 } }}
        />
    </Stack.Navigator>
);

const AppNavigator = () => {
    const { isLoggedIn, loading, hasCompletedOnboarding } = useUser();

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <NavigationContainer
            key={isLoggedIn ? 'main' : 'auth'}
            style={styles.navContainer}
        >
            {isLoggedIn ? <MainStack /> : <AuthStack initialRouteName={hasCompletedOnboarding ? 'Main' : 'Splash'} />}
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    navContainer: { flex: 1 },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    tabBarBackground: {
        borderRadius: TAB_BAR_RADIUS,
        overflow: 'hidden',
        backgroundColor: '#F0F0F0',
    },
    tabBarButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 4,
        marginHorizontal: 4,
        marginVertical: 6,
    },
    activeTabLightLayer: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 96,
        minHeight: 52,
        borderRadius: 28,
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: ACTIVE_TAB_LIGHT_LAYER,
        borderWidth: 1.5,
        borderColor: ACTIVE_TAB_LIGHT_BORDER,
        shadowColor: '#A855F7',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.28,
        shadowRadius: 10,
        elevation: 6,
        zIndex: 10,
    },
    activeTabPillOuter: {
        borderRadius: 28,
        borderWidth: 2,
        borderColor: ACTIVE_TAB_BORDER,
        backgroundColor: ACTIVE_TAB_LIGHT_LAYER,
        padding: 2,
    },
    activeTabPill: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: ACTIVE_TAB_BG,
        borderRadius: 24,
        shadowColor: GLOW_COLOR,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 6,
    },
    inactiveIconWrap: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: INACTIVE_ICON_BG,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    activeIconGlowWrap: {
        width: 46,
        height: 46,
        borderRadius: 23,
        shadowColor: GLOW_COLOR,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 14,
        elevation: 8,
        overflow: 'visible',
    },
    activeIconGradient: {
        width: 46,
        height: 46,
        borderRadius: 23,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
});

export default AppNavigator;
