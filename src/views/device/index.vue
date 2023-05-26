<!-- <template>
    <div class="app-container">
      <el-input v-model="filterText" placeholder="Filter keyword" style="margin-bottom:30px;" />
  
      <el-tree
        ref="tree2"
        :data="data2"
        :props="defaultProps"
        :filter-node-method="filterNode"
        class="filter-tree"
        default-expand-all
      />
  
    </div>
  </template>
  
  <script>
  export default {
  
    data() {
      return {
        filterText: '',
        data2: [{
          id: 1,
          label: 'Level one 1',
          children: [{
            id: 4,
            label: 'Level two 1-1',
            children: [{
              id: 9,
              label: 'Level three 1-1-1'
            }, {
              id: 10,
              label: 'Level three 1-1-2'
            }]
          }]
        }, {
          id: 2,
          label: 'Level one 2',
          children: [{
            id: 5,
            label: 'Level two 2-1'
          }, {
            id: 6,
            label: 'Level two 2-2'
          }]
        }, {
          id: 3,
          label: 'Level one 3',
          children: [{
            id: 7,
            label: 'Level two 3-1'
          }, {
            id: 8,
            label: 'Level two 3-2'
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    watch: {
      filterText(val) {
        this.$refs.tree2.filter(val)
      }
    },
  
    methods: {
      filterNode(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      }
    }
  }
  </script>
   -->
<!-- 
   <template>
    <div class="app-container">
      <el-input v-model="filterText" placeholder="Filter keyword" style="margin-bottom:30px;" />
  
      <el-tree
        ref="tree2"
        :data="assetData"
        :props="defaultProps"
        :filter-node-method="filterNode"
        class="filter-tree"
        default-expand-all
        node-key="id"
        @node-click="handleNodeClick"
      ></el-tree>
  
      <el-drawer
        title="Asset Detail"
        size="50%"
        :visible.sync="drawerVisible"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="Asset SN">
              <el-input v-model="currentAssetDetail.asset_sn" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Asset Type">
              <el-input v-model="currentAssetDetail.asset_type" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
  
        <el-row>
          <el-col :span="12">
            <el-form-item label="Name">
              <el-input v-model="currentAssetDetail.name" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Business Unit">
              <el-input v-model="currentAssetDetail.business_unit" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
  
        <el-row>
          <el-col :span="12">
            <el-form-item label="Status">
              <el-input v-model="currentAssetDetail.status" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="IDC">
              <el-input v-model="currentAssetDetail.idc" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
  
        <el-row>
          <el-col :span="12">
            <el-form-item label="Purchase Day">
              <el-input v-model="currentAssetDetail.purchase_day" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Expire Day">
              <el-input v-model="currentAssetDetail.expire_day" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
  
        <el-row>
          <el-col :span="12">
            <el-form-item label="Price">
              <el-input v-model="currentAssetDetail.price" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Memo">
              <el-input v-model="currentAssetDetail.memo" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
  
        <el-row>
          <el-col :span="12">
            <el-form-item label="Created Time">
              <el-input v-model="currentAssetDetail.c_time" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Modified Time">
              <el-input v-model="currentAssetDetail.m_time" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
  
        <el-row>
          <el-col :span="12">
            <el-form-item label="Admin">
              <el-input v-model="currentAssetDetail.admin" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Manufacturer">
              <el-input v-model="currentAssetDetail.manufacturer" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
  
      </el-drawer>
    </div>
  </template>
  
  <script>
  import { getAssetList } from "@/api/server";
  
  export default {
    data() {
      return {
        filterText: '',
        assetData: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        drawerVisible: false,
        currentAssetDetail: {}
      }
    },
  
    watch: {
      filterText(val) {
        this.$refs.tree2.filter(val)
      }
    },
  
    created() {
      this.fetchData();
    },
  
    methods: {
      fetchData() {
        getAssetList().then((res) => {
          this.assetData = this.processData(res.data.results);
        })
      },
  
      processData(assetList) {
        let categories = {
          'server': '服务器',
          'networkdevice': '网络设备',
          'storagedevice': '存储设备',
          'ramdevice': '内存设备'
        };
  
        let data = [];
        for (let category in categories) {
          let assets = assetList.filter(asset => asset.asset_type === category);
          data.push({
            id: category,
            label: categories[category],
            children: assets.map(asset => ({
              id: asset.asset_sn,
              label: asset.name,
              assetDetail: asset
            }))
          })
        }
  
        return data;
      },
  
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
  
      handleNodeClick(data, node, component) {
        this.currentAssetDetail = data.assetDetail;
        this.drawerVisible = true;
      }
    }
  }
  </script>
  
  
   -->

<template>
  <div class="app-container">
    <el-input v-model="filterText" placeholder="Filter keyword" style="margin-bottom:30px;" />

    <el-tree ref="tree2" :data="assetData" :props="defaultProps" :filter-node-method="filterNode" class="filter-tree"
      default-expand-all node-key="id" @node-click="handleNodeClick"></el-tree>

    <el-drawer title="Asset Detail" size="30%" :visible.sync="drawerVisible">
      <el-form ref="currentAssetDetail" :model="currentAssetDetail" label-width="120px" v-if="currentAssetDetail">
        <el-form-item label="Asset SN">
          <span>{{ currentAssetDetail.asset_sn }}</span>
        </el-form-item>
        <el-form-item label="Name">
          <span>{{ currentAssetDetail.name }}</span>
        </el-form-item>
        <el-form-item label="业务段">
          <span>{{ currentAssetDetail.business_unit }}</span>
        </el-form-item>
        <el-form-item label="状态">
          <span>{{ statusDisplay }}</span>
        </el-form-item>
        <el-form-item label="所属IDC">
          <span>{{ currentAssetDetail.idc }}</span>
        </el-form-item>
        <el-form-item label="价格">
          <span>{{ currentAssetDetail.price }}</span>
        </el-form-item>
        <el-form-item label="厂商">
          <span>{{ currentAssetDetail.manufacturer }}</span>
        </el-form-item>
        <el-form-item label="备注">
          <span>{{ currentAssetDetail.memo }}</span>
        </el-form-item>
        <el-form-item label="管理员">
          <span>{{ currentAssetDetail.admin }}</span>
        </el-form-item>
        <el-form-item label="购买日期">
          <span>{{ currentAssetDetail.purchase_day }}</span>
        </el-form-item>
        <el-form-item label="过保日期">
          <span>{{ currentAssetDetail.expire_day }}</span>
        </el-form-item>
      </el-form>

    </el-drawer>
  </div>
</template>
  
<script>
import { getAssetList } from "@/api/server";

export default {
  data() {
    return {
      filterText: '',
      assetData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      drawerVisible: false,
      currentAssetDetail: null
    }
  },

  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },

  created() {
    this.fetchData();
  },
  computed: {
    statusDisplay() {
      let statusMap = ['在线', '下线', '未知', '故障', '备用'];
      return statusMap[this.currentAssetDetail.status];
    },
  },
  methods: {
    fetchData() {
      getAssetList().then((res) => {
        this.assetData = this.processData(res.data.results);
      })
    },

    processData(assetList) {
      let categories = {
        'server': '服务器',
        'networkdevice': '网络设备',
        'storagedevice': '存储设备',
        'ramdevice': '内存设备'
      };
      let statusCategories = ['在线', '下线', '未知', '故障', '备用'];
      // let data = [];
      // for (let category in categories) {
      //   let assets = assetList.filter(asset => asset.asset_type === category);
      //   data.push({
      //     id: category,
      //     label: categories[category],
      //     children: assets.map(asset => ({
      //       id: asset.asset_sn,
      //       label: asset.name,
      //       assetDetail: asset
      //     }))
      //   })
      // }

      // return data;
      let data = [];
  for (let category in categories) {
    let assets = assetList.filter(asset => asset.asset_type === category);
    
    let children = [];
    for (let status = 0; status < statusCategories.length; status++) {
      let statusAssets = assets.filter(asset => asset.status === status);
      children.push({
        id: `${category}_${status}`,
        label: statusCategories[status],
        children: statusAssets.map(asset => ({
          id: asset.asset_sn,
          label: asset.name,
          assetDetail: asset
        }))
      });
    }

    data.push({
      id: category,
      label: categories[category],
      children: children
    });
  }

  return data;
    },

    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },

    handleNodeClick(data, node, component) {
      this.currentAssetDetail = data.assetDetail;
      this.drawerVisible = true;
    },

    handleClose(done) {
      this.drawerVisible = false;
    },
  }
}
</script>
  
  