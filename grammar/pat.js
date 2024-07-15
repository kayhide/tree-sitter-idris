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
    sep($.tuple_operator, $._typed_pat),
  ),

  pat_at_parens: $ => seq('@(', $._pat, ')'),

  pat_list: $ => choice(
    brackets(sep($.comma, $._typed_pat)),
    snoc_brackets(sep($.comma, $._typed_pat)),
  ),

  pat_braces: $ => seq('{', $._name, '=', $._pat, '}'),

  pat_at_braces: $ => seq('@{', $._pat, '}'),

  _apat: $ => choice(
    alias($._name, $.pat_name),
    alias($.operator, $.pat_op),
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

  _apats: $ => repeat1($._apat),

  _pat: $ => prec.left($._apats),

  pat_typed: $ => seq(
    optional($.quantity),
    field('pattern', $._pat),
    $._type_annotation,
  ),

  _typed_pat: $ => prec.right(choice(
    $._pat,
    $.pat_typed,
  )),

}
