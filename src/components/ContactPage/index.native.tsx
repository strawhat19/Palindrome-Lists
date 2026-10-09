import Icon from '../Icon';
import { Link } from 'expo-router';
import PinkCta from '../PinkCta';
import type { IconName } from '../Icon';
import HalfTurnLogo from '../HalfTurnLogo';
import PageMetadata from '../PageMetadata';
import createStyles from './styles.native';
import type { ContactField } from './types';
import useContactPage from './useContactPage';
import { landingLinks } from '../../shared/routes';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from '../../shared/themeContext/useTheme';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { contactLimits, contactTopics, contactGuides, contactQuestions } from './data';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, View, Animated, Pressable, TextInput, ScrollView, AccessibilityInfo, useWindowDimensions } from 'react-native';

type TextField = Exclude<ContactField, `topic`>;
const fieldLabels = { name: `Your Name`, email: `Email Address`, subject: `Subject`, source: `Source Or Entry Link`, message: `Your Message` } as const;
const fieldIcons: Record<TextField, IconName> = { name: `user`, email: `mail`, source: `external`, subject: `file`, message: `comment` };
const fieldPlaceholders = { name: `What Should We Call You?`, email: `you@example.com`, subject: `A Brief Summary Of Your Inquiry`, source: `https://example.com`, message: `Tell us a little about what you have in mind…` } as const;

