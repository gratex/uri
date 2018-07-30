const uri = require('./_uri.js');
const isEqualWith = require('lodash.isequalwith');
const querystring = require('querystring');

function equalsQueryStr(query1, query2) {
    function simpleCompare(a, b) {
        return (a < b ? -1 : (a > b ? 1 : 0));
    }

    function customizer(a, b) {
        if (Array.isArray(a) && Array.isArray(b)) {
            // order is not important, so just sort them before comparing
            a.sort(simpleCompare);
            b.sort(simpleCompare);
        }
        return undefined; // isEqualWith will do the job if we return undef
    }

    if (!query1 || !query2) {
        return query1 === query2;
    }
    const q1 = uri.parseQuery(query1);
    const q2 = uri.parseQuery(query2);

    return isEqualWith(q1, q2, customizer);
}
function clone(uriArr) {
    return Object.assign({}, uriArr);
}
function param(that) {
    that != null || (that = ''); // let "" continue
    return (typeof that == 'string') ? uri.decomposeComponents(that) : clone(that);
}
function resolve(base, ref) {
    // less strict version of uri.resolve, scheme is not required
    const scheme = base.scheme;
    if (!scheme) {
        base.scheme = 'http';
    }
    const s = uri.resolve(base, ref);
    if (!scheme) {
        delete s.scheme;
    }
    return s;
}

/* function mixin(that, { authority, userInfo, host, port, scheme, path, query, fragment }) {
    // summary:
    //		Use to set multiple URI parts at once.
    // that: String|Object|null
    //		URI string or URI object. Current window URI used when null or undefined.
    // obj: Object
    //		Available properties: `scheme`, `authority`, `userInfo`, `host`, `port`, `path`, `query`, `fragment`.
    //		If `authority` property is not undefine, `userInfo`, `host` and `port` are ignored.
    //		All properties are strings except `query` and `fragment` which may also be objects.
    // returns: String
    //		Modified copy of `that`.
     const u = param(that);
    console.log(u);

    if (authority !== undefined) {
        u.authority = authority;
        console.log(u);
        if (u.authority) {
            ({ userInfo, host, port } = uri.decomposeComponents(`//${u.authority}`));
            Object.assign(u, { userInfo, host, port });
        } else {
            u.userInfo = u.host = u.port = undefined;
        }
    } else {
        userInfo && (u.userInfo = userInfo);
        host && (u.host = host);
        port && (u.port = port);
        u.authority = uri.recomposeAuthorityComponents(u.userInfo, u.host, u.port);
    }
    scheme && (u.scheme = scheme);
    path && (u.path = path);
    query && (u.query = query && typeof query != 'string' ? querystring.stringify(query) : query);
    fragment && (u.fragment = fragment && typeof fragment != 'string' ? querystring.stringify(fragment) : fragment);
    return uri.recomposeComponents(u);

}*/
function mixin(that, { authority, userInfo, host, port, scheme, path, query, fragment }) {
    // summary:
    //		Use to set multiple URI parts at once.
    // that: String|Object|null
    //		URI string or URI object. Current window URI used when null or undefined.
    // obj: Object
    //		Available properties: `scheme`, `authority`, `userInfo`, `host`, `port`, `path`, `query`, `fragment`.
    //		If `authority` property is present, `userInfo`, `host` and `port` are ignored.
    //		All properties are strings except `query` and `fragment` which may also be objects.
    // returns: String
    //		Modified copy of `that`.
    const u = param(that);

    /* "app/_base/rql" */
    if (authority !== undefined) {
        u.authority = authority;
        if (u.authority) {
            ({ userInfo, host, port } = uri.decomposeComponents(`//${u.authority}`));
            Object.assign(u, { userInfo, host, port });
        } else {
            u.userInfo = u.host = u.port = undefined;
        }
    } else {
        userInfo && (u.userInfo = userInfo);
        host && (u.host = host);
        port && (u.port = port);
        u.host && (u.authority = uri.recomposeAuthorityComponents(u.userInfo, u.host, u.port));
    }
    scheme && (u.scheme = scheme);
    path && (u.path = path);
    query && (u.query = query && typeof query != 'string' ? querystring.stringify(query) : query);
    fragment && (u.fragment = fragment && typeof fragment != 'string' ? querystring.stringify(fragment) : fragment);
    return uri.recomposeComponents(u);
}
module.exports = {
    equalsQueryStr,
    clone,
    param,
    resolve,
    mixin
};
