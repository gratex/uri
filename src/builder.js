const uri = require('../src/_uri');
const PLACEHOLDER = '$$$'; // should be safe string, not occuring in url templates, and not breaking decomposition
const REPLACE = new RegExp(PLACEHOLDER, 'g');

function uriBuilder(strings, ...values) {
    // uriBuilder`/a/${x}/b/?u=${y}p=10#/a/b/${m}`

    const uriTemplate = strings.reduce((last, actual) => `${last}${PLACEHOLDER}${actual}`);
    // -> '/a/$$$/b/?u=$$$p=10#/a/b/$$$'

    // eslint-disable-next-line prefer-const
    let { path, query, fragment, ...otherComponents } = uri.decomposeComponents(uriTemplate);

    path = path && path.replace(REPLACE, () => uri.encodeSegment(values.shift()));
    query = query && query.replace(REPLACE, () => uri.encodeQuery(values.shift()));
    fragment = fragment && fragment.replace(REPLACE, () => uri.encodeFragment(values.shift()));

    return uri.recomposeComponents({ ...otherComponents, path, query, fragment });
}

function raw() {
}

module.exports = {
    uriBuilder,
    raw
};
