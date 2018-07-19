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
    /* eslint-disable no-unused-vars */
    const [
        _uriStr,
        schemeWithColon,
        scheme,
        authorityWithSlashes,
        authority,
        authorityWithSign,
        userInfo,
        host,
        _hostName,
        portWithColon,
        port,
        path,
        queryWithQuestionMark,
        query,
        fragmentWithHashTag,
        fragment
    ] = uriStr.match(splitUriRegex);
    /* eslint-enable no-unused-vars */
    const u = {
        scheme,
        authority,
        path,
        query,
        fragment
        // TODO: maybe do not add if authority is not defined
    };
    if (u.authority != null) {
        // TODO: host null vs "" if authority defined but host not ?
        u.userInfo = userInfo;
        u.host = host;
        u.port = port;
        if (u.host == null) {
            u.host = '';
        }
    }
    if (u.path == null) {
        u.path = '';
    }

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
    if (userInfo != null) {
        result = `${result }${userInfo }@`;
    }
    result = result + host;
    if (port != null) {
        result = `${result }:${ port}`;
    }
    return result;
}

function _checkAuthorityInvariant(uriObj) {
    let b = (uriObj.authority == null && uriObj.userInfo == null && uriObj.host == null & uriObj.port == null) ||
        (uriObj.authority != null && uriObj.authority === recomposeAuthorityComponents(uriObj.userInfo, uriObj.host, uriObj.port));
    if (!b) {
        throw new Error('IllegalStateException,AuthorityInvariant broken');
    }
}

function recomposeComponents(uriObj) {
    _checkAuthorityInvariant(uriObj);
    let result = '';
    let u = uriObj;
    if (u.scheme != null) {
        result += `${u.scheme}:`;
    }
    if (u.authority != null) {
        result += `//${u.authority}`;
    }
    result += u.path;
    if (u.query != null) {
        result += `?${u.query}`;
    }
    if (u.fragment != null) {
        result += `#${u.fragment}`;
    }

    return result;
}
module.exports = {
    decomposeComponents,
    recomposeAuthorityComponents,
    recomposeComponents
};
