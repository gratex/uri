// Type definitions for ./src/uri.js
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
// clone.!ret

/**
 * summary:
 * 		Use to set multiple URI parts at once.
 *  that: String|Object|null
 * 		URI string or URI object. Current window URI used when null or undefined.
 *  obj: Object
 * 		Available properties: `scheme`, `authority`, `userInfo`, `host`, `port`, `path`, `query`, `fragment`.
 * 		If `authority` property is present, `userInfo`, `host` and `port` are ignored.
 * 		All properties are strings except `query` and `fragment` which may also be objects.
 *  returns: String
 * 		Modified copy of `that`.
 */
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

 declare interface config {
     CTX: string;
     UI_CTX_PREFIX: string;
     SVC_CTX_PREFIX: string;
 }

export declare const CTX : string;
export declare const SVC_CTX_PREFIX : string;
export declare const UI_CTX_PREFIX : string;
export declare const DEFAULT_THAT : string;

/**
 * function fromWindow(){} NOT PORTED
 * function navigate(){} NOT PORTED
 *
 * @param {config} conf
 */
declare function config(conf : config): void;

/**
 * paramString window.document.URL instead use '' (or try use '/', or...)
 * @param query1
 * @param query2
 * @return {string}
 */
declare function equalsQueryStr(query1 : string, query2 : string): boolean;

/**
 *
 * @param {uriObj} uriArr
 * @return {uriObj}
 */
declare function clone(uriArr : uriObj): uriObj;

/**
 *
 * @param {string | uriObj} that
 * @return {uriObj}
 */
declare function param(that : string | uriObj): uriObj;

/**
 *
 * @param {uriObj} base
 * @param {uriObj} ref
 * @return {uriObj}
 */
declare function _resolve(base : uriObj, ref : uriObj): uriObj;

/**
 * @param {string | uriObj | null} that
 * @param {uriObj} obj
 * @return {string}
 */
declare function mixin(that : string | uriObj | null, { authority, userInfo, host, port, scheme, path, query, fragment }: uriObj ): string;

/**
 * @param {string} baseStr
 * @param {string} refStr
 * @return {boolean}
 */
declare function isSubPath(baseStr : string, refStr : string): boolean;

/**
 *
 * @param {string | uriObj | null} that
 * @return {string}
 */
declare function paramString(that : string | uriObj | null): string;

/**
 *
 * @param {Array<string>} arr
 * @param {string} what
 * @return {boolean}
 */
declare function contains(arr : Array<string>, what : string): boolean;

/**
 *
 * @param {string | uriObj | null} that
 * @return {string}
 */
declare function toString(that : string | uriObj | null): string;

/**
 *
 * @param {string | uriObj | null} that
 * @return {uriObj}
 */
declare function toUri(that : string | uriObj | null): uriObj;

/**
 *
 * @param {string | uriObj | null} that
 * @param {string} toStrip
 * @return {string}
 */
declare function strip(that : string | uriObj | null, toStrip : string): string;

/**
 *
 * @param {string | uriObj | null} that1
 * @param {string | uriObj | null} that2
 * @param {boolean} ignoreFragment
 * @return {boolean}
 */
declare function equals(that1 : string | uriObj | null, that2 : string | uriObj | null, ignoreFragment : boolean): boolean;

/**
 * basic getters
 * @param {string | uriObj | null} that
 * @return {string}
 */
declare function getScheme(that : string | uriObj | null): string;

/**
 *
 * @param {string | uriObj | null} that
 * @return {string}
 */
declare function getAuthority(that : string | uriObj | null): string;

/**
 *
 * @param {string | uriObj | null} that
 * @return {string}
 */
declare function getUserInfo(that : string | uriObj | null): string;

/**
 *
 * @param {string | uriObj | null} that
 * @return {string}
 */
declare function getHost(that : string | uriObj | null): string;

/**
 *
 * @param {string | uriObj | null} that
 * @return {string}
 */
declare function getPort(that : string | uriObj | null): string;

/**
 *
 * @param {string | uriObj | null} that
 * @return {string}
 */
declare function getPath(that : string | uriObj | null): string;

/**
 *
 * @param {string | uriObj | null} that
 * @param {boolean} toObject
 * @return {string | uriObj | undefined}
 */
declare function getQuery(that : string | uriObj | null, toObject : boolean): string | uriObj | undefined;

/**
 *
 * @param {string | uriObj | null} that
 * @return {string | undefined}
 */
declare function getFragment(that : string | uriObj | null): string | undefined;

/**
 *
 * @param {string | uriObj | null} that
 * @return {Array<string>}
 */
declare function getSegments(that : string | uriObj | null): Array<string>;

