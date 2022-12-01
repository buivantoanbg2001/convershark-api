type DataOrError = object | null;

export default class ResponseData {
  constructor(
    private success: boolean,
    private payload: DataOrError,
    private error: DataOrError,
  ) {}

  getResponse() {
    return {
      success: this.success,
      payload: this.payload,
      error: this.error,
    };
  }
}
