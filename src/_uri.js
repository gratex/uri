const splitUriRegex = new RegExp( // IRI lib regexp
    '^' +
    '(([^:/?#]*):)?' + // scheme
    '(//((([^/?#@]*)@)?' + // user
    '(\\[[^/?#]*\\]|([^/?#:]*))?' + // host
    '(:([^/?#]*))?))?' + // port
    '([^#?]*)?' + // path
    '(\\?([^#]*))?' + // query
    '(#(.*))?' + // frag
    '$'
); //

// TODO: get rid of RFC2396 constants
const RFC2396_DIGIT = '0-9';
const RFC2396_LOWALPHA = 'a-z';
const RFC2396_UPALPHA = 'A-Z';
const RFC2396_ALPHA = RFC2396_LOWALPHA + RFC2396_UPALPHA;
const RFC2396_ALPHANUM = RFC2396_DIGIT + RFC2396_ALPHA;
const RFC3986_UNRESERVED = `${RFC2396_ALPHANUM}-._~`;
const RFC3986_SUBDELIMS = '\u0021\u0024\u0026\u0027\u0028\u0029\u002a\u002b\u002c\u003b\u003d';
const RFC3986_PCT_ENCODED = '';
const RFC3986_REG_NAME = `${RFC3986_UNRESERVED}${RFC3986_PCT_ENCODED}${RFC3986_SUBDELIMS}`;
const RFC3986_PCHAR = `${RFC3986_REG_NAME}:@`;
const RFC3986_QUERY = `${RFC3986_PCHAR}?/`;
const RFC3986_SEGMENT = RFC3986_PCHAR;
const RFC3986_FRAGMENT = `${RFC3986_PCHAR}?/`; /* "?/" */
const PCHAR_TOKENIZER = /(?:%[0-9A-Fa-f]{2}){1,}|./g; //
const RFC3986_PATH_SEGMENTS = `${RFC3986_SEGMENT}/`; /* "/" */
// TODO: get rid of RFC2396 constants

/**
* @summary uri string to be decomposed
* @param {string} uriStr
* @return {object}
*/
function decomposeComponents(uriStr) {
    /* eslint-disable-next-line array-bracket-spacing */ // (formatter has problems when starting with ,)
    const [,, scheme,, authority,, userInfo, host,,, port, path,, query,, fragment ] = uriStr.match(splitUriRegex);
    const u = { scheme, authority, path, query, fragment };
    if (u.authority != null) {
        Object.assign(u, { userInfo, port, host });
        // TODO: host null vs '' if authority defined but host not ?
        u.host == null && (u.host = '');
    }
    u.path == null && (u.path = '');
    return u;
}

/**
@summary recomposing authority from userInfo, host and port
@param {string} userInfo
@param {string} host
@param {string} port
@return {string}
*/
function recomposeAuthorityComponents(userInfo, host, port) {
    if (host == null) {
        throw new Error(`Illegal host:${host}`);
    }
    let result = '';
    result += userInfo != null ? `${userInfo}@` : '';
    result += host;
    result += port != null ? `:${port}` : '';
    return result;
}

function _checkAuthorityInvariant(authority, userInfo, host, port) {
    const b = (authority == null && userInfo == null && host == null && port == null) ||
        (authority != null && authority === recomposeAuthorityComponents(userInfo, host, port));
    if (!b) {
        throw new Error('IllegalStateException,AuthorityInvariant broken');
    }
}

/**
@summary this will recompose uri as string from each component
@param {object} uriObj
@return {string}
@see 5.3.  Component Recomposition  . . . . . . . . . . . . . . . . 35
Remarks:
defined(x) is coded with !=null (means undefined and null are handled the same way)
ignores "authority sub components"
*/
function recomposeComponents({ scheme, authority, userInfo, host, port, path, query, fragment }) {
    _checkAuthorityInvariant(authority, userInfo, host, port);

    let result = '';
    result += scheme != null ? `${scheme}:` : '';
    result += authority != null ? `//${authority}` : '';
    result += path;
    result += query != null ? `?${query}` : '';
    result += fragment != null ? `#${fragment}` : '';

    return result;
}

