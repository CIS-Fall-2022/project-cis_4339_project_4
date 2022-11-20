<template>
  <main class="flex flex-row">
    <div id="_container" class="h-screen">
      <header class="w-full">
        <section class="text-center">
          <img class="m-auto" src="@\assets\DanPersona.svg" />
        </section>
        <nav class="mt-10">
          <ul class="flex flex-col gap-4">
            <li>
              <router-link to="/">
                <span
                  style="position: relative; top: 6px"
                  class="material-icons"
                  >dashboard</span
                >
                Dashboard
              </router-link>
            </li>
            <li>
              <router-link to="/calendar">
                <span
                  style="position: relative; top: 6px"
                  class="material-icons"
                  >event</span
                >
                Calendar
              </router-link>
            </li>
            <li>
              <router-link to="/intakeform">
                <span
                  style="position: relative; top: 6px"
                  class="material-icons"
                  >people</span
                >
                Client Intake Form
              </router-link>
            </li>
            <li>
              <router-link to="/eventform">
                <span
                  style="position: relative; top: 6px"
                  class="material-icons"
                  >event</span
                >
                Create Event
              </router-link>
            </li>
            <li>
              <router-link to="/findclient">
                <span
                  style="position: relative; top: 6px"
                  class="material-icons"
                  >search</span
                >
                Find Client
              </router-link>
            </li>
            <li>
              <router-link to="/findEvents">
                <span
                  style="position: relative; top: 6px"
                  class="material-icons"
                  >search</span
                >
                Find Event
              </router-link>
            </li>
          </ul>
        </nav>
      </header>
    </div>
    <div class="grow w-4/5">
      <section
        class="justify-end items-center h-24 flex"
        style="background: linear-gradient(250deg, #c8102e 70%, #efecec 50.6%)"
      >
        <h1 class="mr-20 text-3xl text-white" v-if="organization">
          {{ organization }}
        </h1>

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
      </section>
      <div>
        <router-view></router-view>
      </div>
    </div>
    <div></div>
  </main>
</template>

<script>
import axios from "axios";

export default {
  name: "App",

  data() {
    return {
      organization: "",
      loading: false,
      error: null,
    };
  },

  methods: {
    async fetchData() {
      try {
        this.error = null;
        this.loading = true;
        this.variable = null;
        const url =
          import.meta.env.VITE_ROOT_API +
          `/organizationData/id/` +
          import.meta.env.VITE_ORGID;
        const response = await axios.get(url);
        //"re-organizing" - mapping json from the response
        this.organization_name = response.data.map((item) => item.name);
        this.organization = this.organization_name[0];
      } catch (err) {
        if (err.response) {
          // client received an error response (5xx, 4xx)
          this.error = {
            title: "Org Name Serv Resp",
            message: err.message,
          };
        } else if (err.request) {
          // client never received a response, or request never left
          this.error = {
            title: "Org Name Reach Serv Err",
            message: err.message,
          };
        } else {
          // There's probably an error in your code
          this.error = {
            title: "Org Name App Error",
            message: err.message,
          };
        }
      }
      this.loading = false;
    },
  },

  mounted() {
    this.fetchData();
  },
};
</script>

<style>
#_container {
  background-color: #c8102e;
  color: white;
  padding: 18px;
}
</style>
