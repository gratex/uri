/**
 * @module builder
*/

const uri = require('../src/_uri');

const PLACEHOLDER = '$$$'; // should be safe string, not occuring in url templates, and not breaking decomposition
const REPLACE = /\$\$\$/g;

class EncodedString {
    // represents encoded String
    // new Class to be able to make instanceOf
    // needed by encode function to know if encode or not

    constructor(value) {
        this.string = `${value}`; // template to get string from value
    }
}

const ENCODERS = [ // order is important!
    [ 'path', uri.encodeSegment ],
    [ 'query', uri.encodeQuery ],
    [ 'fragment', uri.encodeFragment ]
];

function encode(value, encoder) {
    return value instanceof EncodedString ? value.string : encoder(`${value}`); // template to get string from value
}

function build(encoders, strings, ...values) {
    const uriTemplate = strings.reduce((last, actual) => `${last}${PLACEHOLDER}${actual}`);

    const decomposed = uri.decomposeComponents(uriTemplate);

    encoders.forEach(([ key, encoder ]) => {
        const value = decomposed[key];
        if (!value) { return; }
        decomposed[key] = value.replace(REPLACE, () => encode(values.shift(), encoder));
    });

    const recomposed = uri.recomposeComponents(decomposed);

    if (REPLACE.test(recomposed)) {
        throw new Error(`Params outside ${encoders.map(([ key ]) => key).join('/')} are unsupported`);
    }
    return recomposed;
}

/**
 * ES6 template literal tag, used to build URLs safely (correctly encoded path/query/segment)
 * @memberof module:builder
 * @returns {string} builded URL
 *
 * @example
 * import { uriBuilder } from '@gjax/uri';
 * const p1 = 'a/b?c', p2 = 'a#b', p3 = 'a b';
 * const url = uriBuilder`/foo/${p1}/bar/?x=${p2}#/baz/${p3}`;
 * // RESULT: /foo/a%2Fb%3Fc/bar/?x=a%23b#/baz/a%20b
 *
 */
function uriBuilder(strings, ...values) {
    return build(ENCODERS, strings, ...values);
}

/**
 * ES6 template literal tag, used to build URLs safely (correctly encoded path/query/segment)
 * Values in query are encoded using uri.encodeRqlValue
 * @memberof module:builder
 * @returns {string} builded URL
 *
 * @example
 * import { uriBuilder } from '@gjax/uri'
 * const p1 = 10, p2 = 'a)b';
 *
 * const url = uriBuilder`/foo/${p1}/bar/?eq(x,${p2})`
 * // RESULT: /foo/10/bar/?eq(x,a)b)'
 *
 * const url = uriBuilderRql`/foo/${p1}/bar/?eq(x,${p2})`
 * // RESULT: /foo/10/bar/?eq(x,a%29b)'
 *
 */
function uriBuilderRql(strings, ...values) {
    const encoders = [ [ 'query', uri.encodeRqlValue ], ...ENCODERS.slice(1) ];
    return build(encoders, strings, ...values);
}

/**
 * Use to wrap value for uriBuilder to enforce no encoding for it
 * @param value
 * @memberof module:builder
 * @returns object representing wrapped value with encoded flag.
 *
 * @example
 * import { uriBuilder, raw } from '@gjax/uri'
 * const p1 = 'a/b?c', query = 'name=John%20Doe&age=20';
 *
 * uriBuilder`/foo/${p1}/bar/?${query}`
 * // RESULT: /foo/a%2Fb%3Fc/bar/?name=John%2520Doe&age=20'
 *
 * uriBuilder`/foo/${p1}/bar/?${raw(query)}`
 * // RESULT: /foo/a%2Fb%3Fc/bar/?name=John%20Doe&age=20
 */
function raw(string) {
    return new EncodedString(string);
}

module.exports = {
    uriBuilder,
    uriBuilderRql,
    raw
};
