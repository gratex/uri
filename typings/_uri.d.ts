// Type definitions for ./src/_uri.js
// Project: @gjax/uri


export declare interface UriObj {
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
export declare function decomposeComponents(uriStr : string): UriObj;

/**
 * @param {string} userInfo
 * @param {string} host
 * @param {string} port
 * @return
 */
export declare function recomposeAuthorityComponents(userInfo : string, host : string, port : string): string;

/**
 * @see 5.3.  Component Recomposition  . . . . . . . . . . . . . . . . 35
 * Remarks:
 * defined(x) is coded with !=null (means undefined and null are handled the same way)
 * ignores "authority sub components"
 * @param {UriObj} obj
 * @return {string}
 */
export declare function recomposeComponents(obj: UriObj): string;

/**
 * @param {string} str
 * @param {string} legalRange
 * @return {string}
 */
export declare function percentEncode(str : string, legalRange : string): string;

/**
 *
 * @param {string} path
 * @return {string}
 */
export declare function removeDotSegments(path : string): string;

/**
 *
 * @param {UriObj} base
 * @param {UriObj} ref
 * @return {UriObj}
 */
export declare function resolve(base : UriObj, ref : UriObj): UriObj;

/**
 *
 * @param {string} encodedPath
 * @return {Array<string>}
 */
export declare function decodeSegments(encodedPath : string): Array<string>;

/**
 *
 * @param {Array<string>} segments
 * @return {string}
 */
export declare function encodeSegments(segments : Array<string>): string;

/**
 *
 * @param {UriObj} uriParent
 * @param {UriObj} uriSub
 * @param {boolean} orSame
 * @return {boolean}
 */
export declare function isSubordinate(uriParent : UriObj, uriSub : UriObj, orSame : boolean): boolean;

/**
 *
 * @param {string} segment
 * @return {string}
 */
export declare function encodeSegment(segment : string): string;

/**
 *
 * @param {string} str
 * @return {string}
 */
export declare function encodeQuery(str : string): string;

/**
 *
 * @param {string} str
 * @return {string}
 */
export declare function encodeFragment(str : string): string;

/**
 *
 * @param {string} raw
 * @param {string} legalRange
 * @param {boolean} doThrow
 * @return {null | Error}
 */
export declare function checkEncoding(raw : string, legalRange : string, doThrow : boolean): Error | null;

/**
 *
 * @param {string} str
 * @param {boolean} doThrow
 * @return {null | Error}
 */
export declare function checkSegmentsEncoding(str : string, doThrow : boolean): Error | null;

/**
 *
 * @param {string} str
 * @param {boolean} doThrow
 * @return {null | Error}
 */
export declare function checkSegmentEncoding(str : string, doThrow : boolean): Error | null;

/**
 *
 * @param {string} str
 * @param {boolean} doThrow
 * @return {null | Error}
 */
export declare function checkQueryEncoding(str : string, doThrow : boolean): Error | null;

/**
 *
 * @param {string} str
 * @param {boolean} doThrow
 * @return {null | Error}
 */
export declare function checkFragmentEncoding(str : string, doThrow : boolean): Error | null;

/**
 *
 * @param {string} query
 * @param {boolean} bDecode
 * @return {object}
 */
export declare function parseQuery(query : string, bDecode : boolean): { [ key : string ] : any };
