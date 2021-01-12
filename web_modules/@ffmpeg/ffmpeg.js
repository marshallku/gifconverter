import { c as createCommonjsModule, a as commonjsGlobal } from '../common/_commonjsHelpers-eb5a497e.js';

var runtime_1 = createCommonjsModule(function (module) {
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined$1; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined$1) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined$1;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined$1;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined$1;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined$1, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined$1;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined$1;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined$1;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined$1;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined$1;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   module.exports 
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}
});

var config = {
  defaultArgs: [
    /* args[0] is always the binary path */
    './ffmpeg',
    /* Disable interaction mode */
    '-nostdin',
    /* Force to override output file */
    '-y',
  ],
  baseOptions: {
    /* Flag to turn on/off log messages in console */
    log: false,
    /*
     * Custom logger to get ffmpeg.wasm output messages.
     * a sample logger looks like this:
     *
     * ```
     * logger = ({ type, message }) => {
     *   console.log(type, message);
     * }
     * ```
     *
     * type can be one of following:
     *
     * info: internal workflow debug messages
     * fferr: ffmpeg native stderr output
     * ffout: ffmpeg native stdout output
     */
    logger: () => {},
    /*
     * Progress handler to get current progress of ffmpeg command.
     * a sample progress handler looks like this:
     *
     * ```
     * progress = ({ ratio }) => {
     *   console.log(ratio);
     * }
     * ```
     *
     * ratio is a float number between 0 to 1.
     */
    progress: () => {},
    /*
     * Path to find/download ffmpeg.wasm-core,
     * this value should be overwriten by `defaultOptions` in
     * each environment.
     */
    corePath: '',
  },
};

let logging = false;
let customLogger = () => {};

const setLogging = (_logging) => {
  logging = _logging;
};

const setCustomLogger = (logger) => {
  customLogger = logger;
};

const log = (type, message) => {
  customLogger({ type, message });
  if (logging) {
    console.log(`[${type}] ${message}`);
  }
};

var log_1 = {
  logging,
  setLogging,
  setCustomLogger,
  log,
};

let duration = 0;

const ts2sec = (ts) => {
  const [h, m, s] = ts.split(':');
  return (parseFloat(h) * 60 * 60) + (parseFloat(m) * 60) + parseFloat(s);
};

var parseProgress = (message, progress) => {
  if (typeof message === 'string') {
    if (message.startsWith('  Duration')) {
      const ts = message.split(', ')[0].split(': ')[1];
      const d = ts2sec(ts);
      if (duration === 0 || duration > d) {
        duration = d;
      }
    } else if (message.startsWith('frame')) {
      const ts = message.split('time=')[1].split(' ')[0];
      const t = ts2sec(ts);
      progress({ ratio: t / duration });
    } else if (message.startsWith('video:')) {
      progress({ ratio: 1 });
      duration = 0;
    }
  }
};

var parseArgs = (Core, args) => {
  const argsPtr = Core._malloc(args.length * Uint32Array.BYTES_PER_ELEMENT);
  args.forEach((s, idx) => {
    const buf = Core._malloc(s.length + 1);
    Core.writeAsciiToMemory(s, buf);
    Core.setValue(argsPtr + (Uint32Array.BYTES_PER_ELEMENT * idx), buf, 'i32');
  });
  return [args.length, argsPtr];
};

/* SNOWPACK PROCESS POLYFILL (based on https://github.com/calvinmetcalf/node-process-es6) */
function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
var cachedSetTimeout = defaultSetTimout;
var cachedClearTimeout = defaultClearTimeout;
var globalContext;
if (typeof window !== 'undefined') {
    globalContext = window;
} else if (typeof self !== 'undefined') {
    globalContext = self;
} else {
    globalContext = {};
}
if (typeof globalContext.setTimeout === 'function') {
    cachedSetTimeout = setTimeout;
}
if (typeof globalContext.clearTimeout === 'function') {
    cachedClearTimeout = clearTimeout;
}

function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}
function nextTick(fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
}
// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
var title = 'browser';
var platform = 'browser';
var browser = true;
var argv = [];
var version = ''; // empty string to avoid regexp issues
var versions = {};
var release = {};
var config$1 = {};

function noop() {}

var on = noop;
var addListener = noop;
var once = noop;
var off = noop;
var removeListener = noop;
var removeAllListeners = noop;
var emit = noop;

function binding(name) {
    throw new Error('process.binding is not supported');
}

function cwd () { return '/' }
function chdir (dir) {
    throw new Error('process.chdir is not supported');
}function umask() { return 0; }

