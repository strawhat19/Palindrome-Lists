import { useMemo } from 'react';
import { Link } from 'expo-router';
import { Text, View, Pressable, useWindowDimensions } from 'react-native';
import Icon from '../Icon';
import createStyles from './styles.native';
import type { PricingSectionProps } from './types';
import { landingLinks } from '../../shared/routes';
import { useTheme } from '../../shared/themeContext/useTheme';
import { pricingNotice, pricingPlans } from '../../shared/pricing/plans';

const PricingSection = ({ variant = `landing` }: PricingSectionProps) => {
  const { palette } = useTheme();
  const { width } = useWindowDimensions();
  const styles = useMemo(() => createStyles(palette), [palette]);
  const columns = width >= 1100 ? 4 : width >= 650 ? 2 : 1;
  const columnWidth = columns === 4 ? `25%` : columns === 2 ? `50%` : `100%`;
  const sectionId = `pricing-${variant}`;
  const planColors = [palette.muted, palette.action, palette.leaf, palette.accent];
  const tabColors = [palette.line, palette.pink, palette.lime, palette.pink];

  return (
    <View
      nativeID={sectionId}
      style={[styles.section, variant === `page` && styles.pageSection]}
    >
      <View nativeID={`${sectionId}-inner`} style={styles.container}>
        {variant === `landing` && (
          <View nativeID={`${sectionId}-heading`} style={styles.heading}>
            <Text nativeID={`${sectionId}-eyebrow`} style={styles.eyebrow}>
              PLANS & POSSIBILITIES
            </Text>
            <Text
              style={styles.title}
              accessibilityRole={`header`}
              nativeID={`${sectionId}-title`}
            >
              A little more wordplay.
            </Text>
            <Text nativeID={`${sectionId}-description`} style={styles.description}>
              Explore for free. Keep your favorites. Make room for more.
            </Text>
          </View>
        )}
        <View nativeID={`${sectionId}-table`} style={styles.table}>
          {pricingPlans.map((plan, index) => {
            const planId = `${sectionId}-${plan.id}`;
            const color = planColors[index] ?? palette.action;
            const isFree = plan.id === `free`;

            return (
              <View
                key={plan.id}
                nativeID={planId}
                style={[
                  styles.plan,
                  { width: columnWidth },
                  plan.highlighted && styles.highlightedPlan,
                  (index + 1) % columns === 0 && styles.lastColumn,
                  index >= pricingPlans.length - columns && styles.lastRow,
                ]}
              >
                <View
                  nativeID={`${planId}-tab`}
                  style={[styles.folderTab, { backgroundColor: tabColors[index] }]}
                />
                <Text nativeID={`${planId}-audience`} style={styles.audience}>
                  {plan.audience}
                </Text>
                <View nativeID={`${planId}-mark`} style={styles.markRow}>
                  <Icon size={31} color={color} name={plan.icon} />
                  {plan.highlighted && (
                    <Text nativeID={`${planId}-badge`} style={styles.badge}>
                      More wordplay
                    </Text>
                  )}
                </View>
                <Text
                  accessibilityRole={`header`}
                  nativeID={`${planId}-name`}
                  style={[styles.planName, { color }]}
                >
                  {plan.name}
                </Text>
                <Text nativeID={`${planId}-summary`} style={styles.summary}>
                  {plan.summary}
                </Text>
                <View nativeID={`${planId}-price-row`} style={styles.priceRow}>
                  <Text nativeID={`${planId}-price`} style={styles.price}>
                    {plan.price}
                  </Text>
                  <Text nativeID={`${planId}-period`} style={styles.period}>
                    {plan.period}
                  </Text>
                </View>
                <Text nativeID={`${planId}-detail`} style={styles.detail}>
                  {plan.detail}
                </Text>
                <View nativeID={`${planId}-features`} style={styles.features}>
                  {plan.features.map((feature, featureIndex) => (
                    <View
                      key={feature}
                      style={styles.feature}
                      nativeID={`${planId}-feature-${featureIndex}`}
                    >
                      <Icon size={15} color={color} name={`check`} />
                      <Text
                        style={styles.featureLabel}
                        nativeID={`${planId}-feature-label-${featureIndex}`}
                      >
                        {feature}
                      </Text>
                    </View>
                  ))}
                </View>
                <Link href={isFree ? landingLinks.home : landingLinks.contact} asChild>
                  <Pressable
                    accessibilityRole={`link`}
                    nativeID={`${planId}-action`}
                    style={({ pressed }) => [
                      styles.action,
                      plan.highlighted && styles.highlightedAction,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Icon
                      size={15}
                      name={isFree ? `book` : `mail`}
                      color={plan.highlighted ? palette.searchInk : palette.action}
                    />
                    <Text
                      nativeID={`${planId}-action-label`}
                      style={[styles.actionLabel, plan.highlighted && styles.highlightedActionLabel]}
                    >
                      {isFree ? `Explore free` : `Ask about ${plan.name}`}
                    </Text>
                  </Pressable>
                </Link>
                <View nativeID={`${planId}-footer`} style={styles.planFooter}>
                  <Text nativeID={`${planId}-number`} style={styles.number}>
                    {`${String(index + 1).padStart(2, `0`)} / ${String(pricingPlans.length).padStart(2, `0`)}`}
                  </Text>
                  <Text nativeID={`${planId}-status`} style={styles.status}>
                    {isFree ? `Open to everyone` : `Coming later`}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
        <View nativeID={`${sectionId}-note`} style={styles.note}>
          <Icon size={15} name={`info`} color={palette.muted} />
          <Text nativeID={`${sectionId}-note-label`} style={styles.noteLabel}>
            {pricingNotice}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default PricingSection;
