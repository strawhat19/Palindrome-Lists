import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import createStyles from '../AccountPage/styles.native';
import { useTheme } from '../../shared/themeContext/useTheme';
import { reportDefinitions, reportingMessage, type ReportKey } from '../../shared/account/reporting';

const AccountReports = ({ compact = false }: { compact?: boolean }) => {
  const { palette } = useTheme();
  const styles = createStyles(palette);
  const [selected, setSelected] = useState<ReportKey>(`traffic`);
  const reports: ReportKey[] = compact ? [`traffic`, `runtime`] : [selected];
  return <View nativeID='account-reporting' style={{ gap: 18 }}>
    {!compact && <View style={styles.nav}>{(Object.keys(reportDefinitions) as ReportKey[]).map((key) => <Pressable key={key} accessibilityRole='button' accessibilityState={{ selected: selected === key }} onPress={() => setSelected(key)} style={styles.button}><Text style={styles.buttonText}>{reportDefinitions[key].title}</Text></Pressable>)}</View>}
    {reports.map((key) => <View key={key} nativeID={`account-report-${key}`} style={styles.card}>
      <Text accessibilityRole='header' style={styles.subtitle}>{reportDefinitions[key].title}</Text>
      <Text style={styles.muted}>Report layout only · Not connected</Text>
      <View style={styles.nav}>{reportDefinitions[key].tabs.map((tab) => <Pressable key={tab} disabled accessibilityRole='button' accessibilityState={{ disabled: true }} style={styles.button}><Text style={styles.muted}>{tab}</Text></Pressable>)}</View>
      <Text style={styles.muted}>30 Days · Chart / List · Filters unavailable</Text>
      {reportDefinitions[key].metrics.map((metric) => <View key={metric}><Text style={styles.text}>{metric}: —</Text><Text style={styles.muted}>Not connected</Text></View>)}
      <Text style={styles.text}>{reportingMessage}</Text><Text style={styles.muted}>Source: unavailable · Last refreshed: never</Text>
      <View style={styles.nav}>{[`Refresh`, `Export JSON`].map((label) => <Pressable key={label} disabled accessibilityRole='button' accessibilityState={{ disabled: true }} style={styles.button}><Text style={styles.muted}>{label}</Text></Pressable>)}</View>
    </View>)}
  </View>;
};
export default AccountReports;
