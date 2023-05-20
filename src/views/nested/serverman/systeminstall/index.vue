<template>
  <div>
    <el-alert :closable="false" title="服务器操作" style="width: 100%">
    </el-alert>
    <el-row>
      <el-col :span="12" class="column">
        <h2>可重装机器</h2>

        <el-table :data="availableServers" :fit="false" size="mini">
          <el-table-column prop="ip_managemant" label="IP地址" min-width="auto"></el-table-column>
          <el-table-column prop="server_status" label="状态" min-width="auto"> <template slot-scope="scope">
              <div :class="{ 'installing': scope.row.server_status === 'installing' }">
                {{ scope.row.server_status }}
              </div>
            </template></el-table-column>
          <el-table-column prop="asset.business_unit" label="业务单元" min-width="auto"></el-table-column>
          <!-- ... 其他列 ... -->
          <el-table-column label="操作" min-width="200px">
            <template slot-scope="scope">
              <div class="action-buttons" style="display: flex; justify-content: space-between;">
                <el-button size="small" @click.stop="selectServer(scope.row)">选中</el-button>
                <el-button type="primary" @click="openRecordDrawer(scope.row)">显示重装进度</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="12" class="column">
        <h2>安装记录</h2>
        <el-table :data="installRecords" size="mini">
          <el-table-column prop="reinstall_ip" label="重装IP"></el-table-column>
          <el-table-column prop="uuid" label="UUID"></el-table-column>
          <el-table-column prop="system" label="操作系统" :formatter="row => systemMap[row.system]"></el-table-column>
          <el-table-column prop="installation_results" label="安装结果"
            :formatter="row => resultsMap[row.installation_results]"></el-table-column>
          <el-table-column prop="installation_txt" label="安装详情"></el-table-column>
          <el-table-column prop="create_date" label="创建时间"> <template slot-scope="scope">
              {{ formatDate(scope.row.create_date) }}
            </template></el-table-column>
        </el-table>
        <el-drawer title="重装进度" :visible.sync="recordDrawerVisible" size="50%" :before-close="handleClose">
          <el-table :data="installingRecord">
            <el-table-column prop="reinstall_ip" label="重装IP"></el-table-column>
            <el-table-column prop="install_progress" label="UUID"></el-table-column>
            <el-table-column prop="system" label="操作系统" :formatter="row => systemMap[row.system]"></el-table-column>
            <el-table-column prop="installation_results" label="安装结果"
              :formatter="row => resultsMap[row.installation_results]"></el-table-column>
            <el-table-column prop="installation_txt" label="安装详情"></el-table-column>
            <el-table-column prop="create_date" label="创建时间"> <template slot-scope="scope">
                {{ formatDate(scope.row.create_date) }}
              </template></el-table-column>
            <el-table-column prop="server" label="服务器"></el-table-column>
          </el-table>
          <div>
          </div>
          <div style="height: 400px;">
            <el-steps direction="vertical" :active="activeStepIndex">
              <el-step v-for="(step, index) in progressStatuses" :key="index" :title="step.description"
                :status="step.status"></el-step>
            </el-steps>
          </div>
        </el-drawer>
      </el-col>
    </el-row>
    <h2>重装机器</h2>
    <el-card class="box-card">
      <el-form :model="form" ref="form" label-width="120px">
        <el-form-item label="服务器IP" prop="ip">
          <el-input v-model="form.ip" disabled></el-input>
        </el-form-item>
        <el-form-item label="重装系统配置IP">
          <el-input v-model="form.reinstall_ip" placeholder="请输入重装系统配置的IP"></el-input>
        </el-form-item>
        <el-form-item label="重装系统主机" v-show="false">
          <el-input v-model="form.server" placeholder="重装系统的主机id"></el-input>
        </el-form-item>
        <el-form-item label="重装系统主机状态" v-show="false">
          <el-input v-model="form.status" placeholder="重装系统的主机id"></el-input>
        </el-form-item>
        <el-form-item label="操作系统">
          <el-select v-model="form.system" placeholder="请选择操作系统">
            <el-option label="CentOS 7.2" :value="0"></el-option>
            <el-option label="CentOS 7.8" :value="1"></el-option>
            <el-option label="Ubuntu 22.04" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="!isFormComplete " @click="handleSubmit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { postInstall } from '@/api/server' // 请将这里替换为你的实际api接口
import { serverAutoInstall } from '@/api/server'
import moment from 'moment'
import { getServerList } from '@/api/server'
import { getRecordsList } from '@/api/records'
import { getRecordInstalling } from '@/api/records'

