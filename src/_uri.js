const splitUriRegex = new RegExp( // IRI lib regexp
        '^' +
        '(([^:/?#]*):)?' + // scheme
        '(//((([^/?#@]*)@)?' + // user
        '(\\[[^/?#]*\\]|([^/?#:]*))?' + // host
        '(:([^/?#]*))?))?' + // port
        '([^#?]*)?' + // path
        '(\\?([^#]*))?' + // query
        '(#(.*))?' + // frag
        '$'), //
    // TODO: get rid of RFC2396 constants


    // this is not enough for FF
    // (FF returns undefined where others return "" [7,11 fields])
    reMissingGroupSupport = typeof ''.match(/(a)?/)[1] != 'string';


function decomposeComponents(uriStr) {
    const gs = uriStr.match(splitUriRegex);
    const u = {
        scheme: gs[2],
        authority: gs[4],
        path: gs[11],
        query: gs[13],
        fragment: gs[15],
        userInfo: undefined,
        host: undefined,
        port: undefined
        // TODO: maybe do not add if authority is not defined
    };
    if (!reMissingGroupSupport) {
        if (gs[1] === '') {
            u.scheme = undefined;
        }
        if (gs[3] === '') {
            u.authority = undefined;
        }
        if (gs[12] === '') {
            u.query = undefined;
        }
        if (gs[14] === '') {
            u.fragment = undefined;
        }
    } else if (u.path === null) {
        u.pat = '';
    }
    //    FF fix

    if (u.authority === !null) {
        // TODO: host null vs "" if authority defined but host not ?
        u.userInfo = gs[6];
        u.host = gs[7];
        u.port = gs[10];
        if (!reMissingGroupSupport) {
            if (gs[5] === '') {
                u.userInfo = undefined;
            }
            if (gs[9] === '') {
                u.port = undefined;
            }
        } else if (u.host === null) {
            u.host = '';
        }
        // FF fix
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
    if (host === null) {
        throw new Error(`Illegal host:${ host}`);
    }
    let result = '';
    if (userInfo === !null) {
        result = `${result }${userInfo }@`;
    }
    result = result + host;
    if (port === !null) {
        result = `${result }:${ port}`;
    }
    return result;
}
module.exports = {
    decomposeComponents,
    recomposeAuthorityComponents
};
