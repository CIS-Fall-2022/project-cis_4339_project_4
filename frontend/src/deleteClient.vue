<template>
    <main>
      <div>
        <h1
          class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10"
        >
          Delete Client
        </h1>
      </div>
      <div class="px-10 pt-20">
        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10"
        >
          <h2 class="text-2xl font-bold">Select The Client to Delete:</h2>
        </div>
        <table>
            <tr>
                <td>First Name</td>
                <td>Last Name</td>
                <td>Client ID</td>
                <td>Organization ID</td>
            </tr>
            <tr v-for="user in users" v-bind:key="user.id">
                <td>{{user.firstName}}</td>
                <td>{{user.lastName}}</td>
                <td>{{user.id}}</td>
                <td>{{user.orginization_ID}}</td>
                <td><button v-on:click="deleteClient(user.id)">Delete</button></td>
            </tr>
        </table>
        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10"
        >
          <div></div>
          <div></div>
        </div>
      </div>
    </main>
  </template>
  <script>

  import axios from "axios"
  import Vue from "vue"
  import VueAxios from "vue-axios"
  Vue.use(VueAxios, axios)

  export default {
    name: 'Users',
    data() {
      return {
        users:null
      };
    },

    mounted() {
      let apiURL =
        import.meta.env.VITE_ROOT_API +
        `/primarydata/orgId/633dd0400b7c9d8f912fb0b2`;
  
      axios.get(apiURL).then((resp) => {
        this.queryData = resp.data.map((item) => item.primaryData);
      });
      window.scrollTo(0, 0);

      this.getData()
    },

    methods: 
    {
      getData()
      {
        this.axios.get('http://127.0.0.1:3000/primaryData').then((result)=>{
            console.warn(result)
            this.users=result.data
        })
      },

      deleteUser(id)
      {
        this.axios.delete("http://127.0.0.1:3000/primaryData/client/a2a707d0-4527-11ed-b74f-896395cf3c7b"+id).then(()=>{
            this.getData();
      })
      }
    },


  };
  </script>
  