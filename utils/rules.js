const getRule = (string) => {
  const ruleArray = string.split(' ');
  if (ruleArray[0] === 'NOT') {
    console.log('forbidden options', ruleArray);
  } else if (ruleArray[1] === 'AND') {
    console.log('select options', ruleArray);
  }
}

const forcedSelection = () => {

};

const availableOptions = () => {

};

module.exports = getRule;