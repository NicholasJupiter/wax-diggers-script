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
      <el-table-column label="余额" prop="amount"> </el-table-column>
      <!-- <el-table-column label="类型" prop="type"> </el-table-column> -->
      <el-table-column label="操作">
        <div slot-scope="{ row }">
          <!-- <el-button type="text" @click="buyBait(row)">购买</el-button>
          <el-button type="text" @click="wear(row)" :disabled="!!row.useAmount">
            {{ row.useAmount ? `使用中(${row.useAmount})` : '使用' }}
          </el-button> -->
          <!-- <el-button type="text" @click="mine(row)" :disabled="!row.zero"> 执行 </el-button>
          <el-button type="text" @click="repir(row)" :disabled="disabledRepir(row)">
            维修
          </el-button> -->
          <!-- <el-button type="text" @click="unstake(row)" :disabled="unstakeDisable(row)">
            卸下
          </el-button> -->
        </div>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getInUseBaits, getUserBaits } from '../../api/table';
export default {
  name: 'Baits',
  data() {
    return {
      rows: [
        {
          baitId: 1000,
          name: '蓝色(普通 FSLF)',
          icon: require('@/assets/imgs/coin/coin_fslf.png'),
          amount: 0
        },
        {
          baitId: 1001,
          name: '蓝色(普通 FSLS)',
          icon: require('@/assets/imgs/coin/coin_fsls.png'),
          amount: 0
        },
        {
          baitId: 1002,
          name: '绿色(稀有 FSLF)',
          icon: require('@/assets/imgs/coin/coin_fslf.png'),
          amount: 0
        },
        {
          baitId: 1003,
          name: '绿色(稀有 FSLS)',
          icon: require('@/assets/imgs/coin/coin_fsls.png'),
          amount: 0
        }
      ],
      loading: false
    };
  },
  created() {
    this._getUserBaits();
  },
  methods: {
    /**
     * 获取用户的鱼饵
     */
    async _getUserBaits() {
      const ret = await getUserBaits();
      if (ret.rows.length && ret.rows[0].baits.length) {
        const useRet = await getInUseBaits();
        const { baits, amount } = ret.rows[0];
        for (let i = 0; i < baits.length; i++) {
          const row = this.rows.find((v) => v.baitId === baits[i]);
          if (row) {
            this.$set(row, 'amount', amount[i]);
            if (useRet && useRet.bait_amount && row.baitId === useRet.bait_id) {
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
