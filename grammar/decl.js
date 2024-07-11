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
    'covering',
  ),

  _fun_name: $ => field('name', $._name_op),

  _funrhs: $ => seq(
    choice(':=', '='),
    $._exp,
  ),

  _fun_patterns: $ => prec(1, repeat1($._apat)),

  _funvar: $ => seq(
    field('subject', $._name_op),
    field('patterns', optional(alias($._fun_patterns, $.patterns))),
  ),

  _funop: $ => choice(
      seq(
        field('patterns', alias($._pat, $.patterns)),
        field('subject', choice($.operator, $.tuple_operator)),
        field('patterns', alias($._pat, $.patterns)),
      ),
      seq(
        parens($._funop),
        field('patterns', optional(alias($._fun_patterns, $.patterns))),
      ),
  ),

  _with_res: $ => seq('|', alias($._apats, $.with_pat)),

  _funlhs: $ => seq(
    choice(
      prec.dynamic(1, alias($._funop, $.funop)),
      prec.dynamic(2, alias($._funvar, $.funvar)),
      $.wildcard
    ),
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
    repeat($._with_res),
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
    repeat(
      choice(
        $.visibility,
        $.totality,
        $.quantity,
      )
    ),
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