const ContactPage = () => {
  const sticky = true;
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { theme, palette, toggleTheme } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);
  const nameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const sourceRef = useRef<TextInput>(null);
  const subjectRef = useRef<TextInput>(null);
  const messageRef = useRef<TextInput>(null);
  const scrollRef = useRef<ScrollView>(null);
  const heroEnd = useRef(Infinity);
  const topOpacity = useRef(new Animated.Value(0)).current;
  const scrollProgress = useRef(new Animated.Value(0)).current;
  const [beyondHero, setBeyondHero] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);
  const { reset, submit, values, errors, setField, validated, showSource } = useContactPage();
  const fieldRefs = { name: nameRef, email: emailRef, source: sourceRef, subject: subjectRef, message: messageRef };
  const wide = width >= 900;
  const headerColor = scrollProgress.interpolate({ inputRange: [0, 40], outputRange: [palette.page, palette.headerGlass], extrapolate: `clamp` });

  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => { if (active) setReducedMotion(enabled); }).catch(() => {});
    const listener = AccessibilityInfo.addEventListener(`reduceMotionChanged`, setReducedMotion);
    return () => { active = false; listener.remove(); };
  }, []);

  useEffect(() => {
    const animation = Animated.timing(topOpacity, { toValue: beyondHero ? 1 : 0, duration: reducedMotion ? 0 : 180, useNativeDriver: true });
    animation.start();
    return () => animation.stop();
  }, [beyondHero, reducedMotion, topOpacity]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = Math.max(0, event.nativeEvent.contentOffset.y);
    scrollProgress.setValue(offset);
    setBeyondHero(offset > heroEnd.current);
  };
  const handleSubmit = () => {
    const invalidField = submit();
    if (invalidField && invalidField !== `topic`) fieldRefs[invalidField]?.current?.focus();
    if (invalidField === `topic`) AccessibilityInfo.announceForAccessibility(`Choose An Inquiry Type`);
  };
  const handleReset = () => { reset(); nameRef.current?.focus(); };
  const scrollToTop = () => scrollRef.current?.scrollTo({ y: 0, animated: !reducedMotion });
  const nextField = (field: TextField) => {
    if (field === `name`) emailRef.current?.focus();
    else if (field === `email`) subjectRef.current?.focus();
    else if (field === `subject`) (showSource ? sourceRef : messageRef).current?.focus();
    else if (field === `source`) messageRef.current?.focus();
  };

  const renderField = (field: TextField) => (
    <View key={field} nativeID={`contact-field-${field}`} style={styles.field}>
      <View nativeID={`contact-label-row-${field}`} style={styles.labelRow}>
        <Text nativeID={`contact-label-${field}`} style={styles.label}>{fieldLabels[field]}</Text>
        {field === `source` && <Text nativeID={`contact-source-optional`} style={styles.optional}>Optional</Text>}
      </View>
      <View nativeID={`contact-input-wrap-${field}`} style={[styles.inputWrap, field === `message` && styles.messageWrap, Boolean(errors[field]) && styles.inputError]}>
        <View nativeID={`contact-field-icon-${field}`} style={field === `message` ? styles.messageIcon : undefined}><Icon name={fieldIcons[field]} size={17} color={field === `email` || field === `source` ? palette.leaf : palette.action} /></View>
        <TextInput
          ref={fieldRefs[field]}
          value={values[field]}
          maxLength={contactLimits[field]}
          keyboardAppearance={theme}
          multiline={field === `message`}
          selectionColor={palette.pink}
          nativeID={`contact-input-${field}`}
          placeholder={fieldPlaceholders[field]}
          accessibilityHint={errors[field]}
          placeholderTextColor={palette.muted}
          onChangeText={(value) => setField(field, value)}
          autoCorrect={field === `subject` || field === `message`}
          returnKeyType={field === `message` ? `default` : `next`}
          style={[styles.input, field === `message` && styles.messageInput]}
          accessibilityLabel={`${fieldLabels[field]}, ${field === `source` ? `Optional` : `Required`}`}
          autoComplete={field === `name` ? `name` : field === `email` ? `email` : `off`}
          onSubmitEditing={field === `message` ? undefined : () => nextField(field)}
          textContentType={field === `name` ? `name` : field === `email` ? `emailAddress` : field === `source` ? `URL` : `none`}
          keyboardType={field === `email` ? `email-address` : field === `source` ? `url` : `default`}
          autoCapitalize={field === `name` ? `words` : field === `email` || field === `source` ? `none` : `sentences`}
        />
      </View>
      {Boolean(errors[field]) && <Text nativeID={`contact-error-${field}`} accessibilityLiveRegion={`polite`} style={styles.error}>{errors[field]}</Text>}
      {field === `source` && <Text nativeID={`contact-source-hint`} style={styles.hint}>A link helps us understand your suggestion or correction.</Text>}
      {field === `message` && (
        <View nativeID={`contact-message-details`} style={styles.messageDetails}>
          <Text nativeID={`contact-message-hint`} style={styles.hint}>A little context goes a long way.</Text>
          <Text nativeID={`contact-message-count`} accessibilityLabel={`${values.message.length} Of ${contactLimits.message} Characters`} style={styles.hint}>{values.message.length.toLocaleString()} / 2,000</Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView nativeID={`contact-safe-area`} style={styles.safeArea} edges={[`top`, `left`, `right`]}>
      <PageMetadata page={`contact`} />
      <ScrollView ref={scrollRef} style={styles.page} onScroll={handleScroll} scrollEventThrottle={16} nativeID={`contact-page`} keyboardDismissMode={`on-drag`} keyboardShouldPersistTaps={`handled`} automaticallyAdjustKeyboardInsets contentContainerStyle={styles.content} stickyHeaderIndices={sticky ? [0] : undefined}>
        <Animated.View nativeID={`contact-header`} style={[styles.header, { backgroundColor: headerColor }]}>
          <View nativeID={`contact-header-inner`} style={[styles.container, styles.headerInner]}>
            <Link href={landingLinks.home} asChild>
              <Pressable accessibilityRole={`link`} nativeID={`contact-brand`} accessibilityLabel={`Palindrome Lists Home`} style={({ pressed }) => [styles.brand, pressed && styles.pressed]}>
                <HalfTurnLogo id={`contact-header-logo`} size={37} />
                <Text nativeID={`contact-brand-name`} style={styles.brandName}>Palindrome Lists</Text>
              </Pressable>
            </Link>
            <View nativeID={`contact-header-actions`} style={styles.headerActions}>
              {width >= 620 && (
                <Link href={landingLinks.home} asChild>
                  <Pressable accessibilityRole={`link`} nativeID={`contact-browse-link`} style={({ pressed }) => [styles.textButton, pressed && styles.pressed]}>
                    <Icon name={`book`} size={14} color={palette.action} />
                    <Text nativeID={`contact-browse-label`} style={styles.linkText}>Browse Collection</Text>
                  </Pressable>
                </Link>
              )}
              <Pressable onPress={toggleTheme} accessibilityRole={`button`} nativeID={`contact-theme-toggle`} accessibilityLabel={theme === `dark` ? `Switch to Light Mode` : `Switch to Dark Mode`} style={({ pressed }) => [styles.themeToggle, pressed && styles.pressed]}>
                <Icon name={theme === `dark` ? `sun` : `moon`} size={20} fill={`#FFFFFF`} color={`#FFFFFF`} />
              </Pressable>
              <Link href={landingLinks.signin} asChild>
                <Pressable accessibilityRole={`link`} nativeID={`contact-signin-link`} style={({ pressed }) => [styles.textButton, pressed && styles.pressed]}>
                  <Icon name={`login`} size={16} color={palette.leaf} />
                  <Text nativeID={`contact-signin-label`} style={styles.linkText}>Sign In</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </Animated.View>

        <View nativeID={`contact-main`} style={styles.main}>
          <View nativeID={`contact-main-content`} style={styles.container}>
            <View nativeID={`contact-hero`} style={styles.hero} onLayout={(event) => { heroEnd.current = event.nativeEvent.layout.y + event.nativeEvent.layout.height + 76; }}>
              <View nativeID={`contact-hero-eyebrow`} style={styles.eyebrowRow}>
                <Icon name={`mail`} size={15} color={palette.leaf} />
                <Text nativeID={`contact-eyebrow-label`} style={styles.eyebrow}>LET’S TALK</Text>
              </View>
              <Text nativeID={`contact-hero-title`} accessibilityRole={`header`} style={[styles.heroTitle, width < 620 && styles.smallHeroTitle]}>Good conversations{`\n`}start with a <Text style={styles.heroAccent}>hello.</Text></Text>
              <Text nativeID={`contact-hero-copy`} style={styles.heroCopy}>A word to share, a question to ask, or something to build together? We’d love to hear what’s on your mind.</Text>
            </View>

            <View nativeID={`contact-layout`} style={[styles.layout, wide && styles.wideLayout]}>
              <View nativeID={`contact-support-panel`} style={[styles.supportPanel, wide && styles.wideSupportPanel]}>
                <Text nativeID={`contact-support-title`} accessibilityRole={`header`} style={styles.sectionTitle}>What brings you here?</Text>
                <Text nativeID={`contact-support-copy`} style={styles.copy}>Every good conversation starts with a little context.</Text>
                <View nativeID={`contact-guides`} style={styles.guides}>
                  {contactGuides.map((guide, index) => (
                    <View key={guide.id} nativeID={`contact-guide-${guide.id}`} style={styles.guide}>
                      <View nativeID={`contact-guide-icon-${guide.id}`} style={styles.guideIcon}><Icon name={guide.icon} size={21} color={index % 2 ? palette.leaf : palette.action} /></View>
                      <View nativeID={`contact-guide-content-${guide.id}`} style={styles.guideContent}>
                        <Text nativeID={`contact-guide-title-${guide.id}`} style={styles.guideTitle}>{guide.title}</Text>
                        <Text nativeID={`contact-guide-copy-${guide.id}`} style={styles.copy}>{guide.copy}</Text>
                      </View>
                    </View>
                  ))}
                </View>
                <View nativeID={`contact-piratechs-card`} style={styles.piratechsCard}>
                  <View nativeID={`contact-piratechs-heading`} style={styles.eyebrowRow}>
                    <Icon name={`heart`} size={17} color={palette.action} />
                    <Text nativeID={`contact-piratechs-title`} style={styles.guideTitle}>Made With Curiosity</Text>
                  </View>
                  <Text nativeID={`contact-piratechs-copy`} style={styles.copy}>Palindrome Lists is a Piratechs project, built for people who enjoy words from every angle.</Text>
                  <Link href={`https://piratechs.com/`} asChild>
                    <Pressable accessibilityRole={`link`} nativeID={`contact-piratechs-visit`} style={({ pressed }) => [styles.textButton, pressed && styles.pressed]}>
                      <Icon name={`external`} size={14} color={palette.leaf} />
                      <Text nativeID={`contact-piratechs-visit-label`} style={styles.linkText}>Visit Piratechs</Text>
                    </Pressable>
                  </Link>
                </View>
              </View>

              <View nativeID={`contact-form-card`} style={[styles.formCard, wide && styles.wideFormCard, width < 620 && styles.smallFormCard]}>
                <View nativeID={`contact-form-heading`} style={styles.formHeading}>
                  <View nativeID={`contact-form-title-icon`} style={styles.formTitleIcon}><Icon name={`comment`} size={24} color={palette.action} /></View>
                  <View nativeID={`contact-form-title-content`} style={styles.formTitleContent}>
                    <Text nativeID={`contact-form-title`} accessibilityRole={`header`} style={styles.formTitle}>Let’s start a conversation.</Text>
                    <Text nativeID={`contact-form-copy`} style={styles.copy}>Fill in your details below. All fields are required unless marked optional.</Text>
                  </View>
                </View>
                <View nativeID={`contact-form-fields`} style={styles.fields}>
                  <View nativeID={`contact-identity-fields`} style={[styles.identityFields, width >= 680 && styles.wideIdentityFields]}>
                    <View nativeID={`contact-name-column`} style={width >= 680 ? styles.identityColumn : undefined}>{renderField(`name`)}</View>
                    <View nativeID={`contact-email-column`} style={width >= 680 ? styles.identityColumn : undefined}>{renderField(`email`)}</View>
                  </View>
                  <View nativeID={`contact-field-topic`} style={styles.field}>
                    <Text nativeID={`contact-label-topic`} style={styles.label}>Inquiry Type</Text>
                    <View nativeID={`contact-topic-options`} style={styles.topicOptions}>
                      {contactTopics.map((topic, index) => {
                        const selected = values.topic === topic.id;
                        return (
                          <Pressable key={topic.id} onPress={() => setField(`topic`, topic.id)} accessibilityRole={`radio`} nativeID={`contact-topic-${topic.id}`} accessibilityState={{ selected }} accessibilityLabel={topic.label} style={({ pressed }) => [styles.topic, selected && styles.topicSelected, pressed && styles.pressed]}>
                            <Icon name={topic.icon} size={15} color={index % 2 ? palette.leaf : palette.action} />
                            <Text nativeID={`contact-topic-label-${topic.id}`} style={[styles.topicLabel, selected && styles.topicLabelSelected]}>{topic.label}</Text>
                            {selected && <Icon name={`check`} size={13} color={palette.leaf} />}
                          </Pressable>
                        );
                      })}
                    </View>
                    {Boolean(errors.topic) && <Text nativeID={`contact-error-topic`} accessibilityLiveRegion={`polite`} style={styles.error}>{errors.topic}</Text>}
                  </View>
                  {renderField(`subject`)}
                  {showSource && renderField(`source`)}
                  {renderField(`message`)}
                </View>
                <View nativeID={`contact-preview-notice`} style={styles.previewNotice}>
                  <Icon name={`info`} size={20} color={palette.leaf} />
                  <View nativeID={`contact-preview-content`} style={styles.noticeContent}>
                    <Text nativeID={`contact-preview-title`} style={styles.noticeTitle}>Messaging Is Coming Soon</Text>
                    <Text nativeID={`contact-preview-copy`} style={styles.hint}>This preview checks your details. Nothing is sent or saved.</Text>
                  </View>
                </View>
                {validated && (
                  <View nativeID={`contact-validated-result`} accessibilityLiveRegion={`polite`} style={styles.validatedResult}>
                    <View nativeID={`contact-ready-icon`} style={styles.readyIcon}><Icon name={`check`} size={21} color={palette.searchInk} /></View>
                    <View nativeID={`contact-ready-content`} style={styles.noticeContent}>
                      <Text nativeID={`contact-ready-title`} style={styles.noticeTitle}>Your Message Looks Ready</Text>
                      <Text nativeID={`contact-ready-copy`} style={styles.hint}>Nothing has been sent. Message delivery is coming soon.</Text>
                    </View>
                  </View>
                )}
                <View nativeID={`contact-form-actions`} style={styles.formActions}>
                  <Pressable onPress={handleSubmit} accessibilityRole={`button`} nativeID={`contact-submit-button`} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
                    <Icon name={`mail`} size={18} color={palette.searchInk} />
                    <Text nativeID={`contact-submit-label`} style={styles.primaryButtonText}>Send Message</Text>
                  </Pressable>
                  <Pressable onPress={handleReset} accessibilityRole={`button`} nativeID={`contact-reset-button`} accessibilityLabel={`Clear All Form Fields`} style={({ pressed }) => [styles.resetButton, pressed && styles.pressed]}>
                    <Icon name={`repeat`} size={16} color={palette.action} />
                    <Text nativeID={`contact-reset-label`} style={styles.linkText}>Clear Form</Text>
                  </Pressable>
                </View>
                <View nativeID={`contact-privacy-note`} style={styles.privacyNote}>
                  <Icon name={`shield`} size={14} color={palette.leaf} />
                  <Text nativeID={`contact-privacy-copy`} style={styles.hint}>Please don’t include passwords or sensitive personal information.</Text>
                </View>
              </View>
            </View>

          </View>
          <PinkCta
            id={`contact-cta`}
            eyebrow={`Keep Exploring`}
            href={landingLinks.palindromes}
            label={`Explore the collection`}
            title={`Find your next favorite palindrome.`}
            copy={`From everyday words to unexpected phrases, there’s always another way to look at language.`}
          />
          <View nativeID={`contact-faq-container`} style={styles.container}>
            <View nativeID={`contact-faq`} style={styles.faq}>
              <Text nativeID={`contact-faq-eyebrow`} style={styles.eyebrow}>A LITTLE MORE CONTEXT</Text>
              <Text nativeID={`contact-faq-title`} accessibilityRole={`header`} style={styles.sectionTitle}>Frequently Asked Questions</Text>
              <View nativeID={`contact-faq-items`} style={styles.questions}>
                {contactQuestions.map((question, index) => {
                  const expanded = openQuestion === question.id;
                  return (
                    <View key={question.id} nativeID={`contact-question-${question.id}`} style={styles.question}>
                      <Pressable onPress={() => setOpenQuestion(expanded ? null : question.id)} accessibilityRole={`button`} nativeID={`contact-question-toggle-${question.id}`} accessibilityState={{ expanded }} style={({ pressed }) => [styles.questionToggle, pressed && styles.pressed]}>
                        <Icon name={index === 0 ? `book` : index === 1 ? `user` : `mail`} size={17} color={index % 2 ? palette.leaf : palette.action} />
                        <Text nativeID={`contact-question-title-${question.id}`} style={styles.questionTitle}>{question.title}</Text>
                        <View style={expanded ? styles.expandedChevron : undefined}><Icon name={`chevron`} size={17} color={palette.leaf} /></View>
                      </Pressable>
                      {expanded && <Text nativeID={`contact-question-answer-${question.id}`} style={styles.answer}>{question.answer}</Text>}
                    </View>
                  );
                })}
              </View>
          </View>
          </View>
        </View>

        <View nativeID={`contact-footer`} style={[styles.footer, { paddingBottom: 20 + insets.bottom }]}>
          <View nativeID={`contact-footer-inner`} style={[styles.container, styles.footerInner]}>
            <Text nativeID={`contact-copyright`} style={styles.copyright}>© {new Date().getFullYear()} Palindrome Lists</Text>
            <View nativeID={`contact-footer-links`} style={styles.footerLinks}>
              {([`privacy`, `terms`] as const).map((key, index) => (
                <Link key={key} href={landingLinks[key]} asChild>
                  <Pressable accessibilityRole={`link`} nativeID={`contact-footer-${key}`} style={({ pressed }) => [styles.textButton, pressed && styles.pressed]}>
                    <Icon name={key === `terms` ? `file` : `shield`} size={12} color={index % 2 ? palette.leaf : palette.action} />
                    <Text nativeID={`contact-footer-label-${key}`} style={styles.copyright}>{key === `terms` ? `Terms` : `Privacy Policy`}</Text>
                  </Pressable>
                </Link>
              ))}
              <Link href={`https://piratechs.com/`} asChild>
                <Pressable accessibilityRole={`link`} nativeID={`contact-piratechs-link`} style={({ pressed }) => [styles.textButton, pressed && styles.pressed]}>
                  <Icon name={`external`} size={12} color={palette.action} />
                  <Text nativeID={`contact-piratechs-label`} style={styles.copyright}>Made by Piratechs</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
      <Animated.View pointerEvents={beyondHero ? `auto` : `none`} accessibilityElementsHidden={!beyondHero} importantForAccessibility={beyondHero ? `auto` : `no-hide-descendants`} nativeID={`contact-scroll-top-container`} style={[styles.scrollTop, { bottom: 22 + insets.bottom, opacity: topOpacity }]}>
        <Pressable onPress={scrollToTop} disabled={!beyondHero} accessibilityRole={`button`} nativeID={`contact-scroll-top`} accessibilityLabel={`Scroll to Top`} style={({ pressed }) => [styles.scrollTopButton, pressed && styles.pressed]}>
          <Icon name={`up`} size={20} color={palette.searchInk} />
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
};

export default ContactPage;
