export interface DiagramsData {
  TrafficData: {
    ID: number
    RequestID: number
    AppName: string
    TotalBytes: number
    MobileBytes: number
    WifiBytes: number
    RxBytes: number
    TxBytes: number
  }[]
}
