const sql = require('../sql').users;

const cs = {}; // Reusable ColumnSet objects.

/*
This repository mixes hard-coded and dynamic SQL, primarily to show a diverse example of using both.
 */

// Statically initializing ColumnSet objects:

function createColumnsets(pgp) {
  // create all ColumnSet objects only once:
  if (!cs.insert) {
    // Type TableName is useful when schema isn't default "public" ,
    // otherwise you can just pass in a string for the table name.
    const table = new pgp.helpers.TableName({ table: 'users', schema: 'public' });

    cs.insert = new pgp.helpers.ColumnSet(['name'], { table });
    cs.update = cs.insert.extend(['?id']);
  }
  return cs;
}

class UsersRepository {
  constructor(db, pgp) {
    this.db = db;
    this.pgp = pgp;

    // set-up all ColumnSet objects, if needed:
    createColumnsets(pgp);
  }

  // Creates the table;
  async create() {
    // const drop = await this.drop();
    const create = await this.db.none(sql.create);
    return this.init();
  }

  // Initializes the table with some user records, and return their id-s;
  async init() {
    const count = await this.db.one('SELECT count(*) FROM users', [], a => +a.count);
    if (count > 0) {
      return null
    }
    return this.db.result(sql.init, [], result => result.rows);
  }

  // // Drops the table;
  // drop() {
  //   return this.db.none(sql.drop);
  // }
  //
  // // Removes all records from the table;
  // empty() {
  //   return this.db.none(sql.empty);
  // }

  // Adds a new user, and returns the new object;
  add(values) {
    return this.db.one(sql.add, {
      name: values.name,
      message: values.message,
      tacos: values.tacos,
    });
  }

  // Tries to delete a user by id, and returns the number of records deleted;
  remove(id) {
    return this.db.result('DELETE FROM users WHERE id = $1', +id, r => r.rowCount);
  }

  // Tries to find a user from id;
  findById(id) {
    return this.db.oneOrNone('SELECT * FROM users WHERE id = $1', +id);
  }

  // Tries to find a user from name;
  findByName(name) {
    return this.db.oneOrNone('SELECT * FROM users WHERE name = $1', name);
  }

  // Returns all user records;
  all() {
    return this.db.any('SELECT * FROM users');
  }

  // Returns the total number of users;
  total() {
    return this.db.one('SELECT count(*) FROM users', [], a => +a.count);
  }
}

module.exports = UsersRepository;
