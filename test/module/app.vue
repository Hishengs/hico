<template>
	<div id="app">
		<h1>{{ title }}</h1>
	</div>
</template>

<script>
	export default {
		name: 'app',
		data (){
			return {
				title: 'Hico Test 1',
			};
		},
	};
</script>

<style lang= "less">
	#app h1 {
		text-align: center;
		color: #ff6600;
	}
</style>