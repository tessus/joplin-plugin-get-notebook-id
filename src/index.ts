import joplin from 'api';
import { MenuItemLocation } from 'api/types';
import { settings } from "./settings";

joplin.plugins.register({
	onStart: async function () {
		await settings.register();
		const enableCopyFolderId = await joplin.settings.value('enableCopyFolderId');
		const enableShowFolderId = await joplin.settings.value('enableShowFolderId');

		const dialogs = joplin.views.dialogs;
		const nbDialog = await dialogs.create('notebookIdDialog');

		if (enableCopyFolderId) {
			await joplin.commands.register({
				name: 'copyFolderId',
				label: 'Copy Notebook ID',

				execute: async (folderId:string) => {
					if (typeof folderId === 'undefined') {
						const selectedFolder = await joplin.workspace.selectedFolder();
						folderId = selectedFolder.id;
					}
					navigator.clipboard.writeText(folderId);

					const folder = await joplin.data.get(['folders', folderId]);
					console.info(JSON.stringify(folder));

					await joplin.commands.execute('editor.focus');
				}
			});
			await joplin.views.menuItems.create('copyFolderIdContextMenu', 'copyFolderId', MenuItemLocation.FolderContextMenu);
		}

		if (enableShowFolderId) {
			await joplin.commands.register({
				name: 'showFolderId',
				label: 'Show Notebook ID',

				execute: async (folderId:string) => {
					if (typeof folderId === 'undefined') {
						const selectedFolder = await joplin.workspace.selectedFolder();
						folderId = selectedFolder.id;
					}

					await dialogs.addScript(nbDialog, './dialog.css');
					await dialogs.setHtml(nbDialog, '<h1>Notebook ID</h1><p><code>'+folderId+'</code></p></span>');
					await dialogs.setButtons(nbDialog, [
						{
							id: 'ok',
							title: 'Ok',
						},
						{
							id: 'copy',
							title: 'Copy',
						}
					]);

					const folder = await joplin.data.get(['folders', folderId]);
					console.info(JSON.stringify(folder));

					const result = await dialogs.open(nbDialog);
					if (result.id === 'copy') {
						navigator.clipboard.writeText(folderId);
					}

					await joplin.commands.execute('editor.focus');
				}
			});
			await joplin.views.menuItems.create('showFolderIdContextMenu', 'showFolderId', MenuItemLocation.FolderContextMenu);
		}
	},
});
