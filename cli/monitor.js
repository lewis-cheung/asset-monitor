import { Command } from 'commander'

import * as lib from '../lib/index.js'

const cmd = new Command('monitor')
const logger = lib.utils.createLogger('CLI')

cmd
	.description('Scan assets and store the snapshots periodically.')
	.argument('[cron]', 'cron schedule. Default as \'0 * * * *\'')
	.option('-e, --env <path>', 'path to the env file')
	.action(async (cron, { env }) => {
		const assetMonitor = new lib.AssetMonitor({ envPath: env })
		await assetMonitor.init()
		assetMonitor.monitor(cron)
	})

export default cmd
