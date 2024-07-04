const { parens, braces } = require('./util.js')

module.exports = {
  // ----- Record -------------------------------------------------------------

  record_name: $ => alias($._q_caname, ''),

  _decl_record: $ => seq(
    optional($.visibility),
    'record',
    field('name', choice($.record_name, parens($.operator))),
    repeat($._tyvar),
    $.where,
    optional($.record_body),
  ),

  record_body: $ => layouted($, $._record_decl),

  _record_decl: $ => choice(
    $._record_constructor,
    alias($._record_field, $.record_field),
  ),

  _record_constructor: $ => seq(
    'constructor',
    field('name', $._caname_op), 
  ),
    
  _record_field: $ => seq(
    sep1($.comma, $._q_loname), $._type_annotation
  ),
  
  // -----------------------------------------------------------------
  // Value-level

  _field_name: $ => alias($.loname, $.field_name),

  _record_field_update: $ => {
    const nested_update =
      braces(sep($.comma,
        alias($._record_field_update, $.record_update)
      ))

    const update_or_nested_update =
      choice(
        seq(choice(':=', '$='), $._exp),
        nested_update
      )

    return seq($._field_name, update_or_nested_update)
  },

  // It is easier to construct a specific set of options here:
  // `_aexp` would be too permissive and bring potential problems
  // such as precedence issues
  _record_update_rhs: $ =>
    choice(
      $.wildcard,
      $.hole,
      $._q_name,
      $.exp_record_access,
      $.exp_parens,
    ),

  record_update: $ =>
    seq(
      braces(sep1($.comma, $._record_field_update)),
      $._record_update_rhs,
    ),
}
