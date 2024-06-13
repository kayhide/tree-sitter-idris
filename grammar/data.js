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
    optional($.visibility),
    'data',
    $._simpletype,
    '=',
    sep1('|', seq($._con, repeat($._type))),
  ),

  _decl_data_block: $ => seq(
    optional($.visibility),
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
}
