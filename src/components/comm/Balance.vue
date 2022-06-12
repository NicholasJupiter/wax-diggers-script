<template>
  <div class="container">
    <div class="head">
      <el-button
        size="mini"
        @click="getBalances"
        :disabled="loading"
        type="text"
        icon="el-icon-refresh"
      >
        刷新数据
      </el-button>
      <el-button type="text" size="mini" @click="visible = true">划转</el-button>
    </div>
    <div class="balance" v-loading="loading">
      <div class="content">
        <span>钱包</span>
        <span>币种</span>
        <span>游戏内</span>
      </div>
      <div class="amount-item" v-for="item of balances" :key="item.icon">
        <span>{{ item.token }}</span>
        <span><img :src="item.icon" /></span>
        <span>{{ item.game }}</span>
      </div>
    </div>
    <TransferDialog v-model="visible" :balances="balances"></TransferDialog>
  </div>
</template>
<script>
import { handleSubs } from '@/store/light';
import TransferDialog from './TransferDialog.vue';

export default {
  components: { TransferDialog },
  data() {
    return {
      loading: false,
      visible: false,
      balances: []
    };
  },
  props: {
    fn: {
      type: Function,
    }
  },
  async created() {
    this.getBalances();
    handleSubs.push(this.getBalances.bind(this));
  },
  methods: {
    async getBalances() {
      this.loading = true;
      if (this.fn) {
        this.balances = await this.fn();
      }
      this.loading = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  min-width: 250px;
  border: 1px solid #ebeef5;
  padding: 12px;
  border-radius: 4px;
  &:hover {
    box-shadow: 0 0 10px rgb(204 204 204 / 50%);
  }
  span {
    display: inline-block;
    width: 33%;
    text-align: center;
    font-size: 14px;
    img {
      width: 24px;
      height: 24px;
      object-fit: contain;
      vertical-align: middle;
    }
  }
  .footer {
    text-align: center;
  }
}
</style>
