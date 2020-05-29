<template>
  <div>
    <div class="container">
      <el-card shadow="always" class="page1300">
        <el-form
          ref="publishForm"
          :model="publishForm"
          label-width="80px"
          hide-required-asterisk
        >
          <el-form-item label="文章标题" prop="title">
            <el-input
              v-model="publishForm.title"
              style="width: 50%;"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="点评对象"
            :hide-required-asterisk="true"
            prop="name"
          >
            <el-input
              v-model="publishForm.name"
              style="width: 25%;"
              placeholder="搜索一下你想要点评对象"
              :disabled="isDoSuccess"
            ></el-input>
            <el-button type="primary" plain @click="checkRemarkObject"
              >验证一下</el-button
            >
          </el-form-item>
          <el-form-item label="点评截图">
            <el-upload
              ref="upload"
              action="/"
              multiple
              :http-request="handleUpload"
              :auto-upload="false"
              :limit="20"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              name
            >
              <i class="el-icon-plus"></i>
            </el-upload>

            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="" />
            </el-dialog>
          </el-form-item>
          <el-form-item label="点评内容" prop="content">
            <el-input
              type="textarea"
              :show-word-limit="wordNum"
              rows="7"
              v-model="publishForm.content"
              style="width:70%;"
              placeholder="至少输入20字"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handlePush()">发表文章</el-button>
            <el-button @click="resetForm('publishForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <el-dialog
      class="dialog"
      title="选择或创建点评对象"
      :visible.sync="dialogVisible2"
      width="60%"
      center
    >
      <el-table
        height="350"
        :data="checkRemarkObjectResult"
        highlight-current-row
        @current-change="checkedRemarkObject"
        style="width: 900"
      >
        <el-table-column type="index" width="50" label="#"> </el-table-column>
        <el-table-column prop="name" label="点评对象"> </el-table-column>
        <el-table-column prop="typeName" label="所属类别"> </el-table-column>
        <el-table-column prop="company" label="开发公司"> </el-table-column>
        <el-table-column prop="onlineTime" label="上线时间"> </el-table-column>
      </el-table>

      <span slot="footer">
        <el-button
          @click="
            getTypeAll();
            dialogVisible2 = false;
            dialogVisible3 = true;
          "
        >
          创建
        </el-button>
        <el-button
          type="primary"
          @click="
            dialogVisible2 = false;
            doOk();
          "
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      class="dialog"
      title="添加点评对象"
      :visible.sync="dialogVisible3"
      width="500px"
      center
    >
      <el-form
        :model="createRemarkObject"
        label-width="80px"
        ref="createRemarkObject"
      >
        <el-form-item label="点评对象" prop="name">
          <el-input
            v-model="createRemarkObject.name"
            style="width:70%;"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属类别" prop="tid">
          <span class="type-all" v-for="(item, i) in typeList" :key="i">
            <el-radio v-model="createRemarkObject.tid" :label="item.tid">{{
              item.name
            }}</el-radio>
          </span>
        </el-form-item>
        <el-form-item label="开发公司" prop="company">
          <el-input
            v-model="createRemarkObject.company"
            :data-rid="0"
            style="width:70%;"
          ></el-input>
        </el-form-item>
        <el-form-item label="上线时间" prop="onlineTime">
          <el-date-picker
            v-model="createRemarkObject.onlineTime"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          >
            >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="resetForm('createRemarkObject')">
          重置
        </el-button>
        <el-button type="primary" @click="doCreateRemarkObject()"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      wordNum: true,
      isDoSuccess: false,
      avatarFile: null,
      typeList: [],
      createRemarkObject: {
        tid: undefined,
        name: "",
        company: "",
        onlineTime: "",
      },
      dialogVisible3: false,
      dialogVisible2: false,
      dialogImageUrl: "",
      dialogVisible: false,
      checkRemarkObjectResult: [],
      publishForm: {
        title: "",
        name: "",
        rid: "",
        images: [],
        files: [],
        content: "",
      },
      preContent: "",
    };
  },
  methods: {
    preText(pretext) {
      return pretext
        .replace(/\r\n/g, "<br/>")
        .replace(/\n/g, "<br/>")
        .replace(/\s/g, "&nbsp;");
    },
    /**
     * 是否登录
     */
    isLogin() {
      let userInfo = sessionStorage.getItem("user");
      if (!userInfo) {
        this.$notify({
          title: "警告消息",
          message: "当前操作需要您是登陆状态,请登陆!",
          type: "warning",
          duration: 2000,
        });
        return false;
      } else {
        return true;
      }
    },

    /**
     * 是否验证点评对象
     */
    doOk() {
      if (this.publishForm.rid) {
        this.isDoSuccess = true;
      }
    },
    handleUpload(raw) {
      // console.log(raw);
      this.publishForm.files.push(raw.file);
    },

    /**
     * 发布文章
     */
    async handlePush() {
      let ok = this.isLogin();
      if (!ok) {
        return;
      }
      if (!this.publishForm.title.trim()) {
        this.$notify({
          title: "警告消息",
          message: "请输入合法的文章标题",
          type: "warning",
          duration: 2000,
        });
        return;
      }
      if (!this.publishForm.rid) {
        this.$notify({
          title: "警告消息",
          message: "请验证并选择点评对象",
          type: "warning",
          duration: 2000,
        });
        return;
      }

      if (this.publishForm.content.trim().length < 20) {
        this.$notify({
          title: "警告消息",
          message: "字数不足",
          type: "warning",
          duration: 1500,
        });
        return;
      } else {
        this.preContent = this.preText(this.publishForm.content);
      }

      this.$refs.upload.submit(); // 这里是执行文件上传的函数，其实也就是获取我们要上传的文件
      let fd = new FormData();
      fd.append("rid", this.publishForm.rid);
      fd.append("title", this.publishForm.title);
      fd.append("content", this.preContent);
      this.publishForm.files.forEach(function(file) {
        fd.append("images", file, file.name); // 因为要上传多个文件，所以需要遍历一下才行
        //不要直接使用我们的文件数组进行上传，你会发现传给后台的是两个Object
      });
      this.axios.post("/article/create", fd).then((res) => {
        // console.log(res);
        if (res.data.state === 2000) {
          this.resetForm("publishForm");
          this.$notify({
            title: "成功消息",
            message: "发布成功",
            type: "success",
            duration: 1500,
          });
        } else {
          this.$notify({
            title: "错误信息",
            message: res.data.message,
            type: "error",
            duration: 2000,
          });
        }
      });
    },
    /**
     * 创建点评对象
     */
    doCreateRemarkObject() {
      this.dialogVisible2 = false;
      if (!this.createRemarkObject.name.trim()) {
        this.$notify({
          title: "警告消息",
          message: "请输入合法的点评对象名称",
          type: "warning",
          duration: 2000,
        });
        return;
      }
      if (!this.createRemarkObject.tid) {
        this.$notify({
          title: "警告消息",
          message: "请选择所属类别",
          type: "warning",
          duration: 2000,
        });
        return;
      }
      if (!this.createRemarkObject.onlineTime) {
        this.$notify({
          title: "警告消息",
          message: "请选择上线时间",
          type: "warning",
          duration: 2000,
        });
        return;
      }
      let ruleData = {
        tid: this.createRemarkObject.tid,
        name: this.createRemarkObject.name,
        company: this.createRemarkObject.company,
        onlineTime: this.createRemarkObject.onlineTime,
      };
      this.axios({
        url: "/remarkobject/create",
        method: "post",
        data: this.qs.stringify(ruleData),
      })
        .then((res) => {
          // console.log(res);
          if (res.data.state === 2000) {
            this.resetForm("createRemarkObject");
            this.$notify({
              title: "成功信息",
              message: "创建成功",
              type: "success",
              duration: 1500,
            });
            this.dialogVisible3 = false;
          } else {
            this.$notify({
              title: "错误信息",
              message: res.data.message,
              type: "error",
              duration: 2000,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    checkedRemarkObject(val) {
      // console.log(val);
      if (val) {
        this.publishForm.name = val.name;
        this.publishForm.rid = val.rid;
      }
    },

    async getTypeAll() {
      // this.dialogVisible2 = false;
      // this.dialogVisible3 = true;
      let { data: res } = await this.axios.get("/type/all");
      if (res.state === 2000) {
        this.typeList = res.data;
        // console.log(this.typeList);
      }
    },
    async checkRemarkObject() {
      let ok = this.isLogin();
      if (!ok) {
        return;
      }
      this.dialogVisible2 = true;
      let { data: res } = await this.axios.get(
        `/remarkobject/check?name=${this.publishForm.name}`
      );
      // console.log(res);
      if (res.state === 2000) {
        this.checkRemarkObjectResult = res.data;
      } else {
        this.$notify({
          title: "错误信息",
          message: res.data.message,
          type: "error",
          duration: 2000,
        });
      }
    },
    //重置
    resetForm(name) {
      this.$refs[name].resetFields();
      this.$refs.upload.clearFiles();
      this.isDoSuccess = false;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
  },
};
</script>

<style scoped>
.container {
  /* height: 600px; */
  width: 100%;
  margin: 30px 0;
  min-width: 1300px;
}
.page1300 {
  width: 1300px;
  /* height: 600px; */
  margin: 0 auto;
  /* border: 1px solid #f00; */
  /* background: #f1fbf0; */
  text-align: left;
}
.dialog {
  text-align: left;
}
.type-all {
  display: inline-block;
  margin: 0 10px;
}
</style>
