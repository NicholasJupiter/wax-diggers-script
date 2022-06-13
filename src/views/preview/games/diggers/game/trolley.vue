<template>
  <div class="game-table table-preview">
    <div class="table-header">
      <h2>手推车</h2>
      <div class="operation">
        <div>
          自动运行:
          <el-switch v-model="gamesConfig.diggers.trolley.open" />
        </div>
        <el-button
          @click="queryAssetsByName"
          :disabled="loading"
          type="text"
          icon="el-icon-refresh"
        >
          刷新数据
        </el-button>
      </div>
    </div>

    <el-table :data="tableRows" v-loading="loading" border stripe>
      <el-table-column type="index"> </el-table-column>
      <el-table-column label="名称">
        <span slot-scope="{ row }">{{ row.prop.__name }}</span>
      </el-table-column>
      <el-table-column label="建造次数">
        <span slot-scope="{ row }"> {{ row.prop.build_count }}/{{ row.build_counter }} </span>
      </el-table-column>
      <el-table-column label="剩余时间" prop="nextTimeText"> </el-table-column>
      <el-table-column label="单次建造材料">
        <div slot-scope="{ row }">
          <div v-for="(item, key) in row.prop._build_price" :key="key">
            <img :src="COINS[key]" class="icon-currency" />
            <span class="balances">{{ item }}</span>
          </div>
        </div>
      </el-table-column>
      <el-table-column label="操作">
        <div slot-scope="{ row }">
          <el-button type="text" @click="build(row)" :disabled="!row.zero"> 建造 </el-button>
          <el-button type="text" @click="unstake(row)" :disabled="unstakeDisable(row)">
            卸下
          </el-button>
        </div>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { handleSubs, obser, gamesConfig } from '@/store/light';
import { getDifferenceTime } from '@/utils/time';
import { GetAllRushConfig, getUserBalances, getUserTrolley } from '../api/table';
import { sendMessage } from '@/utils/util';
import { COINS } from '../config/constant';

export default {
  name: 'TrolleyTable',
  components: {},
  data() {
    return {
      COINS,
      obser,
      gamesConfig,
      handleSubs,
      loading: false,
      updateStimeInter: null, // 更新时间的定时器
      loading: false,
      tableRows: [] // 表格数据
    };
  },
  created() {
    this.init();
  },
  watch: {
    gamesConfig: {
      handler() {
        this.queryAssetsByName();
      },
      deep: true
    }
  },

  methods: {
    unstakeDisable(row) {
      const { zero } = row;
      return !zero;
    },
    /**
     * 建造
     * @param {object} row
     */
    build(row) {
      sendMessage({
        type: 'run',
        data: { build: [row] }
      });
    },
    /**
     * 卸下
     */
    unstake(row) {
      sendMessage({
        type: 'run',
        data: { unstake: [row] }
      });
    },
    // 初始化
    async init() {
      this.handleSubs.push(this.queryAssetsByName);
      this.queryAssetsByName();
    },

    /**
     * 查询资源 根据用户
     */
    async queryAssetsByName() {
      clearTimeout(this.updateStimeInter);
      await this.getTableData();
      this.updatestime();
    },
    /**
     * 获取工具, 用来显示
     */
    async getTableData() {
      this.loading = true;
      if (!this.obser.games.diggers.allRush.length) {
        const allRush = await GetAllRushConfig();
        this.obser.games.diggers.allRush.push(...allRush);
      }
      const { rows } = await getUserTrolley();
      if (rows.length) {
        rows.forEach((row) => {
          row.prop = {
            __name: '手推车',
            ...this.obser.games.diggers.allRush[0]
          };
        });
      }
      this.tableRows = rows;
      this.loading = false;
    },

    /**
     * 更新时间
     */
    async updatestime() {
      const { tableRows } = this;
      this.updateStimeInter = setTimeout(async () => {
        const mines = {};
        for (const row of tableRows) {
          const { zero, text } = getDifferenceTime(row.next_action_time * 1000);
          this.$set(row, 'zero', zero);
          this.$set(row, 'nextTimeText', text);
          if (zero) {
            const type = row.build_counter === 10 ? '' : 'build';
            if (type === 'build') {
              // 获取余额
              const balances = await getUserBalances();
              const isSati = this.satisfyBuildBalances(balances, row.prop._build_price);
              if (isSati) {
                this.setRunData(mines, type, row);
              }
            } else {
              this.setRunData(mines, type, row);
            }
          }
        }
        if (Object.keys(mines).length && this.gamesConfig.diggers.trolley.open) {
          sendMessage({
            type: 'run',
            data: mines
          });
          return;
        }
        this.updatestime();
      }, 1000);
    },
    /**
     * 设置data
     */
    setRunData(obj, key, item) {
      if (obj[key]) {
        obj[key].push(item);
      } else {
        obj[key] = [item];
      }
    },
    /**
     * 是否满足余额
     */
    async satisfyBuildBalances(balances, price) {
      let ret = true;
      for (const key of Object.keys(price)) {
        console.log(price[key], balances[key], key);
        if (price[key] && balances[key] < price[key]) {
          ret = false;
          break;
        }
      }
      return ret;
    }
  }
};
</script>
<style lang="scss" scoped>
.repair_cost {
  img {
    width: 24px;
    height: 24px;
    vertical-align: middle;
    object-fit: contain;
    margin-right: 4px;
  }
}
</style>
