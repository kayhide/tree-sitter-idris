const { brackets, layouted, layouted_without_end, parens, prefixable, qualified, sep, sep1, ticked, terminated } = require('./util.js')

/* ----- Composite expressions shared between do/ado and regular notation -----

The point of these is that we want them exactly the same for regular
notation and `do`/`ado` notation, except the let-in expressions.
These are not allowed in `do`/`ado` blocks, and are tricky to parse in
`ado` blocks specifically due to ambiguity stemming from `ado` block
terminator being `in`:

f = ado
  let a = []
  in a

But `do` and `ado` blocks have mutual dependency with all other expressions
so they would have to be defined in the same module.
*/

const __lexp = ($, ...rule) =>
  choice(
    $.exp_if,
    $.exp_case,
    $.exp_lambda,
    $._fexp,
    ...rule
  )

module.exports = {

  // ----- Identifiers and modifiers ------------------------------------------

  bang: _ =>  '!',

  exp_name: $ => prefixable($.bang, $._q_name_op),

  exp_ticked: $ => ticked($._aexp),

  exp_parens: $ => prefixable($.bang, parens($._exp)),

  exp_idiom: $ => idiom_brackets($._exp),

  exp_list: $ => choice(
    brackets(sep($.comma, $._exp)),
    snoc_brackets(sep($.comma, $._exp)),
  ),

  exp_implicit_arg: $ => braces(seq(
    field('subject', $._name),
    optional(seq('=', 
      field('object', $._exp)
    )),
  )),

  exp_explicit_impl: $ => seq(
    '@{', 
    choice($.implementation_name, $.pragma_search),
    '}'
  ),

  // ----- Tuples or tuple secions --------------------------------------------

  exp_tuple: $ => parens(
    seq(
      repeat1(
        seq(
          optional($._exp),
          $.tuple_operator,
        ),
      ),
      optional($._exp),
    ),
  ),

  // ----- Records ------------------------------------------------------------

  _record_access_field: $ => $._immediate_loname,

  exp_record_access: $ =>
    prec(1, seq(
      choice($.hole, $.exp_parens, $._q_loname),
      repeat1(seq($._immediate_dot, field('field', $._record_access_field)))
    )),

  // ----- If-then-else -------------------------------------------------------

  exp_if: $ => seq(
    'if',
    field('if', $._exp),
    'then',
    field('then', alias($._exp, $.exp_then)),
    'else',
    field('else', alias($._exp, $.exp_else)),
  ),

  // ----- Case-of ------------------------------------------------------------

  _alt_variants: $ => seq($._rcarrow, field('exp', $._exp)),

  alt: $ =>
    seq(
      sep1($.comma, field('pat', $._pat)),
      $._alt_variants,
      optional(seq($.where, $.declarations))
    ),

  alts: $ => layouted($, $.alt),

  _exp_case_slots: $ =>
    sep1(
      $.comma,
      field('condition', $._exp)
    ),

  exp_case: $ => seq(
    'case',
    $._exp_case_slots,
    'of',
    $.alts
  ),

  // ----- Let-in -------------------------------------------------------------

  _let_in_decls: $ => layouted_without_end($, $._decl),

  exp_let_in: $ => seq(
    'let',
    alias($._let_in_decls, $.declarations),
    'in',
    $._exp
  ),

  // ----- Rewrite-in ---------------------------------------------------------

  exp_rewrite_in: $ => seq(
    'rewrite',
    alias($._exp, $.rewrite_exp),
    'in',
    $._exp
  ),

  // ----- Lambdas ------------------------------------------------------------

  exp_lambda: $ => seq(
    '\\',
    $.lambda_args,
    $._rcarrow,
    alias($._exp, $.lambda_exp),
  ),

  lambda_args: $ => sep1($.comma, $._apat),

  // ----- do and ado notation ------------------------------------------------

  bind_pattern: $ => seq(
    $._typed_pat,
    $._larrow,
    alias(repeat1($._aexp), $.bind_exp),
    optional(seq('\n', $.bind_alts)),
  ),

  _let_decls: $ => layouted($, $._decl),

  let: $ => seq(
    'let', 
    alias($._let_decls, $.declarations),
    optional($.bind_alts),
  ),

  bind_alts: $ => layouted($, $.bind_alt),

  bind_alt: $ => seq('|', $._typed_pat, $._rcarrow, $._exp),


  statement: $ =>
    choice(
      $._exp,
      $.bind_pattern,
      $.let,
    ),

  _do: $ => choice('do', qualified($, 'do')),
  exp_do: $ => seq($._do, layouted($, $.statement)),

  // ----- Composite expressions ----------------------------------------------

  _aexp: $ => choice(
    $.hole,
    $.exp_name,
    alias($.operator, $.exp_op),
    $.exp_ticked,
    $.exp_parens,
    $.exp_idiom,
    $.exp_list,
    $.exp_implicit_arg,
    $.exp_explicit_impl,
    $.record_update,
    $.exp_record_access,
    $.exp_tuple,
    alias($.literal, $.exp_literal),
    $.wildcard,
    $.unit,
    $.pragma_mkworld,
    $.pragma_search,
  ),

  _fexp: $ => prec.right(seq(
    $._aexp,
    optional($._exp),
  )),

  _exp: $ =>
    choice(
      $._fexp,
      $.exp_lambda,
      $.exp_if,
      $.exp_case,
      $.exp_let_in,
      $.exp_do,
      $.exp_rewrite_in,
    ),
}
