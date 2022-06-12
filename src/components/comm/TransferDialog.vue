<template>
  <div class="transfer-dialog">
    <el-dialog
      title="提现、充值"
      custom-class="transfer-dialog"
      append-to-body
      :visible.sync="selfVisible"
      width="80%"
    >
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="充值" name="token"> </el-tab-pane>
        <el-tab-pane label="提现" name="game"> </el-tab-pane>
      </el-tabs>

      <div class="inputs">
        <div class="item" v-for="item of balances" :key="item.icon">
          <img :src="item.icon" class="icon" />
          <el-input-number
            v-model="form[item.name]"
            controls-position="right"
            :min="0"
            :max="Number(item[activeName])"
            :placeholder="item.name"
          ></el-input-number>
          <el-button type="text" @click="form[item.name] = Number(item[activeName])">
            （MAX {{ item[activeName] + ' ' + item.name }}）
          </el-button>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="selfVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { sendMessage } from '@/utils/util';
export default {
  name: 'ConfigDialog',
  data() {
    return {
      activeName: 'token',
      form: {}
    };
  },
  props: {
    value: {
      type: Boolean,
      required: true
    },
    balances: {
      type: Array
    }
  },
  watch: {
    balances(val) {
      if (Array.isArray(val)) {
        this.formarValue();
      }
    },
    activeName() {
      this.formarValue();
    }
  },
  computed: {
    type() {
      return this.activeName === 'token' ? 'deposit' : 'withdraw';
    },
    selfVisible: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      }
    }
  },
  created() {},
  methods: {
    formarValue() {
      this.balances.forEach((item) => {
        this.$set(this.form, item.name, 0);
      });
    },
    confirm() {
      sendMessage({ type: 'run', data: { [this.type]: [this.form] } });
      this.$message.success('执行操作!');
      this.selfVisible = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.transfer-dialog {
  .inputs {
    // width: 200px;
    > .item {
      display: flex;
      align-items: center;
      margin-top: 4px;
      > .el-input-number {
        width: 200px;
        margin: 0 12px;
      }
    }
  }
  .icon {
    vertical-align: middle;
    width: 24px;
    height: 24px;
    object-fit: contain;
    flex-shrink: 0;
  }
}
</style>
