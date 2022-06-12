<template>
  <div class="atom-table table-preview">
    <div class="table-header">
      <h2>背包工具</h2>
      <div class="operation">
        <el-button @click.stop="_getAsset()" :disabled="loading" type="text" icon="el-icon-refresh">
          刷新数据
        </el-button>
      </div>
    </div>
    <el-table :data="rows" v-loading="loading" border stripe>
      <el-table-column type="index"> </el-table-column>
      <!-- <el-table-column label="AssetId" prop="asset_id"> </el-table-column> -->
      <el-table-column label="名称">
        <div slot-scope="{ row }">{{ row.data.name }} {{ row.data.rarity }}</div>
      </el-table-column>
      <el-table-column label="类型">
        <div slot-scope="{ row }">
          {{ row.data.type }}
        </div>
      </el-table-column>

      <el-table-column label="操作">
        <div slot-scope="{ row }">
          <el-button type="text" @click="carry(row)">装备</el-button>
        </div>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getAsset } from '@/wax/atom_asset';
import { handleSubs, obser } from '@/store/light';
import { sendMessage } from '@/utils/util';

export default {
  data() {
    return {
      obser,
      handleSubs,
      loading: false,
      rows: []
    };
  },
  created() {
    this.handleSubs.push(this._getAsset);
    this._getAsset();
  },
  methods: {
    // 获取资源
    _getAsset() {
      this.loading = true;
      getAsset({
        page: 1,
        limit: 100,
        owner: this.obser.waxname,
        collection_name: 'diggersworld',
        schema_name: 'tools'
      }).then((res) => {
        this.rows = res.data;
        this.loading = false;
      });
    },
    // 装备
    carry(row) {
      sendMessage({
        type: 'run',
        data: {
          stake: [row]
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.atom-table {
  .atom-header {
    display: flex;
    > .el-button {
      margin-left: auto;
    }
  }
}
</style>
