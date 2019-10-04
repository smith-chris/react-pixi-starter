declare let ejecta: null | {
  orientation: number
  language: string
  screenWidth: number
  devicePixelRatio: number
  allowSleepMode: boolean
  screenHeight: number
  appVersion: string
  audioSession: string
  platform: string
  onLine: boolean
  otherAudioPlaying: boolean
  userAgent: string
  include: () => void
  requireModule: () => void
  openURL: () => void
  load: () => void
  clearTimeout: () => void
  performanceNow: () => number
  getText: () => void
  log: () => void
  loadFont: (path: string) => void
  setInterval: () => void
  clearInterval: () => void
  setTimeout: () => void
}

declare namespace _Ejecta {
  type Base64 = string

  type Transaction = {
    productId: string
    id: string
    receipt: Base64
  }

  type Product = {
    id: string
    title: string
    description: string
    price: string
    purchase: (
      amount: number,
      callback: (error: Error, transaction: Transaction) => void,
    ) => void
  }

  class IAPManager {
    restoreTransactions: (
      callback: (error: Error, transactions: Transaction[]) => void,
    ) => void
    getProducts: (
      productIds: string[],
      callback: (error: Error, products: Product[]) => void,
    ) => void
  }

  class GameCenter {
    authed: boolean
    softAuthenticate: () => void
    getLocalPlayerInfo: () => void
    reportAchievement: () => void
    reportAchievementAdd: () => void
    authenticate: () => void
    reportScore: () => void
    showLeaderboard: () => void
    loadFriends: () => void
    loadPlayers: () => void
    showAchievements: () => void
    loadScores: () => void
  }

  class DeviceMotion {
    ondevicemotion?: () => void
    interval: number
    onacceleration?: () => void
    removeEventListener: () => void
    addEventListener: () => void
  }

  class Geolocation {
    PERMISSION_DENIED: 1
    TIMEOUT: 3
    POSITION_UNAVAILABLE: 2
    clearWatch: () => void
    watchPosition: () => void
    getCurrentPosition: () => void
  }

  class HttpRequest {
    OPENED: 1
    UNSENT: 0
    LOADING: 3
    HEADERS_RECEIVED: 2
    DONE: 4
    readyState: 0
    timeout: 0
    response: null
    responseText: null
    onload: null
    status: 0
    onerror: null
    onloadstart: null
    statusText: 0
    ontimeout: null
    onabort: null
    onreadystatechange: null
    responseType: undefined
    onprogress: null
    onloadend: null
    getResponseHeader: () => void
    abort: () => void
    setRequestHeader: () => void
    open: () => void
    overrideMimeType: () => void
    removeEventListener: () => void
    getAllResponseHeaders: () => void
    send: () => void
    addEventListener: () => void
  }

  class ImagePicker {
    isSourceTypeAvailable: () => void
    getPicture: () => void
  }

  class KeyInput {
    ondelete: null
    onfocus: null
    onchange: null
    onblur: null
    value: undefined
    blur: () => void
    removeEventListener: () => void
    isOpen: () => void
    focus: () => void
    addEventListener: () => void
  }

  class LocalStorage {
    length: 10
    getItem: () => void
    setItem: () => void
    removeItem: () => void
    clear: () => void
    key: () => void
  }
  class TouchInput {
    ontouchmove: null
    ontouchend: null
    ontouchstart: null
    removeEventListener: () => void
    addEventListener: () => void
  }
  class WebSocket {
    OPEN: 1
    CLOSING: 2
    CONNECTING: 0
    CLOSED: 3
    readyState: 3
    onclose: null
    bufferedAmount: 0
    extensions: undefined
    onerror: null
    onopen: null
    url: undefined
    binaryType: Blob
    protocol: undefined
    onmessage: null
    removeEventListener: () => void
    close: () => void
    send: () => void
    addEventListener: () => void
  }
  class WindowEvents {
    onpageshow: null
    onpagehide: null
    onresize: null
    removeEventListener: () => void
    addEventListener: () => void
  }
}

declare const Ejecta: typeof _Ejecta | null

interface Window {
  ejecta: typeof ejecta
  Ejecta: typeof Ejecta
  resImagePath?: string
}
