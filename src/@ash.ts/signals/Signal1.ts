/*
 * Based on ideas used in Robert Penner's AS3-signals - https://github.com/robertpenner/as3-signals
 */

import { ListenerNode } from './ListenerNode';
import { SignalBase } from './SignalBase';

/**
 * Provides a fast signal for use where one parameter is dispatched with the signal.
 */
export class Signal1<T> extends SignalBase<(a:T) => void> {
  public dispatch(object:T):void {
    this.startDispatch();
    for (let node = this.head; node; node = node.next) {
      node.listener(object);
      if (node.once) {
        this.remove(node.listener);
      }
    }
    this.endDispatch();
  }
}
