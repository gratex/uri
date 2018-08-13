// Type definitions for ./src/uri.js
// Project: @gjax/uri

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
 * @param {UriObj} uriArr
 * @return {UriObj}
 */
declare function clone(uriArr : UriObj): UriObj;

/**
 *
 * @param {string | UriObj} that
 * @return {UriObj}
 */
declare function param(that : string | UriObj): UriObj;

/**
 *
 * @param {UriObj} base
 * @param {UriObj} ref
 * @return {UriObj}
 */
declare function _resolve(base : UriObj, ref : UriObj): UriObj;

/**
 * @param {string | UriObj | null} that
 * @param {UriObj} obj
 * @return {string}
 */
declare function mixin(that : string | UriObj | null, obj: UriObj ): string;

/**
 * @param {string} baseStr
 * @param {string} refStr
 * @return {boolean}
 */
declare function isSubPath(baseStr : string, refStr : string): boolean;

/**
 *
 * @param {string | UriObj | null} that
 * @return {string}
 */
declare function paramString(that : string | UriObj | null): string;

/**
 *
 * @param {Array<string>} arr
 * @param {string} what
 * @return {boolean}
 */
declare function contains(arr : Array<string>, what : string): boolean;

/**
 *
 * @param {string | UriObj | null} that
 * @return {string}
 */
declare function toString(that : string | UriObj | null): string;

/**
 *
 * @param {string | UriObj | null} that
 * @return {UriObj}
 */
declare function toUri(that : string | UriObj | null): UriObj;

/**
 *
 * @param {string | UriObj | null} that
 * @param {string} toStrip
 * @return {string}
 */
declare function strip(that : string | UriObj | null, toStrip : string): string;

/**
 *
 * @param {string | UriObj | null} that1
 * @param {string | UriObj | null} that2
 * @param {boolean} ignoreFragment
 * @return {boolean}
 */
declare function equals(that1 : string | UriObj | null, that2 : string | UriObj | null, ignoreFragment : boolean): boolean;

/**
 * basic getters
 * @param {string | UriObj | null} that
 * @return {string}
 */
declare function getScheme(that : string | UriObj | null): string;

/**
 *
 * @param {string | UriObj | null} that
 * @return {string}
 */
declare function getAuthority(that : string | UriObj | null): string;

/**
 *
 * @param {string | UriObj | null} that
 * @return {string}
 */
declare function getUserInfo(that : string | UriObj | null): string;

/**
 *
 * @param {string | UriObj | null} that
 * @return {string}
 */
declare function getHost(that : string | UriObj | null): string;

/**
 *
 * @param {string | UriObj | null} that
 * @return {string}
 */
declare function getPort(that : string | UriObj | null): string;

/**
 *
 * @param {string | UriObj | null} that
 * @return {string}
 */
declare function getPath(that : string | UriObj | null): string;

/**
 *
 * @param {string | UriObj | null} that
 * @param {boolean} toObject
 * @return {string | UriObj | undefined}
 */
declare function getQuery(that : string | UriObj | null, toObject : boolean): string | UriObj | undefined;

/**
 *
 * @param {string | UriObj | null} that
 * @return {string | undefined}
 */
declare function getFragment(that : string | UriObj | null): string | undefined;

/**
 *
 * @param {string | UriObj | null} that
 * @return {Array<string>}
 */
declare function getSegments(that : string | UriObj | null): Array<string>;

/**
 * basic setters
 * @param {string | UriObj | null} that
 * @param {string} scheme
 * @return {string}
 */
declare function setScheme(that : string | UriObj | null, scheme : string): string;

/**
 *
 * @param {string | UriObj | null} that
 * @param {string} authority
 * @return {string}
 */
declare function setAuthority(that : string | UriObj | null, authority : string): string;

/**
 *
 * @param {string|UriObj|null} that
 * @param {string} userInfo
 * @return {string}
 */
declare function setUserInfo(that : string|UriObj|null, userInfo : string): string;

/**
 *
 * @param {string|UriObj|null} that
 * @param {string} host
 * @return {string}
 */
