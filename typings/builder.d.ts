// Type definitions for ./src/builder.js
// Project: @gjax/uri

/**
 * ES6 template literal tag, used to build URLs safely
 *
 */
declare function uriBuilder(strings: string[], ...values: any[]): string;

/**
 * ES6 template literal tag, used to build URLs safely, values in query are encoded using RQL encoder
 *
 */
declare function uriBuilderRql(strings: string[], ...values: any[]): string;

/**
 * Use to wrap value for uriBuilder to enforce no encoding for it
 * @param value
 */
declare function raw(value: any): EncodedString;

interface EncodedString {
    value: string
}
