const { parens, qualified } = require('./util.js')

module.exports = {

  arrow_separator: $ => choice($._arrow, $._rcarrow),

  quantity: $ => alias($.integer, ''),

  auto: _ => 'auto',

  default: $ => seq('default', $._aexp),

  type_parens: $ => parens($._type_parens),

  _type_parens: $ => choice(
    seq(
      optional($.quantity),
      sep1($.comma, $._aexp),
      $._type_annotation,
    ),
    sep1($.comma, $._type),
  ),

  type_braces: $ => braces(
    seq(
      sep1($.comma, $.implicit_arg), 
      optional($._type_annotation),
    ),
  ),

  implicit_arg: $ => seq(
    repeat(
      choice( 
        $.quantity,
        $.auto,
        $.default,
      ),
    ),
    $._q_name,
  ),

  _quantifiers: $ => seq($.forall, sep1($.comma, $._loname), '.'),

  _type_annotation: $ => seq($.colon, $._type),

  _nullary_type_annotation: $ => seq($.colon, $._aexps),

  _type: $ => sep1(
    $.arrow_separator,
    seq(
      optional($._quantifiers),
      $._aexps,
    ),
  ),
}
