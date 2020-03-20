const Meta = imports.gi.Meta;

let ww = {};
let wse;

function adjustWS() {
	let i = global.screen.n_workspaces;
	while (i--) {
		let ws = global.screen.get_workspace_by_index(i);
		// if ws has no windows, it should be removed
		if (ws.list_windows().filter(w => !w.is_on_all_workspaces()).length == 0)
			global.screen.remove_workspace(ws, global.get_current_time());
	}
	// leave one final empty workspace
	global.screen.append_new_workspace(false, global.get_current_time());
}

function bindNewWindows() {
	global.get_window_actors().filter((a) => !(a in ww)).forEach(function(actor) {
		let win = actor.get_meta_window();
		let eid = win.connect("workspace-changed", adjustWS);
		ww[actor] = true;
		actor.connect("destroy", function() { win.disconnect(eid); delete ww[actor]; });
	});
}

// Mandatory Functions //

function init(extensionMeta) {

}

function enable() {
	// TOFIX there has to do a better way to bind new windows
	wse = global.screen.connect("window-added", bindNewWindows);
	bindNewWindows();
}

function disable() {
	global.screen.disconnect(wse);
}
