<template>
  <div>
    <el-alert :closable="false" title="服务器操作">
      <div>
        <!-- <el-form ref="form" :model="form" label-width="120px">
            <el-form-item label="服务器IP">
              <el-input v-model="form.ip" placeholder="点击下表选择服务器"></el-input>
            </el-form-item>
            <el-form-item label="操作系统">
              <el-select v-model="form.system" placeholder="请选择操作系统">
                <el-option v-for="(option, index) in options" :key="index" :label="option.label"
                  :value="option.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('form')">提交</el-button>
            </el-form-item>
          </el-form> -->
        <h2>可重装机器</h2>
        <!-- <el-table :data="serverList" @row-click="handleRowClick" style="margin-top: 20px;">
      <el-table-column property="ip_managemant" label="IP"></el-table-column>
      <el-table-column property="asset.status" label="状态"></el-table-column>
      <el-table-column property="asset.business_unit" label="业务单元"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="onSubmit(scope.row)" v-if="scope.row.status === '在线' && scope.row.business_unit !== '非资源池'">
            重装
          </el-button>
        </template>
      </el-table-column>
    </el-table> -->

        <el-table :data="availableServers" @row-click="selectServer">
          <el-table-column prop="ip_managemant" label="IP地址"></el-table-column>
          <el-table-column prop="asset.status" label="状态"></el-table-column>
          <el-table-column prop="asset.business_unit" label="业务单元"></el-table-column>
          <!-- ... 其他列 ... -->
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="primary" @click.stop="selectServer(scope.row)">选中</el-button>
            </template>
          </el-table-column>
        </el-table>
        <h2>重装机器</h2>
        <el-form :model="form" ref="form" label-width="120px">
          <el-form-item label="服务器IP" prop="ip">
            <el-input v-model="form.ip" disabled></el-input>
          </el-form-item>
          <el-form-item label="操作系统">
            <el-select v-model="form.system" placeholder="请选择操作系统">
              <el-option label="CentOS 7.2" :value="0"></el-option>
              <el-option label="CentOS 7.8" :value="1"></el-option>
              <el-option label="Ubuntu 22.04" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSubmit">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-alert>
  </div>
</template>

<script>
import { postInstall } from '@/api/server' // 请将这里替换为你的实际api接口
import { getProgress } from '@/api/server' // 假设这是获取安装进度的API，你需要替换为实际的API
import { getServerList } from '@/api/server'

export default {
  data() {
    return {
      form: {
        ip: '',
        system: ''
      },
      options: [
        { label: 'CentOS 7.2', value: 0 },
        { label: 'CentOS 7.8', value: 1 },
        { label: 'Ubuntu 22.04', value: 2 }
      ],
      serverList: []  // This should be fetched from API
    }
  },
  computed: {
    availableServers() {
      // 只显示状态为在线的服务器
      return this.serverList.filter(server => server.asset.status === '在线');
    }
  },
  created() {
    // 获取服务器列表
    getServerList().then(res => {
      this.serverList = res.data.results;
    }).catch(err => {
      console.log(err);
      this.$message.error('获取服务器列表失败！');
    });

  },
  methods: {
    selectServer(row) {   
      let confirmText = '确定要选中此服务器吗?';

      if (row.asset.business_unit !== '资源池') {
        confirmText = '您正在选中一个非资源池的服务器，这可能会影响到正常运行的服务，您确定要继续吗？';
      }

      this.$confirm(confirmText, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.form.ip = row.ip_managemant;

        // this.autoInstall(row.ip_managemant, this.form.system);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消选中'
        });
      });
    },
    handleSubmit() {
      // 在提交前进行确认
      this.$confirm('确定要重装此服务器吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        autoInstall(this.form).then(res => {
          if (res.data.code === 200) {
            this.$message.success(res.data.message);
            // TODO: 更新服务器列表，显示安装进度
          } else {
            this.$message.error(res.data.message);
          }
        });
      });
    },
    // onSubmit() {
    //   this.$confirm('确认要重装这台服务器吗?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     this.$message({
    //       type: 'success',
    //       message: '提交成功!'
    //     });
    //     // 在这里调用您的API进行实际的服务器重装操作
    //   }).catch(() => {
    //     this.$message({
    //       type: 'info',
    //       message: '已取消重装'
    //     });
    //   });
    // },
    openConfirmDialog(row) {
      let confirmText = '确定要重装服务器吗?';

      if (row.asset.business_unit !== '资源池') {
        confirmText = '您正在重装一个非资源池的服务器，这可能会影响到正常运行的服务，您确定要继续吗？';
      }

      this.$confirm(confirmText, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 在这里调用API进行实际的服务器重装操作
        this.autoInstall(row.ip_managemant, this.form.system);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消重装'
        });
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const { ip, system } = this.form;
          // Use your api function here
          serverAutoInstall({ ip, system }).then(res => {
            if (res.code === 200) {
              this.$message.success('安装成功！');
            } else {
              this.$message.error('安装失败！');
            }
          }).catch(err => {
            console.log(err);
            this.$message.error('请求发送失败！');
          });
        } else {
          this.$message.error('请完善表单！');
        }
      });
    },
    fetchServerList() {
      // Use your api function to get server list here and assign it to serverList
      getServerList().then(res => {
        this.serverList = res.data.results;
      }).catch(err => {
        console.log(err);
        this.$message.error('获取服务器列表失败！');
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.install {
  padding: 10px;
}

.el-form {
  width: 400px;
  margin: 0 auto;
}
</style>
