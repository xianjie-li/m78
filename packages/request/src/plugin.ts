import { BaseRequestOptions, CreateOptions, Options } from "./interfaces";
import { ResponseError } from "./response-error";
import { Response } from "./response";
import { getNamePathValue } from "@m78/utils";

export class Plugin<Opt extends BaseRequestOptions = BaseRequestOptions> {
  constructor(
    /** Objects that share data between different plugins should only be operated by plugins in their own namespace, such as caching plugins using ctx.catch.xx */
    public ctx: any,
    /** Create options */
    public createOptions: CreateOptions<Opt>,
    /** Current request options */
    public options: Opt,
    /** Store content shared in the current request instance */
    public store: any
  ) {}

  /**
   * helper，extract specified propriety for extraOption or createOption, extraOption > createOption
   * */
  getCurrentOption<key extends keyof Options<Opt>>(
    optionField: key
  ): Options<Opt>[key] {
    return (
      getNamePathValue(this.options, ["extraOption", optionField]) ||
      this.createOptions[optionField]
    );
  }

  /**
   * Execute before the request starts. If a valid value is returned, it will behave differently depending on the type of value:
   * - Response: skip real request, use this Response continue to perform subsequent operations
   * - ResponseError: skip real request,  use this ResponseError continue to perform subsequent operations
   * - other valid value: skip real request, use this value as Promise resolve value, like Promise.resolve(returnValue)
   *
   * Once a value is returned, subsequent `plugin.before` executions will be skipped.
   * */
  before?(): Promise<any>;

  /** Promise instance created, request issued */
  start?(currentTask: Promise<Response>): void;

  /**
   * Convert the request result and return it. During the conversion process, you can actively make the request 'error' by throwing an error and enter the catch phase.
   * @param response - Response is determined based on the type of request library configured.
   * @return - The processed response must be returned before other plugins can receive the processed response
   * */
  pipe?(response: Response): Response;

  /** The request was successful. Please execute the data processing in the pipe(). success() only applicable for message feedback, etc */
  success?(data: any, response: Response): void;

  /** Request error */
  error?(error: ResponseError): void;

  /** Request finish */
  finish?(): void;
}
