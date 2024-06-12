const basic = require('./grammar/basic.js')
const id = require('./grammar/id.js')
const rows = require('./grammar/rows_and_records.js')
const type = require('./grammar/type.js')
const exp = require('./grammar/exp.js')
const pat = require('./grammar/pat.js')
const import_ = require('./grammar/import.js')
const module_ = require('./grammar/module.js')
const data = require('./grammar/data.js')
const interface = require('./grammar/interface.js')
const decl = require('./grammar/decl.js')
const derive = require('./grammar/derive.js')
const pattern = require('./grammar/pattern.js')

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
    $._arith_dotdot,
    $.where,
    // TODO: Splices were removed from the JS grammar but not from the scanner yet.
    $._splice_dollar,
    $._varsym,
    $._consym,
    $._tyconsym,
    $.comment,
    $.cpp,
    $.comma,
    // TODO: Quasiquotes were removed from the JS grammar but not from the scanner yet.
    $.quasiquote_start,
    $.quasiquote_bar,
    $.quasiquote_body,
    $._strict,
    $._lazy,
    // TODO: Unboxed types were removed from the JS grammar but not from the scanner yet.
    $._unboxed_close,
    '|',
    'in',
    /\n/,
    $.empty_file,
  ],

  inline: $ => [
    // $._number,
    $._stringly,
    $._qvarid,
    // $._operator_minus,
    // $._qvarsym,
    // $._qvarsym_nominus,
    $._var,
    $._qvar,
    $._tyvar,
    $._qconid,
    $._qconsym,
    $._con,
    // $._conop,
    // $._qconop,
    // $._op,
    // $._qop_nominus,
    // $._gcon_literal,
    // $._gcon,
    $._tyconid,
    $._qtyconid,
    $._qtyconsym,
    $._qtycon,
    $._gtycon,
    // $._simple_tycon,
    // $._simple_tyconop,
    $._simple_qtyconop,
    $._quantifiers,
    $._qualifying_module,
  ],

  precedences: _ => [
    [
      'infix-type',
      'btype',
    ],
    [
      'function-type',
      'type',
    ],
  ],

  conflicts: $ => [
    /**
     * This could be done with the second named precedence further up, but it somehow overrides symbolic infix
     * constructors.
     * Needs more investigation.
     */
    [$.type_infix, $._type],

    /**
     * The definition of an infix expression is rather simple and as such
     * it allows things which wouldn't be possible in reality:
     *
     * a ``b`` c
     * (note the double '`' ticks)
     */
    [$.exp_ticked],

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
    [$._fun_name, $.pat_name],
    [$.exp_name, $._pat_constructor],
    [$.exp_name, $.pat_name],
    [$._aexp_projection, $._apat],
    [$._aexp_projection, $.pat_wildcard],
    [$.pat_name, $._q_op],
    [$.exp_array, $.pat_array],
    [$.exp_parens, $.pat_tuple],
    [$._minus, $.exp_negation],
    [$._minus, $.exp_negation, $.pat_negation],

    /**
     * For getting a node for function application, and no extra node if the expression only consists of one term.
     */
    [$._exp_apply, $._fexp],
    [$._exp_apply],

    /**
     * Same as `exp_apply`, but for patterns.
     */
    [$.pat_apply, $._apat],
    [$.pat_apply],

    /**
     * Same as `exp_apply`, but for types.
     */
    [$.type_apply, $._btype],
    [$.type_apply],

    /**
     * Interface implementation confilicts.
     */
    [$.qualified_constructor, $.qualified_type],
    [$._qcon, $.interface_name],

    /**
     * Implementation name confilicts.
     */
    [$.variable, $._implementation_name],
    [$.constructor, $._implementation_name],
    [$.constructor, $._fun_name],

    /**
     * A weird conflict involving fundeps and type variables in class heads,
     * despite the fact that fundeps are delimited by `|`.
     */
    [$.type_name, $.interface_head],

    /**
     * Type names and class names both alias `$.constructor`.
     */
    [$.type_name, $.interface_name],

    /**
     * Same as above, but for operators.
     */
    [$.operator, $.constructor_operator],

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
    [$._btype,],

    /**
     * Ado-notation is currently tricky for two reasons:
     * 1) It isn't natively supported by layout scanner, unlike do-notation.
     * 2) It terminates with `in` keyword, which conflicts with `let … in …`-expressions.
     *    This in turn prevents us from simply using the same rules as for do-notation.
     * A future ideal solution would be to handle it at the scanner level.
     */
    [$.exp_ado],

  ],

  word: $ => $._varid,

  rules: {
    idris: $ => choice(
      $.empty_file,
      terminated($, $._topdecl),
    ),

    _topdecl: $ => choice(
      $._decl_module,
      alias($._decl_namespace, $.namespace),
      alias($._decl_parameters, $.parameters),
      alias($._decl_mutual, $.mutual),
      alias($.decl_type, $.type_alias),
      $.type_role_declaration,
      alias($.decl_data, $.data),
      alias($.decl_newtype, $.newtype),
      alias($.decl_record, $.record),
      // TODO: Imports cannot come in random places,
      // the structure of a module is always `module M [exports] where [imports] …`
      // should group these together to remove extra parser overhead and simplify it for all other symbols
      alias($.decl_import, $.import),
      $.interface_declaration,
      $.interface_implementation,
      $._decl_foreign,
      alias($.decl_derive, $.derive_declaration),
      $._decl,
      $.kind_declaration,
      $.kind_value_declaration,
      alias($.decl_pattern, $.pattern_synonym),
    ),

    ...basic,
    ...id,
    ...rows,
    ...type,
    ...exp,
    ...pat,
    ...import_,
    ...module_,
    ...data,
    ...interface,
    ...decl,
    ...derive,
    ...pattern,
  }
})
