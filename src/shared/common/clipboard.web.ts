export const copyText = async (value: string): Promise<void> => {
  if (typeof navigator === `undefined` || !navigator.clipboard?.writeText) {
    throw new Error(`Clipboard Unavailable`);
  }

  await navigator.clipboard.writeText(value);
};
