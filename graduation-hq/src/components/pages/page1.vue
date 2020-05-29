<template>
  <div>
    <div class="container">
      <div class="page1300">
        <div>
          <div v-for="(item, index) in allArticles" :key="index">
            <div class="title">
              <img src="../../assets/pages/standard-large.png" alt />
              <h2 @click="goDetail(item.aid)">{{ item.title }}</h2>
            </div>
            <div class="date">
              <div>
                <div>
                  <img src="../../assets/pages/createTime.png" alt />
                  <span>{{ item.createdTime | date }}</span>
                </div>
                <div>
                  <img src="../../assets/pages/autor.png" alt />
                  <span>{{ item.nick }}</span>
                </div>
                <div>
                  <img src="../../assets/pages/remarkObject.png" alt />
                  <span>{{ item.remarkObjectName }}</span>
                </div>
                <div>
                  <img src="../../assets/pages/category-icon.png" alt />
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
            <div class="content">
              <span>{{ item.content | contentFilter }}</span>
            </div>
          </div>
          <div class="pagination">
            <div class="block">
              <el-pagination
                background
                layout="prev, pager, next"
                :total="total"
                :current-page="pageNum"
                :page-size="pageSize"
                @current-change="handleCurrentChange"
              >
              </el-pagination>
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
      allArticles: [],
      pageCount: 0,
      total: 0,
      pageSize: 5,
      pageNum: 1,
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
      this.axios
        .get(`/user/${val.aid}/like`)
        .then((res) => {
          this.getAllArticles();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    goDetail(val) {
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
      // console.log(val);
      this.$store.commit("setAid", val);
      this.$store.commit("setPageNum", 4);
    },
    handleCurrentChange(val) {
      // console.log(val);
      this.getAllArticles(val);
    },
    async getAllArticles(pageCurrent = 1) {
      let { data: res } = await this.axios.get(`/article/${pageCurrent}/all
`);
      this.allArticles = res.data.pageRecord;
      this.pageCount = res.data.pageCount;
      this.pageSize = res.data.pageSize;
      this.total = res.data.rowCount;
    },
  },
  created() {
    this.getAllArticles();
  },
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}
.container {
  /* height: 600px; */
  width: 100%;
  min-height: 600px;
  /* background: tomato; */
  min-width: 1300px;
}

.page1300 {
  width: 1300px;
  /* height: 600px; */
  /* border: 1px red solid; */
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  text-align: center;
}

.page1300 > div:first-child > div {
  width: 1300px;
  /* border: 1px red solid; */
  padding-bottom: 30px;
}

.page1300 > div > div {
  padding: 20px;
}
.title {
  width: 100%;
  height: 40px;
  position: relative;
  margin-bottom: 10px;
}
.title > img {
  position: absolute;
  left: 0;
  top: 13px;
  margin-right: 10px;
}
.title > h2 {
  position: absolute;
  left: 40px;
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
  border-top: 1px solid #f2f2f2;
  border-bottom: 1px solid #f2f2f2;
  position: relative;
  display: flex;
  justify-content: space-between;
  /* border: 1px solid #f00; */
  padding-left: 30px;
}
.date > div:first-child {
  width: 800px;
  height: 30px;
  display: flex;
  justify-content: space-between;
  /* border: 1px solid #f0f; */
}

.date > div:first-child > div {
  width: 200px;
  height: 30px;
  position: relative;
  text-align: left;
}

.date > div:first-child > div > span {
  font-size: 12px;
  line-height: 30px;
  color: gray;
  cursor: pointer;
  transition: all 0.1s linear;
  position: absolute;
  left: 30px;
}

.date > div:first-child > div > span:hover {
  color: lightsalmon;
}
.date > div:first-child > div > img {
  /* background: fuchsia; */
  width: 20px;
  height: 20px;
  position: absolute;
  left: 0;
  top: 4px;
}

.date > div:last-child {
  width: 60px;
  height: 30px;
  /* border: 1px red solid; */
  position: relative;
  cursor: pointer;
}

.date > div:last-child > img {
  position: absolute;
  left: 0;
  top: 4px;
}

.date > div:last-child > span {
  font-size: 12px;
  line-height: 30px;
}

.content {
  width: 100%;
  padding-left: 10px;
}
.content > span {
  text-align: left;
  line-height: 31px;
  display: block;
  color: gray;
}
.pagination {
  width: 1300px !important;
  height: 40px !important;
  padding: 0 !important;
  margin: 15px 0;
  text-align: center;
}
</style>
