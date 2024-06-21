const { parens, layouted } = require('./util')

module.exports = {
  // ------------------------------------------------------------------------
  // Declarations
  // ------------------------------------------------------------------------

  visibility: _ => choice(
    'private',
    'export',
    seq('public', 'export'),
  ),

  totality: _ => choice(
    'total',
    'partial',
  ),

  _fun_name: $ => field('name', choice($._var, alias($._conid, $.variable))),

  _funrhs: $ => seq(
    choice(':=', '='),
    $._exp,
  ),

  _fun_patterns: $ => prec(1, repeat1($._apat)),

  _funvar: $ => seq(
    choice($._fun_name, parens($._funop)),
    field('patterns', optional(alias($._fun_patterns, $.patterns))),
  ),

  _funop: $ => prec(1, seq(
    field('patterns', alias($._fun_patterns, $.patterns)),
    $.operator,
    field('patterns', alias($._fun_patterns, $.patterns)),
  )),

  _with_res: $ => seq('|', alias($._apat, $.with_pat)),

  _funlhs: $ => seq(
    choice(
      prec.dynamic(3, $._funop),
      prec.dynamic(2, $._funvar),
      $.wildcard
    ),
    repeat($._with_res),
  ),

  with: $ => seq(
    'with',
    sep1('|', $.exp_parens),
    '\n',
    layouted($, $.function),
  ),

  impossible: _ => 'impossible',

  function: $ => seq(
    alias($._funlhs, $.lhs),
    choice(
      alias($._funrhs, $.rhs), 
      $.with, 
      $.impossible
    ),
    optional(seq($.where, $.declarations)),
  ),

  // TODO: I don't see what it has to do with functions.
  // Should be only used in `grammar.js` as a top-level declaration.
  operator_declaration: $ => seq(
    optional($.visibility),
    choice('infixl', 'infixr', 'infix'),
    field('precedence', $.integer),
    sep1($.comma, choice($.operator, $.ticked_operator)),
  ),

  signature: $ => seq(
    optional($.visibility),
    optional($.totality),
    field('name', $._fun_name),
    $._type_annotation,
  ),

  _gendecl: $ => choice(
    $.signature,
    $.operator_declaration,
  ),

  _decl_fun: $ => $.function,

  _decl: $ => choice(
    $._gendecl,
    $._decl_fun,
  ),

  _where_decl: $ => choice(
    $._decl,
    alias($._decl_namespace, $.namespace),
    alias($._decl_data, $.data),
  ),

  declarations: $ => layouted($, $._where_decl),
}
