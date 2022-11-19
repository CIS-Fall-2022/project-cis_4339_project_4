<template>
  <FullCalendar :options="calendarOptions" />
</template>

<script>
import '@fullcalendar/core/vdom' // solves problem with Vite
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import axios from 'axios';


export default {
  components: {
    FullCalendar // make the <FullCalendar> tag available
  },
  data() {
    return {
      calendarOptions: {
        plugins: [ dayGridPlugin, timeGridPlugin, interactionPlugin ],
        height: "auto",
        contentHeight: "auto",
        expandRows: true,
        buttonText:{
          today: 'Today'
        },
        headerToolbar: {
          start: 'dayGridMonth dayGridWeek', // will normally be on the left. if RTL, will be on the right
          center: 'title',
          end: 'prev today next' // will normally be on the right. if RTL, will be on the left
          },
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