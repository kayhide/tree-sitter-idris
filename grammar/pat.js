const { parens } = require('./util.js')

module.exports = {

  pat_field: $ =>
    seq(
      $._field_name,
      optional(seq(':', $._typed_pat))
    ),

  pat_fields: $ => braces(sep($.comma, $.pat_field)),

  pat_record: $ => field('fields', $.pat_fields),

  pat_at_wildcard: _ => '@_',

  pat_parens: $ => parens(
    choice(
      sep($.tuple_operator, $._typed_pat),
      $._aexps,
    ),
  ),

  pat_at_parens: $ => seq(
    '@(', 
    choice(
      $._pat, 
      // $._aexps,
    ),
    ')'),

  pat_list: $ => choice(
    brackets(sep($.comma, $._typed_pat)),
    snoc_brackets(sep($.comma, $._typed_pat)),
  ),

  pat_braces: $ => seq(
    '{', 
    $._name, 
    '=',
    $._lpat,
    '}'
  ),

  pat_at_braces: $ => seq(
    '@{', 
    choice(
      $._pat, 
      // $._aexps,
    ),
    '}'
  ),

  _apat: $ => choice(
    alias($._name, $.pat_name),
    $.pat_record,
    alias($.literal, $.pat_literal),
    alias($.wildcard, $.pat_wildcard),
    $.pat_at_wildcard,
    $.pat_parens,
    $.pat_at_parens,
    $.pat_list,
    $.pat_braces,
    $.pat_at_braces,
    $.pragma_mkworld,
  ),

  /**
   * In patterns, application is only legal if the first element is a con.
   */
  pat_apply: $ => seq($._q_name, repeat1($._apat)),

  _lpat: $ => choice(
    $._apat,
    $.pat_apply,
  ),

  pat_infix: $ => seq($._lpat, $.operator, $._pat),

  /**
   * Without the precs, a conflict is needed.
   */
  _pat: $ => choice(
    prec(2, $.pat_infix),
    prec(1, $._lpat),
  ),

  pat_typed: $ => seq(field('pattern', $._pat), $._type_annotation),

  _typed_pat: $ => choice(
    $._pat,
    $.pat_typed,
  ),

}
