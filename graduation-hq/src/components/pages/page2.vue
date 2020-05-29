<template>
  <div>
    <div class="container">
      <div class="page1300">
        <div>
          <div class="bg-big">
            <h1 class="big-title">App</h1>
          </div>
          <div v-for="(item, index) in App" :key="index">
            <span>{{ index + 1 }}</span>
            <span class="small-title"> {{ item.remarkObjectName }}</span>
            <div class="hot">
              <img src="../../assets/pages/hot.png" alt />
              <span>{{ item.articleNumber }}</span>
            </div>
          </div>
        </div>

        <div>
          <div class="bg-big">
            <h1 class="big-title">PCApp</h1>
          </div>
          <div v-for="(item, index) in PCApp" :key="index">
            <span>{{ index + 1 }}</span>
            <span class="small-title"> {{ item.remarkObjectName }}</span>
            <div class="hot">
              <img src="../../assets/pages/hot.png" alt />
              <span>{{ item.articleNumber }}</span>
            </div>
          </div>
        </div>

        <div>
          <div class="bg-big">
            <h1 class="big-title">WebApp</h1>
          </div>
          <div v-for="(item, index) in WebApp" :key="index">
            <span>{{ index + 1 }}</span>
            <span class="small-title"> {{ item.remarkObjectName }}</span>
            <div class="hot">
              <img src="../../assets/pages/hot.png" alt />
              <span>{{ item.articleNumber }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      App: [],
      PCApp: [],
      WebApp: [],
    };
  },
  methods: {
    getData() {
      this.axios
        .get("/dianpingrank")
        .then((res) => {
          this.App = res.data.data.App;
          this.PCApp = res.data.data.PCApp;
          this.WebApp = res.data.data.WebApp;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  created() {
    this.getData();
  },
};
</script>

<style scoped>
.container {
  width: 100%;
  min-width: 1300px;
}
.page1300 {
  width: 1300px;
  min-height: 600px;
  height: 100%;
  margin: 10px auto;
  display: flex;
  justify-content: space-between;
  text-align: center;
}
.page1300 > div {
  width: 420px;
  min-height: 600px;
  background-color: #f4f4f4;
  text-align: left;
  padding: 5px;
  box-sizing: border-box;
  border-radius: 15px;
}
.title {
  background-color: #fafafa;
  text-align: center;
}
.page1300 > div > div {
  /* border: 1px solid #00f; */
  display: flex;
  margin: 10px 3px;
  vertical-align: baseline;
  justify-content: space-between;
}
.page1300 > div > div > span:first-child {
  color: #ff183e;
  font-size: 20px;
  line-height: 30px;
  /* border: 1px solid #f0f; */
  width: 30px;
  text-align: center;
}
.page1300 > div > div > span:nth-child(2) {
  display: inline-block;
  /* border: 1px solid #0f0; */
  width: 300px;
  /* margin-left: -260px; */
  line-height: 30px;
}
.big-title {
  padding-left: 15px;
  /* border: 1px solid #f0f; */
  display: inline-block;
  /* background-color: #f0f; */
}

.small-title {
  line-height: 29px;
}
.small-title:hover {
  color: #ff5c38;
  cursor: pointer;
}
.hot {
  position: relative;
  /* border: 1px solid #0f0; */
  width: 60px;
}
.hot > img {
  position: absolute;
  top: 2px;
}
.hot > span {
  position: absolute;
  right: 0;
  margin-right: 10px;
  padding: 0 3px;
  font-size: 18px;
  line-height: 30px;
}
</style>
