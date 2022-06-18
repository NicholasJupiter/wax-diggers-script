<template>
  <div class="game-table table-preview">
    <div class="table-header">
      <h2>工具</h2>
      <div class="operation">
        <div>
          自动运行:
          <el-switch v-model="gamesConfig.diggers.tools_open" />
        </div>
        <el-button type="text" @click="configVisible = true">配置</el-button>
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
      <el-table-column label="类型" prop="type"> </el-table-column>
      <el-table-column label="剩余时间" prop="nextTimeText"> </el-table-column>
      <el-table-column label="耐久度">
        <span slot-scope="{ row }"> {{ row.prop.init_durability }}/{{ row.durability }} </span>
      </el-table-column>
      <el-table-column label="维修需要">
        <div slot-scope="{ row }" class="repair_cost">
          <div class="item" v-for="(item, key) in row.prop.repair_once" :key="key">
            <img :src="COINS[key]" class="icon-currency" />
            <span class="balances">{{ item * (row.prop.init_durability - row.durability) }}</span>
          </div>
        </div>
      </el-table-column>
      <el-table-column label="操作">
        <div slot-scope="{ row }">
          <el-button
            type="text"
            @click="repir(row)"
            :disabled="row.prop.init_durability === row.durability"
          >
            维修
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
import { GetAllTools, getUserTools } from '../api/table';
import { sendMessage } from '@/utils/util';
import { COINS } from '../config/constant';
import ConfigDialog from '../components/tools/ConfigDialog.vue';

export default {
  name: 'ToolsTable',
  components: { ConfigDialog },
  data() {
    return {
      COINS,
      obser,
      gamesConfig,
      handleSubs,
      configVisible: false,
      loading: false,
      updateStimeInter: null, // 更新时间的定时器
      loading: false,
      tableRows: [] // 表格数据
    };
  },
  created() {
    window.testSendMsg = this.testSendMsg;
    this.init();
  },
  watch: {
    gamesConfig: {
      handler(val) {
        this.queryAssetsByName();
      },
      deep: true
    }
  },

  methods: {
    unstakeDisable(row) {
      const { init_durability, durability, zero } = row;
      if (init_durability !== durability) {
        return true;
      }
      return !zero;
    },
    /**
     * 维修道具
     * @param {object} row
     */
    repir(row) {
      sendMessage({
        type: 'run',
        data: { repir: [row] }
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
      await this.getTableTools();
      this.updatestime();
    },

    /**
     * 查询所有工具
     */
    async queryProps() {
      const allTools = await GetAllTools(this.obser.gamename);
      if (allTools) {
        this.obser.games.diggers.allTools.push(...allTools);
      }
    },
    /**
     * 获取工具, 用来显示
     */
    async getTableTools() {
      this.loading = true;
      // 没有查询过所有工具
      if (!this.obser.games.diggers.allTools.length) {
        await this.queryProps();
      }
      const { rows } = await getUserTools();
      if (rows.length) {
        rows.forEach((row) => {
          const rowProp = this.getRowProp(row.template_id);
          if (rowProp) row.prop = rowProp;
        });
        rows.sort((v, n) => (v.template_id > n.template_id ? -1 : 0));
      }
      this.tableRows = rows;
      this.loading = false;
    },

    /**
     * 更新时间
     */
    updatestime() {
      const { tableRows } = this;
      this.updateStimeInter = setTimeout(() => {
        const mines = [];
        for (const row of tableRows) {
          const { zero, text } = getDifferenceTime(row.next_mine * 1000);
          this.$set(row, 'zero', zero);
          this.$set(row, 'nextTimeText', text);
          if (zero) {
            mines.push(row);
          }
        }
        if (mines.length && this.gamesConfig.diggers.tools_open) {
          sendMessage({
            type: 'run',
            data: { tools: mines }
          });
          return;
        }
        this.updatestime();
      }, 1000);
    },

    // 获取参数
    getRowProp(template_id) {
      return this.obser.games.diggers.allTools.find((item) => item.template_id == template_id);
    },

    /**
     * 测试发送
     */
    testSendMsg() {
      const mines = [];
      for (const row of this.tableRows) {
        mines.push(row);
      }
      sendMessage({
        type: 'run',
        data: { tools: mines }
      });
    }
  }
};
</script>
<style lang="scss" scoped></style>
