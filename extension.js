let _managed_windows, _wsadd_event, _wsdel_event;

function adjustWS() {
	// TODO: avoid removing and readding last workspace
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

function bindWindow(win) {
	// assumes `win` is not managed
	let eid = win.connect("workspace-changed", adjustWS);
	_managed_windows[win] = [win, eid];
}

function unbindWindow(win) {
	// assumes `win` is managed
	if (typeof(win) == "string")
		win = _managed_windows[win][0];
	let event_id = _managed_windows[win][1];
	win.disconnect(event_id);
	delete _managed_windows[win];
}

// Mandatory Functions //

function init(extensionMeta) {
	_managed_windows = {};
}

function enable() {
	_wsadd_event = global.screen.connect("window-added", (_, win) => {
		if (!(win in _managed_windows))
			bindWindow(win);
	});
	_wsdel_event = global.screen.connect("window-removed", (_, win) => {
		if (win in _managed_windows)
			unbindWindow(win);
	})
	global.get_window_actors().forEach((actor) => bindWindow(actor.meta_window));
	adjustWS();
}

function disable() {
	Object.keys(_managed_windows).forEach(unbindWindow);
	global.screen.disconnect(_wsadd_event);
	global.screen.disconnect(_wsdel_event);
}
