<template>
  <div class="game-table">
    <div class="content">
      <div class="account-name">
        <div>
          自动运行:
          <el-switch v-model="gamesConfig.diggers.isOpen" />
        </div>

        <div class="right">
          <el-button
            @click.stop="queryAssetsByName()"
            :disabled="loading"
            type="text"
            icon="el-icon-refresh"
          >
            刷新数据
          </el-button>
        </div>
      </div>
      <div class="setting">
        <div class="repir">
          维修方式:
          <el-radio-group v-model="gamesConfig.diggers.repirType">
            <el-radio :label="0">耐久度到0执行</el-radio>
            <el-radio :label="1">Mine之前执行</el-radio>
          </el-radio-group>
        </div>
      </div>
      <wax-item :tables="tableRows"></wax-item>
    </div>
  </div>
</template>
<script>
import WaxItem from '@/components/wax-item/index.vue';
import { GetWaxTableRows, GetAllProp } from '@/wax/table_row';
import TableRowMixins from '@/mixins/tableRow.js';
import { handleSubs } from '@/store/light';

export default {
  name: 'GameTable',
  components: { WaxItem },
  mixins: [TableRowMixins],
  data() {
    return {
      handleSubs,
      loading: false,
      updateStimeInter: null, // 更新时间的定时器
      tableRows: {} // 表格数据
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
    // 初始化
    async init() {
      const allProp = await GetAllProp(this.obser.gamename);
      if (allProp) {
        this.obser.allProp.push(...allProp);
      }
      this.handleSubs.push(this.queryAssetsByName);
      this.queryAssetsByName();

      // 5分钟总定时器
      setInterval(() => {
        this.queryAssetsByName();
      }, 1000 * 60 * 5);
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
     * 获取工具, 用来显示
     */
    async getTableTools() {
      this.loading = true;
      const { owner, tables, gamename } = this.obser;
      for (const table of ['tools']) {
        await GetWaxTableRows({
          lower_bound: owner,
          index_position: 2,
          upper_bound: owner,
          table,
          scope: gamename,
          code: gamename
        }).then((res) => {
          if (res.rows.length) {
            res.rows.forEach((row) => {
              const rowProp = this.getRowProp(row.template_id);
              if (rowProp) {
                const { __name, init_durability } = rowProp;
                row.template_name = __name;
                row.init_durability = init_durability;
              }
            });
          }
          console.log('查询结果:' + table, res.rows);
          this.$set(this.tableRows, table, res);
        });
      }
      this.loading = false;
    },

    /**
     * 更新时间
     */
    updatestime() {
      const { tableRows } = this;
      this.updateStimeInter = setTimeout(() => {
        const mines = {};
        for (const key of Object.keys(tableRows)) {
          for (const row of tableRows[key].rows) {
            const timeObj = this.$stime((row.next_availability || row.next_mine) * 1000);
            this.$set(row, 'zero', timeObj.zero);
            this.$set(row, 'stime', timeObj.text);
            if (timeObj.zero) {
              this.setMines(mines, key, row);
            } else {
            }
          }
        }
        if (Object.keys(mines).length && this.gamesConfig.diggers.isOpen) {
          this.sendMessage({
            type: 'run',
            data: mines
          });
          return;
        }
        this.updatestime();
      }, 1000);
    },

    /**
     * 测试发送
     */
    testSendMsg() {
      const mines = {};
      for (const key of Object.keys(this.tableRows)) {
        for (const row of this.tableRows[key].rows) {
          this.setMines(mines, key, row);
        }
      }

      this.sendMessage({
        type: 'run',
        data: mines
      });
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
.game-table {
  > .content {
    > .account-name {
      display: flex;
      align-items: center;
      > span {
        font-size: 20px;
        font-weight: 700;
      }
      .right {
        margin-left: auto;
        display: flex;
        align-items: center;
        .el-button {
          margin-left: 12px;
        }
      }
    }
  }
}
</style>
