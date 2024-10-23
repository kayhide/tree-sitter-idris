const { parens } = require('./util.js')

module.exports = {
  // ------------------------------------------------------------------------
  // import
  // ------------------------------------------------------------------------

  _decl_import: $ => seq(
    'import',
    optional('public'),
    field('module', $._q_module),
    field(
      'import_rename',
      optional(seq('as', $._q_module))
    ),
  ),
}
