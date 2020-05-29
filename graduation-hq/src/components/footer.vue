<template>
  <div>
    <div class="container">
      <div class="footBox">
        <div>
          <h1 class="title">{{ siteVisits }}</h1>
          <span class="explain">网站累计访问量</span>
        </div>
        <div>
          <h1 class="title">{{ UserCount }}</h1>
          <span class="explain">累计注册人数</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      UserCount: 0,
      siteVisits: 0,
    };
  },
  methods: {
    async getUserCount() {
      let { data: res } = await this.axios.get("/user/counts");
      // console.log(res.data);
      this.UserCount = res.data;
    },
    async getSiteVisits() {
      let { data: res } = await this.axios.get("/sitevisits/counts");
      this.siteVisits = res.data;
    },
  },
  created() {
    this.getUserCount();
    this.getSiteVisits();
  },
};
</script>

<style scoped>
.container {
  width: 100%;
  height: 150px;
  background-color: wheat;
  background-image: url("../assets/footer/footer-bg.png");
}
.footBox {
  width: 500px;
  height: 100px;
  margin: 0 auto;
  /* border: 1px solid #0f0; */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 60px 100px;
  box-sizing: border-box;
  /* background-color: #fefbdc; */
}
h1.title {
  color: #ffeb7b;
  padding: 0.05rem 0;
  font-family: electronicFont;
  font-weight: bold;
  /* font-style: italic; */
  font-size: 45px;
}
span.explain {
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
}
</style>
