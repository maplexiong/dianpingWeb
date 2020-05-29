<template>
  <div>
    <div class="container">
      <div class="page1300">
        <!-- 左侧 -->

        <div class="rmjx">
          <h1>热门精选</h1>
          <div v-for="(item, index) in HotList" :key="index">
            <div class="title">
              <img src="../../assets/pages/standard-large.png" alt />
              <h3 @click="goDetail(item.aid)">{{ item.title | title }}</h3>
            </div>
            <div class="date">
              <div>
                <div>
                  <span>{{ item.createdTime | date }}</span>
                </div>
                <div>
                  <span>{{ item.remarkObjectName }}</span>
                </div>
                <div>
                  <span>{{ item.typeName }}</span>
                </div>
              </div>
              <div>
                <img
                  @click="isLike(item)"
                  src="../../assets/pages/like.png"
                  alt
                />
                <span>{{ item.likeNumber }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="zxfb">
          <h1>最新发布</h1>
          <div v-for="(item, index) in NewList" :key="index">
            <div class="title">
              <img src="../../assets/pages/standard-large.png" alt />
              <h3 @click="goDetail(item.aid)">{{ item.title | title }}</h3>
            </div>
            <div class="date">
              <div>
                <div>
                  <span>{{ item.createdTime | date }}</span>
                </div>
                <div>
                  <span>{{ item.remarkObjectName }}</span>
                </div>
                <div>
                  <span>{{ item.typeName }}</span>
                </div>
              </div>
              <div>
                <img
                  @click="isLike(item)"
                  src="../../assets/pages/like.png"
                  alt
                />
                <span>{{ item.likeNumber }}</span>
              </div>
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
      HotList: [],
      NewList: [],
    };
  },
  methods: {
    isLike(val) {
      let userInfo = sessionStorage.getItem("user");
      if (!userInfo) {
        this.$notify({
          title: "警告消息",
          message: "当前操作需要您是登陆状态,请登陆!",
          type: "warning",
          duration: 2000,
        });
        return;
      }
      // console.log("要发送的aid:", val.aid);
      this.axios
        .get(`/user/${val.aid}/like`)
        .then((res) => {
          this.getHotList();
          this.getNewList();
        })
        .catch((err) => {
          console.log(err);
          // alert("网络错误");
        });
    },

    goDetail(val) {
      // console.log(val);
      let userInfo = sessionStorage.getItem("user");
      if (!userInfo) {
        this.$notify({
          title: "警告消息",
          message: "当前操作需要您是登陆状态,请登陆!",
          type: "warning",
          duration: 2000,
        });
        return;
      }
      this.$store.commit("setAid", val);
      this.$store.commit("setPageNum", 4);
    },
    async getHotList() {
      let { data: res } = await this.axios.get("/article/hotlist");
      // console.log(res.data);
      this.HotList = res.data;
      // let newArr = res.data.map((elem) => console.log(elem.likeNumber));
    },
    async getNewList() {
      let { data: res } = await this.axios.get("/article/newlist");
      // console.log(res.data);
      this.NewList = res.data;
    },
  },
  created() {
    this.getHotList();
    this.getNewList();
  },
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}
.container {
  /* height: 700px; */
  width: 100%;
  min-height: 600px;
  /* background: tomato; */
  min-width: 1300px;
}

.page1300 {
  width: 1300px;
  /* height: 700px; */
  /* border: 1px red solid; */
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  padding: 30px 100px;
}

.title {
  width: 100%;
  height: 40px;
  position: relative;
}
.title > img {
  position: absolute;
  left: 0;
  top: 7px;
  margin-right: 10px;
}
.title > h3 {
  position: absolute;
  left: 35px;
  top: 7px;
  cursor: pointer;
  transition: all 0.1s linear;
}
.title > h2:hover {
  color: gray;
}
.date {
  width: 100%;
  height: 30px;
  position: relative;
  display: flex;
  justify-content: space-between;
}
.date > div:first-child {
  width: 350px;
  height: 30px;
  display: flex;
  justify-content: space-between;
}

.date > div:first-child > div {
  width: 150px;
  height: 30px;
  position: relative;
}
.date > div:first-child > div > span {
  font-size: 12px;
  line-height: 30px;
  color: gray;
  cursor: pointer;
  transition: all 0.1s linear;
}

.date > div:first-child > div > span:hover {
  color: lightsalmon;
}
.date > div:first-child > div > img {
  position: absolute;
  left: 0;
  top: 7px;
}

.date > div:last-child {
  width: 60px;
  height: 30px;
  position: relative;
  cursor: pointer;
  line-height: 30px;
}

.date > div:last-child > img {
  position: absolute;
  left: 0;
  top: 5px;
}

.date > div:last-child > span {
  font-size: 12px;
  line-height: 35px;
}

.content {
  width: 100%;
  height: 90px;
}
.content > span {
  text-align: left;
  line-height: 31px;
  display: block;
  color: gray;
}
.pagination {
  margin-left: 10px;
  width: 830px !important;
  height: 40px !important;
  margin-bottom: 5px;
}
.support {
  background-color: #fefbdc;
  width: 300px;
  height: 140px;
  position: relative;
  margin-top: 10px;
}

.support > img {
  position: absolute;
  right: 20px;
  top: 20px;
}
.support > h2 {
  position: absolute;
  top: 20px;
  left: 22px;
}

.support > p {
  width: 250px;
  position: absolute;
  left: 20px;
  top: 60px;
}
.left-content {
  display: flex;
  justify-content: space-between;
}
.rmjx,
.zxfb {
  width: 450px;
  height: 100%;
}
.rmjx > h1,
.zxfb > h1 {
  padding: 20px;
}
.rmjx > div,
.zxfb > div {
  padding: 10px;
}
</style>
