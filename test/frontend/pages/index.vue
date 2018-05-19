<template>
	<div id="app">
		<xheader></xheader>
		<a href="/page/a" class="page">A</a>
		<a href="/page/b" class="page">B</a>
	</div>
</template>

<script>
	import xheader from '../component/header.vue';
	export default {
		components: {
			xheader,
		},
		name: 'app',
		data (){
			return {
				title: 'Hico Test',
			};
		},
	};
</script>

<style lang= "less">
	#app {
		height: 100%;
		position: relative;
		padding-top: 51px;
	}
</style>