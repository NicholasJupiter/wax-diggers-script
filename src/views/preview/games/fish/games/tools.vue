<template>
  <div class="tools-table table-preview">
    <div class="table-header">
      <h2>工具</h2>
      <div class="operation">
        <el-button @click="getAccounts" :disabled="loading" type="text" icon="el-icon-refresh">
          刷新数据
        </el-button>
      </div>
    </div>
    <el-table :data="rows" v-loading="loading" border stripe>
      <el-table-column type="index"> </el-table-column>
      <!-- <el-table-column label="AssetId" prop="asset_id"> </el-table-column> -->
      <!-- <el-table-column label="名称" prop="template_name"> </el-table-column>
      <el-table-column label="类型" prop="type"> </el-table-column> -->
      <el-table-column label="剩余时间" prop="stime"> </el-table-column>
      <el-table-column label="耐久度">
        <span slot-scope="{ row }"> {{ row.max_enegy }}/{{ row.enegy }} </span>
      </el-table-column>
      <el-table-column label="操作">
        <div slot-scope="{ row }">
          <el-button type="text" @click="mine(row)" :disabled="!row.zero"> 执行 </el-button>
          <!-- <el-button type="text" @click="repir(row)" :disabled="row.max_enegy === row.enegy">
            维修
          </el-button>
          <el-button type="text" @click="unstake(row)" :disabled="unstakeDisable(row)">
            卸下
          </el-button> -->
        </div>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { handleSubs, obser } from '@/store/light';
import { getAccounts, getToolsByToolId } from '../api/table';
import TableRowMixins from '@/mixins/tableRow.js';
export default {
  name: 'ToolsTable',
  data() {
    return {
      obser,
      loading: false,
      rows: [],
      accountInfo: null // 用户信息
    };
  },
  computed: {},
  mixins: [TableRowMixins],
  created() {
    this.getAccounts();
    handleSubs.push(this.getAccounts);
  },
  methods: {
    unstakeDisable() {
      return true;
    },
    // 卸下
    unstake(row) {},
    // 执行
    mine(row) {
      this.sendMessage({
        type: 'run',
        data: { tools: [row] }
      });
    },
    // 维修
    repir(row) {},
    /**
     * 获取用户信息
     */
    async getAccounts() {
      this.loading = true;
      const ret = await getAccounts();
      if (ret.rows.length) {
        this.accountInfo = ret.rows[0];
        if (this.accountInfo.tools.length) {
          this.getTableRows(this.accountInfo.tools);
        }
      }
      this.loading = false;
    },
    // 获取table
    getTableRows(toolIds) {
      for (const id of toolIds) {
        getToolsByToolId(id).then((res) => {
          if (res.rows.length) {
            const i = this.rows.findIndex(({ asset_id }) => asset_id === res.rows[0].asset_id);
            if (i === -1) {
              this.rows.push(res.rows[0]);
            } else {
              this.rows.splice(i, 1, res.rows[0]);
            }
            this.updatestime();
          }
        });
      }
    },

    /**
     * 更新时间
     */
    updatestime() {
      const { rows } = this;
      clearTimeout(this.updateStimeInter);
      this.updateStimeInter = setTimeout(() => {
        const mines = {};
        for (const row of rows) {
          const timeObj = this.$stime(row.next_availability * 1000);
          this.$set(row, 'zero', timeObj.zero);
          this.$set(row, 'stime', timeObj.text);
          if (timeObj.zero) {
            this.setMines(mines, 'tools', row);
          }
        }

        if (Object.keys(mines).length && this.gamesConfig.fishing.isOpen) {
          this.sendMessage({
            type: 'run',
            data: mines
          });
          return;
        }

        this.updatestime();
      }, 1000);
    },

    // 设置
    setMines(mines, key, row) {
      if (!mines[key]) {
        mines[key] = [{ ...row }];
      } else {
        mines[key].push({ ...row });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import '@/assets/table.scss';
</style>
