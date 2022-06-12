<template>
  <div class="diggers-preview">
    <div class="diggers-head flex">
      <div class="balances">
        <Balance :fn="_getUserBalances"></Balance>
      </div>
      <div class="right flex align-center config">
        <div>
          自动运行:
          <el-switch v-model="gamesConfig.diggers.isOpen" />
        </div>
        <el-button type="text" @click="knapsackVisible = true">背包</el-button>
        <el-button type="text" @click="configVisible = true">配置</el-button>
      </div>
    </div>

    <div class="table-container">
      <ToolsTable></ToolsTable>
    </div>
    <ConfigDialog v-model="configVisible"></ConfigDialog>
    <KnapsackDialog v-model="knapsackVisible"></KnapsackDialog>
  </div>
</template>
<script>
import { gamesConfig, obser } from '@/store/light';

import ToolsTable from './game/tools.vue';
import KnapsackDialog from './components/knapsack/Dialog.vue';
import ConfigDialog from './components/ConfigDialog.vue';
import Balance from '@/components/comm/Balance.vue';
import { getUserBalances } from './api/table';
import { getBalancesObj } from '@/utils/util';
import { COINS } from './config/constant';
import { GetWalletBalances } from '@/wax/table_row';

export default {
  components: { ToolsTable, ConfigDialog, KnapsackDialog, Balance },
  name: 'Diggers',
  data() {
    return {
      obser,
      gamesConfig,
      configVisible: false,
      knapsackVisible: false,
      balances: []
    };
  },
  created() {},
  methods: {
    async _getUserBalances() {
      const ret = [];
      const balances = getBalancesObj(await getUserBalances());
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
.table-container {
  padding: 12px;
}
.diggers-head {
  align-items: flex-end;
  .config {
    * + * {
      margin-left: 8px;
    }
  }
}
</style>
