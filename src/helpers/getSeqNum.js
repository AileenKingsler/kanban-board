export const getSeqNum = (
  cards,
  destinationColumnCardIds,
  destinationIndex
) => {
  if (!destinationColumnCardIds.length) {
    return 0;
  }

  const destinationCardId = destinationColumnCardIds[destinationIndex];

  if (!destinationCardId) {
    const destinationPrevCardId =
      destinationColumnCardIds[destinationIndex - 1];

    return cards[destinationPrevCardId].seq_num + 1;
  }

  return cards[destinationCardId].seq_num;
};
