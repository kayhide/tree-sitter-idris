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
    optional(
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
  type_parens: $ => parens(seq(optional($.forall), optional(sep($.comma, $._type)))),

  // Implicit arguments
  type_braces: $ => braces(seq(
    sep1($.comma, $.implicit_arg), 
    $._type_annotation),
  ),

  // This is the parser to be used in signatures for functions, classes, types, newtypes and data.
  _type_annotation: $ =>
    seq(
      $._colon,
      optional($.forall),
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
      $.type_parens,
      $.type_braces,
      $.pragma_world,
    ),

  /**
   * Type application, as in `Either e (Int, Text)` or `TypeRep @Int`.
   */
   type_apply: $ => seq($._atype, repeat1($._atype)),

  /**
   * The point of this `choice` is to get a node for type application only if there is more than one atype present.
   */
  _btype: $ =>
    seq(
      optional($.forall),
      choice(
        $._atype,
        $.type_apply
      ),
    ),

  type_infix: $ =>
    seq(
      $._btype,
      $.operator,
      $._type
    ),

  _type: $ =>
    seq(
      optional($.forall),
      choice($.type_infix, $._btype),
    ),

  _simpletype: $ =>
    seq(field('name', $._caname), repeat($._loname)),
}
