<template>
  <div class="fish-preview">
    <div class="fish-head">
      <div class="left">
        <!-- <Balance :fn="_getUserBalances" collectionName="fishingcoins"></Balance> -->
      </div>
      <div class="right">
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
import Balance from '@/components/comm/Balance.vue';
import { GetWalletBalances } from '@/wax/table_row';
import { getUserBalances } from './api/table';
import { COINS } from './config/constant';

export default {
  components: { ToolsTable, ConfigDialog, KnapsackDialog, Balance },
  name: 'Galactic',
  data() {
    return {
      gamesConfig,
      knapsackVisible: false,
      visible: false
    };
  },
  created() {},
  methods: {
    async _getUserBalances() {
      const ret = [];
      const balances = await getUserBalances();
      const walletBalances = await GetWalletBalances(Object.keys(COINS));
      Object.keys(COINS).forEach((key) => {
        ret.push({
          token: walletBalances[key] || 0,
          icon: COINS[key],
          game: balances[key] || 0.0,
          name: key
        });
      });
      return ret;
    }
  }
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
