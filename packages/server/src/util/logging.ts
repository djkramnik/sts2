import { Card } from "../domain/entities/card";

export const logCards = (cards: Card[]): string => {
  return cards.map((card) => String(card)).join("\n");
};
