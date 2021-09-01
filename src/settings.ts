import joplin from "api";
import { SettingItemType } from "api/types";

export namespace settings {
	const SECTION = 'FolderIdSettings';

	export async function register() {
		await joplin.settings.registerSection(SECTION, {
			label: "Get Notebook ID",
			iconName: "fas fa-folder-open",
		});

		let PLUGIN_SETTINGS = {};

		PLUGIN_SETTINGS['enableCopyFolderId'] = {
			value: true,
			public: true,
			section: SECTION,
			type: SettingItemType.Bool,
			label: 'Copy Notebook ID',
			description: "Enable 'Copy Notebook ID' in the notebook context menu. (requires restart)",
		}

		PLUGIN_SETTINGS['enableShowFolderId'] = {
			value: false,
			public: true,
			section: SECTION,
			type: SettingItemType.Bool,
			label: 'Show Notebook ID',
			description: "Enable 'Show Notebook ID' in the notebook context menu. (requires restart)",
		}

		await joplin.settings.registerSettings(PLUGIN_SETTINGS);
	}
}
