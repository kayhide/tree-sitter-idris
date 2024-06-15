const {parens} = require('./util.js')

module.exports = {
  // ------------------------------------------------------------------------
  // import
  // ------------------------------------------------------------------------

  _decl_import: $ => seq(
    'import',
    optional('public'),
    field('module', $.qualified_module),
    field(
      'import_rename',
      optional(seq('as', choice($._modid, qualified($, $._modid))))
    ),
  ),
}
