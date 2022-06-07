<template>
  <div class="preview">
    <div class="preview-header">
      {{ waxname }}
      <el-button
        size="mini"
        type="primary"
        icon="el-icon-document-copy"
        @click="copyName"
      ></el-button>
    </div>
    <el-tabs value="game" v-if="obser.waxname">
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
import AtomTable from './atom/table.vue';
import GameTable from './game/table.vue';

export default {
  components: { AtomTable, GameTable },
  data() {
    return {
      obser
    };
  },
  computed: {
    waxname() {
      if (this.obser.waxname) {
        return `账户名称: [ ${this.obser.waxname} ]`;
      }
      return '账号为空';
    }
  },
  created() {
    Object.entries(this.$route.query).forEach(([key, val]) => {
      key && (this.obser[key] = val);
    });
    if (!this.obser.waxname) {
      location.href += '?waxname=j4vym.wam&tables=tools&gamename=diggerswgame&';
      location.reload();
      return;
    }

    if (localStorage.getItem('waxConfig')) {
      const config = JSON.parse(localStorage.getItem('waxConfig'));
      this.obser.waxConfig.isOpen = Number(config.isOpen);
      this.obser.waxConfig.repirType = Number(config.repirType);
    }
  },
  methods: {
    copyName() {
      if (this.obser.waxname) {
        const input = document.createElement('textarea');
        document.body.appendChild(input);
        input.value = this.obser.waxname;
        input.select();
        document.execCommand('copy', true);
        document.body.removeChild(input);
        this.$message.success('复制名称成功');
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.preview {
  padding: 16px;
  max-width: 900px;
  margin: 0 auto;
  .preview-header {
    display: flex;
    align-items: center;
    font-size: 24px;
    >.el-button{
      margin-left: 4px;
    }
  }
}
</style>
