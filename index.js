"use strict"

var postcss = require("postcss")
var objectAssign = require("object-assign")

var defaults = {
  unitToConvert: "px",
  widthOfDesignLayout: 1920,
  unitPrecision: 5,
  selectorIncludeList: [],
  minPixelValue: 1,
  mediaQuery: false,
}

var unit = "rem"

module.exports = postcss.plugin("postcss-px-to-rem", function (options) {
  var opts = objectAssign({}, defaults, options)
  var pxReplace = createPxReplace(opts.widthOfDesignLayout, opts.minPixelValue, opts.unitPrecision)
  // excluding regex trick: http://www.rexegg.com/regex-best-trick.html
  // Not anything inside double quotes
  // Not anything inside single quotes
  // Not anything inside url()
  // Any digit followed by px
  // !singlequotes|!doublequotes|!url()|pixelunit
  var pxRegex = new RegExp("\"[^\"]+\"|'[^']+'|url\\([^\\)]+\\)|(\\d*\\.?\\d+)" + opts.unitToConvert, "ig")

  return function (css) {
    css.walkDecls(function (decl, i) {
      // This should be the fastest test and will remove most declarations
      if (decl.value.indexOf(opts.unitToConvert) === -1) return

      if (includeListSelector(opts.selectorIncludeList, decl.parent.selector)) {
        decl.value = decl.value.replace(pxRegex, createPxReplace(opts.widthOfDesignLayout, opts.minPixelValue, opts.unitPrecision))
      }
      return
    })

    if (opts.mediaQuery) {
      css.walkAtRules("media", function (rule) {
        if (rule.params.indexOf(opts.unitToConvert) === -1) return
        rule.params = rule.params.replace(pxRegex, pxReplace)
      })
    }
  }
})

function createPxReplace(widthOfDesignLayout, minPixelValue, unitPrecision) {
  return function (m, $1) {
    if (!$1) return m
    var pixels = parseFloat($1)
    if (pixels <= minPixelValue) return m
    // because 1 rem is 10 percent of viewportSize in
    // https://github.com/QuellingBlade/lib-flexible-for-dashboard,
    // here multiply 10 to match
    return toFixed((pixels / widthOfDesignLayout) * 10, unitPrecision) + "rem"
  }
}

function toFixed(number, precision) {
  var multiplier = Math.pow(10, precision + 1),
    wholeNumber = Math.floor(number * multiplier)
  return (Math.round(wholeNumber / 10) * 10) / multiplier
}

function includeListSelector(includeList, selector) {
  if (typeof selector !== "string") return
  return includeList.some(function (regex) {
    if (typeof regex === "string") return selector.indexOf(regex) !== -1
    return selector.match(regex)
  })
}
