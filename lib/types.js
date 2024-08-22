import Decimal from 'decimal.js'

import * as enums from './enums.js'

/**
 * @typedef {string} AssetCode
 * @typedef {string | number | undefined} AssetGroupSpecifier Can either be group name (string), group id (number), or undefined to specify outside source.
 * 
 * @typedef ScanResult
 * @property {import('./models').AssetSnapshot} snapshots
 * @property {Decimal} totalUSDValue
 * @property {Date} startTime
 * @property {Date} endTime
 * @property {number} timeUsedMs
 */

export default {}