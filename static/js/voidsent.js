class VoidClient {
	constructor() {
		let proto = window.location.protocol === "https:" ? "wss" : "ws";
		this.ws = new WebSocket(`${proto}://${window.location.host}/ws`);

		this.ws.onopen = this.onopen.bind(this);
		this.ws.onerror = this.onerror.bind(this);
		this.ws.onmessage = this.onmessage.bind(this);
		this.ws.onclose = this.onclose.bind(this);

		this.lobbyRcv = [];
		this.joinRcv = [];
		this.leaveRcv = [];
		this.chatRcv = [];
		this.sessionRcv = [];
	}

	onmessage(ev) {
		console.log("data", ev.data);
		let data = JSON.parse(ev.data);

		console.log(data);

		switch (data.type) {
			case "lobby":
				console.log("got lobby");
				// this.lobby = data.lobby;
				// this.page = "lobby";
				// this.room = null;
				break;

			case "room:join":
				console.log("join room");
				for (let cb of this.joinRcv) {
					cb(data.body);
				}
				break;

			case "room:leave":
				console.log("leave room");
				for (let cb of this.leaveRcv) {
					cb(data.body);
				}
				break;

			case "session":
				console.log("got session");
				for (let cb of this.sessionRcv) {
					cb(data.body);
				}
		}
	}

	onerror(ev) {
		console.log("err", ev);
	}

	onclose(ev) {
		console.log("connection closed", ev);
	}

	onopen(ev) {
		console.log("open", ev);
	}

	newGame(name, roles) {
		this.ws.send(JSON.stringify({
			type: "newGame",
			voidsent: {
				name,
				roles,
			}
		}))
	}

	addEventListener(event, cb) {
		if (!cb) {
			return;
		}

		switch (event) {
			case "lobby":
				this.lobbyRcv.push(cb);
				break;

			case "chat":
				this.chatRcv.push(cb);
				break;

			case "room:join":
				this.joinRcv.push(cb);
				break;

			case "room:leave":
				this.leaveRcv.push(cb);
				break;

			case "session":
				this.sessionRcv.push(cb);
				break;
		}
	}
}

export const client = new VoidClient();