// from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
var performance = globalContext.performance || {};
var performanceNow =
  performance.now        ||
  performance.mozNow     ||
  performance.msNow      ||
  performance.oNow       ||
  performance.webkitNow  ||
  function(){ return (new Date()).getTime() };

// generate timestamp or delta
// see http://nodejs.org/api/process.html#process_process_hrtime
function hrtime(previousTimestamp){
  var clocktime = performanceNow.call(performance)*1e-3;
  var seconds = Math.floor(clocktime);
  var nanoseconds = Math.floor((clocktime%1)*1e9);
  if (previousTimestamp) {
    seconds = seconds - previousTimestamp[0];
    nanoseconds = nanoseconds - previousTimestamp[1];
    if (nanoseconds<0) {
      seconds--;
      nanoseconds += 1e9;
    }
  }
  return [seconds,nanoseconds]
}

var startTime = new Date();
function uptime() {
  var currentTime = new Date();
  var dif = currentTime - startTime;
  return dif / 1000;
}

var process = {
  nextTick: nextTick,
  title: title,
  browser: browser,
  env: {"NODE_ENV":"production"},
  argv: argv,
  version: version,
  versions: versions,
  on: on,
  addListener: addListener,
  once: once,
  off: off,
  removeListener: removeListener,
  removeAllListeners: removeAllListeners,
  emit: emit,
  binding: binding,
  cwd: cwd,
  chdir: chdir,
  umask: umask,
  hrtime: hrtime,
  platform: platform,
  release: release,
  config: config$1,
  uptime: uptime
};

var resolveUrl = createCommonjsModule(function (module, exports) {
// Copyright 2014 Simon Lydell
// X11 (“MIT”) Licensed. (See LICENSE.)

void (function(root, factory) {
  {
    module.exports = factory();
  }
}(commonjsGlobal, function() {

  function resolveUrl(/* ...urls */) {
    var numUrls = arguments.length;

    if (numUrls === 0) {
      throw new Error("resolveUrl requires at least one argument; got none.")
    }

    var base = document.createElement("base");
    base.href = arguments[0];

    if (numUrls === 1) {
      return base.href
    }

    var head = document.getElementsByTagName("head")[0];
    head.insertBefore(base, head.firstChild);

    var a = document.createElement("a");
    var resolved;

    for (var index = 1; index < numUrls; index++) {
      a.href = arguments[index];
      resolved = a.href;
      base.href = resolved;
    }

    head.removeChild(base);

    return resolved
  }

  return resolveUrl

}));
});

