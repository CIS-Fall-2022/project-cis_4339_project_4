<template>
  <main>
    <div>
      <h1
        class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10"
      >
        Welcome
      </h1>
    </div>

    <div>
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
      loading: false,
      error: null,
    };
  },

  methods: {
    async fetchData() {
      try {
        this.error = null;
        this.loading = true;
        const url = `http://127.0.0.1:3000/eventData/orgId/count/two/633dd0400b7c9d8f912fb0b2`;
        const response = await axios.get(url);
        //"re-organizing" - mapping json from the response
        this.labels = response.data.map((item) => item.eventData.eventName);
        this.enrolled = response.data.map((item) => item.attendees_count);
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
