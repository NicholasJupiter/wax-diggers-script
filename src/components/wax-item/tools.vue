<template>
  <div class="tools table-item">
    <h2>建造</h2>
    <el-table :data="rows" v-loading="loading" border stripe>
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
            >维修</el-button
          >
          <el-button type="text" @click="unstake(row)" :disabled="unstakeDisable(row)">
            卸下
          </el-button>
        </div>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import TableRowMixins from '@/mixins/tableRow.js';
export default {
  data() {
    return {
      isMounted: false
    };
  },
  props: {
    propKey: {
      type: String,
      required: true
    },
    rows: {
      type: Array,
      required: true
    }
  },
  mixins: [TableRowMixins],
  mounted() {
    this.isMounted = true;
  },
  computed: {
    loading() {
      if (!this.isMounted) return false;
      return this.$parent.$parent.loading;
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
      this.sendMessage({
        type: 'run',
        data: { repir: [row] }
      });
    },
    /**
     * 卸下
     */
    unstake(row) {
      this.sendMessage({
        type: 'run',
        data: { unstake: [row] }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import './style.scss';
</style>
