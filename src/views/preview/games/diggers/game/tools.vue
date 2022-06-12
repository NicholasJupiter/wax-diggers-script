<template>
  <div class="game-table table-preview">
    <div class="table-header">
      <h2>工具</h2>
      <div class="operation">
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
      <!-- <el-table-column label="AssetId" prop="asset_id"> </el-table-column> -->
      <el-table-column label="名称" prop="template_name"> </el-table-column>
      <el-table-column label="类型" prop="type"> </el-table-column>
      <el-table-column label="剩余时间" prop="nextTimeText"> </el-table-column>
      <el-table-column label="耐久度">
        <span slot-scope="{ row }"> {{ row.init_durability }}/{{ row.durability }} </span>
      </el-table-column>
      <el-table-column label="操作">
        <div slot-scope="{ row }">
          <el-button
            type="text"
            @click="repir(row)"
            :disabled="row.init_durability === row.durability"
          >
            维修
          </el-button>
          <el-button type="text" @click="unstake(row)" :disabled="unstakeDisable(row)">
            卸下
          </el-button>
        </div>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { GetWaxTableRows } from '@/wax/table_row';
import { handleSubs, obser, gamesConfig } from '@/store/light';
import { getDifferenceTime } from '@/utils/time';
import { GetAllProp } from '../api/table';
import { sendMessage } from '@/utils/util';

export default {
  name: 'GameTable',
  components: {},
  data() {
    return {
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
    this.$message.success('加载脚本成功!');
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
      const allProp = await GetAllProp(this.obser.gamename);
      if (allProp) {
        this.obser.games.diggers.allProp.push(...allProp);
      }
    },
    /**
     * 获取工具, 用来显示
     */
    async getTableTools() {
      this.loading = true;
      const { owner, gamename } = this.obser;
      // 没有查询过所有工具
      if (!this.obser.games.diggers.allProp.length) {
        await this.queryProps();
      }
      await GetWaxTableRows({
        lower_bound: owner,
        index_position: 2,
        upper_bound: owner,
        table: 'tools',
        scope: gamename,
        code: gamename
      }).then((res) => {
        const { rows } = res;
        if (rows.length) {
          console.log(rows);
          rows.forEach((row) => {
            const rowProp = this.getRowProp(row.template_id);
            if (rowProp) {
              const { __name, init_durability } = rowProp;
              row.template_name = __name;
              row.init_durability = init_durability;
            }
          });
          rows.sort((v, n) => (v.template_id > n.template_id ? -1 : 0));
        }
        console.log('tools 查询结果:', rows);
        this.tableRows = rows;
      });
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
        if (mines.length && this.gamesConfig.diggers.isOpen) {
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
      return this.obser.games.diggers.allProp.find((item) => item.template_id == template_id);
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
