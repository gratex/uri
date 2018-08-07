// Type definitions for ./src/_uri.js
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
// decomposeComponents.!ret


export declare const splitUriRegex : RegExp;
export declare const RFC2396_DIGIT : string;
export declare const RFC2396_LOWALPHA : string;
export declare const RFC2396_UPALPHA : string;
export declare const RFC2396_ALPHA : string;
export declare const RFC2396_ALPHANUM : string;
export declare const RFC3986_UNRESERVED : string;
export declare const RFC3986_SUBDELIMS : string;
export declare const RFC3986_PCT_ENCODED : string;
export declare const RFC3986_REG_NAME : string;
export declare const RFC3986_PCHAR : string;
export declare const RFC3986_QUERY : string;
export declare const RFC3986_SEGMENT : string;
export declare const RFC3986_FRAGMENT : string;
export declare const RFC3986_PATH_SEGMENTS : string;
export declare const PCHAR_TOKENIZER : RegExp;

declare interface uriObj {
    scheme: string;
    host: string;
    port: string;
    userInfo: string;
    authority: string;
    path: string;
    query: string;
    fragment: string;
}

/**
 * @param {string} uriStr
 * @return {uriObj}
 */
declare function decomposeComponents(uriStr : string): uriObj;

/**
 * @param {string} userInfo
 * @param {string} host
 * @param {string} port
 * @return
 */
declare function recomposeAuthorityComponents(userInfo : string, host : string, port : string): string;

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
 * @param {uriObj} obj
 * @return {string}
 */
declare function recomposeComponents(obj: uriObj): string;

/**
 * @param {string} str
 * @param {string} legalRange
 * @return {string}
 */
declare function percentEncode(str : string, legalRange : string): string;

/**
 *
 * @param {string} path
 * @return {string}
 */
declare function removeDotSegments(path : string): string;

declare function _merge({authority, path} : uriObj, refPath : string): string;

/**
 * 5.2.2.  Transform References
 * @param {uriObj} base
 * @param {uriObj} ref
 * @return {uriObj}
 */
declare function _transformReference(base : uriObj, { scheme, authority, userInfo, host, port, path, query, fragment }: uriObj) : uriObj;

/**
 * 5.2.1.  Pre-parse the Base URI
 * *
 * @param {scheme}
 */
declare function _preParseBaseUri({scheme} : uriObj): void;

/**
 *
 * @param {uriObj} base
 * @param {uriObj} ref
 * @return {uriObj}
 */
declare function resolve(base : uriObj, ref : uriObj): uriObj;

/**
 *
 * @param {string} encodedPath
 * @return {Array<string>}
 */
declare function decodeSegments(encodedPath : string): Array<string>;

/**
 *
 * @param {Array<string>} segments
 * @return {string}
 */
declare function encodeSegments(segments : Array<string>): string;

/**
 *
 * @param {uriObj} uriParent
 * @param {uriObj} uriSub
 * @param {boolean} orSame
 * @return {boolean}
 */
declare function isSubordinate(uriParent : uriObj, uriSub : uriObj, orSame : boolean): boolean;

/**
 *
 * @param {string} segment
 * @return {string}
 */
declare function encodeSegment(segment : string): string;

/**
 *
 * @param {string} str
 * @return {string}
 */
declare function encodeQuery(str : string): string;

/**
 *
 * @param {string} str
 * @return {string}
 */
declare function encodeFragment(str : string): string;

/**
 *
 * @param {string} raw
 * @param {string} legalRange
 * @param {string} doThrow
 * @return {null | Error}
 */
declare function checkEncoding(raw : string, legalRange : string, doThrow : string): Error | null;

/**
 *
 * @param {string} str
 * @param {string} doThrow
 * @return {null | Error}
 */
declare function checkSegmentsEncoding(str : string, doThrow : string): Error | null;

/**
 *
 * @param {string} str
 * @param {string} doThrow
 * @return {null | Error}
 */
declare function checkSegmentEncoding(str : string, doThrow : string): Error | null;

/**
 *
 * @param {string} str
 * @param {string} doThrow
 * @return {null | Error}
 */
declare function checkQueryEncoding(str : string, doThrow : string): Error | null;

/**
 *
 * @param {string} str
 * @param {string} doThrow
 * @return {null | Error}
 */
declare function checkFragmentEncoding(str : string, doThrow : string): Error | null;

/**
 *
 * @param {string} query
 * @param {boolean} bDecode
 * @return {object}
 */
declare function parseQuery(query : string, bDecode : boolean): object;
