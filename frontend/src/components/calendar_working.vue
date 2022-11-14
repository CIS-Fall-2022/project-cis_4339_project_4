<template>
	<div>
		<h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">Events Calendar</h1>
		<calendar-view
			:items="items"
			:show-date="showDate"
			class="theme-default holiday-us-traditional holiday-us-official">
			<template #header="{ headerProps }">
				<calendar-view-header
					:header-props="headerProps"
					@input="setShowDate" />
			</template>
		</calendar-view>
	</div>
</template>
<script>
	import { CalendarView, CalendarViewHeader } from "vue-simple-calendar"
	import "../../node_modules/vue-simple-calendar/dist/style.css"
	import "../../node_modules/vue-simple-calendar/dist/css/default.css"
	import "../../node_modules/vue-simple-calendar/dist/css/holidays-us.css"

	export default {
		name: 'app',
		data: function() {
			return { 
				showDate: new Date(),
				items: [
					{
						id: "1",
						startDate: "2022-11-16",
						title: "Test"
					}
				]
			}
		},
		components: {
			CalendarView,
			CalendarViewHeader,
		},
		methods: {
			setShowDate(d) {
				this.showDate = d;
			},
		}
	}
</script>