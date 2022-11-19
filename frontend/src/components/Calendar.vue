<template>
  <FullCalendar :options="calendarOptions" />
</template>

<script>
import '@fullcalendar/core/vdom' // solves problem with Vite
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import axios from 'axios';


export default {
  components: {
    FullCalendar // make the <FullCalendar> tag available
  },
  data() {
    return {
      calendarOptions: {
        plugins: [ dayGridPlugin, interactionPlugin ],
        initialView: 'dayGridMonth',
        timeZone: 'America/Chicago',
        events: []
      }
    }
  },
  methods: {
    async fetchData() {
      const url = 'http://localhost:3000/eventData'
      const response = await axios.get(url);
      var returnedData = response.data
      var arr = [];
      returnedData.forEach(data => {
        var payload = {
          title: data.eventName,
          date: data.date
        }
        arr.push(payload)
      });
      this.calendarOptions.events = arr
    },
    
  },
  mounted() {
    this.fetchData();
  }
}
</script>