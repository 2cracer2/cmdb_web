<template>
  <div style="padding:30px;">
    <el-alert :closable="false" title="可支持IPMI的主机列表" type="success">
      <router-view />
    </el-alert>
    <div>
      <el-table :data="availableServers" :fit="true">
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
              <el-button type="primary" @click="openActionDialog(scope.row)">选择操作</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="操作选择" :visible.sync="actionDialogVisible" @close="resetAction">
      <el-select v-model="selectedAction" placeholder="选择一个操作">
        <el-option label="强制重启" value="force_restart"></el-option>
        <el-option label="电源断电" value="power_off"></el-option>
        <el-option label="ipmi唤醒" value="ipmi_wakeup"></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="actionDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="executeAction">确定执行</el-button>
      </span>
    </el-dialog>
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
      isRunning: false,
      form: {
        ip: '',
        system: '',
        reinstall_ip: '',
        server: '',
        status: '',
        uuid: ''
      },
      options: [
        { label: 'CentOS 7.2', value: 0 },
        { label: 'CentOS 7.8', value: 1 },
        { label: 'Ubuntu 22.04', value: 2 }
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
      actionDialogVisible: false,
      selectedAction: ''
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
      // 只显示至少有两个网络接口的服务器
      return this.serverList.filter(server => server.nic.length > 1);
      // return this.serverList.filter(server => server.server_status === 'running' || server.server_status === 'installing');
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
    refreshData() {
      // 在这里执行刷新数据的代码
      this.availableServers()
    },
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
        this.form.uuid = this.$store.getters.user;
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
      this.isRunning = true;
      // 在提交前进行确认
      this.$confirm('确定要重装此服务器吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        serverAutoInstall(this.form).then(res => {
          if (res.data.code === 200) {
            this.$message.success(res.data.message);

          } else {
            this.$message.error(res.data.message);
            this.isRunning = false;
          }
        });
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
    }, openActionDialog(row) {
      this.selectedServer = row;
      this.actionDialogVisible = true;
    },
    executeAction() {
      switch (this.selectedAction) {
        case 'force_restart':
          // 执行强制重启操作
          break;
        case 'power_off':
          // 执行电源断电操作
          break;
        case 'ipmi_wakeup':
          // 执行ipmi唤醒操作
          break;
      }
      this.actionDialogVisible = false;
    },
    resetAction() {
      this.selectedAction = '';
    },
  }
}
</script>