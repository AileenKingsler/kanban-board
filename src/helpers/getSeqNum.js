const getSeqNum = (cards, columnId, destinationIndex) => {
  const destinationColumn = cards.get(columnId);

  if (!destinationColumn) {
    return 0;
  }

  const destinationCard = destinationColumn[destinationIndex];

  if (!destinationCard) {
    return destinationColumn[destinationIndex - 1].seq_num + 1;
  }

  return destinationCard.seq_num;
};

export default getSeqNum;
