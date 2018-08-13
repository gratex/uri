// Type definitions for ./src/builder.js
// Project: @gjax/uri

/**
 * ES6 template literal tag, used to build URLs safely
 *
 */
declare function uriBuilder(strings: string[], ...values: string[]): void;

/**
 * Use to wrap value for uriBuilder to enforce no encoding for it
 * @param value
 */
declare function raw(value): any;
