"use strict"
module.exports = function generate_switch(it, $keyword, $ruleType) {
  let out = " "
  const $lvl = it.level
  const $dataLvl = it.dataLevel
  const $schema = it.schema[$keyword]
  const $schemaPath = it.schemaPath + it.util.getProperty($keyword)
  const $errSchemaPath = it.errSchemaPath + "/" + $keyword
  const $breakOnError = !it.opts.allErrors
  const $data = "data" + ($dataLvl || "")
  const $valid = "valid" + $lvl
  const $errs = "errs__" + $lvl
  const $it = it.util.copy(it)
  let $closingBraces = ""
  $it.level++
  const $nextValid = "valid" + $it.level
  let $ifPassed = "ifPassed" + it.level,
    $currentBaseId = $it.baseId,
    $shouldContinue
  out += "var " + $ifPassed + ";"
  const arr1 = $schema
  if (arr1) {
    let $sch,
      $caseIndex = -1,
      l1 = arr1.length - 1
    while ($caseIndex < l1) {
      $sch = arr1[($caseIndex += 1)]
      if ($caseIndex && !$shouldContinue) {
        out += " if (!" + $ifPassed + ") { "
        $closingBraces += "}"
      }
      if (
        $sch.if &&
        (it.opts.strictKeywords
          ? (typeof $sch.if == "object" && Object.keys($sch.if).length > 0) || $sch.if === false
          : it.util.schemaHasRules($sch.if, it.RULES.all))
      ) {
        out += " var " + $errs + " = errors;   "
        const $wasComposite = it.compositeRule
        it.compositeRule = $it.compositeRule = true
        $it.createErrors = false
        $it.schema = $sch.if
        $it.schemaPath = $schemaPath + "[" + $caseIndex + "].if"
        $it.errSchemaPath = $errSchemaPath + "/" + $caseIndex + "/if"
        out += "  " + it.validate($it) + " "
        $it.baseId = $currentBaseId
        $it.createErrors = true
        it.compositeRule = $it.compositeRule = $wasComposite
        out += " " + $ifPassed + " = " + $nextValid + "; if (" + $ifPassed + ") {  "
        if (typeof $sch.then == "boolean") {
          if ($sch.then === false) {
            var $$outStack = $$outStack || []
            $$outStack.push(out)
            out = "" /* istanbul ignore else */
            if (it.createErrors !== false) {
              out +=
                " { keyword: '" +
                "switch" +
                "' , dataPath: (dataPath || '') + " +
                it.errorPath +
                " , schemaPath: " +
                it.util.toQuotedString($errSchemaPath) +
                " , params: { caseIndex: " +
                $caseIndex +
                " } "
              if (it.opts.messages !== false) {
                out += " , message: 'should pass \"switch\" keyword validation' "
              }
              if (it.opts.verbose) {
                out +=
                  " , schema: validate.schema" +
                  $schemaPath +
                  " , parentSchema: validate.schema" +
                  it.schemaPath +
                  " , data: " +
                  $data +
                  " "
              }
              out += " } "
            } else {
              out += " {} "
            }
            var __err = out
            out = $$outStack.pop()
            if (!it.compositeRule && $breakOnError) {
              /* istanbul ignore if */
              if (it.async) {
                out += " throw new ValidationError([" + __err + "]); "
              } else {
                out += " validate.errors = [" + __err + "]; return false; "
              }
            } else {
              out +=
                " var err = " +
                __err +
                ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; "
            }
          }
          out += " var " + $nextValid + " = " + $sch.then + "; "
        } else {
          $it.schema = $sch.then
          $it.schemaPath = $schemaPath + "[" + $caseIndex + "].then"
          $it.errSchemaPath = $errSchemaPath + "/" + $caseIndex + "/then"
          out += "  " + it.validate($it) + " "
          $it.baseId = $currentBaseId
        }
        out +=
          "  } else {  errors = " +
          $errs +
          "; if (vErrors !== null) { if (" +
          $errs +
          ") vErrors.length = " +
          $errs +
          "; else vErrors = null; } } "
      } else {
        out += " " + $ifPassed + " = true;  "
        if (typeof $sch.then == "boolean") {
          if ($sch.then === false) {
            var $$outStack = $$outStack || []
            $$outStack.push(out)
            out = "" /* istanbul ignore else */
            if (it.createErrors !== false) {
              out +=
                " { keyword: '" +
                "switch" +
                "' , dataPath: (dataPath || '') + " +
                it.errorPath +
                " , schemaPath: " +
                it.util.toQuotedString($errSchemaPath) +
                " , params: { caseIndex: " +
                $caseIndex +
                " } "
              if (it.opts.messages !== false) {
                out += " , message: 'should pass \"switch\" keyword validation' "
              }
              if (it.opts.verbose) {
                out +=
                  " , schema: validate.schema" +
                  $schemaPath +
                  " , parentSchema: validate.schema" +
                  it.schemaPath +
                  " , data: " +
                  $data +
                  " "
              }
              out += " } "
            } else {
              out += " {} "
            }
            var __err = out
            out = $$outStack.pop()
            if (!it.compositeRule && $breakOnError) {
              /* istanbul ignore if */
              if (it.async) {
                out += " throw new ValidationError([" + __err + "]); "
              } else {
                out += " validate.errors = [" + __err + "]; return false; "
              }
            } else {
              out +=
                " var err = " +
                __err +
                ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; "
            }
          }
          out += " var " + $nextValid + " = " + $sch.then + "; "
        } else {
          $it.schema = $sch.then
          $it.schemaPath = $schemaPath + "[" + $caseIndex + "].then"
          $it.errSchemaPath = $errSchemaPath + "/" + $caseIndex + "/then"
          out += "  " + it.validate($it) + " "
          $it.baseId = $currentBaseId
        }
      }
      $shouldContinue = $sch.continue
    }
  }
  out += "" + $closingBraces + "var " + $valid + " = " + $nextValid + ";"
  return out
}