const _args = [
  [
    "@ffmpeg/ffmpeg@0.9.6",
    "/Library/WebServer/Documents/gifconverter"
  ]
];
const _from = "@ffmpeg/ffmpeg@0.9.6";
const _id = "@ffmpeg/ffmpeg@0.9.6";
const _inBundle = false;
const _integrity = "sha512-ov5FAV3dHRJ/+ZxQH9V5GvY/iczwq5vrKWeu4tpytxZewTSAhZ1aKD/sFBzd79nQNF+CTktxUp3LWuGECXBNeA==";
const _location = "/@ffmpeg/ffmpeg";
const _phantomChildren = {
};
const _requested = {
  type: "version",
  registry: true,
  raw: "@ffmpeg/ffmpeg@0.9.6",
  name: "@ffmpeg/ffmpeg",
  escapedName: "@ffmpeg%2fffmpeg",
  scope: "@ffmpeg",
  rawSpec: "0.9.6",
  saveSpec: null,
  fetchSpec: "0.9.6"
};
const _requiredBy = [
  "/"
];
const _resolved = "https://registry.npmjs.org/@ffmpeg/ffmpeg/-/ffmpeg-0.9.6.tgz";
const _spec = "0.9.6";
const _where = "/Library/WebServer/Documents/gifconverter";
const author = {
  name: "Jerome Wu",
  email: "jeromewus@gmail.com"
};
const browser$1 = {
  "./src/node/index.js": "./src/browser/index.js"
};
const bugs = {
  url: "https://github.com/ffmpegwasm/ffmpeg.wasm/issues"
};
const dependencies = {
  "is-url": "^1.2.4",
  "node-fetch": "^2.6.1",
  "regenerator-runtime": "^0.13.7",
  "resolve-url": "^0.2.1"
};
const description = "FFmpeg WebAssembly version";
const devDependencies = {
  "@babel/core": "^7.12.3",
  "@babel/preset-env": "^7.12.1",
  "@ffmpeg/core": "^0.8.5",
  "@types/emscripten": "^1.39.4",
  "babel-loader": "^8.1.0",
  chai: "^4.2.0",
  cors: "^2.8.5",
  eslint: "^7.12.1",
  "eslint-config-airbnb-base": "^14.1.0",
  "eslint-plugin-import": "^2.22.1",
  express: "^4.17.1",
  mocha: "^8.2.1",
  "mocha-headless-chrome": "^2.0.3",
  "npm-run-all": "^4.1.5",
  "wait-on": "^5.2.0",
  webpack: "^5.3.2",
  "webpack-cli": "^4.1.0",
  "webpack-dev-middleware": "^4.0.0"
};
const directories = {
  example: "examples"
};
const engines = {
  node: ">=12.16.1"
};
const homepage = "https://github.com/ffmpegwasm/ffmpeg.wasm#readme";
const keywords = [
  "ffmpeg",
  "WebAssembly",
  "video"
];
const license = "MIT";
const main = "src/index.js";
const name = "@ffmpeg/ffmpeg";
const repository = {
  type: "git",
  url: "git+https://github.com/ffmpegwasm/ffmpeg.wasm.git"
};
const scripts = {
  build: "rimraf dist && webpack --config scripts/webpack.config.prod.js",
  lint: "eslint src",
  prepublishOnly: "npm run build",
  start: "node scripts/server.js",
  test: "npm-run-all -p -r start test:all",
  "test:all": "npm-run-all wait test:browser:ffmpeg test:node:all",
  "test:browser": "mocha-headless-chrome -a allow-file-access-from-files -a incognito -a no-sandbox -a disable-setuid-sandbox -a disable-logging -t 300000",
  "test:browser:ffmpeg": "npm run test:browser -- -f ./tests/ffmpeg.test.html",
  "test:node": "node --experimental-wasm-threads --experimental-wasm-bulk-memory node_modules/.bin/_mocha --exit --bail --require ./scripts/test-helper.js",
  "test:node:all": "npm run test:node -- ./tests/*.test.js",
  wait: "rimraf dist && wait-on http://localhost:3000/dist/ffmpeg.dev.js"
};
const types = "src/index.d.ts";
const version$1 = "0.9.6";
var require$$3 = {
  _args: _args,
  _from: _from,
  _id: _id,
  _inBundle: _inBundle,
  _integrity: _integrity,
  _location: _location,
  _phantomChildren: _phantomChildren,
  _requested: _requested,
  _requiredBy: _requiredBy,
  _resolved: _resolved,
  _spec: _spec,
  _where: _where,
  author: author,
  browser: browser$1,
  bugs: bugs,
  dependencies: dependencies,
  description: description,
  devDependencies: devDependencies,
  directories: directories,
  engines: engines,
  homepage: homepage,
  keywords: keywords,
  license: license,
  main: main,
  name: name,
  repository: repository,
  scripts: scripts,
  types: types,
  version: version$1
};

const { devDependencies: devDependencies$1 } = require$$3;

/*
 * Default options for browser environment
 */
var defaultOptions = {
  corePath: (typeof process !== 'undefined' && process.env.FFMPEG_ENV === 'development')
    ? resolveUrl('/node_modules/@ffmpeg/core/dist/ffmpeg-core.js')
    : `https://unpkg.com/@ffmpeg/core@${devDependencies$1['@ffmpeg/core'].substring(1)}/dist/ffmpeg-core.js`,
};

/* eslint-disable no-undef */

const { log: log$1 } = log_1;

/*
 * Fetch data from remote URL and convert to blob URL
 * to avoid CORS issue
 */
const toBlobURL = async (url, mimeType) => {
  log$1('info', `fetch ${url}`);
  const buf = await (await fetch(url)).arrayBuffer();
  log$1('info', `${url} file size = ${buf.byteLength} bytes`);
  const blob = new Blob([buf], { type: mimeType });
  const blobURL = URL.createObjectURL(blob);
  log$1('info', `${url} blob URL = ${blobURL}`);
  return blobURL;
};

