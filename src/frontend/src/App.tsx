import { useActor } from "@caffeineai/core-infrastructure";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, createContext, lazy, useCallback, useContext } from "react";
import Layout from "./Layout";
import { createActor } from "./backend";
import { useChatStore } from "./stores/chatStore";

const ChatPage = lazy(() => import("./pages/ChatPage"));

interface AppContextValue {
  onClearChat: () => void;
}

export const AppContext = createContext<AppContextValue>({
  onClearChat: () => {},
});

export function useAppContext() {
  return useContext(AppContext);
}

function RootLayout() {
  const { actor } = useActor(createActor);
  const clearMessages = useChatStore((s) => s.clearMessages);

  const handleClearChat = useCallback(async () => {
    if (!actor) return;
    await clearMessages(actor);
  }, [actor, clearMessages]);

  return (
    <AppContext.Provider value={{ onClearChat: handleClearChat }}>
      <Layout onClearChat={handleClearChat}>
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-full">
              <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </Layout>
    </AppContext.Provider>
  );
}

const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: ChatPage,
});

const routeTree = rootRoute.addChildren([indexRoute]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
