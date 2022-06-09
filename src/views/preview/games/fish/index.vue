<template>
  <div class="fish-preview">
    <div class="fish-head">
      <div class="left">
        <span>余额：</span>
      </div>
      <div class="right">
        <span>
          自动运行：
          <el-switch v-model="gamesConfig.fishing.isOpen"></el-switch>
        </span>
        <el-button type="text" @click="knapsackVisible = true"> 背包 </el-button>
        <el-button type="text" @click="visible = true"> 配置 </el-button>
      </div>
      <!-- <el-button></el-button>s -->
    </div>
    <ToolsTable></ToolsTable>
    <!-- 弹窗 -->
    <KnapsackDialog v-model="knapsackVisible"></KnapsackDialog>
    <ConfigDialog v-model="visible"></ConfigDialog>
  </div>
</template>
<script>
import { gamesConfig } from '@/store/light';
import ToolsTable from './games/tools.vue';
import ConfigDialog from './components/ConfigDialog.vue';
import KnapsackDialog from './components/knapsackDialog/index.vue';

export default {
  components: { ToolsTable, ConfigDialog, KnapsackDialog },
  name: 'Fish',
  data() {
    return {
      gamesConfig,
      knapsackVisible: false,
      visible: false
    };
  },
  created() {},
  methods: {}
};
</script>
<style lang="scss" scoped>
.fish-preview {
  .fish-head {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    > .right {
      margin-left: auto;
      .el-button {
        margin-left: 8px;
      }
    }
  }
}
</style>
