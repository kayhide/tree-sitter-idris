const { parens, sep1 } = require("./util");

module.exports = {

  // ----- Shared -------------------------------------------------------------

  interface_name: $ => $._qtyconid,

  // Technically wrong as it doesn't exclude row types
  constraint: $ => seq($.interface_name, repeat($._type)),

  constraints: $ =>
    choice(
      $.constraint,
      parens(sep1($.comma, $.constraint))
    ),

  // ----- Interface ----------------------------------------------------------

  fundep: $ =>
    seq(
      repeat1($.type_variable),
      $._arrow,
      repeat1($.type_variable)
    ),

  fundeps: $ => seq('|', sep1($.comma, $.fundep)),

  interface_head: $ =>
    seq(
      optional(seq($.constraints, $._rcarrow)),
      $.interface_name,
      repeat($._tyvar),
      optional($.fundeps)
    ),

  interface_body: $ => where($, $._decl),

  interface_declaration: $ =>
    seq(
      repeat(choice('private', 'export', 'public')),
      'interface',
      $.interface_head,
      optional($.interface_body)
    ),

  // ----- Implementation -----------------------------------------------------

  _idecl: $ => choice(
    $.function,
    $.signature,
  ),

  implementation_head: $ =>
    seq(
      optional(seq($.constraints, $._rcarrow)),
      $.interface_name,
      repeat($._type)
    ),

  _implementation_name: $ =>
    brackets(
      alias($._varid, $.implementation_name),
    ),

  implementation_body: $ => where($, $._decl),

  interface_implementation: $ =>
    seq(
      optional($._implementation_name),
      $.implementation_head,
      $.implementation_body,
    ),

}
