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
 * Creates a deranged mapping where no participant is assigned to themselves and
 * avoids any forbidden drawer->recipient pairs.
 */
export function buildAssignments(
  ids: string[],
  forbiddenPairs: Array<[string, string]> = []
): AssignmentPair[] {
  if (ids.length < 2) {
    throw new Error("Need at least two participants for Secret Santa.");
  }

  const forbidden = new Set(forbiddenPairs.map(([a, b]) => `${a}|${b}`));

  const drawers = shuffle(ids);
  const recipients = [...ids];
  const result: AssignmentPair[] = [];
  const used = new Set<string>();

  const backtrack = (index: number): boolean => {
    if (index === drawers.length) return true;
    const drawer = drawers[index];
    const options = shuffle(
      recipients.filter(
        (r) => !used.has(r) && r !== drawer && !forbidden.has(`${drawer}|${r}`)
      )
    );

    for (const candidate of options) {
      result.push({ drawerId: drawer, recipientId: candidate });
      used.add(candidate);
      if (backtrack(index + 1)) {
        return true;
      }
      used.delete(candidate);
      result.pop();
    }
    return false;
  };

  if (!backtrack(0)) {
    throw new Error("Unable to create assignments without breaking restrictions.");
  }

  return result;
}
