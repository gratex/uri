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

function raw(string) {
    return new EncodedString(string);
}

module.exports = {
    uriBuilder,
    raw
};
