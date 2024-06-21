; ------------------------------------------------------------------------------
; Literals and comments

[
  (integer)
  (exp_negation)
] @constant.numeric.integer

(exp_literal
  (number)) @constant.numeric.float

(char) @constant.character

[
  (string)
  (triple_quote_string)
] @string

(comment) @comment

; ------------------------------------------------------------------------------
; Punctuation

[
  "("
  ")"
  "{"
  "}"
  "["
  "]"
] @punctuation.bracket

(comma) @punctuation.delimiter

; ------------------------------------------------------------------------------
; Types

(type) @type

(constructor) @constructor

; ------------------------------------------------------------------------------
; Keywords, operators, imports

[
  "if"
  "then"
  "else"
  "case"
  "of"
] @keyword.control.conditional

(module) @namespace

[
  "import"
  "module"
  "namespace"
  "parameters"
] @keyword.control.import

[
  (operator)
  (constructor_operator)
  (qualified_module) ; grabs the `.` (dot), ex: import System.IO
  ; `_` wildcards in if-then-else and case-of expressions,
  ; as well as record updates and operator sections
  (wildcard)
  "="
  "|"
  "::"
  "∷"
  "=>"
  "⇒"
  "<="
  "⇐"
  "->"
  "→"
  "<-"
  "←"
  "\\"
  "`"
] @operator

(qualified_module
  (module) @constructor)

(qualified_type
  (module) @namespace)

(qualified_variable
  (module) @namespace)

(import
  (module) @namespace)

[
  (where)
  "let"
  "in"
  "interface"
  "using"
  "data"
  "record"
  "as"
  "do"
  "forall"
  "∀"
  "infix"
  "infixl"
  "infixr"
  (visibility)
  (totality)
  (quantity)
] @keyword

(hole) @label

[
  (pragma_name)
  (pragma_inline)
  (pragma_tcinline)
  (pragma_extern)
  (pragma_search)
  (pragma_world)
  (pragma_mkworld)
] @label


; ------------------------------------------------------------------------------
; Functions and variables

(variable) @variable

(exp_apply
  .
  (exp_name
    (variable) @function))

(exp_apply
  .
  (exp_name
    (qualified_variable
      (variable) @function)))

(record_accessor
  field: [ (variable)
           (string)
           (triple_quote_string)
         ] @variable.other.member)

(exp_record_access
  field: [ (variable)
           (string)
           (triple_quote_string)
         ] @variable.other.member)

(signature
  name: (variable) @type)

(type_name) @type

(function
  (lhs
    (funvar
      name: (variable) @function)))

(interface_head
  name: (interface_name) @type)

(implementation_head
  (interface_name) @type)
