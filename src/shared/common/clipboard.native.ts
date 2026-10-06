import { setStringAsync } from 'expo-clipboard';

export const copyText = async (value: string): Promise<void> => {
  const copied = await setStringAsync(value);
  if (!copied) throw new Error(`Clipboard Unavailable`);
};
