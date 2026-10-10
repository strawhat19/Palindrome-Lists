import Icon from '../Icon';
import { Link } from 'expo-router';
import GoogleLogo from '../GoogleLogo';
import useOnboarding from './useOnboarding';
import HalfTurnLogo from '../HalfTurnLogo';
import PageMetadata from '../PageMetadata';
import createStyles from './styles.native';
import { landingLinks } from '../../shared/routes';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { OnboardingField, OnboardingProps } from './types';
import { useTheme } from '../../shared/themeContext/useTheme';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { collectionInterests, onboardingSteps, onboardingStories } from './data';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, View, Animated, Pressable, TextInput, ScrollView, AccessibilityInfo, useWindowDimensions } from 'react-native';

const fieldLabels = { name: `Full Name`, email: `Email Address`, password: `Password` } as const;
const fieldIcons = { name: `user`, email: `mail`, password: `shield` } as const;

const OnboardingPageView = ({ mode }: OnboardingProps) => {
  const sticky = true;
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { theme, palette, toggleTheme } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);
  const nameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const scrollRef = useRef<ScrollView>(null);
  const storyEnd = useRef(Infinity);
  const scrollProgress = useRef(new Animated.Value(0)).current;
  const topOpacity = useRef(new Animated.Value(0)).current;
  const [beyondStory, setBeyondStory] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const {
    step,
    story,
    values,
    errors,
    notice,
    submit,
    isSignup,
    setField,
    interests,
    moveStory,
    storyIndex,
    previousStep,
    forgotPassword,
    toggleInterest,
    togglePassword,
    setStoryIndex,
    passwordVisible,
    continueWithGoogle,
  } = useOnboarding(mode);
  const wide = width >= 900;
  const headerColor = scrollProgress.interpolate({ inputRange: [0, 40], outputRange: [palette.page, palette.headerGlass], extrapolate: `clamp` });
  const fields: OnboardingField[] = isSignup ? [`name`, `email`, `password`] : [`email`, `password`];
  const selectedCollections = collectionInterests.filter((item) => interests.includes(item.id));
  const title = isSignup ? [`A little curiosity starts here.`, `Make it your kind of collection.`, `Ready for your next discovery.`][step] : `Welcome back.`;
  const copy = isSignup ? [`Join a world of words worth repeating.`, `Choose the palindromes you’d like to explore first.`, `Your choices are ready. There’s plenty to discover, both ways.`][step] : `A little wordplay is waiting for you.`;

  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => { if (active) setReducedMotion(enabled); }).catch(() => {});
    const listener = AccessibilityInfo.addEventListener(`reduceMotionChanged`, setReducedMotion);
    return () => { active = false; listener.remove(); };
  }, []);

  useEffect(() => {
    const animation = Animated.timing(topOpacity, { toValue: beyondStory ? 1 : 0, duration: reducedMotion ? 0 : 180, useNativeDriver: true });
    animation.start();
    return () => animation.stop();
  }, [beyondStory, reducedMotion, topOpacity]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = Math.max(0, event.nativeEvent.contentOffset.y);
    scrollProgress.setValue(offset);
    setBeyondStory(offset > storyEnd.current);
  };
  const scrollToTop = () => scrollRef.current?.scrollTo({ y: 0, animated: !reducedMotion });

  const renderField = (field: OnboardingField) => (
    <View key={field} nativeID={`onboarding-field-${field}`} style={styles.field}>
      <View nativeID={`onboarding-label-row-${field}`} style={styles.labelRow}>
        <Text nativeID={`onboarding-label-${field}`} style={styles.label}>{fieldLabels[field]}</Text>
        {field === `password` && !isSignup && (
          <Pressable onPress={forgotPassword} accessibilityRole={`button`} nativeID={`onboarding-forgot-password`} style={({ pressed }) => [styles.textButton, pressed && styles.pressed]}>
            <Icon name={`repeat`} size={12} color={palette.leaf} />
            <Text nativeID={`onboarding-forgot-label`} style={styles.linkText}>Forgot Password?</Text>
          </Pressable>
        )}
      </View>
      <View nativeID={`onboarding-input-wrap-${field}`} style={[styles.inputWrap, Boolean(errors[field]) && styles.inputError]}>
        <Icon name={fieldIcons[field]} size={17} color={field === `email` ? palette.leaf : palette.action} />
        <TextInput
          value={values[field]}
          autoCorrect={false}
          style={styles.input}
          keyboardAppearance={theme}
          selectionColor={palette.pink}
          nativeID={`onboarding-input-${field}`}
          accessibilityHint={errors[field]}
          accessibilityLabel={fieldLabels[field]}
          placeholderTextColor={palette.muted}
          secureTextEntry={field === `password` && !passwordVisible}
          onChangeText={(value) => setField(field, value)}
          autoCapitalize={field === `name` ? `words` : `none`}
          keyboardType={field === `email` ? `email-address` : `default`}
          returnKeyType={field === `password` ? `done` : `next`}
          ref={field === `name` ? nameRef : field === `email` ? emailRef : passwordRef}
          placeholder={field === `name` ? `Your Name` : field === `email` ? `you@example.com` : isSignup ? `At Least 8 Characters` : `Enter Your Password`}
          textContentType={field === `name` ? `name` : field === `email` ? `emailAddress` : isSignup ? `newPassword` : `password`}
          autoComplete={field === `name` ? `name` : field === `email` ? `email` : isSignup ? `new-password` : `current-password`}
          onSubmitEditing={() => field === `name` ? emailRef.current?.focus() : field === `email` ? passwordRef.current?.focus() : submit()}
        />
        {field === `password` && (
          <Pressable onPress={togglePassword} accessibilityRole={`button`} nativeID={`onboarding-toggle-password`} accessibilityLabel={passwordVisible ? `Hide Password` : `Show Password`} style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
            <Icon name={passwordVisible ? `eyeOff` : `eye`} size={18} color={palette.leaf} />
          </Pressable>
        )}
      </View>
      {Boolean(errors[field]) && <Text nativeID={`onboarding-error-${field}`} accessibilityLiveRegion={`polite`} style={styles.error}>{errors[field]}</Text>}
    </View>
  );

  return (
    <SafeAreaView nativeID={`onboarding-safe-area-${mode}`} style={styles.safeArea} edges={[`top`, `left`, `right`]}>
      <PageMetadata page={mode} />
      <ScrollView ref={scrollRef} style={styles.page} onScroll={handleScroll} scrollEventThrottle={16} nativeID={`onboarding-page-${mode}`} keyboardDismissMode={`on-drag`} keyboardShouldPersistTaps={`handled`} contentContainerStyle={styles.content} stickyHeaderIndices={sticky ? [0] : undefined}>
        <Animated.View nativeID={`onboarding-header`} style={[styles.header, { backgroundColor: headerColor }]}>
          <View nativeID={`onboarding-header-inner`} style={[styles.container, styles.headerInner]}>
            <Link href={landingLinks.home} asChild>
              <Pressable accessibilityRole={`link`} nativeID={`onboarding-brand`} accessibilityLabel={`Palindrome Lists Home`} style={({ pressed }) => [styles.brand, pressed && styles.pressed]}>
                <HalfTurnLogo id={`onboarding-header-logo`} size={37} />
                <Text nativeID={`onboarding-brand-name`} style={styles.brandName}>Palindrome Lists</Text>
              </Pressable>
            </Link>
            <View nativeID={`onboarding-header-actions`} style={styles.headerActions}>
              {width >= 620 && (
                <Link href={landingLinks.home} asChild>
                  <Pressable accessibilityRole={`link`} nativeID={`onboarding-browse-link`} style={({ pressed }) => [styles.textButton, pressed && styles.pressed]}>
                    <Icon name={`book`} size={14} color={palette.action} />
                    <Text nativeID={`onboarding-browse-label`} style={styles.linkText}>Browse Collection</Text>
                  </Pressable>
                </Link>
              )}
              <Pressable onPress={toggleTheme} accessibilityRole={`button`} nativeID={`onboarding-theme-toggle`} accessibilityLabel={theme === `dark` ? `Switch to Light Mode` : `Switch to Dark Mode`} style={({ pressed }) => [styles.themeToggle, pressed && styles.pressed]}>
                <Icon
                  size={20}
                  name={theme === `dark` ? `sun` : `moon`}
                  fill={theme === `dark` ? palette.searchInk : `#FFFFFF`}
                  color={theme === `dark` ? palette.searchInk : `#FFFFFF`}
                />
              </Pressable>
              <Link href={isSignup ? landingLinks.signin : landingLinks.signup} asChild>
                <Pressable accessibilityRole={`link`} nativeID={`onboarding-header-mode-link`} style={({ pressed }) => [styles.textButton, pressed && styles.pressed]}>
                  <Icon name={isSignup ? `login` : `user`} size={14} color={palette.leaf} />
                  <Text nativeID={`onboarding-header-mode-label`} style={styles.linkText}>{isSignup ? `Sign In` : `Sign Up`}</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </Animated.View>

        <View nativeID={`onboarding-layout`} style={[styles.container, styles.layout, wide && styles.wideLayout]}>
          <View nativeID={`onboarding-story`} style={[styles.story, wide && styles.wideStory]} onLayout={(event) => { storyEnd.current = event.nativeEvent.layout.y + event.nativeEvent.layout.height + 100; }}>
            <Text nativeID={`onboarding-story-eyebrow-${storyIndex}`} style={styles.eyebrow}>{story.eyebrow.toUpperCase()}</Text>
            <View nativeID={`onboarding-art-${storyIndex}`} style={styles.art}>
              <View nativeID={`onboarding-art-orbit-pink`} style={[styles.orbit, styles.pinkOrbit]} />
              <View nativeID={`onboarding-art-orbit-green`} style={[styles.orbit, styles.greenOrbit]} />
              <View nativeID={`onboarding-art-card-back`} style={styles.artCardBack}>
                <Icon name={`repeat`} size={29} color={palette.leaf} />
                <Text nativeID={`onboarding-art-back-label`} style={styles.artBackText}>same both ways</Text>
              </View>
              <View nativeID={`onboarding-art-card-${storyIndex}`} style={styles.artCard}>
                <View nativeID={`onboarding-art-card-label-${storyIndex}`} style={styles.artLabelRow}>
                  <Icon name={collectionInterests[storyIndex]?.icon ?? `book`} size={16} color={palette.action} />
                  <Text nativeID={`onboarding-art-kind-${storyIndex}`} style={styles.artLabel}>{story.label}</Text>
                </View>
                <Text nativeID={`onboarding-art-word-${storyIndex}`} style={[styles.artWord, storyIndex === 2 && styles.artPhrase]}>{story.word}</Text>
                <View nativeID={`onboarding-art-direction-${storyIndex}`} style={styles.artDirection}>
                  <Icon name={`right`} size={19} color={palette.action} />
                  <HalfTurnLogo id={`onboarding-art-logo-${storyIndex}`} size={40} />
                  <View style={styles.reverseArrow}><Icon name={`right`} size={19} color={palette.leaf} /></View>
                </View>
              </View>
            </View>
            <Text nativeID={`onboarding-story-title-${storyIndex}`} accessibilityRole={`header`} style={styles.storyTitle}>{story.title}{`\n`}<Text style={styles.storyAccent}>{story.accent}</Text></Text>
            <Text nativeID={`onboarding-story-copy-${storyIndex}`} style={styles.storyCopy}>{story.copy}</Text>
            <View nativeID={`onboarding-story-controls`} style={styles.storyControls}>
              <Pressable onPress={() => moveStory(-1)} accessibilityRole={`button`} nativeID={`onboarding-story-previous`} accessibilityLabel={`Previous Story`} style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
                <View style={styles.reverseArrow}><Icon name={`right`} size={18} color={palette.action} /></View>
              </Pressable>
              <View nativeID={`onboarding-story-pagination`} style={styles.pagination}>
                {onboardingStories.map((item, index) => (
                  <Pressable key={item.word} onPress={() => setStoryIndex(index)} accessibilityRole={`button`} nativeID={`onboarding-story-dot-${index}`} accessibilityLabel={`Show ${item.label}`} accessibilityState={{ selected: index === storyIndex }} style={({ pressed }) => [styles.paginationButton, pressed && styles.pressed]}>
                    <View nativeID={`onboarding-story-dot-marker-${index}`} style={[styles.dot, index === storyIndex && styles.activeDot]} />
                  </Pressable>
                ))}
              </View>
              <Pressable onPress={() => moveStory(1)} accessibilityRole={`button`} nativeID={`onboarding-story-next`} accessibilityLabel={`Next Story`} style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
                <Icon name={`right`} size={18} color={palette.leaf} />
              </Pressable>
            </View>
          </View>

          <View nativeID={`onboarding-form-panel`} style={[styles.formPanel, wide && styles.wideFormPanel]}>
            {isSignup && (
              <View nativeID={`onboarding-steps`} style={styles.steps}>
                {onboardingSteps.map((label, index) => (
                  <View key={label} nativeID={`onboarding-step-${index}`} accessible accessibilityLabel={`Step ${index + 1}: ${label}`} accessibilityState={{ selected: index === step }} style={styles.step}>
                    <View nativeID={`onboarding-step-circle-${index}`} style={[styles.stepCircle, index <= step && styles.stepCircleActive]}>
                      {index < step ? <Icon name={`check`} size={14} color={palette.searchInk} /> : <Text style={[styles.stepNumber, index <= step && styles.stepNumberActive]}>{index + 1}</Text>}
                    </View>
                    <Text nativeID={`onboarding-step-label-${index}`} style={[styles.stepLabel, index === step && styles.stepLabelActive]}>{label}</Text>
                  </View>
                ))}
              </View>
            )}
            <Text nativeID={`onboarding-form-eyebrow`} style={styles.eyebrow}>{isSignup ? `START SOMETHING LOVELY` : `YOUR COLLECTION AWAITS`}</Text>
            <Text nativeID={`onboarding-form-title`} accessibilityRole={`header`} style={styles.formTitle}>{title}</Text>
            <Text nativeID={`onboarding-form-copy`} style={styles.formCopy}>{copy}</Text>
            {(!isSignup || step === 0) && (
              <View nativeID={`onboarding-fields`} style={styles.fields}>
                {fields.map(renderField)}
                {isSignup && <Text nativeID={`onboarding-password-hint`} style={styles.hint}>Use at least 8 characters for your password.</Text>}
              </View>
            )}
            {isSignup && step === 1 && (
              <View nativeID={`onboarding-collection-options`} style={styles.collectionOptions}>
                {collectionInterests.map((item, index) => {
                  const selected = interests.includes(item.id);
                  return (
                    <Pressable key={item.id} onPress={() => toggleInterest(item.id)} accessibilityRole={`checkbox`} nativeID={`onboarding-interest-${item.id}`} accessibilityState={{ checked: selected }} accessibilityLabel={`${item.label}: ${item.description}`} style={({ pressed }) => [styles.interest, selected && styles.interestSelected, pressed && styles.pressed]}>
                      <View nativeID={`onboarding-interest-icon-${item.id}`} style={styles.interestIcon}><Icon name={item.icon} size={23} color={index % 2 ? palette.leaf : palette.action} /></View>
                      <View nativeID={`onboarding-interest-content-${item.id}`} style={styles.interestContent}>
                        <Text nativeID={`onboarding-interest-label-${item.id}`} style={styles.interestTitle}>{item.label} <Text style={styles.interestExample}>/ {item.example}</Text></Text>
                        <Text nativeID={`onboarding-interest-description-${item.id}`} style={styles.interestCopy}>{item.description}</Text>
                      </View>
                      <View nativeID={`onboarding-interest-check-${item.id}`} style={[styles.checkbox, selected && styles.checkboxSelected]}>{selected && <Icon name={`check`} size={13} color={palette.searchInk} />}</View>
                    </Pressable>
                  );
                })}
                {Boolean(errors.interests) && <Text nativeID={`onboarding-interest-error`} accessibilityLiveRegion={`polite`} style={styles.error}>{errors.interests}</Text>}
                <View nativeID={`onboarding-privacy-note`} style={styles.privacyNote}>
                  <Icon name={`shield`} size={19} color={palette.leaf} />
                  <Text nativeID={`onboarding-privacy-copy`} style={[styles.hint, styles.privacyCopy]}>Your account details stay private. Public profiles and sharing will always be your choice.</Text>
                </View>
              </View>
            )}
            {isSignup && step === 2 && (
              <View nativeID={`onboarding-summary`} style={styles.summary}>
                <View nativeID={`onboarding-ready-icon`} style={styles.readyIcon}><Icon name={`check`} size={28} color={palette.searchInk} /></View>
                <Text nativeID={`onboarding-summary-name`} style={styles.summaryName}>{values.name.trim()}</Text>
                <Text nativeID={`onboarding-summary-email`} style={styles.hint}>{values.email.trim()}</Text>
                <View nativeID={`onboarding-summary-interests`} style={styles.summaryInterests}>
                  {selectedCollections.map((item, index) => (
                    <View key={item.id} nativeID={`onboarding-summary-interest-${item.id}`} style={styles.summaryChip}>
                      <Icon name={item.icon} size={14} color={index % 2 ? palette.leaf : palette.action} />
                      <Text nativeID={`onboarding-summary-interest-label-${item.id}`} style={styles.summaryChipText}>{item.label}</Text>
                    </View>
                  ))}
                </View>
                <Text nativeID={`onboarding-summary-preview`} style={styles.hint}>This is a preview. Your account hasn’t been created yet.</Text>
              </View>
            )}
            {Boolean(notice) && <Text nativeID={`onboarding-notice`} accessibilityLiveRegion={`polite`} style={styles.notice}>{notice}</Text>}
            <View nativeID={`onboarding-form-actions`} style={styles.formActions}>
              {isSignup && step > 0 && (
                <Pressable onPress={previousStep} accessibilityRole={`button`} nativeID={`onboarding-back-button`} style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
                  <View style={styles.reverseArrow}><Icon name={`right`} size={16} color={palette.action} /></View>
                  <Text nativeID={`onboarding-back-label`} style={styles.linkText}>Back</Text>
                </Pressable>
              )}
              {isSignup && step === 2 ? (
                <Link href={landingLinks.home} asChild>
                  <Pressable accessibilityRole={`link`} nativeID={`onboarding-explore-button`} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
                    <Icon name={`book`} size={17} color={palette.searchInk} />
                    <Text nativeID={`onboarding-explore-label`} style={styles.primaryButtonText}>Browse Collection</Text>
                  </Pressable>
                </Link>
              ) : (
                <Pressable onPress={submit} accessibilityRole={`button`} nativeID={`onboarding-submit-button`} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
                  <Icon name={isSignup ? `right` : `login`} size={17} color={palette.searchInk} />
                  <Text nativeID={`onboarding-submit-label`} style={styles.primaryButtonText}>{isSignup ? `Continue` : `Sign In`}</Text>
                </Pressable>
              )}
            </View>
            {(!isSignup || step === 0) && (
              <>
                <View nativeID={`onboarding-divider`} style={styles.divider}><View style={styles.dividerLine} /><Text style={styles.hint}>or</Text><View style={styles.dividerLine} /></View>
                <Pressable onPress={continueWithGoogle} accessibilityRole={`button`} nativeID={`onboarding-google-button`} style={({ pressed }) => [styles.googleButton, pressed && styles.pressed]}>
                  <GoogleLogo />
                  <Text nativeID={`onboarding-google-label`} style={styles.googleButtonText}>Continue With Google</Text>
                </Pressable>
                <View nativeID={`onboarding-mode-switch`} style={styles.modeSwitch}>
                  <Text style={styles.hint}>{isSignup ? `Already have an account?` : `New to Palindrome Lists?`}</Text>
                  <Link href={isSignup ? landingLinks.signin : landingLinks.signup} asChild>
                    <Pressable accessibilityRole={`link`} nativeID={`onboarding-mode-link`} style={({ pressed }) => [styles.textButton, pressed && styles.pressed]}>
                      <Icon name={isSignup ? `login` : `user`} size={13} color={palette.action} />
                      <Text nativeID={`onboarding-mode-label`} style={styles.linkText}>{isSignup ? `Sign In` : `Create An Account`}</Text>
                    </Pressable>
                  </Link>
                </View>
              </>
            )}
            <Text nativeID={`onboarding-account-hint`} style={styles.accountHint}>Account features are coming soon. The collection is open to everyone.</Text>
          </View>
        </View>

        <View nativeID={`onboarding-footer`} style={[styles.footer, { paddingBottom: 20 + insets.bottom }]}>
          <View nativeID={`onboarding-footer-inner`} style={[styles.container, styles.footerInner]}>
            <Text nativeID={`onboarding-copyright`} style={styles.copyright}>© {new Date().getFullYear()} Palindrome Lists</Text>
            <View nativeID={`onboarding-footer-links`} style={styles.footerLinks}>
              {([`terms`, `privacy`] as const).map((key, index) => (
                <Link key={key} href={landingLinks[key]} asChild>
                  <Pressable accessibilityRole={`link`} nativeID={`onboarding-footer-${key}`} style={({ pressed }) => [styles.textButton, pressed && styles.pressed]}>
                    <Icon name={key === `terms` ? `file` : `shield`} size={12} color={index % 2 ? palette.leaf : palette.action} />
                    <Text nativeID={`onboarding-footer-label-${key}`} style={styles.copyright}>{key === `terms` ? `Terms` : `Privacy Policy`}</Text>
                  </Pressable>
                </Link>
              ))}
              <Link href={`https://piratechs.com/`} asChild>
                <Pressable accessibilityRole={`link`} nativeID={`onboarding-piratechs-link`} style={({ pressed }) => [styles.textButton, pressed && styles.pressed]}>
                  <Icon name={`external`} size={12} color={palette.action} />
                  <Text nativeID={`onboarding-piratechs-label`} style={styles.copyright}>Made by Piratechs</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
      <Animated.View pointerEvents={beyondStory ? `auto` : `none`} accessibilityElementsHidden={!beyondStory} importantForAccessibility={beyondStory ? `auto` : `no-hide-descendants`} nativeID={`onboarding-scroll-top-container`} style={[styles.scrollTop, { bottom: 22 + insets.bottom, opacity: topOpacity }]}>
        <Pressable onPress={scrollToTop} disabled={!beyondStory} accessibilityRole={`button`} nativeID={`onboarding-scroll-top`} accessibilityLabel={`Scroll to Top`} style={({ pressed }) => [styles.scrollTopButton, pressed && styles.pressed]}>
          <Icon name={`up`} size={20} color={palette.searchInk} />
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
};

const OnboardingPage = ({ mode }: OnboardingProps) => <OnboardingPageView key={mode} mode={mode} />;

export default OnboardingPage;
