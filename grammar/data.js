const { parens } = require('./util.js')

module.exports = {

  // ----- Data ---------------------------------------------------------------

  data_name: $ => alias($._q_caname_op, ''),

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
    sep1('|', seq($._caname_op, repeat($._type))),
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
    $.search_options,
    $.external,
    $.constructor_signature,
  ),

  search_options: $ => brackets(
    choice(
      seq('search', repeat1($._name)),
      alias('noHints', $.no_hints),
    ),
  ),

  external: _ => brackets('external'),

  constructor_signature: $ => seq(
    field('name', $._caname_op), 
    alias($._type_annotation, $.type_signature),
  ),
}
