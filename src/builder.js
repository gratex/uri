const uri = require('../src/_uri');

function uriBuilder(other, ...toResolve) {
    // tag for template literal
    // TODO: implement
    /* eslint prefer-const: "OFF" */
    const mimicedPath = other.reduce((last, actualOpt) =>
        `${last}${toResolve}${actualOpt}`
    ).replace(toResolve, '${inj}');
    let { path, query } = uri.decomposeComponents(mimicedPath);
    console.log(query);
    if (path !== '') {
        path && (path = path.replace('${inj}', toResolve));
        return path;
    }
    if (query !== '') {
        query && (query = query.replace('${inj}', `?${toResolve}`));
        return query;
    }
    return 'Something went wrong';
}


function raw() {
    // return something that will tell uriBuilder not to encode
    // (hint: see EncodedString in gjax impl.)
    // TODO: implement
}

module.exports = {
    uriBuilder,
    raw
};
