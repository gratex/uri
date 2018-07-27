const uri = require('../src/_uri');

function uriBuilder(other, ...toResolve) {
    /* eslint prefer-const: "OFF" */
    const assembledInputPath = other.reduce((last, actualOpt, index) =>
        `${last}${toResolve[index - 1]}${actualOpt}`
    ).replace(toResolve, '${inj}');
    let { path, query, fragment } = uri.decomposeComponents(assembledInputPath);
    if (path !== '') {
        path && (path = path.replace('${inj}', toResolve));
        if (path.indexOf('../') !== -1) {
            let after = path.substring(path.indexOf('../'), path.length).replace('/', encodeURIComponent('/'));
            after = after
                .substring(path.indexOf(encodeURIComponent('/').slice(-1)), path.length)
                .replace('/', encodeURIComponent('/'));
            while(path.indexOf(encodeURIComponent('/').slice(-1)) !== -1) {
                after = after
                    .substring(path.indexOf(encodeURIComponent('/').slice(-1)), path.length)
                    .replace('/', encodeURIComponent('/'));
            }
            let before = path.substring(0, path.indexOf('../'));
            path = before.concat(after);
        }
    }
    if (query !== '') {
        query && (query = query.replace('${inj}', `${toResolve}`));
    }
    if (fragment !== '') {
        fragment && (fragment = fragment.replace('${inj}', `${toResolve}`));
    }
    return uri.recomposeComponents({ path, query, fragment });
}

function raw() {
}

module.exports = {
    uriBuilder,
    raw
};
