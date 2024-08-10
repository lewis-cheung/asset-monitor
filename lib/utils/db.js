export function getOnUpdateTriggerSql(tableName) {
	return `
		CREATE TRIGGER ${tableName}_updated_at
		BEFORE UPDATE ON ${tableName}
		FOR EACH ROW
		EXECUTE PROCEDURE on_update_timestamp();
	`
}