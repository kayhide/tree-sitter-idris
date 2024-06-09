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

  _cdecl: $ => choice($._gendecl, $.function,),

  fundep: $ =>
    seq(
      repeat1($.type_variable),
      $._arrow,
      repeat1($.type_variable)
    ),

  fundeps: $ => seq('|', sep1($.comma, $.fundep)),

  interface_body: $ => where($, $._cdecl),

  _interface_kind_declaration: $ =>
    seq(
      'interface',
      alias($._tyconid, $.interface_name),
      $._type_annotation
    ),

  interface_head: $ =>
    seq(
      optional(seq($.constraints, $._lcarrow)),
      $.interface_name,
      repeat($._tyvar),
      optional($.fundeps)
    ),

  interface_declaration: $ =>
    seq(
      repeat(choice('private', 'export', 'public')),
      optional(alias($._interface_kind_declaration, $.kind_declaration)),
      'interface',
      $.interface_head,
      optional($.interface_body)
    ),

  // ----- Instance -----------------------------------------------------------

  _idecl: $ => choice(
    $.function,
    $.signature,
  ),

  instance_head: $ =>
    seq(
      optional(seq($.constraints, $._rcarrow)),
      $.interface_name,
      repeat($._type)
    ),

  _instance_name: $ =>
    seq(
      alias($._varid, $.instance_name),
      $._colon2
    ),

  interface_instance: $ =>
    seq(
      optional('else'),
      'instance',
      optional($._instance_name),
      $.instance_head,
      optional(where($, $._idecl))
    ),

}
