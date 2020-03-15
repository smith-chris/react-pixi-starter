import * as ex from '@excalibur';

describe('A promise', () => {
  let promise: ex.Promise<any>;

  beforeEach(() => {
    promise = new ex.Promise();
  });

  it('should be loaded', () => {
    expect(ex.Promise).toBeTruthy();
  });

  it('should be defaulted to pending', () => {
    expect(promise.state()).toBe(ex.PromiseState.Pending);
  });

  it('can be resolved without a callback', () => {
    expect(promise.state()).toBe(ex.PromiseState.Pending);
    promise.resolve();
    expect(promise.state()).toBe(ex.PromiseState.Resolved);
  });

  it('can be rejected without a callback', () => {
    expect(promise.state()).toBe(ex.PromiseState.Pending);
    promise.reject();
    expect(promise.state()).toBe(ex.PromiseState.Rejected);
  });

  it('can be resolved with a callback async', (done) => {
    let value = false;

    promise.then((v) => {
      value = v;
    });

    setTimeout(() => {
      promise.resolve(true);
      expect(value).toBe(true);
      done();
    }, 300);
  });

  it('can be rejected with a callback async', (done) => {
    let value = false;

    promise.then(
      () => {
        /*do nothing*/
      },
      (v) => {
        value = v;
      }
    );

    setTimeout(() => {
      promise.reject(true);
      expect(value).toBe(true);
      done();
    }, 300);
  });

  it('can be resolved with multiple callbacks in order', (done) => {
    let val1 = 0;
    let val2 = 0;
    let val3 = 0;
    const isResolved = false;

    // Test that they are added in the right order
    promise
      .then(() => {
        val1 = 1;
      })
      .then(() => {
        val2 = val1 + 1;
      })
      .then(() => {
        val3 = val2 + 1;
      });

    setTimeout(() => {
      promise.resolve();
      expect(val1).toBe(1);
      expect(val2).toBe(2);
      expect(val3).toBe(3);
      done();
    }, 300);
  });

  it('can catch errors in callbacks', (done) => {
    let caughtError = false;

    promise
      .then((v) => {
        throw new Error('Catch!');
      })
      .error(() => {
        caughtError = true;
      });
    setTimeout(() => {
      promise.resolve(true);
      expect(caughtError).toBe(true);
      done();
    }, 300);
  });

  it('should throw an error if resolved when not in a pending state', () => {
    promise.resolve();
    expect(() => {
      promise.resolve();
    }).toThrow();
    expect(() => {
      promise.reject();
    }).toThrow();
    expect(() => {
      promise.resolve();
    }).toThrow();
    expect(() => {
      promise.reject();
    }).toThrow();
  });

  it('should throw an error if rejected when not in a pending state', () => {
    promise.reject();
    expect(() => {
      promise.reject();
    }).toThrow();
    expect(() => {
      promise.resolve();
    }).toThrow();
    expect(() => {
      promise.reject();
    }).toThrow();
    expect(() => {
      promise.resolve();
    }).toThrow();
  });

  it('should be able to resolve a value in a promise', (done) => {
    const p = ex.Promise.resolve<number>(12);

    expect(p.state()).toBe(ex.PromiseState.Resolved);

    p.then((value) => {
      expect(value).toBe(12);
      done();
    });
  });

  it('should be able to reject a value in a promise', (done) => {
    const p = ex.Promise.reject<number>(12);

    expect(p.state()).toBe(ex.PromiseState.Rejected);

    done();
  });

  describe('with multiple promises', () => {
    let p1: ex.Promise<any>;
    let p2: ex.Promise<any>;
    let p3: ex.Promise<any>;

    beforeEach(() => {
      p1 = new ex.Promise();
      p2 = new ex.Promise();
      p3 = new ex.Promise();
    });

    it('can join promise array and resolve', () => {
      const composite = ex.Promise.join([p1, p2, p3]);

      expect(composite.state()).toBe(ex.PromiseState.Pending);

      p1.resolve();

      expect(composite.state()).toBe(ex.PromiseState.Pending);

      p2.resolve();

      expect(composite.state()).toBe(ex.PromiseState.Pending);

      p3.resolve();

      expect(composite.state()).toBe(ex.PromiseState.Resolved);
    });

    it('can join promises and resolve when all resolve', () => {
      const composite = ex.Promise.join(p1, p2, p3);

      expect(composite.state()).toBe(ex.PromiseState.Pending);

      p1.resolve();

      expect(composite.state()).toBe(ex.PromiseState.Pending);

      p2.resolve();

      expect(composite.state()).toBe(ex.PromiseState.Pending);

      p3.resolve();

      expect(composite.state()).toBe(ex.PromiseState.Resolved);
    });

    it('can join promises and resolve when some reject', () => {
      const composite = ex.Promise.join(p1, p2, p3);

      expect(composite.state()).toBe(ex.PromiseState.Pending);

      p1.reject();

      expect(composite.state()).toBe(ex.PromiseState.Pending);

      p2.resolve();

      expect(composite.state()).toBe(ex.PromiseState.Pending);

      p3.resolve();

      expect(composite.state()).toBe(ex.PromiseState.Rejected);
    });

    it('can join an empty array and the result will resolve', () => {
      const result = ex.Promise.join([]);

      expect(result.state()).toBe(ex.PromiseState.Resolved);

      const result2 = ex.Promise.join();
      expect(result2.state()).toBe(ex.PromiseState.Resolved);
    });
  });

  it('does not swallow errors if no error callback is supplied', () => {
    const promise = new ex.Promise();
    promise.then(() => {
      throw new Error('ERROR!!!!!');
    });

    expect(function() {
      promise.resolve();
    }).toThrow();
  });
});
