"use client";

import { ReactNode } from "react";
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import { getQueryClient } from "./queryClient";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createIDBPersister } from "./persisters";

let client: QueryClient | null = null;

export function ReactQueryProvider({ children }: { children: ReactNode }) {
  if (!client) {
    client = getQueryClient();
  }

  const persister = createIDBPersister();

  return (
    <PersistQueryClientProvider
      client={client}
      persistOptions={{
        persister,
        maxAge: 1000 * 60 * 60 * 24,
        buster: "git-responses-v1",
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
