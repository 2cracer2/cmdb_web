<template>
  <div class="server-list">
    <el-table ref="listTable" :data="values" style="width: 100%" @selection-change="schange">
      <el-table-column type="selection" width="35">
      </el-table-column>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="CPU型号">
              <span>{{ props.row.cpu_model }}</span>
            </el-form-item>
            <el-form-item label="CPU个数">
              <span>{{ props.row.cpu_count }}</span>
            </el-form-item>
            <el-form-item label="CPU核数">
              <span>{{ props.row.cpu_core_count }}</span>
            </el-form-item>
            <el-form-item label="RAM数量">
              <el-popover placement="right-start" width="400" trigger="hover">
                <el-table :data="props.row.ram">
                  <el-table-column width="80" property="ram_slot" label="插槽"></el-table-column>
                  <el-table-column width="80" property="ram_capacity" label="内存大小"></el-table-column>
                  <el-table-column width="80" property="ram_model" label="型号"></el-table-column>
                  <el-table-column width="80" property="ram_sn" label="序列号"></el-table-column>
                </el-table>
                <el-button slot="reference" type="text">{{ props.row.ram.length }}</el-button>
              </el-popover>
            </el-form-item>

            <el-form-item label="硬盘">
              <el-popover placement="right-start" width="200" trigger="hover">
                <el-table :data="props.row.driver">
                  <el-table-column width="80" property="driver_name" label="设备名"></el-table-column>
                  <el-table-column width="80" property="capacity" label="硬盘大小"></el-table-column>
                </el-table>
                <el-button slot="reference" type="text">{{ props.row.driver.length }}</el-button>
              </el-popover>
            </el-form-item>
            <el-form-item label="创建时间">
              <span>{{ props.row.create_date }}</span>
            </el-form-item>
            <el-form-item label="更新时间">
              <span>{{ props.row.update_date }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="管理IP" min-width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.ip_managemant }}</span>
        </template>
      </el-table-column>
      <el-table-column label="主机名" min-width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.hostname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作系统" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.os_type }} {{ scope.row.os_release }}</span>
        </template>
      </el-table-column>
      <el-table-column label="CPU核数*物理个数" min-width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.cpu_core_count"> {{ scope.row.cpu_core_count }}*{{
            scope.row.cpu_count }} </span>
        </template>
      </el-table-column>
      <el-table-column label="内存大小(GB)" min-width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.mem_capacity }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="250">
        <template slot-scope="scope">
          <el-button size="mini" @click="serverEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="serverDelete(scope.row)">删除</el-button>
          <el-button size="mini" type="danger" @click="serverInstall(scope.row)">重装系统</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: 'ServerList',
  props: {
    values: {
      type: Array,
      default: function () {
        return []
      }
    },
    mulselect: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  methods: {
    schange(val) {
      this.$emit('mulselect', val)
    },
    serverEdit(server) {
      this.$emit('edit', server)
    },
    serverDelete(server) {
      this.$confirm(`此操作将删除该${server.ip_managemant}服务器记录, 是否继续?`, '删除服务器', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('delete', server.id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    serverInstall(server) {
      this.$confirm(`此操作将重装该${server.ip_managemant}服务器系统, 是否继续?`, '重装服务器系统', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('delete', server.id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消重装'
        })
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>