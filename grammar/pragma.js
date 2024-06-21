const { parens } = require('./util.js')

module.exports = {
  // ------------------------------------------------------------------------
  // pragma

  _pragma: $ => choice(
    prec(1, $.pragma_transform),
    alias($._pragma_general, $.pragma),
  ),

  _pragma_entry: $ => seq('%', $._immediate_varid),

  _pragma_general: $ => seq(
    alias($._pragma_entry, $.pragma_name),
    repeat(choice($.pragma_arg, $.comma)),
  ),

  pragma_transform: $ => seq(
    '%transform',
    $.literal,
    $._qvar,
    repeat($.exp_implicit_arg),
    '=',
    $._qvar,
  ),

  pragma_arg: $ => choice(
    $._qvar,
    $._con,
    $.literal,
    $.wildcard,
  ),

  pragma_inline: _ => '%inline',

  pragma_tcinline: _ => '%tcinline',

  pragma_extern: _ => '%extern',

  pragma_search: _ => '%search',

  pragma_world: _ => '%World',

  pragma_mkworld: _ => '%MkWorld',
}
