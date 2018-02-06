import { expect } from 'chai';
import { describe, it } from 'mocha';

import requiredValidationFunction from '../../../client/utils/requiredValidationFunction';


describe('Client-Utils-requiredValidationFunction', () => {

  it('no error', () => {
    expect(requiredValidationFunction({})('hello')).to.equal(false);
  });

  it('error', () => {
    expect(requiredValidationFunction({})('')).to.equal('required');
    expect(requiredValidationFunction({})()).to.equal('required');
  });


  it('error languageDictionary', () => {
    const languageDictionary = {
      requiredErrorText: 'Required Text'
    };
    expect(requiredValidationFunction(languageDictionary)('')).to.equal('Required Text');
    expect(requiredValidationFunction(languageDictionary)()).to.equal('Required Text');
  });
});