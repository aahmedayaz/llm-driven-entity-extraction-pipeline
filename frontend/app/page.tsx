import { ChatWindow } from "@/components/chat/ChatWindow";

export default function HomePage() {
  return (
    <main className="flex min-h-dvh flex-col overflow-x-hidden overflow-y-auto bg-[var(--bg-base)]">
      <ChatWindow />
    </main>
  );
}
