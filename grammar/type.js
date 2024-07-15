const { parens, qualified } = require('./util.js')

module.exports = {

  // --------------------------------------------------------------------------
  // Type variables

  annotated_type_variable: $ =>
    parens(seq(
      optional($.quantity),
      $._type_variables,
      $._type_annotation
    )),

  _type_variables: $ => prec.left(sep1(
    alias($.comma, ''), 
    alias($._loname, $.type_variable)
  )),

  _tyvar: $ =>
    choice(
      $._type_variables,
      $.annotated_type_variable,
    ),

  // ----- Operators arrows ---------------------------------------------------

  type_op: $ => choice(
    $._operator,
    $.ticked_operator,
    '=',
  ),

  arrow_separator: $ => choice($._arrow, $._rcarrow),

  // ----- Quantifiers --------------------------------------------------------

  _quantifiers: $ => seq($._forall, sep1($.comma, $._tyvar), '.'),

  // ----- Misc ---------------------------------------------------------------

  quantity: _ => choice('0', '1'),

  auto: _ => 'auto',

  default: $ => seq(
    'default',
    $._aexp,
  ),

  implicit_arg: $ => seq(
    repeat(
      choice( 
        $.quantity,
        $.auto,
        $.default,
      ),
    ),
    alias($._q_name, $.type_name),
  ),

  // ----- Aggregation --------------------------------------------------------

  type_parens: $ => parens(
    sep($.comma, $._type),
    optional($._type_annotation),
  ),

  type_list: $ => choice(
    brackets(sep($.comma, $._type)),
    snoc_brackets(sep($.comma, $._type)),
  ),

  // Implicit arguments
  type_braces: $ => braces(
    seq(
      sep1($.comma, $.implicit_arg), 
      optional($._type_annotation),
    ),
  ),

  // This is the parser to be used in signatures for functions, classes, types, newtypes and data.
  _type_annotation: $ =>
    seq(
      $._colon,
      $._type
    ),

  _fun_signature: $ =>
    seq(
      field('name', $._loname),
      $._type_annotation
    ),

  _atype: $ =>
    choice(
      $.hole,
      $.wildcard,
      $.literal,
      alias($._q_name_op, $.type_name),
      $.type_op,
      $.type_parens,
      $.type_list,
      $.type_braces,
      $.pragma_world,
      $.exp_braces,
      $.exp_let_in,
    ),

  _type: $ => sep1(
    $.arrow_separator,
    seq(
      optional($._quantifiers),
      repeat1($._atype),
    ),
  ),

  _simpletype: $ =>
    seq(field('name', $._caname), repeat($._loname)),
}
