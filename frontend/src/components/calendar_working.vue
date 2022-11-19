<script>
import '@fullcalendar/core/vdom' // solves problem with Vite
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'


export default {
  components: {
    FullCalendar // make the <FullCalendar> tag available
  },
  data() {
    return {
      calendarOptions: {
        plugins: [ dayGridPlugin, interactionPlugin ],
        initialView: 'dayGridMonth',
        dateClick: this.handleDateClick,
        names: [],
        dates: []
      }
    }
  },
  methods: {

    async fetchData() {
      const url = 'http://127.0.0.1:3000/eventData'
      const response = await axios.get(url);
      this.names = response.data.map((item) => item.eventData.eventName);
      this.dates = response.data.map((item) => item.eventData.date);
    
  },

  mounted() {
    this.fetchData();
  }
}
}
</script>
<template>
  <FullCalendar :options="calendarOptions" />
</template>