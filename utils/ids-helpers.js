const checkCommonIdLetters = (idsSelection, componentId) => {
  const idsSelectionLetters = idsSelection.map((id) => {
    return getIdLetters(id);
  })
  return idsSelectionLetters.includes(getIdLetters(componentId));
}

const getIdLetters = (id) => {
  return id.match(/[a-z]/g).join('');
}

module.exports = {
  checkCommonIdLetters,
  getIdLetters
}