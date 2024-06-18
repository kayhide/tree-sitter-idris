const { parens, sep1 } = require("./util");

module.exports = {

  // ----- Shared -------------------------------------------------------------

  interface_name: $ => alias($._qtyconid, ''),

  constraint: $ => seq($.interface_name, repeat($._type)),

  constraints: $ =>
    choice(
      $.constraint,
      parens(sep1($.comma, $.constraint))
    ),

  // ----- Interface ----------------------------------------------------------

  _decl_interface: $ =>
    seq(
      optional($.visibility),
      'interface',
      $.interface_head,
      optional($.interface_body)
    ),

  interface_head: $ =>
    seq(
      optional(seq($.constraints, $._rcarrow)),
      field('name', $.interface_name),
      repeat($._tyvar),
      optional($.determining_params)
    ),

  determining_params: $ => seq('|', sep1($.comma, $.type_variable)),

  interface_body: $ => where($, $._interface_decl),

  _interface_decl: $ => choice(
    $._record_constructor,
    $._decl,
  ),

  _interface_constructor: $ => seq(
    'constructor',
    field('name', $.constructor), 
  ),
    

  // ----- Implementation -----------------------------------------------------

  _idecl: $ => choice(
    $.function,
    $.signature,
  ),

  implementation_head: $ =>
    seq(
      optional($.visibility),
      optional(seq($.constraints, $._rcarrow)),
      $.interface_name,
      repeat($._type),
      optional($.using),
    ),

  using: $ => seq('using', $.implementation_name),

  _implementation_name: $ =>
    brackets(
      alias(choice($._varid, $._conid), $.implementation_name),
    ),

  implementation_name: $ => choice($._varid, $._conid), 

  implementation_body: $ => where($, $._decl),

  _decl_implementation: $ =>
    seq(
      optional($._implementation_name),
      $.implementation_head,
      optional($.implementation_body),
    ),
}
