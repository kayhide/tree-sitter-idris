const { parens } = require('./util.js')

module.exports = {

  pat_op: $ => choice(
    $._operator,
    $.ticked_operator,
  ),

  pat_at: $ => '@',

  pat_field: $ =>
    seq(
      $._field_name,
      optional(seq(':', $._pat))
    ),

  pat_fields: $ => braces(sep($.comma, $.pat_field)),

  pat_record: $ => field('fields', $.pat_fields),

  pat_parens: $ => parens(
    sep($.tuple_operator, $._pat),
  ),

  pat_list: $ => choice(
    brackets(sep($.comma, $._pat)),
    snoc_brackets(sep($.comma, $._pat)),
  ),

  pat_braces: $ => seq(
    '{',
    sep($.comma, seq($._name, '=', $._pat)), 
    '}',
   ),

  pat_at_braces: $ => seq('@{', $._pat, '}'),

  _apat: $ => choice(
    alias($._name, $.pat_name),
    $.pat_op,
    $.pat_at,
    $.pat_record,
    alias($.literal, $.pat_literal),
    alias($.string, $.pat_string),
    $.wildcard,
    $.unit,
    $.pat_parens,
    $.pat_list,
    $.pat_braces,
    $.pat_at_braces,
    $._pragma_exp,
  ),

  _apats: $ => prec.right(repeat1($._apat)),

  _pat: $ => seq(
    optional($.quantity),
    $._apats,
    optional($._nullary_type_annotation),
  ),
}
