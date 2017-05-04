import Ressource from './Ressource';
import Account from './Account';

const paramDefaults = {};

const ROLE_ADMIN = 'admin';
const ROLE_VIEWER = 'viewer';
const ROLE_CONTRIBUTOR = 'contributor';

const roles = [ROLE_ADMIN, ROLE_VIEWER, ROLE_CONTRIBUTOR];

const creatableField = ['user', 'role', 'email'];
const modifiableField = ['role'];

export default class EnvironmentAccess extends Ressource {
  constructor(environmentAccess, url) {
    super(url, paramDefaults, { }, environmentAccess, creatableField, modifiableField);
    this.id = '';
    this.user = '';
    this.email = '';
    this.role = '';
    this.project = '';
    this.environment = '';
    this._required = ['role'];
  }

  static get(params, url) {
    const { id, ...queryParams } = params;

    return super.get(`${url}/:id`, { id }, paramDefaults, queryParams);
  }

  static query(params, url) {
    return super.query(url, {}, paramDefaults, params);
  }

  update(access) {
    return super.update(access, this.getLink('#edit'));
  }

  /**
  * @inheritdoc
  */
  checkProperty(property, value) {
    const errors = {};

    if (property === 'role' && roles.indexOf(value) === -1) {
      errors[property] = `Invalid environment role: '${value}'`;
    }
    return errors;
  }
  /**
  * {@inheritdoc}
  */
  getLink(rel, absolute = true) {
    if (rel === '#edit' && !this.hasLink(rel)) {
      return this.getUri(absolute);
    }
    return super.getLink(rel, absolute);
  }
  /**
  * Get the account information for this user.
  *
  * @throws \Exception
  *
  * @return Account
  */
  getAccount() {
    return Account.get({id: this.id}).then(account => {
      if (!account) {
        throw new Error(`Account not found for user: ${this.id}`);
      }
      return account;
    });
  }
}
