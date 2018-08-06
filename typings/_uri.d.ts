// Type definitions for ./src/_uri.js
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
// decomposeComponents.!ret


export declare var splitUriRegex : RegExp;

/**
 * TODO: get rid of RFC2396 constants
 */
export declare var RFC2396_DIGIT : string;

/**
 *
 */
export declare var RFC2396_LOWALPHA : string;

/**
 *
 */
export declare var RFC2396_UPALPHA : string;

/**
 *
 */
export declare var RFC2396_ALPHA : string;

/**
 *
 */
export declare var RFC2396_ALPHANUM : string;

/**
 *
 */
export declare var RFC3986_UNRESERVED : string;

/**
 *
 */
export declare var RFC3986_SUBDELIMS : string;

/**
 *
 */
export declare var RFC3986_PCT_ENCODED : string;

/**
 *
 */
export declare var RFC3986_REG_NAME : string;

/**
 *
 */
export declare var RFC3986_PCHAR : string;

/**
 *
 */
export declare var RFC3986_QUERY : string;

/**
 *
 */
export declare var RFC3986_SEGMENT : string;

/**
 *
 */
export declare var RFC3986_FRAGMENT : string;

/**
 *
 */
export declare var RFC3986_PATH_SEGMENTS : string;

/**
 * TODO: get rid of RFC2396 constants
 * @param uriStr
 * @return
 */
declare function decomposeComponents(uriStr : any): any;

/**
 *
 * @param userInfo
 * @param host
 * @param port
 * @return
 */
declare function recomposeAuthorityComponents(userInfo : any, host : any, port : any): any;

/**
 *
 * @param authority
 * @param userInfo
 * @param host
 * @param port
 */
declare function _checkAuthorityInvariant(authority : any, userInfo : any, host : any, port : any): void;

/**
 * @see 5.3.  Component Recomposition  . . . . . . . . . . . . . . . . 35
 * Remarks:
 * defined(x) is coded with !=null (means undefined and null are handled the same way)
 * ignores "authority sub components"
 * *
 * @param undefined
 * @param undefined
 * @param undefined
 * @param undefined
 * @param undefined
 * @param undefined
 * @param undefined
 * @param fragment}
 * @return
 */
declare function recomposeComponents(param1 : /* {scheme */ any, param2 : /* authority */ any, param3 : /* userInfo */ any, param4 : /* host */ any, param5 : /* port */ any, param6 : /* path */ any, param7 : /* query */ any, fragment : any):  /* error */ any;

/**
 *
 * @param str
 * @param legalRange
 * @return
 */
declare function percentEncode(str : any, legalRange : string): string;

/**
 *
 * @param path
 * @return
 */
declare function removeDotSegments(path : string): string;

/**
 * 5.2.3.  Merge Paths
 * *
 * @param undefined
 * @param path}
 * @param refPath
 * @return
 */
declare function _merge(param1 : /* {authority */ any, path : any, refPath : string): any;

/**
 * 5.2.2.  Transform References
 * *
 * @param base
 * @param undefined
 * @param undefined
 * @param undefined
 * @param undefined
 * @param undefined
 * @param undefined
 * @param undefined
 * @param fragment}
 * @return
 */
declare function _transformReference(base : any, param2 : /* {scheme */ any, param3 : /* authority */ any, param4 : /* userInfo */ any, param5 : /* host */ any, param6 : /* port */ any, param7 : /* path */ any, param8 : /* query */ any, fragment : any): any;

/**
 * 5.2.1.  Pre-parse the Base URI
 * *
 * @param {scheme}
 */
declare function _preParseBaseUri({scheme} : any): void;

/**
 *
 * @param base
 * @param ref
 * @return
 */
declare function resolve(base : any, ref : any): /* _transformReference.!ret */ any;

/**
 *
 * @param encodedPath
 * @return
 */
declare function decodeSegments(encodedPath : any): any;

/**
 *
 * @param segments
 * @return
 */
declare function encodeSegments(segments : any): string;

/**
 *
 * @param uriParent
 * @param uriSub
 * @param orSame
 * @return
 */
declare function isSubordinate(uriParent : any, uriSub : any, orSame : any): any;

/**
 *
 * @param segment
 * @return
 */
declare function encodeSegment(segment : any): string;

/**
 *
 * @param str
 * @return
 */
declare function encodeQuery(str : any): string;

/**
 *
 * @param str
 * @return
 */
declare function encodeFragment(str : any): string;

/**
 *
 * @param raw
 * @param legalRange
 * @param doThrow
 * @return
 */
declare function checkEncoding(raw : any, legalRange : string, doThrow : any): Error;

/**
 *
 * @param str
 * @param doThrow
 * @return
 */
declare function checkSegmentsEncoding(str : any, doThrow : any): Error;

/**
 *
 * @param str
 * @param doThrow
 * @return
 */
declare function checkSegmentEncoding(str : any, doThrow : any): Error;

/**
 *
 * @param str
 * @param doThrow
 * @return
 */
declare function checkQueryEncoding(str : any, doThrow : any): Error;

/**
 *
 * @param str
 * @param doThrow
 * @return
 */
declare function checkFragmentEncoding(str : any, doThrow : any): Error;

/**
 *
 * @param query
 * @param bDecode
 * @return
 */
declare function parseQuery(query : any, bDecode : any): any;

/**
 *
 */
export declare var PCHAR_TOKENIZER : RegExp;
