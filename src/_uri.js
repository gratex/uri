const splitUriRegex = new RegExp( // IRI lib regexp
    '^' +
    '(([^:/?#]*):)?' + // scheme
    '(//((([^/?#@]*)@)?' + // user
    '(\\[[^/?#]*\\]|([^/?#:]*))?' + // host
    '(:([^/?#]*))?))?' + // port
    '([^#?]*)?' + // path
    '(\\?([^#]*))?' + // query
    '(#(.*))?' + // frag
    '$'); //


// TODO: get rid of RFC2396 constants
const RFC2396_DIGIT = '0-9';
const RFC2396_LOWALPHA = 'a-z';
const RFC2396_UPALPHA = 'A-Z';
const RFC2396_ALPHA = RFC2396_LOWALPHA + RFC2396_UPALPHA;
const RFC2396_ALPHANUM = RFC2396_DIGIT + RFC2396_ALPHA;
const RFC3986_UNRESERVED = `${RFC2396_ALPHANUM}'-._~'`;
const RFC3986_SUBDELIMS = '\u0021\u0024\u0026\u0027\u0028\u0029\u002a\u002b\u002c\u003b\u003d';
const RFC3986_PCT_ENCODED = '';
const RFC3986_REG_NAME = `${RFC3986_UNRESERVED}${RFC3986_PCT_ENCODED}${RFC3986_SUBDELIMS}`;
const RFC3986_PCHAR = `${RFC3986_REG_NAME}':@'`;
const RFC3986_QUERY = `${RFC3986_PCHAR}'?/'`;

// TODO: get rid of RFC2396 constants

function decomposeComponents(uriStr) {
    /* eslint-disable-next-line array-bracket-spacing */ // (formatter has problems when starting with ,)
    const [,, scheme,, authority,, userInfo, host,,, port, path,, query,, fragment ] = uriStr.match(splitUriRegex);
    const u = { scheme, authority, path, query, fragment };

    if (u.authority != null) {
        Object.assign(u, {
            userInfo,
            port,
            host
        });
        // TODO: host null vs "" if authority defined but host not ?
        u.host == null && (u.host = '');
    }
    u.path == null && (u.path = '');
    return u;
}

/**
 @see 5.3.  Component Recomposition  . . . . . . . . . . . . . . . . 35
 Remarks:
 defined(x) is coded with !=null (means undefined and null are handled the same way)
 ignores "authority sub components"
 **/
function recomposeAuthorityComponents(userInfo, host, port) {
    if (host == null) {
        throw new Error(`Illegal host:${ host}`);
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

function percentEncode(str, legalRange) {
    const retVal = Array.from(str);
    const reLegal = legalRange && new RegExp(`[${legalRange}]`);

    function encode(cp, i, buff) {
        if (reLegal && cp.match(reLegal)) {
            return;
        }
        let enc = encodeURIComponent(cp);
        if (enc.length === 1) {
            enc = `%${cp.charCodeAt(0).toString(16).toUpperCase()}`;
        }
        buff[i] = enc;
    }
    retVal.forEach(encode);
    return retVal.join('');
}

function encodeQuery(str) {
    return percentEncode(str, RFC3986_QUERY);
}

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

module.exports = {
    decomposeComponents,
    recomposeAuthorityComponents,
    recomposeComponents,
    encodeQuery,
    removeDotSegments
};
