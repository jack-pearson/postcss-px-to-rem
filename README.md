# postcss-px-to-rem

A plugin for [PostCSS](https://github.com/ai/postcss) that generates rem from pixel units.

This project was completed through the modification of [njleonzhang](https://github.com/QuellingBlade/postcss-px-to-rem).

## Usage

If your project involves a fixed width, this script will help to convert pixels into rem.

### Options

Default:

```js
{
  unitToConvert: 'px',
  widthOfDesignLayout: 1920,
  unitPrecision: 5,
  selectorBlackList: [],
  minPixelValue: 1,
  mediaQuery: false
};
```

- `unitToConvert` (String) unit to convert, by default, it is px.
- `widthOfDesignLayout` (Number) The width of the design layout. for pc dashboard, generally is 1920.
- `unitPrecision` (Number) The decimal numbers to allow the REM units to grow to.
- `selectorIncludeList` (Array) The selectors to ignore and leave as px.
  - If value is string, it checks to see if selector contains the string.
    - `['body']` will match `.body-class`
  - If value is regexp, it checks to see if the selector matches the regexp.
    - `[/^body$/]` will match `body` but not `.body`
- `minPixelValue` (Number) Set the minimum pixel value to replace.
- `mediaQuery` (Boolean) Allow px to be converted in media queries.
