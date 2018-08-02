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

function equals(that1, that2, ignoreFragment) {
    // summary:
    //		Use to test if URIs are equal. Order of query params is ignored.
    // that1: String|Object|null
    //		URI string or URI object. Current window URI used when null or undefined.
    // that2: String|Object|null
    //		URI string or URI object. Current window URI used when null or undefined.
    // ignoreFragment: Boolean?
    //		When true, fragment (hash) is ignored when determining equality.
    // returns: Boolean
    //		True if URIs are equal, false otherwise.

    const { scheme, authority, path, query, fragment } = param(that1);
    const { scheme: scheme2, authority: authority2, path: path2, query: query2, fragment: fragment2 } = param(that2);

    return scheme === scheme2 && // return Boolean
        authority === authority2 && path === path2 && this.equalsQueryStr(query, query2) &&
        (ignoreFragment || fragment === fragment2);
}

// basic getters

function getScheme(that) {
    // summary:
    //		Use instead of location.protocol
    // that: String|Object|null
    //		URI string or URI object. Current window URI used when null or undefined.
    // returns: String|undefined
    //		String without ':' delimiter.
    const { scheme } = param(that);
    return scheme;
}

function getAuthority(that) {
    // summary:
    //		Use instead of location.host.
    // that: String|Object|null
    //		URI string or URI object. Current window URI used when null or undefined.
    const { authority } = param(that);
    return authority;
}

function getUserInfo(that) {
    // summary:
    //		Use to get user info. No equivalent in location.
    // that: String|Object|null
    //		URI string or URI object. Current window URI used when null or undefined.
    const { userInfo } = param(that);
    return userInfo;
}

function getHost(that) {
    // summary:
    //		Use instead of location.hostname.
    // that: String|Object|null
    //		URI string or URI object. Current window URI used when null or undefined.
    const { host } = param(that);
    return host;
}

function getPort(that) {
    // summary:
    //		Use instead of location.port.
    // that: String|Object|null
    //		URI string or URI object. Current window URI used when null or undefined.
    const { port } = param(that);
    return port;
}

function getPath(that) {
    // summary:
    //		Use instead of location.search.
    // that: String|Object|null
    //		URI string or URI object. Current window URI used when null or undefined.
    // returns: String|undefined
    //		String starting by '/'.
    const { path } = param(that);
    return path;
}

function getQuery(that, toObject) {
    // summary:
    //		Use instead of location.search.
    // that: String|Object|null
    //		URI string or URI object. Current window URI used when null or undefined.
    // toObject: Boolean?
    //		If `true` query is returned as object.
    // returns: String|Object|undefined
    //		String without '?' delimiter or key-value object.
    //		/test, false		-> undefined
    //		/test?, false		-> ""
    //		/test?a=10, false	-> "a=10"
    //
    //		/test, true			-> undefined
    //		/test?, true		-> {}
    //		/test?a=10, true	-> {a:"10"}
    const { query } = param(that);

    if (toObject) {
        return query === undefined ? undefined : //
            uri.parseQuery(query, true); // "" -> {}
    }
    return query; // 1:1 with small uri.js, undefined, "" or string
}

function getFragment(that) {
    // summary:
    //		Use instead of location.hash.
    // that: String|Object|null
    //		URI string or URI object. Current window URI used when null or undefined.
    // returns: String|undefined
    //		String without '#' delimiter.
    const { fragment } = param(that);
    // NTH: implement toObject
    //			if (toObject && u.fragment != null) {
    //				return ioQuery.queryToObject(u.fragment) || u.fragment;
    //			}
    return fragment;
}

function getSegments(that) {
    // summary:
    //		Use to get path segments.
    // that: String|Object|null
    //		URI string or URI object. Current window URI used when null or undefined.
    // returns: String[]
    //		Array of strings, last is "" if path denotes a folder.
    const { path } = param(that);
    return uri.decodeSegments(path);
}

