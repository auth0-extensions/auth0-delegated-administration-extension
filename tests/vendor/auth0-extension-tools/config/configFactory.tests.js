import { expect } from 'chai';

import extensionTools from '../../../../vendor/auth0-extension-tools';
import configFactory from '../../../../vendor/auth0-extension-tools/config/configFactory';
import configProvider from '../../../../vendor/auth0-extension-tools/config/configProvider';

describe('vendor/auth0-extension-tools/configFactory', () => {
  it('extension-tools should expose the configFactory', () => {
    expect(extensionTools.config).to.equal(configFactory);
  });

  it('configFactory should wrap provider', () => {
    const provider = configProvider.fromWebtaskContext({
      params: {
        a: 'value1',
        b: 'value2',
        Setting: 456
      },
      secrets: {
        user: 'usr',
        password: 'pwd',
        Setting: 789
      }
    });

    const config = configFactory();
    config.setProvider(provider);

    expect(config).to.be.ok;
    expect(config('a')).to.equal('value1');
    expect(config('user')).to.equal('usr');
    expect(config('Setting')).to.equal(789);
  });

  it('configFactory#setValue should allow getting custom values', () => {
    const provider = configProvider.fromWebtaskContext({
      params: {
        a: 'value1',
        b: 'value2',
        Setting: 456
      },
      secrets: {
        user: 'usr',
        password: 'pwd',
        Setting: 789
      }
    });

    const config = configFactory();
    config.setProvider(provider);
    config.setValue('foo', 'bar');

    expect(config).to.be.ok;
    expect(config('foo')).to.equal('bar');
    expect(config('a')).to.equal('value1');
    expect(config('user')).to.equal('usr');
    expect(config('Setting')).to.equal(789);
  });

  it('configFactory should throw error if provider not set', () => {
    try {
      const config = configFactory();
      config('a');
    } catch (e) {
      expect(e).to.be.ok;
      expect(e.message).to.equal('A configuration provider has not been set');
    }
  });
});
