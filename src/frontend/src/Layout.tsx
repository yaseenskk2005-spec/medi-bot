import { Activity, Moon, Shield, Sun, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "./components/ui/button";
import { useTheme } from "./hooks/useTheme";

interface LayoutProps {
  children: ReactNode;
  onClearChat?: () => void;
}

function MediBotLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-primary/20 border border-primary/30">
        <Activity
          className="w-5 h-5 text-primary-foreground"
          aria-hidden="true"
        />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-secondary border-2 border-primary" />
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-display text-xl font-semibold text-primary-foreground tracking-tight">
          Medi Bot
        </span>
        <span className="text-[10px] font-mono text-primary-foreground/60 tracking-widest uppercase">
          Medical AI Assistant
        </span>
      </div>
    </div>
  );
}

function DisclaimerBanner() {
  return (
    <div
      role="note"
      aria-label="Medical disclaimer"
      data-ocid="disclaimer_banner"
      className="flex items-start gap-3 px-4 py-2.5 bg-accent/5 border-l-4 border-accent text-[11px] text-foreground/70 shrink-0"
    >
      <Shield
        className="w-3.5 h-3.5 mt-0.5 shrink-0 text-accent"
        aria-hidden="true"
      />
      <p className="font-body leading-snug">
        <strong className="text-accent font-semibold">
          Medical Disclaimer:
        </strong>{" "}
        Medi Bot provides general health information only. It is not a
        substitute for professional medical advice, diagnosis, or treatment.
        Always consult a qualified healthcare provider for medical decisions.
      </p>
    </div>
  );
}

export default function Layout({
  children,
  onClearChat: _onClearChat,
}: LayoutProps) {
  const { resolvedTheme, toggleTheme } = useTheme();

  function handleClearClick() {
    // Dispatch event to ChatPage to show modal first
    window.dispatchEvent(new CustomEvent("medibot:open-clear-modal"));
  }

  return (
    <div className="flex flex-col h-dvh min-h-0 bg-background">
      {/* Header */}
      <header
        className="shrink-0 flex items-center justify-between px-4 md:px-6 h-16 bg-primary border-b border-primary/20 shadow-elevated z-20"
        data-ocid="header"
      >
        <MediBotLogo />

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Clear chat history"
            data-ocid="clear_chat_button"
            onClick={handleClearClick}
            className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary/20 transition-smooth"
          >
            <Trash2 className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
            data-ocid="theme_toggle"
            onClick={toggleTheme}
            className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary/20 transition-smooth"
          >
            {resolvedTheme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>
        </div>
      </header>

      {/* Disclaimer Banner */}
      <DisclaimerBanner />

      {/* Main Scrollable Chat Area */}
      <main
        className="flex-1 min-h-0 overflow-y-auto bg-background"
        data-ocid="chat_area"
      >
        {children}
      </main>

      {/* Branding Footer */}
      <footer className="flex shrink-0 items-center justify-center px-4 py-1.5 bg-card border-t border-border text-[10px] text-muted-foreground font-body">
        © {new Date().getFullYear()} Medi Bot · Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
            typeof window !== "undefined" ? window.location.hostname : "",
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-1 text-primary hover:underline transition-smooth"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
