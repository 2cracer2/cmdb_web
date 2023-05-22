<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on"
      label-position="left">
      <div class="title-container">
        <h3 class="title">CMDB运维平台🤖</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input ref="username" v-model="loginForm.username" placeholder="Username" name="username" type="text"
          tabindex="1" auto-complete="on" />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input :key="passwordType" ref="password" v-model="loginForm.password" :type="passwordType"
          placeholder="Password" name="password" tabindex="2" auto-complete="on" @keyup.enter.native="handleLogin" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width: 100%; margin-bottom: 30px"
        @click.native.prevent="handleLogin">登陆</el-button>

      <!-- <div class="tips">
        <el-button type="text" @click="addNewUser">管理员添加用户</el-button>
      </div>

      <div class="tips">
        <el-button type="text" @click="dialogFormVisible = true">注册用户</el-button>
      </div> -->

      <div class="container">
        <div class="button-container">
          <div>
            <el-button class="left-button" type="text" @click="addNewUser">管理员添加新用户</el-button>
          </div>
          <div class="spacer"></div>
          <div>
            <el-button class="right-button" type="text" @click="dialogFormVisible = true">注册用户</el-button>
          </div>
        </div>
      </div>

    </el-form>
    <el-dialog title="用户注册" :visible.sync="dialogFormVisible">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input type="text" v-model="ruleForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input type="text" v-model="ruleForm.phone" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPassword">
          <el-input type="password" v-model="ruleForm.checkPassword" autocomplete="off"></el-input>
        </el-form-item>
        <!-- <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="
          dialogFormVisible = false;
        submitForm('ruleForm');
        ">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { validUsername } from "@/utils/validate";
import { createUser } from "@/api/user";
import { MessageBox } from 'element-ui';


export default {
  name: "Login",
  data() {
    var validateEmail = (rule, value, callback) => {
      let temp = /^[\w.\-]+@(?:[a-z0-9]+(?:-[a-z0-9]+)*\.)+[a-z]{2,3}$/;
      if (value && !temp.test(value)) {
        callback(new Error("请输入正确的邮箱"));
      } else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === "" || value.length < 7) {
        callback(new Error("请输入大于8位的密码"));
      } else {
        if (this.ruleForm.checkPassword !== "") {
          this.$refs.ruleForm.validateField("checkPassword");
        }
        callback();
      }
    };
    var validatePhone = (rule, value, callback) => {
      let temp = /^\d{10}$/;  // Adjust this regex to fit the phone number format you want
      if (!temp.test(value)) {
        callback(new Error("请输入正确的电话号码"));
      } else {
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };

    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error("请输入有效的用户名"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 7) {
        callback(new Error("请输入大于8位的密码"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "admin",
        password: "twgdhbtzhy",
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
      },
      loading: false,
      passwordType: "password",
      redirect: undefined,
      ruleForm: {
        username: "",
        email: "",
        password: "",
        checkPassword: "",
        phone: "",
      },
      rules: {
        username: [
          { required: true, trigger: "blur", message: "请输入用户名" },
        ],
        email: [{ required: true, validator: validateEmail, trigger: "blur" }],
        password: [
          { required: true, validator: validatePass, trigger: "blur" },
        ],
        checkPassword: [
          { required: true, validator: validatePass2, trigger: "blur" },
        ],
        phone: [
          { required: true, validator: validatePhone, trigger: "blur" },
        ],
      },
      formLabelWidth: "120px",
      dialogFormVisible: false,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  methods: {
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    addNewUser() {
      // 跳转到指定的URL
      window.location.href = "http://127.0.0.1:8000/admin/";
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("user/login", this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || "/" });
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          createUser(this.ruleForm).then((response) => {
            console.log(response);
            if (response.status == 201) {
              this.$message({
                message: "用户创建成功，请登录邮箱，激活用户。",
                type: "success",
              });
            } else {
              this.$message({
                message: "用户创建失败，请重试。",
                type: "error",
              });
            }
          });
        } else {
          console.log("error submit!!");
          MessageBox.alert('表单填写有误，请检查后再提交！', '警告', {
            confirmButtonText: '确定',
            type: 'warning'
          });
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .button-container {
    display: flex;
    width: 100%;
  }

  .container {
    display: flex;
    justify-content: space-between;
  }

  .left-button {
    margin-left: 10px;
  }

  .right-button {
    margin-right: 10px;
  }

  .spacer {
    flex-grow: 1;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>

