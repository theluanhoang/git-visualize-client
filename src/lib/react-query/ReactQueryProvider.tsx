"use client";

import { ReactNode } from "react";
import {
  QueryClientProvider,
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { getQueryClient } from "./queryClient";
import { PersistedQueryClientProvider } from "./PersistedQueryClientProvider";

let client: QueryClient | null = null;

export function ReactQueryProvider({ children }: { children: ReactNode }) {
  if (!client) {
    client = getQueryClient();
  }

  const dehydratedState = dehydrate(client);

  return (
    <QueryClientProvider client={client}>
      <HydrationBoundary state={dehydratedState}>
        {/* <PersistedQueryClientProvider> */}
          {children}
        {/* </PersistedQueryClientProvider> */}
      </HydrationBoundary>
    </QueryClientProvider>
  );
}
