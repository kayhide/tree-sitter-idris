const { parens, varid_pattern } = require('./util.js')

module.exports = {
  // ------------------------------------------------------------------------
  // Identifiers
  // ------------------------------------------------------------------------

  // https://github.com/purescript/documentation/blob/09859e0d53d2b08ee7e63686a083c1a45423005f/language/Syntax.md#function-and-value-names
  // https://github.com/natefaubion/purescript-language-cst-parser/blob/bf5623e08e1f43f923d4ff3c29cafbda25128768/src/PureScript/CST/Lexer.purs#L500
  _varid: _ => varid_pattern,
  _immediate_varid: _ => token.immediate(varid_pattern),
  variable: $ => $._varid,
  _immediate_variable: $ => alias($._immediate_varid, $.variable),
  qualified_variable: $ => qualified($, $.variable),
  _qvarid: $ => choice($.qualified_variable, $.variable),

  // `_varsym` comes from the scanner.
  // operator: $ => $._varsym,
  // Scanner doesn't let us use -> <- => <= and their unicode counterparts,
  // which complicates the grammar, so just using regex here.
  // Look-around isn't allowed, so this is slightly modified.
  // https://github.com/natefaubion/purescript-language-cst-parser/blob/bf5623e08e1f43f923d4ff3c29cafbda25128768/src/PureScript/CST/Lexer.purs#L503
  _operator: _ => /(?:[:!#$%&*+./<=>?@\\^|~-]|\p{S})+/,
  operator: $ => choice($._operator, '-'),
  qualified_operator: $ => qualified($, parens($._operator)),

  // Tuple operator, only available inside parens
  tuple_operator: $ => prec.right(alias($.comma, '')),

  // Ticked operator
  ticked_operator: $=> ticked(alias($._qvarid, '')),

  _var: $ => choice($.variable, parens($.operator)),
  _qvar: $ => choice($._var, $.qualified_variable, $.qualified_operator),

  // ------------------------------------------------------------------------
  // Data constructors
  // ------------------------------------------------------------------------

  // Same as the varid pattern except this one would have to start with a capital letter.
  _conid: _ => /[\p{Lu}_][\p{L}0-9_']*/,
  constructor: $ => choice($._conid, $.pragma_mkworld),

  qualified_constructor: $ => qualified($, $.constructor),
  _qconid: $ => choice($.qualified_constructor, $.constructor),

  _con: $ => choice($.constructor, parens($.operator)),
  _qcon: $ => choice($._con, $.qualified_constructor, $.qualified_operator),

  // ------------------------------------------------------------------------
  // Type constructors
  // ------------------------------------------------------------------------

  _tyconid: $ => alias($.constructor, $.type),
  qualified_type: $ => qualified($, $._tyconid),
  _qtyconid: $ => choice($.qualified_type, $._tyconid),

  literal: $ => $._literal,
  _name: $ => choice($.variable, $.constructor, parens($.operator)),
  _qname: $ => choice($._name, $.qualified_variable, $.qualified_constructor, $.qualified_operator),
}
