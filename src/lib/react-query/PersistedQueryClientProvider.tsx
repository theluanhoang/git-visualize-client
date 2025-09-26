import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { getQueryClient } from "./queryClient";
import { createIDBPersister } from "./persisters";

// Component wrapper để sử dụng persisted cache
export function PersistedQueryClientProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  const persister = createIDBPersister();

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: 1000 * 60 * 60 * 24, // Cache lưu trong 24 giờ
        buster: 'git-responses-v1', // Chuỗi để invalidate cache nếu cần
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}