// basic setters
function setScheme(that, scheme) {
    // summary:
    //		Use to set scheme.
    // that: String|Object|null
    //		URI string or URI object. Current window URI used when null or undefined.
    // scheme: String
    //		Scheme.
    // returns: String
    //		Modified copy of `that`.
    const u = param(that);
    u.scheme = scheme;
    return uri.recomposeComponents(u);
}
function setAuthority(that, authority) {
    // summary:
    //		Use to set authority.
    // that: String|Object|null
    //		URI string or URI object. Current window URI used when null or undefined.
    // authority: S[ '', '' ]tring
    //		Authority.
    // returns: String
    //		Modified copy of `that`.
    const u = param(that);

    u.authority = authority;
    if (authority) {
        // NTH: uri.decomposeAuthorityComponents function
        const { userInfo, host, port } = uri.decomposeComponents(`//${authority}`);
        Object.assign(u, { userInfo, host, port });
    } else {
        u.userInfo = u.host = u.port = undefined;
    }
    return uri.recomposeComponents(u);
}
function setUserInfo(that, userInfo) {
    // summary:
    //		Use to set user info.
    // that: String|Object|null
    //		URI string or URI object. Current window URI used when null or undefined.
    // userInfo: String
    //		User info.
    // returns: String
    //		Modified copy of `that`.
    const u = param(that);
    u.userInfo = userInfo;
    u.authority = uri.recomposeAuthorityComponents(userInfo, u.host, u.port);
    return uri.recomposeComponents(u);
}
function setHost(that, host) {
    // summary:
    //		Use to set host.
    // that: String|Object|null
    //		URI string or URI object. Current window URI used when null or undefined.
    // host: String
    //		Host.
    // returns: String
    //		Modified copy of `that`.
    const u = param(that);
    u.host = host;
    u.authority = uri.recomposeAuthorityComponents(u.userInfo, host, u.port);
    return uri.recomposeComponents(u);
}
function setPort(that, port) {
    // summary:
    //		Use to set port.
    // that: String|Object|null
    //		URI string or URI object. Current window URI used when null or undefined.
    // port: String
    //		Port.
    // returns: String
    //		Modified copy of `that`.
    const u = param(that);
    u.port = port;
    u.authority = uri.recomposeAuthorityComponents(u.userInfo, u.host, port);
    return uri.recomposeComponents(u);
}
function setPath(that, path) {
    // summary:
    //		Use to set path.
    // that: String|Object|null
    //		URI string or URI object. Current window URI used when null or undefined.
    // path: String
    //		Encoded path.
    // returns: String
    //		Modified copy of `that`.
    const u = param(that);
    uri.checkSegmentsEncoding(path, true); // throws error is unencoded
    u.path = path;
    return uri.recomposeComponents(u);
}
function setQuery(that, query) {
    // summary:
    //		Use to set query.
    // that: String|Object|null
    //		URI string or URI object. Current window URI used when null or undefined.
    // query: String|Object
    //		Encoded string or unencoded key-value object.
    // returns: String
    //		Modified copy of `that`.
    const u = param(that);
    query && typeof query != 'string' && (query = querystring.stringify(query));
    uri.checkQueryEncoding(query, true); // throws error is unencoded
    u.query = query;
    return uri.recomposeComponents(u);
}
function appendQuery(that, query) {
    // summary:
    //		Use to append query.
    // that: String|Object|null
    //		URI string or URI object. Current window URI used when null or undefined.
    // query: String|Object
    //		Encoded string or key-value object.
    // returns: String
    //		Modified copy of `that`.
    if (!query) {
        return paramString(that);
    }
    const origQuery = this.getQuery(that);
    typeof query != 'string' && (query = querystring.stringify(query));
    return this.setQuery(that, (origQuery ? `${origQuery}&` : '') + query);
}
function setFragment(that, fragment) {
    // summary:
    //		Use to set fragment.
    // that: String|Object|null
    //		URI string or URI object. Current window URI used when null or undefined.
    // fragment: String|Object
    //		Encoded string or key-value object.
    // returns: String
    //		Modified copy of `that`.
    const u = param(that);
    fragment && typeof fragment != 'string' && (fragment = querystring.stringify(fragment));
    uri.checkFragmentEncoding(fragment, true); // throws error is unencoded
    u.fragment = fragment;
    return uri.recomposeComponents(u);
}
function appendFragment(that, fragment) {
    // summary:
    //		Use to append fragment.
    // that: String|Object|null
    //		URI string or URI object. Current window URI used when null or undefined.
    // fragment: String|Object
    //		Encoded string or key-value object.
    // returns: String
    //		Modified copy of `that`.
    if (!fragment) {
        return paramString(that);
    }
    const origFragment = this.getFragment(that);
    typeof fragment != 'string' && (fragment = querystring.stringify(fragment));
    return this.setFragment(that, (origFragment ? `${origFragment}&` : '') + fragment); // return String
}
function setSegments(that, segments) {
    // summary:
    //		Use to set path segments.
    // that: String|Object|null
    //		URI string or URI object. Current window URI used when null or undefined.
    // segments: String[]
    //		Array of unencoded path segments.
    // returns: String
    //		Modified copy of `that`.
    return this.setPath(that, uri.encodeSegments(segments));
}
function appendSegments(that) {
    // summary:
    //		Use to append path segments.
    // that: String|Object|null
    //		URI string or URI object. Current window URI used when null or undefined.
    // segments: String[]|String...
    //		Array or multiple arguments of unencoded path segments.
    // returns: String
    //		Modified copy of `that`.

    const segments = this.getSegments(that);
    let appendSegmets = Array.prototype.slice.call(arguments, 1);
    (Array.isArray(appendSegmets[0])) && (appendSegmets = appendSegmets[0]);
    assert(appendSegmets[0] != null, 'IllegalArgument, segments argument not present');
    !segments[segments.length - 1] && segments.pop(); // isLastSegmentEmpty
    return this.setSegments(that, segments.concat(appendSegmets));
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
    config,
    equals,
    getScheme,
    getAuthority,
    getUserInfo,
    getHost,
    getPort,
    getPath,
    getQuery,
    getFragment,
    getSegments,
    setScheme,
    setAuthority,
    setUserInfo,
    setHost,
    setPort,
    setPath,
    setQuery,
    setFragment,
    setSegments,
    appendFragment,
    appendSegments,
    appendQuery
};
