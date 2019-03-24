<template>
	<div class="main-column">
		<file-item v-for="item in fileItems" :key="item.id" :style="item.style" :paths="item.paths" :type="item.type" :start="item.start" :end="item.end"></file-item>
	</div>
</template>

<script>
	import FileItem from './FileItem.vue';
	
	import { COL_PADDING, COL_ITEM_WIDTH } from '../js/globals.js';
	import { data } from '../js/ui.js';

	export default {
		data () {
			return data;
		},
		props: ['files', 'types'],
		computed: {
			// NOTE: this cannot be written in the lambda notation () => { ... }
			// because it will lead to `this` being `undefined` !
			fileItems: function () {
				var items = [];
				// calculate the percentage minimum so that items cannot be smaller than 22px
				var min_height = !this.$el ? -1 : 22 / this.$el.offsetHeight;

 				for (var type in this.files) {
					var col = this.types.indexOf(type);
					for (var j = 0; j < this.files[type].length; ++j) {
						var file = this.files[type][j];

						var top = (file.start - this.window_start) / (this.window_end - this.window_start);
						var height = (file.end - file.start) / (this.window_end - this.window_start);

						var new_item = {
							type: type,
							start: file.start,
							end: file.end,
							paths: [file.path]
						}

						for (var k = j + 1; k < this.files[type].length; ++k) {
							var file_next = this.files[type][k];
							var top_next = (file_next.start - this.window_start) / (this.window_end - this.window_start);
							var height_next = (file_next.end - file_next.start) / (this.window_end - this.window_start);

							if (top + Math.max(min_height, height) > top_next) {
								// items overlap group together
								new_item.paths.push(file_next.path);
								new_item.end = file_next.end;
								height = top_next - top + height_next;
							} else break;
						}
						j = k - 1;

						new_item.style = {
							top: top * 100 + '%',
							height: Math.max(min_height, height) * 100 + '%',
							left: col * (COL_ITEM_WIDTH + COL_PADDING) + COL_PADDING + 'px',
							width: COL_ITEM_WIDTH + 'px'
						};

						// TODO: check if item is visible (top < 100% || top + height > 0%)							
						items.push(new_item);
					}
				}
				return items;
			}
		},
		components: { FileItem }
	}
</script>

