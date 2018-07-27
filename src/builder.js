const uri = require('../src/_uri');

function uriBuilder(other, ...toResolve) {
    /* eslint prefer-const: "OFF" */
    // uriBuilder`/a/${x}/b/?u=${y}p=10#/a/b/${m}`
    const assembledInputPath = other.reduce((last, actual) =>
        `${last}$$$${actual}`
    );
    // '/a/$$$/b/?u=$$$p=10#/a/b/$$$'
    let { path, query, fragment } = uri.decomposeComponents(assembledInputPath);
    // {path:'/a/$$$/b/', query:'u=$$$p=10', fragment: '/a/b/$$$'}
    if (path != null) {
        if (path !== '..') {
            path = path.replace('$$$', () => toResolve.shift());
        }
        // matches /.haha/ assuming path starts with dot then anything
        if (path.match('[/][.]+.[/]').shift() != null) {
            let dottedPart = path.match('[/][.]+[/]');
            let after = path.substring(path.indexOf(dottedPart) + 1, path.length);
            let before = path.substring(0, path.indexOf(dottedPart) + 1);
            path = before.concat(after.replace(new RegExp('[/]', 'g'), uri.encodeSegment('/')));
        }
    }
    if (query != null) {
        query = query.replace('$$$', () => toResolve.shift());
    }
    if (fragment != null) {
        fragment = fragment.replace('$$$', () => toResolve.shift());
    }
    if (fragment != null) {
        fragment = fragment.replace('$$$', () => toResolve.shift());
    }
    const assembledOutputPath = uri.recomposeComponents({ path, query, fragment });
    return assembledOutputPath;
}

function raw() {
}

module.exports = {
    uriBuilder,
    raw
};
