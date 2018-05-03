class ValidationFunctionInstance {
  constructor(languageDictionary) {
    this.languageDictionary = languageDictionary;
  }

  requiredValidationFunction(value) {
    const languageDictionary = this.languageDictionary || {};
    const error = languageDictionary.requiredErrorText || 'required';
    return !value || value === '' ? error : false;
  };
}


export default (languageDictionary) => {
  const instance = new ValidationFunctionInstance(languageDictionary);
  return instance.requiredValidationFunction.bind(instance);
}