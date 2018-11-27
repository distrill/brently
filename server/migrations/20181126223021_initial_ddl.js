function up(knex) {
  return knex.schema.createTable('plots', (table) => {
    table.increments('id');
    table.string('name', 191);
    table.text('config');

    table.unique('name');
  });
}

function down(knex) {
  return knex.schema.dropTable('plots');
}

module.exports = { up, down };
