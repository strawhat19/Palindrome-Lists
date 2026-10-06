import { Link } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Text,
  View,
  Modal,
  Share,
  Easing,
  Linking,
  Animated,
  Keyboard,
  Pressable,
  TextInput,
  ScrollView,
  AccessibilityInfo,
  useWindowDimensions,
} from 'react-native';
import type {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '../Icon';
import HeroGlow from '../HeroGlow';
import HeroHeadline from '../HeroHeadline';
import createStyles from './styles.native';
import HalfTurnLogo from '../HalfTurnLogo';
import PricingSection from '../PricingSection/index.native';
import type { Palindrome } from '../../shared/landing/types';
import { copyText } from '../../shared/common/clipboard';
import { useTheme } from '../../shared/themeContext/useTheme';
import { useLanding } from '../../shared/landing/LandingContext';
import { formatPalindrome, getPalindromeShareData } from '../../shared/landing/sharing';
import { landingLinks, mainNavigation, footerNavigation } from '../../shared/routes';

type SectionId = `collection` | `about` | `api` | `faq` | `contact`;

const filters = [
  { value: `all`, label: `All` },
  { value: `word`, label: `Words` },
  { value: `name`, label: `Names` },
  { value: `phrase`, label: `Phrases` },
] as const;

const sortOptions = [
  { value: `newest`, label: `Newest` },
  { value: `popular`, label: `Popular` },
  { value: `featured`, label: `Featured` },
] as const;

const palindromeSteps = [
  { title: `Start with the letters.`, copy: `Set aside spaces, punctuation, and capitalization.` },
  { title: `Read them backwards.`, copy: `Begin at the last letter and work your way to the first.` },
  { title: `Find the same thing.`, copy: `If the letters match, you have a palindrome. Simple as that.` },
];

const questions = [
  {
    question: `What counts as a palindrome?`,
    answer: `A word, name, or phrase that reads the same forwards and backwards. Spaces, punctuation, and capitalization are ignored.`,
  },
  {
    question: `Can I save or add a palindrome?`,
    answer: `Saving, submissions, votes, and comments are planned for a future update. For now, the collection is open for everyone to browse.`,
  },
  {
    question: `Where do the examples come from?`,
    answer: `These are editorial examples of familiar English palindromes. Curation and original authorship are separate; an unknown author is left as “Not recorded.” Added dates describe the collection, not invention.`,
  },
];

const formatDate = (value: string) =>
  new Date(`${value.split(`T`)[0]}T12:00:00`).toLocaleDateString(`en-US`, {
    day: `numeric`,
    year: `numeric`,
    month: `short`,
  });

const LandingPage = () => {
  const {
    query,
    sort,
    notice,
    showAll,
    category,
    setSort,
    setQuery,
    setNotice,
    setShowAll,
    setCategory,
    filteredCount,
    visibleEntries,
  } = useLanding();
  const sticky = true;
  const { theme, palette, toggleTheme } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const headerHeight = useRef(0);
  const heroEnd = useRef(Infinity);
  const sectionPositions = useRef<Partial<Record<SectionId, number>>>({});
  const rotation = useRef(new Animated.Value(0)).current;
  const scrollProgress = useRef(new Animated.Value(0)).current;
  const scrollTopOpacity = useRef(new Animated.Value(0)).current;
  const [beyondHero, setBeyondHero] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const isPreview = !showAll && !query.trim() && category === `all`;
  const selectedSortLabel = sortOptions.find((option) => option.value === sort)?.label;
  const headerColor = scrollProgress.interpolate({
    inputRange: [0, 40],
    outputRange: [palette.page, palette.headerGlass],
    extrapolate: `clamp`,
  });
  const headerLogoRotation = scrollProgress.interpolate({
    inputRange: [0, 1800],
    outputRange: [`0deg`, `360deg`],
    extrapolate: `extend`,
  });
  const logoRotation = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: [`0deg`, `360deg`],
  });

  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (active) setReducedMotion(enabled);
    }).catch(() => {});
    const listener = AccessibilityInfo.addEventListener(`reduceMotionChanged`, setReducedMotion);
    return () => {
      active = false;
      listener.remove();
    };
  }, []);

  useEffect(() => {
    rotation.setValue(0);
    if (reducedMotion) return;
    const animation = Animated.loop(Animated.timing(rotation, {
      toValue: 1,
      duration: 8000,
      easing: Easing.linear,
      useNativeDriver: true,
      isInteraction: false,
    }));
    animation.start();
    return () => animation.stop();
  }, [rotation, reducedMotion]);

  useEffect(() => {
    const animation = Animated.timing(scrollTopOpacity, {
      duration: reducedMotion ? 0 : 180,
      toValue: beyondHero ? 1 : 0,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [beyondHero, reducedMotion, scrollTopOpacity]);

  const recordPosition = (section: SectionId, event: LayoutChangeEvent) => {
    sectionPositions.current[section] = event.nativeEvent.layout.y;
  };

  const scrollToSection = (section: SectionId) => {
    Keyboard.dismiss();
    scrollRef.current?.scrollTo({
      animated: !reducedMotion,
      y: Math.max(0, (sectionPositions.current[section] ?? 0) - headerHeight.current + 8),
    });
  };

  const scrollToTop = () => {
    Keyboard.dismiss();
    scrollRef.current?.scrollTo({ y: 0, animated: !reducedMotion });
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = Math.max(0, event.nativeEvent.contentOffset.y);
    scrollProgress.setValue(offset);
    setBeyondHero(offset > heroEnd.current);
  };

  const showAccountsNotice = (action?: string) => {
    setNotice({
      title: action ? `Accounts Are Coming Soon` : `Sign In Is Coming Soon`,
      message: action
        ? `${action} will be available when accounts are added. You can still browse and search the collection.`
        : `Accounts are planned for a future update. The collection is open to browse without signing in.`,
    });
  };

  const copyPalindrome = async (entry: Palindrome) => {
    const formatted = formatPalindrome(entry);
    try {
      await copyText(formatted);
      setNotice({
        title: `Palindrome Copied`,
        message: `${entry.text} is ready to paste with its type and a link to Palindrome Lists.`,
      });
    } catch {
      setNotice({
        title: `Copy Unavailable`,
        message: `Select and copy the formatted palindrome below:\n\n${formatted}`,
      });
    }
  };

  const sharePalindrome = async (entry: Palindrome) => {
    const data = getPalindromeShareData(entry);
    try {
      await Share.share({
        title: data.title,
        message: `${data.text}\n\n${data.url}`,
      });
    } catch {
      setNotice({
        title: `Share Unavailable`,
        message: `You can copy this palindrome and paste it into a message or social post:\n\n${formatPalindrome(entry)}`,
      });
    }
  };

  const closeModal = () => {
    setNotice(null);
    setSortMenuOpen(false);
  };

  const openPiratechs = () => {
    Linking.openURL(`https://piratechs.com/`).catch(() => {
      setNotice({
        title: `Visit Piratechs`,
        message: `Open https://piratechs.com/ in your browser to get in touch.`,
      });
    });
  };

  const resetCollection = () => {
    setQuery(``);
    setCategory(`all`);
    setShowAll(false);
  };

  return (
    <SafeAreaView
      nativeID={`landing-safe-area`}
      style={styles.safeArea}
      edges={[`top`, `left`, `right`]}
    >
      <ScrollView
        ref={scrollRef}
        style={styles.page}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        nativeID={`landing-page`}
        keyboardDismissMode={`on-drag`}
        keyboardShouldPersistTaps={`handled`}
        contentContainerStyle={styles.content}
        stickyHeaderIndices={sticky ? [0] : undefined}
      >
        <Animated.View
          nativeID={`site-header`}
          style={[styles.header, { backgroundColor: headerColor }]}
          onLayout={(event) => { headerHeight.current = event.nativeEvent.layout.height; }}
        >
          <View nativeID={`header-inner`} style={[styles.container, styles.headerInner]}>
            <View nativeID={`header-brand-row`} style={styles.headerBrandRow}>
              <Link href={landingLinks.home} asChild>
                <Pressable
                  onPress={scrollToTop}
                  nativeID={`header-brand`}
                  accessibilityRole={`link`}
                  accessibilityLabel={`Palindrome Lists Home`}
                  style={({ pressed }) => [styles.brand, pressed && styles.pressed]}
                >
                  <Animated.View
                    nativeID={`header-rotating-logo`}
                    style={{ transform: [{ rotate: reducedMotion ? `0deg` : headerLogoRotation }] }}
                  >
                    <HalfTurnLogo id={`header-half-turn-logo`} size={37} />
                  </Animated.View>
                  <Text nativeID={`header-brand-name`} style={styles.brandName}>
                    Palindrome Lists
                  </Text>
                </Pressable>
              </Link>
            </View>
            <ScrollView
              horizontal
              nativeID={`header-navigation`}
              accessibilityLabel={`Main Navigation`}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.navigation}
            >
              {mainNavigation.filter((item) => item.key !== `signin`).map((item) => (
                <Link key={item.key} href={landingLinks[item.key]} asChild>
                  <Pressable
                    accessibilityRole={`link`}
                    nativeID={`navigation-${item.key}`}
                    style={({ pressed }) => [styles.navigationLink, pressed && styles.pressed]}
                  >
                    <Icon name={item.icon} size={13} color={palette.muted} />
                    <Text
                      nativeID={`navigation-label-${item.key}`}
                      style={styles.navigationText}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                </Link>
              ))}
              <View nativeID={`header-account-actions`} style={styles.accountActions}>
                <Pressable
                  onPress={toggleTheme}
                  nativeID={`header-theme-toggle`}
                  accessibilityRole={`button`}
                  accessibilityLabel={theme === `dark` ? `Switch to Light Mode` : `Switch to Dark Mode`}
                  style={({ pressed }) => [styles.themeToggle, pressed && styles.pressed]}
                >
                  <Icon name={theme === `dark` ? `sun` : `moon`} size={20} color={palette.leaf} />
                </Pressable>
                <Link href={landingLinks.signin} asChild>
                  <Pressable
                    nativeID={`navigation-signin`}
                    accessibilityRole={`link`}
                    style={({ pressed }) => [styles.signIn, pressed && styles.pressed]}
                  >
                    <Icon name={`right`} size={13} color={palette.page} />
                    <Text nativeID={`navigation-label-signin`} style={styles.signInText}>Sign in</Text>
                  </Pressable>
                </Link>
              </View>
            </ScrollView>
          </View>
        </Animated.View>

        <View
          nativeID={`hero`}
          style={[styles.container, styles.hero]}
          onLayout={(event) => { heroEnd.current = event.nativeEvent.layout.y + event.nativeEvent.layout.height; }}
        >
          <HeroGlow progress={rotation} reducedMotion={reducedMotion} />
          <Animated.View
            nativeID={`hero-rotating-logo`}
            style={[styles.heroLogo, { transform: [{ rotate: logoRotation }] }]}
          >
            <HalfTurnLogo id={`hero-half-turn-logo`} size={72} />
          </Animated.View>
          <Text nativeID={`hero-eyebrow`} style={[styles.eyebrow, styles.heroEyebrow]}>
            WORDS WORTH REPEATING
          </Text>
          <HeroHeadline visible={!beyondHero} reducedMotion={reducedMotion} />
          <Text nativeID={`hero-copy`} style={styles.heroCopy}>
            A little collection of words, names, and phrases that read the same forwards and backwards.
          </Text>
          <View nativeID={`hero-search`} style={styles.search}>
            <Icon name={`search`} size={17} color={palette.muted} />
            <TextInput
              value={query}
              autoCorrect={false}
              returnKeyType={`search`}
              style={styles.searchInput}
              onChangeText={setQuery}
              keyboardAppearance={theme}
              selectionColor={palette.pink}
              autoCapitalize={`none`}
              nativeID={`palindrome-search-input`}
              placeholder={`Find a word, name, or phrase`}
              placeholderTextColor={palette.muted}
              accessibilityLabel={`Search Palindromes`}
              onSubmitEditing={() => scrollToSection(`collection`)}
            />
            <Pressable
              nativeID={`palindrome-search-button`}
              accessibilityRole={`button`}
              onPress={() => scrollToSection(`collection`)}
              style={({ pressed }) => [styles.searchButton, pressed && styles.pressed]}
            >
              <Text nativeID={`search-button-label`} style={styles.searchButtonText}>Search</Text>
              <Icon name={`right`} size={14} color={palette.searchInk} />
            </Pressable>
          </View>
        </View>

        <View
          nativeID={`collection`}
          style={[styles.container, styles.collection]}
          onLayout={(event) => recordPosition(`collection`, event)}
        >
          <View nativeID={`collection-heading`} style={styles.collectionHeading}>
            <Text nativeID={`collection-title`} accessibilityRole={`header`} style={styles.sectionTitle}>
              A few favorites.
            </Text>
            <Text nativeID={`collection-sample-label`} style={styles.sampleLabel}>Curated examples</Text>
          </View>
          <View nativeID={`collection-controls`} style={styles.collectionControls}>
            <View nativeID={`collection-filters`} style={styles.filters}>
              {filters.map((filter) => (
                <Pressable
                  key={filter.value}
                  accessibilityRole={`button`}
                  nativeID={`filter-${filter.value}`}
                  onPress={() => setCategory(filter.value)}
                  accessibilityState={{ selected: category === filter.value }}
                  style={({ pressed }) => [
                    styles.filterButton,
                    category === filter.value && styles.filterSelected,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text
                    nativeID={`filter-label-${filter.value}`}
                    style={[styles.filterText, category === filter.value && styles.filterTextSelected]}
                  >
                    {filter.label}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Pressable
              nativeID={`sort-control`}
              accessibilityRole={`button`}
              onPress={() => setSortMenuOpen(true)}
              accessibilityLabel={`Sort Collection, ${selectedSortLabel}`}
              style={({ pressed }) => [styles.sortButton, pressed && styles.pressed]}
            >
              <Text nativeID={`sort-control-label`} style={styles.sortText}>{selectedSortLabel}</Text>
              <Icon name={`chevron`} size={12} color={palette.muted} />
            </Pressable>
          </View>
          {visibleEntries.length > 0 ? (
            <View
              nativeID={`palindrome-grid`}
              style={[
                styles.grid,
                isPreview && styles.previewGrid,
                isPreview && width >= 1100 && styles.widePreviewGrid,
              ]}
            >
              {visibleEntries.map((entry) => (
                <View
                  key={entry.id}
                  nativeID={`palindrome-card-${entry.id}`}
                  style={[
                    styles.card,
                    !isPreview && width >= 760 && styles.wideCard,
                    !isPreview && width >= 1100 && styles.threeColumnCard,
                    isPreview && styles.previewCard,
                    isPreview && width >= 1100 && styles.widePreviewCard,
                    isPreview && entry.type === `name` && styles.previewNameCard,
                    isPreview && width >= 1100 && entry.type === `name` && styles.widePreviewNameCard,
                  ]}
                >
                  <View
                    nativeID={`card-content-${entry.id}`}
                    style={[
                      styles.cardContent,
                      isPreview && styles.previewCardContent,
                      isPreview && entry.type === `name` && styles.previewNameContent,
                    ]}
                  >
                    <View nativeID={`card-heading-${entry.id}`} style={styles.cardHeading}>
                      <View nativeID={`card-type-${entry.id}`} style={styles.recordType}>
                        <Text nativeID={`card-type-label-${entry.id}`} style={styles.recordTypeText}>
                          {entry.type === `word` ? `Word` : entry.type === `name` ? `Name` : `Phrase`}
                        </Text>
                      </View>
                      <View nativeID={`record-actions-${entry.id}`} style={styles.topActions}>
                        <Pressable
                          accessibilityRole={`button`}
                          nativeID={`comment-${entry.id}`}
                          onPress={() => showAccountsNotice(`Commenting on palindromes`)}
                          accessibilityLabel={`Comment on ${entry.text}, ${entry.comments} comments, preview only`}
                          style={({ pressed }) => [styles.iconButton, styles.commentButton, pressed && styles.pressed]}
                        >
                          <Icon name={`comment`} size={17} color={palette.muted} />
                          <Text nativeID={`comment-count-${entry.id}`} style={styles.actionCount}>
                            {entry.comments}
                          </Text>
                        </Pressable>
                        <Pressable
                          hitSlop={4}
                          accessibilityRole={`button`}
                          nativeID={`heart-${entry.id}`}
                          accessibilityLabel={`Heart ${entry.text}`}
                          onPress={() => showAccountsNotice(`Hearting palindromes`)}
                          style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
                        >
                          <Icon name={`heart`} size={17} color={palette.muted} />
                        </Pressable>
                        <Pressable
                          hitSlop={4}
                          accessibilityRole={`button`}
                          nativeID={`copy-${entry.id}`}
                          onPress={() => copyPalindrome(entry)}
                          accessibilityLabel={`Copy ${entry.text}`}
                          style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
                        >
                          <Icon name={`copy`} size={17} color={palette.muted} />
                        </Pressable>
                        <Pressable
                          hitSlop={4}
                          accessibilityRole={`button`}
                          nativeID={`save-${entry.id}`}
                          accessibilityLabel={`Save ${entry.text}`}
                          onPress={() => showAccountsNotice(`Saving palindromes`)}
                          style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
                        >
                          <Icon name={`save`} size={17} color={palette.muted} />
                        </Pressable>
                        <Pressable
                          hitSlop={4}
                          accessibilityRole={`button`}
                          nativeID={`share-${entry.id}`}
                          onPress={() => sharePalindrome(entry)}
                          accessibilityLabel={`Share ${entry.text}`}
                          style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
                        >
                          <Icon name={`share`} size={17} color={palette.muted} />
                        </Pressable>
                      </View>
                    </View>
                    <Text
                      nativeID={`card-title-${entry.id}`}
                      accessibilityRole={`header`}
                      style={[
                        styles.cardTitle,
                        entry.type === `phrase` && styles.phraseTitle,
                        isPreview && entry.type === `name` && styles.previewNameTitle,
                      ]}
                    >
                      {entry.text}
                    </Text>
                    <Text nativeID={`card-language-${entry.id}`} style={styles.cardLanguage}>
                      {entry.language} · {entry.letters} letters
                    </Text>
                    <View nativeID={`card-visible-details-${entry.id}`} style={styles.visibleMetadata}>
                      {[
                        { label: `Source`, value: entry.source },
                        { label: `Author`, value: entry.author },
                        { label: `Added`, value: formatDate(entry.added) },
                      ].map((detail) => (
                        <View
                          key={detail.label}
                          style={styles.metadataPair}
                          nativeID={`card-${detail.label.toLowerCase()}-${entry.id}`}
                        >
                          <Text style={styles.metadataLabel}>{detail.label}</Text>
                          <Text style={styles.metadataValue}>{detail.value}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  <View nativeID={`card-footer-${entry.id}`} style={styles.cardFooter}>
                    <Pressable
                      accessibilityRole={`button`}
                      nativeID={`details-button-${entry.id}`}
                      accessibilityLabel={`Details for ${entry.text}`}
                      accessibilityState={{ expanded: Boolean(expandedCards[entry.id]) }}
                      style={({ pressed }) => [styles.detailsButton, pressed && styles.pressed]}
                      onPress={() => setExpandedCards((current) => ({
                        ...current,
                        [entry.id]: !current[entry.id],
                      }))}
                    >
                      <Text style={styles.detailsText}>Details</Text>
                      <View style={expandedCards[entry.id] ? styles.chevronExpanded : undefined}>
                        <Icon name={`chevron`} size={12} color={palette.muted} />
                      </View>
                    </Pressable>
                    <View nativeID={`record-votes-${entry.id}`} style={styles.actions}>
                      <Pressable
                        hitSlop={4}
                        accessibilityRole={`button`}
                        nativeID={`downvote-${entry.id}`}
                        accessibilityLabel={`Downvote ${entry.text}`}
                        onPress={() => showAccountsNotice(`Voting on palindromes`)}
                        style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
                      >
                        <Icon name={`down`} size={17} color={palette.muted} />
                      </Pressable>
                      <Text
                        style={styles.voteScore}
                        nativeID={`vote-score-${entry.id}`}
                        accessibilityLabel={`${entry.votes} net votes, preview only`}
                      >
                        {entry.votes}
                      </Text>
                      <Pressable
                        hitSlop={4}
                        accessibilityRole={`button`}
                        nativeID={`upvote-${entry.id}`}
                        accessibilityLabel={`Upvote ${entry.text}`}
                        onPress={() => showAccountsNotice(`Voting on palindromes`)}
                        style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
                      >
                        <Icon name={`up`} size={17} color={palette.pink} />
                      </Pressable>
                    </View>
                  </View>
                  {expandedCards[entry.id] && (
                    <View nativeID={`metadata-panel-${entry.id}`} style={styles.detailsPanel}>
                      <View nativeID={`card-extra-details-${entry.id}`} style={styles.detailsMetadata}>
                        <View nativeID={`first-recorded-${entry.id}`} style={styles.metadataPair}>
                          <Text style={styles.metadataLabel}>First recorded</Text>
                          <Text style={styles.metadataValue}>{entry.firstRecorded}</Text>
                        </View>
                        <View nativeID={`added-by-${entry.id}`} style={styles.metadataPair}>
                          <Text style={styles.metadataLabel}>Added by</Text>
                          <Text style={styles.metadataValue}>{entry.addedBy}</Text>
                        </View>
                      </View>
                      <Text nativeID={`metadata-note-${entry.id}`} style={styles.detailNote}>
                        Added dates describe the collection, not invention. Activity controls are previews.
                        Letter counts ignore spaces and punctuation.
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          ) : (
            <View nativeID={`collection-empty-state`} style={styles.emptyState}>
              <Icon name={`search`} size={24} color={palette.pink} />
              <Text nativeID={`empty-state-title`} style={styles.emptyTitle}>No matches yet.</Text>
              <Text nativeID={`empty-state-copy`} style={styles.emptyCopy}>
                Try a different word, name, or phrase, or reset the collection.
              </Text>
              <Pressable
                onPress={resetCollection}
                nativeID={`reset-collection`}
                accessibilityRole={`button`}
                style={({ pressed }) => [styles.searchButton, pressed && styles.pressed]}
              >
                <Icon name={`repeat`} size={14} color={palette.searchInk} />
                <Text style={styles.searchButtonText}>Reset Collection</Text>
              </Pressable>
            </View>
          )}
          {(showAll || filteredCount > visibleEntries.length) && (
            <Pressable
              nativeID={`browse-collection`}
              accessibilityRole={`button`}
              onPress={() => setShowAll(!showAll)}
              style={({ pressed }) => [styles.browseButton, pressed && styles.pressed]}
            >
              <Text nativeID={`browse-collection-label`} style={styles.browseText}>
                {showAll ? `Show fewer` : `Browse the collection`}
              </Text>
              <Icon name={showAll ? `up` : `right`} size={15} color={palette.action} />
            </Pressable>
          )}
          <Text nativeID={`collection-sample-note`} style={styles.sampleNote}>
            Community actions are previews and are not available yet.
          </Text>
        </View>

        <View
          nativeID={`about`}
          style={styles.about}
          onLayout={(event) => recordPosition(`about`, event)}
        >
          <View nativeID={`about-inner`} style={styles.container}>
            <Text nativeID={`about-eyebrow`} style={[styles.eyebrow, styles.sectionEyebrow]}>
              A LITTLE WORDPLAY
            </Text>
            <Text nativeID={`about-title`} accessibilityRole={`header`} style={styles.sectionTitle}>
              Same letters. Both directions.
            </Text>
            <Text nativeID={`about-copy`} style={styles.sectionCopy}>
              From “level” to a whole sentence, palindromes turn an ordinary string of letters into a small surprise.
            </Text>
            <View nativeID={`palindrome-steps`} style={styles.steps}>
              {palindromeSteps.map((step, index) => (
                <View key={step.title} nativeID={`palindrome-step-${index}`} style={styles.step}>
                  <Text nativeID={`step-number-${index}`} style={styles.stepNumber}>{`0${index + 1}`}</Text>
                  <View nativeID={`step-content-${index}`} style={styles.stepContent}>
                    <Text nativeID={`step-title-${index}`} style={styles.stepTitle}>{step.title}</Text>
                    <Text nativeID={`step-copy-${index}`} style={styles.stepCopy}>{step.copy}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View
          nativeID={`api`}
          style={[styles.container, styles.section]}
          onLayout={(event) => recordPosition(`api`, event)}
        >
          <View nativeID={`api-panel`} style={styles.apiPanel}>
            <View style={styles.apiIcon}><Icon name={`code`} size={27} color={palette.pink} /></View>
            <Text nativeID={`api-eyebrow`} style={[styles.eyebrow, styles.sectionEyebrow]}>FOR THE BUILDERS</Text>
            <Text nativeID={`api-title`} accessibilityRole={`header`} style={styles.sectionTitle}>
              Good words for your next idea.
            </Text>
            <Text nativeID={`api-copy`} style={styles.sectionCopy}>
              A simple API for palindrome words, names, and phrases is planned. It will make the collection useful in your own projects, too.
            </Text>
            <View nativeID={`api-status`} style={styles.apiStatus}>
              <Icon name={`info`} size={14} color={palette.action} />
              <Text style={styles.apiStatusText}>Coming later · API is not available yet</Text>
            </View>
          </View>
        </View>

        <PricingSection />

        <View
          nativeID={`faq`}
          style={[styles.container, styles.section]}
          onLayout={(event) => recordPosition(`faq`, event)}
        >
          <Text nativeID={`faq-eyebrow`} style={[styles.eyebrow, styles.sectionEyebrow]}>CURIOUS?</Text>
          <Text nativeID={`faq-title`} accessibilityRole={`header`} style={styles.sectionTitle}>A few good questions.</Text>
          <View nativeID={`faq-items`} style={styles.faqItems}>
            {questions.map((item, index) => (
              <View key={item.question} nativeID={`faq-item-${index}`} style={styles.faqItem}>
                <Pressable
                  accessibilityRole={`button`}
                  nativeID={`faq-question-${index}`}
                  accessibilityState={{ expanded: openQuestion === index }}
                  onPress={() => setOpenQuestion(openQuestion === index ? null : index)}
                  style={({ pressed }) => [styles.faqQuestion, pressed && styles.pressed]}
                >
                  <Text nativeID={`faq-question-label-${index}`} style={styles.faqQuestionText}>
                    {item.question}
                  </Text>
                  <View style={openQuestion === index ? styles.chevronExpanded : undefined}>
                    <Icon name={`chevron`} size={16} color={palette.muted} />
                  </View>
                </Pressable>
                {openQuestion === index && (
                  <Text nativeID={`faq-answer-${index}`} style={styles.faqAnswer}>{item.answer}</Text>
                )}
              </View>
            ))}
          </View>
        </View>

        <View
          nativeID={`contact`}
          style={[styles.container, styles.contact]}
          onLayout={(event) => recordPosition(`contact`, event)}
        >
          <Text nativeID={`contact-eyebrow`} style={[styles.eyebrow, styles.sectionEyebrow]}>KEEP IN TOUCH</Text>
          <Text nativeID={`contact-title`} accessibilityRole={`header`} style={styles.sectionTitle}>
            Have a word with us.
          </Text>
          <Text nativeID={`contact-copy`} style={styles.sectionCopy}>
            A question, correction, or a palindrome worth sharing? Reach the people behind the collection at Piratechs.
          </Text>
          <Pressable
            onPress={openPiratechs}
            accessibilityRole={`link`}
            nativeID={`contact-piratechs`}
            accessibilityLabel={`Visit Piratechs to Get in Touch`}
            style={({ pressed }) => [styles.contactButton, pressed && styles.pressed]}
          >
            <Icon name={`mail`} size={16} color={palette.searchInk} />
            <Text nativeID={`contact-button-label`} style={styles.searchButtonText}>Get in Touch</Text>
            <Icon name={`external`} size={13} color={palette.searchInk} />
          </Pressable>
        </View>

        <View
          nativeID={`site-footer`}
          style={[styles.footer, { paddingBottom: Math.max(32, insets.bottom + 22) }]}
        >
          <View nativeID={`footer-inner`} style={styles.container}>
            <Link href={landingLinks.home} asChild>
              <Pressable
                onPress={scrollToTop}
                nativeID={`footer-brand`}
                accessibilityRole={`link`}
                accessibilityLabel={`Palindrome Lists Home`}
                style={({ pressed }) => [styles.footerBrand, pressed && styles.pressed]}
              >
                <Animated.View
                  nativeID={`footer-rotating-logo`}
                  style={{ transform: [{ rotate: logoRotation }] }}
                >
                  <HalfTurnLogo id={`footer-half-turn-logo`} size={29} />
                </Animated.View>
                <Text nativeID={`footer-brand-label`} style={styles.footerBrandText}>Palindrome Lists</Text>
              </Pressable>
            </Link>
            <View nativeID={`footer-navigation`} style={[styles.footerLinks, { flexWrap: `wrap` }]}>
              {footerNavigation.map((item) => (
                <Link key={item.key} href={landingLinks[item.key]} asChild>
                  <Pressable
                    accessibilityRole={`link`}
                    nativeID={`footer-link-${item.key}`}
                    style={({ pressed }) => [styles.footerLink, pressed && styles.pressed]}
                  >
                    <Icon name={item.icon} size={12} color={palette.muted} />
                    <Text nativeID={`footer-label-${item.key}`} style={styles.footerLinkText}>{item.label}</Text>
                  </Pressable>
                </Link>
              ))}
            </View>
            <Text nativeID={`copyright`} style={styles.copyright}>
              © {new Date().getFullYear()} Palindrome Lists. All rights reserved.
            </Text>
            <Pressable
              onPress={openPiratechs}
              nativeID={`piratechs-link`}
              accessibilityRole={`link`}
              accessibilityLabel={`Made by Piratechs, Opens Website`}
              style={({ pressed }) => [styles.piratechs, pressed && styles.pressed]}
            >
              <Text nativeID={`piratechs-label`} style={styles.piratechsText}>Made by Piratechs</Text>
              <Icon name={`external`} size={12} color={palette.muted} />
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <Animated.View
        nativeID={`scroll-to-top-container`}
        pointerEvents={beyondHero ? `auto` : `none`}
        accessibilityElementsHidden={!beyondHero}
        importantForAccessibility={beyondHero ? `auto` : `no-hide-descendants`}
        style={[
          styles.scrollTop,
          { bottom: insets.bottom + 18, opacity: scrollTopOpacity },
        ]}
      >
        <Pressable
          onPress={scrollToTop}
          disabled={!beyondHero}
          nativeID={`scroll-to-top`}
          accessibilityRole={`button`}
          accessibilityLabel={`Scroll to Top`}
          style={({ pressed }) => [styles.scrollTopButton, pressed && styles.pressed]}
        >
          <Icon name={`up`} size={20} color={palette.action} />
        </Pressable>
      </Animated.View>

      <Modal
        transparent
        onRequestClose={closeModal}
        nativeID={`landing-notice-modal`}
        visible={Boolean(notice) || sortMenuOpen}
        animationType={reducedMotion ? `none` : `fade`}
      >
        <View nativeID={`notice-backdrop`} style={styles.modalBackdrop}>
          <View
            accessibilityViewIsModal
            nativeID={`notice-panel`}
            style={styles.modalPanel}
          >
            <View nativeID={`notice-heading`} style={styles.modalHeading}>
              <Text nativeID={`notice-title`} accessibilityRole={`header`} style={styles.modalTitle}>
                {sortMenuOpen ? `Sort the Collection` : notice?.title}
              </Text>
              <Pressable
                onPress={closeModal}
                nativeID={`notice-close`}
                style={styles.modalClose}
                accessibilityRole={`button`}
                accessibilityLabel={`Close Dialog`}
              >
                <Icon name={`close`} size={21} color={palette.muted} />
              </Pressable>
            </View>
            {sortMenuOpen ? (
              <View nativeID={`sort-options`} style={styles.sortOptions}>
                {sortOptions.map((option) => (
                  <Pressable
                    key={option.value}
                    accessibilityRole={`radio`}
                    nativeID={`sort-option-${option.value}`}
                    accessibilityState={{ checked: sort === option.value }}
                    onPress={() => {
                      setSort(option.value);
                      setSortMenuOpen(false);
                    }}
                    style={({ pressed }) => [
                      styles.sortOption,
                      sort === option.value && styles.filterSelected,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Text nativeID={`sort-option-label-${option.value}`} style={styles.sortOptionText}>
                      {option.label}
                    </Text>
                    {sort === option.value && <Icon name={`check`} size={18} color={palette.leaf} />}
                  </Pressable>
                ))}
              </View>
            ) : (
              <>
                <Text selectable nativeID={`notice-message`} style={styles.modalCopy}>{notice?.message}</Text>
                <Pressable
                  onPress={closeModal}
                  nativeID={`notice-confirm`}
                  accessibilityRole={`button`}
                  style={({ pressed }) => [styles.modalConfirm, pressed && styles.pressed]}
                >
                  <Icon name={`check`} size={15} color={palette.searchInk} />
                  <Text nativeID={`notice-confirm-label`} style={styles.searchButtonText}>Got It</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default LandingPage;
