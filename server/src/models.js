const {
  snakeCase, camelCase, pick, mapKeys, first,
} = require('lodash');
const { knex } = require('./lib');

const DUPLICATE_KEY_ERR_CODE = 1062;

function snakeKeys(entity) {
  return mapKeys(entity, (_, key) => snakeCase(key));
}

function camelKeys(entity) {
  return mapKeys(entity, (_, key) => camelCase(key));
}

class DuplicateKeyError extends Error {
  constructor(entity, err) {
    super(`Entity already exists - ${JSON.stringify(entity)}`);
    this.status = 400;
    this.originError = err;
  }
}

class InvalidRemoveParamsError extends Error {
  constructor() {
    super('You must specify some where condition for this function');
    this.status = 400;
  }
}

class TooManyRecordsError extends Error {
  constructor(records) {
    super(`Too many records returned - ${JSON.stringify(records)}`);
    this.status = 400;
  }
}

function handleError(err, entity) {
  switch (err.errno) {
    case DUPLICATE_KEY_ERR_CODE:
      return Promise.reject(new DuplicateKeyError(entity, err));
    default:
      return Promise.reject(err);
  }
}

/**
 * Database expects snake case keys. Everywhere else expects camel case keys.
 * The only functions that should touch snake case keys are fetchAll, create, update, remove
 */
class BaseModel {
  constructor(table, { upsertConflictKeys = [], safeQueryParams = [], connection = knex } = {}) {
    this.table = table;
    this.upsertConflictKeys = upsertConflictKeys;
    this.safeQueryParams = safeQueryParams;
    this.connection = connection;
  }

  get baseQuery() {
    return this.connection(this.table);
  }

  static snakeKeys(entity) {
    return snakeKeys(entity);
  }

  static camelKeys(entity) {
    return camelKeys(entity);
  }

  static handleError(err, entity) {
    return handleError(err, entity);
  }

  upsert(entity) {
    return this.create(entity).catch(DuplicateKeyError, () => {
      const where = pick(entity, this.upsertConflictKeys);
      return this.update(where, entity);
    });
  }

  fetchOne(where) {
    return this.fetchAll(where).then((records) => {
      if (records.length > 1) {
        return Promise.reject(new TooManyRecordsError(records));
      }
      return first(records);
    });
  }

  // transform keys here
  fetchAll(where) {
    return this.baseQuery
      .where(snakeKeys(where))
      .map(camelKeys)
      .catch(err => handleError(err, where));
  }

  // transform keys here
  update(where, newValues) {
    const entity = Object.assign({}, where, newValues);
    let query = this.baseQuery.update(snakeKeys(newValues));
    if (where) query = query.where(snakeKeys(where));
    return query.catch(err => handleError(err, entity));
  }

  // transform keys here
  create(entity) {
    return this.baseQuery.insert(snakeKeys(entity)).catch(err => handleError(err, entity));
  }

  // transform keys here
  remove(where) {
    if (!where) return Promise.reject(new InvalidRemoveParamsError());
    return this.baseQuery
      .where(snakeKeys(where))
      .del()
      .catch(err => handleError(err, where));
  }
}

class Plot extends BaseModel {
  constructor() {
    const table = 'plots';
    const upsertConflictKeys = ['name'];
    super(table, { upsertConflictKeys });
  }
}

module.exports = { Plot };
