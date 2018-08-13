/**
 *@module Uri
*/

const assert = require('assert');
const isEqualWith = require('lodash.isequalwith');
const querystring = require('querystring');
const uri = require('./_uri');
let CTX = '';
let SVC_CTX_PREFIX = '';
let UI_CTX_PREFIX = '';
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
        if (a instanceof Array && b instanceof Array) {
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
    that != null || (that = DEFAULT_THAT); // let '' continue
    return (typeof that == 'string') ? uri.decomposeComponents(that) : clone(that);
}
function _resolve(base, ref) {
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

/**
* @summary Use to set multiple URI parts at once.
* @param {string|object|null} that URI string or URI object. Current window URI used when null or undefined.
* @param {object} obj Available properties: `scheme`, `authority`, `userInfo`, `host`, `port`, `path`, `query`, `fragment`.
* @memberof module:Uri
* @return {string} Modified copy of `that`.
*/
function mixin(that, { authority, userInfo, host, port, scheme, path, query, fragment }) {
    const u = param(that);

    /* 'app/_base/rql' */
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

/**
 * @summary Use to convert uri object to string.
 * @param {string|object|null} that URI string or URI object. Current window URI used when null or undefined.
 * @memberof module:Uri
 * @returns {string} URI string.
 */
function toString(that) {
    return paramString(that);
}

/**
 * @summary Use to convert uri to uri object.
 * @param {string|object|null} that URI string or URI object. Current window URI used when null or undefined.
 * @memberof module:Uri
 * @returns {object} URI object with properties: `scheme`, `authority`, `userInfo`, `host`, `port`, `path`, `query`, `fragment`.
 */
function toUri(that) {
    return param(that);
}

/**
 * @summary Use to strip some parts of URI.
 * @param {string|object|null} that URI string or URI object. Current window URI used when null or undefined.
 * @param {string} toStrip Comma separated values, available are: 'ORIGIN', 'CTX', 'EXTENSION', 'QUERY', 'FRAGMENT'.
 * @memberof module:Uri
 * @returns {string} Modified copy of `that`.
 * @example Uri.strip(uriStr, 'QUERY,FRAGMENT');
 */
function strip(that, toStrip) {
    let { scheme, authority, host, port, userInfo, path, query, fragment } = param(that);

    toStrip = toStrip.split(',');

    if (contains(toStrip, 'ORIGIN')) {
        // clear them all to keep object consistent for auth invariant
        scheme = authority = host = port = userInfo = undefined; // orig uses undefined not nulls
    }
    if (contains(toStrip, 'PATH')) {
        path = ''; // dont use undefined, resulting path should be empty ('/')
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

/**
 * @summary Use to test if URIs are equal. Order of query params is ignored.
 * @param {string|object|null} that1 URI string or URI object. Current window URI used when null or undefined.
 * @param {string|object|null} that2 URI string or URI object. Current window URI used when null or undefined.
 * @param {boolean} ignoreFragment When true, fragment (hash) is ignored when determining equality.\
 * @memberof module:Uri
 * @returns {boolean} True if URIs are equal, false otherwise.
 */
function equals(that1, that2, ignoreFragment) {
    const { scheme, authority, path, query, fragment } = param(that1);
    const { scheme: scheme2, authority: authority2, path: path2, query: query2, fragment: fragment2 } = param(that2);

    return scheme === scheme2 && // return Boolean
        authority === authority2 && path === path2 && this.equalsQueryStr(query, query2) &&
        (ignoreFragment || fragment === fragment2);
}

// basic getters
/**
 * @summary Use instead of location.protocol
 * @param {string|object|null} that URI string or URI object. Current window URI used when null or undefined.
 * @memberof module:Uri
 * @returns {string|undefined} String without ':' delimiter.
 */
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

/**
 * @summary Use instead of location.host.
 * @param {string|object|null} that URI string or URI object. Current window URI used when null or undefined.
 * @memberof module:Uri
 * @returns {string|undefined}
 */
function getAuthority(that) {
    const { authority } = param(that);
    return authority;
}

/**
 * @summary Use to get user info. No equivalent in location.
 * @param {string|object|null} that URI string or URI object. Current window URI used when null or undefined.
 * @memberof module:Uri
 * @returns {string|undefined}
 */
function getUserInfo(that) {
    const { userInfo } = param(that);
    return userInfo;
}

/**
 * @summary Use instead of location.hostname.
 * @param {string|object|null} that URI string or URI object. Current window URI used when null or undefined.
 * @memberof module:Uri
 * @returns {string|undefined}
 */
function getHost(that) {
    const { host } = param(that);
    return host;
}

/**
 * @summary Use instead of location.port.
 * @param {string|object|null} that URI string or URI object. Current window URI used when null or undefined.
 * @memberof module:Uri
 * @returns {string|undefined}
 */
function getPort(that) {
    const { port } = param(that);
    return port;
}

/**
 * @summary Use instead of location.search.
 * @param {string|object|null} that URI string or URI object. Current window URI used when null or undefined.
 * @memberof module:Uri
 * @returns {string|undefined} String starting by '/'.
 */
function getPath(that) {
    const { path } = param(that);
    return path;
}

/**
 * @summary Use instead of location.search.
 * @param {string|object|null} that URI string or URI object. Current window URI used when null or undefined.
 * @param {boolean} toObject If `true` query is returned as object.
 * @memberof module:Uri
 * @returns {string|object|undefined} String without '?' delimiter or key-value object.
 */
function getQuery(that, toObject) {
    const { query } = param(that);

    if (toObject) {
        return query === undefined ? undefined : //
            uri.parseQuery(query, true); // '' -> {}
    }
    return query; // 1:1 with small uri.js, undefined, '' or string
}

/**
 * @summary Use instead of location.hash.
 * @param {string|object|null} that URI string or URI object. Current window URI used when null or undefined.
 * @memberof module:Uri
 * @returns {string|undefined} String without '#' delimiter.
 */
function getFragment(that) {
    const { fragment } = param(that);
    // NTH: implement toObject
    //			if (toObject && u.fragment != null) {
    //				return ioQuery.queryToObject(u.fragment) || u.fragment;
    //			}
    return fragment;
}

/**
 * @summary Use to get path segments.
 * @param {string|object|null} that URI string or URI object. Current window URI used when null or undefined.
 * @memberof module:Uri
 * @returns {Array<string>} Array of strings, last is '' if path denotes a folder.
 */
function getSegments(that) {
    const { path } = param(that);
    return uri.decodeSegments(path);
}

// basic setters
/**
 * @summary Use to set scheme.
 * @param {string|object|null} that URI string or URI object. Current window URI used when null or undefined.
 * @param {string} scheme Scheme.
 * @memberof module:Uri
 * @returns {string} Modified copy of `that`.
 */
function setScheme(that, scheme) {
    const u = param(that);

    return uri.recomposeComponents({
        ...u,
        scheme
    });
}

/**
 * @summary Use to set authority.
 * @param {string|object|null} that URI string or URI object. Current window URI used when null or undefined.
 * @param {string} authority Authority.
 * @memberof module:Uri
 * @returns {string} Modified copy of `that`.
 */
function setAuthority(that, authority) {
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

/**
 * @summary Use to set user info.
 * @param {string|object|null} that URI string or URI object. Current window URI used when null or undefined.
 * @param {string} userInfo User info.
 * @memberof module:Uri
 * @returns {string} Modified copy of `that`.
 */
function setUserInfo(that, userInfo) {
    const u = param(that);

    return uri.recomposeComponents({
        ...u,
        userInfo,
        authority: uri.recomposeAuthorityComponents(userInfo, u.host, u.port)
    });
}

/**
 * @summary Use to set host.
 * @param {string|object|null} that URI string or URI object. Current window URI used when null or undefined.
 * @param {string} host Host.
 * @memberof module:Uri
 * @returns {string} Modified copy of `that`.
 */
function setHost(that, host) {
    const u = param(that);
    return uri.recomposeComponents({
        ...u,
        host,
        authority: uri.recomposeAuthorityComponents(u.userInfo, host, u.port)
    });
}

/**
 * @summary Use to set port.
 * @param {string|object|null} that URI string or URI object. Current window URI used when null or undefined.
 * @param {string} port Port.
 * @memberof module:Uri
 * @returns {string} Modified copy of `that`.
 */
function setPort(that, port) {
    const u = param(that);
    return uri.recomposeComponents({
        ...u,
        port,
        authority: uri.recomposeAuthorityComponents(u.userInfo, u.host, port)
    });
}

/**
 * @summary Use to set path.
 * @param {string|object|null} that URI string or URI object. Current window URI used when null or undefined.
 * @param {string} path Encoded path.
 * @memberof module:Uri
 * @returns {string} Modified copy of `that`.
 */
function setPath(that, path) {
    const u = param(that);
    uri.checkSegmentsEncoding(path, true); // throws error is unencoded

    return uri.recomposeComponents({
        ...u,
        path
    });
}

/**
 * @summary Use to set query.
 * @param {string|object|null} that URI string or URI object. Current window URI used when null or undefined.
 * @param {string|object} query Encoded string or unencoded key-value object.
 * @memberof module:Uri
 * @returns {string} Modified copy of `that`.
 */
function setQuery(that, query) {
    const u = param(that);
    query && typeof query != 'string' && (query = querystring.stringify(query));
    uri.checkQueryEncoding(query, true); // throws error is unencoded
    u.query = query;
    return uri.recomposeComponents(u);
}

/**
 * @summary Use to append query.
 * @param {string|object|null} that URI string or URI object. Current window URI used when null or undefined.
 * @param {string|object} query Encoded string or unencoded key-value object.
 * @memberof module:Uri
 * @returns {string} Modified copy of `that`.
 */
function appendQuery(that, query) {
    if (!query) {
        return paramString(that);
    }
    const origQuery = this.getQuery(that);
    typeof query != 'string' && (query = querystring.stringify(query));
    return this.setQuery(that, `${origQuery ? `${origQuery}&` : ''}${query}`);
}

/**
 * @summary Use to set fragment.
 * @param {string|object|null} that URI string or URI object. Current window URI used when null or undefined.
 * @param {string|object} fragment Encoded string or key-value object.
 * @memberof module:Uri
 * @returns {string} Modified copy of `that`.
 */
function setFragment(that, fragment) {
    const u = param(that);
    fragment && typeof fragment != 'string' && (fragment = querystring.stringify(fragment));
    uri.checkFragmentEncoding(fragment, true); // throws error is unencoded
    u.fragment = fragment;
    return uri.recomposeComponents(u);
}

/**
 * @summary Use to append fragment.
 * @param {string|object|null} that URI string or URI object. Current window URI used when null or undefined.
 * @param {string|object} fragment Encoded string or key-value object.
 * @memberof module:Uri
 * @returns {string} Modified copy of `that`.
 */
function appendFragment(that, fragment) {
    if (!fragment) {
        return paramString(that);
    }
    const origFragment = this.getFragment(that);
    typeof fragment != 'string' && (fragment = querystring.stringify(fragment));
    return this.setFragment(that, `${origFragment ? `${origFragment}&` : ''}${fragment}`); // return String
}

/**
 * @summary Use to set segments.
 * @param {string|object|null} that URI string or URI object. Current window URI used when null or undefined.
 * @param {Array<string>} segments Array of unencoded path segments.
 * @memberof module:Uri
 * @returns {string} Modified copy of `that`.
 */
function setSegments(that, segments) {
    return this.setPath(that, uri.encodeSegments(segments));
}

/**
 * @summary Use to append path segments.
 * @param {string|object|null} that URI string or URI object. Current window URI used when null or undefined.
 * @param {Array<string>|string} segments Array or multiple arguments of unencoded path segments.
 * @memberof module:Uri
 * @returns {string} Modified copy of `that`.
 */
function appendSegments(that, ...appendSegmets) {
    (Array.isArray(appendSegmets[0])) && (appendSegmets = appendSegmets[0]);
    assert(appendSegmets[0] != null, 'IllegalArgument, segments argument not present');
    const segments = this.getSegments(that);
    !segments[segments.length - 1] && segments.pop(); // isLastSegmentEmpty
    return this.setSegments(that, segments.concat(appendSegmets));
}

// stripping specific parts of URI
/**
 * @summary Use to get path with query and fragment.
 * @param {string|object|null} that URI string or URI object. Current window URI used when null or undefined.
 * @memberof module:Uri
 * @returns {string} Modified copy of `that`.
 */
function stripOrigin(that) {
    return this.strip(that, 'ORIGIN');
}

/**
 * @summary Use to get uri without path extension.
 * @param {string|object|null} that URI string or URI object. Current window URI used when null or undefined.
 * @memberof module:Uri
 * @returns {string} Modified copy of `that`.
 * @example Uri.stripExtension('/samples/ui/test/aam-test.standalone'); // '/samples/ui/test/aam-test'
 */
function stripExtension(that) {
    return this.strip(that, 'EXTENSION');
}

/**
 * @summary Use to get path after context with query and fragment.
 * @param {string|object|null} that URI string or URI object. Current window URI used when null or undefined.
 * @memberof module:Uri
 * @returns {string} Modified copy of `that`.
 */
function stripCtxPath(that) {
    return this.strip(that, 'ORIGIN,CTX');
}

/**
 * @summary Use to get path after context prefix (UI or svc) with query and fragment.
 * @param {string|object|null} that URI string or URI object. Current window URI used when null or undefined.
 * @memberof module:Uri
 * @returns {string} Modified copy of `that`.
 */
function stripCtxPrefix(that) {
    return this.strip(that, 'ORIGIN,CTX_PREFIX');
}

/**
 * @summary Use to get origin, i.e. everything before path.
 * @param {string|object|null} that URI string or URI object. Current window URI used when null or undefined.
 * @memberof module:Uri
 * @returns {string} Modified copy of `that`.
 */
function stripPath(that) {
    return this.strip(that, 'PATH,QUERY,FRAGMENT');
}

/**
 * @summary Use to get URI without query.
 * @param {string|object|null} that URI string or URI object. Current window URI used when null or undefined.
 * @memberof module:Uri
 * @returns {string} Modified copy of `that`.
 */
function stripQuery(that) {
    return this.strip(that, 'QUERY');
}

/**
 * @summary Use to get URI without fragment.
 * @param {string|object|null} that URI string or URI object. Current window URI used when null or undefined.
 * @memberof module:Uri
 * @returns {string} Modified copy of `that`.
 */
function stripFragment(that) {
    return this.strip(that, 'FRAGMENT');
}

/**
 * @summary Use to get path after context and before extension.
 * @param {string|object|null} that URI string or URI object. Current window URI used when null or undefined.
 * @memberof module:Uri
 * @returns {string} Modified copy of `that`.
 */
function getScreenPath(that) {
    return this.strip(that, 'ORIGIN,CTX,EXTENSION,QUERY,FRAGMENT');
}

/**
 * @summary Use to get the last path segment.
 * @param {string|object|null} that URI string or URI object. Current window URI used when null or undefined.
 * @memberof module:Uri
 * @returns {string} Empty string when `that` denotes folder, `undefined` if path is empty.
 */
function getLastSegment(that) {
    const { path } = param(that);
    return uri.decodeSegments(path).pop();
}

// NTH: getLastNonVoidSegment ???
/**
 * @summary Use to test if path ends with '/'.
 * @param {string|object|null} that URI string or URI object. Current window URI used when null or undefined.
 * @memberof module:Uri
 * @returns {boolean}
 */
function denotesFolder(that) {
    // will be string so this should be enough
    return this.getLastSegment(that) === '';
}

/**
 * @summary Use to convert URI path to folder.
 * @param {string|object|null} that URI string or URI object. Current window URI used when null or undefined.
 * @memberof module:Uri
 * @returns {string} Modified copy of `that` ending with '/'.
 * @example Uri.convertToFolder('/samples/ui/test/aam-test');	// 	'/samples/ui/test/'
 */
function convertToFolder(that) {
    let { path, ...others } = param(that);
    const segments = uri.decodeSegments(path);
    if (segments.length) {
        segments[segments.length - 1] = '';
    } else {
        segments.push('');
    }
    path = uri.encodeSegments(segments);
    return uri.recomposeComponents({ path, ...others });
}

/**
 * @summary Use to test if ref URI is subordiante of base URI.
 * @param {string|object|null} that Base URI. URI string or URI object. Current window URI used when null or undefined.
 * @param {string|object|null} ref Ref URI. URI string or URI object. Current window URI used when null or undefined.
 * @memberof module:Uri
 * @returns {boolean} True if `ref` is subordinate of `base`.
 */
function isSubordinate(that, ref) {
    return uri.isSubordinate(param(that), param(ref), true);
}

/**
 * @summary Use to resolve ref URI using base URI.
 * @param {string|object|null} that Base URI. URI string or URI object. Current window URI used when null or undefined.
 * @param {string|object|null} ref Ref URI. URI string or URI object. Current window URI used when null or undefined.
 * @memberof module:Uri
 * @returns {string} Modified copy of `that`.
 */
function resolve(that, ref) {
    const s = _resolve(param(that), param(ref));
    return uri.recomposeComponents(s);
}

/**
 * @summary Use to resolve ref URI as subordinate of base URI.
 * @param {string|object|null} that Base URI. URI string or URI object. Current window URI used when null or undefined.
 * @param {string|object|null} ref Ref URI. URI string or URI object. Current window URI used when null or undefined.
 * @memberof module:Uri
 * @returns {string} Modified copy of `that`.
 */
function resolveAsSubordinate(that, ref) {
    const u = param(convertToFolder(that));
    const s = _resolve(u, param(ref));
    assert(isSubordinate(u, s), 'IllegalArgument, not subordinate');
    return uri.recomposeComponents(s);
}

/**
 * @summary Use to retrieve resource id from RESTful URI.
 * @param {string|object|null} that URI string or URI object. Current window URI used when null or undefined.
 * @memberof module:Uri
 * @returns {number} Id.
 */
function parseId(that) {
    const id = parseInt(getLastSegment(that), 10);
    assert(!isNaN(id), 'IllegalArgument, numeric id not present');
    return id;
}

module.exports = {
    appendFragment,
    appendQuery,
    appendSegments,
    config,
    convertToFolder,
    denotesFolder,
    equals,
    equalsQueryStr,
    getAuthority,
    getFragment,
    getHost,
    getLastSegment,
    getPath,
    getPort,
    getQuery,
    getScheme,
    getScreenPath,
    getSegments,
    getUserInfo,
    mixin,
    parseId,
    resolve,
    resolveAsSubordinate,
    setAuthority,
    setFragment,
    setHost,
    setPath,
    setPort,
    setQuery,
    setScheme,
    setSegments,
    setUserInfo,
    strip,
    stripCtxPath,
    stripCtxPrefix,
    stripExtension,
    stripFragment,
    stripOrigin,
    stripPath,
    stripQuery,
    toString,
    toUri
};
