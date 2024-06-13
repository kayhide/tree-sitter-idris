(comment) @comment.inside

[
  (data)
  (type)
] @class.around

((signature)?
 (function
   rhs: (_) @function.inside)) @function.around 

(exp_lambda) @function.around

(data
  (type_variable) @parameter.inside)

(patterns
  (_) @parameter.inside)
