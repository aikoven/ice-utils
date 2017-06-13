import {Ice} from "ice";

export interface ErrorContext {
  remoteHost?: string;
  remotePort?: string;
}

export interface IceErrorHandler {
  (err: any, context: ErrorContext, current: Ice.Current): void;
}

export interface RemoveIceErrorListener {
  (): void;
}

const iceErrorHandlers: IceErrorHandler[] = [];

const iceWarn: (error: any) => void =
  (Ice as any).IncomingAsync.prototype.__warning;

(Ice as any).IncomingAsync.prototype.__warning = function (error: any) {
  if (!iceErrorHandlers)
    return iceWarn.call(this, error);

  const context: ErrorContext = {};
  if (this._connection !== null) {
    try {
      const connInfo = this._connection.getInfo();
      if (connInfo instanceof (Ice as any).IPConnectionInfo) {
        context.remoteHost = connInfo.remoteAddressm;
        context.remotePort = connInfo.remotePort;
      }
    } catch (exc) {
      // Ignore.
    }
  }

  for (const handler of iceErrorHandlers)
    handler(error, context, this._current);
};

export default function (handler: IceErrorHandler): RemoveIceErrorListener {
  iceErrorHandlers.push(handler);
  return () => {
    const index = iceErrorHandlers.indexOf(handler);
    iceErrorHandlers.splice(index, 1);
  };
}