declare function setHost(that : string|UriObj|null, host : string): string;

/**
 *
 * @param {string|UriObj|null} that
 * @param {string} port
 * @return {string}
 */
declare function setPort(that : string|UriObj|null, port : string): string;

/**
 *
 * @param {string|UriObj|null} that
 * @param {string} path
 * @return {string}
 */
declare function setPath(that : string|UriObj|null, path : string): string;

/**
 *
 * @param {string|UriObj|null} that
 * @param {string|UriObj} query
 * @return {string}
 */
declare function setQuery(that : string|UriObj|null, query : string|UriObj): string;

/**
 *
 * @param {string|UriObj|null} that
 * @param {string|UriObj} query
 * @return {string}
 */
declare function appendQuery(that : string|UriObj|null, query : string|UriObj): string;

/**
 *
 * @param {string|UriObj|null} that
 * @param {string|UriObj} fragment
 * @return {string}
 */
declare function setFragment(that : string|UriObj|null, fragment : string|UriObj): string;

/**
 *
 * @param {string|UriObj|null} that
 * @param {string|UriObj} fragment
 * @return {string}
 */
declare function appendFragment(that : string|UriObj|null, fragment : string|UriObj): string;

/**
 *
 * @param {string|UriObj|null} that
 * @param {Array<string>} segments
 * @return {string}
 */
declare function setSegments(that : string|UriObj|null, segments : Array<string>): string;

/**
 *
 * @param {string|UriObj|null} that
 * @param {Array<string>}...appendSegmets
 * @return {string}
 */
declare function appendSegments(that : string|UriObj|null, ...appendSegmets : Array<string>): string;

/**
 * stripping specific parts of URI
 * @param {string|UriObj|null} that
 * @return {string}
 */
declare function stripOrigin(that : string|UriObj|null): string;

/**
 *
 * @param {string|UriObj|null} that
 * @return {string}
 */
declare function stripExtension(that : string|UriObj|null): string;

/**
 *
 * @param {string|UriObj|null} that
 * @return {string}
 */
declare function stripCtxPath(that : string|UriObj|null): string;

/**
 *
 * @param {string|UriObj|null} that
 * @return {string}
 */
declare function stripCtxPrefix(that : string|UriObj|null): string;

/**
 *
 * @param {string|UriObj|null} that
 * @return {string}
 */
declare function stripPath(that : string|UriObj|null): string;

/**
 *
 * @param {string|UriObj|null} that
 * @return {string}
 */
declare function stripQuery(that : string|UriObj|null): string;

/**
 *
 * @param {string|UriObj|null} that
 * @return {string}
 */
declare function stripFragment(that : string|UriObj|null): string;

/**
 *
 * @param {string|UriObj|null} that
 * @return {string}
 */
declare function getScreenPath(that : string|UriObj|null): string;

/**
 *
 * @param {string|UriObj|null} that
 * @return {string}
 */
declare function getLastSegment(that : string|UriObj|null): string;

/**
 * NTH: getLastNonVoidSegment ???
 * @param {string|UriObj|null} that
 * @return {boolean}
 */
declare function denotesFolder(that : string|UriObj|null): boolean;

/**
 *
 * @param {string|UriObj|null} that
 * @return {string}
 */
declare function convertToFolder(that : string|UriObj|null): string;

/**
 *
 * @param {string|UriObj|null} that
 * @param {string|UriObj|null} ref
 * @return {boolean}
 */
declare function isSubordinate(that : string|UriObj|null, ref : string|UriObj|null): boolean;

/**
 *
 * @param {string|UriObj|null} that
 * @param {string|UriObj|null} ref
 * @return {string}
 */
declare function resolve(that : string|UriObj|null, ref : string|UriObj|null): string;

/**
 *
 * @param {string|UriObj|null} that
 * @param {string|UriObj|null} ref
 * @return {string}
 */
declare function resolveAsSubordinate(that : string|UriObj|null, ref : string|UriObj|null): string;

/**
 *
 * @param {string|UriObj|null} that
 * @return {number}
 */
declare function parseId(that : string|UriObj|null): number;