export default {
  data() {
    return {
      form: {
        ip: '',
        system: '',
        reinstall_ip: '',
        server: '',
        status: ''
      },
      options: [
        { label: 'CentOS 7.2', value: 0 },
        { label: 'CentOS 7.8', value: 1 },
        { label: 'Ubuntu 22.04', value: 2 }
      ],
      activeStepIndex: 0,
      progressStatuses: [
        { description: '排序等待中' },
        { description: '[1/5]配置重装系统信息，以PXE重启进行安装' },
        { description: '[2/5]连接Cobblerg管理后台，获取DHCP分配地址' },
        { description: '[3/5]自动重装中，预计5分钟左右' },
        { description: '[4/5]配置业务口网络' },
        { description: '[5/5]配置强密码中' },
        { description: '流程结束' },
      ],
      systemMap: {
        0: 'CentOS 7.2',
        1: 'CentOS 7.8',
        2: 'Ubuntu 22.04',
      },
      resultsMap: {
        1: 'installing',
        2: 'successful',
        3: 'failed',
      },
      serverList: [],  // This should be fetched from API
      recordDrawerVisible: false,
      installRecords: [],
      installingRecord: [],
      timer: null,
      selectedServer: null
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  computed: {
    isFormComplete() {
      return this.form.ip && this.form.reinstall_ip && this.form.system != null;
    },
    isRunning() {
      return this.form.status !== 'running';
    },
    availableServers() {
      // 只显示状态为在线的服务器
      return this.serverList.filter(server => server.server_status === 'running' || server.server_status === 'installing');
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
    formatDate(value) {
      if (value) {
        return moment(String(value)).format('MM/DD/YYYY HH:mm');
      }
    },
    openRecordDrawer(row) {
      if (row.server_status !== 'installing') {
        this.$message({
          type: 'warning',
          message: '选中的机器没有正在重装'
        });
        return;
      }
      this.recordDrawerVisible = true;
      this.selectedServer = row;
      this.getRecordInstall();
      // if (row.status === 'installing') {
      this.timer = setInterval(() => {
        this.getRecordInstall();
      }, 2000);  // Update every 5 seconds

    },
    getRecordInstall() {
      getRecordInstalling({ server: this.selectedServer.id }).then(res => {
        // this.installingRecord = res.data.results;

        this.installingRecord = res.data.results;

        const progress = this.installingRecord[0].install_progress;
        const resultType = this.installingRecord[0].installation_results;
        const installationText = this.installingRecord[0].installation_txt;

        this.activeStepIndex = progress
        this.progressStatuses[progress].description = installationText

        if (resultType === 1) { // installing
          if (progress === 0) {
            this.progressStatuses[progress].status = 'wait'
          } else {
            this.progressStatuses[progress].status = 'process'
          }
        } else if (resultType === 2) { // successful
          this.progressStatuses[progress].status = 'success'
        } else if (resultType === 3) { // failed
          this.progressStatuses[progress].status = 'error'
        }

        if (resultType !== 1) {  // installation completed or failed
          this.closeDrawer();
        }

      }).catch(err => {
        console.log(err);
        this.$message.error('获取重装进度失败！');
      });
    },
    getRecords() {
      getRecordsList({ server: this.selectedServer.id }).then(res => {
        this.installRecords = res.data.results;
      }).catch(err => {
        console.log(err);
        this.$message.error('获取安装记录失败！');
      });
    },
    closeDrawer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    handleClose(done) {
      done();
      clearInterval(this.timer);
      this.timer = null;
      this.recordDrawerVisible = false;

    },
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
        this.form.reinstall_ip = row.ip_managemant;
        this.form.server = row.id
        this.form.status = row.server_status
        // this.autoInstall(row.ip_managemant, this.form.system);
        getRecordsList({ server: row.id }).then(res => {
          this.installRecords = res.data.results;
        }).catch(err => {
          console.log(err);
          this.$message.error('获取安装记录失败！');
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消选中'
        });
      });
    },
    handleSubmit() {
      if (!this.isFormComplete) {
        this.$message.error("请填写完整的表单");
        return;
      }

      if (this.isRunning) {
        this.$message.error("系统正在进行重装，请勿重复点击");
        return;
      }
      // 在提交前进行确认
      this.$confirm('确定要重装此服务器吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        serverAutoInstall(this.form).then(res => {
          if (res.data.code === 200) {
            this.$message.success(res.data.message);
            // TODO: 更新服务器列表，显示安装进度
          } else {
            this.$message.error(res.data.message);
          }
        });
      });
    },
    // openConfirmDialog(row) {
    //   let confirmText = '确定要重装服务器xxxxx吗?';

    //   if (row.asset.business_unit !== '资源池') {
    //     confirmText = '您正在重装一个非资源池的服务器，这可能会影响到正常运行的服务，您确定要继续吗？';
    //   }

    //   this.$confirm(confirmText, '警告', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     // 在这里调用API进行实际的服务器重装操作
    //     this.autoInstall(row.ip_managemant, this.form.system);
    //   }).catch(() => {
    //     this.$message({
    //       type: 'info',
    //       message: '已取消重装'
    //     });
    //   });
    // },
    // submitForm(formName) {
    //   this.$refs[formName].validate(valid => {
    //     if (valid) {
    //       const { ip, system } = this.form;
    //       // Use your api function here
    //       serverAutoInstall({ ip, system }).then(res => {
    //         if (res.code === 200) {
    //           this.$message.success('安装成功！');
    //         } else {
    //           this.$message.error('安装失败！');
    //         }
    //       }).catch(err => {
    //         console.log(err);
    //         this.$message.error('请求发送失败！');
    //       });
    //     } else {
    //       this.$message.error('请完善表单！');
    //     }
    //   });
    // },
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
.column {
  padding: 0 10px;
}

.table {
  margin-bottom: 20px;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
}

.installing {
  color: rgb(245, 220, 94);
  /* 或者其它您希望的颜色 */
  font-weight: bold;
}

.install {
  padding: 10px;
}

.el-form {
  width: 400px;
  margin: 0 auto;
}
</style>
