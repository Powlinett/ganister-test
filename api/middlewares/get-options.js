const fs = require('fs');

const { getNestedComponents, deleteUselessKeys } = require('../utils/product-helpers');

const getOptions = (req, res, next) => {
  const components = req.product.components;
  const flattenComponentsArray = [];
  getFlattenComponentsArray(components, flattenComponentsArray);
  req.options = buildOptionsObject(flattenComponentsArray);
  next();
}

const buildOptionsObject = (components) => {
  components.forEach((component) => {
    const nestedComponents = getNestedComponents(component);
    if (nestedComponents) {
      const name = `${component.name}-${component.id}`;
      component[name] = nestedComponents;
      buildOptionsObject(nestedComponents);
      delete component.name;
      delete component.id;
    }
    const uselessKeys = ['rules', 'option', 'variants', 'components'];
    deleteUselessKeys(component, uselessKeys);
  });
  return components;
};

const getFlattenComponentsArray = (components, flattenArray) => {
  components.forEach((component) => {
    const nestedComponents = getNestedComponents(component);
    if (nestedComponents) {
      getFlattenComponentsArray(nestedComponents, flattenArray);
    }
    if (component.variants || component.option) {
      console.log(component)
      flattenArray.push(component)
    }
  })
  return flattenArray;
}

module.exports = getOptions;
