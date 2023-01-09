/*
 * Based on ideas used in Robert Penner's AS3-signals - https://github.com/robertpenner/as3-signals
 */

import { ListenerNode } from './ListenerNode';
import { SignalBase } from './SignalBase';

/**
 * Provides a fast signal for use where two parameters are dispatched with the signal.
 */
export class Signal2<T1, T2> extends SignalBase<(a:T1, b:T2) => void> {
  public dispatch(object1:T1, object2:T2):void {
    this.startDispatch();
    for (let node = this.head; node; node = node.next) {
      node.listener(object1, object2);
      if (node.once) {
        this.remove(node.listener);
      }
    }
    this.endDispatch();
  }
}
