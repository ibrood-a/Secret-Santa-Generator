export type AssignmentPair = {
  drawerId: string;
  recipientId: string;
};

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Creates a deranged mapping where no participant is assigned to themselves.
 */
export function buildAssignments(ids: string[]): AssignmentPair[] {
  if (ids.length < 2) {
    throw new Error("Need at least two participants for Secret Santa.");
  }

  const shuffled = shuffle(ids);

  for (let i = 0; i < ids.length - 1; i += 1) {
    if (shuffled[i] === ids[i]) {
      [shuffled[i], shuffled[i + 1]] = [shuffled[i + 1], shuffled[i]];
    }
  }

  const lastIndex = ids.length - 1;
  if (shuffled[lastIndex] === ids[lastIndex]) {
    [shuffled[lastIndex], shuffled[lastIndex - 1]] = [
      shuffled[lastIndex - 1],
      shuffled[lastIndex]
    ];
  }

  if (shuffled.some((recipientId, idx) => recipientId === ids[idx])) {
    throw new Error("Unable to create assignments without self-pairing.");
  }

  return ids.map((drawerId, idx) => ({
    drawerId,
    recipientId: shuffled[idx]
  }));
}