/**
 * basic setters
 * @param {string | uriObj | null} that
 * @param {string} scheme
 * @return {string}
 */
declare function setScheme(that : string | uriObj | null, scheme : string): string;

/**
 *
 * @param {string | uriObj | null} that
 * @param {string} authority
 * @return {string}
 */
declare function setAuthority(that : string | uriObj | null, authority : string): string;

/**
 *
 * @param {string|uriObj|null} that
 * @param {string} userInfo
 * @return {string}
 */
declare function setUserInfo(that : string|uriObj|null, userInfo : string): string;

/**
 *
 * @param {string|uriObj|null} that
 * @param {string} host
 * @return {string}
 */
declare function setHost(that : string|uriObj|null, host : string): string;

/**
 *
 * @param {string|uriObj|null} that
 * @param {string} port
 * @return {string}
 */
declare function setPort(that : string|uriObj|null, port : string): string;

/**
 *
 * @param {string|uriObj|null} that
 * @param {string} path
 * @return {string}
 */
declare function setPath(that : string|uriObj|null, path : string): string;

/**
 *
 * @param {string|uriObj|null} that
 * @param {string|uriObj} query
 * @return {string}
 */
declare function setQuery(that : string|uriObj|null, query : string|uriObj): string;

/**
 *
 * @param {string|uriObj|null} that
 * @param {string|uriObj} query
 * @return {string}
 */
declare function appendQuery(that : string|uriObj|null, query : string|uriObj): string;

/**
 *
 * @param {string|uriObj|null} that
 * @param {string|uriObj} fragment
 * @return {string}
 */
declare function setFragment(that : string|uriObj|null, fragment : string|uriObj): string;

/**
 *
 * @param {string|uriObj|null} that
 * @param {string|uriObj} fragment
 * @return {string}
 */
declare function appendFragment(that : string|uriObj|null, fragment : string|uriObj): string;

/**
 *
 * @param {string|uriObj|null} that
 * @param {Array<string>} segments
 * @return {string}
 */
declare function setSegments(that : string|uriObj|null, segments : Array<string>): string;

/**
 *
 * @param {string|uriObj|null} that
 * @param {Array<string>}...appendSegmets
 * @return {string}
 */
declare function appendSegments(that : string|uriObj|null, ...appendSegmets : Array<string>): string;

/**
 * stripping specific parts of URI
 * @param {string|uriObj|null} that
 * @return {string}
 */
declare function stripOrigin(that : string|uriObj|null): string;

/**
 *
 * @param {string|uriObj|null} that
 * @return {string}
 */
declare function stripExtension(that : string|uriObj|null): string;

/**
 *
 * @param {string|uriObj|null} that
 * @return {string}
 */
declare function stripCtxPath(that : string|uriObj|null): string;

/**
 *
 * @param {string|uriObj|null} that
 * @return {string}
 */
declare function stripCtxPrefix(that : string|uriObj|null): string;

/**
 *
 * @param {string|uriObj|null} that
 * @return {string}
 */
declare function stripPath(that : string|uriObj|null): string;

/**
 *
 * @param {string|uriObj|null} that
 * @return {string}
 */
declare function stripQuery(that : string|uriObj|null): string;

/**
 *
 * @param {string|uriObj|null} that
 * @return {string}
 */
declare function stripFragment(that : string|uriObj|null): string;

/**
 *
 * @param {string|uriObj|null} that
 * @return {string}
 */
declare function getScreenPath(that : string|uriObj|null): string;

/**
 *
 * @param {string|uriObj|null} that
 * @return {string}
 */
declare function getLastSegment(that : string|uriObj|null): string;

/**
 * NTH: getLastNonVoidSegment ???
 * @param {string|uriObj|null} that
 * @return {boolean}
 */
declare function denotesFolder(that : string|uriObj|null): boolean;

/**
 *
 * @param {string|uriObj|null} that
 * @return {string}
 */
declare function convertToFolder(that : string|uriObj|null): string;

/**
 *
 * @param {string|uriObj|null} that
 * @param {string|uriObj|null} ref
 * @return {boolean}
 */
declare function isSubordinate(that : string|uriObj|null, ref : string|uriObj|null): boolean;

/**
 *
 * @param {string|uriObj|null} that
 * @param {string|uriObj|null} ref
 * @return {string}
 */
declare function resolve(that : string|uriObj|null, ref : string|uriObj|null): string;

/**
 *
 * @param {string|uriObj|null} that
 * @param {string|uriObj|null} ref
 * @return {string}
 */
declare function resolveAsSubordinate(that : string|uriObj|null, ref : string|uriObj|null): string;

/**
 *
 * @param {string|uriObj|null} that
 * @return {number}
 */
declare function parseId(that : string|uriObj|null): number;
