<template>
  <div class="fish-preview">
    <div class="fish-head">
      <div class="right">
        <span>
          自动运行：
          <el-switch v-model="gamesConfig.fishing.isOpen"></el-switch>
        </span>
        <el-button type="text" @click="visible = true"> 配置 </el-button>
      </div>
      <!-- <el-button></el-button>s -->
    </div>
    <ToolsTable></ToolsTable>

    <ConfigDialog v-model="visible"></ConfigDialog>
  </div>
</template>
<script>
import { gamesConfig } from '@/store/light';
import ToolsTable from './games/tools.vue';
import ConfigDialog from './components/ConfigDialog.vue';

export default {
  components: { ToolsTable, ConfigDialog },
  name: 'Fish',
  data() {
    return {
      gamesConfig,
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
