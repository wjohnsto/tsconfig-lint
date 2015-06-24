/* tslint:disable:no-unused-variable */
var __nativeIsArray = !!Array.isArray,
    __objToString = Object.prototype.toString,
    __toStringClass = '[object ',
    __errorClass = __toStringClass + 'Error]',
    __fileClass = __toStringClass + 'File]',
    __arrayClass = __toStringClass + 'Array]',
    __boolClass = __toStringClass + 'Boolean]',
    __dateClass = __toStringClass + 'Date]',
    __funcClass = __toStringClass + 'Function]',
    __numberClass = __toStringClass + 'Number]',
    __objectClass = __toStringClass + 'Object]',
    __regexpClass = __toStringClass + 'RegExp]',
    __stringClass = __toStringClass + 'String]',
    __promiseClass = __toStringClass + 'Promise]',
    __objectTypes: any = {
        'boolean': false,
        'function': true,
        'object': true,
        'number': false,
        'string': false,
        'undefined': false
    };

function _defineProperty(obj: any, key: string, value: any, enumerable?: boolean, configurable?: boolean, writable?: boolean): void {
    Object.defineProperty(obj, key, {
        value: value,
        enumerable: enumerable === true,
        configurable: configurable === true,
        writable: writable === true
    });
}

export function extend(deep: boolean, redefine: any, destination: any, ...sources: any[]): any {
    if (isNull(destination)) {
        return destination;
    }

    var keys: Array<string>,
        property: any,
        define: (obj: any, key: string, value: any) => void;

    if (isFunction(redefine)) {
        define = redefine;
    } else if (redefine) {
        define = (obj: any, key: string, value: any) => {
            _defineProperty(obj, key, value, true, true, true);
        };
    } else {
        define = (obj: any, key: string, value: any) => {
            obj[key] = value;
        };
    }

    if (isEmpty(sources)) {
        sources.push(destination);
    }

    forEach((source, k): void => {
        if (!isObject(source)) {
            return;
        }

        keys = Object.keys(source);

        forEach((key): void => {
            property = source[key];
            if (deep) {
                if (isArray(property)) {
                    extend(deep, define, destination[key] || (destination[key] = []), property);
                    return;
                } else if (isDate(property)) {
                    define(destination, key, new Date(property.getTime()));
                    return;
                } else if (isRegExp(property)) {
                    define(destination, key, new RegExp(property));
                    return;
                } else if (isNode(property)) {
                    define(destination, key, (<Node>property).cloneNode(true));
                    return;
                } else if (isObject(property)) {
                    extend(deep, define, destination[key] || (destination[key] = {}), property);
                    return;
                }
            }
            define(destination, key, property);
        }, keys);
    }, sources);

    return destination;
}

export function clone(obj: any, deep?: boolean): any {
    if (!isObject(obj)) {
        return obj;
    } else if (isDate(obj)) {
        return new Date((<Date>obj).getTime());
    } else if (isRegExp(obj)) {
        return new RegExp(obj);
    } else if (isNode(obj)) {
        return (<Node>obj).cloneNode(deep);
    } else if (isError(obj)) {
        return new obj.constructor((<Error>obj).message);
    }

    var type = {};

    if (isArray(obj)) {
        type = [];
    }

    if (isBoolean(deep) && deep) {
        return extend(true, false, type, obj);
    }

    return extend(false, false, type, obj);
}

export function isError(obj: any): boolean {
    return __objToString.call(obj) === __errorClass;
}

export function isObject(obj: any): boolean {
    return obj != null && typeof obj === 'object';
}

export function isWindow(obj: any): boolean {
    return !!(obj && obj.document && obj.setInterval);
}

export function isDocument(obj: any): boolean {
    return !!(obj && obj.nodeType === Node.DOCUMENT_NODE);
}

export function isNode(obj: any): boolean {
    return !!(obj && typeof obj.nodeType === 'number');
}

export function isDocumentFragment(obj: any): boolean {
    return !!(obj && (<Node>obj).nodeType === Node.DOCUMENT_FRAGMENT_NODE);
}

export function isFile(obj: any): boolean {
    return isObject(obj) && __objToString.call(obj) === __fileClass;
}

export function isString(obj: any): boolean {
    return typeof obj === 'string' || isObject(obj) && __objToString.call(obj) === __stringClass;
}

export function isRegExp(obj: any): boolean {
    return isObject(obj) && __objToString.call(obj) === __regexpClass;
}

export function isPromise(obj: any): boolean {
    return isObject(obj) && (__objToString.call(obj) === __promiseClass || isFunction(obj.then));
}

export function isEmpty(obj: any): boolean {
    if (isNull(obj)) {
        return true;
    }

    if (isString(obj) || isArray(obj)) {
        return obj.length === 0;
    }

    if (!isObject(obj)) {
        return false;
    }

    return Object.keys(obj).length === 0;
}

export function isBoolean(obj: any): boolean {
    return obj === true || obj === false || isObject(obj) && __objToString.call(obj) === __boolClass;
}

export function isNumber(obj: any): boolean {
    return (typeof obj === 'number' || isObject(obj) && __objToString.call(obj) === __numberClass) && !isNaN(obj);
}

export function isFunction(obj: any): boolean {
    return typeof obj === 'function';
}

export function isNull(obj: any): boolean {
    return obj === null || obj === undefined;
}

export function isUndefined(obj: any): boolean {
    return obj === undefined;
}

export function isArray(obj: any): boolean {
    if (__nativeIsArray) {
        return Array.isArray(obj);
    }

    return __objToString.call(obj) === __arrayClass;
}

export function isArrayLike(obj: any): boolean {
    if (isNull(obj) || isWindow(obj) || isFunction(obj)) {
        return false;
    }

    return isString(obj) || obj.length >= 0;
}

export function isDate(obj: any): boolean {
    return typeof obj === 'object' && __objToString.call(obj) === __dateClass;
}

export function forEach<T>(iterator: (value: T, index: number, obj: any) => void, array: Array<T>, context?: any): Array<T>;
export function forEach<T>(iterator: (value: T, key: string, obj: any) => void, obj: any, context?: any): any;
export function forEach<T>(iterator: (value: T, key: any, obj: any) => void, obj: any, context?: any): any {
    if (isNull(obj) || !(isObject(obj) || isArrayLike(obj))) {
        return obj;
    }

    var i: number,
        key: string,
        length: number;

    if (isFunction(obj.forEach)) {
        return obj.forEach(iterator, context);
    } else if (isArrayLike(obj)) {
        for (i = 0, length = obj.length; i < length; ++i) {
            iterator.call(context, obj[i], i, obj);
        }
    } else {
        var keys = Object.keys(obj);
        length = keys.length;
        while (keys.length > 0) {
            key = keys.shift();
            iterator.call(context, obj[key], key, obj);
        }
    }

    return obj;
}
