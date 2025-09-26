import { get, set, del } from 'idb-keyval';
import { PersistedClient, Persister } from '@tanstack/react-query-persist-client';
import { GIT_RESPONSES_KEY } from './queries/useGitResponses';

export function createIDBPersister(idbValidKey: IDBValidKey = GIT_RESPONSES_KEY): Persister {
  return {
    persistClient: async (client: PersistedClient) => {
      try {
        console.log('Persisting cache to IndexedDB:', client);
        await set(idbValidKey, client);
      } catch (error) {
        console.error('Failed to persist cache:', error);
      }
    },
    restoreClient: async () => {
      try {
        const data = await get<PersistedClient>(idbValidKey);
        console.log('Restored cache from IndexedDB:', data);
        return data;
      } catch (error) {
        console.error('Failed to restore cache:', error);
        return undefined;
      }
    },
    removeClient: async () => {
      try {
        await del(idbValidKey);
        console.log('Removed cache from IndexedDB');
      } catch (error) {
        console.error('Failed to remove cache:', error);
      }
    },
  };
}