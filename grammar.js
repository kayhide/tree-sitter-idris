const basic = require('./grammar/basic.js')
const id = require('./grammar/id.js')
const record = require('./grammar/record.js')
const type = require('./grammar/type.js')
const exp = require('./grammar/exp.js')
const pat = require('./grammar/pat.js')
const import_ = require('./grammar/import.js')
const module_ = require('./grammar/module.js')
const data = require('./grammar/data.js')
const interface = require('./grammar/interface.js')
const decl = require('./grammar/decl.js')
const pragma = require('./grammar/pragma.js')

module.exports = grammar({
  name: 'idris',

  /**
   * These rules may occur anywhere in the grammar and don't have to be specified.
   */
  extras: $ => [
    /\p{Zs}/,
    /\n/,
    /\r/,
    $.cpp,
    $.comment,
  ],

  /**
   * These rules are handled manually by the scanner. Whenever their identifiers are used in the rule tree, the parser
   * executes the scanner.
   * Since the newline character is present both here and in `extras`, the scanner will be called before every token.
   * This makes indentation/layout tracking simpler.
   */
  externals: $ => [
    $._layout_semicolon,
    $._layout_start,
    $._layout_end,
    $._dot,
    $.where,
    $._varid,
    $._operator,
    $.comment,
    $._in_string,
    $._raw_string_start,
    $._raw_string_end,
    $.cpp,
    $.comma,
    'in',
    /\n/,
    $.empty_file,
    $._fail,
    $._error_sentinel,
  ],

  inline: $ => [
    $._loname_op,
    $._q_loname,
    $._q_loname_op,
    $._caname_op,
    $._q_caname,
    $._q_caname_op,
    $._quantifiers,
    $._qualifying_module,
  ],

  precedences: _ => [
    [
      'function-type',
      'type',
    ],
  ],

  conflicts: $ => [
    /**
     * Top-level expression splices fundamentally conflict with decls, and since decls start with either `var` or `pat`,
     * they cannot be disambiguated.
     *
     * function_variable:
     * func (A a) = a
     *
     * function_pattern:
     * Just 1 = Just 1
     * a : as = [1, 2, 3]
     *
     * splice:
     * makeLenses ''A
     *
     * The disambiguation can clearly be made from the `=`, but my impression is that the conflict check only considers
     * immediate lookahead.
     */
    [$.exp_list, $.pat_list],
    [$._aexp, $._apat],

    // Names
    [$._name, $._name_op, $.interface_name],
    [$._apat, $._implementation_name],
    [$._name, $._name_op],
    [$._name_op, $._field_name],
    [$._name, $._name_op, $._field_name],
    [$._q_name, $._name_op],
    [$._q_name, $._q_name_op],

    /**
     * Signature `:` and let in typed pattern.
     * let prf : Type := a = b in ...
     */
    [$._pat, $.signature],
    [$._apat, $.signature],

    // String
    [$._string, $._apat],

    // Decl
    [$._decl_data_inline, $._decl_data_block, $._decl_interface, $.implementation_head],
    [$._decl_data_inline, $._decl_interface, $.implementation_head, $.signature],

    // Types
    [$._type],
    [$.constraints],
    [$._name_op, $.interface_name],
    [$._q_name_op, $.interface_name],
    [$._numeric, $.quantity],
    [$._type, $._parens],
    [$._type, $.exp_tuple],
    [$._type, $._funrhs],

    // Variable names
    [$._avar, $._apat],
    [$._avar, $._aexp, $._apat],
    [$._avar, $._aexp],

    // Misc
    [$.operator, $.pat_op],
    [$.operator, $.pat_op],
    [$._parens_operator, $._aexp],
    [$.equal, $.pat_braces],
    [$._q_name_op, $._funvar],
    [$.qualified_loname, $._name],
    [$.qualified_caname, $._name],
    [$._exp],
    [$.pragma_foreign],
  ],

  rules: {
    idris: $ => choice(
      $.empty_file,
      terminated($, $._topdecl),
    ),

    _topdecl: $ => choice(
      alias($._decl_module, $.module),
      alias($._decl_import, $.import),
      alias($._decl_namespace, $.namespace),
      alias($._decl_parameters, $.parameters),
      alias($._decl_mutual, $.mutual),
      alias($._decl_data, $.data),
      alias($._decl_record, $.record),
      alias($._decl_interface, $.interface),
      alias($._decl_implementation, $.implementation),
      $._decl,
      $._pragma_global,
      $._pragma_internal,
      $._pragma_reflection,
    ),

    ...basic,
    ...id,
    ...record,
    ...type,
    ...exp,
    ...pat,
    ...import_,
    ...module_,
    ...data,
    ...interface,
    ...decl,
    ...pragma,
  }
})
