<template>
  <div class="admin-post-page">
    <section class="update-form">
      <AdminPostForm :post="loadedPost" @submit="onSubmitted" />
    </section>
  </div>
</template>

<script>
import axios from "axios";
import AdminPostForm from "../../../components/Admin/AdminPostForm.vue";

export default {
  components: { AdminPostForm },

  asyncData(context) {
    return axios
      .get(
        "https://react-redux-e4bc0-default-rtdb.europe-west1.firebasedatabase.app/posts/" +
          context.params.postId +
          ".json"
      )
      .then((res) => {
        console.log(res.data);

        return {
          loadedPost: { ...res.data, id: context.params.postId },
        };
      })
      .catch((e) => context.error(e));
  },
  methods: {
    onSubmitted(editedPost) {
      console.log("dispatching: " + this.$route.params.postId);
      this.$store
        .dispatch("editPost", editedPost)
        .then(() => this.$router.push("/admin"));
    },
    middleware: ['check-auth','auth'],
  },
  layout: "admin",

};
</script>

<style scoped>
.update-form {
  width: 90%;
  margin: 20px auto;
}
@media (min-width: 768px) {
  .update-form {
    width: 500px;
  }
}
</style>
