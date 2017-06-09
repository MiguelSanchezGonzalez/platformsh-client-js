/* global beforeEach, afterEach*/

import { assert } from 'chai';
import fetchMock from 'fetch-mock';

import { getConfig } from '../src/config';
import Client from '../src';

describe('Client', () => {
  let client;
  const { account_url, authentication_url, api_url } = getConfig();

  beforeEach(function() {
    fetchMock.mock(`${authentication_url}/oauth2/token`, {'access_token': 'test'});
    client = new Client();
  });

  afterEach(function() {
    fetchMock.restore();
  });

  it('Get current Account', done => {
    fetchMock.mock(`${account_url}/platform/me`, {
      id: 1,
      name: 'test',
      projects: [
        {
          id: 'ffzefzef',
          name: 'greatProject',
          endpoint: 'http://test.com/api/projects/ffzefzef'
        }
      ]
    });
    client.getAccountInfo().then(me => {
      assert.equal(me.name, 'test');
      done();
    });
  });

  it('Get project', done => {
    fetchMock.mock(`${api_url}/projects/ffzefzef3`, {
      id: 'ffzefzef1',
      title: 'greatProject',
      endpoint: 'http://test.com/api/projects/ffzefzef1'
    });
    client.getProject('ffzefzef3').then(project => {
      assert.equal(project.title, 'greatProject');
      assert.equal(project.constructor.name, 'Project');
      done();
    });
  });

  it('Get ssh keys', done => {
    fetchMock.mock(`${account_url}/platform/me`, {
      id: 1,
      name: 'test',
      'ssh_keys': [{
        changed: '2017-03-13T17:38:49+01:00'
      }]
    });
    client.getSshKeys().then(sshkeys => {
      assert.equal(sshkeys.length, 1);
      assert.equal(sshkeys[0].constructor.name, 'SshKey');
      done();
    });
  });

  it('Get ssh key', done => {
    fetchMock.mock(`${account_url}/ssh_keys/theId`, {
      changed: '2017-03-13T17:38:49+01:00'
    });
    client.getSshKey({ id: 'theId' }).then(sshkey => {
      assert.equal(sshkey.changed, '2017-03-13T17:38:49+01:00');
      assert.equal(sshkey.constructor.name, 'SshKey');
      done();
    });
  });

  it('Add a bad ssh key', done => {
    fetchMock.mock(`${account_url}/ssh_keys`, {
      changed: '2017-03-13T17:38:49+01:00'
    }, { method: 'POST'});
    client.addSshKey('valueofsshkey', 'titleofsshkey').catch(err => {
      assert.equal(err.value, 'The SSH key is invalid');
      done();
    });
  });

  it('Add a ssh key', done => {
    fetchMock.mock(`${account_url}/ssh_keys`, {
      changed: '2017-03-13T17:38:49+01:00'
    }, { method: 'POST'});
    const validSshKey = 'ssh-rsa MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCMsT3DdVcyLyrr4nOH2gCd3xvXNAZEDxnHQDFzFRel9tVPnWWkz176NK0tYw2SY6SUOAe/2552BuY1s5PV/HiVwxhpompzZ/xxYHLf+mvN/aCnONKUqPsioYhoD2FtTG4WKIBsNv9S5ZCk8YwvJy6kiABq//W9NnSfP58DXTw8wQIDAQAB';// eslint-disable-line max-len

    client.addSshKey(validSshKey, 'titleofsshkey').then(result => {
      assert.equal(result.constructor.name, 'Result');
      done();
    });
  });

  it('Clean request', () => {
    const cleanedReq = client.cleanRequest({
      test: 'ok',
      testNullValue: null
    });

    assert.equal(cleanedReq.testNullValue, undefined);
    assert.equal(cleanedReq.test, 'ok');
  });

  it('Create subscription', done => {
    fetchMock.mock(`${account_url}/subscriptions`, {
      'project_region': 'region'
    }, { method: 'POST'});
    const activationCallback = { uri: 'http://www.google.fr'};

    client.createSubscription('region', 'development', 'title', 'storage', 'environments', activationCallback)
      .then(result => {
        assert.equal(result.constructor.name, 'Result');
        done();
      });
  });

  it('Get subscription', done => {
    fetchMock.mock(`${account_url}/subscriptions/1`, {
      'project_region': 'region'
    });
    client.getSubscription({id: '1'})
      .then(subscription => {
        assert.equal(subscription.project_region, 'region');
        assert.equal(subscription.constructor.name, 'Subscription');
        done();
      });
  });

  it('Get subscription estimate', done => {
    fetchMock.mock(`${account_url}/estimate?plan=plan&storage=storage&environments=environments&user_licenses=users`, {
      key: 'value'
    });
    client.getSubscriptionEstimate('plan', 'storage', 'environments', 'users')
      .then(estimate => {
        assert.equal(estimate.key, 'value');
        done();
      });
  });
});