/**
@summary this will encode every character of string with hexadecimal ASCII code
@param {string} str
@param {string} legalRange regex pattern
*/
function percentEncode(str, legalRange) {
    const retVal = Array.from(str);
    const reLegal = legalRange && new RegExp(`[${legalRange}]`);
    function encode(cp, i, buff) {
        if (reLegal && cp.match(reLegal)) { return; }
        let enc = encodeURIComponent(cp);
        if (enc.length === 1) {
            enc = `%${cp.charCodeAt(0).toString(16).toUpperCase()}`;
        }
        buff[i] = enc;
    }
    retVal.forEach(encode);
    return retVal.join('');
}

/**
@summary this will remove dot segments in path
@param {string} path
@return {string}
*/
function removeDotSegments(path) {
    let inputBufferStart = 0;
    const inputBufferEnd = path.length;
    let output = '';
    let xi = '';
    while (inputBufferStart < inputBufferEnd) {
        let _in = path.substring(inputBufferStart);
        if (_in.indexOf('./') === 0) {
            inputBufferStart += 2;
            continue;
        }
        if (_in.indexOf('../') === 0) {
            inputBufferStart += 3;
            continue;
        }
        if (_in.indexOf('/./') === 0) {
            inputBufferStart += 2;
            continue;
        }
        if (_in === '/.') {
            _in = '/';
            inputBufferStart += 2;
        // force end of loop
        }
        if (_in.indexOf('/../') === 0) {
            inputBufferStart += 3;
            xi = output.lastIndexOf('/');
            if (xi !== -1 && xi !== output.length) {
                output = output.substring(0, xi);
            }
            continue;
        }
        if (_in === '/..') {
            _in = '/';
            inputBufferStart += 3;
            xi = output.lastIndexOf('/');
            if (xi !== -1 && xi !== output.length) {
                output = output.substring(0, xi);
            }
        }
        if (_in === '.') {
            inputBufferStart += 1;
            continue;
        }
        if (_in === '..') {
            inputBufferStart += 2;
            continue;
        }
        let nextSlash = _in.indexOf('/', 1);
        if (nextSlash === -1) {
            nextSlash = _in.length;
        }
        inputBufferStart += nextSlash;
        output += (_in.substring(0, nextSlash));
    }
    // 5.2.4 3
    return output;
}

// 5.2.3.  Merge Paths

function _merge({ authority, path }, refPath) { // object,string
    if (authority != null && path === '') {
        return `/${refPath}`;
    }
    const xi = path.lastIndexOf('/');
    return (xi === -1) ? refPath : path.substring(0, xi + 1) + refPath;
}

// 5.2.2.  Transform References

function _transformReference(base, { scheme, authority, userInfo, host, port, path, query, fragment }) {
    if (scheme == null) {
        scheme = base.scheme;
        if (authority == null) {
            ({ authority, userInfo, host, port } = base);
            if (path === '') {
                path = base.path;
                query = query != null ? query : base.query;
            } else {
                path = path.charAt(0) === '/' ? path : removeDotSegments(_merge(base, path));
            }
        }
    }
    path && (path = removeDotSegments(path));
    return { scheme, authority, userInfo, host, port, path, query, fragment };
}

// 5.2.1.  Pre-parse the Base URI

function _preParseBaseUri({ scheme }) {
    if (scheme == null) {
        throw new Error('Violation 5.2.1, scheme component required');
    }
}

/**
@summary TODO: I don't know what to write here
@param {object} base
@param {object} ref
@return {object}
*/
function resolve(base, ref) {
    _preParseBaseUri(base);
    return _transformReference(base, ref);
}

/**
@summary Spliting path by "/". Main reason is to eliminate unambiquity of "/a%2f%b/c" and "/a/b/c".
@param {string} encodedPath
@return {array} Path split to DECODED segments as array
*/
function decodeSegments(encodedPath) {
    if (encodedPath === '') {
        return [];
    }
    const segments = encodedPath.split('/');
    if (segments.shift() !== '') {
        throw new Error('path-abempty expected');
    }
    return segments.map((segment) => decodeURIComponent(segment));
}

/**
@summary Joining path segments by "/". Main reason is to eliminate unambiquity of "/a%2f%b/c" and "/a/b/c".
@param {array} segments array of segments not encoded
@return {string} path-abempty, ENCODED path, only characters specified in RFC3986_SEGMENT are encoded if [] specified "" is returned
*/
function encodeSegments(segments) {
    // summary:
    //		Joining path segments by /
    // 		Main reason is to eliminate unambiquity of
    // 		"/a%2f%b/c" and "/a/b/c"
    // segments: String[]
    //		array of segments not encoded
    // returns:	String
    //		path-abempty, ENCODED path, only characters specified in RFC3986_SEGMENT are encoded
    //		if [] specified "" is returned
    if (!(segments instanceof Array)) {
        throw new Error('IllegalArgumentException, array of segments expected');
    }
    if (segments.length === 0) {
        return '';
    }
    return `/${segments.map((segment) => percentEncode(segment, RFC3986_SEGMENT)).join('/')}`;
}

