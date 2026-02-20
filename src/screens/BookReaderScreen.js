import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
    Dimensions,
    Platform,
    Modal,
    Animated,
    ScrollView,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { ArrowLeft, Menu, Bookmark, Highlighter, MoreVertical, Type, AlignLeft, Sun } from 'lucide-react-native';
import { getBookById } from '../services/bookApi';
import { COLORS } from '../constants/theme';
import { BOOKS_BASE } from '../config/api';

const { width, height } = Dimensions.get('window');

const THEMES = {
    white: { bg: '#FFFFFF', text: '#1F2937', name: 'White' },
    sepia: { bg: '#F4ECD8', text: '#5C4B37', name: 'Sepia' },
    night: { bg: '#1F2937', text: '#E5E7EB', name: 'Night' },
    aurora: { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', text: '#FFFFFF', name: 'Aurora' },
};

const buildInjectedStyles = (settings) => {
    const { theme, fontFamily, fontSize, lineSpacing, margins, brightness } = settings;
    const t = THEMES[theme] || THEMES.white;
    const bgCss = theme === 'aurora'
        ? 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;'
        : `background-color: ${t.bg} !important;`;
    const fontStack = fontFamily === 'serif'
        ? 'Georgia, "Times New Roman", serif'
        : fontFamily === 'mono'
            ? '"Courier New", monospace'
            : 'system-ui, -apple-system, sans-serif';
    const css = [
        'html, body {',
        '  ' + bgCss,
        '  color: ' + t.text + ' !important;',
        '  font-family: ' + fontStack + ' !important;',
        '  font-size: ' + fontSize + 'px !important;',
        '  line-height: ' + lineSpacing + ' !important;',
        '  padding: ' + margins + '% !important;',
        '  letter-spacing: 0 !important;',
        '  margin: 0 !important;',
        '  filter: brightness(' + (brightness / 100) + ') !important;',
        '}',
        'body, p, div, span, h1, h2, h3, h4, h5, h6 {',
        '  line-height: ' + lineSpacing + ' !important;',
        '  color: inherit !important;',
        '}',
        'p { margin: 0.5em 0 !important; }',
    ].join(' ');
    return `(function(){
var s=document.createElement('style');
s.id='wolio-reading-styles';
s.textContent="${css.replace(/"/g, '\\"')}";
var o=document.getElementById('wolio-reading-styles');
if(o)o.remove();
(document.head||document.documentElement).appendChild(s);
})();true;`;
};

const DEFAULT_SETTINGS = {
    readingMode: 'continuous',
    theme: 'white',
    fontFamily: 'serif',
    fontSize: 18,
    lineSpacing: 1.8,
    margins: 8,
    brightness: 100,
};

const BookReaderScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { bookId } = route.params || {};
    const [book, setBook] = useState(null);
    const [contentUrl, setContentUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [settingsModalVisible, setSettingsModalVisible] = useState(false);
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const slideAnim = useRef(new Animated.Value(-1)).current;
    const webViewRef = useRef(null);

    const applySettings = useCallback((s) => {
        const script = buildInjectedStyles(s);
        if (Platform.OS === 'web') return;
        webViewRef.current?.injectJavaScript?.(script);
    }, []);

    useEffect(() => {
        if (contentUrl && Platform.OS !== 'web') {
            applySettings(settings);
        }
    }, [contentUrl, settings, applySettings]);

    const openSettings = () => {
        setSettingsModalVisible(true);
        Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
            tension: 65,
            friction: 11,
        }).start();
    };

    const closeSettings = () => {
        Animated.timing(slideAnim, {
            toValue: -1,
            duration: 250,
            useNativeDriver: true,
        }).start(() => setSettingsModalVisible(false));
    };

    const updateSetting = (key, value) => {
        setSettings((prev) => {
            const next = { ...prev, [key]: value };
            if (Platform.OS !== 'web') {
                setTimeout(() => applySettings(next), 0);
            }
            return next;
        });
    };

    useEffect(() => {
        if (!bookId) {
            setError('No book selected');
            setLoading(false);
            return;
        }
        let cancelled = false;
        (async () => {
            const { data, error: err } = await getBookById(bookId);
            if (cancelled) return;
            if (err) {
                setError(err);
                setLoading(false);
                return;
            }
            if (!data?.epubUrl) {
                setError('This book has no readable content yet');
                setLoading(false);
                return;
            }
            setBook(data);
            setContentUrl(data.epubUrl);
            setLoading(false);
        })();
        return () => { cancelled = true; };
    }, [bookId]);

    if (loading) {
        return (
            <View style={styles.centerWrap}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Loading book...</Text>
            </View>
        );
    }

    if (error || !book) {
        return (
            <SafeAreaView style={styles.centerWrap}>
                <Text style={styles.errorText}>{error || 'Book not found'}</Text>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Text style={styles.backBtnText}>Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    if (!contentUrl) {
        return (
            <SafeAreaView style={styles.centerWrap}>
                <Text style={styles.errorText}>No content URL available</Text>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Text style={styles.backBtnText}>Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.readerWrap}>
                {/* Top bar */}
                <View style={styles.topBar}>
                    <BlurView intensity={90} tint="light" style={StyleSheet.absoluteFill} />
                    <View style={styles.topBarContent}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.topBarBtn}>
                            <ArrowLeft size={22} color={COLORS.text} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.topBarBtn}>
                            <Menu size={22} color={COLORS.text} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.topBarBtn}>
                            <Bookmark size={22} color={COLORS.text} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.topBarBtn}>
                            <Highlighter size={22} color={COLORS.text} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.topBarBtn} onPress={openSettings}>
                            <MoreVertical size={22} color={COLORS.text} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Content - iframe on web (via proxy for styles), WebView on native */}
                <View style={styles.readerContent}>
                    {Platform.OS === 'web' ? (
                        (() => {
                            const q = new URLSearchParams({
                                url: contentUrl,
                                theme: settings.theme,
                                fontFamily: settings.fontFamily,
                                fontSize: String(settings.fontSize),
                                lineSpacing: String(settings.lineSpacing),
                                margins: String(settings.margins),
                                brightness: String(settings.brightness),
                            });
                            const proxyUrl = `${BOOKS_BASE}/proxy?${q.toString()}`;
                            return React.createElement('iframe', {
                                key: proxyUrl,
                                src: proxyUrl,
                                title: 'Book content',
                                style: {
                                    flex: 1,
                                    width: '100%',
                                    height: '100%',
                                    border: 'none',
                                    minHeight: height - 100,
                                },
                            });
                        })()
                    ) : (
                        (() => {
                            const WebView = require('react-native-webview').WebView;
                            return (
                                <WebView
                                    ref={webViewRef}
                                    source={{ uri: contentUrl }}
                                    style={styles.webView}
                                    originWhitelist={['*']}
                                    javaScriptEnabled
                                    domStorageEnabled
                                    injectedJavaScript={buildInjectedStyles(settings)}
                                    startInLoadingState
                                    renderLoading={() => (
                                        <View style={styles.webViewLoading}>
                                            <ActivityIndicator size="large" color={COLORS.primary} />
                                            <Text style={styles.loadingText}>Loading content...</Text>
                                        </View>
                                    )}
                                    onError={(e) => console.warn('WebView error:', e.nativeEvent)}
                                />
                            );
                        })()
                    )}
                </View>
            </View>

            {/* Reading Settings Modal - slides from top */}
            <Modal
                visible={settingsModalVisible}
                transparent
                animationType="none"
                onRequestClose={closeSettings}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={closeSettings}
                >
                    <TouchableOpacity activeOpacity={1} onPress={() => {}}>
                        <Animated.View
                            style={[
                                styles.settingsPanel,
                                {
                                    transform: [
                                        {
                                            translateY: slideAnim.interpolate({
                                                inputRange: [-1, 0],
                                                outputRange: [-height, 0],
                                            }),
                                        },
                                    ],
                                },
                            ]}
                        >
                            <View style={styles.settingsHeader}>
                                <TouchableOpacity onPress={closeSettings} style={styles.settingsBack}>
                                    <ArrowLeft size={24} color={COLORS.text} />
                                </TouchableOpacity>
                                <Text style={styles.settingsTitle}>Reading Settings</Text>
                            </View>
                            <ScrollView style={styles.settingsScroll} showsVerticalScrollIndicator={false}>
                                {/* Reading Mode */}
                                <Text style={styles.settingsSection}>Reading Mode</Text>
                                <View style={styles.optionRow}>
                                    <TouchableOpacity
                                        style={[
                                            styles.optionBtn,
                                            settings.readingMode === 'continuous' && styles.optionBtnActive,
                                        ]}
                                        onPress={() => updateSetting('readingMode', 'continuous')}
                                    >
                                        <Text style={[styles.optionTitle, settings.readingMode === 'continuous' && styles.optionTitleActive]}>
                                            Continuous Scroll
                                        </Text>
                                        <Text style={styles.optionSub}>Smooth reading.</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[
                                            styles.optionBtn,
                                            settings.readingMode === 'page' && styles.optionBtnActive,
                                        ]}
                                        onPress={() => updateSetting('readingMode', 'page')}
                                    >
                                        <Text style={[styles.optionTitle, settings.readingMode === 'page' && styles.optionTitleActive]}>
                                            Page Turn
                                        </Text>
                                        <Text style={styles.optionSub}>Like a real book.</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Reading Theme */}
                                <Text style={styles.settingsSection}>Reading Theme</Text>
                                <View style={styles.themeRow}>
                                    {(['white', 'sepia', 'night', 'aurora']).map((key) => {
                                        const t = THEMES[key];
                                        const isActive = settings.theme === key;
                                        return (
                                            <TouchableOpacity
                                                key={key}
                                                style={[
                                                    styles.themeBtn,
                                                    { backgroundColor: key === 'aurora' ? '#764ba2' : t.bg },
                                                    isActive && styles.themeBtnActive,
                                                ]}
                                                onPress={() => updateSetting('theme', key)}
                                            >
                                                <Text style={[styles.themeAa, { color: t.text }]}>Aa</Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>

                                {/* Font Family */}
                                <Text style={styles.settingsSection}>Font Family</Text>
                                <View style={styles.optionRow}>
                                    {(['serif', 'sans', 'mono']).map((f) => (
                                        <TouchableOpacity
                                            key={f}
                                            style={[
                                                styles.fontBtn,
                                                settings.fontFamily === f && styles.optionBtnActive,
                                            ]}
                                            onPress={() => updateSetting('fontFamily', f)}
                                        >
                                            <Text style={[
                                                styles.fontBtnText,
                                                settings.fontFamily === f && styles.optionTitleActive,
                                            ]}>
                                                {f === 'serif' ? 'Serif' : f === 'sans' ? 'Sans' : 'Mono'}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                {/* Sliders */}
                                <View style={styles.sliderRow}>
                                    <Type size={18} color={COLORS.textSecondary} />
                                    <Text style={styles.sliderLabel}>Font Size</Text>
                                    <Text style={styles.sliderValue}>{settings.fontSize}px</Text>
                                </View>
                                <Slider
                                    style={styles.slider}
                                    minimumValue={14}
                                    maximumValue={24}
                                    step={1}
                                    value={settings.fontSize}
                                    onValueChange={(v) => updateSetting('fontSize', Math.round(v))}
                                    minimumTrackTintColor={COLORS.primary}
                                    maximumTrackTintColor="#E5E7EB"
                                    thumbTintColor={COLORS.primary}
                                />

                                <View style={styles.sliderRow}>
                                    <AlignLeft size={18} color={COLORS.textSecondary} />
                                    <Text style={styles.sliderLabel}>Line Spacing</Text>
                                    <Text style={styles.sliderValue}>{settings.lineSpacing}</Text>
                                </View>
                                <Slider
                                    style={styles.slider}
                                    minimumValue={1.2}
                                    maximumValue={2.5}
                                    step={0.1}
                                    value={settings.lineSpacing}
                                    onValueChange={(v) => updateSetting('lineSpacing', Math.round(v * 10) / 10)}
                                    minimumTrackTintColor={COLORS.primary}
                                    maximumTrackTintColor="#E5E7EB"
                                    thumbTintColor={COLORS.primary}
                                />

                                <View style={styles.sliderRow}>
                                    <Text style={styles.sliderLabel}>Margins</Text>
                                    <Text style={styles.sliderValue}>{settings.margins}%</Text>
                                </View>
                                <Slider
                                    style={styles.slider}
                                    minimumValue={0}
                                    maximumValue={20}
                                    step={1}
                                    value={settings.margins}
                                    onValueChange={(v) => updateSetting('margins', Math.round(v))}
                                    minimumTrackTintColor={COLORS.primary}
                                    maximumTrackTintColor="#E5E7EB"
                                    thumbTintColor={COLORS.primary}
                                />

                                <View style={styles.sliderRow}>
                                    <Sun size={18} color={COLORS.textSecondary} />
                                    <Text style={styles.sliderLabel}>Brightness</Text>
                                    <Text style={styles.sliderValue}>{settings.brightness}%</Text>
                                </View>
                                <Slider
                                    style={styles.slider}
                                    minimumValue={50}
                                    maximumValue={100}
                                    step={5}
                                    value={settings.brightness}
                                    onValueChange={(v) => updateSetting('brightness', Math.round(v))}
                                    minimumTrackTintColor={COLORS.primary}
                                    maximumTrackTintColor="#E5E7EB"
                                    thumbTintColor={COLORS.primary}
                                />
                            </ScrollView>
                            <View style={styles.settingsHandle} />
                        </Animated.View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FAF9F6' },
    centerWrap: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 15,
        color: COLORS.textSecondary,
    },
    errorText: {
        fontSize: 16,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: 20,
    },
    backBtn: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: COLORS.primary,
    },
    backBtnText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    readerWrap: { flex: 1 },
    topBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: Platform.OS === 'ios' ? 56 : 52,
        overflow: 'hidden',
        zIndex: 10,
        borderRadius: 0,
        backgroundColor: 'rgba(255,255,255,0.85)',
        ...Platform.select({
            android: { elevation: 4 },
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 6,
            },
        }),
    },
    topBarContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        paddingVertical: 10,
        height: '100%',
    },
    topBarBtn: {
        padding: 8,
    },
    readerContent: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 56 : 52,
    },
    webView: {
        flex: 1,
        width,
        backgroundColor: '#FAF9F6',
    },
    webViewLoading: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FAF9F6',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-start',
    },
    settingsPanel: {
        backgroundColor: '#fff',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        maxHeight: height * 0.7,
        ...Platform.select({
            android: { elevation: 8 },
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 12,
            },
        }),
    },
    settingsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    settingsBack: { padding: 8, marginLeft: -8 },
    settingsTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.text,
        marginRight: 40,
    },
    settingsScroll: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        maxHeight: height * 0.55,
    },
    settingsSection: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textSecondary,
        marginBottom: 10,
        marginTop: 16,
    },
    optionRow: {
        flexDirection: 'row',
        gap: 12,
    },
    optionBtn: {
        flex: 1,
        padding: 14,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        backgroundColor: '#FAFAFA',
    },
    optionBtnActive: {
        borderColor: COLORS.primary,
        backgroundColor: '#F5F3FF',
    },
    optionTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.text,
    },
    optionTitleActive: { color: COLORS.primary },
    optionSub: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 4,
    },
    themeRow: {
        flexDirection: 'row',
        gap: 12,
    },
    themeBtn: {
        width: 56,
        height: 56,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    themeBtnActive: {
        borderColor: COLORS.primary,
    },
    themeAa: {
        fontSize: 20,
        fontWeight: '700',
    },
    fontBtn: {
        flex: 1,
        padding: 14,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        backgroundColor: '#FAFAFA',
        alignItems: 'center',
    },
    fontBtnText: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.text,
    },
    sliderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
        gap: 8,
    },
    sliderLabel: {
        flex: 1,
        fontSize: 14,
        color: COLORS.text,
    },
    sliderValue: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textSecondary,
        minWidth: 44,
        textAlign: 'right',
    },
    slider: {
        width: '100%',
        height: 40,
        marginTop: -8,
    },
    settingsHandle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#E5E7EB',
        alignSelf: 'center',
        marginBottom: 16,
    },
});

export default BookReaderScreen;
