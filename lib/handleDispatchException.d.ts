import { Ice } from "ice";
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
export default function (handler: IceErrorHandler): RemoveIceErrorListener;
