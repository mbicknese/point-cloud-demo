export default () => ({
	mutations: [],
	add() {
		this.mutations = [...this.mutations, { action: "add" }];
	},
});
