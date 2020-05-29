<template>
  <div class="container">
    <!-- 头部 -->
    <div class="header">
      <div class="header1300">
        <img
          class="img"
          src="../assets/header/123.png"
          alt="首页"
          title="首页"
          @click="$store.commit('setPageNum', 0)"
        />
        <div class="spans">
          <span
            @click="$store.commit('setPageNum', 0)"
            :class="$store.getters.getPageNum == 0 ? spanClass : null"
            >首页</span
          >
          <span
            @click="$store.commit('setPageNum', 1)"
            :class="$store.getters.getPageNum == 1 ? spanClass : null"
            >所有文章</span
          >
          <span
            @click="$store.commit('setPageNum', 2)"
            :class="$store.getters.getPageNum == 2 ? spanClass : null"
            >点评榜</span
          >
          <span
            @click="$store.commit('setPageNum', 3)"
            :class="$store.getters.getPageNum == 3 ? spanClass : null"
            >发布文章</span
          >
          <span v-if="!user" @click="goReg">登录/注册</span>
          <span v-else-if="user" class="avatar-span">
            <img class="avatar" :src="avatar" alt="" />
            <el-menu>
              <el-menu-item
                index="1"
                @click="
                  UserInfoDialog = true;
                  getUserInfo();
                "
                >个人资料</el-menu-item
              >
              <el-menu-item index="2" @click="AccountSafety = true"
                >账号安全</el-menu-item
              >
              <el-menu-item index="3" @click="logout">退出登录</el-menu-item>
            </el-menu>
          </span>
          <div class="one-nav"></div>
        </div>
      </div>
    </div>

    <el-dialog
      class="dialog"
      :visible.sync="UserInfoDialog"
      width="500px"
      center
      title="基本信息"
      @close="CloseUserInfoDialog"
    >
      <div class="dialog-body">
        <el-form :model="userInfo" label-width="50px">
          <el-form-item label="昵称">
            <el-input v-model="userInfo.nick" style="width:200px;"></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-radio v-model="userInfo.gender" :label="1">男</el-radio>
            <div class="sex-box"></div>
            <el-radio v-model="userInfo.gender" :label="0">女 </el-radio>
          </el-form-item>
          <el-form-item>
            <button class="self-button" @click="doChangeUserInfo()">
              确认修改
            </button>
          </el-form-item>
        </el-form>
        <div>
          <el-upload
            action="/"
            :before-upload="beforeAvatarUpload"
            :show-file-list="false"
          >
            <img v-if="userInfo" :src="userInfo.photo" class="avatar2" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <el-link type="primary" class="xgtx">修改头像</el-link>
          </el-upload>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      class="dialog"
      :visible.sync="AccountSafety"
      width="400px"
      center
      title="账号安全"
    >
      <el-card>
        <div class="info">
          <div>
            <el-input
              v-model="updateEmail.email"
              prefix-icon="el-icon-message"
              placeholder="请输入新邮箱"
              style="width:300px;"
            ></el-input>
          </div>
          <div class="email-info-body">
            <el-input
              v-model="updateEmail.checkCode"
              prefix-icon="el-icon-message"
              placeholder="请输入验证码"
              style="width:190px;"
            >
            </el-input>
            <button
              class="self-button self-button-info"
              plain
              @click="getCheckCode"
            >
              获取验证码
            </button>
          </div>
          <button class="self-button" @click="ChangeEmail()">确认修改</button>
        </div>
      </el-card>
      <el-card>
        <div class="info">
          <div>
            <el-input
              v-model="updatePassWord.oldPassword"
              prefix-icon="el-icon-lock"
              placeholder="请输入原密码"
              show-password
              style="width:300px;"
            ></el-input>
          </div>
          <div>
            <el-input
              v-model="updatePassWord.newPassword"
              prefix-icon="el-icon-lock"
              placeholder="请输入新密码"
              show-password
              style="width:300px;"
            >
            </el-input>
          </div>
          <div>
            <el-input
              v-model="updatePassWord.newPasswordAgain"
              prefix-icon="el-icon-lock"
              placeholder="请确认新密码"
              show-password
              style="width:300px;"
            >
            </el-input>
          </div>
          <button class="self-button" @click="ChangePassWord()">
            确认修改
          </button>
        </div>
      </el-card>
    </el-dialog>
    <!-- 搜索部分组件 -->
    <app-search></app-search>

    <!-- 页面部分 -->
    <app-page0 v-if="$store.getters.getPageNum == 0"></app-page0>
    <app-page1 v-if="$store.getters.getPageNum == 1"></app-page1>
    <app-page2 v-if="$store.getters.getPageNum == 2"></app-page2>
    <app-page3 v-if="$store.getters.getPageNum == 3"></app-page3>

    <app-ArticleDetail
      v-if="$store.getters.getPageNum == 4"
    ></app-ArticleDetail>

    <!-- 登录组件 -->
    <app-login class="login" @childFn="getChildMsg" v-if="isReging"></app-login>

    <!-- 底部 -->
    <app-footer></app-footer>

    <!-- 遮罩层 -->
    <div class="modal" v-if="cover" @click="cancelReg"></div>
  </div>
