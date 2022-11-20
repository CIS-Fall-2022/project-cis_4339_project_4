<template>
  <main>
    <div>
      <h1
        class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10"
      >
        Welcome
      </h1>
    </div>

    <div class="pad">
      <br />

      <EnrollmentBar
        v-if="!loading && !error"
        :label="labels"
        :chart-data="enrolled"
      ></EnrollmentBar>
      <!-- Start of loading animation -->
      <div class="mt-40" v-if="loading">
        <p class="text-6xl font-bold text-center text-gray-500 animate-pulse">
          Loading...
        </p>
      </div>
      <!-- End of loading animation -->

      <!-- Start of error alert -->
      <div class="mt-12 bg-red-50" v-if="error">
        <h3 class="px-4 py-1 text-4xl font-bold text-white bg-red-800">
          {{ error.title }}
        </h3>
        <p class="p-4 text-lg font-bold text-red-900">
          {{ error.message }}
        </p>
      </div>
      <!-- End of error alert -->
      <br />
      <br />
    </div>

    <div class="pad">
      <table class="table table-striped">
        <thead class="table-dark">
          <tr>
            <th>Event Name</th>
            <th>Date</th>
            <th>Number of Attendees</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(label, index) in labels" :key="label.eventName">
            <td>{{ label }}</td>
            <td>{{ date[index] }}</td>
            <td>{{ enrolled[index] }}</td>
          </tr>
        </tbody>
      </table>
      <br />
      <br />
      <br />
    </div>
  </main>
</template>

<script>
import axios from "axios";
import EnrollmentBar from "./BarChartComponent.vue";

export default {
  components: {
    EnrollmentBar,
  },
  data() {
    return {
      labels: [],
      enrolled: [],

      date: [],

      loading: false,
      error: null,
    };
  },

  methods: {
    async fetchData() {
      try {
        this.error = null;
        this.loading = true;
        const url =
          import.meta.env.VITE_ROOT_API +
          `/eventData/orgId/count/two/` +
          import.meta.env.VITE_ORGID;
        const response = await axios.get(url);
        //"re-organizing" - mapping json from the response
        this.labels = response.data.map((item) => item.eventData.eventName);
        this.enrolled = response.data.map((item) => item.attendees_count);

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

  mounted() {
    this.fetchData();
  },
};
</script>

<style>
table,
th,
td {
  border: 2px solid black;
}

.pad {
  padding: 0px 50px 0px 50px;
}
</style>
