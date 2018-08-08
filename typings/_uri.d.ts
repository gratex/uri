// Type definitions for ./src/_uri.js
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
// decomposeComponents.!ret


declare interface UriObj {
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
 * @return {UriObj}
 */
declare function decomposeComponents(uriStr : string): UriObj;

/**
 * @param {string} userInfo
 * @param {string} host
 * @param {string} port
 * @return
 */
declare function recomposeAuthorityComponents(userInfo : string, host : string, port : string): string;

/**
 * @see 5.3.  Component Recomposition  . . . . . . . . . . . . . . . . 35
 * Remarks:
 * defined(x) is coded with !=null (means undefined and null are handled the same way)
 * ignores "authority sub components"
 * @param {UriObj} obj
 * @return {string}
 */
declare function recomposeComponents(obj: UriObj): string;

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

/**
 *
 * @param {UriObj} base
 * @param {UriObj} ref
 * @return {UriObj}
 */
declare function resolve(base : UriObj, ref : UriObj): UriObj;

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
 * @param {UriObj} uriParent
 * @param {UriObj} uriSub
 * @param {boolean} orSame
 * @return {boolean}
 */
declare function isSubordinate(uriParent : UriObj, uriSub : UriObj, orSame : boolean): boolean;

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
