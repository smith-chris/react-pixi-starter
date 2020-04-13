import { NodeList, Node } from '@ash.ts/ash'
import { debug } from 'const/debug'

export const eachNode = <T extends Node>(
  nodeList: NodeList<T>,
  f: (node: T) => void,
) => {
  for (let node: T | null = nodeList.head; node; node = node.next) {
    f(node)
  }
}

const withLog = (f: Function | undefined, prefix: string) => {
  if (!f) {
    return f
  }
  return function(...params: any[]) {
    console.log(prefix, ...params)
    // @ts-ignore
    f.apply(this, params)
  }
}

export const handleNodes = <T extends Node>(
  nodeList: NodeList<T>,
  {
    nodeAdded,
    nodeRemoved,
    debugName,
  }: {
    nodeAdded?: (node: T) => void
    nodeRemoved?: (node: T) => void
    debugName?: string
  },
) => {
  // if (debug && debugName) {
  //   nodeAdded = withLog(nodeAdded, `${debugName}.nodeAdded`)
  //   nodeRemoved = withLog(nodeRemoved, `${debugName}.nodeRemoved`)
  // }
  if (typeof nodeAdded === 'function') {
    eachNode(nodeList, nodeAdded)
    nodeList.nodeAdded.add(nodeAdded)
  }
  if (typeof nodeRemoved === 'function') {
    nodeList.nodeRemoved.add(nodeRemoved)
  }
}
