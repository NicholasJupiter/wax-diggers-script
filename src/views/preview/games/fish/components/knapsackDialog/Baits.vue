<template>
  <div class="baits">
    <el-table :data="rows" v-loading="loading" border stripe>
      <el-table-column type="index"> </el-table-column>
      <!-- <el-table-column label="ID" prop="baitId"> </el-table-column> -->
      <el-table-column label="名称">
        <div slot-scope="{ row }">
          <span class="bait-name">
            <img :src="row.icon" class="coin" />
            {{ row.name }}
          </span>
        </div>
      </el-table-column>
      <el-table-column label="拥有数量" prop="amount"> </el-table-column>
      <!-- <el-table-column label="类型" prop="type"> </el-table-column> -->
      <el-table-column label="操作">
        <div slot-scope="{ row }">
          <el-button type="text" @click="buyBait(row)">购买</el-button>
          <el-button type="text" @click="wear(row)" :disabled="!!row.useAmount || !row.amount">
            {{ row.useAmount ? `使用中(${row.useAmount})` : '使用' }}
          </el-button>
          <el-button type="text" @click="unstake(row)" :disabled="!row.useAmount"> 卸下 </el-button>
        </div>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { sendMessage } from '@/utils/util';
import { getInUseBaits, getUserBaits } from '../../api/table';
import { BAITS_CONFIG } from '../../config/constant';

export default {
  name: 'Baits',
  data() {
    return {
      rows: [...BAITS_CONFIG],
      loading: false
    };
  },
  created() {
    this._getUserBaits();
    this.rows.forEach((v) => {
      this.$set(v, 'amount', 0);
    });
  },
  methods: {
    buyBait(row) {
      const num = Number(prompt('输入购买鱼饵数量', 0));
      if (!num || num < 0) return this.$message.error('必须大于0');
      sendMessage({
        type: 'run',
        data: {
          buyBait: [
            {
              buyBaitId: row.id,
              buyBaitAmount: Number(num)
            }
          ]
        }
      });
    },
    wear(row) {
      const num = Number(prompt('输入使用鱼饵数量', 0));
      if (!num || num > Number(row.amount) || num < 0) {
        return this.$message.error('格式不对，必须小于拥有数量');
      }
      sendMessage({
        type: 'run',
        data: {
          stakeBait: [
            {
              baitId: row.id,
              amount: Number(num)
            }
          ]
        }
      });
    },
    unstake() {},
    /**
     * 获取用户的鱼饵
     */
    async _getUserBaits() {
      const ret = await getUserBaits();
      if (ret.rows.length && ret.rows[0].baits.length) {
        const useRet = await getInUseBaits();
        const { baits, amount } = ret.rows[0];
        // 循环背包的鱼饵
        for (let i = 0; i < baits.length; i++) {
          const row = this.rows.find((v) => v.id === baits[i]);
          if (row) {
            this.$set(row, 'amount', amount[i] || 0);
            if (useRet && useRet.bait_amount && row.id === useRet.bait_id) {
              this.$set(row, 'useAmount', useRet.bait_amount);
            }
          }
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
img.coin {
  width: 24px;
  vertical-align: middle;
}
</style>
