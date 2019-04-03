<template>
<div class="multiple-choice-input" v-show="choices.length > 0">
		<div class="multiple-choice-item" :class="{ selected: selectedIndex === index }" v-for="(choice, index) in choices" v-on:click="select(index)">
			<div class="multiple-choice-title">{{ choice.title }}</div>
			<span>{{ choice.desc }}</span>
		</div>
	</div>
</template>
<script>
	export default {
		props: ['choices'],
		data() {
			return {
				selectedIndex: 0
			}
		},
		watch: {
			choices: function() {
				if (this.selectedIndex >= this.choices.length) {
					// out of bounds
					this.selectedIndex = -1;
				}
			}
		},
		methods: {
			select: function(idx) {
				this.selectedIndex = idx;
			},
			getValue: function() {
				if (this.selectedIndex === -1) return;
				return this.choices[this.selectedIndex].value;
			}
		}
	}
</script>
