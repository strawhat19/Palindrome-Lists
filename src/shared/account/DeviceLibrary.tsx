import { createContext, useContext, useEffect, useRef, useState, type PropsWithChildren } from 'react';
import { palindromes } from '../landing/data';

const storageKey = `palindrome-lists.device-library.v1`;
const knownIds = new Set(palindromes.map((entry) => entry.id));
type LocalList = { id: string; name: string; entries: string[] };
type DeviceData = { version: 1; nickname: string; draft: string; favorites: string[]; lists: LocalList[] };
const emptyData = (): DeviceData => ({ version: 1, nickname: ``, draft: ``, favorites: [], lists: [] });
const boundedText = (value: unknown, max: number) => typeof value === `string` ? value.slice(0, max) : ``;
const ids = (value: unknown): string[] => Array.isArray(value) ? [...new Set(value.filter((item): item is string => typeof item === `string` && knownIds.has(item)))].slice(0, 200) : [];
const parseData = (raw: string | null): DeviceData => {
  if (!raw) return emptyData();
  if (raw.length > 1000000) throw new Error(`Stored data is too large`);
  const value: unknown = JSON.parse(raw);
  if (!value || typeof value !== `object` || Array.isArray(value) || !(`version` in value) || value.version !== 1) throw new Error(`Unsupported local data`);
  const data = value as Record<string, unknown>;
  const used = new Set<string>();
  const lists: LocalList[] = [];
  if (Array.isArray(data.lists)) for (const item of data.lists.slice(0, 20)) {
    if (!item || typeof item !== `object` || typeof item.id !== `string` || !/^list-[a-z0-9-]{1,80}$/.test(item.id) || used.has(item.id)) continue;
    const name = boundedText(item.name, 60).trim();
    if (!name) continue;
    used.add(item.id);
    lists.push({ id: item.id, name, entries: ids(item.entries) });
  }
  return { version: 1, nickname: boundedText(data.nickname, 60), draft: boundedText(data.draft, 500), favorites: ids(data.favorites), lists };
};
type DeviceLibraryValue = {
  data: DeviceData;
  ready: boolean;
  status: string;
  update: (change: (current: DeviceData) => DeviceData) => void;
};
const DeviceLibraryContext = createContext<DeviceLibraryValue | null>(null);
export const DeviceLibraryProvider = ({ children }: PropsWithChildren) => {
  const [data, setData] = useState<DeviceData>(emptyData);
  const current = useRef(data);
  const [ready, setReady] = useState(false);
  const writable = useRef(false);
  const [status, setStatus] = useState(`Loading device storage…`);
  useEffect(() => {
    try {
      if (typeof window === `undefined` || !window.localStorage) throw new Error(`Storage unavailable`);
      const loaded = parseData(window.localStorage.getItem(storageKey));
      current.current = loaded;
      setData(loaded);
      writable.current = true;
      setStatus(`Device-only · Saved in this browser, not synced or backed up`);
    } catch {
      setStatus(`Session-only · Device storage is unavailable or invalid. Changes will be lost when this session closes; existing stored data was not overwritten.`);
    }
    setReady(true);
    if (typeof window === `undefined`) return;
    const onStorage = (event: StorageEvent) => {
      if (event.key !== storageKey && event.key !== null) return;
      if (!writable.current) return;
      try {
        const next = parseData(event.newValue);
        current.current = next;
        setData(next);
        setStatus(`Device-only · Updated from another tab in this browser`);
      } catch {
        writable.current = false;
        setStatus(`Session-only · Stored data changed to an unsupported format. Existing data will not be overwritten.`);
      }
    };
    window.addEventListener(`storage`, onStorage);
    return () => window.removeEventListener(`storage`, onStorage);
  }, []);
  const update = (change: (value: DeviceData) => DeviceData) => {
    if (!ready) return;
    const next = parseData(JSON.stringify(change(current.current)));
    current.current = next;
    setData(next);
    if (writable.current) try {
      window.localStorage.setItem(storageKey, JSON.stringify(next));
      setStatus(`Device-only · Saved in this browser, not synced or backed up`);
    } catch {
      writable.current = false;
      setStatus(`Session-only · Saving failed. New changes will be lost when this session closes.`);
    }
  };
  return <DeviceLibraryContext.Provider value={{ data, ready, status, update }}>{children}</DeviceLibraryContext.Provider>;
};
export const useDeviceLibrary = () => {
  const value = useContext(DeviceLibraryContext);
  if (!value) throw new Error(`DeviceLibraryProvider is required`);
  return value;
};
