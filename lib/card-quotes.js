// A pool of short "welcome back" quotes for the alumni greeting card.
// One is picked at random every time a card is generated.
export const CARD_QUOTES = [
  "Once part of this campus, always part of its story.",
  "The halls remember every step you once took here.",
  "Some places don't just teach you — they stay with you.",
  "You left as a student and returned as an inspiration.",
  "Roots grow deep here; today, you've come home to them.",
  "Every alum carries a piece of this campus forward.",
  "The best chapters of a story are the ones we return to.",
  "Time changes faces, but this place never forgets its own.",
  "You are proof that the journey from here goes far.",
  "This campus is smaller than the world you've gone on to shape.",
  "A degree ends, but belonging to this place never does.",
  "Welcome back to where a lot of your story began.",
  "The corridors are quieter without you, but never forget you.",
  "Once you walked in as a fresher; today you walk in as a legacy.",
  "Distance never really separates you from where you started.",
  "Your success today still traces back to a seat in these classrooms.",
  "Coming back here is just returning to an old, familiar page.",
  "This institution grew a little because you once grew here.",
];

export function getRandomQuote() {
  return CARD_QUOTES[Math.floor(Math.random() * CARD_QUOTES.length)];
}
