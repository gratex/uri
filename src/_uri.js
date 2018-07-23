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

function decomposeComponents(uriStr) {
    const [, , scheme, , authority, , userInfo, host, , , port, path, , query, , fragment] = uriStr.match(splitUriRegex);
    const u = { scheme, authority, path, query, fragment };
    if (u.authority != null) {
        Object.assign(u, { userInfo, port, host });
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

/**
	 5.2.2.  Transform References
	 **/
const STRICT_TRANSFORMREFERENCES = true;
function _transformReference(base, ref) {
    let t = ref;
    if (!STRICT_TRANSFORMREFERENCES && ref.scheme === base.scheme) {
        ref.scheme = undef;
    }
    (ref.scheme != null) ?
        t.path = removeDotSegments(ref.path) :
        ((ref.authority != null) ?
            t.path = removeDotSegments(ref.path) :
            ((ref.path === '') ?
                (t.path = base.path, (ref.query != null) ?
                    t.query = ref.query :
                    t.query = base.query) :
                (ref.path.charAt(0) === '/') ?
                    t.path = removeDotSegments(ref.path) :
                    t.path = _merge(base, ref.path), t.path = removeDotSegments(t.path), t.query = ref.query,
                t.authority = base.authority,
                t.userInfo = base.userInfo,
                t.host = base.host,
                t.port = base.port),
            t.scheme = base.scheme);
    t.fragment = ref.fragment;
    return t;
}

/**
5.2.3.  Merge Paths
**/
function _merge({ authority, path }, refPath)//object,string
{
    if (authority != null && path === '') {
        return `/${refPath}`
    } else {
        const xi = path.lastIndexOf('/');
        return (xi === -1) ? refPath : path.substring(0, xi + 1) + refPath;
    }
}

function resolve(base, ref) {
    _preParseBaseUri(base);
    return _transformReference(base, ref);
}

/**
 5.2.1.  Pre-parse the Base URI
 **/
function _preParseBaseUri({ base }) {
    if (base === null)
        throw new Error("Violation 5.2.1, scheme component required");
}

module.exports = {
    decomposeComponents,
    recomposeAuthorityComponents,
    recomposeComponents,
    removeDotSegments,
    resolve
};
