type RequestHeader = {
  'Content-type': string;
  token?: string;
};

export class BasicApi {
  protected url: string;
  protected headers: RequestHeader;

  constructor(config: { url: string; headers: RequestHeader }) {
    this.url = config.url;
    this.headers = config.headers;
  }

  protected handleResponseData<TResponse>(res: Response): Promise<TResponse> {
    if (res.ok) {
      return res.json() as Promise<TResponse>;
    }
    return Promise.reject(res.status);
  }
}
