const { parens } = require('./util.js')

module.exports = {

  // ----- Data ---------------------------------------------------------------

  data_name: $ => alias($._qtyconid, ''),

  _decl_data: $ => choice(
    $._decl_data_inline,
    $._decl_data_block,
  ),

  _decl_data_inline: $ => seq(
    optional($.visibility),
    'data',
    field('name', $.data_name),
    repeat($._tyvar),
    '=',
    sep1('|', seq($._con, repeat($._type))),
  ),

  _decl_data_block: $ => seq(
    optional($.visibility),
    'data',
    field('name', $.data_name),
    optional(alias($._type_annotation, $.type_signature)),
    $.where,
    optional($.data_body),
  ),

  data_body: $ => layouted($, $._data_decl),

  _data_decl: $ => choice(
    $.search_option,
    $.constructor_signature,
  ),

  search_option: $ => brackets(
    choice(
      seq('search', $.type_variable),
      alias('noHints', $.no_hints),
    ),
  ),

  constructor_signature: $ => seq(
    field('name', $._con), 
    alias($._type_annotation, $.type_signature),
  ),
}
