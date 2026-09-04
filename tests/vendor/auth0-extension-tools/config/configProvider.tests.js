import { expect } from 'chai';

import { ArgumentError } from '../../../../vendor/auth0-extension-tools/errors';
import extensionTools from '../../../../vendor/auth0-extension-tools';
import configProvider from '../../../../vendor/auth0-extension-tools/config/configProvider';

describe('vendor/auth0-extension-tools/configProvider', () => {
  it('extension-tools should expose the configProvider', () => {
    expect(extensionTools.configProvider).to.equal(configProvider);
  });

  it('configProvider#fromWebtaskContext should require a context', () => {
    try {
      configProvider.fromWebtaskContext();
    } catch (e) {
      expect(e).to.be.ok;
      expect(e).to.be.an.instanceof(ArgumentError);
    }
  });

  it('configProvider#fromWebtaskContext should create provider from context', () => {
    process.env.ENV1 = 'envValue';
    process.env.Setting = 123;

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

    expect(provider).to.be.ok;
    expect(provider('ENV1')).to.equal('envValue');
    expect(provider('HOSTING_ENV')).to.equal('webtask');
    expect(provider('a')).to.equal('value1');
    expect(provider('user')).to.equal('usr');
    expect(provider('Setting')).to.equal(789);
  });

  it('configProvider#fromWebtaskContext should return default RTA', () => {
    process.env.ENV1 = 'envValue';
    process.env.Setting = 123;

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

    expect(provider).to.be.ok;
    expect(provider('AUTH0_RTA')).to.equal('auth0.auth0.com');
  });

  it('configProvider#fromWebtaskContext should allow overwriting the RTA', () => {
    process.env.ENV1 = 'envValue';
    process.env.Setting = 123;

    const provider = configProvider.fromWebtaskContext({
      params: {
        a: 'value1',
        b: 'value2',
        Setting: 456
      },
      secrets: {
        user: 'usr',
        password: 'pwd',
        Setting: 789,
        AUTH0_RTA: 'login.myappliance.local'
      }
    });

    expect(provider).to.be.ok;
    expect(provider('AUTH0_RTA')).to.equal('login.myappliance.local');
  });
});
