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

  // ----- Quantifiers --------------------------------------------------------

  _forall_kw: _ => choice('forall', '∀'),

  _quantifiers: $ => seq($._forall_kw, sep1($.comma, $._tyvar), '.'),

  // This could be simply `$._quantifiers` but we also handle
  // the edge case of `f :: forall a. forall b. Unit`
  forall: $ => prec.left(repeat1($._quantifiers)),

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

  // Parens or tuples
  type_parens: $ => parens(sep($.comma, $._type)),

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
      alias($._q_name, $.type_name),
      $.operator,
      $.type_parens,
      $.type_list,
      $.type_braces,
      $.pragma_world,
      $.exp_implicit_arg,
    ),

  _type: $ => seq(
    optional($.forall),
    repeat1($._atype),
  ),

  _simpletype: $ =>
    seq(field('name', $._caname), repeat($._loname)),
}
