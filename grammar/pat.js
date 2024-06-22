const { parens } = require('./util.js')

module.exports = {

  pat_field: $ =>
    seq(
      $._field_name,
      optional(seq(':', $._typed_pat))
    ),

  pat_fields: $ => braces(sep($.comma, $.pat_field)),

  pat_record: $ => field('fields', $.pat_fields),

  pat_tuple: $ => parens(sep($.tuple_operator, $._typed_pat)),

  pat_list: $ => choice(
    brackets(sep($.comma, $._typed_pat)),
    snoc_brackets(sep($.comma, $._typed_pat)),
  ),

  pat_at_braces: $ => seq('@{', $.pat_apply, '}'),

  _apat: $ => choice(
    alias($._name, $.pat_name),
    $.pat_record,
    alias($.literal, $.pat_literal),
    alias($.wildcard, $.pat_wildcard),
    $.pat_tuple,
    $.pat_list,
    $.pat_at_braces,
    $.pragma_mkworld,
  ),

  pat_negation: $ => seq('-', $._apat),

  /**
   * In patterns, application is only legal if the first element is a con.
   */
  pat_apply: $ => seq($._q_caname, repeat1($._apat)),

  _lpat: $ => choice(
    $._apat,
    $.pat_negation,
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
