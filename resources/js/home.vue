<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <h1>Posts</h1>
        <h3>Total Posts: {{postCount}}</h3>

        <button @click="showEditor = !showEditor" class="btn btn-primary my-3">Add Post ➕</button>
        <div class="card mb-5" v-if="showEditor">
          <div class="card-header">Write new Post</div>
          <div class="card-body">
            <div class="form-group">
              <input type="text" class="form-control" v-model="title" placeholder="Title" />
            </div>
            <div class="form-group">
              <textarea
                cols="30"
                rows="4"
                class="form-control"
                placeholder="Post Body"
                v-model="body"
              ></textarea>
            </div>
            <div class="form-group">
              <input type="file" class="form-control" />
            </div>
            <div class="form-group">
              <button @click="addPost" class="btn btn-primary">Save</button>
            </div>
          </div>
        </div>

        <div class="card mb-5" v-if="showEditPostEditor">
          <div class="card-header">Edit Post</div>
          <div class="card-body">
            <div class="form-group">
              <input type="text" class="form-control" v-model="editPost.title" placeholder="Title" />
            </div>
            <div class="form-group">
              <textarea
                cols="30"
                rows="4"
                class="form-control"
                placeholder="Post Body"
                v-model="editPost.body"
              ></textarea>
            </div>
            <div class="form-group">
              <button @click="updatePost" class="btn btn-primary">Update</button>
            </div>
          </div>
        </div>

        <div id="posts">
          <post
            v-for="post in posts"
            :post="post"
            :key="post.id"
            @onEdit="startEdit"
            @onDelete="deletePost"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import sweetalert from "sweetalert";
import post from "./components/article.vue";
import toastr from "toastr";
toastr.options = {
  positionClass: "toast-bottom-right"
};

export default {
  components: {
    post
  },

  created() {
    axios.get("/api/blog").then(({ data: posts }) => {
      //   let { data: posts } = res;
      this.posts = posts;
      // fat arrow function //es6
    });
  },

  data() {
    return {
      posts: [],
      showEditor: false,
      title: null,
      body: null,
      editPost: {},
      showEditPostEditor: false
    };
  },
  methods: {
    deletePost(id) {
      sweetalert({
        title: "Sure to delete this post?",
        text: "Once you deleted a post then that can not be undone!",
        icon: "warning",
        buttons: true,
        dangerMode: true
      }).then(deletePermission => {
        if (deletePermission) {
          axios.delete(`/api/blog/${id}`).then(res => {
            this.posts = this.posts.filter(post => post.id !== id);

            sweetalert({
              title: "Post deleted successfully",
              icon: "success"
            });
          });
        }
      });
    },
    addPost() {
      axios
        .post("/api/blog", {
          title: this.title,
          body: this.body
        })
        .then(res => {
          this.posts.unshift(res.data);
          this.title = null;
          this.body = null;
          this.showEditor = false;

          sweetalert({
            title: "Post Created",
            icon: "success"
          });
        });
    },
    startEdit(post) {
      this.showEditPostEditor = true;
      this.editPost = { id: post.id, title: post.title, body: post.body };
    },
    updatePost() {
      sweetalert({
        title: "Sure to update this post ?",
        icons: "warning"
      }).then(yes => {
        if (yes) {
          axios
            .put(`/api/blog/${this.editPost.id}`, this.editPost)
            .then(res => {
              const index = this.posts.findIndex(
                post => post.id === this.editPost.id
              );
              this.$set(this.posts, index, res.data);
              this.showEditPostEditor = false;
              sweetalert({
                title: "Post Updated",
                icon: "success"
              });
            });
        }
      });
    }
  },
  computed: {
    // computed property
    postCount() {
      return this.posts.length;
    }
  }
};
</script>


<style scoped>
#posts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 25px;
}
</style>
