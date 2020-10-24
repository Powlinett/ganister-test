const { getIdLetters } = require('./ids-helpers');

const checkIfContainsWantedIds = (rule, idsSelection) => {
  return idsSelection.some((idSelected) => {
    return rule.includes(idSelected);
  });
}

const getIdsInRule = (rule) => {
  return rule.match(/[a-z]{2,3}[0-9]{3}/g);
}

const getForbiddenId = (idsInRule, idsSelection) => {
  return idsInRule.find((id) => {
    return !idsSelection.includes(id)
  });
}

const selectIdsToKeep = (selectedRules, idsSelection) => {
  const idsToKeep = [];

  selectedRules.forEach((rule) => {
    const idsInRule = getIdsInRule(rule);

    if ((rule.substring(0,2) === '([')) {
      const containsWantedId = checkIfContainsWantedIds(rule, idsSelection);

      if (containsWantedId) {
        idsInRule.forEach((id) => {
          if (rule.includes(id)) {
            idsToKeep.push(id);
          }
        })
      }
    }
  });
  return idsToKeep;
}

const checkIfcontainsWantedIdsLetters = (rule, idsSelection) => {
    return idsSelection.some((idSelected) => {
      const idLetters = getIdLetters(idSelected);
      return rule.includes(idLetters);
  })
}

module.exports = {
  checkIfContainsWantedIds,
  getIdsInRule,
  getForbiddenId,
  selectIdsToKeep,
  checkIfcontainsWantedIdsLetters
};