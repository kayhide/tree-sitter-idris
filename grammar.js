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
    $.pragma_hint,
    $.pragma_inline,
    $.pragma_tcinline,
    $.pragma_extern,
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
    $._operator,
    $._consym,
    $._tyconsym,
    $.comment,
    $.cpp,
    $.comma,
    '|',
    'in',
    /\n/,
    $.empty_file,
  ],

  inline: $ => [
    $._stringly,
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

    /**
     * Names.
     */
    [$._type_variables, $.loname],
    [$._name, $.interface_name],
    [$._name, $._name_op, $.interface_name],
    [$._name_op, $.interface_name],
    [$._apat, $._implementation_name],
    [$._name, $._q_name],
    [$._name, $._name_op],
    [$._name, $._field_name],

    /**
     * Visibilities conflict.
     */
    [$.implementation_head, $.signature],

    /**
     * Braces
     */
    [$._q_name, $._field_name],

    /**
     * Parens perator
     */
    [$._parens_operator, $._apat],

    /**
     * Type operators of `->` or `=>` in exp.
     */
    [$.operator, $.exp_op],

    /**
     * Type operators including `=`.
     */
    [$.operator, $.type_op],

    /**
     * Signature `:` and let in typed pattern.
     * let prf : Type := a = b in ...
     */
    [$._apat, $.signature],
    [$.pat_typed, $.signature],

    /**
     * What a `forall` binds to is ambiguous from the parser's POV:
     *
     * `t :: forall a. Unit`         ← binds to the single type name
     * `t :: forall a. Unit → Unit`  ← binds to the whole expression
     *
     * This is solvable in theory but likely not under the current
     * implementation of `type.js`. Although, the costs of a more naive
     * implementation are small; it'd work fine unless someone decided
     * to write `t :: forall a. forall b. ...`, in which case it wouldn't
     * parse the second `forall` correctly.
     */
    [$._type,],

  ],

  rules: {
    idris: $ => choice(
      $.empty_file,
      terminated($, $._topdecl),
    ),

    _topdecl: $ => choice(
      $._decl_module,
      alias($._decl_import, $.import),
      alias($._decl_namespace, $.namespace),
      alias($._decl_parameters, $.parameters),
      alias($._decl_mutual, $.mutual),
      alias($._decl_data, $.data),
      alias($._decl_record, $.record),
      alias($._decl_interface, $.interface),
      alias($._decl_implementation, $.implementation),
      $._decl,
      $._pragma,
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
