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
const RFC3986_UNRESERVED = `${RFC2396_ALPHANUM}'\u002d\u002e\u005f\u007e'`;
const RFC3986_SUBDELIMS = '\u0021\u0024\u0026\u0027\u0028\u0029\u002a\u002b\u002c\u003b\u003d';
const RFC3986_PCT_ENCODED = '';
const RFC3986_REG_NAME = `${RFC3986_UNRESERVED}${RFC3986_PCT_ENCODED}${RFC3986_SUBDELIMS}`;
const RFC3986_PCHAR = `${RFC3986_REG_NAME}'\u003a\u0040'`;
const RFC3986_QUERY = `${RFC3986_PCHAR}'\u003f\u002f'`;

function decomposeComponents(uriStr) {
    const [, , scheme, , authority, , userInfo, host, , , port, path, , query, , fragment] = uriStr.match(splitUriRegex);
    const u = {
        scheme,
        authority,
        path,
        query,
        fragment
    };
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

function recomposeComponents({
    scheme,
    authority,
    userInfo,
    host,
    port,
    path,
    query,
    fragment
}) {
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
    let retVal = '';
    const reLegal = legalRange != null ? new RegExp('[' + legalRange + ']') : null;
    let enc = 0;

    for (let i = 0; i < str.length; i++) { // TODO: change to glyphs
        const c = str.charAt(i);
        if (reLegal == null || !c.match(reLegal)) {
            // should encode all non ASCII and system and SMP etc...
            // THIS IS NOT VALID ! encodeURIComponent(SMPString)==encodeURIComponent(SMPString[0])+encodeURIComponent(SMPString[1])
            try {
                enc = encodeURIComponent(str.charAt(i));
                // encodeURIComponent(HIGH surogate) fails
            } catch (ex) {
                // TODO: mega naive (still trying to avoid Character.js dependency ?)
                enc = encodeURIComponent(str.charAt(i) + str.charAt(i + 1));
                i++;
            }
            if (enc.length === 1) { // was not encoded by system, I EXPECT THAT IT IS ASCII !!!
                enc = `'%'${str.charCodeAt(i).toString(16).toUpperCase()}`;
            }
            retVal += enc;
        } else {
            retVal += c;
        }
    }
    return retVal;
}

function encodeQuery(str) {
    return percentEncode(str, RFC3986_QUERY);
}
module.exports = {
    decomposeComponents,
    recomposeAuthorityComponents,
    recomposeComponents,
    encodeQuery
};
