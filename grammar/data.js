const { parens } = require('./util.js')

module.exports = {

  // ----- Data ---------------------------------------------------------------

  _data_type_signature: $ =>
    seq(
      'data',
      $._tyconid,
      $._type_annotation
    ),

  decl_data: $ => choice(
    $._decl_data_inline,
    $._decl_data_block,
  ),

  _decl_data_inline: $ => seq(
    repeat(choice('private', 'export', 'public')),
    'data',
    $._simpletype,
    '=',
    sep1('|', seq($._con, repeat($._type))),
  ),

  _decl_data_block: $ => seq(
    repeat(choice('private', 'export', 'public')),
    'data',
    $._tyconid,
    optional(alias($._type_annotation, $.type_signature)),
    $.where,
    optional($.data_body),
  ),

  data_body: $ => layouted($, $._data_decl),

  _data_decl: $ => choice(
    $.constructor_signature,
  ),

  constructor_signature: $ => seq(
    field('name', $._con), 
    alias($._type_annotation, $.type_signature),
  ),
  

  // ----- Newtype ------------------------------------------------------------

  // Using `_atype` here is a bit more loose than necessary since it also
  // includes non-Type kinds as well as holes and wildcards
  newtype_constructor: $ => seq(
    $.constructor,
    $._atype,
  ),

  _newtype_type_signature: $ =>
    seq(
      'newtype',
      $._tyconid,
      $._type_annotation
    ),

  decl_newtype: $ => seq(
    optional(alias($._newtype_type_signature, $.type_signature)),
    'newtype',
    $._simpletype,
    '=',
    $.newtype_constructor,
  ),

}
