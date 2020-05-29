<template>
  <div>
    <div class="container">
      <h1>Have a Question?</h1>
      <h6>
        If you have any question you can ask below or enter what you are looking
        for!
      </h6>
      <div class="search">
        <input
          type="text"
          v-model="searchMsg"
          placeholder="Type your search terms here"
        />
        <button>search</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchMsg: undefined,
    };
  },
};
</script>

<style scoped>
.container {
  width: 100%;
  height: 280px;
  /* background-color: bisque; */
  background-image: url("../assets/search/main-bg.jpg");
}
h1 {
  height: 120px;
  line-height: 120px;
  color: white;
}

h6 {
  font-size: 16px;
  font-style: italic;
  color: white;
}
.search {
  margin-top: 50px;
}

input {
  height: 50px;
  width: 850px;
  margin-right: 30px;
  padding: 5px;
  box-sizing: border-box;
  outline: none;
}

button {
  outline: none;
  height: 50px;
  width: 100px;
  background-color: #4b5760;
  color: whitesmoke;
  border: 0;
  transition: all 0.2s linear;
  cursor: pointer;
}

button:hover {
  background-color: #3b4246;
}
</style>