</template>

<script>
export default {
  data() {
    let user = sessionStorage.getItem("user");
    user = JSON.parse(user);
    return {
      getCheckCodeB: false,
      updatePassWord: {
        oldPassword: "",
        newPassword: "",
        newPasswordAgain: "",
      },
      updateEmail: {
        email: "",
        checkCode: "",
      },
      AccountSafety: false,
      UserInfoDialog: false,
      page: 4,
      cover: 0,
      isReging: 0,
      spanClass: {
        "is-checked": true,
      },
      null: {},
      user: user,
      avatar: user && this.axios.defaults.baseURL + user.photo,
      userInfo: {
        nick: "",
        photo: "",
        gender: 0,
      },
    };
  },

  methods: {
    /**
     * 修改密码
     */
    ChangePassWord() {
      if (!this.updatePassWord.oldPassword.trim()) {
        this.$notify({
          title: "警告消息",
          message: "请输入合法旧密码",
          type: "warning",
          duration: 2000,
        });
        return;
      }
      if (!this.updatePassWord.newPassword.trim()) {
        this.$notify({
          title: "警告消息",
          message: "请输入合法新密码",
          type: "warning",
          duration: 2000,
        });
        return;
      }
      if (
        this.updatePassWord.newPassword.trim() !==
        this.updatePassWord.newPasswordAgain
      ) {
        this.$notify({
          title: "警告消息",
          message: "两次输入的新密码不一致",
          type: "warning",
          duration: 2000,
        });
        return;
      }
      let ruleData = {
        oldPassword: this.updatePassWord.oldPassword,
        newPassword: this.updatePassWord.newPassword,
      };
      this.axios({
        url: "/user/password/change",
        method: "post",
        data: this.qs.stringify(ruleData),
      })
        .then((res) => {
          // console.log(res);
          if (res.data.state !== 2000) {
            this.$notify({
              title: "错误信息",
              message: res.data.message,
              type: "error",
              duration: "1500",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    /**
     *修改邮箱
     */
    ChangeEmail() {
      if (this.getCheckCode === false) {
        this.$notify({
          title: "警告消息",
          message: "请先获取验证码",
          type: "warning",
          duration: 2000,
        });
        return;
      }
      if (!this.updateEmail.email.trim()) {
        this.$notify({
          title: "错误信息",
          message: "请输入合法的邮箱",
          type: "error",
          duration: "2000",
        });
        return;
      }
      if (!this.updateEmail.checkCode.trim()) {
        this.$notify({
          title: "错误信息",
          message: "请输入合法的验证码",
          type: "error",
          duration: "2000",
        });
        return;
      }
      let ruleData = {
        email: this.updateEmail.email,
        checkCode: this.updateEmail.checkCode,
      };
      this.axios({
        url: "/user/email/change",
        method: "post",
        data: this.qs.stringify(ruleData),
      })
        .then((res) => {
          console.log(res);
          if (res.data.state !== 2000) {
            this.$notify({
              title: "错误信息",
              message: res.data.message,
              type: "error",
              duration: "1500",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    /**
     * 获取邮箱验证码
     */
    getCheckCode() {
      if (!this.updateEmail.email.trim()) {
        this.$notify({
          title: "错误信息",
          message: "请先输入新邮箱",
          type: "error",
          duration: "2000",
        });
        return;
      }
      let ruleData = {
        email: this.updateEmail.email,
        operation: "修改邮箱",
      };
      this.axios({
        url: "/user/email/check",
        method: "post",
        data: this.qs.stringify(ruleData),
      })
        .then((res) => {
          console.log(res);

          if (res.data.state === 2000) {
            this.getCheckCodeB = true;
          } else {
            this.$notify({
              title: "错误信息",
              message: res.data.message,
              type: "error",
              duration: "1500",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    CloseUserInfoDialog() {
      this.getUserInfo();
      this.$router.go(0);
    },
    /**
     * 修改个人信息
     */
    doChangeUserInfo() {
      if (!this.userInfo.nick.trim()) {
        this.$notify({
          title: "错误信息",
          message: "请输入合法昵称",
          duration: "2000",
          type: "error",
        });
        return;
      }
      let ruleData = {
        nick: this.userInfo.nick,
        gender: this.userInfo.gender,
      };
      this.axios({
        url: "/user/info/change",
        method: "post",
        data: this.qs.stringify(ruleData),
      })
        .then((res) => {
          // console.log(res);
          if (res.data.state === 2000) {
            this.$notify({
              title: "成功",
              message: "操作成功",
              duration: "1000",
              type: "success",
            });
          } else {
            this.$notify({
              title: "错误信息",
              message: "修改失败",
              duration: "2000",
              type: "error",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    /**
     * 上传头像
     */
    beforeAvatarUpload(file) {
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/gif";
      const isLt2M = file.size / 1024 / 1024 < 1;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG、PNG、GIF 格式!");
        return;
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 1MB!");
        return;
      }
      //校验成功上传文件
      if (isJPG && isLt2M == true) {
        //将文件转化为formdata数据上传
        let fd = new FormData();
        fd.append("file", file);
        // console.log(fd);
        this.axios
          .post("/user/avatar/change", fd, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            console.log(res);
            if (res.data.state === 2000) {
              this.getUserInfo();
            } else {
              this.$notify({
                title: "错误提示",
                message: res.data.message,
                duration: "3000",
                type: "error",
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },

    /**
     * 退出登录
     */
    async logout() {
      let { data: res } = await this.axios.get("/user/exit");
      this.$router.go(0);
      sessionStorage.clear();
    },

    /**
     * 获取用户信息
     */

    async getUserInfo() {
      let { data: res } = await this.axios.get("/user/info/get");

      if (res.state === 2000) {
        this.userInfo.photo = this.axios.defaults.baseURL + res.data.photo;
        this.userInfo.nick = res.data.nick;
        this.userInfo.gender = res.data.gender;
        sessionStorage.setItem("user", JSON.stringify(res.data));
      }
    },

    //   弹出登录页面
    goReg() {
      this.cover = true;
      this.isReging = true;
    },

    // 取消登录
    cancelReg() {
      this.cover = false;
      this.isReging = false;
    },

    // 得到子组件的数据
    getChildMsg(msg) {
      //   this.childMsg = msg;
      // console.log(msg);
      if (msg == true) {
        this.cancelReg();
      }
    },
  },
};
</script>

<style scoped>
.dialog {
  text-align: left;
}
* {
  padding: 0;
  margin: 0;
}
.container {
  position: relative;
  width: 100%;
  height: 100%;
  min-width: 1300px;
}
.header {
  width: 100%;
  height: 60px;
  background-color: #14181a;
  opacity: 0.8;
}
.header1300 {
  position: relative;
  margin: 0 auto;
  width: 1300px;
  /* border:  1px red solid; */
  height: 60px;
}
.img {
  height: 41px;
  position: absolute;
  left: 0;
  top: 9px;
  cursor: pointer;
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  position: absolute;
  top: 9px;
  right: 50px;
  /* border: 1px solid #f0f; */
  z-index: 30;
}
.avatar-span {
  height: 60px;
  width: 60px;
  /* border: 1px solid yellow; */
  padding: 22px;
  /* margin: 0; */
  z-index: 20;
}
.avatar-span:hover .el-menu {
  /* border: 1px solid #f0f; */
  /* margin: 10px; */
  display: block;
}
.el-menu {
  display: none;
  width: 100px;
  border: 0;
  position: absolute;
  right: 19px;
  top: 60px;
}

p {
  color: #818a90;
  font-size: 12px;
  position: absolute;
  top: 23px;
  left: 200px;
}

.login {
  position: fixed;
  top: 50%;
  left: 50%;
  margin-left: -345px;
  margin-top: -300px;
  z-index: 9998;
}
.modal {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.5);
}
span {
  color: #aeb6b4;
  margin-left: 20px;
  height: 60px;
  line-height: 60px;
  cursor: pointer;
  transition: all 0.2s linear;
}

.is-checked {
  color: white;
}

span:hover {
  color: azure;
}
.spans {
  height: 60px;
  width: 450px;
  position: absolute;
  right: 0;
  /* background-color: #fff; */
}

.avatar2 {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: block;
}
.xgtx {
  margin-top: 10px;
}
.dialog-body {
  display: flex;
  flex-flow: row;
  justify-content: space-between;
}
.dialog-foot {
  text-align: left;
}

.info {
  text-align: center;
}
.info > div {
  margin-bottom: 10px;
}
.self-button {
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  border: 1px solid #dcdfe6;
  -webkit-appearance: none;
  text-align: center;
  box-sizing: border-box;
  outline: 0;
  margin: 0;
  transition: 0.1s;
  font-weight: 500;
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;
}
.self-button:hover {
  opacity: 0.9;
}
.self-button-info {
  color: #909399;
  background: #f4f4f5;
  border-color: #d3d4d6;
}
.sex-box {
  display: inline-block;
  width: 10px;
  height: 10px;
  /* border: 1px solid #f0f; */
}
</style>
