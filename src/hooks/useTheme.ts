import { useColorScheme } from '@/src/hooks/use-color-scheme';
import { Colors } from '@/src/styles/theme';
import { createStyles } from '@/src/styles/globalStyles';

export function useTheme() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const styles = createStyles(colors);
  return { colors, styles };
}