/**
@summary TODO: I don't know what to write here
@param {object} uriParent
@param {object} uriSub
@param {boolean} orSame
@return {boolean}
*/
function isSubordinate(uriParent, uriSub, orSame) {
    // if subordinate is absolute and parent is not or parent has different authority
    if (uriSub.authority != null && uriSub.authority !== uriParent.authority) {
        return false;
    }
    const i = uriSub.path.indexOf(uriParent.path);
    return i === 0 && (orSame || uriSub.path.length !== uriParent.path.length);
}
function encodeSegment(segment) {
    return percentEncode(segment, RFC3986_SEGMENT);
}

function encodeQuery(str) {
    return percentEncode(str, RFC3986_QUERY);
}

function encodeFragment(str) {
    return percentEncode(str, RFC3986_FRAGMENT);
}

/**
@summary Validates if string contains legalRange + valid pchars PCHAR. PCHARS represent valid UTF-8 sequence
@param {object} raw
@param {string} legalRange regex expression
@param {} doThrow
@return {error} NULL if ok, Error if failed
*/
function checkEncoding(raw, legalRange, doThrow /* , flags*/) {
    // TODO: flags: ILLEGAL_PERCENT_ENCODING, SUPERFLUOUS_ASCII_PERCENT_ENCODING
    // TODO: flags: PERCENT_ENCODING_SHOULD_BE_UPPERCASE, SUPERFLUOUS_NON_ASCII_PERCENT_ENCODING
    if (!raw) {
        return null;
    }
    const reLegal = new RegExp(`[${legalRange}]`);
    const tokens = raw.match(PCHAR_TOKENIZER);
    for (let i = 0; i < tokens.length; i++) {
        const t = tokens[i];
        if (t.length > 1) {
            try {
                decodeURIComponent(t);
            } catch (ex) {
                const e = new Error(`Illegal PCHAR sequence:${t}`);
                if (doThrow) {
                    throw e;
                }
                return e;
            }
        } else if (!t.match(reLegal)) {
            const e = new Error(`Illegal PCHAR sequence:${t}`);
            if (doThrow) {
                throw e;
            }
            return e;
        }
    }
    return null;
}

function checkSegmentsEncoding(str, doThrow) {
    return checkEncoding(str, RFC3986_PATH_SEGMENTS, doThrow);
}

function checkSegmentEncoding(str, doThrow) {
    return checkEncoding(str, RFC3986_SEGMENT, doThrow);
}

function checkQueryEncoding(str, doThrow) {
    return checkEncoding(str, RFC3986_QUERY, doThrow);
}

function checkFragmentEncoding(str, doThrow) {
    return checkEncoding(str, RFC3986_FRAGMENT, doThrow);
}

/**
* @summary Striktna varianta rozoznavajuca empty a undefined query.
* @param {string} query  Ak undefined alebo null vracia null. Ak "" vracia {}, inak vracia {p1:v1,ps:[]},
*   ocakavane bez delimitera (?,#) teda z naseho API
* @param {Uri} bDecode Default false, ci dekodovat mena a values
* @return {any}
*/
function parseQuery(query, bDecode) {
    // returns:	Object
    if (query == null) { return null; }
    if (query === '') { return {}; }

    return query.split('&').reduce((obj, part) => {
        const [ name, val ] = part.split('=').map(bDecode ? decodeURIComponent : (p) => p);
        const currVal = obj[name];
        return {
            ...obj,
            [name]: currVal == null ? val : (Array.isArray(currVal) ? (currVal.push(val), currVal) : [ currVal, val ])
        };
    }, {});
}

module.exports = {
    checkEncoding,
    checkFragmentEncoding,
    checkQueryEncoding,
    checkSegmentEncoding,
    checkSegmentsEncoding,
    decodeSegments,
    decomposeComponents,
    encodeFragment,
    encodeQuery,
    encodeSegment,
    encodeSegments,
    isSubordinate,
    parseQuery,
    percentEncode,
    recomposeAuthorityComponents,
    recomposeComponents,
    removeDotSegments,
    resolve
};
