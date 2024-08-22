export namespace schema {
    const primaryIndex: JSONSchema;
    const assetCode: JSONSchema;
    const assetScannerType: JSONSchema;
    const assetState: JSONSchema;
    const assetType: JSONSchema;
    const assetTagCategory: JSONSchema;
    const chain: JSONSchema;
    const decimal: JSONSchema;
    const datetime: JSONSchema;
    const priceScannerType: JSONSchema;
    const refId: JSONSchema;
}
export type JSONSchema = import('objection').JSONSchema;
