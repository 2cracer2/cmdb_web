<template>
  <div class="userlist">
    <el-table v-loading="loading" :data="values" style="width: 100%">
      <el-table-column label="用户名" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上次登录时间" min-width="150">
        <template slot-scope="scope">
          <span>{{ formatDate(scope.row.last_login) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱地址" min-width="250">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="电话号码"
        min-width="200"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户组" min-width="220">
        <template slot-scope="scope">
          <!-- <div v-for="(item, index) in scope.row.groups" :key="index" style="float:left">
            <el-tag style="margin-right: 3px" size="mini" >{{ item.name }}</el-tag>
          </div> -->
          <span>{{ getRoleName(scope.row.roles) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="300">
        <template slot-scope="scope">
          <el-button size="mini" @click="userEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="info" @click="userGroups(scope.row)">属组</el-button>
          <el-button size="mini" type="danger" @click="userDelete(scope.row)">删除</el-button>
          <el-button size="mini" type="warning" @click="passEdit(scope.row)">修改密码</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

import moment from 'moment'

export default {
  data() {
    return {
      role_type: [
        [0, 'admin'],
        [1, 'user'],
      ],
      // 其他数据属性...
    };
  },

  name: 'UserList',
  props: {
    values: {
      type: Array,
      default: function () {
        return []
      }
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getRoleName(roleId) {
      const role = this.role_type.find(r => r[0] === roleId);
      return role ? role[1] : 'Unknown role';
    },
    formatDate(value) {
      if (value) {
        return moment(String(value)).format('MM/DD/YYYY HH:mm');
      }
    },
    passEdit(user) {
      this.$emit('editPass', user)
    },
    userEdit(user) {
      this.$emit('edit', user)
    },
    userGroups(user) {
      this.$emit('editGroup', user)
    },
    userDelete(user) {
      this.$confirm(`此操作将删除该${user.username}用户记录, 是否继续?`, '删除用户', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('delete', user.id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }

  }
}

</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
