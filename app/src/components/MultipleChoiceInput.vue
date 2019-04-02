<template>
<div class="multiple-choice-input" v-show="choices.length > 0">
		<div class="multiple-choice-item" v-for="(choice, index) in choices">
			<b>{{ choice.title }}</b>
			<span>{{ choice.desc }}</span>
		</div>
	</div>
</template>
<script>
	export default {
		props: ['choices'],
		data() {
			return {
				selectedIndex: 0,
			}
		},
		methods: {
			getSelected: function() {
				return '';			 
			} 
		}
	}
</script>
