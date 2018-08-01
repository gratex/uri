const uri = require('./_uri.js');
const isEqualWith = require('lodash.isequalwith');
const querystring = require('querystring');
const assert = require('assert');
let CTX = '';
let UI_CTX_PREFIX = '';
let SVC_CTX_PREFIX = '';
// eslint-disable-next-line no-undef
const DEFAULT_THAT = typeof window != 'undefined' ? window.document.URL : /* istanbul ignore next */ '';

// function fromWindow(){} NOT PORTED
// function navigate(){} NOT PORTED

function config(conf) {
    // NTH: assert not null, or fallback from CTX to others..
    ({ CTX, UI_CTX_PREFIX, SVC_CTX_PREFIX } = conf);
}

// paramString window.document.URL instead use '' (or try use '/', or...)
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
    that != null || (that = DEFAULT_THAT); // let "" continue
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
function isSubPath(baseStr, refStr) {
    const bs = uri.decodeSegments(baseStr);
    const rs = uri.decodeSegments(refStr);

    if (bs.length > rs.length) {
        return false;
    }
    if (bs[bs.length - 1] === '') { // dont compare with void segment
        bs.pop();
    }
    return bs.reverse().every((item, i) => item === rs[bs.length - 1 - i]);
}

function paramString(that) {
    that != null || (that = DEFAULT_THAT);
    return (typeof that === 'string') ? that : uri.recomposeComponents(that);
}

function contains(arr, what) {
    return arr.indexOf(what) !== -1;
}

function toString(that) {
    // summary:
    //		Use to convert uri object to string.
    // that: String|Object|null
    //		URI string or URI object. Current window URI used when null or undefined.
    // returns: String
    //		URI string.
    return paramString(that);
}

function toUri(that) {
    // summary:
    //		Use to convert uri to uri object.
    // that: String|Object|null
    //		URI string or URI object. Current window URI used when null or undefined.
    // returns: Object
    //		URI object with properties: `scheme`, `authority`, `userInfo`, `host`, `port`, `path`, `query`, `fragment`.
    return param(that);
}

function strip(that, toStrip) {
    // summary:
    //		Use to strip some parts of URI.
    // that: String|Object|null
    //		URI string or URI object. Current window URI used when null or undefined.
    // toStrip: String
    //		Comma separated values, available are: "ORIGIN", "CTX", "EXTENSION", "QUERY", "FRAGMENT".
    // returns: String
    //		Modified copy of `that`.
    // example:
    //	|	Uri.strip(uriStr, "QUERY,FRAGMENT");
    let { scheme, authority, host, port, userInfo, path, query, fragment } = param(that);

    toStrip = toStrip.split(',');

    if (contains(toStrip, 'ORIGIN')) {
        // clear them all to keep object consistent for auth invariant
        scheme = authority = host = port = userInfo = undefined; // orig uses undefined not nulls
    }
    if (contains(toStrip, 'PATH')) {
        path = ''; // dont use undefined, resulting path should be empty ("/")
    } else {
        if (contains(toStrip, 'CTX')) {
            assert(isSubPath(CTX, path), 'IllegalArgument, context not present');
            path = path.substring(CTX.length);
        } else if (contains(toStrip, 'CTX_PREFIX')) {
            if (isSubPath(UI_CTX_PREFIX, path)) {
                path = path.substring(UI_CTX_PREFIX.length);
            } else if (isSubPath(SVC_CTX_PREFIX, path)) {
                path = path.substring(SVC_CTX_PREFIX.length);
            } else {
                assert(false, 'IllegalArgument, context prefix not present');
            }
        }
        if (contains(toStrip, 'EXTENSION')) {
            const segments = uri.decodeSegments(path);
            const l = segments.length;
            if (l) {
                const last = segments[l - 1];
                const dotIndex = last.indexOf('.');
                if (dotIndex !== -1) {
                    segments[l - 1] = last.substring(0, dotIndex);
                    path = uri.encodeSegments(segments);
                }
            }
        }
    }
    if (contains(toStrip, 'QUERY')) {
        query = undefined;
    }
    if (contains(toStrip, 'FRAGMENT')) {
        fragment = undefined;
    }
    return uri.recomposeComponents({ scheme, authority, host, port, userInfo, path, query, fragment });
}

module.exports = {
    equalsQueryStr,
    isSubPath,
    clone,
    param,
    resolve,
    mixin,
    toString,
    toUri,
    strip,
    config
};
