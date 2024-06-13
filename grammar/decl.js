const { layouted } = require('./util')

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
    'partial',
  ),

  _funpat: $ => seq(
    field('pattern', $._typed_pat),
    $._funrhs,
  ),

  _fun_name: $ => field('name', choice($._var, alias($._conid, $.variable))),

  guard_equation: $ => seq($.guards, '=', $._exp),

  _fun_guards: $ => repeat1($.guard_equation),

  _funrhs: $ => seq(
    choice(
      seq(choice(':=', '='), field('rhs', $._exp)),
      $._fun_guards,
    ),
    optional(seq($.where, $.declarations)),
  ),

  _fun_patterns: $ => repeat1($._apat),

  _funvar: $ => seq(
    $._fun_name,
    field('patterns', optional(alias($._fun_patterns, $.patterns))),
  ),

  _funlhs: $ => prec.dynamic(2, $._funvar),

  function: $ => seq(
    $._funlhs,
    $._funrhs,
  ),

  // TODO: I don't see what it has to do with functions.
  // Should be only used in `grammar.js` as a top-level declaration.
  operator_declaration: $ => seq(
    optional($.visibility),
    choice('infixl', 'infixr', 'infix'),
    field('precedence', $.integer),
    $.operator
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

  /**
    * In the reference, `apat` is a choice in `lpat`, but this creates a conflict:
    * `decl` allows the lhs to be a `pat`, as in:
    * let Just 5 = prog
    * let a = prog
    * Since patterns can be `variable`s, the `funpat` lhs of the second example cannot be distinguished from a `funvar`.
    * The precedences here and in `_funlhs` solve this.
    */
  _decl_fun: $ => choice(
    $.function,
    prec.dynamic(1, alias($._funpat, $.function)),
  ),

  _decl: $ => choice(
    $._gendecl,
    $._decl_fun,
  ),

  _where_decl: $ => choice(
    $._decl,
    alias($._decl_namespace, $.namespace),
    alias($.decl_data, $.data),
  ),

  declarations: $ => layouted($, $._where_decl),
}
