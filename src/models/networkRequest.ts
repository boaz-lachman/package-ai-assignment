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

  constructor(id: string, url: string, data: any, createdAt: Date, size: RequestSize) {
    this.id = id;
    this.url = url;
    this.data = data;
    this.createdAt = createdAt;
    this.size = size;
  }
}

