<template>
  <div class="header">
    <el-row :gutter="20">
      <el-col :span="4" :offset="2">
        <el-card :body-style="{ padding: '0px' }" class="card-panel">
          <div class="card-panel-icon-wrapper icon-peoples">
            <router-link to="/perm/group">
              <svg-icon icon-class="peoples" class-name="card-panel-icon"/>
            </router-link>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              组
            </div>
            <div class="card-panel-num">
              {{ groupNum }}
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="4" :offset="2">
        <el-card :body-style="{ padding: '0px' }" class="card-panel">
          <div class="card-panel-icon-wrapper icon-people">
            <router-link to="/perm/user">
              <svg-icon icon-class="people" class-name="card-panel-icon" />
            </router-link>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              用户
            </div>
            <div class="card-panel-num">
              {{ userNum }}
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="4" :offset="2">
        <el-card :body-style="{ padding: '0px' }" class="card-panel">
          <div class="card-panel-icon-wrapper icon-server">
            <router-link to="/asset/server">
              <svg-icon icon-class="server" class-name="card-panel-icon" />
            </router-link>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              主机
            </div>
            <div class="card-panel-num">
              {{ serverNum }}
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <panel-group @handleSetLineChartData="handleSetLineChartData" />
    
  </div>
  
</template>

<script>
import { getServerList } from '@/api/server'
import { getUserList } from '@/api/users'
import { getGroupList } from '@/api/groups'
import PanelGroup from './components/PanelGroup'

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
  },
  data() {
    return {
      serverNum: '',
      userNum: '',
      groupNum: ''
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getServerList().then(
        // 获取服务器个数
        res => {
          this.serverNum = res.data.count
        }
      )
      getUserList(this.params).then(
        // 获取服务器个数
        res => {
          this.userNum = res.data.count
        }
      )
      getGroupList(this.params).then(
        // 获取所有用户组
        res => {
          this.groupNum = res.data.count
        }
      )
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.header {
  padding: 10px;
  margin: 10px;
}
  .card-panel {
    height: 108px;
    position: relative;
    .icon-peoples {
      color: #40c9c6;
    }
    .icon-people {
      color: #246a6d;
    }
    .icon-server {
      color: #a8d111;
    }
  }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
      .card-panel-icon {
          float: left;
          font-size: 48px;
        }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
        .card-panel-num {
          color: rgba(0, 0, 0, 0.45);
          font-size: 20px;
        }
    }
</style>
