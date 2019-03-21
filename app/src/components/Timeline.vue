<template>
	<div class="timeline">
		<div class="timeline-item" v-for="t in timelineItems" :style="t.style">
			<span>{{ t.time }}</span>
		</div>
	</div>
</template>

<script>
	import { data } from '../js/ui.js';
	
	export default {
		data () {
			return data;
		},
		computed: {
			timelineItems: function() {
				//if (!this.$el) return [];
	
				var max_steps = !this.$el ? 8 : Math.floor(this.$el.offsetHeight / 600 * 8);

				var range = this.window_end - this.window_start;

				if (range <= 0) {
					return [];
				}
				var nice_powers = [1000, 60000, 3600000]; // 1 second, 1 minute, 1 hour (unit: milliseconds)
				var nice_steps = [0.5, 1, 2, 5, 10, 15]; // nice step sizes

				console.log(this.$el);

				var step = 0;
				var i = 0, j = 0;
				for (i = 0, j = 0; i + j < nice_powers.length + nice_steps.length; i = (i + 1) % nice_steps.length) {
					step = nice_powers[j] * nice_steps[i];
					if (range / step < max_steps) {
						break;	
					}

					if (i === nice_steps.length - 1) ++j;
				}

				var timestamps = [];
				for (var t = Math.ceil(this.window_start / step) * step; t <= this.window_end; t += step) {
					var style = {
						top: (t - this.window_start) / (this.window_end - this.window_start) * 100 + '%'
					}
					var date = new Date(t);

					var hours = date.getUTCHours();
					var minutes = date.getUTCMinutes();
					var seconds = date.getUTCSeconds();

					hours = (hours >= 10 ? '' : '0') + hours;
					minutes = (minutes >= 10 ? '' : '0') + minutes;
					seconds = (seconds >= 10 ? '' : '0') + seconds;

					var time = hours + ':' + minutes;
					if (step < 60 * 1000) {
						time += ':' + seconds;
					}

					timestamps.push({
						style: style,
						time: time
					});
				}
				return timestamps;
			}
		}
	}
</script>
