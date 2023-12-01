<template>
  <div class="admin-new-post-page">
    <section class="new-post-form"></section>
    <AdminPostForm @submit="onSubmited" />
  </div>
</template>

<script>

import AdminPostForm from "../../../components/Admin/AdminPostForm.vue";
export default {
  components: {
    AdminPostForm,
  },
  data() {
    return {
      editedPost: {
        author: "",
        title: "",
        thumbnailLink: "",
        content: "",
      },
    };
  },
  methods: {
    onSubmited(postData) {
      this.$store
        .dispatch("addPost", postData)
        .then(() => this.$router.push("/admin"));
    },
    onSave() {
      console.log(this.editedPost);
    },
    onCancel() {
      this.$router.push("/admin");
    },
  },
  layout: "admin",
  middleware: ["check-auth", "auth"],
};
</script>

<style scoped>
.new-post-form {
  width: 90%;
  margin: 20px auto;
}

@media (min-width: 768px) {
  .new-post-form {
    width: 500px;
  }
}
</style>
