declare const _default: {};
export default _default;
export type AssetCode = string;
/**
 * Can either be group name (string), group id (number), or undefined to specify outside source.
 */
export type AssetGroupSpecifier = string | number | undefined;
export type ScanResult = {
    snapshots: import('./models').AssetSnapshot;
    totalUSDValue: Decimal;
    startTime: Date;
    endTime: Date;
    timeUsedMs: number;
};
import Decimal from "decimal.js";
