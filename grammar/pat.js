const { parens } = require('./util.js')

module.exports = {

  pat_op: $ => choice(
    $._operator,
    $.ticked_operator,
  ),

  pat_field: $ =>
    seq(
      $._field_name,
      optional(seq(':', $._pat))
    ),

  pat_fields: $ => braces(sep($.comma, $.pat_field)),

  pat_record: $ => field('fields', $.pat_fields),

  pat_at_wildcard: _ => '@_',

  pat_parens: $ => parens(
    sep($.tuple_operator, $._pat),
  ),

  pat_at_parens: $ => seq('@', '(', $._pat, ')'),

  pat_list: $ => choice(
    brackets(sep($.comma, $._pat)),
    snoc_brackets(sep($.comma, $._pat)),
  ),

  pat_braces: $ => seq('{', $._name, '=', $._pat, '}'),

  pat_at_braces: $ => seq('@{', $._pat, '}'),

  _apat: $ => choice(
    alias($._name, $.pat_name),
    $.pat_op,
    $.pat_record,
    alias($.literal, $.pat_literal),
    $.wildcard,
    $.unit,
    $.pat_at_wildcard,
    $.pat_parens,
    $.pat_at_parens,
    $.pat_list,
    $.pat_braces,
    $.pat_at_braces,
    $.pragma_mkworld,
  ),

  _apats: $ => prec.right(repeat1($._apat)),

  _pat: $ => seq(
    optional($.quantity),
    $._apats,
    optional($._nullary_type_annotation),
  ),
}