var getCreateFFmpegCore = async ({ corePath: _corePath }) => {
  if (typeof _corePath !== 'string') {
    throw Error('corePath should be a string!');
  }
  const coreRemotePath = resolveUrl(_corePath);
  const corePath = await toBlobURL(
    coreRemotePath,
    'application/javascript',
  );
  const wasmPath = await toBlobURL(
    coreRemotePath.replace('ffmpeg-core.js', 'ffmpeg-core.wasm'),
    'application/wasm',
  );
  const workerPath = await toBlobURL(
    coreRemotePath.replace('ffmpeg-core.js', 'ffmpeg-core.worker.js'),
    'application/javascript',
  );
  if (typeof createFFmpegCore === 'undefined') {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      const eventHandler = () => {
        script.removeEventListener('load', eventHandler);
        log$1('info', 'ffmpeg-core.js script loaded');
        resolve({
          createFFmpegCore,
          corePath,
          wasmPath,
          workerPath,
        });
      };
      script.src = corePath;
      script.type = 'text/javascript';
      script.addEventListener('load', eventHandler);
      document.getElementsByTagName('head')[0].appendChild(script);
    });
  }
  log$1('info', 'ffmpeg-core.js script is loaded already');
  return Promise.resolve({
    createFFmpegCore,
    corePath,
    wasmPath,
    workerPath,
  });
};

const readFromBlobOrFile = (blob) => (
  new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = ({ target: { error: { code } } }) => {
      reject(Error(`File could not be read! Code=${code}`));
    };
    fileReader.readAsArrayBuffer(blob);
  })
);

