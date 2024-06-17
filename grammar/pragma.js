const { parens } = require('./util.js')

module.exports = {
  // ------------------------------------------------------------------------
  // pragma

  pragma: $ => seq(
    alias($._pragma_entry, $.pragma_name),
    repeat($.pragma_arg),
  ),

  _pragma_entry: $ => seq('%', $._immediate_varid),

  pragma_arg: $ => choice(
    $._varid,
    $._conid,
  ),
}
