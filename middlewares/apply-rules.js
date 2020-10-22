const { checkCommonIdLetters } = require('../utils/ids-helpers.js');
const { getNestedComponents, deleteRulesProperty } = require('../utils/product-helpers');
const {
  checkIfContainsWantedIds,
  checkIfcontainsWantedIdsLetters,
  getIdsInRule,
  getForbiddenId,
  selectIdsToKeep
} = require('../utils/rules-helpers');

const applyProductRules = (req, res, next) => {
  const idsSelection = req.body.parts;
  const product = req.product;
  const selectedRules = [];
  selectRules(product, idsSelection, selectedRules);
  const forbiddenIds = getForbiddenIds(selectedRules, idsSelection);
  deleteForbiddenComponents(product.components, idsSelection, forbiddenIds);
  deleteRulesProperty(product);
  req.BOM = product;
  next();
}

const selectRules = (product, idsSelection, rulesArray) => {
  if (product.rules) {
    product.rules.forEach((rule) => {
      const withWantedIds = checkIfContainsWantedIds(rule, idsSelection);
      const containsWantedIdsLetters = checkIfcontainsWantedIdsLetters(rule, idsSelection);
      
      if (rule.includes('NOT') && withWantedIds) {
        rulesArray.push(rule);
      } else if((rule.substring(0,2) === '([') && containsWantedIdsLetters) {
        rulesArray.push(rule);
      }
    });
  }
  const nestedComponents = getNestedComponents(product);
  if (nestedComponents) {
    nestedComponents.forEach((nestedComponent) => {
      selectRules(nestedComponent, idsSelection, rulesArray);
    });
  }
}

const getForbiddenIds = (selectedRules, idsSelection) => {
  const forbiddenIds = [];
  const idsToKeep = selectIdsToKeep(selectedRules, idsSelection);
  
  selectedRules.forEach((rule) => {
    const idsInRule = getIdsInRule(rule);
    
    if (rule.includes('NOT')) {
      const forbiddenId = getForbiddenId(idsInRule, idsSelection);
      forbiddenIds.push(forbiddenId);
    } else if ((rule.substring(0,2) === '([')) {
      const containsWantedIds = checkIfContainsWantedIds(rule, idsSelection);
      
      idsInRule.forEach((id) => {
        const isAnIdToKeep = idsToKeep.includes(id);
        
        if (!containsWantedIds && !isAnIdToKeep) {
          forbiddenIds.push(id);
        }
      })
    }
  })
  return forbiddenIds;
}

const deleteForbiddenComponents = (components, idsSelection, forbiddenIds) => {
  let i = components.length - 1;
  while (i >= 0) {
    const component = components[i];
    const nestedParts = getNestedComponents(component);

    const isForbidden = forbiddenIds.includes(component.id);
    const isUserSelection = idsSelection.includes(component.id);
    const hasSameIdLetters = checkCommonIdLetters(idsSelection, component.id);

    if (nestedParts) {
      deleteForbiddenComponents(nestedParts, idsSelection, forbiddenIds);
    } else if (isForbidden) {
      components.splice(i, 1);
    } else if (!isUserSelection && hasSameIdLetters) {
      components.splice(i, 1);
    }
    i -= 1;
  }
}

module.exports = applyProductRules;