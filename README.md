# csv-to-indexeddb

Simple utility to convert from CSV files, strings, or (tabular) JSON to
IndexedDB.

**This project is not yet complete.**

## To-dos

1. Complete basic functionality

## Possible to-dos

1. Add tests with full coverage
1. For `cfg.alterJSON` of `importCSVToIndexedDB` (the
  `AlterJSONCallback` jsdoc type), we might benefit from having various
  pre-built callbacks (indicated by a string name) versions which convert
  _JSON_ CSV to other JSON CSV formats, e.g., from flat to non-flat or
  vice-versa or array to object or object to array (latter would lose
  numeric keys, however); also, allow callbacks like csvtojson'
  [`colParser`](https://www.npmjs.com/package/csvtojson#column-parser)
  to manipulate _JSON_ CSV (might accept JSON Schema like `{type: 'string'}`
  to indicate conversions); make sure these proposed callbacks are public
  exports (possibly in its own library) so one can use before sending to
  `importJSONToIndexedDB` as well
