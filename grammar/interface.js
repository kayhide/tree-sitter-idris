const { parens, bracket, sep1 } = require("./util");

module.exports = {

  // ----- Shared -------------------------------------------------------------

  interface_name: $ => alias($._q_caname, ''),

  constraint: $ => choice(
    seq($.interface_name, repeat($._type)),
    $.annotated_type_variable,
  ),

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
      repeat(seq($.constraints, $._rcarrow)),
      field('name', $.interface_name),
      repeat($._tyvar),
      optional($.determining_params)
    ),

  determining_params: $ => seq('|', sep1($.comma, $.loname)),

  interface_body: $ => where($, $._interface_decl),

  _interface_decl: $ => choice(
    $._record_constructor,
    $._decl,
  ),

  _interface_constructor: $ => seq(
    'constructor',
    field('name', $.caname), 
  ),
    

  // ----- Implementation -----------------------------------------------------

  _idecl: $ => choice(
    $.function,
    $.signature,
  ),

  implementation_head: $ =>
    seq(
      optional($.visibility),
      optional(brackets($.implementation_name)),
      repeat(seq($.constraints, $._rcarrow)),
      field('subject', $.interface_name),
      repeat($._type),
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
