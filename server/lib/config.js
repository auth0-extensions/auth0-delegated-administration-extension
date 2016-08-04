let provider = null;

module.exports = (key) => {
  if (!provider) {
    throw new Error('A configuration provider has not been set');
  }

  return provider(key);
};

module.exports.setProvider = (providerFunction) => {
  provider = providerFunction;
};
