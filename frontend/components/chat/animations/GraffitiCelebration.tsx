"use client";

const CONFETTI = Array.from({ length: 28 }, (_, index) => ({
  id: index,
  left: `${(index * 17 + 5) % 100}%`,
  delay: `${(index % 7) * 0.35}s`,
  duration: `${3.5 + (index % 5) * 0.6}s`,
  color: ["#facc15", "#3b82f6", "#a855f7", "#14b8a6", "#f472b6"][index % 5],
  size: 6 + (index % 4) * 3,
}));

export function GraffitiCelebration() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[101] overflow-hidden"
      aria-hidden
    >
      {CONFETTI.map((piece) => (
        <span
          key={piece.id}
          className="animate-confetti-fall absolute top-0 block rounded-sm opacity-80"
          style={{
            left: piece.left,
            width: piece.size,
            height: piece.size * 1.4,
            backgroundColor: piece.color,
            animationDelay: piece.delay,
            ["--duration" as string]: piece.duration,
          }}
        />
      ))}
      <span
        className="graffiti-text animate-graffiti-drift absolute left-[8%] top-[12%] text-4xl text-yellow-400 sm:text-5xl"
        style={{ ["--rotate" as string]: "-12deg" }}
      >
        Done!
      </span>
      <span
        className="graffiti-text animate-graffiti-drift absolute right-[10%] top-[18%] text-3xl text-blue-400 sm:text-4xl"
        style={{ ["--rotate" as string]: "8deg", animationDelay: "0.5s" }}
      >
        Nice!
      </span>
      <span
        className="graffiti-text animate-graffiti-drift absolute bottom-[22%] left-[14%] text-2xl text-purple-500 sm:text-3xl"
        style={{ ["--rotate" as string]: "-6deg", animationDelay: "1s" }}
      >
        JSON
      </span>
      <svg
        className="animate-graffiti-spin absolute right-[6%] top-[8%] h-10 w-10 text-yellow-300 opacity-90"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7-6.3-4.6L5.7 21l2.3-7-6-4.6h7.6z" />
      </svg>
      <div className="absolute -left-8 top-1/3 h-24 w-24 rotate-12 rounded-full bg-yellow-400/30 blur-2xl" />
      <div className="absolute -right-6 bottom-1/4 h-28 w-28 -rotate-6 rounded-full bg-blue-500/25 blur-2xl" />
    </div>
  );
}
