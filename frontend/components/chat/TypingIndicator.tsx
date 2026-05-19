export function TypingIndicator() {
  return (
    <div className="flex justify-start animate-fade-in">
      <div className="surface-elevated flex items-center gap-1.5 rounded-2xl rounded-bl-md px-4 py-3">
        <span className="h-2 w-2 rounded-full bg-[var(--text-muted)] animate-pulse-dot [animation-delay:0ms]" />
        <span className="h-2 w-2 rounded-full bg-[var(--text-muted)] animate-pulse-dot [animation-delay:200ms]" />
        <span className="h-2 w-2 rounded-full bg-[var(--text-muted)] animate-pulse-dot [animation-delay:400ms]" />
      </div>
    </div>
  );
}
