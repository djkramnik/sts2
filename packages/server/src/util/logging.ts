import { Card } from "shared";

export const logCards = (cards: Card[]): string => {
  return cards.map((card) => String(card)).join("\n");
};
