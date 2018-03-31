<template>
	<div id="header">
		<a class="item site-name" href="/">{{ siteName }}</a>
	</div>
</template>

<script>
	export default {
		name: 'x-header',
		data (){
			return {
				siteName: 'Hico Testxxx',
			};
		},
	};
</script>

<style lang= "less">
	#header {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 50px;
		line-height: 50px;
		border-bottom: 1px solid #dfdfdf;
		.item {
			display: inline-block;
			padding: 0 10px;
			text-align: center;
			text-decoration: none;
			color: inherit;
		}
		.site-name {
			font-size: 20px;
			color: #1890ff;
		}
	}
</style>