const getNestedComponents = (product) => {
  return product.components || product.variants;
}

const deleteRulesProperty = (product) => {
  if (product.rules) {
    delete product.rules;
  }
  const nestedComponents = getNestedComponents(product);

  if (nestedComponents) {
    nestedComponents.forEach((component) => {
      deleteRulesProperty(component)
    })
  }
}

const deleteUselessKeys = (component, uselessKeys) => {
  uselessKeys.forEach((key) => {
    delete component[key];
  });
};

module.exports = {
  getNestedComponents,
  deleteRulesProperty,
  deleteUselessKeys
}