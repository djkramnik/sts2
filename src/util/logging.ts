import { Card } from "../domain/entities/card";

export const logCards = (cards: Card[]): string => {
  return cards.map(c => String(c)).join('\n')
}