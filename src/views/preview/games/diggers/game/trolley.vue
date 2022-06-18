<template>
  <div class="game-table table-preview">
    <div class="table-header">
      <h2>手推车</h2>
      <p style="margin-left: 16px">
        煤包数量：{{ coals.length }}
        <el-button type="text" size="mini" @click="buyCoal">购买煤包</el-button>
      </p>
      <div class="operation">
        <div>
          自动运行:
          <el-switch v-model="gamesConfig.diggers.trolley_open" />
        </div>
        <el-button @click="configVisible = true" type="text"> 配置 </el-button>
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
      <el-table-column label="建造进度">
        <div slot-scope="{ row }">
          <template v-if="row.prop.build_count === row.build_counter">
            <span style="color: #67c23a">建造完成</span>
          </template>
          <template v-else>
            <p>次数：{{ row.prop.build_count }}/{{ row.build_counter }}</p>
            <p style="color: #409eff">{{ row.nextActionTimeText }}</p>
          </template>
        </div>
      </el-table-column>

      <el-table-column label="单次建造材料">
        <div slot-scope="{ row }">
          <div v-for="(item, key) in row.prop._build_price" :key="key">
            <img :src="COINS[key]" class="icon-currency" />
            <span class="balances">{{ item }}</span>
          </div>
        </div>
      </el-table-column>

      <el-table-column label="推车进度">
        <div slot-scope="{ row }">
          <template v-if="row.prop.build_count !== row.build_counter && row.journey_type">
            <span style="color: #f56c6c">未开始推车</span>
          </template>
          <template v-else>
            <p>次数：{{ row.__max_push_conter }}/{{ row.push_counter }}</p>
            <p style="color: #409eff">{{ row.nextActionTimeText }}</p>
          </template>
        </div>
      </el-table-column>
      <el-table-column label="操作">
        <div slot-scope="{ row }">
          <el-button
            type="text"
            @click="build(row)"
            :disabled="!row.actionZero || row.prop.build_count === row.build_counter"
          >
            建造
          </el-button>
          <el-button type="text" @click="unstake(row)" :disabled="unstakeDisable(row)">
            卸下
          </el-button>
        </div>
      </el-table-column>
    </el-table>
    <ConfigDialog v-model="configVisible"></ConfigDialog>
  </div>
</template>
<script>
import { handleSubs, obser, gamesConfig } from '@/store/light';
import { getDifferenceTime } from '@/utils/time';
import { GetAllRushConfig, getBagCoals, getUserBalances, getUserTrolley } from '../api/table';
import { sendMessage } from '@/utils/util';
import { COINS } from '../config/constant';
import ConfigDialog from '../components/trolley/ConfigDialog.vue';

export default {
  name: 'TrolleyTable',
  components: {ConfigDialog},
  data() {
    return {
      COINS,
      obser,
      gamesConfig,
      handleSubs,
      loading: false,
      updateStimeInter: null, // 更新时间的定时器
      loading: false,
      configVisible: false,
      coals: [],
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
      const { actionZero } = row;
      return !actionZero;
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
     * 购买煤包
     */
    buyCoal() {
      sendMessage({
        type: 'run',
        data: {
          buy: [{ template_id: 530552 }]
        }
      });
    },

    /**
     * 查询资源 根据用户
     */
    async queryAssetsByName() {
      clearTimeout(this.updateStimeInter);
      await this.getTableData();
      this.updatestime();
      this.coals = await getBagCoals();
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
          row.__max_push_conter = row.journey_type === 'short' ? 24 : 60;
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
          const { zero: actionZero, text: actionText } = getDifferenceTime(
            row.next_action_time * 1000
          );
          this.$set(row, 'actionZero', actionZero);
          this.$set(row, 'nextActionTimeText', actionText);
          // false 建造 true推车
          const type = row.build_counter === row.prop.build_count ? true : false;
          if (actionZero) {
            if (!type) { // 进行建造
              // 获取余额
              const balances = await getUserBalances();
              const isSati = this.satisfyBuildBalances(balances, row.prop._build_price);
              isSati && this.setRunData(mines, 'build', row);
            } else if (row.journey_type) { // type存在 进行推车
              this.coals = await getBagCoals();
              if (this.coals.length) {
                this.setRunData(mines, 'pushTrolley', { ...row, asset_id: this.coals[0].asset_id });
              } else {
                this.setRunData(mines, 'buy', { ...row, template_id: 530552 });
              }
            } else { // 选择短期&长期
              this.setRunData(mines, 'startjourney', { isShort: this.gamesConfig.diggers.trolley_isShort });
            }
          }
        }
        if (Object.keys(mines).length && this.gamesConfig.diggers.trolley_open) {
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
