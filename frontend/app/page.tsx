import { ChatWindow } from "@/components/chat/ChatWindow";

export default function HomePage() {
  return (
    <main className="flex h-dvh flex-col overflow-hidden bg-[var(--bg-base)]">
      <ChatWindow />
    </main>
  );
}
