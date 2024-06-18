const { parens } = require('./util.js')

module.exports = {
  // ------------------------------------------------------------------------
  // pragma

  pragma: $ => seq(
    alias($._pragma_entry, $.pragma_name),
    repeat(choice($.pragma_arg, $.comma)),
  ),

  _pragma_entry: $ => seq('%', $._immediate_varid),

  pragma_arg: $ => choice(
    $._var,
    $._con,
    $.literal,
    $.wildcard,
  ),

  pragma_inline: _ => '%inline',

  pragma_tcinline: _ => '%tcinline',

  pragma_search: _ => '%search',

  pragma_world: _ => '%World',
}
