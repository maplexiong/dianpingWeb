<template>
  <div>
    <div class="container">
      <div class="page1300">
        <div>
          <div class="title">
            <h1>{{ ArticleDetail.title }}</h1>
          </div>
          <div class="body-box">
            <div>
              <el-card class="card-item" shadow="hover">
                <div class="avatarImg">
                  <el-image
                    class="avatarImg-item"
                    :src="UrlBase + ArticleDetail.photo"
                  ></el-image>
                </div>
                <div class="aboutInfo">
                  <div class="aboutInfo-left">
                    <div>
                      <img src="../../assets/pages/autor.png" alt />
                      <span>{{ ArticleDetail.nick }}</span>
                    </div>
                    <div>
                      <img src="../../assets/pages/createTime.png" alt />
                      <span>{{ ArticleDetail.createdTime | date }}</span>
                    </div>

                    <div>
                      <img src="../../assets/pages/remarkObject.png" alt />
                      <span>{{ ArticleDetail.remarkObjectName }}</span>
                    </div>
                    <div class="company-box">
                      <img src="../../assets/pages/company.png" alt />
                      <span class="company-item">{{
                        ArticleDetail.company
                      }}</span>
                    </div>
                  </div>
                  <div class="aboutInfo-right">
                    <div>
                      <img src="../../assets/pages/like.png" alt />
                      <span>{{ ArticleDetail.likeNumber }}</span>
                    </div>
                    <div>
                      <img src="../../assets/pages/category-icon.png" alt />
                      <span>{{ ArticleDetail.typeName }}</span>
                    </div>
                    <div>
                      <img src="../../assets/pages/onlineTime.png" alt />
                      <span>{{ ArticleDetail.onlineTime }}</span>
                    </div>
                  </div>
                </div>
              </el-card>
              <el-card class="card-item" shadow="hover">
                <div slot="header" class="card-header">
                  <span>应用截图</span>
                </div>
                <div class="img-box">
                  <span
                    class="img-span"
                    v-for="(item, index) in ArticleDetail.images"
                    :key="index"
                  >
                    <el-image
                      :src="UrlBase + item"
                      class="img-item"
                      :preview-src-list="srcList"
                    ></el-image>
                  </span>
                </div>
              </el-card>
            </div>
            <div>
              <el-card class="card-item text-detail" shadow="hover">
                <div slot="header" class="card-header">
                  <span>文章内容</span>
                </div>
                <div>
                  <pre class="pre">{{ ArticleDetail.content }}</pre>
                </div>
              </el-card>
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
      UrlBase: "",
      ArticleDetail: {},
      imageList: [],
      aid: 0,
      srcList: [],
    };
  },
  created() {
    this.doSetAid();
    this.getArticleDetail();
  },
  methods: {
    doSetAid() {
      this.aid = this.$store.getters.getAid;
    },
    getArticleDetail() {
      this.UrlBase = this.axios.defaults.baseURL;

      this.axios
        .get(`/article/${this.aid}/detail`)
        .then((res) => {
          // console.log(res.data);
          if (res.data.state === 2000) {
            this.ArticleDetail = res.data.data;
            this.srcList = res.data.data.images.map(
              (elem) => this.UrlBase + elem
            );
          } else {
            this.$notify({
              title: "警告信息",
              message: `${res.data.message},3秒钟将自动返回首页`,
              type: "warning",
              duration: 3000,
            });
            setTimeout(() => {
              this.$router.go(0);
            }, 3000);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style scoped>
.container {
  width: 100%;
  margin: 30px 0;
  min-width: 1300px;
}
.page1300 {
  box-sizing: border-box;
  width: 1300px;
  min-height: 600px;
  margin: 0 auto;
  text-align: left;
  padding: 0 20px;
  /* border: 1px solid black; */
}
.title {
  text-align: center;
  height: 50px;
  margin-bottom: 10px;
}
.title > h1 {
  display: inline-block;
}
.body-box {
  display: flex;
  justify-content: space-between;
  padding: 10px;
}
.card-item {
  width: 600px;
  margin: 10px 0;
}
.card-header {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
}
.avatarImg {
  /* border: 1px solid sienna; */
  text-align: center;
}
.avatarImg-item {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
.aboutInfo {
  height: 160px;
  position: relative;
  /* border: 1px solid yellowgreen; */
  margin-top: 10px;
}
.aboutInfo-left,
.aboutInfo-right {
  position: absolute;
  /* border: 1px solid red; */
  width: 250px;
  margin-left: 30px;
}
.aboutInfo-left {
  left: 0;
}
.aboutInfo-right {
  right: -50px;
}
.aboutInfo-left > div,
.aboutInfo-right > div {
  height: 30px;
  line-height: 30px;
  /* border: 1px solid red; */
  margin: 10px 0;
  position: relative;
}
.aboutInfo-left > div > img,
.aboutInfo-right > div > img {
  width: 20px;
  height: 20px;
  position: absolute;
  top: 5px;
}
.aboutInfo-left > div > span,
.aboutInfo-right > div > span {
  position: absolute;
  left: 30px;
}
.img-box {
  text-align: center;
}
.img-span {
  display: inline-block;
}
.img-item {
  width: 230px;
  height: 150px;
  padding: 10px;
}
.text-detail {
  min-height: 952px;
  /* overflow: scroll; */
}
.pre {
  font-size: 16px;
  overflow: auto;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  padding-bottom: 20px;
}
.company-box {
  /* border: 1px solid #0f0; */
  width: 500px !important;
}
.company-item {
  display: inline-block;
  width: 500px !important;
  /* border: 1px solid #00f; */
}
</style>
