<template>
  <div class="diggers-preview">
    <el-tabs value="game">
      <el-tab-pane label="工具" name="game">
        <GameTable></GameTable>
      </el-tab-pane>
      <el-tab-pane label="背包" name="atom">
        <AtomTable></AtomTable>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { obser } from '@/store/light';

import GameTable from './game/table.vue';
import AtomTable from './atom/table.vue';

export default {
  components: { AtomTable, GameTable },
  name: 'Diggers',
  data() {
    return {
      obser
    };
  },
  created() {
  },
  methods: {}
};
</script>
<style lang="scss" scoped></style>
