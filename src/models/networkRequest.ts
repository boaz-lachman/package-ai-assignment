export enum RequestSize {
  Small = "small",
  Large = "large",
}

export class NetworkRequest {
  id: string;
  url: string;
  data: any;
  createdAt: Date;
  size: RequestSize;
  isSent: boolean;

  constructor(id: string, url: string, data: any, createdAt: Date, size: RequestSize, isSent:boolean = false) {
    this.id = id;
    this.url = url;
    this.data = data;
    this.createdAt = createdAt;
    this.size = size;
    this.isSent = isSent;
  }
}
