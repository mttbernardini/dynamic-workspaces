const Meta = imports.gi.Meta;

let _handles, _adjusting;

function getWorkspaces() {
	return Array(global.screen.n_workspaces+1).join().split("").map(
		(_,i) => global.screen.get_workspace_by_index(i)
	);
}

function adjustWS() {
	// prevent recursion
	if (_adjusting) return;
	_adjusting = true;
	let wss = getWorkspaces();
	let last_ws = wss.splice(-1)[0];
	wss.forEach((ws) => {
		// if ws has no windows, it should be removed
		if (ws.list_windows().filter(w => !w.is_on_all_workspaces()).length == 0)
			global.screen.remove_workspace(ws, global.get_current_time());
	});
	// if last workspace is not empty, append a new empty one
	if (last_ws.list_windows().filter(w => !w.is_on_all_workspaces()).length > 0)
		global.screen.append_new_workspace(false, global.get_current_time());
	_adjusting = false;
}

function bindWS(ws) {
	let wadd_e = ws.connect("window-added", adjustWS);
	let wrem_e = ws.connect("window-removed", adjustWS);
	_handles.push([ws, wadd_e]);
	_handles.push([ws, wrem_e]);
}

// Mandatory Functions //

function init(extensionMeta) {
	_handles = [];
}

function enable() {
	let wsadd_e = global.screen.connect("workspace-added", (_, wsi) => {
		bindWS(global.screen.get_workspace_by_index(wsi));
		adjustWS();
	});
	let wsrem_e = global.screen.connect("workspace-removed", () => {
		_handles = _handles.filter(([obj,_]) => !(obj instanceof Meta.Workspace) || getWorkspaces().indexOf(obj) > -1);
		adjustWS();
	});
	_handles.push([global.screen, wsadd_e]);
	_handles.push([global.screen, wsrem_e]);
	// bind already existing workspaces
	getWorkspaces().forEach(bindWS);
	adjustWS();
}

function disable() {
	_handles.forEach(([obj, event_id]) => {
		try {
		obj.disconnect(event_id);
		} catch(e) {global.log(e)}
	});
}
