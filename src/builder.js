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

function encode(value, encoder) {
    return value instanceof EncodedString ? value.string : encoder(`${value}`); // template to get string from value
}

/**
 * ES6 template literal tag, used to build URLs safely (correctly encoded path/query/segment)
 * @memberof module:builder
 * @example
 * import { uriBuilder } from '@gjax/uri'
 * const url = uriBuilder`/foo/${p1}/bar/?x=${p2}#/baz/${p3}`
 * @returns {string} builded URL
 *
 */
function uriBuilder(strings, ...values) {
    const uriTemplate = strings.reduce((last, actual) => `${last}${PLACEHOLDER}${actual}`);

    let { path, query, fragment, ...otherComponents } = uri.decomposeComponents(uriTemplate);

    path = path && path.replace(REPLACE, () => encode(values.shift(), uri.encodeSegment));
    query = query && query.replace(REPLACE, () => encode(values.shift(), uri.encodeQuery));
    fragment = fragment && fragment.replace(REPLACE, () => encode(values.shift(), uri.encodeFragment));

    const recomposed = uri.recomposeComponents({ ...otherComponents, path, query, fragment });

    if (REPLACE.test(recomposed)) {
        throw new Error('Params outside path/query/fragment are unsupported');
    }
    return recomposed;
}

/**
 * Use to wrap value for uriBuilder to enforce no encoding for it
 * @param value
 * @memberof module:builder
 * @example
 * import { uriBuilder, raw } from '@gjax/uri'
 * const query = 'name=John%20Doe&age=20';
 * const url = builder`/foo/${p1}/bar/?${raw(query)}`
 * @returns object representing wrapped value with encoded flag.
 */
function raw(string) {
    return new EncodedString(string);
}

module.exports = {
    uriBuilder,
    raw
};
