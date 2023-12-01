<template>
  <div class="posts-page">
    <PostsList :posts="loadedPosts"></PostsList>
  </div>
</template>

<script>
import PostsList from "../../components/posts/PostsList.vue";

export default {
  components: { PostsList },
  middleware: "logs",

  computed: {
    loadedPosts() {
      return this.$store.getters.loadedPosts;
    },
  },
};
</script>

<style scoped>
.posts-page {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
