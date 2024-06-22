const { parens, varid_pattern } = require('./util.js')

module.exports = {
  // ------------------------------------------------------------------------
  // Lowercase names
  _loname: _ => varid_pattern,
  loname: $ => $._loname,
  qualified_loname: $ => qualified($, $.loname),

  _immediate_loname: $ => token.immediate(varid_pattern),

  // ------------------------------------------------------------------------
  // Capitalized names
  _caname: _ => /[\p{Lu}_][\p{L}0-9_']*/,
  caname: $ => $._caname,
  qualified_caname: $ => qualified($, $.caname),

  // ------------------------------------------------------------------------
  // Operators
  _operator: _ => /(?:[:!#$%&*+./<=>?@\\^|~-]|\p{S})+/,
  operator: $ => choice($._operator, '-'),
  qualified_operator: $ => qualified($, parens($._operator)),

  // Tuple operator, only available inside parens
  tuple_operator: $ => prec.right(alias($.comma, '')),

  // ------------------------------------------------------------------------
  // Aggregates
  _q_loname: $ => choice($.qualified_loname, $.loname),
  _loname_op: $ => choice($.loname, parens($.operator)),
  _q_loname_op: $ => choice($._loname_op, $.qualified_loname, $.qualified_operator),

  _q_caname: $ => choice($.qualified_caname, $.caname),
  _caname_op: $ => choice($.caname, parens($.operator)),
  _q_caname_op: $ => choice($._caname_op, $.qualified_caname, $.qualified_operator),

  _name: $ => choice($.loname, $.caname),
  _q_name: $ => choice($._q_loname, $._q_caname),
  _name_op: $ => choice($.loname, $.caname, parens($.operator)),
  _q_name_op: $ => choice($._name_op, $.qualified_loname, $.qualified_caname, $.qualified_operator),

  // Ticked operator
  ticked_operator: $=> ticked(alias($._q_name, '')),
}
