const { parens, bracket, sep1 } = require("./util");

module.exports = {

  // ----- Shared -------------------------------------------------------------

  interface_name: $ => $._q_caname,

  constraints: $ => repeat1(
    seq($._atypes, $.arrow_separator)
  ),

  // ----- Interface ----------------------------------------------------------

  _decl_interface: $ =>
    seq(
      optional($.visibility),
      'interface',
      $.interface_head,
      optional($.interface_body)
    ),

  interface_head: $ => seq(
    optional($.constraints),
    field('name', $.interface_name),
    optional($._atypes),
    optional($.determining_params)
  ),

  determining_params: $ => seq('|', sep1($.comma, $.loname)),

  interface_body: $ => where($, $._interface_decl),

  _interface_decl: $ => choice(
    $._constructor,
    $._decl,
  ),
    

  // ----- Implementation -----------------------------------------------------

  _idecl: $ => choice(
    $.function,
    $.signature,
  ),

  implementation_head: $ => seq(
    optional($.visibility),
    optional('implementation'),
    optional(brackets($.implementation_name)),
    optional($.constraints),
    field('subject', $.interface_name),
    optional($._atypes),
    optional($.using),
  ),

  using: $ => seq('using', repeat1($.implementation_name)),

  implementation_name: $ => choice(
    $._qualified_implementation_name,
    $._implementation_name,
  ),

  _implementation_name: $ => $._name, 

  _qualified_implementation_name: $ => qualified($, $._implementation_name),

  implementation_body: $ => where($, $._decl),

  _decl_implementation: $ =>
    seq(
      $.implementation_head,
      optional($.implementation_body),
    ),
}
