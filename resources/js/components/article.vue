<template>
  <article>
    <img :src="post.image" :alt="post.title" />

    <h1>{{post.title}}</h1>
    <p>{{post.body}}</p>
    <button class="btn btn-danger" @click="$emit('onDelete' , post.id)">x</button>
    <button class="btn btn-info" @click="$emit('onEdit' , post)">✏️</button>
  </article>
</template>


<script>
export default {
  props: ["post"]
};
</script>
<style>
article {
  background-color: #ddd;
  padding: 15px;
  color: #333;
  margin-bottom: 15px;
}
</style>
