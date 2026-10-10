import { Link, type Href } from 'expo-router';
import { Text, View, Animated, Pressable, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '../Icon';
import PageMetadata from '../PageMetadata';
import HalfTurnLogo from '../HalfTurnLogo';
import AlphabetFilter from '../AlphabetFilter';
import PricingSection from '../PricingSection/index.native';
import useContentPage from './useContentPage.native';
import { contentPages } from '../../shared/content/pages';
import type { PageKey } from '../../shared/content/types';
import { normalizePalindrome } from '../../shared/landing/data';
import useAlphabetFilter from '../../shared/landing/useAlphabetFilter';
import { landingLinks, mainNavigation, footerNavigation } from '../../shared/routes';

type ContentPageProps = {
  page: PageKey;
};

const ContentPageView = ({ page }: ContentPageProps) => {
  const sticky = true;
  const insets = useSafeAreaInsets();
  const content = contentPages[page];
  const hasAlphabetFilter = [`words`, `names`, `phrases`].includes(page);
  const { selectedLetters, toggleLetter, clearLetters, filteredEntries: filteredExamples } = useAlphabetFilter(content.examples);
  const pageLabel = [...mainNavigation, ...footerNavigation].find((item) => item.key === page)?.label ?? content.eyebrow;
  const {
    theme,
    styles,
    palette,
    heroEnd,
    scrollRef,
    topOpacity,
    beyondHero,
    headerColor,
    toggleTheme,
    scrollToTop,
    handleScroll,
    reducedMotion,
    headerRotation,
    footerRotation,
  } = useContentPage();

  return (
    <SafeAreaView nativeID={`content-safe-area-${page}`} style={styles.safeArea} edges={[`top`, `left`, `right`]}>
      <PageMetadata page={page} />
      <ScrollView
        ref={scrollRef}
        style={styles.page}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        nativeID={`content-page-${page}`}
        contentContainerStyle={styles.content}
        stickyHeaderIndices={sticky ? [0] : undefined}
      >
        <Animated.View nativeID={`site-header`} style={[styles.header, { backgroundColor: headerColor }]}>
          <View nativeID={`header-inner`} style={[styles.container, styles.headerInner]}>
            <View nativeID={`header-brand-row`} style={styles.brandRow}>
              <Link href={landingLinks.home} asChild>
                <Pressable
                  nativeID={`header-brand`}
                  accessibilityRole={`link`}
                  accessibilityLabel={`Palindrome Lists Home`}
                  style={({ pressed }) => [styles.brand, pressed && styles.pressed]}
                >
                  <Animated.View
                    nativeID={`header-logo-orbit`}
                    style={{ transform: [{ rotate: reducedMotion ? `0deg` : headerRotation }] }}
                  >
                    <HalfTurnLogo id={`header-half-turn-logo`} size={37} />
                  </Animated.View>
                  <Text nativeID={`header-brand-name`} style={styles.brandName}>Palindrome Lists</Text>
                </Pressable>
              </Link>
            </View>
            <ScrollView horizontal nativeID={`site-navigation`} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.navigation}>
              {mainNavigation.filter((item) => item.key !== `signin`).map((item) => (
                <Link key={item.key} href={landingLinks[item.key]} asChild>
                  <Pressable
                    accessibilityRole={`link`}
                    nativeID={`navigation-${item.key}`}
                    accessibilityState={{ selected: item.key === page }}
                    style={({ pressed }) => [styles.navigationLink, pressed && styles.pressed]}
                  >
                    <Icon name={item.icon} size={13} color={palette[item.iconColor]} />
                    <Text nativeID={`navigation-label-${item.key}`} style={[styles.navigationText, item.key === page && styles.activeText]}>
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
                  <Icon
                    size={20}
                    name={theme === `dark` ? `sun` : `moon`}
                    fill={theme === `dark` ? palette.searchInk : `#FFFFFF`}
                    color={theme === `dark` ? palette.searchInk : `#FFFFFF`}
                  />
                </Pressable>
                <Link href={landingLinks.signin} asChild>
                  <Pressable
                    nativeID={`navigation-signin`}
                    accessibilityRole={`link`}
                    accessibilityState={{ selected: page === `signin` }}
                    style={({ pressed }) => [styles.signIn, pressed && styles.pressed]}
                  >
                    <Icon name={`login`} size={13} color={theme === `dark` ? palette.searchInk : palette.lime} />
                    <Text nativeID={`navigation-label-signin`} style={styles.signInText}>Sign in</Text>
                  </Pressable>
                </Link>
              </View>
            </ScrollView>
          </View>
        </Animated.View>
        <View
          style={[styles.container, styles.hero]}
          nativeID={`content-hero-${page}`}
          onLayout={(event) => { heroEnd.current = event.nativeEvent.layout.y + event.nativeEvent.layout.height; }}
        >
          <Link href={landingLinks.home} asChild>
            <Pressable nativeID={`content-home-link-${page}`} accessibilityRole={`link`} style={({ pressed }) => [styles.breadcrumb, pressed && styles.pressed]}>
              <Icon name={`book`} size={12} color={palette.action} />
              <Text nativeID={`content-breadcrumb-label-${page}`} style={styles.breadcrumbText}>Home / {pageLabel}</Text>
            </Pressable>
          </Link>
          <Text nativeID={`content-eyebrow-${page}`} style={styles.eyebrow}>{content.eyebrow.toUpperCase()}</Text>
          <Text nativeID={`content-title-${page}`} accessibilityRole={`header`} style={styles.title}>{content.title}</Text>
          <Text nativeID={`content-description-${page}`} style={styles.description}>{content.description}</Text>
        </View>
        {page === `pricing` && <PricingSection variant={`page`} />}
        {Boolean(content.examples?.length) && (
          <View nativeID={`content-examples-${page}`} style={[styles.container, styles.examples]}>
            <Text nativeID={`content-examples-title-${page}`} accessibilityRole={`header`} style={styles.sectionTitle}>A few to start with.</Text>
            <Text nativeID={`content-examples-copy-${page}`} style={styles.examplesCopy}>Read each one forwards. Then backwards.</Text>
            {hasAlphabetFilter && (
              <AlphabetFilter
                onClear={clearLetters}
                onToggle={toggleLetter}
                selectedLetters={selectedLetters}
                id={`content-alphabet-filter-${page}`}
                resultCount={filteredExamples.length}
                controls={`content-examples-grid-${page}`}
              />
            )}
            <View nativeID={`content-examples-grid-${page}`} style={styles.exampleGrid}>
              {filteredExamples.map((example) => (
                <View key={example.id} nativeID={`content-example-${page}-${example.id}`} style={styles.example}>
                  <View nativeID={`content-example-heading-${page}-${example.id}`} style={styles.exampleHeading}>
                    <Text nativeID={`content-example-title-${page}-${example.id}`} accessibilityRole={`header`} style={styles.exampleTitle}>{example.text}</Text>
                    <Icon name={`repeat`} size={17} color={palette.action} />
                  </View>
                  <Text nativeID={`content-example-count-${page}-${example.id}`} style={styles.exampleCount}>{normalizePalindrome(example.text).length} letters · same both ways</Text>
                  <Text nativeID={`content-example-note-${page}-${example.id}`} style={styles.exampleNote}>{example.note}</Text>
                </View>
              ))}
              {filteredExamples.length === 0 && (
                <Text nativeID={`content-examples-empty-${page}`} style={styles.examplesCopy}>
                  No palindromes start with the selected letter(s). Choose another letter or All Letters.
                </Text>
              )}
            </View>
          </View>
        )}
        <View nativeID={`content-reading-${page}`} style={[styles.container, styles.reading]}>
          {content.sections.map((section, sectionIndex) => (
            <View key={section.id} nativeID={`content-section-${page}-${section.id}`} style={[styles.section, sectionIndex > 0 && styles.sectionSeparated]}>
              <Text nativeID={`content-section-title-${page}-${section.id}`} accessibilityRole={`header`} style={styles.sectionTitle}>{section.title}</Text>
              {section.paragraphs.map((paragraph, index) => (
                <Text key={index} nativeID={`content-paragraph-${page}-${section.id}-${index}`} style={styles.paragraph}>{paragraph}</Text>
              ))}
              {section.bullets?.map((bullet, index) => (
                <View key={index} nativeID={`content-list-item-${page}-${section.id}-${index}`} style={styles.bulletRow}>
                  <Text nativeID={`content-list-marker-${page}-${section.id}-${index}`} style={styles.bulletMarker}>•</Text>
                  <Text nativeID={`content-list-label-${page}-${section.id}-${index}`} style={styles.bulletText}>{bullet}</Text>
                </View>
              ))}
              {section.code && (
                <ScrollView horizontal nativeID={`content-code-${page}-${section.id}`} style={styles.code} contentContainerStyle={styles.codeContent}>
                  <Text selectable nativeID={`content-code-value-${page}-${section.id}`} style={styles.codeText}>{section.code}</Text>
                </ScrollView>
              )}
              {Boolean(section.links?.length) && (
                <View nativeID={`content-links-${page}-${section.id}`} style={styles.links}>
                  {section.links?.map((item, index) => (
                    <Link key={`${item.href}-${index}`} href={item.href as Href} asChild>
                      <Pressable
                        accessibilityRole={`link`}
                        nativeID={`content-link-${page}-${section.id}-${index}`}
                        style={({ pressed }) => [styles.textLink, pressed && styles.pressed]}
                      >
                        <Icon name={item.external ? `external` : `right`} size={13} color={palette.action} />
                        <Text nativeID={`content-link-label-${page}-${section.id}-${index}`} style={styles.linkLabel}>{item.label}</Text>
                      </Pressable>
                    </Link>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
        <View nativeID={`content-related-${page}`} style={[styles.container, styles.related]}>
          <Text nativeID={`content-related-eyebrow-${page}`} style={styles.eyebrow}>KEEP EXPLORING</Text>
          <Text nativeID={`content-related-title-${page}`} accessibilityRole={`header`} style={styles.relatedTitle}>There’s more both ways.</Text>
          <View nativeID={`content-related-navigation-${page}`} style={styles.relatedNavigation}>
            {mainNavigation.filter((item) => [`words`, `names`, `phrases`].includes(item.key) && item.key !== page).map((item, index) => (
              <Link key={item.key} href={landingLinks[item.key]} asChild>
                <Pressable nativeID={`content-related-link-${page}-${item.key}`} accessibilityRole={`link`} style={({ pressed }) => [styles.textLink, pressed && styles.pressed]}>
                  <Icon name={item.icon} size={13} color={index % 2 ? palette.leaf : palette.action} />
                  <Text nativeID={`content-related-label-${page}-${item.key}`} style={styles.linkLabel}>{item.label}</Text>
                </Pressable>
              </Link>
            ))}
          </View>
        </View>
        <View nativeID={`site-footer`} style={[styles.footer, { paddingBottom: 24 + insets.bottom }]}>
          <View nativeID={`footer-inner`} style={styles.container}>
            <Link href={landingLinks.home} asChild>
              <Pressable nativeID={`footer-brand`} accessibilityRole={`link`} style={({ pressed }) => [styles.brand, pressed && styles.pressed]}>
                <Animated.View nativeID={`footer-logo-orbit`} style={{ transform: [{ rotate: reducedMotion ? `0deg` : footerRotation }] }}>
                  <HalfTurnLogo id={`footer-half-turn-logo`} size={28} />
                </Animated.View>
                <Text nativeID={`footer-brand-name`} style={styles.footerBrandName}>Palindrome Lists</Text>
              </Pressable>
            </Link>
            <View nativeID={`footer-navigation`} style={styles.footerNavigation}>
              {footerNavigation.map((item) => (
                <Link key={item.key} href={landingLinks[item.key]} asChild>
                  <Pressable nativeID={`footer-${item.key}`} accessibilityRole={`link`} style={({ pressed }) => [styles.navigationLink, pressed && styles.pressed]}>
                    <Icon name={item.icon} size={12} color={palette[item.iconColor]} />
                    <Text nativeID={`footer-label-${item.key}`} style={styles.navigationText}>{item.label}</Text>
                  </Pressable>
                </Link>
              ))}
            </View>
            <View nativeID={`footer-bottom`} style={styles.footerBottom}>
              <Text nativeID={`copyright`} style={styles.copyright}>© {new Date().getFullYear()} Palindrome Lists.</Text>
              <Link href={`https://piratechs.com/`} asChild>
                <Pressable nativeID={`piratechs-link`} accessibilityRole={`link`} style={({ pressed }) => [styles.piratechsLink, pressed && styles.pressed]}>
                  <Icon name={`external`} size={12} color={palette.action} />
                  <Text nativeID={`piratechs-label`} style={styles.copyright}>Made by Piratechs</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
      <Animated.View
        pointerEvents={beyondHero ? `auto` : `none`}
        accessibilityElementsHidden={!beyondHero}
        importantForAccessibility={beyondHero ? `auto` : `no-hide-descendants`}
        nativeID={`scroll-to-top-container`}
        style={[styles.scrollTop, { bottom: 22 + insets.bottom, opacity: topOpacity }]}
      >
        <Pressable
          onPress={scrollToTop}
          disabled={!beyondHero}
          nativeID={`scroll-to-top`}
          accessibilityRole={`button`}
          accessibilityLabel={`Scroll to Top`}
          style={({ pressed }) => [styles.scrollTopButton, pressed && styles.pressed]}
        >
          <Icon name={`up`} size={20} color={palette.searchInk} />
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
};

const ContentPage = ({ page }: ContentPageProps) => <ContentPageView key={page} page={page} />;

export default ContentPage;
