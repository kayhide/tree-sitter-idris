const {parens} = require('./util.js')

module.exports = {
  // ------------------------------------------------------------------------
  // module
  // ------------------------------------------------------------------------

  _qualifying_module: $ => repeat1(seq(
    field('module_name', $.caname),
    $._dot
  )),

  _q_module: $ => $._q_caname,

  _decl_module: $ => seq(
    'module',
    field('name', $._q_module),
  ),

  _decl_namespace: $ => seq(
    'namespace',
    field('name', $._q_module),
    optional(alias($._top_declarations, $.namespace_body)),
  ),

  _decl_parameters: $ => seq(
    choice(
      'parameters',
      'using',
    ),
    repeat1(choice(
      $.type_parens,
      $.type_braces
    )),
    optional(alias($._top_declarations, $.parameters_body)),
  ),

  _decl_mutual: $ => seq(
    'mutual',
    optional(alias($._top_declarations, $.mutual_body)),
  ),

  _top_declarations: $ => layouted($, $._topdecl),
}
