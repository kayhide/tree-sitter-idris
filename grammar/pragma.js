const { parens } = require('./util.js')

module.exports = {
  // ------------------------------------------------------------------------
  // pragma

  _pragma: $ => choice(
    prec(1, $.pragma_transform),
    alias($._pragma_general, $.pragma),
  ),

  _pragma_entry: $ => seq('%', $._immediate_loname),

  _pragma_general: $ => seq(
    alias($._pragma_entry, $.pragma_name),
    repeat(choice($.pragma_arg, $.comma)),
  ),

  pragma_default: $ => seq(
    '%default',
    $.totality,
  ),

  pragma_foreign: $ => seq(
    '%foreign',
    repeat1(
      seq(
        optional($._name),
        $.string,
      ),
    ),
  ),

  pragma_transform: $ => seq(
    '%transform',
    $.string,
    $._aexps,
    $.equal,
    $._aexps,
  ),

  pragma_arg: $ => choice(
    $. _q_name_op,
    $.literal,
    $.wildcard,
  ),

  pragma_hint : _ => '%hint',

  pragma_inline: _ => '%inline',

  pragma_tcinline: _ => '%tcinline',

  pragma_extern: _ => '%extern',

  pragma_search: _ => '%search',

  pragma_world: _ => '%World',

  pragma_mkworld: _ => '%MkWorld',
}
