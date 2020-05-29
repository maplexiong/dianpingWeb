<template>
  <div>
    <div class="container">
      <div>
        <h1>Welcome !</h1>
        <p>
          随着网络的发展，APP、网站这些软件越来越多，属于同一类型的互相竞争，但又是很多以盈利为主，一些良心软件因为某些原因不能被大众所知，到最后可能被迫下架
        </p>
        <p>
          为此做一个点评这些APP、网站的论坛网站(BBS)，该网站由用户去分析、比较、推广一些好的软件，让它们能够有更多的曝光率
        </p>
      </div>
      <div v-if="!haveAcc">
        <h1>Create An Account</h1>
        <p>
          Vestibulum est nulla, fermentum eget euismod et, tincidunt at dui
          dolor sit.
        </p>
        <div>
          <el-input
            v-model="regObj.account"
            prefix-icon="el-icon-user"
            placeholder="请输入账号"
            style="width:300px;"
          ></el-input>
        </div>
        <div>
          <el-input
            v-model="regObj.email"
            prefix-icon="el-icon-message"
            placeholder="请输入邮箱"
            style="width:300px;"
          ></el-input>
        </div>
        <div>
          <el-input
            v-model="regObj.emailTest"
            prefix-icon="el-icon-message"
            placeholder="请输入验证码"
            style="width:300px;"
          ></el-input>
        </div>
        <div>
          <el-input
            v-model="regObj.pwd"
            prefix-icon="el-icon-lock"
            show-password
            placeholder="请输入密码"
            style="width:300px;"
          ></el-input>
        </div>
        <div>
          <el-input
            v-model="regObj.rePwd"
            prefix-icon="el-icon-lock"
            placeholder="请再次输入密码"
            show-password
            style="width:300px;"
          ></el-input>
        </div>
        <button class="button-big" @click="doRegister()">
          CREATE ACCOUNT
        </button>
        <img @click="close" src="../../assets/login/close.png" alt />
        <p
          class="eTest"
          @click="
            getTest();
            doEmailCheck();
          "
          v-if="!gotTest"
        >
          获取验证码
        </p>
        <p class="eTest" v-if="gotTest">{{ timeLeft }}秒后重新发送</p>
        <el-link type="primary" @click="haveAcc = true"
          >已有账号?去登陆</el-link
        >
      </div>
      <div v-if="haveAcc">
        <h1>Please login</h1>
        <p>
          Vestibulum est nulla, fermentum eget euismod et, tincidunt at dui
          dolor sit.
        </p>
        <div>
          <el-input
            v-model="account"
            prefix-icon="el-icon-user"
            placeholder="请输入您的账号"
            style="width:300px;"
          ></el-input>
        </div>
        <el-input
          v-model="password"
          prefix-icon="el-icon-lock"
          show-password
          placeholder="请输入您的密码"
          style="width:300px;"
        ></el-input>
        <img @click="close" src="../../assets/login/close.png" alt />
        <button @click="doLogin" class="login2 button-big">LOGIN</button>
        <el-link type="primary" @click="haveAcc = false"
          >没有账号?去注册一个吧</el-link
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      CheckReg: false,
      userPhoto: "",
      regObj: {
        account: "",
        email: "",
        pwd: "",
        rePwd: "",
        emailTest: "",
      },
      //   是否注册成功
      sucReg: false,
      //   是否拥有账号
      haveAcc: true,
      gotTest: false,
      timeLeft: 60,
      timer: 0,
      account: "",
      password: "",
    };
  },
  mounted() {
    this.init();
    if (this.timer) {
      clearInterval(this.timer);
    } else {
      this.timer = setInterval(() => {
        // 调用相应的接口，渲染数据
        this.timeLeft--;
        if (this.timeLeft == 0) {
          this.gotTest = false;
        }
      }, 1000);
    }
  },

  destroyed() {
    clearInterval(this.timer);
  },
  methods: {
    doLogin() {
      if (!this.account.trim()) {
        this.$notify({
          title: "错误信息",
          message: "请输入合法账号",
          type: "error",
          duration: "2000",
        });
        return;
      }
      if (!this.password.trim()) {
        this.$notify({
          title: "错误信息",
          message: "请输入合法密码",
          type: "error",
          duration: "3000",
        });
        return;
      }
      let ruleData = {
        account: this.account,
        password: this.password,
      };
      this.axios({
        url: "/user/login",
        method: "post",
        data: this.qs.stringify(ruleData),
      })
        .then((res) => {
          // console.log(res);
          if (res.data.state === 2000) {
            sessionStorage.setItem("user", JSON.stringify(res.data.data));
            this.userPhoto = this.axios.defaults.baseURL + res.data.data.photo;
            this.$router.go(0);
          } else {
            this.$notify({
              title: "错误信息",
              message: res.data.message,
              type: "error",
              duration: "3000",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    doEmailCheck() {
      if (!this.regObj.email.trim()) {
        this.gotTest = false;
      }
      let ruleData = {
        email: this.regObj.email,
        operation: "注册",
      };
      this.axios({
        url: "/user/email/check",
        method: "post",
        data: this.qs.stringify(ruleData),
      })
        .then((res) => {
          if (res.data.state === 2000) {
            this.CheckReg = true;
          } else {
            this.$notify({
              title: "错误信息",
              message: res.data.message,
              type: "error",
              duration: "3000",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    doRegister() {
      if (this.CheckReg === false) {
        this.$notify({
          title: "警告消息",
          message: "请先获取验证码",
          type: "warning",
          duration: 2000,
        });
        return;
      }
      let ruleData = {
        account: this.regObj.account,
        email: this.regObj.email,
        checkCode: this.regObj.emailTest,
        password: this.regObj.pwd,
      };
      if (!this.regObj.account.trim()) {
        this.$notify({
          title: "警告消息",
          message: "请输入合法的账号",
          type: "warning",
          duration: 2000,
        });
        return;
      }
      if (!this.regObj.email.trim()) {
        this.$notify({
          title: "警告消息",
          message: "请输入合法的邮箱",
          type: "warning",
          duration: 2000,
        });
        return;
      }
      if (!this.regObj.emailTest.trim()) {
        this.$notify({
          title: "警告消息",
          message: "请输入合法的验证码",
          type: "warning",
          duration: 2000,
        });
        return;
      }
      if (!this.regObj.pwd.trim()) {
        this.$notify({
          title: "警告消息",
          message: "请输入合法的密码",
          type: "warning",
          duration: 2000,
        });
        return;
      }
      if (this.regObj.pwd.trim() !== this.regObj.rePwd) {
        this.$notify({
          title: "警告消息",
          message: "两次输入的密码不一致",
          type: "warning",
          duration: 2000,
        });
        return;
      }
      this.axios({
        url: "/user/register",
        method: "post",
        data: this.qs.stringify(ruleData),
      })
        .then((res) => {
          console.log(res);
          if (res.data.state === 2000) {
            this.$notify({
              title: "成功信息",
              message: "操作成功",
              type: "success",
            });
            this.haveAcc = true;
          } else {
            this.$notify({
              title: "错误信息",
              message: res.data.message,
              type: "error",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    init() {
      this.sucReg = false;
    },
    getTest() {
      this.gotTest = true;
      this.timeLeft = 60;
    },
    close() {
      this.sucReg = true;
      this.$emit("childFn", this.sucReg);
    },
    send() {
      // console.log(this.regObj);
      this.changeCount();
      this.$emit("childFn", this.sucReg);
    },
    // 验证密码时失去焦点触发
    changeCount() {
      if (this.regObj.pwd != this.regObj.rePwd) {
        this.sucReg = false;
        this.$message({
          message: "您两次输入的密码不一致,请重新输入",
          type: "warning",
          duration: 1500,
        });
      } else if (
        this.regObj.pwd == this.regObj.rePwd &&
        this.regObj.pwd != "" &&
        this.regObj.rePwd != "" &&
        this.regObj.account != "" &&
        this.regObj.email != "" &&
        this.regObj.emailTest != ""
      ) {
        this.sucReg = true;
      } else if (this.regObj.account == "") {
        this.$notify({
          title: "消息",
          message: "请输入您的姓名",
          type: "warning",
          duration: 1500,
        });
      } else if (this.regObj.email == "") {
        this.$notify({
          title: "消息",
          message: "请输入您的邮箱",
          type: "warning",
          duration: 1500,
        });
      } else if (this.regObj.pwd == "") {
        this.$notify({
          title: "消息",
          message: "请输入您的密码",
          type: "warning",
          duration: 1500,
        });
      } else if (this.regObj.email == "") {
        this.$notify({
          title: "消息",
          message: "请再次输入您的密码",
          type: "warning",
          duration: 1500,
        });
      } else if (this.regObj.emailTest == "") {
        this.$notify({
          title: "消息",
          message: "请输入您的验证码",
          type: "warning",
          duration: 1500,
        });
      }
    },
  },
};
// console.log(this.data);
</script>

<style scoped>
.testImage {
  width: 150px;
  height: 150px;
  border: 1px solid #0f0;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.container {
  width: 690px;
  height: 600px;
  background-color: #333333;
  /* margin: 0 auto; */
  position: relative;
}

.container > div:first-child {
  width: 280px;
  height: 600px;
  position: absolute;
  left: 0;
  padding: 0 20px;
}
.container > div > h1 {
  display: inline-block;
  text-align: center;
}
.container > div:first-child > p {
  text-indent: 15px;
}

.container > div:last-child {
  width: 400px;
  height: 600px;
  position: absolute;
  right: 0;
  background-color: white;
  /* border: 1px gray solid; */
  padding-left: 20px;
  padding-right: 20px;
  /* border: 1px solid #f0f; */
}

.container > div:last-child > div {
  margin-top: 25px !important;
}

.container > div:last-child > p {
  text-align: left;
  line-height: 30px;
  margin-top: 10px;
  color: gray;
}
.container > div:last-child > h1 {
  text-align: left;
  margin-top: 40px;
  color: #01cd74;
}
.button-big {
  width: 300px;
  height: 50px;
  margin-top: 30px;
  margin-bottom: 10px;
  border-radius: 8px;
  border: 0;
  background-color: #01cd74;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s linear;
}
.button-big:hover {
  background-color: #333333;
}
.button-big:focus {
  outline: none;
}
.container > div:first-child > h1 {
  color: white;
  left: 0;
  top: 0;
  text-align: left;
  margin-top: 50px;
}
.container > div:first-child > p {
  width: 100%;
  color: white;
  text-align: left;
  line-height: 40px;
  margin-top: 10px;
}

img {
  width: 20px;
  height: 20px;
  position: absolute;
  right: 10px;
  top: 10px;
  cursor: pointer;
}
.login2 {
  margin-top: 100px;
  margin-bottom: 90px;
}

.eTest {
  position: absolute;
  display: block;
  z-index: 33;
  right: 80px;
  top: 297px;
  cursor: pointer;
  transition: all 0.1s linear;
  font-size: 12px;
  border-left: 1px rgb(196, 196, 196) solid;
  padding-left: 20px;
  height: 30px;
  width: 120px;
}
.eTest:hover {
  color: chocolate;
}
</style>
