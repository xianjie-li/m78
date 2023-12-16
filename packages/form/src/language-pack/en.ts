export default {
  // General error messages thrown by non validators
  commonMessage: {
    strangeValue: "Has an unexpected field: {name}",
  },
  required: "Required",
  object: "Must be a regular object",
  bool: "Must be a Boolean value",
  fn: "Must be function",
  symbol: "Must be a symbol value",
  regexp: "Must be a regexp object",
  regexpString: "Must be a valid regular character",
  url: "Must be a valid url",
  email: "Must be a valid email",
  // Extra interpolation: regexp
  pattern: "Invalid format",
  // Extra interpolation: specific
  specific: "Only be a {specific}",
  // Extra interpolation: targetLabel
  equality: "Must be a the same as {targetLabel}",
  // Extra interpolation: within
  within: "Must be a member of {within}",
  // Extra interpolation: without
  without: "Must be a value other than {without}",
  // Extra interpolation: max, min, length
  string: {
    notExpected: "Must be a string",
    max: "Length cannot be greater than {max}",
    min: "Length cannot be less than {min}",
    length: "The length can only be {length}",
  },
  // Extra interpolation: max, min, length
  array: {
    notExpected: "Must be a array",
    max: "No more than {max} items",
    min: "No less than {min} items",
    length: "Must be {length} items",
  },
  // Extra interpolation: max, min, size
  number: {
    notExpected: "Must be a number",
    notInteger: "Must be a integer",
    max: "Cannot be greater than {max}",
    min: "Cannot be less than {min}",
    size: "Must be {size}",
  },
  // Extra interpolation except for notExpected: max, min, at
  date: {
    notExpected: "Must be a valid date",
    max: "Cannot be after {max}",
    min: "Cannot be before {min}",
    at: "Must be {at}",
    between: "Must be between {min} ~ {max}",
  },
  // match contains additional interpolation `keyword`, list.miss contains additional interpolation `miss`, indicating missing items
  match: "No content matching {keyword}",
  list: {
    miss: "Missing {miss}",
    diffLength: "Length does not match",
  },
};