var fetchFile = async (_data) => {
  let data = _data;
  if (typeof _data === 'undefined') {
    return new Uint8Array();
  }

  if (typeof _data === 'string') {
    /* From base64 format */
    if (/data:_data\/([a-zA-Z]*);base64,([^"]*)/.test(_data)) {
      data = atob(_data.split(',')[1])
        .split('')
        .map((c) => c.charCodeAt(0));
    /* From remote server/URL */
    } else {
      const res = await fetch(resolveUrl(_data));
      data = await res.arrayBuffer();
    }
  /* From Blob or File */
  } else if (_data instanceof File || _data instanceof Blob) {
    data = await readFromBlobOrFile(_data);
  }

  return new Uint8Array(data);
};

var browser$2 = {
  defaultOptions,
  getCreateFFmpegCore,
  fetchFile,
};

const { defaultArgs, baseOptions } = config;
const { setLogging: setLogging$1, setCustomLogger: setCustomLogger$1, log: log$2 } = log_1;


const { defaultOptions: defaultOptions$1, getCreateFFmpegCore: getCreateFFmpegCore$1 } = browser$2;
const { version: version$2 } = require$$3;

const NO_LOAD = Error('ffmpeg.wasm is not ready, make sure you have completed load().');

var createFFmpeg = (_options = {}) => {
  const {
    log: logging,
    logger,
    progress: optProgress,
    ...options
  } = {
    ...baseOptions,
    ...defaultOptions$1,
    ..._options,
  };
  let Core = null;
  let ffmpeg = null;
  let runResolve = null;
  let running = false;
  let progress = optProgress;
  const detectCompletion = (message) => {
    if (message === 'FFMPEG_END' && runResolve !== null) {
      runResolve();
      runResolve = null;
      running = false;
    }
  };
  const parseMessage = ({ type, message }) => {
    log$2(type, message);
    parseProgress(message, progress);
    detectCompletion(message);
  };

  /*
   * Load ffmpeg.wasm-core script.
   * In browser environment, the ffmpeg.wasm-core script is fetch from
   * CDN and can be assign to a local path by assigning `corePath`.
   * In node environment, we use dynamic require and the default `corePath`
   * is `$ffmpeg/core`.
   *
   * Typically the load() func might take few seconds to minutes to complete,
   * better to do it as early as possible.
   *
   */
  const load = async () => {
    log$2('info', 'load ffmpeg-core');
    if (Core === null) {
      log$2('info', 'loading ffmpeg-core');
      /*
       * In node environment, all paths are undefined as there
       * is no need to set them.
       */
      const {
        createFFmpegCore,
        corePath,
        workerPath,
        wasmPath,
      } = await getCreateFFmpegCore$1(options);
      Core = await createFFmpegCore({
        /*
         * Assign mainScriptUrlOrBlob fixes chrome extension web worker issue
         * as there is no document.currentScript in the context of content_scripts
         */
        mainScriptUrlOrBlob: corePath,
        printErr: (message) => parseMessage({ type: 'fferr', message }),
        print: (message) => parseMessage({ type: 'ffout', message }),
        /*
         * locateFile overrides paths of files that is loaded by main script (ffmpeg-core.js).
         * It is critical for browser environment and we override both wasm and worker paths
         * as we are using blob URL instead of original URL to avoid cross origin issues.
         */
        locateFile: (path, prefix) => {
          if (typeof window !== 'undefined') {
            if (typeof wasmPath !== 'undefined'
              && path.endsWith('ffmpeg-core.wasm')) {
              return wasmPath;
            }
            if (typeof workerPath !== 'undefined'
              && path.endsWith('ffmpeg-core.worker.js')) {
              return workerPath;
            }
          }
          return prefix + path;
        },
      });
      ffmpeg = Core.cwrap('proxy_main', 'number', ['number', 'number']);
      log$2('info', 'ffmpeg-core loaded');
    } else {
      throw Error('ffmpeg.wasm was loaded, you should not load it again, use ffmpeg.isLoaded() to check next time.');
    }
  };


  /*
   * Determine whether the Core is loaded.
   */
  const isLoaded = () => Core !== null;

  /*
   * Run ffmpeg command.
   * This is the major function in ffmpeg.wasm, you can just imagine it
   * as ffmpeg native cli and what you need to pass is the same.
   *
   * For example, you can convert native command below:
   *
   * ```
   * $ ffmpeg -i video.avi -c:v libx264 video.mp4
   * ```
   *
   * To
   *
   * ```
   * await ffmpeg.run('-i', 'video.avi', '-c:v', 'libx264', 'video.mp4');
   * ```
   *
   */
  const run = (..._args) => {
    log$2('info', `run ffmpeg command: ${_args.join(' ')}`);
    if (Core === null) {
      throw NO_LOAD;
    } else if (running) {
      throw Error('ffmpeg.wasm can only run one command at a time');
    } else {
      running = true;
      return new Promise((resolve) => {
        const args = [...defaultArgs, ..._args].filter((s) => s.length !== 0);
        runResolve = resolve;
        ffmpeg(...parseArgs(Core, args));
      });
    }
  };

  /*
   * Run FS operations.
   * For input/output file of ffmpeg.wasm, it is required to save them to MEMFS
   * first so that ffmpeg.wasm is able to consume them. Here we rely on the FS
   * methods provided by Emscripten.
   *
   * Common methods to use are:
   * ffmpeg.FS('writeFile', 'video.avi', new Uint8Array(...)): writeFile writes
   * data to MEMFS. You need to use Uint8Array for binary data.
   * ffmpeg.FS('readFile', 'video.mp4'): readFile from MEMFS.
   * ffmpeg.FS('unlink', 'video.map'): delete file from MEMFS.
   *
   * For more info, check https://emscripten.org/docs/api_reference/Filesystem-API.html
   *
   */
  const FS = (method, ...args) => {
    log$2('info', `run FS.${method} ${args.map((arg) => (typeof arg === 'string' ? arg : `<${arg.length} bytes binary file>`)).join(' ')}`);
    if (Core === null) {
      throw NO_LOAD;
    } else {
      let ret = null;
      try {
        ret = Core.FS[method](...args);
      } catch (e) {
        if (method === 'readdir') {
          throw Error(`ffmpeg.FS('readdir', '${args[0]}') error. Check if the path exists, ex: ffmpeg.FS('readdir', '/')`);
        } else if (method === 'readFile') {
          throw Error(`ffmpeg.FS('readFile', '${args[0]}') error. Check if the path exists`);
        } else {
          throw Error('Oops, something went wrong in FS operation.');
        }
      }
      return ret;
    }
  };

  const setProgress = (_progress) => {
    progress = _progress;
  };

  const setLogger = (_logger) => {
    setCustomLogger$1(_logger);
  };

  setLogging$1(logging);
  setCustomLogger$1(logger);

  log$2('info', `use ffmpeg.wasm v${version$2}`);

  return {
    setProgress,
    setLogger,
    setLogging: setLogging$1,
    load,
    isLoaded,
    run,
    FS,
  };
};

const { fetchFile: fetchFile$1 } = browser$2;

var src = {
  /*
   * Create ffmpeg instance.
   * Each ffmpeg instance owns an isolated MEMFS and works
   * independently.
   *
   * For example:
   *
   * ```
   * const ffmpeg = createFFmpeg({
   *  log: true,
   *  logger: () => {},
   *  progress: () => {},
   *  corePath: '',
   * })
   * ```
   *
   * For the usage of these four arguments, check config.js
   *
   */
  createFFmpeg,
  /*
   * Helper function for fetching files from various resource.
   * Sometimes the video/audio file you want to process may located
   * in a remote URL and somewhere in your local file system.
   *
   * This helper function helps you to fetch to file and return an
   * Uint8Array variable for ffmpeg.wasm to consume.
   *
   */
  fetchFile: fetchFile$1,
};

var createFFmpeg$1 = src.createFFmpeg;
var fetchFile$2 = src.fetchFile;
export { createFFmpeg$1 as createFFmpeg, fetchFile$2 as fetchFile };
