export enum RequestSize {
  Small = "small",
  Large = "large",
}

export class NetworkRequest {
  id: string;
  numberOfTask: number
  url: string;
  data: any;
  createdAt: Date;
  size: RequestSize;
  isSent: boolean;

  constructor(id: string, url: string, data: any, numberOfTask: number
    , createdAt: Date, size: RequestSize, isSent:boolean = false) {
    this.id = id;
    this.url = url;
    this.data = data;
    this.numberOfTask = numberOfTask;
    this.createdAt = createdAt;
    this.size = size;
    this.isSent = isSent;
  }
}
