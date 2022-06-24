<template>
  <div class="tools-table table-preview">
    <div class="table-header">
      <h2>工具</h2>
      <div class="operation">
        <span>
          自动运行：
          <el-switch v-model="gamesConfig.galactic.mine_open"></el-switch>
        </span>
        <el-button @click="init" :disabled="loading" type="text" icon="el-icon-refresh">
          刷新数据
        </el-button>
      </div>
    </div>
    <el-table :data="rows" v-loading="loading" border stripe>
      <el-table-column type="index"> </el-table-column>
      <el-table-column label="key" prop="key"> </el-table-column>
      <!-- <el-table-column label="名称" prop="template_name"> </el-table-column>
      <el-table-column label="类型" prop="type"> </el-table-column> -->
      <el-table-column label="冷却倒计时" prop="nextTimeText"> </el-table-column>
      <!-- <el-table-column label="操作">
        <div slot-scope="{ row }">
          <el-button
            type="text"
            @click="mine(row)"
            :disabled="!row.nextTimeZero || !row.resetEnergyZero || !row.enegy"
          >
            执行
          </el-button>
          <el-button type="text" @click="repir(row)" :disabled="disabledRepir(row)">
            维修
          </el-button>
        </div>
      </el-table-column> -->
    </el-table>
  </div>
</template>
<script>
import { gamesConfig, handleSubs, obser } from '@/store/light';
import { getTools, getToolsByToolId } from '../api/table';
import { getDifferenceTime } from '@/utils/time';
import { sendMessage } from '@/utils/util';
export default {
  name: 'ToolsTable',
  data() {
    return {
      obser,
      gamesConfig,
      loading: false,
      rows: []
    };
  },
  watch: {
    gamesConfig: {
      handler(val) {
        this.init();
      },
      deep: true
    }
  },
  created() {
    this.init();
    handleSubs.push(this.init);
  },
  methods: {
    /**
     * 获取用户信息
     */
    async init() {
      this.loading = true;
      const rows = await getTools();
      this.rows = rows;
      this.updatestime();
      this.loading = false;
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
          const afterTime = new Date(row.lmd + '.000Z');
          const nextTime = new Date(afterTime);
          nextTime.setHours(nextTime.getHours() + 1);
          const { zero, text } = getDifferenceTime(nextTime);
          this.$set(row, 'nextTimeText', text);
          if (zero) {
            this.setMines(mines, 'mine', row);
          }
        }
        if (Object.keys(mines).length && this.gamesConfig.galactic.mine_open) {
          sendMessage({
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
<style lang="scss" scoped></style>
