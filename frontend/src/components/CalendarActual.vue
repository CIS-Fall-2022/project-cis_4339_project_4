<template>
	<div id="app">
		<h1>My Calendar</h1>
		<calendar-view
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
		components: {
			CalendarView,
			CalendarViewHeader,
		},
		data() {
			return {
				showDate: this.thisMonth(1),
				message: "",
				startingDayOfWeek: 0,
				disablePast: false,
				disableFuture: false,
				displayPeriodUom: "month",
				displayPeriodCount: 1,
				displayWeekNumbers: false,
				showTimes: true,
				selectionStart: null,
				selectionEnd: null,
				newItemTitle: "",
				newItemStartDate: "",
				newItemEndDate: "",
				useDefaultTheme: true,
				useHolidayTheme: true,
				useTodayIcons: false,
				items: [
					{
						id: __dirname,
						startDate: this.date,
						title: this.eventName

					}
				],
        		loading: false,
        		error: null,
      		};
		},
		computed: {
		userLocale() {
			return CalendarMath.getDefaultBrowserLocale
		},
		dayNames() {
			return CalendarMath.getFormattedWeekdayNames(this.userLocale, "long", 0)
		},
		themeClasses() {
			return {
				"theme-default": this.useDefaultTheme,
				"holiday-us-traditional": this.useHolidayTheme,
				"holiday-us-official": this.useHolidayTheme,
			}
		},
		myDateClasses() {
			// This was added to demonstrate the dateClasses prop. Note in particular that the
			// keys of the object are `yyyy-mm-dd` ISO date strings (not dates), and the values
			// for those keys are strings or string arrays. Keep in mind that your CSS to style these
			// may need to be fairly specific to make it override your theme's styles. See the
			// CSS at the bottom of this component to see how these are styled.
			const o = {}
			const theFirst = this.thisMonth(1)
			const ides = [2, 4, 6, 9].includes(theFirst.getMonth()) ? 15 : 13
			const idesDate = this.thisMonth(ides)
			o[CalendarMath.isoYearMonthDay(idesDate)] = "ides"
			o[CalendarMath.isoYearMonthDay(this.thisMonth(21))] = ["do-you-remember", "the-21st"]
			return o
		},
	},
	mounted() {
		this.newItemStartDate = CalendarMath.isoYearMonthDay(CalendarMath.today())
		this.newItemEndDate = CalendarMath.isoYearMonthDay(CalendarMath.today())
	},
		methods: {
      async fetchData() {
        try {
          this.error = null;
          this.loading = true;
          const url = `http://127.0.0.1:3000/eventData/`;
          const response = await axios.get(url);
          //"re-organizing" - mapping json from the response
          this.eventName = response.data.map((item) => item.eventData.eventName);
          this.date = response.data.map((item) => item.eventData.date);
        } catch (err) {
          if (err.response) {
            // client received an error response (5xx, 4xx)
            this.error = {
              title: "Graph Data Serv Resp",
              message: err.message,
            };
          } else if (err.request) {
            // client never received a response, or request never left
            this.error = {
              title: "Graph Data Reach Serv Error",
              message: err.message,
            };
          } else {
            // There's probably an error in your code
            this.error = {
              title: "Graph Data App Error",
              message: err.message,
            };
          }
        }
        this.loading = false;
      },
  
      routePush(routeName) {
        this.$router.push({ name: routeName });
      },
    },
	}
</script>
<style>
	#app {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		color: #2c3e50;
		height: 67vh;
		width: 90vw;
		margin-left: auto;
		margin-right: auto;
	}
</style>