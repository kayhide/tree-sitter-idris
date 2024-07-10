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
  // Because of scanner, some chars are not captured by regex
  _operator: _ => choice(/(?:[:!#$%&*+./<=>?@\\^|~-]|\p{S})+/, '-', '|~', '.', '**'),
  operator: $ => $._operator,
  qualified_operator: $ => qualified($, parens($._operator)),

  // Tuple operator, only available inside parens
  tuple_operator: $ => prec.right(alias($.comma, '')),

  // ------------------------------------------------------------------------
  // Postfix projection operators
  _dot_operator: $ => seq(".", $._immediate_loname),
  dot_operator: $ => $._dot_operator,
  qualified_dot_operator: $ => qualified($, parens($._dot_operator)),

  // ------------------------------------------------------------------------
  // Aggregates
  _parens_operator: $ => parens(
    choice(
      $.operator, 
      $.dot_operator,
    )
  ),
  _q_loname: $ => choice($.qualified_loname, $.loname),
  _loname_op: $ => choice($.loname, $._parens_operator),
  _q_loname_op: $ => choice($._loname_op, $.qualified_loname, $.qualified_operator, $.qualified_dot_operator),

  _q_caname: $ => choice($.qualified_caname, $.caname),
  _caname_op: $ => choice($.caname, $._parens_operator),
  _q_caname_op: $ => choice($._caname_op, $.qualified_caname, $.qualified_operator, $.qualified_dot_operator),

  _name: $ => choice($.loname, $.caname),
  _q_name: $ => choice($._q_loname, $._q_caname),
  _name_op: $ => choice($.loname, $.caname, $._parens_operator),
  _q_name_op: $ => choice($._name_op, $.qualified_loname, $.qualified_caname, $.qualified_operator, $.qualified_dot_operator),

  // Ticked operator
  ticked_operator: $=> ticked(alias($._q_name, '')),
}
