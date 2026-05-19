export const INITIAL_ASSISTANT_GREETING =
  "Hello! I'm here to help gather a few details about your property for a solar assessment. " +
  "What type of property do you have — detached, semi-detached, terraced, or flat?";

export const QUICK_PROMPTS = [
  { label: "Detached", message: "My property is a detached house." },
  { label: "Semi-detached", message: "My property is semi-detached." },
  { label: "Terraced", message: "My property is terraced." },
  { label: "Flat", message: "My property is a flat." },
  { label: "Start survey", message: "I'd like to start the property survey." },
] as const;
