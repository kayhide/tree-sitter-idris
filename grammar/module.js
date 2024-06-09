const {parens} = require('./util.js')

module.exports = {
  // ------------------------------------------------------------------------
  // module
  // ------------------------------------------------------------------------

  _modid: $ => alias($.constructor, $.module),

  _qualifying_module: $ => repeat1(seq($._modid, $._dot)),

  qualified_module: $ => choice($._modid, qualified($, $._modid)),

  _decl_module: $ => seq(
    'module',
    field('name', $.qualified_module),
  ),

  _decl_namespace: $ => seq(
    'namespace',
    field('name', $.qualified_module),
    optional(alias($._top_declarations, $.namespace_body)),
  ),

  _decl_parameters: $ => seq(
    'parameters',
    parens(sep1(
      $.comma, 
      seq(field('name', $._var), $._type_annotation),
    )),
    optional(alias($._top_declarations, $.parameters_body)),
  ),

  _decl_mutual: $ => seq(
    'mutual',
    optional(alias($._top_declarations, $.mutual_body)),
  ),

  _top_declarations: $ => layouted($, $._topdecl),
}
