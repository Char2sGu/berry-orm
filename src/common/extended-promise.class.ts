import Promise from "lazy-promise";

/**
 * Class-based and Lazy-resolved promise with synchronous access to the
 * execution result.
 */
export abstract class ExtendedPromise<Result> extends Promise<Result> {
  /**
   * Exists only after the promise is resolved.
   */
  result?: Result;

  constructor() {
    super((resolve, reject) => {
      this.execute().then(resolve).catch(reject);
    });
  }

  /**
   * Executor of the promise.
   */
  protected abstract execute(): Promise<Result>;
}
